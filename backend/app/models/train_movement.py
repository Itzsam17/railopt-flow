import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class TrainMovement(Base):
    """
    TrainMovement Model
    Represents scheduled or live train trips through a track/corridor.
    """
    __tablename__ = "train_movements"

    id = Column(Integer, primary_key=True, index=True)
    train_no = Column(String(20), nullable=False, index=True)  # e.g., "12004", "12951"
    corridor_id = Column(Integer, ForeignKey("corridors.id"), nullable=False, index=True)
    scheduled_departure = Column(DateTime, nullable=False)
    scheduled_arrival = Column(DateTime, nullable=False)
    priority = Column(Integer, default=1)  # 1 = Highest (Rajdhani/Vande Bharat), 2 = Mail/Express, 3 = Freight
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    corridor = relationship("Corridor", back_populates="train_movements")

    def __repr__(self):
        return f"<TrainMovement id={self.id} train_no='{self.train_no}' corridor_id={self.corridor_id}>"
