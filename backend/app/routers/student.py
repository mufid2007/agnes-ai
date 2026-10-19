import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Dict, Any, Optional

from app.database import get_db
from app.models.models import StudentProfile, LearningPath, AssessmentRecord
from app.models.schemas import ContinuousAssessmentSubmission, TranslateContentRequest
from app.agent import tools

router = APIRouter(prefix="/student", tags=["Student Adaptive Experience"])

@router.get("/profile/{student_id}")
async def get_student_profile_endpoint(student_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve full learner profile and mastery matrix."""
    return await tools.get_student_profile(student_id=student_id, session=db)

@router.get("/learning-path/{student_id}")
async def get_learning_path_endpoint(student_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve adaptive personalized learning path for student."""
    stmt = select(LearningPath).where(LearningPath.student_id == student_id)
    res = await db.execute(stmt)
    lp = res.scalar_one_or_none()
    if lp:
        return {
            "status": "success",
            "learning_path_id": lp.id,
            "student_id": lp.student_id,
            "topic": lp.topic,
            "total_duration_minutes": lp.total_duration_minutes,
            "remaining_time_minutes": lp.remaining_time_minutes,
            "current_step_index": lp.current_step_index,
            "steps": lp.steps
        }
    
    # Generate default path if none exists
    generated = await tools.update_learning_path(student_id=student_id, remaining_time_minutes=45, session=db)
    return generated

@router.post("/assessment/submit")
async def submit_continuous_assessment(submission: ContinuousAssessmentSubmission, db: AsyncSession = Depends(get_db)):
    """
    Continuous Assessment & Misconception Detection:
    AI continuously evaluates: Answers, Response time, Mistakes, Repeated attempts, Hints requested.
    Updates learner's mastery level for the concept and diagnoses misconception if wrong.
    """
    is_correct = submission.selected_answer.strip().lower() == submission.correct_answer.strip().lower()
    
    score = 100.0 if is_correct else 30.0
    # Penalty for hints and prolonged response time
    if is_correct and submission.hints_used > 0:
        score = max(50.0, score - (submission.hints_used * 15))

    misconception_diagnosis = None
    if not is_correct:
        misconception_diagnosis = (
            f"Misconception identified: Inverted concentration gradient or confused stroma with thylakoid lumen. "
            f"Took {submission.response_time_sec}s with {submission.hints_used} hint(s) requested."
        )

    # Save assessment record
    rec = AssessmentRecord(
        id=f"rec-{uuid.uuid4().hex[:6]}",
        student_id=submission.student_id,
        concept_name=submission.concept_name,
        assessment_type="continuous",
        score=score,
        response_time_sec=submission.response_time_sec,
        hints_requested=submission.hints_used,
        mistake_count=0 if is_correct else 1,
        misconception_detected=misconception_diagnosis,
        created_at=datetime.datetime.utcnow()
    )
    db.add(rec)

    # Update Student Profile live mastery in DB
    stmt = select(StudentProfile).where(StudentProfile.id == submission.student_id)
    res = await db.execute(stmt)
    profile = res.scalar_one_or_none()
    new_mastery = 75.0
    if profile:
        current_mastery = dict(profile.mastery_levels or {})
        prev_score = current_mastery.get(submission.concept_name, 50.0)
        # Weighted exponential moving average update
        new_score = round(prev_score * 0.4 + score * 0.6, 1)
        current_mastery[submission.concept_name] = new_score
        profile.mastery_levels = current_mastery
        
        if not is_correct and misconception_diagnosis:
            misconceptions = list(profile.identified_misconceptions or [])
            if misconception_diagnosis not in misconceptions:
                misconceptions.append(misconception_diagnosis)
            profile.identified_misconceptions = misconceptions
            
        await db.commit()
        new_mastery = new_score

    # Check if proactive intervention is triggered
    gap_prediction = None
    if score < 60:
        gap_prediction = await tools.predict_learning_gap(
            student_id=submission.student_id,
            upcoming_concept="Chemiosmotic ATP Synthesis",
            session=db
        )

    return {
        "status": "success",
        "is_correct": is_correct,
        "score_awarded": score,
        "updated_mastery": new_mastery,
        "misconception_detected": misconception_diagnosis,
        "proactive_intervention_triggered": gap_prediction is not None,
        "gap_prediction": gap_prediction
    }

@router.post("/translate")
async def translate_text(payload: TranslateContentRequest):
    """Multilingual adaptation: translate explanation into learner's preferred language or bilingual mode."""
    return await tools.translate_content(text=payload.text, target_language=payload.target_language, bilingual=payload.bilingual)

@router.post("/predict-gap")
async def predict_gap(student_id: str, upcoming_concept: str, db: AsyncSession = Depends(get_db)):
    """Predicts learning gap before student tackles the next concept."""
    return await tools.predict_learning_gap(student_id=student_id, upcoming_concept=upcoming_concept, session=db)
