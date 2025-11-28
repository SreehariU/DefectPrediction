
# 🛠️ DefectPrediction – GraphCodeBERT-Based Vulnerability Detection

This project uses **GraphCodeBERT**, fine-tuned on the **CodeXGLUE / Devign Defect Detection dataset**, to classify C/C++ functions as:

- **Clean (0)** – Non-defective  
- **Defective (1)** – Likely vulnerable or risky  

The goal is to build a practical, developer-friendly tool that can detect potential code defects using state-of-the-art transformer models.

---

## 🚀 Features

- ✔ Fine-tuned **GraphCodeBERT-base** model  
- ✔ Local inference using Python  
- ✔ Batch prediction (clean + defective examples)  
- ✔ Terminal-friendly output  
- ✔ Ready for dataset evaluation, integration into CI, or further fine-tuning  

---

## 🔧 Model Download

👉 **MODEL DOWNLOAD LINK:**  
https://drive.google.com/file/d/1Q3_x5eaYQ-jlntAgGuo9sau5Kic-P5r8/view?usp=sharing

Place the downloaded model folder inside your project like this:

```
DefectPrediction/
│
├── final_graphcodebert_balanced_best/
│   ├── config.json
│   ├── model.safetensors
│   ├── vocab.json
│   ├── tokenizer.json
│   ├── merges.txt
│   └── ...
│
├── run_inference.py
├── requirements.txt
└── README.md
```

---

## 📦 Installation

```bash
git clone https://github.com/SreehariU/DefectPrediction
cd DefectPrediction

python3 -m venv env
source env/bin/activate

pip install -r requirements.txt
```

---

## ▶️ Running Inference

Modify or use `run_inference.py`:

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import torch

MODEL_DIR = "./final_graphcodebert_balanced_best"

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)

pipe = pipeline(
    "text-classification",
    model=model,
    tokenizer=tokenizer,
    top_k=None,
    device=-1
)

sample_code = """ 
void swap(int *a, int *b){ int t=*a; *a=*b; *b=t; }
"""

out = pipe(sample_code)[0]
clean_prob = out[0]["score"]
defect_prob = out[1]["score"]
prediction = "defective" if defect_prob > clean_prob else "clean"

print("Prediction:", prediction)
print("Defect probability:", defect_prob)
```

Run:

```bash
python run_inference.py
```

---

## 🔍 Batch Testing

`run_inference.py` also includes batch testing of 10 clean + 10 defective samples.

---

## 🧠 Dataset

Trained on:

- **CodeXGLUE – C/C++ Defect Detection (Devign)**  

Each sample contains:

- `func` → raw function code  
- `target` → 0 (clean) or 1 (defective)

---

## 🤝 Contributing

PRs welcome!  
Ask for:  
- Gradio UI  
- FastAPI server  
- Evaluation tools  
- More datasets  

