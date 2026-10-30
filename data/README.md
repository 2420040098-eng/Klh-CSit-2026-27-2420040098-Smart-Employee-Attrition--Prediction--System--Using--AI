# 📁 Data Directory

This directory contains the primary data assets utilized for the **Explainable Predictive Analytics for Employee Attrition Risk Assessment** system.

---

## 📂 File Inventory

| File | Size | Description |
| :--- | :--- | :--- |
| `attrition_data.csv` | ~228 KB | The benchmark dataset containing **1,470 records** across **35 workforce attributes** covering demographics, role, compensation, tenure, and satisfaction ratings. |
| `attrition_system.db` | ~2.6 MB | SQLite relational database containing pre-seeded tables for `employees`, `predictions`, `shap_values`, `model_evaluations`, and `retention_actions`. |
| `data_dictionary.md` | ~4 KB | Detailed feature schema, attribute definitions, value ranges, and categorical encodings. |

---

## 🔬 Dataset Overview & Source

- **Origin:** IBM HR Analytics Employee Attrition & Performance Benchmark Dataset.
- **Population:** 1,470 employee records across Research & Development, Sales, and Human Resources.
- **Class Balance:**
  - Active Employees (`Attrition = No`): **1,233 records (83.88%)**
  - Voluntary Turnover (`Attrition = Yes`): **237 records (16.12%)**
- **Partitioning Strategy:**
  - **Stratified Train / Test Split:** 80% Training ($N = 1,176$) / 20% Held-Out Testing ($N = 294$).
  - Stratification preserves the exact 16.12% attrition ratio across both training and test partitions.
  - Reproducibility seed: `random_state = 42`.

---

## 🔒 Ethical & Privacy Notice

1. **Synthetic / Anonymized Data:** The dataset is a benchmark demonstration dataset without personally identifiable employee information (PII).
2. **Responsible AI Boundary:** Demographic variables such as Gender, MaritalStatus, and Age are audited for algorithmic bias and must never be utilized to penalize or discriminate against employees.
