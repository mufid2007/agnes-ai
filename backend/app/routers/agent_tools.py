from fastapi import APIRouter, Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.database import get_db
from app.agent.agnes_agent import agnes_agent
from app.agent import tools
from app.agent.gemini_service import gemini_service
from app.models.schemas import (
    SearchKnowledgeRequest,
    RetrieveSourceRequest,
    CompareSourcesRequest,
    CheckConflictRequest,
    StudentProfileRequest,
    AssessmentHistoryRequest,
    PredictLearningGapRequest,
    GenerateActivityRequest,
    TranslateContentRequest,
    ChangeDifficultyRequest,
    UpdateLearningPathRequest,
    GenerateVisualRequest
)

router = APIRouter(prefix="/agent", tags=["Agnes 3.0 Flash Agent & Tools"])

class ApiKeyPayload(BaseModel):
    api_key: str

@router.post("/configure-key")
async def configure_api_key(payload: ApiKeyPayload):
    """Allows updating the Gemini API key dynamically from frontend or environment."""
    gemini_service.update_api_key(payload.api_key)
    return {
        "status": "success",
        "message": "Gemini API key updated successfully in Agnes 3.0 Flash agent.",
        "model": gemini_service.model_name
    }

@router.get("/trace")
async def get_execution_trace():
    """Retrieve recent agentic execution trace of all tool calls, arguments, and outcomes."""
    return {
        "status": "success",
        "total_executions": len(agnes_agent.execution_trace),
        "trace": agnes_agent.execution_trace
    }

# ==========================================
# 12 AGENTIC TOOLS ENDPOINTS
# ==========================================

@router.post("/tools/search-knowledge")
async def run_search_knowledge(payload: SearchKnowledgeRequest, db: AsyncSession = Depends(get_db)):
    res = await tools.search_knowledge(query=payload.query, subject=payload.subject, session=db)
    agnes_agent.log_tool_call("search_knowledge", payload.dict(), res)
    return res

@router.post("/tools/retrieve-source")
async def run_retrieve_source(payload: RetrieveSourceRequest, db: AsyncSession = Depends(get_db)):
    res = await tools.retrieve_source(source_id=payload.source_id, session=db)
    agnes_agent.log_tool_call("retrieve_source", payload.dict(), res)
    return res

@router.post("/tools/compare-sources")
async def run_compare_sources(payload: CompareSourcesRequest, db: AsyncSession = Depends(get_db)):
    res = await tools.compare_sources(source_ids=payload.source_ids, topic=payload.topic, session=db)
    agnes_agent.log_tool_call("compare_sources", payload.dict(), res)
    return res

@router.post("/tools/check-conflict")
async def run_check_conflict(payload: CheckConflictRequest, db: AsyncSession = Depends(get_db)):
    res = await tools.check_conflict(source_ids=payload.source_ids, session=db)
    agnes_agent.log_tool_call("check_conflict", payload.dict(), res)
    return res

@router.post("/tools/get-student-profile")
async def run_get_student_profile(payload: StudentProfileRequest, db: AsyncSession = Depends(get_db)):
    res = await tools.get_student_profile(student_id=payload.student_id, session=db)
    agnes_agent.log_tool_call("get_student_profile", payload.dict(), res)
    return res

@router.post("/tools/get-assessment-history")
async def run_get_assessment_history(payload: AssessmentHistoryRequest, db: AsyncSession = Depends(get_db)):
    res = await tools.get_assessment_history(student_id=payload.student_id, session=db)
    agnes_agent.log_tool_call("get_assessment_history", payload.dict(), res)
    return res

@router.post("/tools/predict-learning-gap")
async def run_predict_learning_gap(payload: PredictLearningGapRequest, db: AsyncSession = Depends(get_db)):
    res = await tools.predict_learning_gap(student_id=payload.student_id, upcoming_concept=payload.upcoming_concept, session=db)
    agnes_agent.log_tool_call("predict_learning_gap", payload.dict(), res)
    return res

@router.post("/tools/generate-activity")
async def run_generate_activity(payload: GenerateActivityRequest):
    res = await tools.generate_activity(concept=payload.concept, difficulty=payload.difficulty, activity_type=payload.activity_type)
    agnes_agent.log_tool_call("generate_activity", payload.dict(), res)
    return res

@router.post("/tools/translate-content")
async def run_translate_content(payload: TranslateContentRequest):
    res = await tools.translate_content(text=payload.text, target_language=payload.target_language, bilingual=payload.bilingual)
    agnes_agent.log_tool_call("translate_content", payload.dict(), res)
    return res

@router.post("/tools/change-difficulty")
async def run_change_difficulty(payload: ChangeDifficultyRequest, db: AsyncSession = Depends(get_db)):
    res = await tools.change_difficulty(student_id=payload.student_id, direction=payload.direction, current_level=payload.current_level or "Medium", session=db)
    agnes_agent.log_tool_call("change_difficulty", payload.dict(), res)
    return res

@router.post("/tools/update-learning-path")
async def run_update_learning_path(payload: UpdateLearningPathRequest, db: AsyncSession = Depends(get_db)):
    res = await tools.update_learning_path(student_id=payload.student_id, remaining_time_minutes=payload.remaining_time_minutes, urgent_constraint=payload.urgent_constraint, mastered_concepts=payload.mastered_concepts, session=db)
    agnes_agent.log_tool_call("update_learning_path", payload.dict(), res)
    return res

@router.post("/tools/generate-visual")
async def run_generate_visual(payload: GenerateVisualRequest):
    res = await tools.generate_visual(concept=payload.concept, visual_type=payload.visual_type)
    agnes_agent.log_tool_call("generate_visual", payload.dict(), res)
    return res
