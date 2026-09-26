import { LiveTelemetryEvent, LiveOperationalCounters } from '../types/liveOps';

export const INITIAL_LIVE_COUNTERS: LiveOperationalCounters = {
  activeBlocks: 1,
  trainsInNetwork: 30,
  criticalAlerts: 2,
  assetAvailability: 94.7,
  activeSpeedRestrictions: 1,
  onTimePunctualityPercent: 96.7,
};

export const INITIAL_LIVE_EVENTS: LiveTelemetryEvent[] = [
  {
    id: 'evt-init-1',
    timestamp: '12:44:02 IST',
    type: 'BLOCK_EVENT',
    severity: 'info',
    source: 'PWL Section Controller',
    trackName: 'T-102',
    message: 'Active Possession: Ballast Cleaning Machine (BCM-09) operating between Palwal & Mathura Down line.',
    detail: 'Work Order WO-ENG-2026-082 · 02:15 hrs remaining in 4.0h allotted window.',
    metricDelta: 'Occupied',
  },
  {
    id: 'evt-init-2',
    timestamp: '12:43:45 IST',
    type: 'TRAIN_MOVEMENT',
    severity: 'success',
    source: 'GPS RTIS Telemetry',
    trackName: 'T-101',
    message: 'Train 22436 (Vande Bharat Express) cleared Faridabad (FDB) on Up Main line at 128 km/h.',
    detail: 'Punctuality status: ON-TIME (0 min variance). Next stop: New Delhi Central (NDLS).',
    metricDelta: '+128 km/h',
  },
  {
    id: 'evt-init-3',
    timestamp: '12:43:10 IST',
    type: 'AI_DISPATCH',
    severity: 'info',
    source: 'RailOpt Optimization Core',
    trackName: 'T-201',
    message: 'AI bundled upcoming S&T Point machine check with Turnout Cross renewal on DLI-GZB Up Main.',
    detail: 'Saved 3.0h redundant track isolation. Next maintenance slot shifted to 01:00 curfew.',
    metricDelta: '+3.0h Saved',
  },
  {
    id: 'evt-init-4',
    timestamp: '12:42:28 IST',
    type: 'SPEED_RESTRICTION',
    severity: 'warning',
    source: 'Track Inspection Unit',
    trackName: 'T-104',
    message: 'Caution Order: TSR 45 km/h enforced on Agra High-Speed Chord loop due to turnout recalibration.',
    detail: 'Engineering cautionary aspect active. S&T work order WO-SNT-2026-044 pending.',
    metricDelta: 'TSR 45 km/h',
  },
  {
    id: 'evt-init-5',
    timestamp: '12:41:50 IST',
    type: 'CREW_TELEMETRY',
    severity: 'info',
    source: 'Crew Field Radio',
    trackName: 'Crew-ENG-01',
    message: 'Engineering Tamping Gang-4 reported equipment pre-staged at New Delhi Yard siding.',
    detail: 'Ready for scheduled 3.0h nocturnal possession on T-101 at 01:30 IST.',
    metricDelta: 'Staffed 100%',
  },
];

