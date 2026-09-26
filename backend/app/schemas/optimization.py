from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel


class OptimizationRequest(BaseModel):
    corridor_ids: Optional[List[int]] = None
    priority_level: Optional[str] = "all"  # all, high, critical
    max_block_duration_hours: Optional[float] = 4.0
    allow_cross_department_bundling: bool = True


class ProposedBlock(BaseModel):
    id: Optional[int] = None
    track_id: int
    track_name: str
    corridor_name: str
    start_time: str
    end_time: str
    duration_hours: float
    linked_work_orders: List[str]  # e.g., ["WO-ENG-2026-081", "WO-SNT-2026-042"]
    departments_involved: List[str]
    activities: List[str]
    source: str = "ai"
    status: str = "scheduled"
    efficiency_score: float = 94.5


class DeltaMetrics(BaseModel):
    availability_delta: float = 2.4   # +2.4% (from 94.7% -> 96.2%)
    conflict_delta: float = -73.0     # -73%
    delay_risk_delta: float = -41.0   # -41%
    efficiency_delta: float = 18.0    # +18%


class OptimizationResponse(BaseModel):
    optimization_run_id: int
    timestamp: str
    status: str
    summary_message: str
    analysis_steps: List[Dict[str, str]]
    delta_metrics: DeltaMetrics
    optimized_blocks: List[ProposedBlock]
    resolved_conflicts_count: int
    total_work_orders_bundled: int
