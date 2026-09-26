/// <reference types="vite/client" />
import { 
  DashboardKPIResponse, 
  CorridorTrack, 
  MaintenanceRequestItem, 
  TimelineBlock, 
  OptimizationResult,
  ConflictItem 
} from '../types/api';

const API_BASE = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL || '';

// Fallback seed data in case backend server is starting or offline
const FALLBACK_KPIS: DashboardKPIResponse = {
  asset_availability: {
    value: 94.7,
    unit: '%',
    display: '94.7%',
    target: 96.2,
    delta: 2.4,
    delta_display: '+2.4% Predicted',
    status: 'positive',
  },
  optimized_blocks: 6,
  conflict_reduction: {
    value: 73.0,
    unit: '%',
    display: '-73%',
    delta: -73.0,
    delta_display: 'Post-Optimization',
    status: 'positive',
  },
  delay_risk: {
    value: 41.0,
    unit: '%',
    display: '-41%',
    delta: -41.0,
    delta_display: 'Disruption Minimized',
    status: 'positive',
  },
  maintenance_efficiency: {
    value: 18.0,
    unit: '%',
    display: '+18%',
    delta: 18.0,
    delta_display: 'Throughput Gain',
    status: 'positive',
  },
  planning_time_saved_hours: 2.5,
  total_tracks: 8,
  active_corridors: 3,
  trains_in_network: 30,
  pending_work_orders: 20,
  open_conflicts_count: 4,
  critical_alerts_count: 2,
  active_blocks_count: 1,
  last_updated: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
};

export const FALLBACK_TRACKS: CorridorTrack[] = [
  { id: 1, name: 'T-101', zone: 'Northern Railway', division: 'DLI', current_status: 'available', active_trains_count: 6, pending_maintenance_count: 2, active_conflicts_count: 0 },
  { id: 2, name: 'T-102', zone: 'Northern Railway', division: 'DLI', current_status: 'block', active_trains_count: 0, pending_maintenance_count: 3, active_conflicts_count: 0 },
  { id: 3, name: 'T-103', zone: 'Northern Railway', division: 'AGC', current_status: 'available', active_trains_count: 4, pending_maintenance_count: 1, active_conflicts_count: 0 },
  { id: 4, name: 'T-104', zone: 'Northern Railway', division: 'AGC', current_status: 'conflict', active_trains_count: 2, pending_maintenance_count: 4, active_conflicts_count: 1 },
  { id: 5, name: 'T-201', zone: 'Northern Railway', division: 'DLI', current_status: 'conflict', active_trains_count: 5, pending_maintenance_count: 3, active_conflicts_count: 1 },
  { id: 6, name: 'T-202', zone: 'Northern Railway', division: 'DLI', current_status: 'available', active_trains_count: 7, pending_maintenance_count: 2, active_conflicts_count: 0 },
  { id: 7, name: 'T-301', zone: 'Northern Railway', division: 'DLI', current_status: 'maintenance', active_trains_count: 0, pending_maintenance_count: 3, active_conflicts_count: 0 },
  { id: 8, name: 'T-302', zone: 'Northern Railway', division: 'DLI', current_status: 'available', active_trains_count: 6, pending_maintenance_count: 2, active_conflicts_count: 0 },
];

