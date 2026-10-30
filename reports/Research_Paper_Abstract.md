# Explainable Predictive Analytics for Employee Attrition Risk Assessment
### An Explainable AI (XAI) & HR Decision-Support System Powered by ML and SHAP

**Department:** Computer Science and Information Technology | **College:** KL University  
**Academic Year:** 2026–2027 | **Course:** Applied Machine Learning (24ALT3101)  

---

## 👥 Authors & Team Details

| Roll Number | Name | Department |
| :--- | :--- | :--- |
| **2420030082** | Y MANIKANTA SAI | Computer Science and Information Technology |
| **2420030083** | D SAI SRUJAN | Computer Science and Information Technology |
| **2420040098** | GOLLA RAHUL | Computer Science and Information Technology |
| **2420090054** | BOYA VINAY | Computer Science and Information Technology |

**Project Guide / Supervisor:** Dr. K. SWANTHANA  

---

## 📑 ABSTRACT

Employee attrition increases recruitment costs, disrupts project continuity and causes the loss of organizational knowledge. Traditional predictive systems can estimate who may leave, but their black-box outputs provide limited support for responsible human-resource decisions. This project presents an explainable predictive analytics system for employee attrition risk assessment that combines machine learning, SHAP-based interpretability and an interactive decision-support application. 

The system uses the IBM HR Analytics benchmark dataset containing 1,470 employee records and 35 attributes. Its preprocessing workflow applies one-hot encoding, standardization and an 80/20 stratified train-test split. Logistic Regression, Decision Tree, Random Forest and Gradient Boosting models are evaluated on 294 held-out samples. Random Forest is selected for the application because it provides stable generalization and direct compatibility with SHAP TreeExplainer, achieving **82.65% accuracy**, **45.24% precision**, **40.43% recall**, a **42.70% F1-score** and **78.55% ROC-AUC**. 

SHAP explanations identify work-related drivers such as overtime, stock-option level, age, monthly income and manager tenure, while local attributions show how individual features increase or reduce a predicted risk score. A React interface and FastAPI service provide an executive risk dashboard, a filterable workforce directory, employee-level explanations, model benchmarking, a counterfactual what-if simulator and retention-action tracking backed by SQLite through SQLAlchemy. 

The system supports human review and proactive retention planning; it does not treat model attribution as causation and must not automate firing, promotion or disciplinary decisions.

---

## 🔑 Keywords
`employee attrition`, `explainable AI`, `SHAP`, `random forest`, `predictive analytics`, `HR decision support`, `what-if simulation`, `workforce retention`.
