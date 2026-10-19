import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict, Any

from app.database import get_db
from app.models.models import Resource, KnowledgeConcept
from app.models.schemas import VoiceInputRequest, ResourceCreate, EducatorEmergencyCommand
from app.agent.agnes_agent import agnes_agent
from app.agent import tools

router = APIRouter(prefix="/educator", tags=["Educator Workflow"])

@router.post("/voice-input")
async def process_voice_input(payload: VoiceInputRequest):
    """
    Step 1 & 2: Educator Voice Input & Intent Analysis.
    Converts transcribed educator speech into structured curriculum parameters.
    """
    analysis = await agnes_agent.process_educator_voice(payload.audio_transcript)
    return analysis

@router.get("/resources")
async def list_resources(db: AsyncSession = Depends(get_db)):
    """List all uploaded teaching materials, textbooks, slide decks, and lecture notes."""
    result = await db.execute(select(Resource))
    resources = result.scalars().all()
    return [{
        "id": r.id,
        "title": r.title,
        "file_type": r.file_type,
        "author": r.author,
        "recency_year": r.recency_year,
        "authority_score": r.authority_score,
        "status": r.status,
        "conflict_detected": r.conflict_detected,
        "conflict_details": r.conflict_details,
        "extracted_summary": r.extracted_summary
    } for r in resources]

@router.post("/resources/upload")
async def upload_resource(payload: ResourceCreate, db: AsyncSession = Depends(get_db)):
    """Upload and process new resource (PDF, PPT, notes, textbook, image, link)."""
    new_res = Resource(
        id=f"res-{uuid.uuid4().hex[:6]}",
        title=payload.title,
        file_type=payload.file_type,
        author=payload.author or "Educator Upload",
        recency_year=payload.recency_year or 2024,
        authority_score=0.92,
        status="approved",
        conflict_detected=False,
        raw_content=payload.raw_content,
        extracted_summary=f"Processed and indexed {payload.file_type.upper()} resource: {payload.title}"
    )
    db.add(new_res)
    await db.commit()
    await db.refresh(new_res)
    return {"status": "success", "resource": new_res}

@router.post("/resources/compare")
async def compare_sources_endpoint(source_ids: List[str], topic: str = "Photosynthesis", db: AsyncSession = Depends(get_db)):
    """Compares depth, recency, and authority of multiple sources using Agnes tool."""
    return await tools.compare_sources(source_ids=source_ids, topic=topic, session=db)

@router.post("/resources/check-conflicts")
async def check_conflicts_endpoint(source_ids: List[str], db: AsyncSession = Depends(get_db)):
    """Detects outdated and contradictory information between resources."""
    return await tools.check_conflict(source_ids=source_ids, session=db)

@router.post("/resources/{resource_id}/approve")
async def approve_resource(resource_id: str, db: AsyncSession = Depends(get_db)):
    """Educator approves resource into the Grounded Knowledge Base."""
    stmt = select(Resource).where(Resource.id == resource_id)
    res = await db.execute(stmt)
    resource = res.scalar_one_or_none()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    resource.status = "approved"
    await db.commit()
    return {"status": "success", "message": f"Resource '{resource.title}' approved."}

@router.post("/resources/{resource_id}/reject")
async def reject_resource(resource_id: str, db: AsyncSession = Depends(get_db)):
    """Educator rejects or demotes an unreliable/outdated resource."""
    stmt = select(Resource).where(Resource.id == resource_id)
    res = await db.execute(stmt)
    resource = res.scalar_one_or_none()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    resource.status = "rejected"
    await db.commit()
    return {"status": "success", "message": f"Resource '{resource.title}' rejected."}

@router.post("/emergency-command")
async def emergency_command(payload: EducatorEmergencyCommand, db: AsyncSession = Depends(get_db)):
    """
    Real-Time Educator Changes:
    Teacher says: 'We only have 10 minutes left.'
    Agnes automatically removes non-essential activities and prioritizes core concepts.
    """
    # Parse minutes from command text
    minutes = 10
    import re
    match = re.search(r'(\d+)\s*minute', payload.command_text, re.IGNORECASE)
    if match:
        minutes = int(match.group(1))

    return await agnes_agent.execute_emergency_time_constraint(remaining_minutes=minutes, session=db)

@router.get("/grounded-knowledge")
async def get_grounded_knowledge(db: AsyncSession = Depends(get_db)):
    """Fetches approved concepts with source traceability citations."""
    res = await db.execute(select(KnowledgeConcept))
    concepts = res.scalars().all()
    return [{
        "id": c.id,
        "subject": c.subject,
        "topic": c.topic,
        "concept_name": c.concept_name,
        "definition": c.definition,
        "prerequisites": c.prerequisites,
        "examples": c.examples,
        "formulas": c.formulas,
        "source_citation": c.source_citation,
        "confidence_score": c.confidence_score
    } for c in concepts]
