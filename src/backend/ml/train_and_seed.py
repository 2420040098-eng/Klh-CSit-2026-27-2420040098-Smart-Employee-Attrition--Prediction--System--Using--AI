import os
import sys
import json
import random
from datetime import datetime
import numpy as np
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
import shap

# Ensure backend root is on sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from database.database import engine, SessionLocal, Base
from database.models import Employee, Prediction, ModelEvaluation, RetentionAction

# First and last names for realistic mock HR profile rendering
FIRST_NAMES = [
    "Aarav", "Aditi", "Alexander", "Amara", "Carlos", "Chloe", "Daniel", "Deepa", 
    "Elena", "Ethan", "Fatima", "Gabriel", "Grace", "Hassan", "Isabella", "James", 
    "Kavita", "Liam", "Mei", "Michael", "Nina", "Oliver", "Priya", "Rahul", 
    "Rohan", "Samantha", "Samuel", "Siddharth", "Sophia", "Vikram", "Yuki", "Zoe"
]

LAST_NAMES = [
    "Patel", "Smith", "Johnson", "Sharma", "Williams", "Brown", "Jones", "Garcia", 
    "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", 
    "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", 
    "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson"
]

def generate_recommendations(top_pos_features, emp_data):
    recs = []
    feat_names = [f["feature"] for f in top_pos_features]
    
    if "OverTime" in feat_names or emp_data.get("OverTime") == "Yes":
        recs.append({
            "category": "Workload & Wellbeing",
            "priority": "High",
            "action": "Immediate workload rebalancing: cap overtime hours and explore project redistribution."
        })
    if "MonthlyIncome" in feat_names or emp_data.get("MonthlyIncome", 0) < 3500:
        recs.append({
            "category": "Compensation",
            "priority": "High",
            "action": "Conduct immediate market parity review and consider retention bonus / off-cycle compensation review."
        })
    if "JobSatisfaction" in feat_names or emp_data.get("JobSatisfaction", 4) <= 2:
        recs.append({
            "category": "Job Engagement",
            "priority": "Medium",
            "action": "Schedule confidential 1-on-1 career development check-in with department director."
        })
    if "WorkLifeBalance" in feat_names or emp_data.get("WorkLifeBalance", 4) <= 2:
        recs.append({
            "category": "Flexibility",
            "priority": "Medium",
            "action": "Offer hybrid / remote work schedule or flexible core hours policy."
        })
    if "YearsInCurrentRole" in feat_names or emp_data.get("YearsInCurrentRole", 0) >= 5:
        recs.append({
            "category": "Career Mobility",
            "priority": "Medium",
            "action": "Assess internal mobility and promotion pathways to prevent role stagnation."
        })
    if "EnvironmentSatisfaction" in feat_names or emp_data.get("EnvironmentSatisfaction", 4) <= 2:
        recs.append({
            "category": "Workplace Culture",
            "priority": "Low",
            "action": "Review team collaboration dynamics and workplace environment feedback."
        })
    if not recs:
        recs.append({
            "category": "Retention Care",
            "priority": "Low",
            "action": "Maintain regular pulse surveys and quarterly performance recognition check-ins."
        })
    return recs[:3]

