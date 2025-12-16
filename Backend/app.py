import torch
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
print("🔥 NEW VERSION OF app.py LOADED 🔥")

# ------------------------------------------------------------
# FASTAPI APP
# ------------------------------------------------------------
app = FastAPI(title="Defect Prediction API")

# ✅ CORS (safe for local development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------
# MODEL SETUP
# ------------------------------------------------------------
MODEL_DIR = "./final_graphcodebert_balanced_best"

print("Device set to use CPU")
device = -1  # CPU safe

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
model.eval()

pipe = pipeline(
    "text-classification",
    model=model,
    tokenizer=tokenizer,
    top_k=None,
    device=device
)

# ------------------------------------------------------------
# REQUEST SCHEMA
# ------------------------------------------------------------
class CodeInput(BaseModel):
    code: str

def safe_override(code: str):
    """
    Explicitly safe patterns that must NEVER be marked defective.
    """
    safe_patterns = [
        r"\bsnprintf\s*\(",
        r"\bstrncpy\s*\(",
        r"\bmemcpy\s*\(",
    ]

    for pattern in safe_patterns:
        if re.search(pattern, code):
            return True

    return False

# ------------------------------------------------------------
# 🔴 MANUAL DEFECT CHECKER (HIGHEST PRIORITY)
# ------------------------------------------------------------
def manual_defect_checker(code: str):
    """
    Guaranteed defects only.
    NO generic pointer rules.
    NO false positives.
    """

    rules = [
        # Buffer overflow APIs
        r"\bstrcpy\s*\(",
        r"\bgets\s*\(",

        # Dangerous sprintf (unbounded)
        r"\bsprintf\s*\(",

        # scanf %s without width
        r'\bscanf\s*\(\s*"%s',

        # Use-after-free (simple but safe)
        r"\bfree\s*\(\s*(\w+)\s*\).*?\1\s*\[",

        # Dangling pointer return
        r"return\s*&\s*\w+"
    ]

    for rule in rules:
        if re.search(rule, code, re.DOTALL):
            return True

    return False

# ------------------------------------------------------------
# 🟠 STATIC SAFETY CHECK (SECOND PRIORITY)
# ------------------------------------------------------------
SAFE_FUNCTIONS = ["snprintf", "strncpy", "memcpy"]

def static_safety_check(code: str):
    # If safe APIs are used, do NOT flag
    for fn in SAFE_FUNCTIONS:
        if fn in code:
            return False

    dangerous_patterns = [
        r"\bstrcpy\s*\(",
        r"\bgets\s*\(",
        r"\bsprintf\s*\(",
        r'\bscanf\s*\(\s*"%s',
    ]

    for pattern in dangerous_patterns:
        if re.search(pattern, code):
            return True

    return False
def structural_clean_override(code: str):
    """
    Detects common SAFE coding patterns.
    If matched, ML false positives are ignored.
    """

    safe_patterns = [
        r"\bif\s*\(\s*!\s*\w+\s*\)\s*return",           # null check (!p)
        r"\bif\s*\(\s*\w+\s*==\s*NULL\s*\)",            # p == NULL
        r"\bindex\s*<\s*0\s*\|\|\s*index\s*>=\s*\w+",  # bounds check
        r"\bmalloc\s*\(.*\)\s*;\s*if\s*\(\s*!\w+\s*\)", # malloc + check
        r"\bfree\s*\(\s*\w+\s*\)",                      # proper free
        r"\breturn\s+\w+\s*[\*\+\-\/]\s*\w+"            # simple arithmetic
    ]

    for pattern in safe_patterns:
        if re.search(pattern, code, re.DOTALL):
            return True

    return False


# ------------------------------------------------------------
# 🧠 CLASSIFICATION LOGIC (PRIORITY PIPELINE)
# ------------------------------------------------------------
def classify_one(code: str):

    # 🟢 0. SAFE API OVERRIDE
    if safe_override(code):
        return {
            "prediction": "clean",
            "clean_probability": 1.0,
            "defect_probability": 0.0,
            "decision_source": "safe_api_override"
        }

    # 🟢 0.5 STRUCTURAL CLEAN OVERRIDE  ← 🔥 NEW
    if structural_clean_override(code):
        return {
            "prediction": "clean",
            "clean_probability": 0.9,
            "defect_probability": 0.1,
            "decision_source": "structural_clean_override"
        }

    # 🔴 1. MANUAL DEFECT CHECKER
    if manual_defect_checker(code):
        return {
            "prediction": "defective",
            "clean_probability": 0.0,
            "defect_probability": 1.0,
            "decision_source": "manual_checker"
        }

    # 🟠 2. STATIC SAFETY CHECK
    static_flag = static_safety_check(code)

    # 🟡 3. ML MODEL
    out = pipe(code)[0]
    out = sorted(out, key=lambda d: d["label"])

    clean_prob = out[0]["score"]
    defect_prob = out[1]["score"]

    if static_flag:
        pred = "defective"
        source = "static_rule"
    elif defect_prob >= 0.60:
        pred = "defective"
        source = "ml_high_confidence"
    else:
        pred = "clean"
        source = "ml_low_confidence"

    return {
        "prediction": pred,
        "clean_probability": clean_prob,
        "defect_probability": defect_prob,
        "decision_source": source
    }

# ------------------------------------------------------------
# API ENDPOINT
# ------------------------------------------------------------
@app.post("/predict")
def predict(data: CodeInput):
    return classify_one(data.code)
