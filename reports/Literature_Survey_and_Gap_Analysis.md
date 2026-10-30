# 📚 Literature Survey & Research Gap Analysis
### Systematic Investigation of Machine Learning & Explainable AI in Employee Turnover Analytics

---

## 1. Literature Survey Synthesis

| Literature / Investigation | Methodology & Techniques | Scope & Relevance | Inherent Limitations & Identified Gaps |
| :--- | :--- | :--- | :--- |
| **Traditional Employee Attrition Studies (HR Analytics)** | Logistic Regression, CART Decision Trees, Linear Discriminant Analysis | Initial baseline for quantifying turnover likelihood using biographical and demographic indicators. | Assumes linear relationships or simple rectangular decision boundaries; lacks explanation depth at individual levels. |
| **IBM HR Analytics Benchmark Studies** | Supervised Classification on benchmark workforce records | Standard baseline dataset for reproducing retention modeling architectures across research groups. | Synthetic nature may not capture changing macroeconomic conditions; often published without explainability layers. |
| **Ensemble Learning for HR Retention (Breiman, 2001)** | Random Forest, Bagging Ensembles | Models complex non-linear interactions between salary, tenure, and workload without overfitting. | Often treated as uninterpretable "black-box" systems; HR users cannot discern which factors drove an individual prediction. |
| **A Unified Approach to Interpreting Model Predictions (Lundberg & Lee, 2017)** | SHAP (Shapley Additive exPlanations), Cooperative Game Theory | Computes mathematically optimal and locally accurate additive feature attributions for tree models. | Explanations represent model mechanics rather than causal proof; requires ethical guidance against automated punitive use. |
| **Class Imbalance in Turnover Prediction** | SMOTE, Balanced Class Weights, Threshold Optimization | Addresses natural low-event skewness in attrition labels (~16% voluntary turnover). | Oversampling can distort probability calibration; naive accuracy metrics conceal poor true-positive turnover recall. |
| **Algorithmic Fairness and Governance in HR** | Demographic Parity, Disparate Impact Assessment, Human Oversight | Establishes governance frameworks to prevent algorithmic discrimination based on protected personal traits. | Fairness definitions can conflict; real-world organizational deployment demands human contextual validation. |

---

## 2. Research Gaps Formally Identified

1. **The Black-Box Risk Score Problem:**
   Traditional systems provide a raw probability (e.g., $P = 0.78$) without exposing the underlying drivers. HR managers cannot determine whether the employee is dissatisfied with compensation, suffering from overtime burnout, or facing a career advancement bottleneck.
2. **Reliance on Naive Accuracy:**
   Because attrition datasets are skewed (~84% non-turnover), trivial models that classify every employee as "retained" achieve 84% accuracy while detecting zero flight risks. Existing literature frequently fails to emphasize the precision-recall trade-off.
3. **Absence of Actionable Counterfactuals:**
   Most studies stop at predicting who might leave. They do not provide decision makers with the ability to simulate prospective retention interventions (e.g., "What happens if we reduce overtime and increase equity by one tier?").
4. **Lack of Integrated Full-Stack Frameworks:**
   Research typically resides in offline Jupyter notebooks rather than accessible decision-support applications with audit tracking and human review safeguards.

---

## 3. How the Proposed Framework Solves These Gaps

| Identified Research Gap | Proposed System Solution |
| :--- | :--- |
| Black-box probability scores | Integrated SHAP `TreeExplainer` providing local positive (risk-increasing) and negative (protective) force attributions. |
| Misleading raw accuracy | Balanced evaluation reporting Precision, Recall, F1-Score, ROC-AUC, and full confusion matrices on an isolated 20% test partition. |
| Static non-actionable outputs | Interactive **Counterfactual What-If Studio** allowing HR leaders to simulate the quantitative marginal impact of retention policies. |
| Offline notebook isolation | Enterprise **React + FastAPI + SQLite** web application featuring Executive Risk Radar, Workforce Explorer, and Retention Action Tracker. |
| Ethical & algorithmic overreach | Strict **Human-in-the-Loop Governance Framework** mandating that predictions inform confidential support rather than punitive employment actions. |
