import os
import joblib
import pandas as pd
import numpy as np
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import Employee, Prediction

router = APIRouter(prefix="/api/simulate", tags=["What-If Simulator"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODELS_DIR = os.path.join(BASE_DIR, "ml", "saved_models")

_model = None
_preprocessor = None
_explainer = None

def get_ml_artifacts():
    global _model, _preprocessor, _explainer
    if _model is None:
        _model = joblib.load(os.path.join(MODELS_DIR, "best_model.joblib"))
        _preprocessor = joblib.load(os.path.join(MODELS_DIR, "preprocessor.joblib"))
        _explainer = joblib.load(os.path.join(MODELS_DIR, "shap_explainer.joblib"))
    return _model, _preprocessor, _explainer

class SimulationRequest(BaseModel):
    employee_id: Optional[int] = None
    over_time: Optional[str] = None
    monthly_income: Optional[float] = None
    work_life_balance: Optional[int] = None
    job_satisfaction: Optional[int] = None
    environment_satisfaction: Optional[int] = None
    stock_option_level: Optional[int] = None
    distance_from_home: Optional[int] = None
    job_involvement: Optional[int] = None
    percent_salary_hike: Optional[int] = None
    years_in_current_role: Optional[int] = None
    custom_overrides: Optional[Dict[str, Any]] = None

@router.post("")
def run_what_if_simulation(req: SimulationRequest, db: Session = Depends(get_db)):
    model, preprocessor, explainer = get_ml_artifacts()
    
    # Base employee record
    if req.employee_id:
        emp = db.query(Employee).filter(Employee.id == req.employee_id).first()
        if not emp:
            raise HTTPException(status_code=404, detail="Employee not found")
        base_pred = emp.prediction
        original_prob = base_pred.attrition_probability if base_pred else 0.5
        original_cat = base_pred.risk_category if base_pred else "Medium"
        emp_dict = {
            "Age": emp.age,
            "BusinessTravel": emp.business_travel,
            "DailyRate": emp.daily_rate,
            "Department": emp.department,
            "DistanceFromHome": emp.distance_from_home,
            "Education": emp.education,
            "EducationField": emp.education_field,
            "EnvironmentSatisfaction": emp.environment_satisfaction,
            "Gender": emp.gender,
            "HourlyRate": emp.hourly_rate,
            "JobInvolvement": emp.job_involvement,
            "JobLevel": emp.job_level,
            "JobRole": emp.job_role,
            "JobSatisfaction": emp.job_satisfaction,
            "MaritalStatus": emp.marital_status,
            "MonthlyIncome": emp.monthly_income,
            "MonthlyRate": emp.monthly_rate,
            "NumCompaniesWorked": emp.num_companies_worked,
            "OverTime": emp.over_time,
            "PercentSalaryHike": emp.percent_salary_hike,
            "PerformanceRating": emp.performance_rating,
            "RelationshipSatisfaction": emp.relationship_satisfaction,
            "StockOptionLevel": emp.stock_option_level,
            "TotalWorkingYears": emp.total_working_years,
            "TrainingTimesLastYear": emp.training_times_last_year,
            "WorkLifeBalance": emp.work_life_balance,
            "YearsAtCompany": emp.years_at_company,
            "YearsInCurrentRole": emp.years_in_current_role,
            "YearsSinceLastPromotion": emp.years_since_last_promotion,
            "YearsWithCurrManager": emp.years_with_curr_manager
        }
    else:
        original_prob = 0.55
        original_cat = "Medium"
        emp_dict = {
            "Age": 32, "BusinessTravel": "Travel_Rarely", "DailyRate": 800, "Department": "Research & Development",
            "DistanceFromHome": 10, "Education": 3, "EducationField": "Life Sciences", "EnvironmentSatisfaction": 3,
            "Gender": "Male", "HourlyRate": 65, "JobInvolvement": 3, "JobLevel": 2, "JobRole": "Research Scientist",
            "JobSatisfaction": 2, "MaritalStatus": "Single", "MonthlyIncome": 4500, "MonthlyRate": 15000,
            "NumCompaniesWorked": 2, "OverTime": "Yes", "PercentSalaryHike": 12, "PerformanceRating": 3,
            "RelationshipSatisfaction": 3, "StockOptionLevel": 0, "TotalWorkingYears": 7, "TrainingTimesLastYear": 2,
            "WorkLifeBalance": 2, "YearsAtCompany": 4, "YearsInCurrentRole": 2, "YearsSinceLastPromotion": 1,
            "YearsWithCurrManager": 2
        }

    # Apply overrides
    simulated_dict = dict(emp_dict)
    if req.over_time is not None:
        simulated_dict["OverTime"] = req.over_time
    if req.monthly_income is not None:
        simulated_dict["MonthlyIncome"] = req.monthly_income
    if req.work_life_balance is not None:
        simulated_dict["WorkLifeBalance"] = req.work_life_balance
    if req.job_satisfaction is not None:
        simulated_dict["JobSatisfaction"] = req.job_satisfaction
    if req.environment_satisfaction is not None:
        simulated_dict["EnvironmentSatisfaction"] = req.environment_satisfaction
    if req.stock_option_level is not None:
        simulated_dict["StockOptionLevel"] = req.stock_option_level
    if req.distance_from_home is not None:
        simulated_dict["DistanceFromHome"] = req.distance_from_home
    if req.job_involvement is not None:
        simulated_dict["JobInvolvement"] = req.job_involvement
    if req.percent_salary_hike is not None:
        simulated_dict["PercentSalaryHike"] = req.percent_salary_hike
    if req.years_in_current_role is not None:
        simulated_dict["YearsInCurrentRole"] = req.years_in_current_role
    if req.custom_overrides:
        simulated_dict.update(req.custom_overrides)

    df_sim = pd.DataFrame([simulated_dict])
    X_sim_trans = preprocessor.transform(df_sim)
    
    sim_prob = float(model.predict_proba(X_sim_trans)[0, 1])
    
    if sim_prob < 0.30:
        sim_cat = "Low"
    elif sim_prob < 0.60:
        sim_cat = "Medium"
    else:
        sim_cat = "High"

    risk_reduction_pct = round((original_prob - sim_prob) * 100, 1)

    # SHAP for simulated case
    shap_vals = explainer.shap_values(X_sim_trans)
    if isinstance(shap_vals, list):
        row_shap = shap_vals[1][0]
    elif len(shap_vals.shape) == 3:
        row_shap = shap_vals[0, :, 1]
    else:
        row_shap = shap_vals[0]

    num_cols = [c for c in df_sim.columns if df_sim[c].dtype != "object" and str(df_sim[c].dtype) != "str"]
    cat_cols = [c for c in df_sim.columns if c not in num_cols]
    cat_feature_names = preprocessor.named_transformers_["cat"].get_feature_names_out(cat_cols).tolist()
    all_feature_names = num_cols + cat_feature_names

    top_drivers = []
    for fn, s in zip(all_feature_names, row_shap):
        top_drivers.append({
            "feature": fn,
            "shap": round(float(s), 4),
            "abs_shap": abs(float(s))
        })
    top_drivers.sort(key=lambda x: x["abs_shap"], reverse=True)

    return {
        "original_risk_score": round(original_prob * 100, 1),
        "original_category": original_cat,
        "simulated_risk_score": round(sim_prob * 100, 1),
        "simulated_category": sim_cat,
        "risk_delta": round(-risk_reduction_pct, 1),  # negative means risk dropped!
        "risk_reduction_percentage": risk_reduction_pct,
        "top_simulated_drivers": top_drivers[:6],
        "applied_adjustments": {k: simulated_dict[k] for k in simulated_dict if simulated_dict[k] != emp_dict[k]}
    }
