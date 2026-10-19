import logging
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import Resource, KnowledgeConcept, StudentProfile, AssessmentRecord, LearningPath, ClassroomAnalytics

logger = logging.getLogger(__name__)

async def seed_initial_data(session: AsyncSession):
    # Check if data already exists
    res = await session.execute(select(Resource))
    if res.scalars().first():
        logger.info("Database already seeded.")
        return

    logger.info("Seeding initial grounded knowledge base, students, and resources...")

    # 1. Grounded Resources
    r1 = Resource(
        id="res-001",
        title="Campbell Biology (12th Edition) - Chapter 10: Photosynthesis",
        file_type="textbook",
        author="Urry, Cain, Wasserman, Minorsky, Orr",
        recency_year=2024,
        authority_score=0.98,
        status="approved",
        conflict_detected=False,
        raw_content="Photosynthesis converts light energy into chemical energy. In thylakoid membranes, Photosystem II absorbs photons at 680nm, extracting electrons from H2O photolysis. Protons accumulate in the thylakoid lumen generating a high delta-pH driving ATP synthase in the stroma.",
        extracted_summary="Comprehensive modern reference for light-dependent reactions, Z-scheme, and Calvin cycle stoichiometry."
    )
    
    r2 = Resource(
        id="res-002",
        title="Introductory Plant Physiology Handout (Circa 2008)",
        file_type="notes",
        author="Archived Curriculum Dept",
        recency_year=2008,
        authority_score=0.72,
        status="flagged_conflict",
        conflict_detected=True,
        conflict_details="Outdated claim: States ATP stoichiometry is fixed at 3.0 ATP per 2 electrons. Modern measurement is 2.5 ATP with 4.67 H+ per ATP synthesized.",
        raw_content="Light reactions synthesize 3 ATP per photon pair absorbed. NADPH reduces PGA to G3P in the dark reactions.",
        extracted_summary="Legacy handout with obsolete terminology ('Dark Reactions' instead of Light-Independent Reactions)."
    )

    r3 = Resource(
        id="res-003",
        title="Prof. Martinez Lecture Slides: Molecular Energetics & Bioenergetics",
        file_type="ppt",
        author="Prof. Carlos Martinez, Dept of Biochemistry",
        recency_year=2024,
        authority_score=0.94,
        status="approved",
        conflict_detected=False,
        raw_content="Chemiosmosis in chloroplasts mirrors mitochondria. The lumen acts as the proton reservoir (pH ~ 5.5) compared to stroma (pH ~ 8.0). This 2.5 pH unit difference powers the c-ring of ATP synthase.",
        extracted_summary="High-authority visual lecture deck detailing proton gradients and chemiosmotic coupling."
    )
    session.add_all([r1, r2, r3])

    # 2. Knowledge Concepts
    c1 = KnowledgeConcept(
        id="c-001",
        subject="Biology",
        topic="Photosynthesis",
        concept_name="Thylakoid Membrane Architecture",
        definition="Phospholipid bilayer within chloroplasts housing photosystems I and II, the cytochrome b6f complex, and ATP synthase.",
        prerequisites=["Chloroplast Organelle Structure", "Lipid Bilayer Basics"],
        key_relationships=["Encloses the Thylakoid Lumen", "Bathed in the Chloroplast Stroma"],
        examples=["Grana stacks (thylakoid piles) increasing surface area for photon absorption"],
        formulas=[],
        source_id="res-001",
        source_citation="Campbell Biology 12th Ed, Section 10.1, Page 211",
        confidence_score=0.99
    )

    c2 = KnowledgeConcept(
        id="c-002",
        subject="Biology",
        topic="Photosynthesis",
        concept_name="Light-Dependent Reactions & Photolysis",
        definition="Excitation of chlorophyll P680 splits water into protons, electrons, and O2, feeding the electron transport chain to generate NADPH and a proton gradient.",
        prerequisites=["Thylakoid Membrane Architecture", "Photon Energy Absorption"],
        key_relationships=["Powers ATP chemiosmosis", "Provides NADPH for the Calvin Cycle"],
        examples=["Photolysis of water at the oxygen-evolving complex of PSII"],
        formulas=["2 H2O + light -> 4 H+ + 4 e- + O2"],
        source_id="res-001",
        source_citation="Campbell Biology 12th Ed, Section 10.2, Page 214",
        confidence_score=0.98
    )

    c3 = KnowledgeConcept(
        id="c-003",
        subject="Biology",
        topic="Photosynthesis",
        concept_name="Chemiosmotic ATP Synthesis",
        definition="The flow of protons down their electrochemical gradient from the thylakoid lumen back into the stroma through ATP synthase to phosphorylate ADP into ATP.",
        prerequisites=["Light-Dependent Reactions & Photolysis", "Electrochemical Potential"],
        key_relationships=["Coupled to Cytochrome b6f proton pumping"],
        examples=["Chemiosmotic coupling mechanism discovered by Peter Mitchell"],
        formulas=["ADP + Pi + H+(lumen) -> ATP + H2O + H+(stroma)"],
        source_id="res-003",
        source_citation="Prof. Martinez Lecture Slides, Slide 24",
        confidence_score=0.97
    )
    session.add_all([c1, c2, c3])

    # 3. Student Profiles
    s1 = StudentProfile(
        id="stu-001",
        name="Alex Rivera",
        grade_level="Grade 10",
        preferred_language="English",
        bilingual_mode=True,
        learning_pace="moderate",
        interaction_preference="visual",
        current_difficulty="Medium",
        mastery_levels={
            "Chloroplast Structure": 92,
            "Thylakoid Membrane Architecture": 78,
            "Light-Dependent Reactions & Photolysis": 52,
            "Chemiosmotic ATP Synthesis": 41,
            "Calvin Cycle": 30
        },
        missing_prerequisites=["Proton Gradient Stoichiometry"],
        weak_concepts=["Chemiosmotic ATP Synthesis", "Lumen vs Stroma pH Differential"],
        identified_misconceptions=[
            "Thinks protons accumulate in the stroma rather than the thylakoid lumen.",
            "Assumes dark reactions can only take place at night."
        ],
        mastered_concepts=["Chloroplast Structure", "Solar Photon Absorption"]
    )

    s2 = StudentProfile(
        id="stu-002",
        name="Priya Sharma",
        grade_level="Grade 10",
        preferred_language="English",
        bilingual_mode=False,
        learning_pace="fast",
        interaction_preference="interactive",
        current_difficulty="Advanced",
        mastery_levels={
            "Chloroplast Structure": 98,
            "Thylakoid Membrane Architecture": 95,
            "Light-Dependent Reactions & Photolysis": 88,
            "Chemiosmotic ATP Synthesis": 85,
            "Calvin Cycle": 72
        },
        missing_prerequisites=[],
        weak_concepts=["RuBisCO Oxygenase Side-Reaction"],
        identified_misconceptions=[],
        mastered_concepts=["Chloroplast Structure", "Light-Dependent Reactions & Photolysis", "Chemiosmotic ATP Synthesis"]
    )

    s3 = StudentProfile(
        id="stu-003",
        name="Marcus Vance",
        grade_level="Grade 10",
        preferred_language="Spanish",
        bilingual_mode=True,
        learning_pace="slow",
        interaction_preference="visual",
        current_difficulty="Beginner",
        mastery_levels={
            "Chloroplast Structure": 65,
            "Thylakoid Membrane Architecture": 45,
            "Light-Dependent Reactions & Photolysis": 32,
            "Chemiosmotic ATP Synthesis": 20,
            "Calvin Cycle": 15
        },
        missing_prerequisites=["Chemical Bonding Basics", "Organelle Anatomy"],
        weak_concepts=["Light-Dependent Reactions & Photolysis", "ATP Synthase function"],
        identified_misconceptions=[
            "Believes water photolysis is caused by plant heat rather than light enzyme complex."
        ],
        mastered_concepts=["Solar Photon Absorption"]
    )
    session.add_all([s1, s2, s3])

    # 4. Learning Path for Alex Rivera
    lp = LearningPath(
        id="lp-001",
        student_id="stu-001",
        subject="Biology",
        topic="Photosynthesis",
        total_duration_minutes=45,
        remaining_time_minutes=45,
        current_step_index=1,
        status="in_progress",
        steps=[
            {
                "step_number": 1,
                "title": "Diagnostic Assessment & Gap Scan",
                "concept": "Chloroplast & Light Basics",
                "activity_type": "diagnostic",
                "duration_min": 5,
                "is_essential": True,
                "completed": True,
                "score": 85
            },
            {
                "step_number": 2,
                "title": "Visual Scaffolding: Lumen vs Stroma Proton Pump",
                "concept": "Thylakoid Membrane Architecture",
                "activity_type": "visual_interactive",
                "duration_min": 8,
                "is_essential": True,
                "completed": False,
                "score": None
            },
            {
                "step_number": 3,
                "title": "Interactive Molecular Drill: Z-Scheme Electron Flow",
                "concept": "Light-Dependent Reactions & Photolysis",
                "activity_type": "drill",
                "duration_min": 12,
                "is_essential": True,
                "completed": False,
                "score": None
            },
            {
                "step_number": 4,
                "title": "Proactive Intervention: ATP Synthase Directionality",
                "concept": "Chemiosmotic ATP Synthesis",
                "activity_type": "intervention",
                "duration_min": 7,
                "is_essential": True,
                "completed": False,
                "score": None
            },
            {
                "step_number": 5,
                "title": "Comprehensive Outcome Assessment",
                "concept": "Complete Photosynthetic Pathway",
                "activity_type": "final_assessment",
                "duration_min": 8,
                "is_essential": True,
                "completed": False,
                "score": None
            }
        ]
    )
    session.add(lp)

    # 5. Classroom Analytics
    ca = ClassroomAnalytics(
        id="ca-001",
        topic="Photosynthesis & Cellular Energetics",
        student_count=28,
        average_mastery=71.8,
        weak_topics=[
            {"topic": "Thylakoid Lumen Proton Gradient Direction", "struggle_rate": "54% of class", "priority": "High"},
            {"topic": "Calvin Cycle RuBisCO Carbon Fixation", "struggle_rate": "48% of class", "priority": "Medium"},
            {"topic": "ATP/NADPH Electron Stoichiometry", "struggle_rate": "39% of class", "priority": "Medium"}
        ],
        common_misconceptions=[
            {"misconception": "Inverted proton gradient (thinking protons flow into stroma to build gradient)", "frequency": 14},
            {"misconception": "Belief that plants only photosynthesize in day and never respire", "frequency": 11},
            {"misconception": "Confusing chlorophyll absorption spectrum with oxygen emission", "frequency": 6}
        ],
        at_risk_students=[
            {"id": "stu-003", "name": "Marcus Vance", "mastery": 35.4, "status": "Needs Prerequisite Booster", "trend": "Declining"},
            {"id": "stu-007", "name": "Elena Rostova", "mastery": 48.0, "status": "Pace Lagging", "trend": "Stable"},
            {"id": "stu-014", "name": "Jordan Lee", "mastery": 51.2, "status": "Misconception Persistent", "trend": "Improving"}
        ],
        predicted_learning_gaps=[
            {"concept": "Calvin Cycle Energy Consumption", "predicted_failure_risk": "68%", "recommended_action": "Reinforce NADPH role before lesson"},
            {"concept": "Photorespiration Bottlenecks", "predicted_failure_risk": "59%", "recommended_action": "Provide side-by-side CO2 vs O2 diagram"}
        ],
        source_traceability_links=[
            {"concept": "Light Reactions", "source_title": "Campbell Biology (12th Edition)", "citation": "Chapter 10, pp. 211-218"},
            {"concept": "Chemiosmotic Gradient", "source_title": "Prof. Martinez Lecture Slides", "citation": "Slides 18-26"}
        ],
        initial_vs_final_mastery={
            "Diagnostic Average": 46.2,
            "Current Adaptive Average": 71.8,
            "Projected Final Mastery": 88.4
        }
    )
    session.add(ca)

    await session.commit()
    logger.info("Database seeding completed successfully.")
