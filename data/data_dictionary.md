# 📊 Data Dictionary: IBM HR Analytics Employee Attrition & Performance

This benchmark dataset comprises **1,470 employee records** and **35 attributes** capturing demographic, compensation, satisfaction, workload, and career trajectory indicators.

---

## 🏷️ Target Variable

| Variable | Type | Values | Description |
| :--- | :--- | :--- | :--- |
| **Attrition** | Categorical (Binary) | `Yes`, `No` | Indicates whether the employee has left the organization (`Yes` = 1, `No` = 0). Historical attrition rate in dataset: **16.12%** (237 positive cases, 1,233 negative cases). |

---

## 📋 Demographic & Personal Attributes

| Variable | Data Type | Value Range / Categories | Description |
| :--- | :--- | :--- | :--- |
| **Age** | Integer | 18 – 60 | Employee age in completed years. Younger cohorts show elevated modeled attrition volatility. |
| **Gender** | Categorical | `Male`, `Female` | Self-reported gender. *(Used only for demographic audit; excluded from automated decision rules)* |
| **MaritalStatus** | Categorical | `Single`, `Married`, `Divorced` | Marital status at the time of evaluation. |
| **Education** | Integer (Ordinal) | 1 (`Below College`), 2 (`College`), 3 (`Bachelor`), 4 (`Master`), 5 (`Doctor`) | Highest formal education level attained. |
| **EducationField** | Categorical | `Life Sciences`, `Medical`, `Marketing`, `Technical Degree`, `Human Resources`, `Other` | Academic field of study. |

---

## 💼 Role & Employment Attributes

| Variable | Data Type | Value Range / Categories | Description |
| :--- | :--- | :--- | :--- |
| **Department** | Categorical | `Sales`, `Research & Development`, `Human Resources` | Operating business unit. |
| **JobRole** | Categorical | `Sales Executive`, `Research Scientist`, `Laboratory Technician`, `Manufacturing Director`, `Healthcare Representative`, `Manager`, `Sales Representative`, `Research Director`, `Human Resources` | Assigned corporate job title / position. |
| **JobLevel** | Integer (Ordinal) | 1 to 5 | Organizational hierarchy tier (1 = Entry, 5 = Senior Executive). |
| **BusinessTravel** | Categorical | `Non-Travel`, `Travel_Rarely`, `Travel_Frequently` | Frequency of business-related travel. |
| **DistanceFromHome** | Integer | 1 – 29 miles | One-way commute distance from residence to workplace. |

---

## 💰 Compensation & Equity Attributes

| Variable | Data Type | Value Range / Categories | Description |
| :--- | :--- | :--- | :--- |
| **MonthlyIncome** | Continuous | \$1,009 – \$19,999 | Gross monthly base salary in USD. |
| **DailyRate** | Continuous | \$102 – \$1,499 | Daily contract / internal accounting rate. |
| **HourlyRate** | Continuous | \$30 – \$100 | Standard hourly pay rate. |
| **MonthlyRate** | Continuous | \$2,094 – \$26,999 | Standard monthly billing index rate. |
| **PercentSalaryHike**| Continuous | 11% – 25% | Percentage increase during the last annual salary review. |
| **StockOptionLevel** | Integer (Ordinal) | 0, 1, 2, 3 | Equity incentive grant tier (0 = None, 3 = Maximum). |

---

## ⏱️ Workload, Experience & Career Tenure

| Variable | Data Type | Value Range / Categories | Description |
| :--- | :--- | :--- | :--- |
| **OverTime** | Categorical (Binary) | `Yes`, `No` | Whether employee routinely works beyond scheduled hours. **#1 overall SHAP risk driver (+0.0532)**. |
| **TotalWorkingYears**| Continuous | 0 – 40 years | Total career cumulative professional experience. |
| **YearsAtCompany** | Continuous | 0 – 40 years | Continuous tenure with current organization. |
| **YearsInCurrentRole**| Continuous | 0 – 18 years | Consecutive duration in current job role. |
| **YearsSinceLastPromotion** | Continuous | 0 – 15 years | Years elapsed since most recent career advancement. |
| **YearsWithCurrManager** | Continuous | 0 – 17 years | Duration under current direct reporting line. Strong protective factor against departure. |
| **NumCompaniesWorked** | Integer | 0 – 9 | Number of prior distinct employers. |
| **TrainingTimesLastYear** | Integer | 0 – 6 | Formal professional training programs attended in preceding 12 months. |

---

## 😊 Workplace Sentiment & Satisfaction Scores (1–4 Scale)

*Note: 1 = Low, 2 = Medium, 3 = High, 4 = Very High.*

| Variable | Metric Scale | Description |
| :--- | :--- | :--- |
| **EnvironmentSatisfaction** | 1 to 4 | Satisfaction with physical workplace surroundings, ergonomics, and facilities. |
| **JobSatisfaction** | 1 to 4 | Overall subjective fulfillment and contentment in job responsibilities. |
| **RelationshipSatisfaction** | 1 to 4 | Quality of peer collaboration and interpersonal team relationships. |
| **WorkLifeBalance** | 1 to 4 | Perceived balance between professional demands and personal time. |
| **JobInvolvement** | 1 to 4 | Degree of active psychological and emotional engagement in assigned work. |
| **PerformanceRating** | 3 or 4 | 3 = `Excellent`, 4 = `Outstanding` (company performance review rating). |

---

## 🗑️ Non-Informative Constant Columns (Dropped During Preprocessing)

| Column | Reason for Removal |
| :--- | :--- |
| `EmployeeCount` | Constant value = 1 across all records; zero variance. |
| `StandardHours` | Constant value = 80 across all records; zero variance. |
| `Over18` | Constant value = `Y` across all records; zero variance. |
| `EmployeeNumber` | Arbitrary database index identifier; non-predictive. |
