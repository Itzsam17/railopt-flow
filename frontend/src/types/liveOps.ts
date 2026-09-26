export type LiveEventType = 
  | 'BLOCK_EVENT'
  | 'TRAIN_MOVEMENT'
  | 'SAFETY_ALERT'
  | 'AI_DISPATCH'
  | 'SPEED_RESTRICTION'
  | 'CREW_TELEMETRY';

export type EventSeverity = 'info' | 'success' | 'warning' | 'critical';

export interface LiveTelemetryEvent {
  id: string;
  timestamp: string;
  type: LiveEventType;
  severity: EventSeverity;
  source: string;
  trackName?: string;
  message: string;
  detail?: string;
  metricDelta?: string;
}

export interface LiveOperationalCounters {
  activeBlocks: number;
  trainsInNetwork: number;
  criticalAlerts: number;
  assetAvailability: number;
  activeSpeedRestrictions: number;
  onTimePunctualityPercent: number;
}
