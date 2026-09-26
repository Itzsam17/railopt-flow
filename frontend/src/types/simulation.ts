export type TrainPriorityMode = 'balanced' | 'passenger' | 'freight' | 'maintenance';

export interface SimulationParams {
  blockDurationHours: number; // 1.5 - 6.0 hours
  trainPriority: TrainPriorityMode;
  crewAvailability: number; // 50 - 100%
  bundlingEnabled: boolean;
  corridorFocus: 'all' | 'ndls-agc' | 'dli-gzb' | 'ndls-tkd';
}

export interface SimulationMetrics {
  assetAvailability: number; // percentage e.g. 96.4
  assetAvailabilityDelta: number; // e.g. +1.7
  conflictsCount: number; // e.g. 1
  conflictsDelta: number; // e.g. -3
  maintenanceCompletion: number; // percentage e.g. 92.5
  maintenanceCompletionDelta: number; // e.g. +10.5
  avgTrainDelayMinutes: number; // e.g. 5.8 min
  avgTrainDelayDelta: number; // e.g. -6.6 min
  disruptionIndex: number; // 0 - 100 score
  throughputTrainsPerHour: number; // e.g. 27
  workOrdersCompletedCount: number; // e.g. 18 / 20
  safetyMarginScore: number; // 0 - 100
}

export interface SimulationResult {
  params: SimulationParams;
  timestamp: string;
  baseline: SimulationMetrics;
  simulated: SimulationMetrics;
  aiAssessment: {
    status: 'optimal' | 'warning' | 'balanced' | 'critical';
    title: string;
    summary: string;
    keyTakeaway: string;
    recommendedActions: string[];
  };
}

export interface ScenarioPreset {
  id: string;
  name: string;
  description: string;
  badge: string;
  badgeColor: string;
  params: SimulationParams;
}
