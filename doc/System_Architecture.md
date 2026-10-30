# 🏛️ System Design Architecture
### Explainable Predictive Analytics for Employee Attrition Risk Assessment
**From Data to Explainable Insights $\rightarrow$ Better Decisions $\rightarrow$ Higher Retention**

---

## Architecture Diagram

```mermaid
flowchart TD
    subgraph L1 [1. Data Sources]
        direction TB
        DS1["📁 HR Database\n(demographics, job role, tenure, salary)"]
        DS2["📋 Performance Data\n(ratings, goals, productivity)"]
        DS3["💬 Employee Feedback\n(surveys, reviews)"]
        DS4["📅 Attendance & Engagement\n(leaves, overtime, commute)"]
    end

    subgraph L2 [2. Data Ingestion & Preprocessing]
        direction TB
        DP1["📥 Data Collection\n(ETL / CSV / Database)"]
        DP2["🧹 Data Cleaning\n(handle missing values, remove duplicates)"]
        DP3["⚙️ Feature Engineering\n(drop zero-variance, encode labels)"]
        DP4["🔄 Data Transformation\n(StandardScaler, OneHotEncoder)"]
    end

    subgraph L3 [3. Machine Learning Pipeline]
        direction TB
        ML1["📊 Train / Test Split\n(80% Train / 20% Test Stratified)"]
        ML2["🤖 Model Training\n(Random Forest, Logistic Reg, DT, GBM)"]
        ML3["🎯 Hyperparameter Tuning\n(GridSearchCV / class_weight='balanced')"]
        ML4["📈 Model Evaluation\n(Accuracy, Precision, Recall, F1, ROC-AUC)"]
    end

    subgraph L4 [4. Explainability Layer]
        direction TB
        XAI1["🔮 SHAP (TreeExplainer)\n(Shapley Additive exPlanations)"]
        XAI2["🌐 Global Feature Importance\n(Workforce-wide driver ranking)"]
        XAI3["🔍 Local Prediction Attribution\n(Why is this specific employee at risk?)"]
        XAI4["📊 Explainability Visualizations\n(Force plots, waterfall breakdown, delta metrics)"]
    end

    subgraph L5 [5. Application Layer]
        direction TB
        APP1["🖥️ Executive Risk Radar\n(macro workforce health, risk breakdown)"]
        APP2["👥 Workforce Directory\n(filterable search, role & risk tiers)"]
        APP3["🧪 Counterfactual What-If Studio\n(real-time scenario simulation)"]
        APP4["📝 Retention Action Tracker\n(log 1-on-1s, salary reviews, mobility)"]
        APP5["⚡ High-Performance REST API\n(Python FastAPI + Pydantic + SQLite)"]
    end

    subgraph L6 [6. Infrastructure & Governance]
        direction TB
        INF1["☁️ Deployment: Cloud / On-Premise / Local"]
        INF2["🐳 Containerization: Docker & Python Runtime"]
        INF3["🛡️ Security & Privacy: Role-Based Access, PII Minimization"]
        INF4["⚖️ Ethical AI Guardrails: Human-in-the-Loop Verification"]
    end

    L1 --> L2
    L2 --> L3
    L3 --> L4
    L4 --> L5
    L5 --> L6
```

---

## Layer-by-Layer Detailed Specification

### 1. Data Sources Layer
- **Structured HR Database:** Tabular employee records containing 35 attributes (demographics, job level, salary, department).
- **Workplace Sentiment & Engagement:** Self-reported ratings on Job Satisfaction, Work-Life Balance, and Environment Satisfaction.
- **Tenure & Workload:** Recorded overtime hours, distance from home, years in current role, and duration under current reporting manager.

### 2. Data Ingestion & Preprocessing Layer
- **Cleaning & Filtering:** Deletion of static non-predictive columns (`StandardHours`, `EmployeeCount`, `Over18`, `EmployeeNumber`).
- **Feature Encoding:** Categorical string values (`BusinessTravel`, `Department`, `EducationField`, `Gender`, `JobRole`, `MaritalStatus`, `OverTime`) transformed via scikit-learn `OneHotEncoder(drop="first")`.
- **Scaling:** Continuous numerical metrics normalized using `StandardScaler` to ensure scale invariance.
- **Stratified Partitioning:** Stratified 80/20 train/test split preserving the 16.12% target attrition proportion.

### 3. Machine Learning Pipeline Layer
- **Multi-Model Benchmark:** Four architectures evaluated under identical conditions:
  1. *Logistic Regression:* Interpretable linear baseline with balanced weighting.
  2. *Decision Tree:* Non-linear single-tree baseline (`max_depth=5`).
  3. *Random Forest (Selected Best):* Bagging ensemble (`n_estimators=160`, `max_depth=8`, `class_weight='balanced'`).
  4. *Gradient Boosting:* Boosting ensemble (`n_estimators=130`, `learning_rate=0.08`, `max_depth=4`).
- **Optimization:** Hyperparameter search targeting the optimal trade-off between Recall on minority positive classes and precision.

### 4. Explainability Layer (SHAP)
- **Mathematical Foundation:** Shapley Additive exPlanations based on cooperative game theory:
  $$f(x) = \phi_0 + \sum_{i=1}^{M} \phi_i$$
  where $\phi_0$ is the base expected value and $\phi_i$ represents the additive contribution of feature $i$.
- **SHAP TreeExplainer:** Computes exact polynomial-time Shapley values directly for tree ensembles.
- **Global Attribution:** Ranks overall organizational turnover factors.
- **Local Attribution:** Unpacks each individual employee's risk prediction into risk-elevating (red) and risk-dampening (green) forces.

### 5. Application Layer
- **FastAPI Backend:** Asynchronous Python REST endpoints serving `/api/stats`, `/api/employees`, `/api/models/benchmarks`, `/api/simulate`, and `/api/retention-actions`.
- **React Frontend:** Modern Single Page Application built with Vite, Tailwind CSS, and Lucide React icons.
- **SQLite + SQLAlchemy Persistence:** Lightweight relational storage maintaining employee records, precalculated SHAP vectors, and logged HR retention initiatives.

### 6. Infrastructure & Ethical Governance Layer
- **Human-in-the-Loop Mandate:** The model serves strictly as an early-warning radar; final decisions require qualitative managerial conversation.
- **No Automated Adverse Action:** Outputs must never trigger termination, disciplinary penalties, or promotion denials.
