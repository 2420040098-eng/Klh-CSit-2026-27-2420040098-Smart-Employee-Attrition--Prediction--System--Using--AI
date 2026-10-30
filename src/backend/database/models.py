from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from .database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_number = Column(String(50), unique=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(120), unique=True, index=True)
    avatar_url = Column(String(255), nullable=True)

    # Demographic & Personal
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    marital_status = Column(String(30), nullable=False)
    distance_from_home = Column(Integer, nullable=False)
    education = Column(Integer, nullable=False)
    education_field = Column(String(50), nullable=False)

    # Job & Organization
    department = Column(String(80), nullable=False, index=True)
    job_role = Column(String(80), nullable=False, index=True)
    job_level = Column(Integer, nullable=False)
    business_travel = Column(String(50), nullable=False)
    job_involvement = Column(Integer, nullable=False)

    # Compensation & Financial
    monthly_income = Column(Float, nullable=False)
    daily_rate = Column(Integer, nullable=False)
    hourly_rate = Column(Integer, nullable=False)
    monthly_rate = Column(Integer, nullable=False)
    percent_salary_hike = Column(Integer, nullable=False)
    stock_option_level = Column(Integer, nullable=False)

    # Workload & Satisfaction
    over_time = Column(String(10), nullable=False)
    work_life_balance = Column(Integer, nullable=False)
    environment_satisfaction = Column(Integer, nullable=False)
    job_satisfaction = Column(Integer, nullable=False)
    relationship_satisfaction = Column(Integer, nullable=False)
    performance_rating = Column(Integer, nullable=False)

    # Tenure & Experience
    total_working_years = Column(Integer, nullable=False)
    years_at_company = Column(Integer, nullable=False)
    years_in_current_role = Column(Integer, nullable=False)
    years_since_last_promotion = Column(Integer, nullable=False)
    years_with_curr_manager = Column(Integer, nullable=False)
    num_companies_worked = Column(Integer, nullable=False)
    training_times_last_year = Column(Integer, nullable=False)

    # Ground truth
    actual_attrition = Column(String(10), nullable=False)

    # Relationships
    prediction = relationship("Prediction", back_populates="employee", uselist=False, cascade="all, delete-orphan")
    retention_actions = relationship("RetentionAction", back_populates="employee", cascade="all, delete-orphan")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), unique=True, nullable=False)
    
    attrition_probability = Column(Float, nullable=False)  # 0.0 to 1.0
    predicted_label = Column(Integer, nullable=False)       # 0 or 1
    risk_category = Column(String(20), nullable=False, index=True)  # 'Low', 'Medium', 'High'
    shap_base_value = Column(Float, nullable=True)

    # JSON lists containing feature contribution objects: {"feature": "OverTime", "value": "Yes", "shap": 0.42, "direction": "increases_risk", "interpretation": "..."}
    top_positive_factors = Column(JSON, nullable=True)  # Factors pushing risk UP
    top_negative_factors = Column(JSON, nullable=True)  # Protective factors keeping risk DOWN
    
    retention_recommendations = Column(JSON, nullable=True)
    assessed_at = Column(DateTime, default=datetime.utcnow)

    employee = relationship("Employee", back_populates="prediction")


class RetentionAction(Base):
    __tablename__ = "retention_actions"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    
    action_type = Column(String(100), nullable=False)
    title = Column(String(200), nullable=False)
    priority = Column(String(20), default="Medium")  # 'Low', 'Medium', 'High', 'Critical'
    status = Column(String(30), default="Pending")    # 'Pending', 'In Progress', 'Completed', 'Under Review'
    assigned_hr = Column(String(100), default="HR Retention Team")
    notes = Column(Text, nullable=True)
    target_date = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    employee = relationship("Employee", back_populates="retention_actions")


class ModelEvaluation(Base):
    __tablename__ = "model_evaluations"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(80), nullable=False)
    model_type = Column(String(50), nullable=False)
    accuracy = Column(Float, nullable=False)
    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    roc_auc = Column(Float, nullable=False)
    confusion_matrix = Column(JSON, nullable=False)  # {"tp": ..., "tn": ..., "fp": ..., "fn": ...}
    hyperparameters = Column(JSON, nullable=True)
    is_best_model = Column(Boolean, default=False)
    trained_at = Column(DateTime, default=datetime.utcnow)
