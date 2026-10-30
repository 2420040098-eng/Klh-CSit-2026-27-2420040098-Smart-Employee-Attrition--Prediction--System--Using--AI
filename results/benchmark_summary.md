# 📊 Benchmark Summary: Empirical Evaluation Results
### Measured Results on Isolated 20% Held-Out Test Set (Table XIII)

All models were evaluated on the exact same 20% stratified holdout partition ($N = 294$, 247 negative non-attrition records, 47 positive attrition records) with `random_state = 42`.

---

## 1. Comparative Performance Matrix

| Model Architecture | Model Family | Test Accuracy | Precision (Turnover) | Recall (Turnover) | F1-Score | ROC-AUC | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression** | Linear Generalized Model | 75.51% | 35.63% | **65.96%** | **46.27%** | 80.35% | Evaluated |
| **Decision Tree** | Single Decision Tree | 77.21% | 35.71% | 53.19% | 42.74% | 65.17% | Evaluated |
| **Random Forest (Selected)** | Ensemble Bagging | **82.65%** | **45.24%** | **40.43%** | **42.70%** | **78.55%** | **Deployed Best** |
| **Gradient Boosting** | Ensemble Boosting | 85.03% | 57.89% | 23.40% | 33.33% | 81.46% | Evaluated |

---

## 2. Key Observations & Findings

1. **Precision vs. Recall Equilibrium:**
   - **Logistic Regression** optimizes sensitivity/recall (identifying 65.96% of leaving employees), making it useful for broad preliminary screening, but has higher false-alarm rates ($FP = 56$).
   - **Gradient Boosting** achieves top accuracy (85.03%) but suffers from acute false negatives ($FN = 36$), detecting only 11 of 47 turnover events.
   - **Random Forest** offers the most viable operational compromise: **82.65% accuracy**, **45.24% precision**, and **40.43% recall**, effectively flagging high-risk individuals while preserving HR resource bandwidth.

2. **SHAP TreeExplainer Stability:**
   Random Forest is uniquely suited for polynomial-time exact Shapley decomposition via `shap.TreeExplainer`, preventing the exponential computational cost and sampling variance inherent in model-agnostic kernel explainers.
