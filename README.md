# DefectPrediction 🔍  
A machine learning system built using **GraphCodeBERT** to detect defective / vulnerable C/C++ functions based on the CodeXGLUE Devign dataset.

---

## 🚀 Project Overview
This project fine-tunes **GraphCodeBERT** on the **CodeXGLUE Defect Detection** dataset to classify code as:

- **Clean (0)** – no vulnerability found  
- **Defective (1)** – potential bug or vulnerability pattern

The system uses:

- ⚙️ GraphCodeBERT-base  
- 🎯 Balanced training with augmentation  
- ⚖️ Focal Loss  
- 📉 Layer-wise learning rate decay (LLRD)  
- 🪢 Early stopping  
- 📊 Full evaluation on test set + threshold optimization  
- 💻 A standalone inference script for local prediction

Use this repo to run predictions locally, or integrate the model into your own applications.

---

## 📦 Model
The full trained model is available here:

👉 **MODEL LINK (add your link here)**  
*(Paste your HuggingFace or Google Drive link)*

You can load it in Python using:

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification

model = AutoModelForSequenceClassification.from_pretrained("YOUR_MODEL_LINK")
tokenizer = AutoTokenizer.from_pretrained("YOUR_MODEL_LINK")
