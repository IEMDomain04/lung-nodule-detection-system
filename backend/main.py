import os
import importlib
import gdown
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
import shutil

# ============================================================
# DYNAMIC MODULE LOADING
# ============================================================
ALLOWED_MODULES = {"predict_nodule", "predict_nodule_spatial"}
PREDICT_MODULE = os.getenv("PREDICT_MODULE", "predict_nodule_spatial")

try:
    predictor_module = importlib.import_module(PREDICT_MODULE)
    predict_image = predictor_module.predict_image
    
    if hasattr(predictor_module, 'generate_preview'):
        generate_preview = predictor_module.generate_preview
    else:
        generate_preview = None
except Exception as e:
    raise RuntimeError(f"Failed to import {PREDICT_MODULE}: {e}")

# ============================================================
# CONFIGURATION & SECURITY WHITELIST
# ============================================================
CACHE_DIR = os.path.join(os.getcwd(), "google_drive_cache")
os.makedirs(CACHE_DIR, exist_ok=True)

# 🔥 THE SECURITY WALL: The backend securely holds the real IDs.
SECURE_DRIVE_MAP = {
    "case_01": "1pYHKfeMJqkhP2gEbBvYfWX72MIpVQjgc",
    "case_02": "17XjpkVVSNPz1jl5cpbRyRJt955YCl2Nj",
    "case_03": "1Z5gNQsuj3bln5o1m5kHlF2eiYAVIOiyd",
    "case_04": "1lm8HWCWHQPbr2aUCwCGioC22_2bSBECW",
    "case_05": "1Mo8Q5Anau-ifbkg09yATXzNGCWJw1jFO",
    "case_06": "1azMlnumJmy6JFt30gSv0RjPzJW2-vlM3",
    "case_07": "1KS4TJyOFnHTf43R_xU-91L4NxT_jV_Ve",
    "case_08": "1Jlc9_AMa3B3Zs_zKUmqCNfsWynI4p3sW",
    "case_09": "1tSSQfwF4_BGtVY-zucurUDpnfKdTeo3d",
    "case_10": "1t0DGSeCh1quz7z00F0G6eaNp8pGStRVs",
    "case_11": "18MkiftJpEsVOILJY5n26DMFRKDX75y3M",
    "case_12": "1b9jtZY7ORbrGUqpXeCxiwc7lzxLH86oK",
    "case_13": "1ihW8Tsxp-QdkLaEM_D_xT-kBdrDtDXA3",
    "case_14": "1AkMqmWWVPzQx71z8t9dCZvQxBAK4Nmzt",
    "case_15": "1tMTHaXY7OpTHVcRR1kYg1648Bs5DR89e",
    "case_16": "14m627OyHmPamW_HqRGwNIJaV3PBr8rGL",
    "case_17": "11qkmGDwYNql-QTcXwTtx0i2Ja2TvEM5j",
    "case_18": "1lYaHsjnUH5FgIPai3POp3YufnswvbQ-K",
    "case_19": "1vbGUmAkIIlo4tOhyXE3piMY5S6-726mG",
    "case_20": "1X2R-lTkuBxrLSWkAuBfOeemXqA0N7tti",
    "case_21": "18HXDGRfOxlGAyjWoFUyKACpYWcv85PcM",
    "case_22": "109BD8fTamyh1aRI48EBFmDCFXkflYnmv",
    "case_23": "1sVKGDMwyBXKiuJH-jDD_sl3H3LNXZ35g",
    "case_24": "15ZtwezC2GaJdXhw1lQO6wxkhxbPgVyj2",
    "case_25": "1A7R2qV0q6f75QkU_aLvQ4NRsy8Fw69kj",
    "case_26": "1-vpWTDg9BdnFd-wFFvOXw1UvCsxBI1h5",
    "case_27": "14iYlWdCr7Ug8_CpstoqfN-Z9f2AuFBSY",
    "case_28": "1spcV9FntK0qV8C0yJ7VYnlc-_VFTymqE",
    "case_29": "1l-r8NYyx-8oPXMKgbk4F7NQO4i0AP20P",
    "case_30": "1td7zp4QZ_0Qp0SFLm0k81jsLYnXrYlTj",
    "case_31": "1ZQWpAqqd118E7XgXlhYiH7CtQXTytIGg",
    "case_32": "1bvXKf8MOseQH4veTMPcA5MC3MqE3GRVL",
    "case_33": "1BxUXEht_wdO-AodQCxRHvn3r2FVEABtF",
    "case_34": "1-bVKo6H5afEzgxH-jCp0SX8Wb9IFB53n",
    "case_35": "1DaUanfyA1UcZX12GNKFSEQMgfmWa8M1r",
    "case_36": "1b_Ujqq4hH14wA6c46XygWxAuMijg3Hmv"
}