// Continuous pool of realistic operational events to simulate live stream
const EVENT_TEMPLATES: Omit<LiveTelemetryEvent, 'id' | 'timestamp'>[] = [
  {
    type: 'TRAIN_MOVEMENT',
    severity: 'success',
    source: 'GPS RTIS Telemetry',
    trackName: 'T-103',
    message: 'Train 12004 (Lucknow Shatabdi Express) passed Mathura Jn (MTJ) on Scheduled Path.',
    detail: 'Cruising at 124 km/h with 0 min timetable variance on Agra Up Main line.',
    metricDelta: 'On Time',
  },
  {
    type: 'BLOCK_EVENT',
    severity: 'info',
    source: 'Electrical Traction Control',
    trackName: 'T-102',
    message: 'OHE Tower Wagon commenced 25kV catenary isolation check on T-102.',
    detail: 'Coordinated joint block with Ballast Cleaning crew under single supervisor.',
    metricDelta: 'Isolated',
  },
  {
    type: 'TRAIN_MOVEMENT',
    severity: 'info',
    source: 'Yard Master CNB',
    trackName: 'T-302',
    message: 'FRT-9043 (BOXN Loaded Coal Rake) routed into Dadri Freight Bypass track.',
    detail: 'Mainline clearance preserved for oncoming 12424 Dibrugarh Rajdhani Express.',
    metricDelta: 'Bypass OK',
  },
  {
    type: 'SAFETY_ALERT',
    severity: 'critical',
    source: 'Automated Signaling Radar',
    trackName: 'T-104',
    message: 'Signaling Circuit Proximity: Train 12424 approaching T-104 conflict zone.',
    detail: 'RailOpt AI automated speed restriction advisory broadcast to Loco Pilot.',
    metricDelta: 'Caution',
  },
  {
    type: 'AI_DISPATCH',
    severity: 'success',
    source: 'RailOpt AI Engine',
    trackName: 'T-101',
    message: 'Auto-Resolution: Timetable conflict on T-101 resolved via 15-minute maintenance shift.',
    detail: 'No delay penalty incurred for Vande Bharat; work order WO-ENG-2026-081 cleared for midday.',
    metricDelta: '-1 Conflict',
  },
  {
    type: 'TRAIN_MOVEMENT',
    severity: 'success',
    source: 'GPS RTIS Telemetry',
    trackName: 'T-202',
    message: 'Suburban EMU Local (64402) departed Anand Vihar (ANVT) on-time.',
    detail: 'Passenger load: 92% capacity. Headway: 6 minutes from preceding rake.',
    metricDelta: '+78 km/h',
  },
  {
    type: 'CREW_TELEMETRY',
    severity: 'info',
    source: 'S&T Telemetry Unit',
    trackName: 'T-201',
    message: 'Digital Axle Counter head inspection completed on DLI-GZB Up Main.',
    detail: 'Telemetry calibration confirmed within 2mm railway board safety tolerance.',
    metricDelta: 'Pass 100%',
  },
  {
    type: 'BLOCK_EVENT',
    severity: 'success',
    source: 'Senior Section Engineer (P-Way)',
    trackName: 'T-301',
    message: 'Flash Butt Rail Welding completed on Track T-301 (NDLS-TKD Siding).',
    detail: 'Ultrasonic testing clearance certificate issued. Track reopened to freight transit.',
    metricDelta: 'Clearance Granted',
  },
  {
    type: 'TRAIN_MOVEMENT',
    severity: 'info',
    source: 'DLI Suburban Controller',
    trackName: 'T-201',
    message: 'Train 14042 (Mussoorie Express) crossed Yamuna Bridge at 42 km/h caution limit.',
    detail: 'Scheduled path smoothly integrated with upcoming midnight maintenance window.',
    metricDelta: 'Regulated',
  },
  {
    type: 'AI_DISPATCH',
    severity: 'info',
    source: 'Predictive Availability Agent',
    trackName: 'Corridor 1',
    message: 'Corridor 1 Asset Availability reassessed at 95.2% following successful tamping pass.',
    detail: 'Track geometry index (TGI) elevated by +8 points post-ballast packing.',
    metricDelta: '+0.5% Uptime',
  },
  {
    type: 'SPEED_RESTRICTION',
    severity: 'info',
    source: 'Divisional Safety Officer',
    trackName: 'T-102',
    message: 'Temporary Speed Restriction on T-102 upgraded from 30 km/h to 60 km/h.',
    detail: 'Initial ballast consolidation phase approved by on-site Assistant Divisional Engineer.',
    metricDelta: '+30 km/h TSR',
  },
  {
    type: 'TRAIN_MOVEMENT',
    severity: 'success',
    source: 'GPS RTIS Telemetry',
    trackName: 'T-101',
    message: 'Train 22436 (Vande Bharat) arrived New Delhi Central (NDLS) Platform 16 on-time.',
    detail: 'Full run completed with 100% schedule fidelity. 0 minutes aggregate corridor delay.',
    metricDelta: 'Arrived Punctual',
  },
];

let templateIndex = 0;

/**
 * Returns a new simulated telemetry event with current timestamp
 */
export function generateNextLiveEvent(): LiveTelemetryEvent {
  const template = EVENT_TEMPLATES[templateIndex % EVENT_TEMPLATES.length];
  templateIndex++;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }) + ' IST';

  return {
    ...template,
    id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: timeStr,
  };
}
