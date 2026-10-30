# 📁 Reports Directory (`reports/`)

This directory houses the academic publications, abstracts, and formal empirical evaluation reports for the **Explainable Predictive Analytics for Employee Attrition Risk Assessment** system.

---

## 📂 Report Inventory

| Document | Format | Description |
| :--- | :--- | :--- |
| **`Research_Paper_Abstract.md`** | Markdown | Official research paper abstract with author credentials, supervisor details, methodology, keywords, and conclusions. |
| **`Model_Performance_Report.md`** | Markdown | Comprehensive empirical evaluation of the four candidate models on the 20% stratified test set ($N = 294$), detailing confusion matrices, precision-recall trade-offs, and inference latency. |
| **`Literature_Survey_and_Gap_Analysis.md`** | Markdown | Systematic review of prior academic literature in turnover modeling, class imbalance techniques, SHAP explainability, and algorithmic governance. |
| **`EPAEA_Project_Abstract.pdf`** | PDF | Official academic abstract PDF formatted for department submission. |
| **`EPAEA_Research_paper.pdf`** | PDF | Full academic research paper manuscript. |

---

## 🔬 Core Empirical Finding

```
Random Forest Classifier selected as deployed optimal model:
- Test Accuracy: 82.65%
- Precision (Attrition): 45.24%
- Recall (Attrition): 40.43%
- F1-Score: 42.70%
- ROC-AUC: 78.55%
- Inference Latency: ~87.6 ms
```
