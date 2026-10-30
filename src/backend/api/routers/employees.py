from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from database.database import get_db
from database.models import Employee, Prediction, RetentionAction

router = APIRouter(prefix="/api/employees", tags=["Employees"])

@router.get("")
def list_employees(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    department: Optional[str] = None,
    job_role: Optional[str] = None,
    risk_category: Optional[str] = None,
    over_time: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = Query("probability", pattern="^(probability|monthly_income|age|years_at_company|name)$"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    query = db.query(Employee).join(Prediction)

    if department and department != "All":
        query = query.filter(Employee.department == department)
    if job_role and job_role != "All":
        query = query.filter(Employee.job_role == job_role)
    if risk_category and risk_category != "All":
        query = query.filter(Prediction.risk_category == risk_category)
    if over_time and over_time != "All":
        query = query.filter(Employee.over_time == over_time)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Employee.full_name.ilike(search_pattern),
                Employee.employee_number.ilike(search_pattern),
                Employee.email.ilike(search_pattern),
                Employee.job_role.ilike(search_pattern)
            )
        )

    # Sorting
    if sort_by == "probability":
        order_col = Prediction.attrition_probability
    elif sort_by == "monthly_income":
        order_col = Employee.monthly_income
    elif sort_by == "age":
        order_col = Employee.age
    elif sort_by == "years_at_company":
        order_col = Employee.years_at_company
    else:
        order_col = Employee.full_name

    if sort_order == "desc":
        query = query.order_by(desc(order_col))
    else:
        query = query.order_by(asc(order_col))

    total = query.count()
    offset = (page - 1) * page_size
    records = query.offset(offset).limit(page_size).all()

    items = []
    for emp in records:
        pred = emp.prediction
        items.append({
            "id": emp.id,
            "employee_number": emp.employee_number,
            "full_name": emp.full_name,
            "email": emp.email,
            "avatar_url": emp.avatar_url,
            "department": emp.department,
            "job_role": emp.job_role,
            "age": emp.age,
            "gender": emp.gender,
            "monthly_income": emp.monthly_income,
            "over_time": emp.over_time,
            "years_at_company": emp.years_at_company,
            "actual_attrition": emp.actual_attrition,
            "risk_score": round(pred.attrition_probability * 100, 1) if pred else 0.0,
            "risk_category": pred.risk_category if pred else "Unknown",
            "top_risk_driver": pred.top_positive_factors[0]["feature"] if (pred and pred.top_positive_factors) else None
        })

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }

@router.get("/filters")
def get_filter_options(db: Session = Depends(get_db)):
    departments = [d[0] for d in db.query(Employee.department).distinct().all()]
    roles = [r[0] for r in db.query(Employee.job_role).distinct().all()]
    return {
        "departments": ["All"] + sorted(departments),
        "job_roles": ["All"] + sorted(roles),
        "risk_categories": ["All", "High", "Medium", "Low"],
        "overtime_options": ["All", "Yes", "No"]
    }

@router.get("/{employee_id}")
def get_employee_detail(employee_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    pred = emp.prediction
    actions = db.query(RetentionAction).filter(RetentionAction.employee_id == employee_id).all()

    return {
        "id": emp.id,
        "employee_number": emp.employee_number,
        "full_name": emp.full_name,
        "email": emp.email,
        "avatar_url": emp.avatar_url,
        
        "demographics": {
            "age": emp.age,
            "gender": emp.gender,
            "marital_status": emp.marital_status,
            "distance_from_home": emp.distance_from_home,
            "education": emp.education,
            "education_field": emp.education_field
        },
        "job": {
            "department": emp.department,
            "job_role": emp.job_role,
            "job_level": emp.job_level,
            "business_travel": emp.business_travel,
            "job_involvement": emp.job_involvement
        },
        "compensation": {
            "monthly_income": emp.monthly_income,
            "daily_rate": emp.daily_rate,
            "hourly_rate": emp.hourly_rate,
            "monthly_rate": emp.monthly_rate,
            "percent_salary_hike": emp.percent_salary_hike,
            "stock_option_level": emp.stock_option_level
        },
        "workload_satisfaction": {
            "over_time": emp.over_time,
            "work_life_balance": emp.work_life_balance,
            "environment_satisfaction": emp.environment_satisfaction,
            "job_satisfaction": emp.job_satisfaction,
            "relationship_satisfaction": emp.relationship_satisfaction,
            "performance_rating": emp.performance_rating
        },
        "tenure": {
            "total_working_years": emp.total_working_years,
            "years_at_company": emp.years_at_company,
            "years_in_current_role": emp.years_in_current_role,
            "years_since_last_promotion": emp.years_since_last_promotion,
            "years_with_curr_manager": emp.years_with_curr_manager,
            "num_companies_worked": emp.num_companies_worked,
            "training_times_last_year": emp.training_times_last_year
        },
        "ground_truth": {
            "actual_attrition": emp.actual_attrition
        },
        "prediction": {
            "risk_score_pct": round(pred.attrition_probability * 100, 1) if pred else 0.0,
            "probability": pred.attrition_probability if pred else 0.0,
            "risk_category": pred.risk_category if pred else "Unknown",
            "shap_base_value": pred.shap_base_value if pred else 0.5,
            "top_positive_factors": pred.top_positive_factors if pred else [],
            "top_negative_factors": pred.top_negative_factors if pred else [],
            "recommendations": pred.retention_recommendations if pred else [],
            "assessed_at": pred.assessed_at.isoformat() if pred and pred.assessed_at else None
        },
        "retention_actions": [
            {
                "id": act.id,
                "title": act.title,
                "action_type": act.action_type,
                "priority": act.priority,
                "status": act.status,
                "assigned_hr": act.assigned_hr,
                "notes": act.notes,
                "target_date": act.target_date,
                "created_at": act.created_at.isoformat() if act.created_at else None
            } for act in actions
        ]
    }
