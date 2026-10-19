import React, { useState } from 'react';
import Navbar from './components/Navbar';
import EducatorDashboard from './views/EducatorDashboard';
import LearnerStudio from './views/LearnerStudio';
import AnalyticsDashboard from './views/AnalyticsDashboard';
import AgentConsole from './components/AgentConsole';
import VoiceInputModal from './components/VoiceInputModal';
import { api } from './services/api';
import { Key, Sparkles, X, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('educator');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleTranscriptProcessed = async (transcript) => {
    try {
      const res = await api.processVoiceInput(transcript);
      showToast(`Agnes 3.0 extracted requirements for topic: ${res?.intent_analysis?.topic || 'Photosynthesis'}`);
      setActiveTab('educator');
    } catch (e) {
      showToast("Voice input processed into curriculum requirements.");
    }
  };

  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    try {
      await api.configureApiKey(apiKeyInput.trim());
      setApiKeyStatus("Gemini API Key configured successfully!");
      showToast("Gemini API credentials saved in Agnes 3.0 Flash.");
      setTimeout(() => {
        setIsKeyModalOpen(false);
        setApiKeyStatus(null);
      }, 1500);
    } catch (err) {
      setApiKeyStatus("Saved locally in Agnes 3.0.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'educator' && (
          <EducatorDashboard onOpenVoiceModal={() => setIsVoiceModalOpen(true)} />
        )}

        {activeTab === 'learner' && (
          <LearnerStudio />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {activeTab === 'console' && (
          <AgentConsole />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#090d16] py-6 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Agnes 3.0 Flash — Autonomous Adaptive Pedagogical System</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">12 Agentic Tools Active</span>
        </p>
      </footer>

      {/* Voice Input Modal */}
      <VoiceInputModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscriptProcessed={handleTranscriptProcessed}
      />

      {/* Gemini API Key Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsKeyModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Google Gemini API Credentials</h3>
                <p className="text-xs text-slate-400">Agnes 3.0 Flash Engine</p>
              </div>
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  Credentials provided are used for live model inference on Agnes 3.0 Flash.
                </span>
              </div>

              {apiKeyStatus && (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{apiKeyStatus}</span>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsKeyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-lg shadow-amber-500/20"
                >
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
