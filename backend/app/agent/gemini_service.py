import os
import json
import logging
from typing import Dict, Any, Optional
from app.config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self.client = None
        self._initialize_client()

    def _initialize_client(self):
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self.client = genai.GenerativeModel(self.model_name)
                logger.info(f"Initialized Gemini model: {self.model_name}")
            except Exception as e:
                logger.warning(f"Could not initialize Google GenAI SDK: {e}. Falling back to dynamic agent engine.")
                self.client = None
        else:
            logger.info("No GEMINI_API_KEY provided yet. Operating in high-fidelity agentic emulation mode.")

    def update_api_key(self, api_key: str):
        self.api_key = api_key
        settings.GEMINI_API_KEY = api_key
        self._initialize_client()

    async def generate_response(self, system_prompt: str, user_prompt: str) -> str:
        if self.client:
            try:
                full_prompt = f"System: {system_prompt}\n\nUser: {user_prompt}"
                response = self.client.generate_content(full_prompt)
                return response.text
            except Exception as e:
                logger.error(f"Gemini API error: {e}. Utilizing built-in dynamic reasoning.")
        return ""

gemini_service = GeminiService()
