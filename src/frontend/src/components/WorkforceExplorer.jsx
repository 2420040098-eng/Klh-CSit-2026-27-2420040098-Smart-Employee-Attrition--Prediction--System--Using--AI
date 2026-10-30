import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Sparkles, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  Briefcase,
  DollarSign,
  Clock
} from 'lucide-react';

export default function WorkforceExplorer({ 
  onSelectEmployee, 
  onOpenSimulator, 
  initialRiskFilter = 'All',
  initialOvertimeFilter = 'All' 
}) {
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [jobRole, setJobRole] = useState('All');
  const [riskCategory, setRiskCategory] = useState(initialRiskFilter);
  const [overTime, setOverTime] = useState(initialOvertimeFilter);
  const [sortBy, setSortBy] = useState('probability');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter options
  const [departments, setDepartments] = useState(['All']);
  const [roles, setRoles] = useState(['All']);

  useEffect(() => {
    fetch('/api/employees/filters')
      .then(res => res.json())
      .then(data => {
        setDepartments(data.departments || ['All']);
        setRoles(data.job_roles || ['All']);
      })
      .catch(err => console.error(err));
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        sort_by: sortBy,
        sort_order: sortOrder
      });

      if (department !== 'All') params.append('department', department);
      if (jobRole !== 'All') params.append('job_role', jobRole);
      if (riskCategory !== 'All') params.append('risk_category', riskCategory);
      if (overTime !== 'All') params.append('over_time', overTime);
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`/api/employees?${params.toString()}`);
      const data = await res.json();
      setEmployees(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, department, jobRole, riskCategory, overTime, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEmployees();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Workforce Risk Directory</h2>
          <p className="text-sm text-slate-400 mt-1">
            Browse and inspect all 1,470 employee profiles with AI-predicted attrition probabilities
          </p>
        </div>
        <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span>Showing</span>
          <span className="font-semibold text-white">{employees.length}</span>
          <span>of</span>
          <span className="font-semibold text-white">{total}</span>
          <span>records</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Employee Name, ID (e.g. EMP-00042), or Job Role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-lg pl-9 pr-4 py-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition"
          >
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); setPage(1); }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition"
            >
              Clear
            </button>
          )}
        </form>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-800/80 text-xs">
          {/* Department */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Department</label>
            <select
              value={department}
              onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Job Role */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Job Role</label>
            <select
              value={jobRole}
              onChange={(e) => { setJobRole(e.target.value); setPage(1); }}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Risk Category</label>
            <select
              value={riskCategory}
              onChange={(e) => { setRiskCategory(e.target.value); setPage(1); }}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="High">High Risk (≥60%)</option>
              <option value="Medium">Medium Risk (30-59%)</option>
              <option value="Low">Low Risk (&lt;30%)</option>
            </select>
          </div>

          {/* Overtime */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Overtime Status</label>
            <select
              value={overTime}
              onChange={(e) => { setOverTime(e.target.value); setPage(1); }}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Yes">Overtime: Yes</option>
              <option value="No">Overtime: No</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Sort By</label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb);
                setSortOrder(so);
                setPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="probability-desc">Risk: High to Low</option>
              <option value="probability-asc">Risk: Low to High</option>
              <option value="monthly_income-desc">Salary: High to Low</option>
              <option value="monthly_income-asc">Salary: Low to High</option>
              <option value="years_at_company-desc">Tenure: High to Low</option>
              <option value="years_at_company-asc">Tenure: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-3">Role & Dept</th>
                <th className="py-3 px-3">Compensation</th>
                <th className="py-3 px-3">Tenure</th>
                <th className="py-3 px-3">Flight Risk</th>
                <th className="py-3 px-3">Top SHAP Driver</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    Loading employee directory...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No employees found matching filter criteria.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => {
                  const isHigh = emp.risk_category === 'High';
                  const isMed = emp.risk_category === 'Medium';
                  const isLow = emp.risk_category === 'Low';

                  return (
                    <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                      {/* Name & ID */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatar_url}
                            alt={emp.full_name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <div className="font-semibold text-white hover:text-indigo-400 cursor-pointer" onClick={() => onSelectEmployee(emp.id)}>
                              {emp.full_name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {emp.employee_number} • {emp.age} yrs • {emp.gender}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Dept */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-200">{emp.job_role}</div>
                        <div className="text-[11px] text-slate-400">{emp.department}</div>
                      </td>

                      {/* Compensation */}
                      <td className="py-3 px-3">
                        <div className="font-mono text-slate-200 font-medium">
                          ${emp.monthly_income.toLocaleString()} /mo
                        </div>
                        <div className="text-[11px] flex items-center gap-1 mt-0.5">
                          {emp.over_time === 'Yes' ? (
                            <span className="text-red-400 font-medium flex items-center gap-0.5">
                              <Clock className="w-3 h-3" /> OT: Yes
                            </span>
                          ) : (
                            <span className="text-slate-400">OT: No</span>
                          )}
                        </div>
                      </td>

                      {/* Tenure */}
                      <td className="py-3 px-3">
                        <span className="text-slate-200 font-mono">{emp.years_at_company} yrs</span>
                        <div className="text-[11px] text-slate-400">at company</div>
                      </td>

                      {/* Risk Level Badge */}
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded font-bold text-[11px] ${
                              isHigh
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : isMed
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {emp.risk_score}% ({emp.risk_category})
                          </span>
                        </div>
                      </td>

                      {/* Top SHAP Driver */}
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono">
                          {emp.top_risk_driver ? emp.top_risk_driver.replace('_Yes', '') : 'Balanced'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectEmployee(emp.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 transition"
                            title="Open Explainable AI SHAP Breakdown"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>XAI</span>
                          </button>
                          <button
                            onClick={() => onOpenSimulator(emp.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
                            title="Simulate Retention Policy"
                          >
                            <SlidersHorizontal className="w-3 h-3" />
                            <span>Simulate</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Page <span className="font-semibold text-white">{page}</span> of{' '}
            <span className="font-semibold text-white">{totalPages}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 disabled:opacity-40 hover:bg-slate-800 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
