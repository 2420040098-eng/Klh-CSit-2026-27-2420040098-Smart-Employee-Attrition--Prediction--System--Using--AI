import React, { useState, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Sparkles, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Clock,
  Home,
  Heart
} from 'lucide-react';

export default function WhatIfSimulator({ preselectedEmployeeId }) {
  const [employeeId, setEmployeeId] = useState(preselectedEmployeeId || 1);
  const [empData, setEmpData] = useState(null);
  const [loadingEmp, setLoadingEmp] = useState(false);

  // Simulation form state
  const [overTime, setOverTime] = useState('Yes');
  const [monthlyIncome, setMonthlyIncome] = useState(4500);
  const [workLifeBalance, setWorkLifeBalance] = useState(2);
  const [jobSatisfaction, setJobSatisfaction] = useState(2);
  const [environmentSatisfaction, setEnvironmentSatisfaction] = useState(2);
  const [stockOptionLevel, setStockOptionLevel] = useState(0);
  const [distanceFromHome, setDistanceFromHome] = useState(10);
  const [percentSalaryHike, setPercentSalaryHike] = useState(12);

  // Simulation Results
  const [simResult, setSimResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Load employee baseline data
  useEffect(() => {
    if (employeeId) {
      setLoadingEmp(true);
      fetch(`/api/employees/${employeeId}`)
        .then(res => res.json())
        .then(data => {
          setEmpData(data);
          // Set form defaults from employee
          setOverTime(data.workload_satisfaction.over_time);
          setMonthlyIncome(data.compensation.monthly_income);
          setWorkLifeBalance(data.workload_satisfaction.work_life_balance);
          setJobSatisfaction(data.workload_satisfaction.job_satisfaction);
          setEnvironmentSatisfaction(data.workload_satisfaction.environment_satisfaction);
          setStockOptionLevel(data.compensation.stock_option_level);
          setDistanceFromHome(data.demographics.distance_from_home);
          setPercentSalaryHike(data.compensation.percent_salary_hike);
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingEmp(false));
    }
  }, [employeeId]);

  // Run simulation
  const runSimulation = async () => {
    try {
      setSimulating(true);
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: employeeId,
          over_time: overTime,
          monthly_income: monthlyIncome,
          work_life_balance: workLifeBalance,
          job_satisfaction: jobSatisfaction,
          environment_satisfaction: environmentSatisfaction,
          stock_option_level: stockOptionLevel,
          distance_from_home: distanceFromHome,
          percent_salary_hike: percentSalaryHike
        })
      });
      const data = await res.json();
      setSimResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  // Run simulation whenever sliders change
  useEffect(() => {
    if (empData) {
      runSimulation();
    }
  }, [overTime, monthlyIncome, workLifeBalance, jobSatisfaction, environmentSatisfaction, stockOptionLevel, distanceFromHome, percentSalaryHike]);

  const handleReset = () => {
    if (!empData) return;
    setOverTime(empData.workload_satisfaction.over_time);
    setMonthlyIncome(empData.compensation.monthly_income);
    setWorkLifeBalance(empData.workload_satisfaction.work_life_balance);
    setJobSatisfaction(empData.workload_satisfaction.job_satisfaction);
    setEnvironmentSatisfaction(empData.workload_satisfaction.environment_satisfaction);
    setStockOptionLevel(empData.compensation.stock_option_level);
    setDistanceFromHome(empData.demographics.distance_from_home);
    setPercentSalaryHike(empData.compensation.percent_salary_hike);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Interactive "What-If" Policy Simulator</h2>
          <p className="text-sm text-slate-400 mt-1">
            Simulate retention interventions (overtime relief, salary increments, hybrid work) and preview live risk reduction
          </p>
        </div>

        {/* Employee selector input */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs">
          <span className="text-slate-400">Select Employee:</span>
          <input
            type="number"
            min="1"
            max="1470"
            value={employeeId}
            onChange={(e) => setEmployeeId(parseInt(e.target.value) || 1)}
            className="w-16 bg-slate-950 border border-slate-700 text-white rounded px-2 py-1 text-center font-mono focus:outline-none focus:border-indigo-500"
          />
          {empData && (
            <span className="font-semibold text-slate-200">
              {empData.full_name} ({empData.job.job_role})
            </span>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders and Controls (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Configurable HR Retention Levers</h3>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Baseline</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Overtime Toggle */}
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">Overtime Requirement</span>
                <span className="text-[11px] text-slate-400">
                  Current: {empData?.workload_satisfaction?.over_time}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => setOverTime('No')}
                  className={`px-3 py-1 rounded font-semibold transition ${
                    overTime === 'No'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  No Overtime
                </button>
                <button
                  type="button"
                  onClick={() => setOverTime('Yes')}
                  className={`px-3 py-1 rounded font-semibold transition ${
                    overTime === 'Yes'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Overtime Yes
                </button>
              </div>
            </div>

            {/* Monthly Income Slider */}
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Monthly Compensation
                </span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ${monthlyIncome.toLocaleString()} /mo
                </span>
              </div>
              <input
                type="range"
                min="1500"
                max="20000"
                step="250"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$1,500</span>
                <span>$10,000</span>
                <span>$20,000</span>
              </div>
            </div>

            {/* Work-Life Balance & Job Satisfaction */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Work Life Balance */}
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Work-Life Balance</span>
                  <span className="font-mono text-indigo-400 font-bold">Level {workLifeBalance} / 4</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={workLifeBalance}
                  onChange={(e) => setWorkLifeBalance(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1 (Poor)</span>
                  <span>4 (Best)</span>
                </div>
              </div>

              {/* Job Satisfaction */}
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Job Satisfaction</span>
                  <span className="font-mono text-indigo-400 font-bold">Level {jobSatisfaction} / 4</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={jobSatisfaction}
                  onChange={(e) => setJobSatisfaction(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1 (Low)</span>
                  <span>4 (Very High)</span>
                </div>
              </div>
            </div>

            {/* Environment Satisfaction & Stock Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Environment Satisfaction */}
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Workplace Environment</span>
                  <span className="font-mono text-indigo-400 font-bold">Level {environmentSatisfaction} / 4</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={environmentSatisfaction}
                  onChange={(e) => setEnvironmentSatisfaction(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Stock Option Level */}
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Stock Option Tier</span>
                  <span className="font-mono text-cyan-400 font-bold">Tier {stockOptionLevel}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="1"
                  value={stockOptionLevel}
                  onChange={(e) => setStockOptionLevel(parseInt(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Commute Distance */}
            <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-slate-400" />
                  Commute Distance (or Hybrid Transit Impact)
                </span>
                <span className="font-mono text-slate-300 font-bold">{distanceFromHome} miles</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={distanceFromHome}
                onChange={(e) => setDistanceFromHome(parseInt(e.target.value))}
                className="w-full accent-slate-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Simulated Outcome & Risk Delta (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Comparison Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Simulated Flight Risk Impact</span>
            </h3>

            {simResult ? (
              <div className="space-y-4">
                {/* Before vs After Card */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  {/* Original */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                      Baseline Risk
                    </span>
                    <div className="text-3xl font-extrabold text-slate-300 mt-2">
                      {simResult.original_risk_score}%
                    </div>
                    <span className="inline-block mt-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {simResult.original_category} Risk
                    </span>
                  </div>

                  {/* Simulated */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 shadow-lg shadow-indigo-500/10">
                    <span className="text-[11px] font-semibold uppercase text-indigo-400 tracking-wider">
                      Simulated Risk
                    </span>
                    <div className="text-3xl font-extrabold text-indigo-300 mt-2">
                      {simResult.simulated_risk_score}%
                    </div>
                    <span
                      className={`inline-block mt-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        simResult.simulated_category === 'High'
                          ? 'bg-red-500/20 text-red-300'
                          : simResult.simulated_category === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {simResult.simulated_category} Risk
                    </span>
                  </div>
                </div>

                {/* Net Change Banner */}
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    simResult.risk_reduction_percentage > 0
                      ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <TrendingDown className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider">Net Retention Impact</div>
                      <div className="text-xs text-slate-400">
                        {simResult.risk_reduction_percentage > 0
                          ? 'Projected flight probability lowered'
                          : 'No net flight risk reduction'}
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-black font-mono">
                    {simResult.risk_reduction_percentage > 0 ? '-' : ''}
                    {Math.abs(simResult.risk_reduction_percentage)}%
                  </div>
                </div>

                {/* Updated Top Drivers Under Simulation */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Simulated Top Drivers (SHAP)
                  </h4>
                  <div className="space-y-2">
                    {simResult.top_simulated_drivers.map((d, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs"
                      >
                        <span className="font-mono text-slate-300">{d.feature.replace('_Yes', '')}</span>
                        <span
                          className={`font-mono font-bold ${
                            d.shap > 0 ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {d.shap > 0 ? `+${d.shap.toFixed(4)}` : d.shap.toFixed(4)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Adjust any policy slider on the left to trigger live simulation.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
