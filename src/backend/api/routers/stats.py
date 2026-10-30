from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.database import get_db
from database.models import Employee, Prediction

router = APIRouter(prefix="/api/stats", tags=["Statistics"])

@router.get("")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_employees = db.query(Employee).count()
    
    # Historical Attrition Rate
    attrition_yes = db.query(Employee).filter(Employee.actual_attrition == "Yes").count()
    historical_attrition_rate = round((attrition_yes / total_employees) * 100, 2) if total_employees else 0.0

    # Risk Categories from Predictions
    high_risk_count = db.query(Prediction).filter(Prediction.risk_category == "High").count()
    medium_risk_count = db.query(Prediction).filter(Prediction.risk_category == "Medium").count()
    low_risk_count = db.query(Prediction).filter(Prediction.risk_category == "Low").count()

    # Average Predicted Probability
    avg_risk_score = db.query(func.avg(Prediction.attrition_probability)).scalar() or 0.0
    avg_risk_score = round(float(avg_risk_score) * 100, 2)

    # Risk Distribution Breakdown
    risk_distribution = [
        {"name": "Low Risk (<30%)", "count": low_risk_count, "color": "#10b981", "key": "Low"},
        {"name": "Medium Risk (30-59%)", "count": medium_risk_count, "color": "#f59e0b", "key": "Medium"},
        {"name": "High Risk (≥60%)", "count": high_risk_count, "color": "#ef4444", "key": "High"}
    ]

    # Department Breakdown
    dept_stats = []
    departments = db.query(Employee.department).distinct().all()
    for (dept,) in departments:
        dept_total = db.query(Employee).filter(Employee.department == dept).count()
        dept_attrition = db.query(Employee).filter(
            Employee.department == dept, Employee.actual_attrition == "Yes"
        ).count()
        
        # Predicted high risk in department
        dept_high_risk = db.query(Prediction).join(Employee).filter(
            Employee.department == dept, Prediction.risk_category == "High"
        ).count()
        
        dept_avg_prob = db.query(func.avg(Prediction.attrition_probability)).join(Employee).filter(
            Employee.department == dept
        ).scalar() or 0.0

        dept_stats.append({
            "department": dept,
            "total_employees": dept_total,
            "attrition_count": dept_attrition,
            "attrition_rate": round((dept_attrition / dept_total) * 100, 1) if dept_total else 0,
            "high_risk_count": dept_high_risk,
            "avg_risk_score": round(float(dept_avg_prob) * 100, 1)
        })

    # Overtime Risk Comparison
    ot_yes_count = db.query(Employee).filter(Employee.over_time == "Yes").count()
    ot_no_count = db.query(Employee).filter(Employee.over_time == "No").count()
    
    ot_yes_high = db.query(Prediction).join(Employee).filter(
        Employee.over_time == "Yes", Prediction.risk_category == "High"
    ).count()
    ot_no_high = db.query(Prediction).join(Employee).filter(
        Employee.over_time == "No", Prediction.risk_category == "High"
    ).count()

    overtime_comparison = [
        {
            "category": "Overtime Workers",
            "total": ot_yes_count,
            "high_risk": ot_yes_high,
            "high_risk_pct": round((ot_yes_high / ot_yes_count) * 100, 1) if ot_yes_count else 0
        },
        {
            "category": "Standard Hours",
            "total": ot_no_count,
            "high_risk": ot_no_high,
            "high_risk_pct": round((ot_no_high / ot_no_count) * 100, 1) if ot_no_count else 0
        }
    ]

    # Top vulnerable Job Roles
    role_stats = []
    roles = db.query(Employee.job_role).distinct().all()
    for (role,) in roles:
        role_total = db.query(Employee).filter(Employee.job_role == role).count()
        role_high = db.query(Prediction).join(Employee).filter(
            Employee.job_role == role, Prediction.risk_category == "High"
        ).count()
        role_avg = db.query(func.avg(Prediction.attrition_probability)).join(Employee).filter(
            Employee.job_role == role
        ).scalar() or 0.0

        role_stats.append({
            "role": role,
            "total": role_total,
            "high_risk": role_high,
            "avg_risk": round(float(role_avg) * 100, 1)
        })
    role_stats.sort(key=lambda x: x["avg_risk"], reverse=True)

    return {
        "kpi": {
            "total_employees": total_employees,
            "high_risk_count": high_risk_count,
            "medium_risk_count": medium_risk_count,
            "low_risk_count": low_risk_count,
            "historical_attrition_rate": historical_attrition_rate,
            "average_risk_score": avg_risk_score
        },
        "risk_distribution": risk_distribution,
        "department_analytics": dept_stats,
        "overtime_analytics": overtime_comparison,
        "top_vulnerable_roles": role_stats[:6]
    }
