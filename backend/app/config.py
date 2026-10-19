import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Agnes 3.0 Flash"
    VERSION: str = "3.0.0"
    API_PREFIX: str = "/api"
    
    # Gemini API Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    
    # Database Configuration: Defaults to SQLite for immediate plug-and-play, supports PostgreSQL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./agnes.db")
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
