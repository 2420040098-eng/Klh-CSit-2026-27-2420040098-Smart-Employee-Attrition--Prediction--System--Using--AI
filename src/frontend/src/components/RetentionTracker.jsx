import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function RetentionTracker({ onSelectEmployee }) {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const fetchActions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (priorityFilter !== 'All') params.append('priority', priorityFilter);

      const res = await fetch(`/api/retention-actions?${params.toString()}`);
      const data = await res.json();
      setActions(data.actions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, [statusFilter, priorityFilter]);

  const handleUpdateStatus = async (actionId, newStatus) => {
    try {
      const res = await fetch(`/api/retention-actions/${actionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setActions(actions.map(a => a.id === actionId ? { ...a, status: newStatus } : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Retention Action Center</h2>
          <p className="text-sm text-slate-400 mt-1">
            Track, assign, and measure interventions for high-risk employees identified by SHAP XAI
          </p>
        </div>

        <button
          onClick={fetchActions}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Actions</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Total Interventions: <strong className="text-white">{actions.length}</strong>
        </div>
      </div>

      {/* Actions List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Loading retention plans...</div>
        ) : actions.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
            No retention actions found matching the filters.
          </div>
        ) : (
          actions.map((act) => {
            const isCompleted = act.status === 'Completed';
            const isCritical = act.priority === 'Critical';
            const isHigh = act.priority === 'High';

            return (
              <div
                key={act.id}
                className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl p-4.5 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isCritical
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : isHigh
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {act.priority}
                    </span>
                    <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {act.action_type}
                    </span>
                    <span className="text-xs text-slate-400">• Target: {act.target_date || 'Within 14 days'}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{act.title}</h3>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-medium text-slate-300">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      {act.employee_name} ({act.employee_role})
                    </span>
                    <span>•</span>
                    <span>Assigned: {act.assigned_hr}</span>
                  </div>

                  {act.notes && (
                    <p className="text-xs text-slate-400 italic pt-1">
                      "{act.notes}"
                    </p>
                  )}
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => onSelectEmployee(act.employee_id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 text-xs font-semibold transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>View XAI</span>
                  </button>

                  <select
                    value={act.status}
                    onChange={(e) => handleUpdateStatus(act.id, e.target.value)}
                    className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 border focus:outline-none transition ${
                      isCompleted
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                        : 'bg-slate-950 text-slate-200 border-slate-700'
                    }`}
                  >
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
