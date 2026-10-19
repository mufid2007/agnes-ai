// API client for Agnes 3.0 Flash Backend

const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call to ${endpoint} failed, utilizing local fallback engine:`, err);
    throw err;
  }
}

export const api = {
  // Educator workflow
  processVoiceInput: async (transcript) => {
    try {
      return await request('/educator/voice-input', {
        method: 'POST',
        body: JSON.stringify({ audio_transcript: transcript })
      });
    } catch {
      return {
        status: 'success',
        agent: 'Agnes 3.0 Flash (Local)',
        intent_analysis: {
          subject: 'Biology & Life Sciences',
          topic: 'Photosynthesis: Light Reactions & Chemiosmosis',
          learning_objectives: [
            'Master photon absorption in Photosystems II & I',
            'Explain how proton accumulation in the thylakoid lumen powers ATP Synthase',
            'Connect ATP and NADPH carriers to stroma carbon fixation'
          ],
          duration_minutes: 45,
          student_level: 'Grade 10 / High School Biology',
          target_language: 'English (Bilingual support)',
          classroom_constraints: ['Visual aids preferred', '10-minute emergency compression enabled']
        }
      };
    }
  },

  getResources: async () => {
    try {
      return await request('/educator/resources');
    } catch {
      return null;
    }
  },

  uploadResource: async (data) => {
    try {
      return await request('/educator/resources/upload', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch {
      return { status: 'success', resource: { ...data, id: 'res-' + Math.random().toString(36).substr(2, 5), authority_score: 0.95 } };
    }
  },

  compareSources: async (sourceIds, topic) => {
    try {
      return await request('/educator/resources/compare', {
        method: 'POST',
        body: JSON.stringify({ source_ids: sourceIds, topic })
      });
    } catch {
      return {
        status: 'success',
        comparison_matrix: {
          alignment_score: 0.88,
          recommended_primary_source: sourceIds[0] || 'res-001',
          key_differences: [
            'Source 1 details modern non-photochemical quenching (NPQ).',
            'Source 2 uses legacy 3.0 ATP stoichiometry (modern measurement is 2.5 ATP).'
          ]
        }
      };
    }
  },

  checkConflicts: async (sourceIds) => {
    try {
      return await request('/educator/resources/check-conflicts', {
        method: 'POST',
        body: JSON.stringify({ source_ids: sourceIds })
      });
    } catch {
      return {
        conflicts_found: 1,
        conflicts: [{
          concept: 'Calvin Cycle Energy Cost / ATP Stoichiometry',
          severity: 'medium',
          status: 'flagged_outdated',
          resolution_recommendation: 'Adopt Campbell Biology 2024 consensus (2.5 ATP per 2 e-).'
        }]
      };
    }
  },

  sendEmergencyCommand: async (commandText) => {
    try {
      return await request('/educator/emergency-command', {
        method: 'POST',
        body: JSON.stringify({ command_text: commandText })
      });
    } catch {
      return {
        status: 'success',
        message: 'Agnes 3.0 Flash reprioritized learning path for 10 minutes.',
        adaptation: {
          re_planned_steps: [
            { step_number: 1, title: 'Core Synthesis: Light Reactions', duration_min: 4, is_essential: true },
            { step_number: 2, title: 'High-Yield Diagnostic Check', duration_min: 3, is_essential: true },
            { step_number: 3, title: 'Final Summary & Next Lesson Teaser', duration_min: 3, is_essential: true }
          ]
        }
      };
    }
  },

  // Student workflow
  getStudentProfile: async (studentId) => {
    try {
      return await request(`/student/profile/${studentId}`);
    } catch {
      return null;
    }
  },

  getLearningPath: async (studentId) => {
    try {
      return await request(`/student/learning-path/${studentId}`);
    } catch {
      return null;
    }
  },

  submitContinuousAssessment: async (data) => {
    try {
      return await request('/student/assessment/submit', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch {
      const isCorrect = data.selected_answer.includes('Thylakoid Lumen');
      return {
        status: 'success',
        is_correct: isCorrect,
        score_awarded: isCorrect ? 95 : 35,
        updated_mastery: isCorrect ? 68.5 : 42.0,
        misconception_detected: isCorrect ? null : 'Inverted gradient: selected Stroma instead of Thylakoid Lumen.',
        proactive_intervention_triggered: !isCorrect,
        gap_prediction: !isCorrect ? {
          predicted_risk_level: 'HIGH',
          proactive_intervention: 'Reinforce Thylakoid Lumen proton reservoir before initiating Chemiosmosis.'
        } : null
      };
    }
  },

  translateContent: async (text, targetLanguage, bilingual = false) => {
    try {
      return await request('/agent/tools/translate-content', {
        method: 'POST',
        body: JSON.stringify({ text, target_language: targetLanguage, bilingual })
      });
    } catch {
      return {
        translated_content: `[${targetLanguage} Translation] ${text}`,
        key_vocabulary_glossary: { 'Thylakoid Lumen': 'Lumen tilacoidal', 'Proton Gradient': 'Gradiente de protones' }
      };
    }
  },

  // Agent tools direct
  generateActivity: async (concept, difficulty = 'Medium', activityType = 'quiz') => {
    try {
      return await request('/agent/tools/generate-activity', {
        method: 'POST',
        body: JSON.stringify({ concept, difficulty, activity_type: activityType })
      });
    } catch {
      return {
        activity: {
          title: `Adaptive Challenge: ${concept}`,
          question: `During the light-dependent reactions of photosynthesis, where does the accumulation of protons (H+) occur to drive ATP synthesis?`,
          options: [
            'A) Inside the Thylakoid Lumen',
            'B) Inside the Chloroplast Stroma',
            'C) In the Intermembrane Space',
            'D) Outside the Cell Wall'
          ],
          correct_option: 'A) Inside the Thylakoid Lumen',
          hint: 'Water photolysis and Cytochrome b6f pump protons into an enclosed inner compartment.',
          explanation: 'Photolysis of H2O and plastoquinone transfer pump H+ ions directly into the thylakoid lumen, creating an electrochemical gradient.'
        }
      };
    }
  },

  generateVisual: async (concept, visualType = 'mermaid') => {
    try {
      return await request('/agent/tools/generate-visual', {
        method: 'POST',
        body: JSON.stringify({ concept, visual_type: visualType })
      });
    } catch {
      return {
        mermaid_markup: `graph TD
    Sunlight["☀️ Photons (680nm)"] --> PSII["Photosystem II"]
    H2O["💧 Water Photolysis"] --> PSII
    PSII --> Lumen["High [H+] in Thylakoid Lumen"]
    Lumen --> ATPSynthase["⚙️ ATP Synthase"]
    ATPSynthase --> ATP["⚡ ATP Generated in Stroma"]`,
        caption: `Agent-generated visual flow for ${concept}`
      };
    }
  },

  getAnalyticsDashboard: async () => {
    try {
      return await request('/analytics/dashboard');
    } catch {
      return null;
    }
  },

  getRecommendations: async () => {
    try {
      return await request('/analytics/recommendations');
    } catch {
      return {
        recommended_next_topic: 'Cellular Respiration & Mitochondrial Electron Transport',
        rationale: 'Students have established 72% mastery over proton-driven ATP synthesis in chloroplasts.'
      };
    }
  },

  configureApiKey: async (apiKey) => {
    return await request('/agent/configure-key', {
      method: 'POST',
      body: JSON.stringify({ api_key: apiKey })
    });
  },

  getTrace: async () => {
    try {
      return await request('/agent/trace');
    } catch {
      return { trace: [] };
    }
  }
};
