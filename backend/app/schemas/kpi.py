from typing import Optional, Dict, Any
from pydantic import BaseModel


class KPIMetric(BaseModel):
    value: float
    unit: str = "%"
    display: str
    target: Optional[float] = None
    delta: Optional[float] = None
    delta_display: Optional[str] = None
    status: str = "normal"  # positive, warning, critical, normal


class DashboardKPIResponse(BaseModel):
    # Core 4 KPIs from PRD section 7.1
    asset_availability: KPIMetric
    optimized_blocks: int
    conflict_reduction: KPIMetric
    delay_risk: KPIMetric
    
    # Secondary KPIs
    maintenance_efficiency: KPIMetric
    planning_time_saved_hours: float
    
    # Operational summary counts
    total_tracks: int
    active_corridors: int
    trains_in_network: int
    pending_work_orders: int
    open_conflicts_count: int
    critical_alerts_count: int
    active_blocks_count: int
    
    last_updated: str