class LibraryRequest(BaseModel):
    case_id: str  # We now expect a case_id (e.g. "case_01"), NOT a file ID

# ============================================================
# HELPER: DOWNLOAD FROM GOOGLE DRIVE
# ============================================================
def get_file_from_drive(file_id: str):
    """
    Downloads file from Google Drive using ID.
    Caches it locally so we don't download it twice.
    """
    output_path = os.path.join(CACHE_DIR, f"{file_id}.mha")
    
    if os.path.exists(output_path):
        print(f"📂 Found cached file: {output_path}")
        return output_path

    print(f"⬇️ Downloading from Google Drive (ID: {file_id})...")
    try:
        url = f'https://drive.google.com/uc?id={file_id}'
        gdown.download(url, output_path, quiet=False)
        return output_path
    except Exception as e:
        print(f"❌ Download failed: {e}")
        return None

# ============================================================
# FASTAPI APP
# ============================================================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/preview_from_library")
async def preview_from_library(payload: LibraryRequest):
    # 🔥 1. SECURITY VALIDATION
    if payload.case_id not in SECURE_DRIVE_MAP:
        return {"error": "Unauthorized or invalid Case ID."}, 403

    # 🔥 2. LOOKUP
    real_drive_id = SECURE_DRIVE_MAP[payload.case_id]

    # 3. Download/Get File
    file_path = get_file_from_drive(real_drive_id)
    
    if not file_path:
        return {"error": "Failed to download file from Google Drive."}

    # 4. Generate Preview
    try:
        if generate_preview:
            preview_image = generate_preview(file_path)
            return {"preview_image": preview_image}
        return {"error": "Preview generator not loaded"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/predict_from_library")
async def predict_from_library(payload: LibraryRequest):
    # 🔥 1. SECURITY VALIDATION
    if payload.case_id not in SECURE_DRIVE_MAP:
        return {"error": "Unauthorized or invalid Case ID."}, 403

    # 🔥 2. LOOKUP
    real_drive_id = SECURE_DRIVE_MAP[payload.case_id]

    # 3. Download/Get File
    file_path = get_file_from_drive(real_drive_id)
    
    if not file_path:
        return {"error": "Failed to download file from Google Drive."}

    # 4. Predict
    try:
        result = predict_image(file_path)
        return result
    except Exception as e:
        return {"error": str(e)}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    suffix = file.filename.split('.')[-1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{suffix}") as tmp:
        shutil.copyfileobj(file.file, tmp)
        temp_path = tmp.name
    try:
        result = predict_image(temp_path)
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
    return result

@app.post("/preview")
async def preview(file: UploadFile = File(...)):
    suffix = file.filename.split('.')[-1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{suffix}") as tmp:
        shutil.copyfileobj(file.file, tmp)
        temp_path = tmp.name
    try:
        if generate_preview:
            preview_img = generate_preview(temp_path)
            result = {"preview_image": preview_img}
        else:
            result = {"error": "Preview not available"}
    except Exception as e:
        result = {"error": str(e)}
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
    return result