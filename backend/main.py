import os
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import shutil
from predict_nodule import predict_image

app = FastAPI()

# Allow your React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Nodule detection API running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    suffix = file.filename.split('.')[-1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{suffix}") as tmp:
        shutil.copyfileobj(file.file, tmp)
        temp_path = tmp.name

    try:
        result = predict_image(temp_path)
    finally:
        # Clean up temporary file
        tmp.close()
        os.remove(temp_path)

    return result
