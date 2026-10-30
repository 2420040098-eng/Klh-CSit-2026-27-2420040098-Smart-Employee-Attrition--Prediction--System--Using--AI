# Explainable Predictive Analytics for Employee Attrition Risk Assessment
### An Explainable AI (XAI) & HR Decision-Support System Powered by ML and SHAP

**Academic Project Documentation — KLEF 2026**  
**Department:** Computer Science and Information Technology | **College:** KL University  

| Roll No. | Name |
| :--- | :--- |
| **2420030082** | Y MANIKANTA SAI |
| **2420030083** | D SAI SRUJAN |
| **2420040098** | GOLLA RAHUL |
| **2420090054** | BOYA VINAY |

**Project Guide:** Dr. K. SWANTHANA  
**Course Code:** 24ALT3101 (Applied Machine Learning)  
**Team Number:** 15  

---

## 1. Introduction

Employee turnover creates direct recruitment expense and indirect operational loss through disrupted teams, delayed delivery and the departure of experienced staff. A predictive model can help HR identify elevated risk, but a probability alone does not explain the conditions behind the prediction. This project combines predictive analytics with explainable AI so that each score can be reviewed in the context of its strongest contributing factors.

### 1.1 Problem Statement
Conventional attrition models often operate as black boxes. They may classify an employee as high risk without showing why the model reached that result. This limits trust and can encourage inappropriate or punitive use. The project addresses this gap through SHAP explanations, human review and counterfactual simulation.

### 1.2 Project Objectives
- Train and compare multiple classification models on a consistent held-out test set.
- Select a model that balances predictive performance, stability and explainability.
- Provide global and employee-level SHAP explanations.
- Deliver an interactive full-stack application for risk review, scenario testing and retention-action tracking.
- Preserve human oversight and prevent the model from becoming an automated employment decision maker.

### 1.3 Scope
The application is an academic decision-support prototype based on the IBM HR Analytics benchmark. It evaluates risk patterns in the supplied data and demonstrates how transparent predictions can support structured retention conversations. It does not establish causation or validate performance on a live organization.

---

## 2. End-to-End Architecture

The solution follows a five-layer analytical workflow from dataset intake to interactive decision support:
1. **Data Layer:** IBM HR benchmark dataset with 1,470 records and 35 employee attributes.
2. **Preprocessing:** One-hot encoding for categorical variables, `StandardScaler` normalization and an 80/20 stratified split.
3. **ML Modeling:** Comparable evaluation of Logistic Regression, Decision Tree, Random Forest and Gradient Boosting.
4. **Explainability:** SHAP `TreeExplainer` for global feature rankings and individual feature attributions.
5. **Application:** React and Vite interface connected to FastAPI endpoints, with SQLAlchemy and SQLite persistence.

### 2.1 Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons | Interactive HR risk dashboard |
| **API** | Python FastAPI, Uvicorn, Pydantic | Asynchronous REST microservices |
| **ML / XAI** | scikit-learn, SHAP, NumPy, pandas | Prediction, training, and explanation |
| **Persistence** | SQLAlchemy ORM, SQLite | Storage of employees, predictions and actions |

---

## 3. Dataset and Preprocessing

The project uses the IBM HR Analytics Employee Attrition and Performance benchmark. The dataset contains 1,470 records across 35 attributes covering employee profile, role, compensation, tenure, satisfaction and work patterns.

### 3.1 Preparation Workflow
- Categorical fields are converted through one-hot encoding (`drop="first"`).
- Numeric fields are normalized with `StandardScaler` where required by the preprocessing pipeline.
- Non-informative zero-variance fields (`EmployeeCount`, `StandardHours`, `Over18`, `EmployeeNumber`) are removed.
- The data is divided using an 80/20 stratified partition so the class distribution remains consistent.
- The held-out test set contains 294 records and supports like-for-like model comparison.

### 3.2 Model Candidates
The benchmark compares a linear classifier, a single decision tree, a bagging ensemble and a boosting ensemble. This mix provides interpretable baselines and nonlinear models that capture interactions among employee attributes.

---

## 4. Model Evaluation (Table XIII Benchmark)

| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression** | 75.51% | 35.63% | **65.96%** | 46.27% | 80.35% |
| **Decision Tree** | 77.21% | 35.71% | 53.19% | 42.74% | 65.17% |
| **Random Forest (Selected Best)** | **82.65%** | **45.24%** | **40.43%** | **42.70%** | **78.55%** |
| **Gradient Boosting** | 85.03% | 57.89% | 23.40% | 33.33% | 81.46% |

### Selection Rationale
Random Forest is used by the application because it combines stable ensemble behavior with direct SHAP `TreeExplainer` support. Gradient Boosting records higher accuracy and ROC-AUC in the stored benchmark, but its lower recall (23.40%) and F1-score (33.33%) demonstrate that model selection must not be based on raw accuracy alone in imbalanced classification contexts.

---

## 5. SHAP Feature Attribution