export const FALLBACK_MAINTENANCE_REQUESTS: MaintenanceRequestItem[] = [
  // Engineering (7)
  { id: 1, work_order_no: 'WO-ENG-2026-081', department: 'Engineering', track_id: 1, track_name: 'T-101', activity_type: 'Track Tamping (09-3X Machine)', duration_hours: 3.0, priority: 'critical', status: 'pending' },
  { id: 2, work_order_no: 'WO-ENG-2026-082', department: 'Engineering', track_id: 2, track_name: 'T-102', activity_type: 'High-Output Ballast Cleaning (BCM)', duration_hours: 4.0, priority: 'high', status: 'scheduled' },
  { id: 3, work_order_no: 'WO-ENG-2026-083', department: 'Engineering', track_id: 3, track_name: 'T-103', activity_type: 'Deep Screening of Turnouts', duration_hours: 3.5, priority: 'medium', status: 'pending' },
  { id: 4, work_order_no: 'WO-ENG-2026-084', department: 'Engineering', track_id: 4, track_name: 'T-104', activity_type: 'Rail Ultrasonic Testing (USFD Rake)', duration_hours: 2.5, priority: 'high', status: 'pending' },
  { id: 5, work_order_no: 'WO-ENG-2026-085', department: 'Engineering', track_id: 5, track_name: 'T-201', activity_type: 'Turnout Diamond Cross Renewal', duration_hours: 4.0, priority: 'critical', status: 'pending' },
  { id: 6, work_order_no: 'WO-ENG-2026-086', department: 'Engineering', track_id: 6, track_name: 'T-202', activity_type: 'Switch Expansion Joint Adjustment', duration_hours: 2.0, priority: 'low', status: 'pending' },
  { id: 7, work_order_no: 'WO-ENG-2026-087', department: 'Engineering', track_id: 7, track_name: 'T-301', activity_type: 'Mobile Flash Butt Rail Welding', duration_hours: 3.0, priority: 'high', status: 'scheduled' },

  // S&T (7)
  { id: 8, work_order_no: 'WO-SNT-2026-041', department: 'S&T', track_id: 1, track_name: 'T-101', activity_type: 'Point Machine 220 Overhaul', duration_hours: 2.5, priority: 'high', status: 'pending' },
  { id: 9, work_order_no: 'WO-SNT-2026-042', department: 'S&T', track_id: 2, track_name: 'T-102', activity_type: 'Glued Insulated Rail Joint Renewal', duration_hours: 2.0, priority: 'medium', status: 'scheduled' },
  { id: 10, work_order_no: 'WO-SNT-2026-043', department: 'S&T', track_id: 3, track_name: 'T-103', activity_type: 'Track Circuit High-Freq Calibration', duration_hours: 1.5, priority: 'low', status: 'pending' },
  { id: 11, work_order_no: 'WO-SNT-2026-044', department: 'S&T', track_id: 4, track_name: 'T-104', activity_type: 'Electronic Interlocking Logic Check', duration_hours: 3.0, priority: 'critical', status: 'pending' },
  { id: 12, work_order_no: 'WO-SNT-2026-045', department: 'S&T', track_id: 5, track_name: 'T-201', activity_type: 'Automatic Signalling Aspect Upgrade', duration_hours: 2.5, priority: 'high', status: 'pending' },
  { id: 13, work_order_no: 'WO-SNT-2026-046', department: 'S&T', track_id: 6, track_name: 'T-202', activity_type: 'Digital Axle Counter Head Replacement', duration_hours: 2.0, priority: 'medium', status: 'pending' },
  { id: 14, work_order_no: 'WO-SNT-2026-047', department: 'S&T', track_id: 8, track_name: 'T-302', activity_type: 'Signalling Cable Insulation Meggering', duration_hours: 1.5, priority: 'low', status: 'pending' },

  // Electrical (6)
  { id: 15, work_order_no: 'WO-ELE-2026-011', department: 'Electrical', track_id: 1, track_name: 'T-101', activity_type: 'OHE Catenary Wire Dropper Renewal', duration_hours: 3.0, priority: 'high', status: 'pending' },
  { id: 16, work_order_no: 'WO-ELE-2026-012', department: 'Electrical', track_id: 2, track_name: 'T-102', activity_type: 'Neutral Section Insulator Replacement', duration_hours: 3.5, priority: 'critical', status: 'scheduled' },
  { id: 17, work_order_no: 'WO-ELE-2026-013', department: 'Electrical', track_id: 3, track_name: 'T-103', activity_type: 'Traction Mast Cantilever Realignment', duration_hours: 2.0, priority: 'medium', status: 'pending' },
  { id: 18, work_order_no: 'WO-ELE-2026-014', department: 'Electrical', track_id: 4, track_name: 'T-104', activity_type: 'Substation Isolator Switch Testing', duration_hours: 2.5, priority: 'high', status: 'pending' },
  { id: 19, work_order_no: 'WO-ELE-2026-015', department: 'Electrical', track_id: 5, track_name: 'T-201', activity_type: 'Contact Wire Height & Stagger Tune', duration_hours: 3.0, priority: 'critical', status: 'pending' },
  { id: 20, work_order_no: 'WO-ELE-2026-016', department: 'Electrical', track_id: 7, track_name: 'T-301', activity_type: 'OHE Portal Structure Earthing Overhaul', duration_hours: 2.0, priority: 'medium', status: 'scheduled' },
];

