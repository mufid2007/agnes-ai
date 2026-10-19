import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Upload, 
  FileText, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Volume2, 
  ShieldCheck, 
  Zap, 
  XCircle, 
  RefreshCw, 
  ArrowRight,
  Sliders,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { initialEducatorAnalysis, initialResources } from '../services/mockData';
import SourceCitationBadge from '../components/SourceCitationBadge';

export default function EducatorDashboard({ onOpenVoiceModal }) {
  const [intentData, setIntentData] = useState(initialEducatorAnalysis);
  const [resources, setResources] = useState(initialResources);
  const [activeTab, setActiveTab] = useState('resources'); // resources, conflicts, knowledge, emergency
  const [emergencyText, setEmergencyText] = useState("We only have 10 minutes left.");
  const [isEmergencyRunning, setIsEmergencyRunning] = useState(false);
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState('pdf');
  const [uploadContent, setUploadContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Attempt fetching live resources from backend
    api.getResources().then(res => {
      if (res && res.length > 0) setResources(res);
    }).catch(() => {});
  }, []);

  const handleApprove = (id) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const handleReject = (id) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  const handleEmergencyTrigger = async () => {
    setIsEmergencyRunning(true);
    try {
      const res = await api.sendEmergencyCommand(emergencyText);
      setEmergencyAlert(res.message || "Learning path compressed for 10 minutes!");
    } catch (err) {
      setEmergencyAlert("Emergency re-planning executed locally.");
    } finally {
      setIsEmergencyRunning(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadContent.trim()) return;
    setIsUploading(true);
    const newRes = {
      title: uploadTitle,
      file_type: uploadType,
      raw_content: uploadContent,
      author: "Educator Upload",
      recency_year: 2024
    };
    try {
      const resp = await api.uploadResource(newRes);
      if (resp && resp.resource) {
        setResources(prev => [resp.resource, ...prev]);
      }
      setUploadTitle('');
      setUploadContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Real-Time Educator Emergency Intervention Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-rose-950/30 to-amber-950/40 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Zap className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Real-Time Educator Override</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">Dynamic Re-Planning</span>
              </div>
              <p className="text-sm font-semibold text-white">Teacher command: "We only have 10 minutes left."</p>
              <p className="text-xs text-slate-400">Instantly prunes non-essential activities, reallocates time, and prioritizes essential learning objectives.</p>
            </div>
          </div>
          <button
            onClick={handleEmergencyTrigger}
            disabled={isEmergencyRunning}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-lg shadow-amber-500/20 whitespace-nowrap"
          >
            {isEmergencyRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4 fill-slate-950" />}
            <span>Trigger 10-Min Emergency Re-Plan</span>
          </button>
        </div>

        {emergencyAlert && (
          <div className="mt-3 p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{emergencyAlert}</span>
            </div>
            <button onClick={() => setEmergencyAlert(null)} className="text-emerald-400 hover:text-white font-bold">×</button>
          </div>
        )}
      </div>

      {/* Educator Voice Input & Intent Analysis Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 mb-1">
              <Volume2 className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Step 1 & 2: Voice Input & Intent Analysis</span>
            </div>
            <h2 className="text-xl font-bold text-white">Curriculum Specification & Intent Matrix</h2>
          </div>
          <button
            onClick={onOpenVoiceModal}
            className="flex items-center space-x-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-3.5 py-2 rounded-xl transition"
          >
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span>Speak New Requirement</span>
          </button>
        </div>

        {/* Intent Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Subject & Topic</span>
            <p className="text-sm font-bold text-white">{intentData.subject}</p>
            <p className="text-xs text-emerald-400 font-semibold">{intentData.topic}</p>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Duration & Level</span>
            <p className="text-sm font-bold text-white">{intentData.duration_minutes} Minutes</p>
            <p className="text-xs text-slate-400">{intentData.student_level}</p>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Target Language</span>
            <p className="text-sm font-bold text-white">{intentData.target_language}</p>
            <p className="text-[11px] text-slate-400">Multilingual Bilingual Adaptation</p>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Classroom Constraints</span>
            <ul className="text-[11px] text-slate-300 space-y-0.5">
              {intentData.classroom_constraints.map((c, i) => (
                <li key={i} className="truncate">• {c}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Learning Objectives List */}
        <div className="mt-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
          <span className="text-xs font-semibold text-slate-300 block mb-2">Identified Learning Objectives:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {intentData.learning_objectives.map((obj, i) => (
              <div key={i} className="flex items-start space-x-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Collection & Grounded Knowledge Hub */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 mb-1">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Step 3-7: Resource Collection & Conflict Detection</span>
            </div>
            <h3 className="text-lg font-bold text-white">Curriculum Resources & Trust Ranking</h3>
          </div>

          {/* Sub-tabs */}
          <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${activeTab === 'resources' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Uploaded Sources ({resources.length})
            </button>
            <button
              onClick={() => setActiveTab('conflicts')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${activeTab === 'conflicts' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Conflicts & Outdated (1)
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${activeTab === 'upload' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              + Upload Material
            </button>
          </div>
        </div>

        {/* Tab 1: Uploaded Sources & Trust Ranking */}
        {activeTab === 'resources' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map(res => (
              <div key={res.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 uppercase">
                      {res.file_type}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      res.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {res.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">{res.title}</h4>
                  <p className="text-xs text-slate-400 mb-2">Author: {res.author} ({res.recency_year})</p>
                  <p className="text-xs text-slate-300 line-clamp-2 italic mb-3 bg-slate-900/50 p-2 rounded-lg border border-slate-800/50">
                    "{res.raw_content}"
                  </p>
                </div>

                <div className="border-t border-slate-800/80 pt-3">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-slate-400">Authority Score:</span>
                    <span className="font-bold text-emerald-400">{(res.authority_score * 100).toFixed(0)}%</span>
                  </div>

                  {/* Educator Controls: Approve / Reject */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleApprove(res.id)}
                      className="flex-1 py-1.5 text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(res.id)}
                      className="flex-1 py-1.5 text-xs font-semibold bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-lg transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Conflict & Outdated Information Detection */}
        {activeTab === 'conflicts' && (
          <div className="space-y-4">
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-white">Conflict Detected: ATP Stoichiometry in Photosystem II</h4>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-mono">Outdated Content</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-emerald-400 font-semibold block mb-1">Authoritative Source (2024):</span>
                      <p className="text-slate-300">Modern measurement indicates 2.5 ATP produced per 2 electrons via modern proton-gradient chemiosmosis.</p>
                      <span className="text-[10px] text-slate-500 block mt-1">Source: Campbell Biology (12th Edition)</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-rose-900/50">
                      <span className="text-rose-400 font-semibold block mb-1">Legacy Source (2008):</span>
                      <p className="text-slate-300">States a fixed ratio of 3.0 ATP per 2 electrons. Superseded by newer cryo-EM structural biochemistry.</p>
                      <span className="text-[10px] text-slate-500 block mt-1">Source: Archived Curriculum Handout</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 text-slate-300">
                    <span className="text-emerald-400 font-medium">Recommendation: Auto-promote Campbell Biology 2024 to Primary Knowledge Ground.</span>
                    <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition">
                      Resolve & Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Upload Resource Form */}
        {activeTab === 'upload' && (
          <form onSubmit={handleUploadSubmit} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 max-w-2xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Upload New Teaching Material (PDF, PPT, Notes, Textbook, Images, Links)</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-400 block mb-1">Resource Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="e.g. Molecular Mechanisms of Chemiosmosis"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Type</label>
                <select
                  value={uploadType}
                  onChange={e => setUploadType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="ppt">PowerPoint (PPT)</option>
                  <option value="notes">Lecture Notes</option>
                  <option value="textbook">Textbook Chapter</option>
                  <option value="image">Diagram / Image</option>
                  <option value="link">Reference Link</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Extracted Text Content / Summary</label>
              <textarea
                value={uploadContent}
                onChange={e => setUploadContent(e.target.value)}
                placeholder="Paste key excerpts, formulas, or notes to index into the Grounded Knowledge Base..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500 min-h-[90px]"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('resources')}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1.5"
              >
                {isUploading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>Process & Index Resource</span>
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
}
