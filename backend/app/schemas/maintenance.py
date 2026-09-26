from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class MaintenanceRequestBase(BaseModel):
    work_order_no: str
    department: str  # Engineering, S&T, Electrical
    track_id: int
    activity_type: str
    duration_hours: float = 2.0
    priority: str = "medium"  # critical, high, medium, low
    deadline: Optional[datetime] = None
    status: str = "pending"  # pending, approved, scheduled, completed, rejected


class MaintenanceRequestCreate(MaintenanceRequestBase):
    pass


class MaintenanceRequestResponse(MaintenanceRequestBase):
    id: int
    track_name: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
