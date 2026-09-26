# RailOpt Flow 🚆⚡
### AI-Powered Automatic Block Planning to Maximize Asset Availability
**SIH Problem Statement: SIH26027 · Team AETHER**

---

## 📌 Overview
RailOpt Flow solves the multi-department track maintenance scheduling challenge across Indian Railways. Rather than Engineering, S&T, and Electrical/Traction departments independently raising disjointed track blocks, RailOpt Flow ingests timetables, tracks, and maintenance requests, detects scheduling conflicts, and coordinates them into **single, optimized maintenance windows**.

**Core Loop:** `Detect Conflicts → Prioritize Activities → Coordinate & Group → Optimize Plan → Explain`

---

## 🏆 Project Completion Status (Phases 0 — 10 Complete)

| Phase | Module | Status | Deliverables |
|---|---|:---:|---|
| **Phase 0** | **Project Scaffolding** | ✅ | FastAPI + PostgreSQL/SQLite backend, React 18 + Vite + TailwindCSS frontend, dark command-center theme |
| **Phase 1** | **Seed Data & Backend APIs** | ✅ | 8 tracks, 30 train movements, 20 maintenance requests, conflicts; `/tracks`, `/kpis`, `/maintenance-requests`, `/conflicts`, `/optimize` |
| **Phase 2** | **Dashboard Screen** | ✅ | Asset Availability dominant hero metric, 4 KPI cards, interactive SVG corridor network map with hover panels |
| **Phase 3** | **Block Planning Workspace** | ✅ | Drag-and-drop maintenance backlog, 24h interactive Gantt timeline (tracks + crews), AI recommendations |
| **Phase 4** | **AI Optimization Experience** | ✅ | 4–6s staged animated checklist, 4 delta metrics display, instant plan apply to timeline |
| **Phase 5** | **Conflict Center** | ✅ | Severity breakdown, conflict inspection cards, "Resolve Automatically" optimistic mitigation engine |
| **Phase 6** | **Optimization Analytics** | ✅ | 5 telemetry charts: Availability Trend, Before/After Impact, Block Utilization, Maintenance Completion, Disruption Minimized |
| **Phase 7** | **What-If Simulation** | ✅ | Real-time parameter sliders (block duration, train priority, crew capacity), deterministic recalculation engine, AI narrative assessment |
| **Phase 8** | **Live Operations Center** | ✅ | 4 status counters, reused topography network view, continuous client-side telemetry event stream |
| **Phase 9** | **Demo Mode Walkthrough** | ✅ | Top nav "🎬 Start Demo" auto-walkthrough, teleprompter narrator script, step countdown, keyboard controls |
| **Phase 10** | **Polish Pass & Responsive Layout** | ✅ | Mobile drawer navigation, card micro-interactions, cross-screen numeric alignment, clean build |

---

## 🏗️ Architecture

```
SIH/
├── backend/                       # FastAPI + SQLite / PostgreSQL Backend
│   ├── alembic/                   # Alembic Database Migrations
│   ├── app/
│   │   ├── api/v1/endpoints/      # REST API endpoints (tracks, kpis, maintenance, conflicts, optimization)
│   │   ├── core/                  # Configuration & environment settings
│   │   ├── db/                    # Session factory & realistic seed script (seed.py)
│   │   ├── models/                # SQLAlchemy Models (Track, TrainMovement, MaintenanceRequest, Block, Conflict, Run)
│   │   ├── schemas/               # Pydantic validation schemas
│   │   └── main.py                # FastAPI application entrypoint & CORS middleware
│   └── requirements.txt           # Python dependencies
│
└── frontend/                      # React 18 + Vite + TypeScript + TailwindCSS
    ├── src/
    │   ├── components/
    │   │   ├── analytics/         # 5 Analytics Telemetry Charts
    │   │   ├── conflicts/         # Conflict Severity Cards & Conflict Resolution Cards
    │   │   ├── dashboard/         # Asset Availability Hero Card & Interactive SVG Network Map
    │   │   ├── demo/              # Guided Tour Presenter Overlay & Teleprompter
    │   │   ├── layout/            # Responsive Sidebar Drawer, Header, and Shell Layout
    │   │   ├── live/              # Live Status Counters & Real-Time Activity Feed
    │   │   ├── planning/          # Draggable Backlog, Gantt Timeline, and AI Optimization Modal
    │   │   └── simulation/        # Scenario Controls, Live Recalculated Gauges, and Corridor Impact
    │   ├── context/               # DemoContext managing 10-step automated tour & timer
    │   ├── pages/                 # Full feature screens (Dashboard, Planning, Conflicts, Analytics, Simulation, Live)
    │   ├── services/              # API clients, simulation engine, and live telemetry generator
    │   ├── types/                 # Strongly-typed TypeScript interfaces
    │   ├── App.tsx                # App routing & provider wrapping
    │   └── index.css              # Dark command-center theme tokens & micro-interactions
    └── package.json
```

---

## 🚀 Quickstart

### 1. Backend Setup (FastAPI)
```bash
cd backend
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run migrations & seed data
alembic upgrade head
python -m app.db.seed

# Launch FastAPI development server
uvicorn app.main:app --reload --port 8000
```
- API Health Check: `http://localhost:8000/health`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

### 2. Frontend Setup (React + Vite)
```bash
cd frontend
npm.cmd install
npm.cmd run dev
```
- Web Application: `http://localhost:5173/`
- Production Build Verification: `npm.cmd run build`

---

## 🎬 How to Run the Presentation Demo
1. Launch the web application in a browser.
2. Click the **"🎬 Start Demo"** button in the top navigation bar.
3. The tour automatically navigates through all 10 PRD steps, displaying a teleprompter script for the presenter with an auto-advancing progress bar.
4. Use keyboard shortcuts during presentation:
   - `Space`: Pause / Resume countdown timer
   - `ArrowRight` / `ArrowLeft`: Advance or rewind steps
   - `Escape`: Exit demo tour anytime
