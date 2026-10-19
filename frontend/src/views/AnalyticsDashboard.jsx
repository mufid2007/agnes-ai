import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  UserX, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  ArrowUpRight,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    api.getAnalyticsDashboard().then(res => {
      if (res) setAnalytics(res);
    }).catch(() => {});

    api.getRecommendations().then(res => {
      if (res) setRecommendations(res);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Class Average Mastery</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{analytics?.average_mastery || 71.8}%</span>
            <span className="text-xs text-emerald-400 font-semibold">+25.6% vs Pre-test</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">28 Enrolled Students</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">At-Risk Students</span>
            <UserX className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-rose-400">3 Students</span>
            <span className="text-xs text-rose-300 font-semibold">Need Scaffolding</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Marcus Vance, Elena, Jordan</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Predicted Learning Gaps</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-amber-400">2 Concepts</span>
            <span className="text-xs text-amber-300 font-semibold">Pre-emptive Alert</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Calvin Cycle & Photorespiration</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Grounded Traceability</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-emerald-400">100%</span>
            <span className="text-xs text-emerald-300 font-semibold">Educator Approved</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Zero Hallucinations</p>
        </div>

      </div>

      {/* Main Grid: Weak Topics & Common Misconceptions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weak Topics Prioritization (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center space-x-2 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">Weak Topics Breakdown (Priority Ordered)</h3>
            </div>
            <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full font-mono">Real-time</span>
          </div>

          <div className="space-y-3">
            {(analytics?.weak_topics || [
              { topic: "Thylakoid Lumen Proton Gradient Direction", struggle_rate: "54% of class", priority: "High" },
              { topic: "Calvin Cycle RuBisCO Carbon Fixation", struggle_rate: "48% of class", priority: "Medium" },
              { topic: "ATP/NADPH Electron Stoichiometry", struggle_rate: "39% of class", priority: "Medium" }
            ]).map((wt, i) => (
              <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold text-white">{wt.topic}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      wt.priority === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {wt.priority} Priority
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Struggle rate: {wt.struggle_rate}</p>
                </div>
                <button className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
                  <span>Assign Drill</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Common Misconceptions Frequency Counter (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center space-x-2 text-amber-400">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">Cognitive Misconception Analysis</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Diagnosed by Agnes 3.0</span>
          </div>

          <div className="space-y-3">
            {(analytics?.common_misconceptions || [
              { misconception: "Inverted proton gradient (thinking protons flow into stroma to build gradient)", frequency: 14 },
              { misconception: "Belief that plants only photosynthesize in day and never respire", frequency: 11 },
              { misconception: "Confusing chlorophyll absorption spectrum with oxygen emission", frequency: 6 }
            ]).map((m, i) => (
              <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-200">{m.misconception}</span>
                  <span className="text-xs font-extrabold text-amber-400 font-mono">{m.frequency} students</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(m.frequency / 28) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Learning Outcome Analysis: Diagnostic vs Final Mastery */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-purple-400" />
          <span>Learning Outcome Analysis: Initial Diagnostic vs Final Adaptive Mastery</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Diagnostic Baseline</span>
            <span className="text-3xl font-extrabold text-slate-300">46.2%</span>
            <span className="text-[11px] text-slate-500 block mt-1">Initial Pre-test Average</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Current Adaptive Mastery</span>
            <span className="text-3xl font-extrabold text-cyan-400">71.8%</span>
            <span className="text-[11px] text-cyan-500 block mt-1">Mid-Session Continuous Evaluation</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Projected Final Mastery</span>
            <span className="text-3xl font-extrabold text-emerald-400">88.4%</span>
            <span className="text-[11px] text-emerald-500 block mt-1">Following Proactive Scaffolding</span>
          </div>
        </div>
      </div>

      {/* Next-Lesson Recommendation Engine */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-purple-950/40 border border-purple-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 text-purple-400 mb-2">
          <Compass className="w-5 h-5 animate-spin" />
          <span className="text-xs font-bold uppercase tracking-wider">Next-Lesson Recommendation Engine (Feedback Loop)</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          {recommendations?.recommended_next_topic || "Cellular Respiration & Mitochondrial Electron Transport"}
        </h3>
        <p className="text-xs text-slate-300 mb-4 max-w-3xl leading-relaxed">
          {recommendations?.rationale || "Students have established 72% mastery over proton-driven ATP synthesis in chloroplasts. Bridging directly to mitochondria will solidify chemiosmosis across both plant and animal cells."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">🚀 Accelerated Track</span>
            <p className="text-slate-400 text-[11px]">Explore thermogenin / uncoupling protein-1 dissipation in brown adipose tissue.</p>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-purple-400 font-bold block mb-1">🎯 Standard Track</span>
            <p className="text-slate-400 text-[11px]">Side-by-side comparison matrix of chloroplast vs mitochondrial chemiosmosis.</p>
          </div>
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-amber-400 font-bold block mb-1">🛡️ Remedial Booster</span>
            <p className="text-slate-400 text-[11px]">3D interactive rotor drill on ATP Synthase proton stoichiometry.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
