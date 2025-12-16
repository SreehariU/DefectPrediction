# ■■ DefectPrediction
**AI-Powered Vulnerability Detection for C/C++ Code**
DefectPrediction is a full-stack machine learning web application that detects security vulnerabilitiesIt combines **manual safety rules**, **static heuristics**, and **deep learning inference** to reduce f---
## ■ Features
- ■ Detects common vulnerabilities:
 - Buffer overflows
 - Null pointer dereferences
 - Use-after-free
 - Out-of-bounds access
- ■ Fine-tuned **GraphCodeBERT** model
- ■ Manual rule-based checker (highest priority)
- ■ Structural clean overrides to reduce false positives
- ■ Full-stack application:
 - **FastAPI** backend
 - **React + Vite** frontend
- ■ Confidence-based predictions
- ■ Modern UI with integrated code editor
---
## ■ Project Structure
```
DefectPrediction/
■■■ Backend/
■ ■■■ app.py
■ ■■■ requirements.txt
■ ■■■ final_graphcodebert_balanced_best/ (download separately)
■■■ FrontEnd/
■ ■■■ src/
■ ■■■ package.json
■ ■■■ vite.config.ts
■■■ .gitignore
■■■ README.md
```
---
## ■ Model Information
- **Model**: GraphCodeBERT
- **Dataset**: CodeXGLUE Devign
- **Task**: Binary classification (Clean vs Defective)
- **Frameworks**: PyTorch, HuggingFace Transformers
> ■■ The trained model is **not included in this repository** due to size constraints.
---
## ■ Model Download (Required)
### ■ Download the trained model from Google Drive
■ **[PASTE YOUR GOOGLE DRIVE LINK HERE]**
### ■ Setup Steps
1. Download and extract:
 ```
 final_graphcodebert_balanced_best/
 ```
2. Place it inside:
 ```
 Backend/final_graphcodebert_balanced_best/
 ```
3. Ensure it contains:
 - `config.json`
 - `model.safetensors`
 - `tokenizer.json`
 - `tokenizer_config.json`
---
## ■■ Backend Setup (FastAPI)
```bash
cd Backend
python -m venv venv
source venv/bin/activate # macOS / Linux
venv\Scripts\activate # Windows
pip install -r requirements.txt
uvicorn app:app --reload
```
Backend URL: http://127.0.0.1:8000
API Docs: http://127.0.0.1:8000/docs
---
## ■ Frontend Setup (React + Vite)
```bash
cd FrontEnd
npm install
npm run dev
```
Frontend URL: http://localhost:5173
---
## ■ How It Works
```
Safe API Override
 ↓
Manual Defect Rules
 ↓
Static Safety Heuristics
 ↓
GraphCodeBERT Model (60% confidence threshold)
```
---
## ■ Decision Strategy
- **Manual rules** override everything
- **Structural clean overrides** suppress ML false positives
- ML inference only when rules are inconclusive
- Defective only if confidence ≥ **60%**
---
## ■■ Technologies Used
- **Backend**: FastAPI, PyTorch, HuggingFace Transformers
- **Frontend**: React, Vite, Tailwind CSS
- **Model**: GraphCodeBERT
- **Languages**: Python, TypeScript, C/C++
---
## ■ Notes
- Prioritizes **false-negative avoidance**
- Pointer-heavy clean code may still receive low confidence
- Rule-based overrides improve usability
---
## ■ License
Educational and research use only.
---
## ■ Author
**Sreehari U P**
GitHub: https://github.com/SreehariU