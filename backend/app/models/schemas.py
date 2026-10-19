from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Educator Intent & Voice Input Schema
class VoiceInputRequest(BaseModel):
    audio_transcript: str = Field(..., description="Transcribed text from educator's voice")
    raw_audio_base64: Optional[str] = None

class IntentAnalysisResponse(BaseModel):
    subject: str
    topic: str
    learning_objectives: List[str]
    duration_minutes: int
    student_level: str
    target_language: str
    classroom_constraints: List[str]

# Resource Schema
class ResourceCreate(BaseModel):
    title: str
    file_type: str
    raw_content: str
    author: Optional[str] = "Educator Provided"
    recency_year: Optional[int] = 2024

class ResourceResponse(BaseModel):
    id: str
    title: str
    file_type: str
    authority_score: float
    recency_year: int
    status: str
    conflict_detected: bool
    conflict_details: Optional[str] = None
    extracted_summary: Optional[str] = None

# Tool Invocations Schemas
class SearchKnowledgeRequest(BaseModel):
    query: str
    subject: Optional[str] = None

class RetrieveSourceRequest(BaseModel):
    source_id: str

class CompareSourcesRequest(BaseModel):
    source_ids: List[str]
    topic: str

class CheckConflictRequest(BaseModel):
    source_ids: List[str]

class StudentProfileRequest(BaseModel):
    student_id: str

class AssessmentHistoryRequest(BaseModel):
    student_id: str

class PredictLearningGapRequest(BaseModel):
    student_id: str
    upcoming_concept: str

class GenerateActivityRequest(BaseModel):
    concept: str
    difficulty: str = "Medium"
    activity_type: str = "quiz" # quiz, flashcard, scenario, formula_drill

class TranslateContentRequest(BaseModel):
    text: str
    target_language: str
    bilingual: bool = False

class ChangeDifficultyRequest(BaseModel):
    student_id: str
    direction: str # "increase", "decrease", "reset"
    current_level: Optional[str] = "Medium"

class UpdateLearningPathRequest(BaseModel):
    student_id: str
    remaining_time_minutes: Optional[int] = None
    urgent_constraint: Optional[str] = None
    mastered_concepts: Optional[List[str]] = None

class GenerateVisualRequest(BaseModel):
    concept: str
    visual_type: str = "mermaid" # mermaid, svg, diagram

# Educator Emergency Command
class EducatorEmergencyCommand(BaseModel):
    student_id: Optional[str] = "all"
    command_text: str # e.g. "We only have 10 minutes left."
    approved_changes: Optional[bool] = True

# Continuous Assessment Submission
class ContinuousAssessmentSubmission(BaseModel):
    student_id: str
    concept_name: str
    selected_answer: str
    correct_answer: str
    response_time_sec: int
    hints_used: int
    attempt_number: int
