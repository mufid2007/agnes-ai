import datetime
from sqlalchemy import Column, String, Integer, Float, Text, JSON, DateTime, ForeignKey, Boolean
from app.database import Base

class Resource(Base):
    __tablename__ = "resources"
    
    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False) # 'pdf', 'ppt', 'notes', 'textbook', 'image', 'link'
    author = Column(String(100), default="Educator Provided")
    recency_year = Column(Integer, default=2024)
    authority_score = Column(Float, default=0.90) # 0.0 - 1.0
    status = Column(String(50), default="approved") # 'approved', 'pending', 'rejected'
    raw_content = Column(Text, nullable=False)
    extracted_summary = Column(Text, nullable=True)
    conflict_detected = Column(Boolean, default=False)
    conflict_details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class KnowledgeConcept(Base):
    __tablename__ = "knowledge_concepts"
    
    id = Column(String(50), primary_key=True, index=True)
    subject = Column(String(100), index=True)
    topic = Column(String(150), index=True)
    concept_name = Column(String(150), nullable=False)
    definition = Column(Text, nullable=False)
    prerequisites = Column(JSON, default=list) # List of string prerequisite concept names
    key_relationships = Column(JSON, default=list)
    examples = Column(JSON, default=list)
    formulas = Column(JSON, default=list)
    source_id = Column(String(50), ForeignKey("resources.id"), nullable=True)
    source_citation = Column(String(255), default="Primary Course Material")
    confidence_score = Column(Float, default=0.95)

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    
    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    grade_level = Column(String(50), default="Grade 10")
    preferred_language = Column(String(50), default="English")
    bilingual_mode = Column(Boolean, default=False)
    learning_pace = Column(String(50), default="moderate") # 'slow', 'moderate', 'fast'
    interaction_preference = Column(String(50), default="visual") # 'visual', 'text', 'interactive', 'voice'
    current_difficulty = Column(String(50), default="Medium") # 'Beginner', 'Medium', 'Advanced'
    
    # Live Mastery Matrix: concept_name -> score (0-100)
    mastery_levels = Column(JSON, default=dict)
    missing_prerequisites = Column(JSON, default=list)
    weak_concepts = Column(JSON, default=list)
    identified_misconceptions = Column(JSON, default=list)
    mastered_concepts = Column(JSON, default=list)

class AssessmentRecord(Base):
    __tablename__ = "assessment_records"
    
    id = Column(String(50), primary_key=True, index=True)
    student_id = Column(String(50), ForeignKey("student_profiles.id"), index=True)
    concept_name = Column(String(150), nullable=False)
    assessment_type = Column(String(50), default="diagnostic") # 'diagnostic', 'continuous', 'final'
    score = Column(Float, default=0.0) # 0 to 100
    response_time_sec = Column(Integer, default=15)
    hints_requested = Column(Integer, default=0)
    mistake_count = Column(Integer, default=0)
    misconception_detected = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class LearningPath(Base):
    __tablename__ = "learning_paths"
    
    id = Column(String(50), primary_key=True, index=True)
    student_id = Column(String(50), ForeignKey("student_profiles.id"), index=True)
    subject = Column(String(100), default="Science")
    topic = Column(String(150), default="Cellular Respiration & Photosynthesis")
    total_duration_minutes = Column(Integer, default=45)
    remaining_time_minutes = Column(Integer, default=45)
    current_step_index = Column(Integer, default=0)
    status = Column(String(50), default="in_progress")
    # List of step dictionaries:
    # [{ "id": 1, "title": "...", "concept": "...", "type": "explanation|activity|quiz|visual|intervention", "difficulty": "...", "is_essential": True, "completed": False }]
    steps = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ClassroomAnalytics(Base):
    __tablename__ = "classroom_analytics"
    
    id = Column(String(50), primary_key=True, index=True)
    topic = Column(String(150), nullable=False)
    student_count = Column(Integer, default=28)
    average_mastery = Column(Float, default=74.5)
    weak_topics = Column(JSON, default=list)
    common_misconceptions = Column(JSON, default=list)
    at_risk_students = Column(JSON, default=list)
    predicted_learning_gaps = Column(JSON, default=list)
    source_traceability_links = Column(JSON, default=list)
    initial_vs_final_mastery = Column(JSON, default=dict)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
