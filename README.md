# Agnes 3.0 Flash — AI-Powered Adaptive Learning & Educator Autonomous Platform

An enterprise-grade, closed-loop pedagogical ecosystem engineered with:
- **Frontend**: React + Vite + Tailwind CSS + Lucide Icons + Web Speech API + Mermaid.js
- **Backend**: FastAPI (Python 3.11 asynchronous architecture)
- **Database**: PostgreSQL (with asyncpg & fallback SQLite for zero-friction launch)
- **AI Agent**: **Agnes 3.0 Flash** with 12 Autonomous Pedagogical Tools

---

## 🌟 The 12 Agentic Tools

Agnes 3.0 Flash operates using twelve dedicated agentic tools:

| # | Tool Name | Scope & Functionality |
|---|---|---|
| 1 | `search_knowledge()` | Queries verified concepts, formulas, definitions, and prerequisites from the grounded base. |
| 2 | `retrieve_source()` | Retrieves full document metadata, authority scores, recency, text excerpts, and citations. |
| 3 | `compare_sources()` | Compares multiple teaching materials for semantic alignment, depth, and authority ranking. |
| 4 | `check_conflict()` | Detects contradictory, superseded, or outdated information between sources. |
| 5 | `get_student_profile()` | Fetches comprehensive learner matrix: prior knowledge, pace, interaction styles, and languages. |
| 6 | `get_assessment_history()` | Analyzes historical pre-tests, response times, hint usage, and mistake frequencies. |
| 7 | `predict_learning_gap()` | Pre-emptively forecasts cognitive struggle before the student reaches an upcoming concept. |
| 8 | `generate_activity()` | Synthesizes adaptive quizzes, flashcard drills, and real-world scenario challenges. |
| 9 | `translate_content()` | Adapts explanations into preferred languages (Spanish, French, Hindi) with bilingual glossaries. |
| 10 | `change_difficulty()` | Dynamically modifies cognitive load and difficulty (Beginner, Medium, Advanced). |
| 11 | `update_learning_path()` | Real-time dynamic re-planning (e.g. educator's "10 minutes left" emergency pruning). |
| 12 | `generate_visual()` | Generates dynamic molecular and conceptual diagrams in Mermaid and SVG formats. |

---

## 🔄 The Complete Closed-Loop Workflow

```
Educator Voice Input
       │
       ▼
Speech-to-Text & Intent Analysis (Subject, Objectives, Duration, Level, Language, Constraints)
       │
       ▼
Resource Collection (PDFs, PPTs, Lecture Notes, Textbooks, Images, Links)
       │
       ▼
Resource Processing & Knowledge Extraction (Concepts, Relationships, Formulas, Citations)
       │
       ▼
Source Comparison, Conflict Detection & Trust Ranking (Authority & Recency Scoring)
       │
       ▼
Grounded Knowledge Base (100% Traceable to Educator's Material)
       │
       ▼
Learner Profiling & Diagnostic Pre-Assessment
       │
       ▼
Knowledge Gap Detection (Missing Prerequisites, Weak Concepts, Misconceptions)
       │
       ▼
Personalized Learning Path & Dynamic Adaptation (Multilingual, Visuals, Interactive Drills)
       │
       ▼
Continuous Assessment & Real-Time Performance (Response Time, Hints, Misconception Detection)
       │
       ▼
Future Gap Prediction & Proactive Scaffolding Interventions
       │
       ▼
Dynamic Re-Planning & Educator Controls (Emergency "10 Mins Left" Pruning, Approve/Reject)
       │
       ▼
Classroom Analytics Dashboard (Mastery, Weak Topics, At-Risk Alerts, Outcome Analysis)
       │
       ▼
Feedback Loop & Next-Lesson Recommendations ──► Continuous Agentic Loop
```

---

## 🚀 Quick Start Guide

### Option 1: One-Click Windows Launcher
Double-click `start-app.bat` or run:
```bat
start-app.bat
```

### Option 2: Docker Compose (Full Stack with PostgreSQL)
```bash
docker compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API Docs: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`

### Option 3: Manual Startup

#### 1. Backend (FastAPI)
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # On Windows
pip install -r requirements.txt
python run.py
```

#### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Gemini API Credentials

You can supply your Gemini API key in two ways:
1. **Via UI**: Click the **Key icon** in the top navigation bar of the application and paste your key.
2. **Via `.env`**: Set `GEMINI_API_KEY=your_key_here` in `backend/.env`.

---

## 📦 Pushing to GitHub

To push this codebase to your GitHub repository:

```bash
# 1. Initialize git
git init
git add .
git commit -m "Initial commit: Agnes 3.0 Flash Educational Platform"

# 2. Authenticate GitHub (if using GitHub CLI)
gh auth login

# 3. Create and push to a remote repository
gh repo create agnes-ai --public --source=. --remote=origin --push

# Or push to an existing repo:
# git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git
# git branch -M main
# git push -u origin main
```
