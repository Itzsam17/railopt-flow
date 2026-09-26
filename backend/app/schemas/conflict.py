from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class ConflictBase(BaseModel):
    track_id: Optional[int] = None
    block_id: Optional[int] = None
    severity: str = "medium"  # critical, high, medium
    description: str
    ai_recommendation: Optional[str] = None
    status: str = "open"  # open, resolved


class ConflictCreate(ConflictBase):
    pass


class ConflictResponse(ConflictBase):
    id: int
    track_name: Optional[str] = None
    created_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
