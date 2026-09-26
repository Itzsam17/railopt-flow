import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base


class Corridor(Base):
    """
    Corridor/Track Model
    Represents a track segment or corridor across railway zones/divisions.
    Current status can be: available, maintenance, block, conflict, unavailable
    """
    __tablename__ = "corridors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True, index=True)  # e.g., "T-184"
    zone = Column(String(50), nullable=False, default="Northern")       # e.g., "Northern Zone"
    division = Column(String(50), nullable=False, default="DLI")       # e.g., "Delhi (DLI)"
    current_status = Column(String(30), nullable=False, default="available")  # available/maintenance/block/conflict/unavailable
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    train_movements = relationship("TrainMovement", back_populates="corridor", cascade="all, delete-orphan")
    maintenance_requests = relationship("MaintenanceRequest", back_populates="corridor")
    blocks = relationship("Block", back_populates="corridor")
    conflicts = relationship("Conflict", back_populates="corridor")

    def __repr__(self):
        return f"<Corridor id={self.id} name='{self.name}' status='{self.current_status}'>"
