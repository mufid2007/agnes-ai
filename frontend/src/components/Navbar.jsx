import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  UserCheck, 
  BarChart3, 
  Terminal, 
  Key, 
  Cpu, 
  Volume2, 
  CheckCircle2 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenKeyModal, onOpenVoiceModal }) {
  return (
    <header className="border-b border-slate-800 bg-[#0f172a]/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Agent Badge */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg text-white tracking-tight">Agnes</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> 3.0 Flash
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Autonomous Adaptive Educational Ecosystem</p>
          </div>
        </div>

        {/* Workflow Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('educator')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'educator'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Educator Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('learner')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'learner'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Learner Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Classroom Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'console'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Agent 12 Tools Console</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenVoiceModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition"
            title="Speak Natural Educator Requirement"
          >
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Voice Input</span>
          </button>

          <button
            onClick={onOpenKeyModal}
            className="p-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Configure Gemini API Key"
          >
            <Key className="w-4 h-4 text-amber-400" />
          </button>
        </div>

      </div>
    </header>
  );
}
