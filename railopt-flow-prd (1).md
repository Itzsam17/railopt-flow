# RailOpt Flow — Product Requirements Document
### AI-Powered Automatic Block Planning to Maximize Asset Availability (SIH26027 · Team AETHER)

---

## 1. Problem & Solution Summary

**Problem:** Engineering, S&T, and Electrical/Traction departments raise maintenance requests independently. This creates multiple separate track blocks for the same corridor → more disruptions, higher delay/cost, low block utilization.

**Solution:** An AI optimization engine that ingests train timetable data, corridor/block availability, and maintenance requests from all departments, then detects conflicts and proposes **one coordinated maintenance block** covering multiple compatible activities — maximizing asset availability and minimizing train disruption.

**Core loop:** `Detect Conflicts → Prioritize Activities → Coordinate & Group → Optimize Plan → Explain`

---

## 2. Goals & Success Metrics

| Goal | Target metric (from pitch deck) |
|---|---|
| Increase asset availability | 94.7% → 96.2% predicted (+2.4%) |
| Reduce scheduling conflicts | −73% after optimization |
| Reduce train delay risk | −41% |
| Improve maintenance efficiency | +18% |
| Time saved per planning cycle | 2.5+ hours |

**Demo-day goal:** a working, click-through prototype that lets a judge go from "raw conflicting requests" → "AI-generated optimized block plan" → "resolved conflicts" → "live monitoring" in under 5 minutes.

---

## 3. Users / Personas

1. **Block/Corridor Planner** — creates and approves the coordinated block plan (primary user).
2. **Department Coordinator** (Engineering / S&T / Electrical) — submits maintenance work orders.
3. **Operations Controller** — monitors live operations, resolves conflicts in real time.
4. **Zone/Division Manager** — views analytics, approves high-impact changes.

---

## 4. Scope (Prototype-Level)

### In scope (build this)
- Dashboard with KPIs + network map (mocked/simulated live data is fine)
- Block Planning workspace (Gantt/timeline + drag maintenance cards + AI recommendation panel)
- AI Optimization run (simulated engine call with realistic processing steps; real optimization if time allows)
- Conflict Center (list + severity + one-click "Resolve Automatically")
- Analytics screen (trend charts, before/after comparisons)
- What-If Simulation (sliders → recalculated mock metrics)
- Live Operations screen (simulated live feed)
- Demo Mode (guided walkthrough for judges)

### Out of scope (say so explicitly if asked)
- Real integration with Indian Railways' live systems (COIS/CRIS/FOIS)
- Production-grade auth/RBAC, multi-tenant zones
- Real train GPS/telemetry ingestion

---

## 5. Tech Stack (as declared in pitch deck)

| Layer | Choice |
|---|---|
| Frontend (mobile) | React Native |
| Backend API | FastAPI (Python) |
| Database | PostgreSQL |
| AI/ML | Python (optimization algorithms + ML models) |
| AI assistance / insights | Google Gemini API |

> Note: the deck targets a **mobile app** (React Native). If you'd rather demo on a laptop/projector to judges, a React web app (Vite + Tailwind) reusing the same FastAPI backend is usually easier to build fast and is still a valid substitution — flag this decision explicitly to your team before starting.

---

## 6. Data Model (minimum viable)

- **TrainMovement**: id, train_no, corridor_id, scheduled_departure, scheduled_arrival, priority
- **Corridor/Track**: id, name (e.g. "T-184"), zone, division, current_status (available/maintenance/block/conflict/unavailable)
- **MaintenanceRequest**: id, work_order_no, department (Engineering/S&T/Electrical), track_id, activity_type, duration_hours, priority, deadline, status
- **Block**: id, track_id, start_time, end_time, linked_work_orders[], source (manual/ai), status
- **Conflict**: id, block_id or track_id, severity (critical/high/medium), description, ai_recommendation, status (open/resolved)
- **OptimizationRun**: id, timestamp, input_snapshot, results (availability_delta, conflict_delta, delay_risk_delta, efficiency_delta), status
- **User**: id, name, role (planner/coordinator/controller/manager)

---

## 7. Screen-by-Screen Requirements

### 7.1 Dashboard (Command Center)
- Header: "Railway Operations Command Center" + live system status badge
- KPI row: Asset Availability, Optimized Blocks, Conflict Reduction, Predicted Availability — largest metric visually dominant
- Interactive network map: stations, junctions, tracks colored by status (green/blue/yellow/orange/red/grey), hover panel with track details

### 7.2 Block Planning (core screen)
- 3-column layout: Maintenance Requests (left, draggable priority cards) · Timeline/Gantt (center, rows = tracks/signals/crews) · AI Recommendations (right)
- "Generate Optimized Plan" button triggers the optimization experience (7.3)
- AI-generated blocks visually distinct (cyan/blue) from manual blocks (neutral)

### 7.3 AI Optimization Experience
- Full-screen/modal sequence: checklist of analysis steps completing in order → animated progress → result summary (4 delta metrics) → "View Optimized Plan" CTA

### 7.4 Conflict Center
- Header count + severity breakdown (critical/high/medium)
- Conflict cards: track, time window, description, AI recommendation, [Resolve Automatically] / [Review]

### 7.5 Analytics
- Asset Availability Trend (line), AI Optimization Impact (before/after), Block Utilization, Maintenance Completion (planned vs completed), Train Disruption trend

### 7.6 What-If Simulation
- Left: controls (block duration slider, train priority selector, crew availability)
- Right: live-updating impact metrics (availability, train impact, conflicts, completion %) with animated transitions
- [Run Simulation] CTA

### 7.7 Live Operations
- Status counters: active blocks, trains in network, critical alerts, asset availability
- Live network view + right-side activity feed (timestamped events)

### 7.8 Demo Mode
- "🎬 Start Demo" button that auto-walks through: Dashboard → Maintenance Backlog → Conflict Detection → Run AI Optimization → New Plan → Resolve Conflicts → Improved Availability → Simulation → Approve → Live Monitoring

---

## 8. Visual Design Direction (condensed from spec doc)

- Dark-mode command-center aesthetic; deep navy/near-black background, slightly lighter navy cards with thin borders
- Accent palette with **fixed meaning**: AI blue (AI features/primary actions), cyan (live data, sparingly), emerald (healthy/available), amber (warning/scheduled maintenance), orange (medium risk), red (critical only)
- AI-related UI gets a subtle identity: sparkle/glow borders, "✨ AI Optimized," "🧠 AI Recommendation" labels — used sparingly, never gimmicky
- Avoid: cartoon illustrations, excessive gradients/neon, template-y rounded-card-everywhere look
- Micro-interactions: hover elevation, smooth transitions, gentle pulsing on AI/network indicators — subtle, not busy

---

## 9. Non-Functional Requirements

- AI optimization step should visibly take a few seconds (simulate realistic processing even if computation is instant) — this sells the "AI is working" narrative to judges
- Mobile: sidebar collapses, KPI cards stack, Gantt becomes horizontally scrollable
- All numeric claims on screen should trace back to a single consistent mock dataset so numbers don't contradict across screens

---

## 10. Open Decisions to Confirm Before Building
- Web app vs React Native mobile app for the demo (see note in section 5)
- Real optimization algorithm vs. rule-based mock for the hackathon deadline
- Whether Google Gemini API is used for the "AI Insights" copy generation or just for narrative color

---

*Companion document: see the separate "RailOpt Flow — Build Prompts" file for the step-by-step AI coding prompts that implement this PRD.*
