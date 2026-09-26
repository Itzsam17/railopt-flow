import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class Conflict(Base):
    """
    Conflict Model
    Detected scheduling collision between train movements and/or maintenance requests.
    """
    __tablename__ = "conflicts"

    id = Column(Integer, primary_key=True, index=True)
    block_id = Column(Integer, ForeignKey("blocks.id"), nullable=True, index=True)
    track_id = Column(Integer, ForeignKey("corridors.id"), nullable=True, index=True)
    severity = Column(String(20), nullable=False, default="medium")  # critical, high, medium
    description = Column(Text, nullable=False)
    ai_recommendation = Column(Text, nullable=True)
    status = Column(String(20), nullable=False, default="open")  # open, resolved
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    # Relationships
    block = relationship("Block", back_populates="conflicts")
    corridor = relationship("Corridor", back_populates="conflicts")

    def __repr__(self):
        return f"<Conflict id={self.id} severity='{self.severity}' status='{self.status}'>"
