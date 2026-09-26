from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class CorridorBase(BaseModel):
    name: str
    zone: str = "Northern"
    division: str = "DLI"
    current_status: str = "available"  # available, maintenance, block, conflict, unavailable


class CorridorCreate(CorridorBase):
    pass


class CorridorResponse(CorridorBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    # Calculated statistics for UI cards & network map
    active_trains_count: int = 0
    pending_maintenance_count: int = 0
    active_conflicts_count: int = 0

    model_config = ConfigDict(from_attributes=True)
