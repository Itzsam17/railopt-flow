from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.corridor import Corridor
from app.models.train_movement import TrainMovement
from app.models.maintenance_request import MaintenanceRequest
from app.models.conflict import Conflict
from app.schemas.corridor import CorridorResponse

router = APIRouter()


@router.get("/", response_model=List[CorridorResponse])
def get_tracks(
    status: Optional[str] = Query(None, description="Filter by track status (available, maintenance, block, conflict)"),
    division: Optional[str] = Query(None, description="Filter by division (e.g. DLI, AGC)"),
    db: Session = Depends(get_db)
):
    """
    Retrieve all railway tracks and corridors across the network.
    Includes live status, active trains count, pending maintenance, and conflicts.
    """
    query = db.query(Corridor)
    if status:
        query = query.filter(Corridor.current_status == status)
    if division:
        query = query.filter(Corridor.division == division)
    
    corridors = query.all()
    
    # Calculate live aggregated counters for each corridor
    results = []
    for c in corridors:
        active_trains = db.query(TrainMovement).filter(TrainMovement.corridor_id == c.id).count()
        pending_maint = db.query(MaintenanceRequest).filter(
            MaintenanceRequest.track_id == c.id,
            MaintenanceRequest.status.in_(["pending", "scheduled"])
        ).count()
        active_conflicts = db.query(Conflict).filter(
            Conflict.track_id == c.id,
            Conflict.status == "open"
        ).count()

        results.append(
            CorridorResponse(
                id=c.id,
                name=c.name,
                zone=c.zone,
                division=c.division,
                current_status=c.current_status,
                created_at=c.created_at,
                updated_at=c.updated_at,
                active_trains_count=active_trains,
                pending_maintenance_count=pending_maint,
                active_conflicts_count=active_conflicts,
            )
        )
    return results


@router.get("/{track_id}", response_model=CorridorResponse)
def get_track_by_id(track_id: int, db: Session = Depends(get_db)):
    """
    Retrieve details for a single track.
    """
    c = db.query(Corridor).filter(Corridor.id == track_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Track not found")
        
    active_trains = db.query(TrainMovement).filter(TrainMovement.corridor_id == c.id).count()
    pending_maint = db.query(MaintenanceRequest).filter(
        MaintenanceRequest.track_id == c.id,
        MaintenanceRequest.status.in_(["pending", "scheduled"])
    ).count()
    active_conflicts = db.query(Conflict).filter(
        Conflict.track_id == c.id,
        Conflict.status == "open"
    ).count()

    return CorridorResponse(
        id=c.id,
        name=c.name,
        zone=c.zone,
        division=c.division,
        current_status=c.current_status,
        created_at=c.created_at,
        updated_at=c.updated_at,
        active_trains_count=active_trains,
        pending_maintenance_count=pending_maint,
        active_conflicts_count=active_conflicts,
    )
