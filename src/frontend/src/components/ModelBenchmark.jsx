import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  CheckCircle, 
  Award, 
  FileText, 
  Download, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  Info
} from 'lucide-react';

export default function ModelBenchmark() {
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [globalImportance, setGlobalImportance] = useState([]);
  const [selectedModelName, setSelectedModelName] = useState('Random Forest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/models/evaluations').then(res => res.json()),
      fetch('/api/models/global-importance').then(res => res.json())
    ])
      .then(([evals, gImp]) => {
        setBenchmarkData(evals);
        setGlobalImportance(gImp.global_importance || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !benchmarkData) {
    return (
      <div className="py-20 text-center text-slate-400">
        <BarChart3 className="w-8 h-8 animate-spin mx-auto text-indigo-500 mb-3" />
        <p className="text-sm">Loading Research Paper Benchmark Metrics...</p>
      </div>
    );
  }

  const selectedModel = benchmarkData.evaluations.find(m => m.model_name === selectedModelName) || benchmarkData.evaluations[0];

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(benchmarkData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'XAI_Attrition_Research_Paper_Results.json';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Title & Research Paper Callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Research Paper Performance Evaluation
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Section XIII
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Empirical measurements on 20% stratified test set replacing prior "NR" paper placeholders
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow"
        >
          <Download className="w-4 h-4" />
          <span>Export Results (JSON)</span>
        </button>
      </div>

      {/* Official Paper Section XIII Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Table XIII: Classification Model Performance Comparison
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            N = 294 test records • Seed = 42
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-300 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Model Architecture</th>
                <th className="py-3 px-3">Classification Type</th>
                <th className="py-3 px-3 text-center">Accuracy</th>
                <th className="py-3 px-3 text-center">Precision</th>
                <th className="py-3 px-3 text-center">Recall</th>
                <th className="py-3 px-3 text-center">F1-Score</th>
                <th className="py-3 px-3 text-center">ROC-AUC</th>
                <th className="py-3 px-4 text-center">Paper Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {benchmarkData.evaluations.map((m) => {
                const isSelected = m.model_name === selectedModelName;
                return (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedModelName(m.model_name)}
                    className={`cursor-pointer transition ${
                      isSelected
                        ? 'bg-indigo-950/40 border-l-4 border-indigo-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      {m.model_name}
                      {m.is_best_model && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Proposed Best
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{m.model_type}</td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-200">
                      {(m.accuracy * 100).toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-200">
                      {(m.precision * 100).toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-200">
                      {(m.recall * 100).toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-indigo-300 font-bold">
                      {(m.f1_score * 100).toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-cyan-300 font-bold">
                      {(m.roc_auc * 100).toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" /> Measured
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 2: Selected Model Confusion Matrix & Hyperparameters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Confusion Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              Confusion Matrix: {selectedModel.model_name}
            </h3>
            <span className="text-xs text-slate-400">Held-out Test Evaluation</span>
          </div>

          {/* 2x2 Matrix */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            {/* True Negative */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400">True Negative (Stayed)</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {selectedModel.confusion_matrix.tn}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Correctly identified non-attrition</p>
            </div>

            {/* False Positive */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400">False Positive (False Alarm)</span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                {selectedModel.confusion_matrix.fp}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Predicted exit but stayed</p>
            </div>

            {/* False Negative */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400">False Negative (Missed)</span>
              <div className="text-2xl font-bold font-mono text-red-400 mt-1">
                {selectedModel.confusion_matrix.fn}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Missed attrition case</p>
            </div>

            {/* True Positive */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-semibold text-slate-400">True Positive (Detected)</span>
              <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">
                {selectedModel.confusion_matrix.tp}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Correctly flagged departure</p>
            </div>
          </div>

          {/* Parameters info */}
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Hyperparameters:</span>
            <span>{JSON.stringify(selectedModel.hyperparameters)}</span>
          </div>
        </div>

        {/* Global SHAP Feature Importance (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Global SHAP Feature Importance Ranking</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Mean absolute SHAP value E[|SHAP|] across all 1,470 employees
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-300 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded">
              TreeSHAP
            </span>
          </div>

          <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-2">
            {globalImportance.map((item, idx) => {
              const maxVal = globalImportance[0]?.importance || 0.05;
              const widthPct = (item.importance / maxVal) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-300">
                      {idx + 1}. {item.feature.replace('_Yes', '')}
                    </span>
                    <span className="font-mono text-slate-400 font-semibold">
                      {item.importance.toFixed(4)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Research Paper Governance & Ethical AI Box (Sections X, XVI) */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
          <Info className="w-4 h-4" />
          <span>Section XVI: Governance, Validity & Responsible HR Use</span>
        </div>
        <p className="leading-relaxed">
          1. <strong>Attribution ≠ Causation:</strong> SHAP values explain model associations within historical data, not absolute psychological intention. High risk probability is an operational trigger for supportive dialogue, never disciplinary or termination decisions.
        </p>
        <p className="leading-relaxed">
          2. <strong>Balanced Optimization:</strong> Class imbalance (16.1% attrition) is actively compensated via class weighting and calibrated thresholds.
        </p>
      </div>
    </div>
  );
}
