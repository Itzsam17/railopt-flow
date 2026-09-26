import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base


class Block(Base):
    """
    Block Model
    Represents an allocated track block (window during which train traffic is suspended
    and maintenance work is executed).
    """
    __tablename__ = "blocks"

    id = Column(Integer, primary_key=True, index=True)
    track_id = Column(Integer, ForeignKey("corridors.id"), nullable=False, index=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    linked_work_orders = Column(JSON, nullable=False, default=list)  # list of work order IDs or numbers
    source = Column(String(20), nullable=False, default="ai")  # manual or ai
    status = Column(String(30), nullable=False, default="scheduled")  # scheduled, active, completed, cancelled
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    corridor = relationship("Corridor", back_populates="blocks")
    conflicts = relationship("Conflict", back_populates="block")

    def __repr__(self):
        return f"<Block id={self.id} track_id={self.track_id} source='{self.source}' status='{self.status}'>"
