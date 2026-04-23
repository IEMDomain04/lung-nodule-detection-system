# 🫁 Lung Nodule Detection System

An AI-powered web application for detecting lung nodules in chest X-ray images using deep learning. This system provides automated classification with confidence scores and spatial attention heatmaps to visualize nodule locations.

---

## 📥 Installation

### Step 1: Clone the Repository
Open PowerShell or Terminal and run:
```powershell
git clone https://github.com/IEMDomain04/thoracic-disease-detection-system.git
```

```powershell
cd thoracic-disease-detection-system
```

### Step 2: Install Frontend Dependencies
Install the required JavaScript packages:
```powershell
npm install
```
*This will install React, Vite, and all frontend libraries.*

### Step 3: Set Up Python Virtual Environment

**Change directory to backend folder**
```powershell
cd backend
```

Create and activate a Python virtual environment for the backend:
**For Windows (PowerShell):**
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

**For Windows (CMD):**
```cmd
python -m venv .venv
.venv\Scripts\activate.bat
```

**For Mac/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

*You should see `(.venv)` appear at the start of your command line.*

### Step 4: Install Backend Dependencies
With the virtual environment activated, install Python packages:
```powershell
pip install -r requirements.txt
```
*This installs PyTorch, FastAPI, SimpleITK, and other backend libraries.*

### Step 5: Add Model Files
Place your trained model files in the `backend/` folder:
- `resnet50-baseline-nodule.pth` (baseline classification model)
- `best_wsod_resnet50.pth` (spatial attention model with heatmap)

*If you don't have these files, contact the repository maintainers.*

---

## 🚀 Running the Application

You need to run **both** the frontend and backend servers simultaneously.

### Option 1: Using Two Terminal Windows (Recommended for Beginners)

#### Terminal 1 - Frontend
```powershell
npm run dev
```
**Expected output:**
```
➜  Local:   http://localhost:5173/
```
Keep this terminal open!

#### Terminal 2 - Backend
Open a **new** terminal window, then:

**1. Navigate to backend folder:**
```powershell
cd backend
```

**2. Activate virtual environment:**
```powershell
.venv\Scripts\activate
```

**3. Choose your model and start the server:**

**For baseline model (classification only):**
```powershell
$env:PREDICT_MODULE = 'predict_nodule'
uvicorn main:app --reload
```

**For spatial attention model (classification + heatmap):**
```powershell
$env:PREDICT_MODULE = 'predict_nodule_spatial'
uvicorn main:app --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
✓ Loaded predictor: predict_nodule_spatial.predict_image
```

You're good to go!

## 📄 License

This project is a thesis for 

---

**Happy Detecting! 🫁✨**

