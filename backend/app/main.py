import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import tracks, maintenance, conflicts, kpis, optimization

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="RailOpt Flow Backend API — AI-Powered Automatic Block Planning to Maximize Asset Availability (SIH26027 · Team AETHER)",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount endpoints at root paths for exact PRD prompt matching
app.include_router(tracks.router, prefix="/tracks", tags=["Tracks"])
app.include_router(maintenance.router, prefix="/maintenance-requests", tags=["Maintenance Requests"])
app.include_router(conflicts.router, prefix="/conflicts", tags=["Conflicts"])
app.include_router(kpis.router, prefix="/kpis", tags=["KPIs"])
app.include_router(optimization.router, prefix="/optimize", tags=["Optimization"])

# Also mount under /api/v1/ for standard API versioning
app.include_router(tracks.router, prefix="/api/v1/tracks", tags=["Tracks (v1)"])
app.include_router(maintenance.router, prefix="/api/v1/maintenance-requests", tags=["Maintenance Requests (v1)"])
app.include_router(conflicts.router, prefix="/api/v1/conflicts", tags=["Conflicts (v1)"])
app.include_router(kpis.router, prefix="/api/v1/kpis", tags=["KPIs (v1)"])
app.include_router(optimization.router, prefix="/api/v1/optimize", tags=["Optimization (v1)"])


@app.get("/health", tags=["System"])
def health_check():
    """
    Health check endpoint returning system status and metadata.
    """
    return {
        "status": "healthy",
        "service": "RailOpt Flow API",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "team": "Team AETHER (SIH26027)",
    }


@app.get("/", tags=["System"])
def root():
    """
    Root endpoint providing API information and documentation link.
    """
    return {
        "message": "Welcome to RailOpt Flow API",
        "documentation": "/docs",
        "health": "/health",
        "endpoints": {
            "tracks": "/tracks",
            "maintenance_requests": "/maintenance-requests",
            "conflicts": "/conflicts",
            "kpis": "/kpis",
            "optimize": "/optimize",
        },
        "version": settings.VERSION,
    }
