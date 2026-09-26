import datetime
from sqlalchemy import Column, Integer, String, DateTime, JSON, Float
from app.db.base import Base


class OptimizationRun(Base):
    """
    OptimizationRun Model
    Stores historical and current AI optimization engine runs and the resulting delta metrics.
    """
    __tablename__ = "optimization_runs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    input_snapshot = Column(JSON, nullable=True)  # Snapshot of requests, corridors, and movements analyzed
    
    # Delta metrics (e.g. availability_delta, conflict_delta, delay_risk_delta, efficiency_delta)
    results = Column(JSON, nullable=True)
    availability_delta = Column(Float, nullable=True, default=0.0)    # e.g., +2.4%
    conflict_delta = Column(Float, nullable=True, default=0.0)        # e.g., -73.0%
    delay_risk_delta = Column(Float, nullable=True, default=0.0)      # e.g., -41.0%
    efficiency_delta = Column(Float, nullable=True, default=0.0)      # e.g., +18.0%
    
    status = Column(String(30), nullable=False, default="completed")  # running, completed, failed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return f"<OptimizationRun id={self.id} timestamp={self.timestamp} status='{self.status}'>"
