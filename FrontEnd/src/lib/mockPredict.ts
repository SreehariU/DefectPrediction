// GraphCodeBERT API integration
// Backend: http://localhost:8000 (FastAPI with your trained model)

export interface PredictionResult {
  label: "clean" | "defective";
  probability: number;
}

const API_URL = "http://localhost:8000";

export const mockPredict = async (code: string): Promise<PredictionResult> => {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze code. Is the backend running?");
  }

  return response.json();
};