def main():
    print("=" * 60)
    print("Starting Explainable AI Training & Database Seeding Pipeline")
    print("=" * 60)
    
    candidate_data_paths = [
        os.path.join(BASE_DIR, "data", "attrition_data.csv"),
        os.path.join(os.path.dirname(BASE_DIR), "data", "attrition_data.csv"),
        os.path.join(os.path.dirname(os.path.dirname(BASE_DIR)), "data", "attrition_data.csv"),
        os.path.join(os.getcwd(), "data", "attrition_data.csv"),
    ]
    data_path = next((p for p in candidate_data_paths if os.path.exists(p)), candidate_data_paths[0])
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}")
        
    df = pd.read_csv(data_path)
    print(f"Loaded dataset: {df.shape[0]} rows, {df.shape[1]} columns")
    
    # Preprocessing
    drop_cols = ["EmployeeCount", "Over18", "StandardHours", "EmployeeNumber"]
    y = (df["Attrition"] == "Yes").astype(int)
    X = df.drop(columns=["Attrition"] + drop_cols)
    
    cat_cols = ["BusinessTravel", "Department", "EducationField", "Gender", "JobRole", "MaritalStatus", "OverTime"]
    num_cols = [c for c in X.columns if c not in cat_cols]
    
    print(f"Numerical features ({len(num_cols)}): {num_cols}")
    print(f"Categorical features ({len(cat_cols)}): {cat_cols}")
    
    # 80/20 train/test stratified split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    preprocessor = ColumnTransformer([
        ("num", StandardScaler(), num_cols),
        ("cat", OneHotEncoder(drop="first", sparse_output=False, handle_unknown="ignore"), cat_cols)
    ])
    
    X_train_trans = preprocessor.fit_transform(X_train)
    X_test_trans = preprocessor.transform(X_test)
    X_all_trans = preprocessor.transform(X)
    
    cat_feature_names = preprocessor.named_transformers_["cat"].get_feature_names_out(cat_cols).tolist()
    all_feature_names = num_cols + cat_feature_names
    
    # Models to compare
    candidate_models = {
        "Logistic Regression": {
            "model": LogisticRegression(class_weight="balanced", max_iter=1000, random_state=42),
            "type": "Linear Classifier",
            "params": {"solver": "lbfgs", "class_weight": "balanced", "max_iter": 1000}
        },
        "Decision Tree": {
            "model": DecisionTreeClassifier(max_depth=5, class_weight="balanced", random_state=42),
            "type": "Tree Classifier",
            "params": {"criterion": "gini", "max_depth": 5, "class_weight": "balanced"}
        },
        "Random Forest": {
            "model": RandomForestClassifier(n_estimators=160, max_depth=8, class_weight="balanced", random_state=42),
            "type": "Ensemble Bagging",
            "params": {"n_estimators": 160, "max_depth": 8, "class_weight": "balanced"}
        },
        "Gradient Boosting": {
            "model": GradientBoostingClassifier(n_estimators=130, learning_rate=0.08, max_depth=4, random_state=42),
            "type": "Ensemble Boosting",
            "params": {"n_estimators": 130, "learning_rate": 0.08, "max_depth": 4}
        }
    }
    
    eval_results = []
    trained_models = {}
    best_name = "Random Forest"  # Balanced precision/recall and fast TreeSHAP support
    best_f1 = -1
    
    for name, cfg in candidate_models.items():
        m = cfg["model"]
        m.fit(X_train_trans, y_train)
        trained_models[name] = m
        
        preds = m.predict(X_test_trans)
        probs = m.predict_proba(X_test_trans)[:, 1]
        
        acc = float(accuracy_score(y_test, preds))
        prec = float(precision_score(y_test, preds, zero_division=0))
        rec = float(recall_score(y_test, preds, zero_division=0))
        f1 = float(f1_score(y_test, preds, zero_division=0))
        auc = float(roc_auc_score(y_test, probs))
        cm = confusion_matrix(y_test, preds)
        
        cm_dict = {
            "tn": int(cm[0, 0]),
            "fp": int(cm[0, 1]),
            "fn": int(cm[1, 0]),
            "tp": int(cm[1, 1])
        }
        
        print(f"\nModel: {name}")
        print(f"  Accuracy : {acc:.4f} | Precision: {prec:.4f} | Recall: {rec:.4f} | F1: {f1:.4f} | ROC-AUC: {auc:.4f}")
        print(f"  Confusion Matrix: TN={cm_dict['tn']}, FP={cm_dict['fp']}, FN={cm_dict['fn']}, TP={cm_dict['tp']}")
        
        eval_results.append({
            "name": name,
            "type": cfg["type"],
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1": round(f1, 4),
            "roc_auc": round(auc, 4),
            "confusion_matrix": cm_dict,
            "params": cfg["params"],
            "is_best": (name == best_name)
        })
    
    # Save best model and preprocessor
    models_dir = os.path.join(BASE_DIR, "ml", "saved_models")
    os.makedirs(models_dir, exist_ok=True)
    
    best_model = trained_models[best_name]
    joblib.dump(best_model, os.path.join(models_dir, "best_model.joblib"))
    joblib.dump(preprocessor, os.path.join(models_dir, "preprocessor.joblib"))
    
    # SHAP Explainer
    print("\nComputing SHAP Explainer on full dataset...")
    explainer = shap.TreeExplainer(best_model)
    joblib.dump(explainer, os.path.join(models_dir, "shap_explainer.joblib"))
    
    # Compute SHAP values for all employees
    # For binary classification TreeExplainer, shap_values can be array or list of arrays [class0, class1]
    shap_vals_raw = explainer.shap_values(X_all_trans)
    if isinstance(shap_vals_raw, list):
        shap_vals = shap_vals_raw[1]  # Class 1 (Attrition=Yes)
    elif len(shap_vals_raw.shape) == 3:
        shap_vals = shap_vals_raw[:, :, 1]
    else:
        shap_vals = shap_vals_raw
        
    expected_value = explainer.expected_value
    if isinstance(expected_value, (list, np.ndarray)):
        expected_value = float(expected_value[1] if len(expected_value) > 1 else expected_value[0])
    else:
        expected_value = float(expected_value)
        
    # Global feature importance
    mean_abs_shap = np.mean(np.abs(shap_vals), axis=0)
    global_importance = []
    for fn, val in zip(all_feature_names, mean_abs_shap):
        global_importance.append({"feature": fn, "importance": round(float(val), 4)})
    global_importance.sort(key=lambda x: x["importance"], reverse=True)
    
    metrics_summary = {
        "best_model": best_name,
        "models_evaluated": eval_results,
        "global_importance": global_importance[:15],
        "shap_base_value": round(expected_value, 4),
        "total_records": len(df),
        "timestamp": datetime.utcnow().isoformat()
    }
    with open(os.path.join(models_dir, "metrics.json"), "w") as f:
        json.dump(metrics_summary, f, indent=2)
        
    print(f"Metrics and models saved to {models_dir}")
    
    # Calculate predictions on full dataset
    all_probs = best_model.predict_proba(X_all_trans)[:, 1]
    all_preds = (all_probs >= 0.50).astype(int)
    
    # Seed Database
    print("\nInitializing SQLite database tables and seeding data...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    random.seed(42)
    
    # 1. Seed ModelEvaluations
    for res in eval_results:
        me = ModelEvaluation(
            model_name=res["name"],
            model_type=res["type"],
            accuracy=res["accuracy"],
            precision=res["precision"],
            recall=res["recall"],
            f1_score=res["f1"],
            roc_auc=res["roc_auc"],
            confusion_matrix=res["confusion_matrix"],
            hyperparameters=res["params"],
            is_best_model=res["is_best"]
        )
        db.add(me)
    db.commit()
    print("Seeded Model Evaluations table.")
    
    # 2. Seed Employees and Predictions
    employees_to_add = []
    predictions_to_add = []
    
    for idx, row in df.iterrows():
        emp_num = f"EMP-{int(row['EmployeeNumber']):05d}"
        f_name = FIRST_NAMES[idx % len(FIRST_NAMES)]
        l_name = LAST_NAMES[(idx * 3 + 7) % len(LAST_NAMES)]
        full_name = f"{f_name} {l_name}"
        email = f"{f_name.lower()}.{l_name.lower()}{row['EmployeeNumber']}@company.com"
        gender_code = "women" if row["Gender"] == "Female" else "men"
        avatar_url = f"https://randomuser.me/api/portraits/{gender_code}/{(idx % 70) + 1}.jpg"
        
        prob = float(all_probs[idx])
        pred_label = int(all_preds[idx])
        
        # Risk categorization (Paper Section VIII-D)
        if prob < 0.30:
            risk_cat = "Low"
        elif prob < 0.60:
            risk_cat = "Medium"
        else:
            risk_cat = "High"
            
        # Top SHAP drivers for this individual
        row_shap = shap_vals[idx]
        feature_contributions = []
        for feat_name, s_val in zip(all_feature_names, row_shap):
            feature_contributions.append({
                "feature": feat_name,
                "shap": round(float(s_val), 4),
                "abs_shap": abs(float(s_val))
            })
            
        feature_contributions.sort(key=lambda x: x["abs_shap"], reverse=True)
        top_positive = [f for f in feature_contributions if f["shap"] > 0][:5]
        top_negative = [f for f in feature_contributions if f["shap"] < 0][:5]
        
        recs = generate_recommendations(top_positive, row.to_dict())
        
        emp = Employee(
            id=idx + 1,
            employee_number=emp_num,
            full_name=full_name,
            email=email,
            avatar_url=avatar_url,
            age=int(row["Age"]),
            gender=str(row["Gender"]),
            marital_status=str(row["MaritalStatus"]),
            distance_from_home=int(row["DistanceFromHome"]),
            education=int(row["Education"]),
            education_field=str(row["EducationField"]),
            department=str(row["Department"]),
            job_role=str(row["JobRole"]),
            job_level=int(row["JobLevel"]),
            business_travel=str(row["BusinessTravel"]),
            job_involvement=int(row["JobInvolvement"]),
            monthly_income=float(row["MonthlyIncome"]),
            daily_rate=int(row["DailyRate"]),
            hourly_rate=int(row["HourlyRate"]),
            monthly_rate=int(row["MonthlyRate"]),
            percent_salary_hike=int(row["PercentSalaryHike"]),
            stock_option_level=int(row["StockOptionLevel"]),
            over_time=str(row["OverTime"]),
            work_life_balance=int(row["WorkLifeBalance"]),
            environment_satisfaction=int(row["EnvironmentSatisfaction"]),
            job_satisfaction=int(row["JobSatisfaction"]),
            relationship_satisfaction=int(row["RelationshipSatisfaction"]),
            performance_rating=int(row["PerformanceRating"]),
            total_working_years=int(row["TotalWorkingYears"]),
            years_at_company=int(row["YearsAtCompany"]),
            years_in_current_role=int(row["YearsInCurrentRole"]),
            years_since_last_promotion=int(row["YearsSinceLastPromotion"]),
            years_with_curr_manager=int(row["YearsWithCurrManager"]),
            num_companies_worked=int(row["NumCompaniesWorked"]),
            training_times_last_year=int(row["TrainingTimesLastYear"]),
            actual_attrition=str(row["Attrition"])
        )
        employees_to_add.append(emp)
        
        pred = Prediction(
            employee_id=idx + 1,
            attrition_probability=round(prob, 4),
            predicted_label=pred_label,
            risk_category=risk_cat,
            shap_base_value=round(expected_value, 4),
            top_positive_factors=top_positive,
            top_negative_factors=top_negative,
            retention_recommendations=recs,
            assessed_at=datetime.utcnow()
        )
        predictions_to_add.append(pred)
        
    db.bulk_save_objects(employees_to_add)
    db.commit()
    print(f"Seeded {len(employees_to_add)} Employees.")
    
    db.bulk_save_objects(predictions_to_add)
    db.commit()
    print(f"Seeded {len(predictions_to_add)} Employee Predictions & SHAP explanations.")
    
    # 3. Seed some initial Retention Actions for top high risk employees
    high_risk_preds = db.query(Prediction).filter(Prediction.risk_category == "High").limit(12).all()
    action_types = [
        ("Compensation Review", "Off-cycle salary parity check and retention bonus evaluation", "High", "In Progress"),
        ("Workload & Overtime Reduction", "Workload re-allocation and elimination of mandatory overtime", "Critical", "Pending"),
        ("Career Growth & Promotion", "Fast-track promotion readiness plan with mentorship", "High", "Planned"),
        ("Flexible Work / Remote Option", "Transition to 2-day remote schedule to address commute distance", "Medium", "Completed"),
        ("Management Check-in", "Weekly skip-level 1-on-1 engagement review with VP of HR", "Medium", "In Progress")
    ]
    
    for i, p in enumerate(high_risk_preds):
        act_choice = action_types[i % len(action_types)]
        act = RetentionAction(
            employee_id=p.employee_id,
            action_type=act_choice[0],
            title=f"{act_choice[0]} - {act_choice[1]}",
            priority=act_choice[2],
            status=act_choice[3],
            assigned_hr="Sarah Jenkins (Senior HR Partner)",
            notes="Identified via SHAP XAI Attrition Risk Assessment. High priority intervention scheduled.",
            target_date="Within 14 business days"
        )
        db.add(act)
    db.commit()
    print("Seeded initial Retention Actions.")
    
    db.close()
    print("=" * 60)
    print("Pipeline completed successfully! Database and models ready.")
    print("=" * 60)

if __name__ == "__main__":
    main()
