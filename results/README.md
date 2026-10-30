# 📁 Results Directory (`results/`)

This directory houses all machine-readable model benchmark outputs, confusion matrices, SHAP feature rankings, and evaluation summaries for the **Explainable Predictive Analytics for Employee Attrition Risk Assessment** system.

---

## 📂 File Catalog

| File | Format | Description |
| :--- | :--- | :--- |
| **`metrics.json`** | JSON | Full benchmark evaluation metrics for Logistic Regression, Decision Tree, Random Forest, and Gradient Boosting, including hyperparameters and confusion matrix counts. |
| **`confusion_matrices.json`** | JSON | Structured 2x2 confusion matrices (TN, FP, FN, TP) for all 4 candidate models evaluated on the $N = 294$ test partition. |
| **`shap_global_importance.json`** | JSON | Global SHAP feature importance values and category tags for the top workforce risk drivers. |
| **`shap_global_importance.csv`** | CSV | Tabular format of global SHAP feature importance rankings. |
| **`benchmark_summary.md`** | Markdown | Comprehensive summary analysis comparing all 4 models (Table XIII from research paper). |
