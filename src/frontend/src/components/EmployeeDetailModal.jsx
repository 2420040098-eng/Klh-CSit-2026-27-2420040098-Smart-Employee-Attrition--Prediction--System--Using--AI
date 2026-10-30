import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldAlert, 
  SlidersHorizontal, 
  ClipboardCheck, 
  Plus, 
  X, 
  CheckCircle2, 
  Briefcase, 
  DollarSign, 
  Award, 
  Building,
  Clock,
  HeartHandshake
} from 'lucide-react';

export default function EmployeeDetailModal({ employeeId, onClose, onOpenSimulator }) {
  const [emp, setEmp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentId, setCurrentId] = useState(employeeId);

  // New action form state
  const [showActionForm, setShowActionForm] = useState(false);
  const [actionTitle, setActionTitle] = useState('');
  const [actionType, setActionType] = useState('Workload & Overtime Reduction');
  const [priority, setPriority] = useState('High');
  const [notes, setNotes] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);

  const fetchDetail = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/employees/${id}`);
      if (!res.ok) throw new Error('Employee not found');
      const data = await res.json();
      setEmp(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentId) {
      fetchDetail(currentId);
    }
  }, [currentId]);

  const handleCreateAction = async (e) => {
    e.preventDefault();
    if (!actionTitle.trim()) return;

    try {
      setSubmittingAction(true);
      const res = await fetch('/api/retention-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: currentId,
          action_type: actionType,
          title: actionTitle,
          priority: priority,
          status: 'Planned',
          assigned_hr: 'HR Business Partner',
          notes: notes,
          target_date: 'Within 10 days'
        })
      });
      if (res.ok) {
        setActionSuccess(true);
        setTimeout(() => {
          setActionSuccess(false);
          setShowActionForm(false);
          setActionTitle('');
          setNotes('');
          fetchDetail(currentId);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAction(false);
    }
  };

  if (!currentId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Explainable AI Risk Diagnostic</span>
                <span className="text-xs font-mono font-normal text-slate-400">
                  (SHAP Local Feature Attribution)
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Transparent reason codes and predictive drivers for HR decision-support
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick ID switcher */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <span>Employee ID:</span>
              <input
                type="number"
                min="1"
                max="1470"
                value={currentId}
                onChange={(e) => setCurrentId(parseInt(e.target.value) || 1)}
                className="w-16 bg-slate-950 border border-slate-700 text-white rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          {loading || !emp ? (
            <div className="py-20 text-center text-slate-400">
              <Sparkles className="w-8 h-8 animate-spin mx-auto text-indigo-500 mb-3" />
              <p className="text-sm">Generating SHAP Local Attributions...</p>
            </div>
          ) : (
            <>
              {/* Profile Card & Flight Risk Gauge */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <img
                    src={emp.avatar_url}
                    alt={emp.full_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/50 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{emp.full_name}</h3>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {emp.employee_number}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 font-medium mt-0.5">
                      {emp.job.job_role} • {emp.job.department}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
                      <span>Age: {emp.demographics.age}</span>
                      <span>Tenure: {emp.tenure.years_at_company} yrs</span>
                      <span>Salary: ${emp.compensation.monthly_income.toLocaleString()} /mo</span>
                      <span>OverTime: <strong className={emp.workload_satisfaction.over_time === 'Yes' ? 'text-red-400' : 'text-emerald-400'}>{emp.workload_satisfaction.over_time}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Risk Gauge */}
                <div className="w-full md:w-auto flex md:flex-col items-center justify-between md:justify-center p-4 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[200px]">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Attrition Flight Risk
                  </span>
                  <div className="my-1.5 flex items-baseline gap-1">
                    <span
                      className={`text-4xl font-black tracking-tight ${
                        emp.prediction.risk_category === 'High'
                          ? 'text-red-400'
                          : emp.prediction.risk_category === 'Medium'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {emp.prediction.risk_score_pct}%
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      emp.prediction.risk_category === 'High'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : emp.prediction.risk_category === 'Medium'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {emp.prediction.risk_category} Risk Category
                  </span>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  <span>Assessed Attrition Probability: </span>
                  <strong className="text-white font-mono">{emp.prediction.probability.toFixed(4)}</strong>
                  <span className="ml-3">Model Base Expected Value: </span>
                  <strong className="text-white font-mono">{emp.prediction.shap_base_value}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onOpenSimulator(emp.id);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Run What-If Simulation</span>
                  </button>
                  <button
                    onClick={() => setShowActionForm(!showActionForm)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Retention Action</span>
                  </button>
                </div>
              </div>

              {/* Create Retention Action Form */}
              {showActionForm && (
                <form
                  onSubmit={handleCreateAction}
                  className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4" />
                      <span>Assign Proactive Retention Intervention</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowActionForm(false)}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1">Intervention Type</label>
                      <select
                        value={actionType}
                        onChange={(e) => setActionType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Workload & Overtime Reduction">Workload & Overtime Reduction</option>
                        <option value="Compensation Review">Compensation & Parity Review</option>
                        <option value="Career Growth & Promotion">Career Growth & Promotion</option>
                        <option value="Flexible Work / Remote Option">Flexible Work / Remote Option</option>
                        <option value="Management Re-assignment">Management Re-assignment</option>
                        <option value="Mentorship & Engagement">Mentorship & Engagement</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Priority</label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Action Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Schedule 1-on-1 skip level check-in"
                        value={actionTitle}
                        onChange={(e) => setActionTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs mb-1">Action Notes & HR Strategy</label>
                    <textarea
                      rows="2"
                      placeholder="Add background notes or specific discussion points..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded p-2 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    {actionSuccess && (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Action Logged Successfully!
                      </span>
                    )}
                    <button
                      type="submit"
                      disabled={submittingAction}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded transition"
                    >
                      {submittingAction ? 'Saving...' : 'Save Intervention'}
                    </button>
                  </div>
                </form>
              )}

              {/* SHAP Explainability Breakdown (Page 6 of Research Paper) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Positive Contributors (Risk Drivers) */}
                <div className="bg-slate-950/60 border border-red-950/50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Risk Pushers (Positive SHAP Drivers)</h4>
                      <p className="text-[11px] text-slate-400">Features increasing this employee's flight risk</p>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    {emp.prediction.top_positive_factors.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No significant risk increasing factors identified.</p>
                    ) : (
                      emp.prediction.top_positive_factors.map((f, idx) => {
                        const widthPct = Math.min(Math.abs(f.shap) * 350, 100);
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-200 font-mono">
                                {f.feature.replace('_Yes', '')}
                              </span>
                              <span className="font-mono text-red-400 font-bold">
                                +{f.shap.toFixed(4)}
                              </span>
                            </div>
                            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full"
                                style={{ width: `${Math.max(widthPct, 8)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Negative Contributors (Protective Anchors) */}
                <div className="bg-slate-950/60 border border-emerald-950/50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ArrowDownRight className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Retention Anchors (Negative SHAP Drivers)</h4>
                      <p className="text-[11px] text-slate-400">Protective factors keeping flight risk lower</p>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    {emp.prediction.top_negative_factors.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No protective factors recorded.</p>
                    ) : (
                      emp.prediction.top_negative_factors.map((f, idx) => {
                        const widthPct = Math.min(Math.abs(f.shap) * 350, 100);
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-200 font-mono">
                                {f.feature.replace('_Yes', '')}
                              </span>
                              <span className="font-mono text-emerald-400 font-bold">
                                {f.shap.toFixed(4)}
                              </span>
                            </div>
                            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full"
                                style={{ width: `${Math.max(widthPct, 8)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Actionable Retention Recommendations */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <ClipboardCheck className="w-4 h-4 text-indigo-400" />
                  <span>AI Recommended Retention Interventions</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {emp.prediction.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                            {rec.category}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                              rec.priority === 'High'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{rec.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Existing Retention Actions Table */}
              {emp.retention_actions.length > 0 && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
                  <h4 className="text-sm font-bold text-white mb-3">Logged Retention Action Items</h4>
                  <div className="divide-y divide-slate-800 text-xs">
                    {emp.retention_actions.map((act) => (
                      <div key={act.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-200">{act.title}</div>
                          <div className="text-[11px] text-slate-400">{act.action_type} • Assigned: {act.assigned_hr}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold text-[11px]">
                            {act.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
