import React, { useState, useEffect } from 'react';
import { 
  User, 
  Brain, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Languages, 
  Sliders, 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  ShieldAlert, 
  Award, 
  Eye, 
  Zap, 
  RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';
import { sampleStudents } from '../services/mockData';
import VisualRenderer from '../components/VisualRenderer';
import SourceCitationBadge from '../components/SourceCitationBadge';

export default function LearnerStudio() {
  const [selectedStudentId, setSelectedStudentId] = useState(sampleStudents[0].student_id);
  const [currentStudent, setCurrentStudent] = useState(sampleStudents[0]);
  const [activeStepIndex, setActiveStepIndex] = useState(1);
  const [learningPath, setLearningPath] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [translatedContent, setTranslatedContent] = useState(null);
  const [visualData, setVisualData] = useState(null);
  const [activityData, setActivityData] = useState(null);
  
  // Quiz State
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [proactiveAlert, setProactiveAlert] = useState(null);

  // Sync current student
  useEffect(() => {
    const s = sampleStudents.find(stu => stu.student_id === selectedStudentId);
    if (s) {
      setCurrentStudent(s);
      setSelectedLanguage(s.preferred_language);
    }
    // Load default learning path
    api.getLearningPath(selectedStudentId).then(res => {
      if (res && res.steps) setLearningPath(res.steps);
      else {
        setLearningPath([
          { step_number: 1, title: 'Diagnostic Assessment', duration_min: 5, is_essential: true, completed: true },
          { step_number: 2, title: 'Visual: Thylakoid Lumen Proton Pump', duration_min: 8, is_essential: true, completed: false },
          { step_number: 3, title: 'Interactive Drill: Z-Scheme Electron Flow', duration_min: 12, is_essential: true, completed: false },
          { step_number: 4, title: 'Proactive Intervention: ATP Synthase Direction', duration_min: 7, is_essential: true, completed: false },
          { step_number: 5, title: 'Final Outcome Assessment', duration_min: 8, is_essential: true, completed: false }
        ]);
      }
    });

    // Load initial visual & activity
    api.generateVisual("Light-Dependent Reactions").then(setVisualData).catch(() => {});
    api.generateActivity("Light-Dependent Reactions").then(res => {
      if (res?.activity) setActivityData(res.activity);
    }).catch(() => {});
  }, [selectedStudentId]);

  // Quiz response timer
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleLanguageChange = async (lang) => {
    setSelectedLanguage(lang);
    if (lang === "English") {
      setTranslatedContent(null);
      return;
    }
    const sampleText = "The light-dependent reactions take place across the thylakoid membrane where protons accumulate in the lumen.";
    const res = await api.translateContent(sampleText, lang, true);
    setTranslatedContent(res);
  };

  const handleDifficultyChange = async (direction) => {
    const levels = ["Beginner", "Medium", "Advanced"];
    const curIdx = levels.indexOf(currentStudent.current_difficulty);
    let nextIdx = curIdx;
    if (direction === 'increase' && curIdx < levels.length - 1) nextIdx++;
    if (direction === 'decrease' && curIdx > 0) nextIdx--;
    const nextLevel = levels[nextIdx];
    setCurrentStudent(prev => ({ ...prev, current_difficulty: nextLevel }));
  };

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer) return;
    setTimerActive(false);

    const submission = {
      student_id: currentStudent.student_id,
      concept_name: "Light-Dependent Reactions & Photolysis",
      selected_answer: selectedAnswer,
      correct_answer: activityData?.correct_option || "A) Inside the Thylakoid Lumen",
      response_time_sec: timerSeconds,
      hints_used: hintsUsed,
      attempt_number: 1
    };

    const res = await api.submitContinuousAssessment(submission);
    setQuizFeedback(res);

    if (res.proactive_intervention_triggered && res.gap_prediction) {
      setProactiveAlert(res.gap_prediction);
    }

    // Update student mastery in local state
    if (res.updated_mastery) {
      setCurrentStudent(prev => ({
        ...prev,
        mastery_levels: {
          ...prev.mastery_levels,
          "Light-Dependent Reactions & Photolysis": res.updated_mastery
        }
      }));
    }
  };

  const handleRequestHint = () => {
    setHintsUsed(h => h + 1);
    setShowHint(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Student Profile Switcher Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 mb-1">
              <Brain className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Learner Profiling & Adaptive Engine</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Adaptive Studio: {currentStudent.name}</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {currentStudent.grade_level}
              </span>
            </h2>
          </div>

          {/* Student Selector Dropdown */}
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400">Select Student Persona:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
            >
              {sampleStudents.map(s => (
                <option key={s.student_id} value={s.student_id}>
                  {s.name} ({s.current_difficulty} • {s.preferred_language})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cognitive & Diagnostic Matrix Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-0.5">Learning Pace</span>
            <span className="text-xs font-bold text-white capitalize">{currentStudent.learning_pace}</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-0.5">Interaction Preference</span>
            <span className="text-xs font-bold text-cyan-400 capitalize">{currentStudent.interaction_preference} Aids</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-0.5">Adaptive Difficulty</span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">{currentStudent.current_difficulty}</span>
              <div className="flex space-x-1">
                <button onClick={() => handleDifficultyChange('decrease')} className="text-slate-400 hover:text-white px-1 font-bold">-</button>
                <button onClick={() => handleDifficultyChange('increase')} className="text-slate-400 hover:text-white px-1 font-bold">+</button>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-0.5">Language & Bilingual</span>
            <div className="flex items-center space-x-1">
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-transparent text-xs text-emerald-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="French">French (Français)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Knowledge Gap Breakdown Badges */}
        <div className="mt-4 p-3 bg-slate-950/40 rounded-xl border border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            Detected Gaps:
          </span>
          {currentStudent.missing_prerequisites.map((p, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px]">
              Missing Prerequisite: {p}
            </span>
          ))}
          {currentStudent.weak_concepts.map((w, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px]">
              Weak Concept: {w}
            </span>
          ))}
          {currentStudent.mastered_concepts.map((m, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px]">
              Mastered: {m}
            </span>
          ))}
        </div>
      </div>

      {/* Proactive Intervention Alert (Triggered before struggle happens!) */}
      {proactiveAlert && (
        <div className="bg-gradient-to-r from-cyan-950/50 via-indigo-950/40 to-cyan-950/50 border border-cyan-500/40 rounded-2xl p-4 sm:p-5 shadow-xl animate-in fade-in">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Proactive Intervention Triggered</span>
                <span className="text-[10px] bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded-full font-mono">predict_learning_gap()</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Pre-Emptive Scaffolding Alert: Upcoming struggle detected in Chemiosmotic ATP Synthesis
              </h4>
              <p className="text-xs text-slate-300">{proactiveAlert.proactive_intervention}</p>
            </div>
            <button onClick={() => setProactiveAlert(null)} className="text-slate-400 hover:text-white font-bold">×</button>
          </div>
        </div>
      )}

      {/* Personalized Learning Path Visual Stepper */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Personalized Adaptive Learning Path (Continuous Closed Loop)
          </span>
          <span className="text-xs text-slate-400 font-mono">Step {activeStepIndex} of 5</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {learningPath?.map((step, idx) => (
            <div
              key={idx}
              onClick={() => setActiveStepIndex(idx + 1)}
              className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                activeStepIndex === idx + 1
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-md'
                  : step.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono text-slate-500 block mb-1">Step {step.step_number}</span>
                <p className="text-xs font-bold line-clamp-1">{step.title}</p>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px]">
                <span>{step.duration_min} mins</span>
                {step.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Visual Simulation & Multilingual Scaffolding */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Visual Aids Panel (7 cols) */}
        <div className="lg:col-span-7">
          <VisualRenderer visualData={visualData} />
          <div className="mt-2 flex justify-end">
            <SourceCitationBadge 
              citation="Campbell Biology 12th Ed, p. 214"
              sourceTitle="Chapter 10: The Process That Feeds the Biosphere"
              sourceExcerpt="Thylakoid membranes contain Photosystem II and I arranged in tandem with the Cytochrome b6f complex pumping H+ ions into the lumen."
            />
          </div>
        </div>

        {/* Interactive Continuous Assessment Challenge (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold font-mono">Response Time: {timerSeconds}s</span>
              </div>
              <button
                onClick={handleRequestHint}
                className="text-[11px] text-amber-400 hover:text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-lg flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Request Hint ({hintsUsed})</span>
              </button>
            </div>

            {/* Multilingual Bilingual Banner if Active */}
            {translatedContent && (
              <div className="mb-3 p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                <span className="font-bold block mb-0.5">Bilingual Support ({selectedLanguage}):</span>
                <p className="italic text-[11px]">{translatedContent.translated_content}</p>
              </div>
            )}

            <h4 className="text-sm font-bold text-white mb-2">
              {activityData?.question || "During the light-dependent reactions of photosynthesis, where does the accumulation of protons (H+) occur to drive ATP synthesis?"}
            </h4>

            {showHint && (
              <div className="mb-3 p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                <span className="font-semibold">Hint: </span>
                {activityData?.hint || "Water photolysis and Cytochrome b6f pump protons into an enclosed compartment."}
              </div>
            )}

            {/* Answer Options */}
            <div className="space-y-2 mt-3">
              {(activityData?.options || [
                "A) Inside the Thylakoid Lumen",
                "B) Inside the Chloroplast Stroma",
                "C) In the Intermembrane Space",
                "D) Outside the Cell Wall"
              ]).map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedAnswer(opt)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition ${
                    selectedAnswer === opt
                      ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Submission and Feedback Area */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            {quizFeedback && (
              <div className={`p-3 rounded-xl mb-3 text-xs ${
                quizFeedback.is_correct ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-center space-x-1.5 font-bold mb-1">
                  {quizFeedback.is_correct ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                  <span>{quizFeedback.is_correct ? `Correct! +${quizFeedback.score_awarded} Points` : 'Incorrect'}</span>
                </div>
                {quizFeedback.misconception_detected && (
                  <p className="text-[11px] text-slate-300 mt-1">
                    <span className="font-semibold text-rose-400">Misconception Detected: </span>
                    {quizFeedback.misconception_detected}
                  </p>
                )}
                <p className="text-[10px] text-slate-400 mt-1">
                  Updated concept mastery: <strong className="text-white">{quizFeedback.updated_mastery}%</strong>
                </p>
              </div>
            )}

            <button
              onClick={handleAnswerSubmit}
              disabled={!selectedAnswer}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-cyan-600/20 flex items-center justify-center space-x-2"
            >
              <span>Submit & Evaluate Continuous Mastery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
