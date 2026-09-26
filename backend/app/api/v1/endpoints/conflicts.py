import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.conflict import Conflict
from app.models.corridor import Corridor
from app.schemas.conflict import ConflictResponse

router = APIRouter()


@router.get("/", response_model=List[ConflictResponse])
def get_conflicts(
    severity: Optional[str] = Query(None, description="Filter by severity: critical, high, medium"),
    status: Optional[str] = Query(None, description="Filter by status: open, resolved"),
    db: Session = Depends(get_db)
):
    """
    Retrieve all detected conflicts between train movements and maintenance requests.
    """
    query = db.query(Conflict, Corridor.name.label("track_name")).outerjoin(
        Corridor, Conflict.track_id == Corridor.id
    )

    if severity:
        query = query.filter(Conflict.severity == severity)
    if status:
        query = query.filter(Conflict.status == status)

    results = []
    for conf, track_name in query.all():
        results.append(
            ConflictResponse(
                id=conf.id,
                track_id=conf.track_id,
                block_id=conf.block_id,
                track_name=track_name,
                severity=conf.severity,
                description=conf.description,
                ai_recommendation=conf.ai_recommendation,
                status=conf.status,
                created_at=conf.created_at,
                resolved_at=conf.resolved_at,
            )
        )
    return results


@router.post("/{conflict_id}/resolve", response_model=ConflictResponse)
def resolve_conflict(conflict_id: int, db: Session = Depends(get_db)):
    """
    Resolve a specific conflict (automated or manual approval).
    """
    conf = db.query(Conflict).filter(Conflict.id == conflict_id).first()
    if not conf:
        raise HTTPException(status_code=404, detail="Conflict not found")

    conf.status = "resolved"
    conf.resolved_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(conf)

    track_name = None
    if conf.track_id:
        track = db.query(Corridor).filter(Corridor.id == conf.track_id).first()
        if track:
            track_name = track.name

    return ConflictResponse(
        id=conf.id,
        track_id=conf.track_id,
        block_id=conf.block_id,
        track_name=track_name,
        severity=conf.severity,
        description=conf.description,
        ai_recommendation=conf.ai_recommendation,
        status=conf.status,
        created_at=conf.created_at,
        resolved_at=conf.resolved_at,
    )
