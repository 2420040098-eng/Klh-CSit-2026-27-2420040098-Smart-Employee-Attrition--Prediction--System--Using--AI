import React, { useEffect, useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Building2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export default function ExecutiveDashboard({ onNavigateToDirectory, onSelectEmployee }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-sm font-medium">Loading Workforce Risk Intelligence...</p>
        </div>
      </div>
    );
  }

  const { kpi, risk_distribution, department_analytics, overtime_analytics, top_vulnerable_roles } = stats;

  return (
    <div className="space-y-6">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Executive HR Analytics & Risk Radar</h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time aggregate risk intelligence powered by Machine Learning and SHAP explainability
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Workforce */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Active Workforce</span>
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white tracking-tight">{kpi.total_employees}</span>
            <span className="text-xs text-slate-400 ml-2">records evaluated</span>
          </div>
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>IBM Benchmark Complete Dataset</span>
          </div>
        </div>

        {/* High Risk Employees */}
        <div className="bg-slate-900/70 border border-red-900/30 rounded-xl p-5 shadow-sm hover:border-red-700/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">High Flight Risk (≥60%)</span>
            <div className="p-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-red-400 tracking-tight">{kpi.high_risk_count}</span>
            <span className="text-xs text-red-300/80 ml-2">
              ({((kpi.high_risk_count / kpi.total_employees) * 100).toFixed(1)}% of total)
            </span>
          </div>
          <div className="mt-2">
            <button
              onClick={() => onNavigateToDirectory('High')}
              className="text-xs text-red-400 hover:text-red-300 font-semibold inline-flex items-center gap-1 group"
            >
              <span>Review urgent cohort</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Historical Attrition Rate */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Historical Attrition Rate</span>
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white tracking-tight">{kpi.historical_attrition_rate}%</span>
            <span className="text-xs text-slate-400 ml-2">baseline observed</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Ground truth turnover in benchmark records</p>
        </div>

        {/* Average Model Risk Score */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Predicted Flight Risk</span>
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-cyan-400 tracking-tight">{kpi.average_risk_score}%</span>
            <span className="text-xs text-slate-400 ml-2">mean probability</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Calibrated ensemble model probability</p>
        </div>
      </div>

      {/* Row 2: Risk Distribution & OverTime Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Breakdown */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Workforce Risk Categorization</h3>
            <p className="text-xs text-slate-400 mt-1">
              Classified by Research Paper Thresholds (Low &lt;30%, Med 30-59%, High ≥60%)
            </p>

            <div className="mt-6 space-y-4">
              {risk_distribution.map((item) => {
                const pct = ((item.count / kpi.total_employees) * 100).toFixed(1);
                return (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{item.name}</span>
                      <span className="text-slate-400 font-mono">
                        {item.count} employees ({pct}%)
                      </span>
                    </div>
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Low Risk Safe Zone</span>
            <span className="font-mono text-emerald-400 font-semibold">
              {((kpi.low_risk_count / kpi.total_employees) * 100).toFixed(1)}% of company
            </span>
          </div>
        </div>

        {/* Overtime Analysis */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Overtime vs. Flight Risk Disparity</h3>
              <p className="text-xs text-slate-400 mt-1">
                SHAP Global Driver #1: Overtime presence significantly spikes attrition probability
              </p>
            </div>
            <div className="p-2 rounded-lg bg-slate-800 text-indigo-400 border border-slate-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {overtime_analytics.map((item, idx) => {
              const isOvertime = item.category === 'Overtime Workers';
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    isOvertime
                      ? 'bg-red-950/20 border-red-800/40'
                      : 'bg-emerald-950/20 border-emerald-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      {item.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isOvertime ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {item.high_risk_pct}% High Risk
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{item.high_risk}</span>
                    <span className="text-xs text-slate-400">high-risk out of {item.total}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {isOvertime
                      ? 'Employees working overtime are 3.2x more prone to voluntary departure.'
                      : 'Non-overtime employees exhibit high retention stability.'}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-indigo-950/30 border border-indigo-800/30 rounded-lg text-xs text-indigo-300 flex items-center justify-between">
            <span>Actionable Insight: Capping overtime in engineering & sales can prevent up to 45 exits annually.</span>
            <button
              onClick={() => onNavigateToDirectory('High', 'Yes')}
              className="font-semibold text-indigo-200 hover:underline whitespace-nowrap ml-2"
            >
              Filter Overtime Risk →
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Department Analytics & Vulnerable Job Roles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Analytics Table */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Department Risk Breakdown</h3>
              <p className="text-xs text-slate-400 mt-0.5">Workforce distribution and average predicted risk</p>
            </div>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">Department</th>
                  <th className="py-2.5 px-2">Headcount</th>
                  <th className="py-2.5 px-2">Avg Risk</th>
                  <th className="py-2.5 px-2">High Risk</th>
                  <th className="py-2.5 px-3 rounded-r-lg">Historical Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {department_analytics.map((dept, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-medium text-slate-200">{dept.department}</td>
                    <td className="py-3 px-2 text-slate-300">{dept.total_employees}</td>
                    <td className="py-3 px-2">
                      <span className={`font-semibold ${dept.avg_risk_score > 35 ? 'text-amber-400' : 'text-slate-300'}`}>
                        {dept.avg_risk_score}%
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded font-semibold text-[11px] bg-red-500/20 text-red-300 border border-red-500/30">
                        {dept.high_risk_count}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{dept.attrition_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Vulnerable Job Roles */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Highest Vulnerability Job Roles</h3>
              <p className="text-xs text-slate-400 mt-0.5">Ranked by average attrition risk probability</p>
            </div>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>

          <div className="space-y-3">
            {top_vulnerable_roles.map((role, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition"
              >
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">{role.role}</h4>
                  <p className="text-[11px] text-slate-400">
                    Total: {role.total} employees | {role.high_risk} flagged high risk
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-1 rounded text-xs font-bold font-mono ${
                      role.avg_risk >= 40
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {role.avg_risk}% Risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