export async function fetchDashboardKPIs(): Promise<DashboardKPIResponse> {
  try {
    const res = await fetch(`${API_BASE}/kpis/`);
    if (!res.ok) throw new Error(`Failed to fetch KPIs: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using fallback mock KPI dataset:', err);
    return FALLBACK_KPIS;
  }
}

export async function fetchTracks(): Promise<CorridorTrack[]> {
  try {
    const res = await fetch(`${API_BASE}/tracks/`);
    if (!res.ok) throw new Error(`Failed to fetch tracks: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using fallback mock tracks dataset:', err);
    return FALLBACK_TRACKS;
  }
}

export async function fetchMaintenanceRequests(dept?: string): Promise<MaintenanceRequestItem[]> {
  try {
    const url = dept ? `${API_BASE}/maintenance-requests/?department=${encodeURIComponent(dept)}` : `${API_BASE}/maintenance-requests/`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch maintenance requests: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using fallback maintenance dataset:', err);
    if (dept) {
      return FALLBACK_MAINTENANCE_REQUESTS.filter((r) => r.department === dept);
    }
    return FALLBACK_MAINTENANCE_REQUESTS;
  }
}

export async function runOptimizationPlan(): Promise<OptimizationResult> {
  try {
    const res = await fetch(`${API_BASE}/optimize/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priority_level: 'all',
        max_block_duration_hours: 4.0,
        allow_cross_department_bundling: true,
      }),
    });
    if (!res.ok) throw new Error(`Optimization call failed: ${res.statusText}`);
    const data = await res.json();

    // Map backend proposed blocks to TimelineBlock format
    const timelineBlocks: TimelineBlock[] = (data.optimized_blocks || []).map((b: any, idx: number) => {
      // derive start hour from start_time string (e.g. "2026-09-24T01:00:00Z" -> 1.0)
      let startHour = 1.5 + (idx * 3.5);
      if (b.start_time && b.start_time.includes('T')) {
        const timePart = b.start_time.split('T')[1];
        const [h, m] = timePart.split(':');
        startHour = parseInt(h, 10) + parseInt(m, 10) / 60;
      }
      return {
        id: b.id || `opt-${idx}`,
        track_name: b.track_name,
        start_hour: Math.min(startHour, 20),
        duration_hours: b.duration_hours || 3.5,
        source: 'ai',
        status: 'scheduled',
        linked_work_orders: b.linked_work_orders || [],
        departments: (b.departments_involved || ['Engineering', 'S&T', 'Electrical']) as any,
        activities: b.activities || ['Coordinated Maintenance Window'],
        efficiency_score: b.efficiency_score || 95.0,
      };
    });

    return {
      run_id: data.optimization_run_id || 1,
      timestamp: data.timestamp || new Date().toISOString(),
      summary_message: data.summary_message || 'Optimization completed successfully.',
      delta_metrics: data.delta_metrics || {
        availability_delta: 2.4,
        conflict_delta: -73.0,
        delay_risk_delta: -41.0,
        efficiency_delta: 18.0,
      },
      optimized_blocks: timelineBlocks,
      resolved_conflicts_count: data.resolved_conflicts_count || 4,
      total_work_orders_bundled: data.total_work_orders_bundled || 14,
    };
  } catch (err) {
    console.warn('Backend optimize unavailable, using generated AI plan:', err);
    // Realistic fallback AI-bundled plan
    const fallbackBlocks: TimelineBlock[] = [
      {
        id: 'ai-bundle-101',
        track_name: 'T-101',
        start_hour: 1.0,
        duration_hours: 3.5,
        source: 'ai',
        status: 'scheduled',
        linked_work_orders: ['WO-ENG-2026-081', 'WO-SNT-2026-041', 'WO-ELE-2026-011'],
        departments: ['Engineering', 'S&T', 'Electrical'],
        activities: ['Track Tamping (09-3X)', 'Point Machine Overhaul', 'Catenary Wire Dropper'],
        efficiency_score: 96.5,
      },
      {
        id: 'ai-bundle-102',
        track_name: 'T-102',
        start_hour: 1.5,
        duration_hours: 4.0,
        source: 'ai',
        status: 'active',
        linked_work_orders: ['WO-ENG-2026-082', 'WO-SNT-2026-042', 'WO-ELE-2026-012'],
        departments: ['Engineering', 'S&T', 'Electrical'],
        activities: ['Ballast Cleaning (BCM)', 'Insulated Joint Renewal', 'Neutral Section Replacement'],
        efficiency_score: 98.0,
      },
      {
        id: 'ai-bundle-104',
        track_name: 'T-104',
        start_hour: 11.0,
        duration_hours: 3.0,
        source: 'ai',
        status: 'scheduled',
        linked_work_orders: ['WO-ENG-2026-084', 'WO-SNT-2026-044', 'WO-ELE-2026-014'],
        departments: ['Engineering', 'S&T', 'Electrical'],
        activities: ['Rail USFD Rake', 'Interlocking Logic Check', 'Isolator Switch Testing'],
        efficiency_score: 94.0,
      },
      {
        id: 'ai-bundle-201',
        track_name: 'T-201',
        start_hour: 2.0,
        duration_hours: 4.0,
        source: 'ai',
        status: 'scheduled',
        linked_work_orders: ['WO-ENG-2026-085', 'WO-SNT-2026-045', 'WO-ELE-2026-015'],
        departments: ['Engineering', 'S&T', 'Electrical'],
        activities: ['Diamond Cross Renewal', 'Signal Aspect Upgrade', 'Contact Wire Stagger'],
        efficiency_score: 97.2,
      },
      {
        id: 'ai-bundle-301',
        track_name: 'T-301',
        start_hour: 10.5,
        duration_hours: 3.5,
        source: 'ai',
        status: 'scheduled',
        linked_work_orders: ['WO-ENG-2026-087', 'WO-ELE-2026-016'],
        departments: ['Engineering', 'Electrical'],
        activities: ['Flash Butt Rail Welding', 'Earthing Overhaul'],
        efficiency_score: 93.5,
      },
      {
        id: 'ai-crew-eng',
        track_name: 'Crew-ENG-01',
        start_hour: 1.0,
        duration_hours: 3.5,
        source: 'ai',
        status: 'scheduled',
        linked_work_orders: ['WO-ENG-2026-081'],
        departments: ['Engineering'],
        activities: ['Deployed to T-101'],
        efficiency_score: 95.0,
      },
      {
        id: 'ai-crew-snt',
        track_name: 'Crew-SNT-01',
        start_hour: 1.0,
        duration_hours: 3.5,
        source: 'ai',
        status: 'scheduled',
        linked_work_orders: ['WO-SNT-2026-041'],
        departments: ['S&T'],
        activities: ['Deployed to T-101'],
        efficiency_score: 95.0,
      },
    ];

    return {
      run_id: 101,
      timestamp: new Date().toISOString(),
      summary_message: 'Cross-department AI bundling completed: 14 requests bundled into 5 coordinated windows.',
      delta_metrics: {
        availability_delta: 2.4,
        conflict_delta: -73.0,
        delay_risk_delta: -41.0,
        efficiency_delta: 18.0,
      },
      optimized_blocks: fallbackBlocks,
      resolved_conflicts_count: 4,
      total_work_orders_bundled: 14,
    };
  }
}

export const FALLBACK_CONFLICTS: ConflictItem[] = [
  {
    id: 1,
    track_id: 4,
    track_name: 'T-104',
    severity: 'critical',
    time_window: '10:00 - 12:00 IST',
    affected_trains: ['12424 Dibrugarh Rajdhani Express', '12004 Lucknow Shatabdi'],
    description: 'Critical collision: WO-SNT-2026-044 (Electronic Interlocking Logic Check) requested during peak transit slot for Train 12424 without track possession clearance.',
    ai_recommendation: 'Shift interlocking window to 01:00-04:00 night curfew corridor, or re-route Rajdhani via T-103 Up Main loop line with 0 delay.',
    status: 'open',
    created_at: '2026-09-24T06:15:00Z',
  },
  {
    id: 2,
    track_id: 5,
    track_name: 'T-201',
    severity: 'high',
    time_window: '02:00 - 06:00 IST',
    affected_trains: ['14042 Mussoorie Express'],
    description: 'Uncoordinated departmental block: Engineering requested Turnout Renewal (4.0h) while Electrical independently scheduled Contact Wire Stagger (3.0h) on overlapping spans.',
    ai_recommendation: 'Consolidate into single AI coordinated block window from 01:00-05:00, saving 3.0 hours of track downtime and preventing duplicate signal isolations.',
    status: 'open',
    created_at: '2026-09-24T07:20:00Z',
  },
  {
    id: 3,
    track_id: 1,
    track_name: 'T-101',
    severity: 'critical',
    time_window: '12:00 - 15:00 IST',
    affected_trains: ['22436 Vande Bharat Express'],
    description: 'Timetable conflict: WO-ENG-2026-081 (Track Tamping 3h) clashes directly with Priority-1 Train 22436 (Vande Bharat Express) departing at 14:00.',
    ai_recommendation: 'Bundle with S&T Point Overhaul (WO-SNT-2026-041) into a single 3.5h midday window from 10:30-14:00, releasing the track 15 minutes before Vande Bharat departure.',
    status: 'open',
    created_at: '2026-09-24T07:45:00Z',
  },
  {
    id: 4,
    track_id: 7,
    track_name: 'T-301',
    severity: 'medium',
    time_window: '15:30 - 18:30 IST',
    affected_trains: ['FRT-9043 (BOXN Coal Rake)'],
    description: 'Freight disruption risk: Scheduled block (WO-ENG-2026-087 + WO-ELE-2026-016) coincides with peak coal freight path FRT-9043.',
    ai_recommendation: 'Regulate freight departure by +45 minutes at CNB yard to utilize existing block without throughput penalty.',
    status: 'open',
    created_at: '2026-09-24T08:10:00Z',
  },
];

export async function fetchConflicts(severity?: string, status?: string): Promise<ConflictItem[]> {
  try {
    const params = new URLSearchParams();
    if (severity && severity !== 'all') params.append('severity', severity);
    if (status && status !== 'all') params.append('status', status);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/conflicts/${query}`);
    if (!res.ok) throw new Error(`Failed to fetch conflicts: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using fallback conflicts dataset:', err);
    let result = [...FALLBACK_CONFLICTS];
    if (severity && severity !== 'all') {
      result = result.filter((c) => c.severity === severity);
    }
    if (status && status !== 'all') {
      result = result.filter((c) => c.status === status);
    }
    return result;
  }
}

export async function resolveConflictApi(conflictId: number): Promise<ConflictItem> {
  try {
    const res = await fetch(`${API_BASE}/conflicts/${conflictId}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`Failed to resolve conflict: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, resolving conflict locally:', err);
    const existing = FALLBACK_CONFLICTS.find((c) => c.id === conflictId);
    return {
      ...(existing || FALLBACK_CONFLICTS[0]),
      id: conflictId,
      status: 'resolved',
      resolved_at: new Date().toISOString(),
    };
  }
}
