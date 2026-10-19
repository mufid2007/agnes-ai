import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, X, Volume2, ArrowRight, Check } from 'lucide-react';

export default function VoiceInputModal({ isOpen, onClose, onTranscriptProcessed }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [supported, setSupported] = useState(true);

  const presetExamples = [
    "Create a 45-minute lesson on Photosynthesis and Light-Dependent Reactions for Grade 10 in English with Spanish bilingual support. Focus on thylakoid proton gradients.",
    "Emergency adaptation: We only have 10 minutes left in class! Prioritize essential concepts and prune non-core activities.",
    "Prepare a diagnostic assessment on Cellular Respiration vs Photosynthesis to identify missing prerequisites in energy stoichiometry."
  ];

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false);
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    if (!supported) {
      // Simulate live speech recording
      setIsRecording(true);
      setTranscript("Listening...");
      setTimeout(() => {
        setTranscript(presetExamples[0]);
        setIsRecording(false);
      }, 2500);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const resultText = event.results[current][0].transcript;
      setTranscript(resultText);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleProcess = async () => {
    if (!transcript.trim()) return;
    setIsProcessing(true);
    await onTranscriptProcessed(transcript);
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Educator Voice Input & Intent Analysis</h3>
            <p className="text-xs text-slate-400">Speak your teaching requirements naturally (topic, duration, student level, language)</p>
          </div>
        </div>

        {/* Microphone Pulse Area */}
        <div className="flex flex-col items-center justify-center py-6 bg-slate-950/60 rounded-xl border border-slate-800/80 my-4">
          <div className="relative mb-3">
            {isRecording && (
              <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />
            )}
            <button
              onClick={toggleRecording}
              className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl ${
                isRecording 
                  ? 'bg-rose-600 text-white shadow-rose-600/40 animate-pulse' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 hover:scale-105'
              }`}
            >
              {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>
          </div>
          <span className="text-xs font-medium text-slate-300">
            {isRecording ? "Listening to Educator's Voice..." : "Click to Start Speaking"}
          </span>
          {!supported && (
            <span className="text-[10px] text-amber-400 mt-1">
              (Live browser speech fallback active — click to simulate voice input)
            </span>
          )}
        </div>

        {/* Live / Transcribed Textbox */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex justify-between">
            <span>Transcribed Teaching Requirement</span>
            <span className="text-[11px] text-emerald-400 font-mono">Agnes Speech-to-Text</span>
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="e.g. Create a 45-minute lesson on Photosynthesis for Grade 10 in English and Spanish..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 min-h-[90px]"
          />
        </div>

        {/* Quick Example Presets */}
        <div className="mb-6">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Or Click a Natural Preset:
          </span>
          <div className="space-y-1.5">
            {presetExamples.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => setTranscript(ex)}
                className="w-full text-left p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-xs text-slate-300 hover:text-emerald-400 border border-slate-700/50 transition flex items-center justify-between group"
              >
                <span className="truncate pr-2">{ex}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleProcess}
            disabled={!transcript.trim() || isProcessing}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition shadow-lg shadow-emerald-600/20"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Extracting Intent & Constraints...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Process with Agnes 3.0 Flash</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
