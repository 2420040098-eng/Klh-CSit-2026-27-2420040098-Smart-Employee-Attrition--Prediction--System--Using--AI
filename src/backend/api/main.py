import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure backend root is on sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from api.routers import stats, employees, simulate, models, retention

app = FastAPI(
    title="Explainable Predictive Analytics for Employee Attrition Risk Assessment",
    description="HR Decision Support & Explainable AI (XAI) System powered by Machine Learning and SHAP",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stats.router)
app.include_router(employees.router)
app.include_router(simulate.router)
app.include_router(models.router)
app.include_router(retention.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Explainable HR Analytics API",
        "version": "1.0.0",
        "dataset": "IBM HR Analytics Employee Attrition & Performance",
        "records": 1470
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