SHAP (SHapley Additive exPlanations) assigns each feature a contribution relative to the model's baseline prediction. Positive values push the predicted attrition probability upward, while negative values reduce it. The explanation remains a description of model behavior, not proof that a feature causes resignation.

### 5.1 Global Importance Ranking

| Feature | SHAP Importance | Interpretation |
| :--- | :---: | :--- |
| **OverTime = Yes** | 0.0532 | Strongest overall risk-increasing signal |
| **StockOptionLevel** | 0.0372 | Lower option tiers can increase predicted risk |
| **Age** | 0.0330 | Younger cohorts show higher modeled volatility |
| **MonthlyIncome** | 0.0313 | Compensation level contributes to flight-risk estimates |
| **YearsWithCurrManager** | 0.0272 | Longer manager relationships can act as a protective signal |

### 5.2 Local Explanations
For an individual employee, the application displays the strongest risk-increasing (positive SHAP) and risk-reducing (negative SHAP) factors. The reviewer can compare these attributions with the employee's current context before considering any supportive action.

### 5.3 Interpretation Rules
- Use an explanation to understand a model score, not to label an employee.
- Do not treat a high SHAP value as causal evidence.
- Confirm relevant context through respectful human dialogue.
- Avoid using protected personal characteristics or explanations for punitive action.

---

## 6. Production Implementation

### 6.1 Executive Risk Radar
The dashboard presents workforce-level indicators, including total evaluated records ($N = 1,470$), the 16.1% historical attrition benchmark, predicted-risk distribution and department/role summaries.

### 6.2 Workforce Directory
Users can search and filter employees by role, overtime status and calibrated risk tier:
- **Low Risk:** $< 30\%$ probability
- **Medium Risk:** $30\% - 59\%$ probability
- **High Risk:** $\ge 60\%$ probability

### 6.3 Employee Detail and Explanation
The employee view combines the predicted probability, risk category, and local SHAP drivers. This design keeps the score and its explanation together so reviewers do not act on a probability in isolation.

### 6.4 Model Benchmark
The benchmark module exposes the measured test-set results for all four models, including accuracy, precision, recall, F1-score, ROC-AUC and confusion-matrix values stored with the trained artifacts.

### 6.5 Retention Action Tracker
Reviewers can record supportive retention activities such as workload balancing, compensation review, career pathway discussions, and manager check-ins.

---

## 7. What-If Simulation Engine

The simulator creates a counterfactual copy of an employee record, applies selected changes and recalculates the risk score with the trained Random Forest model. The original record remains the comparison point.

### 7.1 Supported Adjustments
- Overtime status and monthly income.
- Work-life balance, job satisfaction and environment satisfaction.
- Stock-option level, distance from home and job involvement.
- Salary-hike percentage and years in current role.

### 7.2 Simulation Output
The API returns the original and simulated risk scores, their categories, the modeled risk change ($\Delta$), the applied adjustments and the top SHAP drivers for the simulated case.

### 7.3 Operational Workflow
1. Select an employee or cohort for review.
2. Inspect the score, local SHAP factors and relevant work context.
3. Test a realistic supportive intervention in the simulator.
4. Discuss the option with appropriate human oversight and employee consent.
5. Record an agreed action and schedule a follow-up review.

---

## 8. Responsible AI and Ethical Governance
- **Attribution is not causation:** Predictions should guide supportive review, not automatic employment action.
- The model must not automate firing, promotion denial or disciplinary decisions.
- Reviewers should minimize data collection and use job-relevant attributes only.
- Retention activities require informed human judgment, empathy and appropriate consent.
- Access to employee-level predictions and explanations should be restricted and audited.

---

## 9. Validation and Known Limits
- The evaluation uses a stratified 20% holdout of the IBM benchmark, not a live enterprise deployment.
- Model metrics describe this dataset and split; they do not guarantee the same performance in another organization.
- Class imbalance means accuracy alone can overstate practical performance.
- SHAP explains the fitted model's behavior but cannot prove a causal relationship.
- Counterfactual results are model-based estimates and require real-world validation before policy conclusions.

---

## 10. Conclusion

The project demonstrates how predictive analytics can support HR review without hiding the model's reasoning. Random Forest provides the deployed risk estimate, SHAP connects each score to interpretable feature contributions, and the React-FastAPI application turns those outputs into a reviewable workflow. The strongest value comes from combining transparent evidence with careful human judgment and supportive retention practices.

---

## 11. Running the Project

### 11.1 Backend
```bash
cd src/backend
python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```
API documentation is available at `http://localhost:8000/docs`.

### 11.2 Frontend
```bash
cd src/frontend
npm run dev
```
The Vite development interface is available at `http://localhost:5173`.

---

## 12. Project Team

- **Y MANIKANTA SAI** (2420030082)
- **D SAI SRUJAN** (2420030083)
- **GOLLA RAHUL** (2420040098)
- **BOYA VINAY** (2420090054)

**Department:** Computer Science and Information Technology  
**College:** KL University  
**Supervisor / Guide:** Dr. K. SWANTHANA  
