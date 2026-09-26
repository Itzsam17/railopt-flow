# RailOpt Flow — Step-by-Step Build Prompts
### Companion to the RailOpt Flow PRD (SIH26027 · Team AETHER)

Use these prompts in order with your AI coding tool (e.g. Antigravity, Claude Code, Cursor). Paste one phase at a time, let it finish, review/run before moving to the next. Each prompt references sections of the PRD — attach or paste the PRD alongside these prompts so the tool has that context loaded.

---

### Phase 0 — Project Scaffolding
```
Set up the project scaffolding for "RailOpt Flow", per the attached PRD.
Create two folders: /backend (FastAPI + PostgreSQL, Python) and /frontend
(React + Vite + TailwindCSS + TypeScript — use web instead of React Native
so it runs in a browser for the hackathon demo).
Backend: set up FastAPI app skeleton, SQLAlchemy models for TrainMovement,
Corridor, MaintenanceRequest, Block, Conflict, OptimizationRun, User
(schema in PRD section 6), Alembic migrations, and a /health endpoint.
Frontend: set up routing (Dashboard, Block Planning, Conflict Center,
Analytics, Simulation, Live Operations) with a persistent sidebar nav
matching PRD section "Navigation Design" and dark theme colors from
PRD section 8. Don't build screen content yet — just working navigation
and empty pages.
```

### Phase 1 — Seed Data & Mock Backend Endpoints
```
Generate a realistic seed dataset for RailOpt Flow matching PRD section 6:
~8 tracks across 2-3 corridors, ~30 train movements, ~20 maintenance
requests across Engineering/S&T/Electrical with varied priority and
deadlines, and a handful of pre-existing conflicts. Write a seed script.
Then build FastAPI endpoints: GET /tracks, GET /maintenance-requests,
GET /conflicts, GET /kpis (returns the dashboard KPI numbers from PRD
section 7.1), POST /optimize (accepts current state, returns a mocked
optimized plan + the 4 delta metrics from PRD section 7.3 — use a
simple rule-based grouping algorithm for now, not full ML).
```

### Phase 2 — Dashboard Screen
```
Build the Dashboard screen per PRD section 7.1: hero header with title/
subtitle/live status badge, 4 KPI cards (largest = Asset Availability,
visually dominant per spec), and a network map component showing tracks
as nodes/lines colored by status with a hover info panel. Pull data from
the /kpis and /tracks endpoints. Follow the dark command-center visual
language in PRD section 8 — no bright/cartoonish styling, subtle glow
only on AI-related elements.
```

### Phase 3 — Block Planning Workspace
```
Build the Block Planning screen per PRD section 7.2: left panel of
draggable maintenance request cards (color-coded by priority), center
Gantt/timeline (rows = tracks + crews, draggable/resizable blocks),
right panel for AI recommendations. Wire the left-panel cards to be
draggable onto the timeline. Add a "Generate Optimized Plan" button.
```

### Phase 4 — AI Optimization Experience
```
Build the optimization modal/full-screen flow per PRD section 7.3:
call POST /optimize, show an animated checklist of steps completing
in sequence (even though the API call is fast, stage the UI animation
over ~4-6 seconds for dramatic effect), then show the result summary
with the 4 delta metrics, then a "View Optimized Plan" button that
applies the returned plan to the Block Planning timeline.
```

### Phase 5 — Conflict Center
```
Build the Conflict Center per PRD section 7.4: severity summary counts,
conflict cards with track/time/description/AI recommendation, and
Resolve Automatically / Review actions. Resolve Automatically should
update the conflict's status and optimistically update the timeline.
Pull from GET /conflicts.
```

### Phase 6 — Analytics
```
Build the Analytics screen per PRD section 7.5 with the 5 charts listed
(availability trend, before/after optimization impact, block utilization,
maintenance completion, disruption trend). Use the seeded mock data;
keep charts clean with minimal gridlines per PRD section 8.
```

### Phase 7 — What-If Simulation
```
Build the What-If Simulation screen per PRD section 7.6: left-side
controls (block duration slider, train priority selector, crew
availability indicator), right-side metrics that animate/transition
when "Run Simulation" is pressed, using a simple deterministic formula
that shifts availability/conflicts/completion based on slider values
(doesn't need to be real ML for the demo).
```

### Phase 8 — Live Operations
```
Build the Live Operations screen per PRD section 7.7: status counters,
network view reusing the Dashboard's map component, and a right-side
activity feed. Simulate live updates client-side with a timer that
appends new feed events every few seconds (no real backend push needed
for the demo).
```

### Phase 9 — Demo Mode
```
Add a "🎬 Start Demo" button (top nav) that runs the guided sequence
from PRD section 7.8: auto-navigates between screens, highlights the
key element on each screen with a tooltip/spotlight, and pauses briefly
on each step so a presenter can narrate. Make it skippable/closeable.
```

### Phase 10 — Polish Pass
```
Do a final pass across all screens: consistent spacing/typography,
hover/elevation micro-interactions on cards, smooth page transitions,
verify no numeric metric contradicts another screen, test the mobile
responsive breakpoints described in PRD section 9, and fix any console
errors or broken empty states.
```
