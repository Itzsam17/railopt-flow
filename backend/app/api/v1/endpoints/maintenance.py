from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.maintenance_request import MaintenanceRequest
from app.models.corridor import Corridor
from app.schemas.maintenance import MaintenanceRequestResponse, MaintenanceRequestCreate

router = APIRouter()


@router.get("/", response_model=List[MaintenanceRequestResponse])
def get_maintenance_requests(
    department: Optional[str] = Query(None, description="Filter by department: Engineering, S&T, Electrical"),
    priority: Optional[str] = Query(None, description="Filter by priority: critical, high, medium, low"),
    status: Optional[str] = Query(None, description="Filter by status: pending, approved, scheduled, completed, rejected"),
    track_id: Optional[int] = Query(None, description="Filter by track ID"),
    db: Session = Depends(get_db)
):
    """
    Retrieve maintenance backlog work orders across Engineering, S&T, and Electrical.
    """
    query = db.query(MaintenanceRequest, Corridor.name.label("track_name")).join(
        Corridor, MaintenanceRequest.track_id == Corridor.id
    )

    if department:
        query = query.filter(MaintenanceRequest.department == department)
    if priority:
        query = query.filter(MaintenanceRequest.priority == priority)
    if status:
        query = query.filter(MaintenanceRequest.status == status)
    if track_id:
        query = query.filter(MaintenanceRequest.track_id == track_id)

    results = []
    for req, track_name in query.all():
        results.append(
            MaintenanceRequestResponse(
                id=req.id,
                work_order_no=req.work_order_no,
                department=req.department,
                track_id=req.track_id,
                track_name=track_name,
                activity_type=req.activity_type,
                duration_hours=req.duration_hours,
                priority=req.priority,
                deadline=req.deadline,
                status=req.status,
                created_at=req.created_at,
                updated_at=req.updated_at,
            )
        )
    return results


@router.get("/{request_id}", response_model=MaintenanceRequestResponse)
def get_maintenance_request_by_id(request_id: int, db: Session = Depends(get_db)):
    """
    Retrieve details for a single work order.
    """
    record = db.query(MaintenanceRequest, Corridor.name.label("track_name")).join(
        Corridor, MaintenanceRequest.track_id == Corridor.id
    ).filter(MaintenanceRequest.id == request_id).first()

    if not record:
        raise HTTPException(status_code=404, detail="Maintenance request not found")

    req, track_name = record
    return MaintenanceRequestResponse(
        id=req.id,
        work_order_no=req.work_order_no,
        department=req.department,
        track_id=req.track_id,
        track_name=track_name,
        activity_type=req.activity_type,
        duration_hours=req.duration_hours,
        priority=req.priority,
        deadline=req.deadline,
        status=req.status,
        created_at=req.created_at,
        updated_at=req.updated_at,
    )
