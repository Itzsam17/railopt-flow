export interface KPIMetric {
  value: number;
  unit: string;
  display: string;
  target?: number;
  delta?: number;
  delta_display?: string;
  status: 'positive' | 'warning' | 'critical' | 'normal';
}

export interface DashboardKPIResponse {
  asset_availability: KPIMetric;
  optimized_blocks: number;
  conflict_reduction: KPIMetric;
  delay_risk: KPIMetric;
  maintenance_efficiency: KPIMetric;
  planning_time_saved_hours: number;
  total_tracks: number;
  active_corridors: number;
  trains_in_network: number;
  pending_work_orders: number;
  open_conflicts_count: number;
  critical_alerts_count: number;
  active_blocks_count: number;
  last_updated: string;
}

export type TrackStatus = 'available' | 'maintenance' | 'block' | 'conflict' | 'unavailable';

export interface CorridorTrack {
  id: number;
  name: string;
  zone: string;
  division: string;
  current_status: TrackStatus;
  created_at?: string;
  updated_at?: string;
  active_trains_count: number;
  pending_maintenance_count: number;
  active_conflicts_count: number;
}

export type DepartmentType = 'Engineering' | 'S&T' | 'Electrical';
export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface MaintenanceRequestItem {
  id: number;
  work_order_no: string;
  department: DepartmentType;
  track_id: number;
  track_name: string;
  activity_type: string;
  duration_hours: number;
  priority: PriorityLevel;
  deadline?: string;
  status: 'pending' | 'approved' | 'scheduled' | 'completed' | 'rejected';
}

export interface TimelineBlock {
  id: string | number;
  track_name: string; // e.g. "T-101" or "Crew-ENG-01"
  start_hour: number; // 0.0 to 24.0 (e.g. 1.5 = 01:30)
  duration_hours: number; // e.g. 3.5
  source: 'manual' | 'ai';
  status: 'active' | 'scheduled' | 'completed';
  linked_work_orders: string[]; // e.g. ["WO-ENG-2026-081", "WO-SNT-2026-041"]
  departments: DepartmentType[];
  activities: string[];
  efficiency_score?: number;
}

export interface AIRecommendation {
  id: string;
  title: string;
  track_name: string;
  description: string;
  departments: DepartmentType[];
  work_orders: string[];
  suggested_start_hour: number;
  duration_hours: number;
  gain_metric: string;
  impact_tag: string;
}

export interface OptimizationResult {
  run_id: number;
  timestamp: string;
  summary_message: string;
  delta_metrics: {
    availability_delta: number;
    conflict_delta: number;
    delay_risk_delta: number;
    efficiency_delta: number;
  };
  optimized_blocks: TimelineBlock[];
  resolved_conflicts_count: number;
  total_work_orders_bundled: number;
}

export type ConflictSeverity = 'critical' | 'high' | 'medium';
export type ConflictStatus = 'open' | 'resolved';

export interface ConflictItem {
  id: number;
  track_id: number;
  track_name: string;
  block_id?: number | null;
  severity: ConflictSeverity;
  description: string;
  ai_recommendation: string;
  time_window?: string;
  status: ConflictStatus;
  affected_trains?: string[];
  created_at?: string;
  resolved_at?: string | null;
}
