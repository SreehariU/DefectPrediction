# run_inference.py
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

MODEL_DIR = "./final_graphcodebert_balanced_best"

print("Device set to use CPU")
device = -1  # CPU recommended for mac unless you manually use MPS

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
model.eval()

# Create pipeline
pipe = pipeline(
    "text-classification",
    model=model,
    tokenizer=tokenizer,
    top_k=None,           # replaces return_all_scores=True
    device=device
)

# ------------------------------------------------------------
# 10 CLEAN SAMPLES + 10 DEFECTIVE SAMPLES
# ------------------------------------------------------------

clean_samples = [
    """int is_even(int x){ return x % 2 == 0; }""",
    """int abs_val(int x){ if(x<0) return -x; return x; }""",
    """void copy(char *dst, char *src){ while(*src) *dst++ = *src++; }""",
    """void overflow(){ char a[5]; strcpy(a, "this is too long"); }""",
    """void idx(int *a,int n){ for(int i=0;i<=n;i++) printf("%d",a[i]); }""",
    """void dangle(){ int *p; { int x=10; p=&x; } printf("%d",*p); }""",
    """void greet(){ printf("Welcome"); }""",
    """int mul(int a,int b){ return a*b; }"""
]


defective_samples = [
    """void bug(int *p){ int x = *p; }""",
    """void leak(){ int *p = malloc(10); }""",
    """int risky(int *p){ return *p + 10; }""",
    """void uaf(){ char *p = malloc(10); free(p); printf("%c", p[0]); }""",
    """void bad(){ int *p=NULL; *p=5; }""",
    """void oob(){ int a[3]={1,2,3}; return a[5]; }""",
    """void print_msg(){ printf("Hello"); }""",
    """int sum_arr(int *a, int n){ int s=0; for(int i=0;i<n;i++) s+=a[i]; return s; }"""
]


# ------------------------------------------------------------
# FUNCTION TO RUN BATCH INFERENCE
# ------------------------------------------------------------
def classify(code_list):
    outputs = pipe(code_list)
    results = []
    for out in outputs:
        # Sort by label index (LABEL_0, LABEL_1)
        out = sorted(out, key=lambda d: d['label'])
        clean_prob = out[0]['score']
        defect_prob = out[1]['score']
        pred = "defective" if defect_prob >= clean_prob else "clean"
        results.append((pred, defect_prob))
    return results


# ------------------------------------------------------------
# RUN PREDICTION ON BOTH SETS
# ------------------------------------------------------------
print("\n\n===== CLEAN SAMPLE RESULTS =====")
clean_results = classify(clean_samples)
for i, (pred, score) in enumerate(clean_results):
    print(f"{i+1:02d}. Predicted: {pred:10s} | Defect Score: {score:.4f}")

print("\n===== DEFECTIVE SAMPLE RESULTS =====")
def_results = classify(defective_samples)
for i, (pred, score) in enumerate(def_results):
    print(f"{i+1:02d}. Predicted: {pred:10s} | Defect Score: {score:.4f}")
