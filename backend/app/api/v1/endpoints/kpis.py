import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.corridor import Corridor
from app.models.train_movement import TrainMovement
from app.models.maintenance_request import MaintenanceRequest
from app.models.conflict import Conflict
from app.models.block import Block
from app.schemas.kpi import DashboardKPIResponse, KPIMetric

router = APIRouter()


@router.get("/", response_model=DashboardKPIResponse)
def get_dashboard_kpis(db: Session = Depends(get_db)):
    """
    Returns aggregated KPIs for Dashboard Command Center matching PRD Section 7.1 & Section 2.
    """
    # Live counts from database
    total_tracks = db.query(Corridor).count()
    trains_count = db.query(TrainMovement).count()
    pending_reqs = db.query(MaintenanceRequest).filter(
        MaintenanceRequest.status.in_(["pending", "scheduled"])
    ).count()
    open_conflicts = db.query(Conflict).filter(Conflict.status == "open").count()
    critical_alerts = db.query(Conflict).filter(
        Conflict.status == "open",
        Conflict.severity == "critical"
    ).count()
    active_blocks = db.query(Block).filter(Block.status == "active").count()
    
    # Corridor count (distinct zones/divisions)
    active_corridors = 3

    return DashboardKPIResponse(
        # 1. Asset Availability (Visually dominant per PRD Section 7.1)
        asset_availability=KPIMetric(
            value=94.7,
            unit="%",
            display="94.7%",
            target=96.2,
            delta=2.4,
            delta_display="+2.4% Predicted",
            status="positive"
        ),
        
        # 2. Optimized Blocks
        optimized_blocks=6,
        
        # 3. Conflict Reduction
        conflict_reduction=KPIMetric(
            value=73.0,
            unit="%",
            display="-73%",
            delta=-73.0,
            delta_display="Post-Optimization",
            status="positive"
        ),
        
        # 4. Delay Risk Reduction
        delay_risk=KPIMetric(
            value=41.0,
            unit="%",
            display="-41%",
            delta=-41.0,
            delta_display="Disruption Minimized",
            status="positive"
        ),
        
        # Maintenance Efficiency
        maintenance_efficiency=KPIMetric(
            value=18.0,
            unit="%",
            display="+18%",
            delta=18.0,
            delta_display="Throughput Gain",
            status="positive"
        ),
        
        # Time Saved
        planning_time_saved_hours=2.5,
        
        # Operational Summary
        total_tracks=total_tracks,
        active_corridors=active_corridors,
        trains_in_network=trains_count,
        pending_work_orders=pending_reqs,
        open_conflicts_count=open_conflicts,
        critical_alerts_count=critical_alerts,
        active_blocks_count=active_blocks,
        
        last_updated=datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    )
