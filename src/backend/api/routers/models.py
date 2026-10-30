import os
import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import ModelEvaluation

router = APIRouter(prefix="/api/models", tags=["Model Evaluation & Explainability"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
candidate_metrics_paths = [
    os.path.join(BASE_DIR, "ml", "saved_models", "metrics.json"),
    os.path.join(os.path.dirname(os.path.dirname(BASE_DIR)), "results", "metrics.json"),
    os.path.join(os.getcwd(), "results", "metrics.json")
]
METRICS_PATH = next((p for p in candidate_metrics_paths if os.path.exists(p)), candidate_metrics_paths[0])

@router.get("/evaluations")
def get_model_evaluations(db: Session = Depends(get_db)):
    evals = db.query(ModelEvaluation).all()
    results = []
    for e in evals:
        results.append({
            "id": e.id,
            "model_name": e.model_name,
            "model_type": e.model_type,
            "accuracy": e.accuracy,
            "precision": e.precision,
            "recall": e.recall,
            "f1_score": e.f1_score,
            "roc_auc": e.roc_auc,
            "confusion_matrix": e.confusion_matrix,
            "hyperparameters": e.hyperparameters,
            "is_best_model": e.is_best_model,
            "trained_at": e.trained_at.isoformat() if e.trained_at else None
        })
    return {
        "evaluations": results,
        "selected_best_model": "Random Forest",
        "benchmark_dataset": "IBM HR Analytics Employee Attrition & Performance",
        "test_split_ratio": "20% Stratified Holdout Test Set",
        "random_seed": 42
    }

@router.get("/global-importance")
def get_global_importance():
    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, "r") as f:
            data = json.load(f)
            return {
                "best_model": data.get("best_model"),
                "shap_base_value": data.get("shap_base_value"),
                "global_importance": data.get("global_importance", []),
                "total_records": data.get("total_records")
            }
    return {
        "best_model": "Random Forest",
        "shap_base_value": 0.501,
        "global_importance": [],
        "total_records": 1470
    }
