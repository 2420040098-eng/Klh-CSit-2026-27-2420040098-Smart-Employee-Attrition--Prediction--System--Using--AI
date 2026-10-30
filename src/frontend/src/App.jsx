import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import WorkforceExplorer from './components/WorkforceExplorer';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import WhatIfSimulator from './components/WhatIfSimulator';
import ModelBenchmark from './components/ModelBenchmark';
import RetentionTracker from './components/RetentionTracker';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [directoryRiskFilter, setDirectoryRiskFilter] = useState('All');
  const [directoryOvertimeFilter, setDirectoryOvertimeFilter] = useState('All');

  // Navigation callbacks
  const handleOpenEmployeeDetail = (empId) => {
    setSelectedEmployeeId(empId);
    setIsModalOpen(true);
  };

  const handleOpenSimulator = (empId) => {
    setSelectedEmployeeId(empId);
    setActiveTab('simulator');
  };

  const handleNavigateToDirectory = (riskFilter = 'All', otFilter = 'All') => {
    setDirectoryRiskFilter(riskFilter);
    setDirectoryOvertimeFilter(otFilter);
    setActiveTab('directory');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <ExecutiveDashboard
            onNavigateToDirectory={handleNavigateToDirectory}
            onSelectEmployee={handleOpenEmployeeDetail}
          />
        )}

        {activeTab === 'directory' && (
          <WorkforceExplorer
            onSelectEmployee={handleOpenEmployeeDetail}
            onOpenSimulator={handleOpenSimulator}
            initialRiskFilter={directoryRiskFilter}
            initialOvertimeFilter={directoryOvertimeFilter}
          />
        )}

        {activeTab === 'xai' && (
          <div className="space-y-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5">
              <h2 className="text-xl font-bold text-white mb-2">Explainable AI (SHAP) Interactive Workspace</h2>
              <p className="text-xs text-slate-400 mb-4">
                Explore local SHAP feature attributions, waterfall positive vs negative forces, and actionable AI recommendations.
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-300 font-semibold">Select Employee ID:</span>
                <input
                  type="number"
                  min="1"
                  max="1470"
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(parseInt(e.target.value) || 1)}
                  className="w-24 bg-slate-950 border border-slate-700 text-white rounded px-3 py-1.5 text-xs text-center font-mono focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded transition"
                >
                  Open Full XAI Diagnostic Modal
                </button>
              </div>
            </div>

            {/* Embedded view */}
            <div className="relative">
              <EmployeeDetailModal
                employeeId={selectedEmployeeId}
                onClose={() => {}}
                onOpenSimulator={handleOpenSimulator}
              />
            </div>
          </div>
        )}

        {activeTab === 'simulator' && (
          <WhatIfSimulator preselectedEmployeeId={selectedEmployeeId} />
        )}

        {activeTab === 'benchmarks' && (
          <ModelBenchmark />
        )}

        {activeTab === 'retention' && (
          <RetentionTracker onSelectEmployee={handleOpenEmployeeDetail} />
        )}
      </main>

      {/* Pop-up XAI Detail Modal */}
      {isModalOpen && (
        <EmployeeDetailModal
          employeeId={selectedEmployeeId}
          onClose={() => setIsModalOpen(false)}
          onOpenSimulator={handleOpenSimulator}
        />
      )}

      {/* Enterprise Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-slate-300">AttritiXAI Decision Support Framework</span>
            <span className="mx-2">•</span>
            <span>Department of Computer Science and Information Technology, KLEF</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>FastAPI + SQLite</span>
            <span>•</span>
            <span>Scikit-Learn & SHAP</span>
            <span>•</span>
            <span>React & Vite</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
