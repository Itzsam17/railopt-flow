import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class MaintenanceRequest(Base):
    """
    MaintenanceRequest Model
    Work orders raised by Engineering, S&T, or Electrical/Traction departments.
    """
    __tablename__ = "maintenance_requests"

    id = Column(Integer, primary_key=True, index=True)
    work_order_no = Column(String(50), nullable=False, unique=True, index=True)  # e.g., "WO-ENG-2026-081"
    department = Column(String(50), nullable=False, index=True)  # Engineering, S&T, Electrical
    track_id = Column(Integer, ForeignKey("corridors.id"), nullable=False, index=True)
    activity_type = Column(String(100), nullable=False)  # e.g., "Track Tamping", "OHE Inspection", "Point Machine Overhaul"
    duration_hours = Column(Float, nullable=False, default=2.0)
    priority = Column(String(20), nullable=False, default="medium")  # critical, high, medium, low
    deadline = Column(DateTime, nullable=True)
    status = Column(String(30), nullable=False, default="pending")  # pending, approved, scheduled, completed, rejected
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    corridor = relationship("Corridor", back_populates="maintenance_requests")

    def __repr__(self):
        return f"<MaintenanceRequest {self.work_order_no} dept='{self.department}' track_id={self.track_id} status='{self.status}'>"
