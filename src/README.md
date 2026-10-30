# 💻 Source Code Directory (`src/`)

This directory houses the end-to-end full-stack software application for the **Explainable Predictive Analytics for Employee Attrition Risk Assessment** system.

---

## 🏛️ Directory Architecture

```
src/
├── backend/                  <- Python FastAPI Microservice & ML Engine
│   ├── api/
│   │   ├── routers/          <- REST API route controllers
│   │   │   ├── employees.py  <- Directory search, filtering & employee deep-dive
│   │   │   ├── models.py     <- Model benchmarks, metrics & SHAP importance
│   │   │   ├── retention.py  <- Logged HR retention actions & follow-ups
│   │   │   ├── simulate.py   <- Counterfactual What-If simulation engine
│   │   │   └── stats.py      <- Workforce macro stats & risk distribution
│   │   └── main.py           <- FastAPI app initialization & CORS middleware
│   ├── data/                 <- Local copy of benchmark dataset & seeded SQLite DB
│   │   ├── attrition_data.csv
│   │   └── attrition_system.db
│   ├── database/             <- SQLAlchemy models & database connection
│   │   ├── database.py
│   │   └── models.py
│   ├── ml/                   <- Training, evaluation & SHAP explainer generation
│   │   ├── saved_models/     <- Serialized model artifacts (.joblib, metrics.json)
│   │   │   ├── best_model.joblib
│   │   │   ├── metrics.json
│   │   │   ├── preprocessor.joblib
│   │   │   └── shap_explainer.joblib
│   │   └── train_and_seed.py <- End-to-end training, SHAP and DB seeding script
│   └── requirements.txt      <- Python package dependencies
│
└── frontend/                 <- React 19 + Vite + Tailwind CSS Single Page App
    ├── public/               <- Static assets & icons
    ├── src/
    │   ├── assets/           <- Branding graphics & illustrations
    │   ├── components/       <- Modular React components
    │   │   ├── EmployeeDetailModal.jsx <- Individual SHAP force breakdown modal
    │   │   ├── ExecutiveDashboard.jsx  <- High-level workforce health radar
    │   │   ├── ModelBenchmark.jsx      <- Empirical benchmark matrix & CMs
    │   │   ├── Navbar.jsx              <- Navigation header & branding
    │   │   ├── RetentionTracker.jsx    <- Retention action plan logger
    │   │   ├── WhatIfSimulator.jsx     <- Real-time policy sandbox
    │   │   └── WorkforceExplorer.jsx   <- Searchable workforce table
    │   ├── App.jsx           <- Primary layout & view routing
    │   ├── main.jsx          <- React root render entry point
    │   └── index.css         <- Tailwind styling & custom utility rules
    ├── package.json          <- Node dependencies & scripts
    └── vite.config.js        <- Vite configuration
```

---

## 🚀 Quick Execution Guide

### 1. Launch Backend API
```bash
cd src/backend
pip install -r requirements.txt
python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```
API Docs (Swagger UI): `http://localhost:8000/docs`

### 2. Launch Frontend Application
```bash
cd src/frontend
npm install
npm run dev
```
Interactive UI: `http://localhost:5173`
