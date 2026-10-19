import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db, AsyncSessionLocal
from app.data.seed_data import seed_initial_data
from app.routers import educator, student, agent_tools, analytics

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("agnes.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Agnes 3.0 Flash Database & Seed Data...")
    await init_db()
    async with AsyncSessionLocal() as session:
        await seed_initial_data(session)
    logger.info("Agnes 3.0 Flash platform is operational.")
    yield
    logger.info("Shutting down Agnes 3.0 Flash platform.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Agnes 3.0 Flash - AI-Powered Adaptive Learning & Educator Autonomous Platform",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(educator.router, prefix=settings.API_PREFIX)
app.include_router(student.router, prefix=settings.API_PREFIX)
app.include_router(agent_tools.router, prefix=settings.API_PREFIX)
app.include_router(analytics.router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "model": settings.GEMINI_MODEL,
        "status": "online",
        "tools_count": 12,
        "docs_url": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "agnes-3.0-flash-api"}
