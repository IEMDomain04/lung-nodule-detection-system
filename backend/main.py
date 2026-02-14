import os
import importlib
import gdown  # <--- NEW IMPORT
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
# CONFIGURATION
# ============================================================
# We will download Google Drive files into this temp folder
CACHE_DIR = os.path.join(os.getcwd(), "google_drive_cache")
os.makedirs(CACHE_DIR, exist_ok=True)

class LibraryRequest(BaseModel):
    file_id: str  # We now expect a Google Drive ID, not a filename

# ============================================================
# HELPER: DOWNLOAD FROM GOOGLE DRIVE
# ============================================================
def get_file_from_drive(file_id: str):
    """
    Downloads file from Google Drive using ID.
    Caches it locally so we don't download it twice.
    """
    # Create a consistent filename based on ID
    output_path = os.path.join(CACHE_DIR, f"{file_id}.mha")
    
    # If we already downloaded it, skip download! (Faster)
    if os.path.exists(output_path):
        print(f"📂 Found cached file: {output_path}")
        return output_path

    print(f"⬇️ Downloading from Google Drive (ID: {file_id})...")
    try:
        # gdown handles the messy Google Drive URL logic for us
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
    # 1. Download/Get File
    file_path = get_file_from_drive(payload.file_id)
    
    if not file_path:
        return {"error": "Failed to download file from Google Drive."}

    # 2. Generate Preview
    try:
        if generate_preview:
            preview_image = generate_preview(file_path)
            return {"preview_image": preview_image}
        return {"error": "Preview generator not loaded"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/predict_from_library")
async def predict_from_library(payload: LibraryRequest):
    # 1. Download/Get File
    file_path = get_file_from_drive(payload.file_id)
    
    if not file_path:
        return {"error": "Failed to download file from Google Drive."}

    # 2. Predict
    try:
        result = predict_image(file_path)
        return result
    except Exception as e:
        return {"error": str(e)}

# ... (Keep your existing @app.post("/predict") and @app.post("/preview") logic here for local uploads) ...
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