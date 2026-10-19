export const initialEducatorAnalysis = {
  subject: "Biology & Life Sciences",
  topic: "Photosynthesis: Light-Dependent Reactions & Calvin Cycle",
  learning_objectives: [
    "Understand the role of photon excitation in Photosystem II & I",
    "Explain how the proton gradient across the thylakoid lumen produces ATP via ATP Synthase",
    "Connect ATP and NADPH energy carriers to carbon fixation in the stroma"
  ],
  duration_minutes: 45,
  student_level: "Grade 10 / High School Introductory Biology",
  target_language: "English (with Spanish bilingual scaffolding)",
  classroom_constraints: [
    "Mixed visual and reading pace learners",
    "Limited lab equipment; reliance on virtual simulation",
    "Need emergency 10-minute compression trigger"
  ]
};

export const initialResources = [
  {
    id: "res-001",
    title: "Campbell Biology (12th Edition) - Chapter 10: Photosynthesis",
    file_type: "textbook",
    author: "Urry, Cain, Wasserman, Minorsky, Orr",
    recency_year: 2024,
    authority_score: 0.98,
    status: "approved",
    conflict_detected: false,
    raw_content: "In thylakoid membranes, Photosystem II absorbs photons at 680nm, extracting electrons from H2O photolysis. Protons accumulate in the thylakoid lumen generating delta-pH driving ATP synthase in the stroma.",
    extracted_summary: "Peer-reviewed authoritative standard for light reactions, Z-scheme, and Calvin cycle stoichiometry."
  },
  {
    id: "res-002",
    title: "Introductory Plant Physiology Handout (Circa 2008)",
    file_type: "notes",
    author: "Archived Curriculum Dept",
    recency_year: 2008,
    authority_score: 0.72,
    status: "flagged_conflict",
    conflict_detected: true,
    conflict_details: "Outdated claim: States ATP stoichiometry is fixed at 3.0 ATP per 2 electrons. Modern measurement is 2.5 ATP with 4.67 H+ per ATP synthesized.",
    raw_content: "Light reactions synthesize 3 ATP per photon pair absorbed. NADPH reduces PGA to G3P in the dark reactions.",
    extracted_summary: "Legacy handout with obsolete terminology ('Dark Reactions' instead of Light-Independent Reactions)."
  },
  {
    id: "res-003",
    title: "Prof. Martinez Lecture Slides: Molecular Energetics",
    file_type: "ppt",
    author: "Prof. Carlos Martinez, Dept of Biochemistry",
    recency_year: 2024,
    authority_score: 0.94,
    status: "approved",
    conflict_detected: false,
    raw_content: "Chemiosmosis in chloroplasts mirrors mitochondria. The lumen acts as the proton reservoir (pH ~ 5.5) compared to stroma (pH ~ 8.0).",
    extracted_summary: "High-authority visual lecture deck detailing proton gradients and chemiosmotic coupling."
  }
];

export const sampleStudents = [
  {
    student_id: "stu-001",
    name: "Alex Rivera",
    grade_level: "Grade 10",
    preferred_language: "English",
    bilingual_mode: true,
    learning_pace: "moderate",
    interaction_preference: "visual",
    current_difficulty: "Medium",
    mastery_levels: {
      "Chloroplast Structure": 92,
      "Thylakoid Membrane Architecture": 78,
      "Light-Dependent Reactions & Photolysis": 52,
      "Chemiosmotic ATP Synthesis": 41,
      "Calvin Cycle": 30
    },
    missing_prerequisites: ["Proton Gradient Stoichiometry"],
    weak_concepts: ["Chemiosmotic ATP Synthesis", "Lumen vs Stroma pH Differential"],
    identified_misconceptions: [
      "Thinks protons accumulate in the stroma rather than the thylakoid lumen.",
      "Assumes dark reactions can only take place at night."
    ],
    mastered_concepts: ["Chloroplast Structure", "Solar Photon Absorption"]
  },
  {
    student_id: "stu-002",
    name: "Priya Sharma",
    grade_level: "Grade 10",
    preferred_language: "English",
    bilingual_mode: false,
    learning_pace: "fast",
    interaction_preference: "interactive",
    current_difficulty: "Advanced",
    mastery_levels: {
      "Chloroplast Structure": 98,
      "Thylakoid Membrane Architecture": 95,
      "Light-Dependent Reactions & Photolysis": 88,
      "Chemiosmotic ATP Synthesis": 85,
      "Calvin Cycle": 72
    },
    missing_prerequisites: [],
    weak_concepts: ["RuBisCO Oxygenase Side-Reaction"],
    identified_misconceptions: [],
    mastered_concepts: ["Chloroplast Structure", "Light-Dependent Reactions & Photolysis", "Chemiosmotic ATP Synthesis"]
  },
  {
    student_id: "stu-003",
    name: "Marcus Vance",
    grade_level: "Grade 10",
    preferred_language: "Spanish",
    bilingual_mode: true,
    learning_pace: "slow",
    interaction_preference: "visual",
    current_difficulty: "Beginner",
    mastery_levels: {
      "Chloroplast Structure": 65,
      "Thylakoid Membrane Architecture": 45,
      "Light-Dependent Reactions & Photolysis": 32,
      "Chemiosmotic ATP Synthesis": 20,
      "Calvin Cycle": 15
    },
    missing_prerequisites: ["Chemical Bonding Basics", "Organelle Anatomy"],
    weak_concepts: ["Light-Dependent Reactions & Photolysis", "ATP Synthase function"],
    identified_misconceptions: [
      "Believes water photolysis is caused by plant heat rather than light enzyme complex."
    ],
    mastered_concepts: ["Solar Photon Absorption"]
  }
];
