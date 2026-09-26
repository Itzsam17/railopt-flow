import { 
  SimulationParams, 
  SimulationMetrics, 
  SimulationResult, 
  ScenarioPreset 
} from '../types/simulation';

export const BASELINE_METRICS: SimulationMetrics = {
  assetAvailability: 94.7,
  assetAvailabilityDelta: 0.0,
  conflictsCount: 4,
  conflictsDelta: 0,
  maintenanceCompletion: 82.0,
  maintenanceCompletionDelta: 0.0,
  avgTrainDelayMinutes: 12.4,
  avgTrainDelayDelta: 0.0,
  disruptionIndex: 41.0,
  throughputTrainsPerHour: 24,
  workOrdersCompletedCount: 16,
  safetyMarginScore: 84.0,
};

export const DEFAULT_SIMULATION_PARAMS: SimulationParams = {
  blockDurationHours: 3.5,
  trainPriority: 'balanced',
  crewAvailability: 85,
  bundlingEnabled: true,
  corridorFocus: 'all',
};

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'preset-balanced',
    name: 'Standard Baseline Protocol',
    description: 'Current standard operational settings: 3.5h midday/curfew blocks, balanced hierarchy, and 85% crew staffing.',
    badge: 'Standard',
    badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    params: {
      blockDurationHours: 3.5,
      trainPriority: 'balanced',
      crewAvailability: 85,
      bundlingEnabled: true,
      corridorFocus: 'all',
    },
  },
  {
    id: 'preset-mega-block',
    name: 'Mega-Block Maintenance Blitz',
    description: 'Extended 4.5h coordinated weekend possession windows with 100% crew deployment to eliminate the deferred work backlog.',
    badge: 'High Maintenance Yield',
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    params: {
      blockDurationHours: 4.5,
      trainPriority: 'maintenance',
      crewAvailability: 100,
      bundlingEnabled: true,
      corridorFocus: 'all',
    },
  },
  {
    id: 'preset-passenger-surge',
    name: 'Festival Passenger Express Priority',
    description: 'Strict protection for Vande Bharat, Rajdhani, and suburban locals during festive rush with condensed 2.5h micro-blocks.',
    badge: 'Passenger Punctuality',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    params: {
      blockDurationHours: 2.5,
      trainPriority: 'passenger',
      crewAvailability: 90,
      bundlingEnabled: true,
      corridorFocus: 'ndls-agc',
    },
  },
  {
    id: 'preset-crew-deficit',
    name: 'Emergency Crew & Machine Deficit',
    description: 'Simulates severe monsoonal absenteeism or machinery breakdown with 60% crew capacity and unbundled fallback operations.',
    badge: 'Stress Test',
    badgeColor: 'border-red-500/40 text-red-400 bg-red-500/10',
    params: {
      blockDurationHours: 3.0,
      trainPriority: 'balanced',
      crewAvailability: 60,
      bundlingEnabled: false,
      corridorFocus: 'all',
    },
  },
];

/**
 * Deterministic Simulation Engine
 * Computes realistic operational deltas per PRD Section 7.6 based on slider values:
 * - Block Duration (1.5h - 6.0h)
 * - Train Priority Hierarchy (Passenger, Freight, Maintenance, Balanced)
 * - Crew Availability (50% - 100%)
 * - Cross-Departmental Bundling Enforcement
 */
export function runDeterministicSimulation(params: SimulationParams): SimulationResult {
  const durationOffset = params.blockDurationHours - 3.5; // -2.0 to +2.5
  const crewOffset = (params.crewAvailability - 85) / 15; // -2.33 to +1.0
  const isBundled = params.bundlingEnabled;

  // 1. Maintenance Completion Calculation (%)
  // Extended blocks allow heavy mechanized machinery (BCM, tamping) to ramp up without repeated setup overhead
  let completionBase = 82.0;
  completionBase += durationOffset * 4.6; // e.g. +4.6% per hour of block
  completionBase += crewOffset * 7.8; // e.g. crew capacity directly drives executed work orders
  completionBase += isBundled ? 6.4 : -8.5; // bundling prevents duplicate track isolations

  if (params.trainPriority === 'maintenance') {
    completionBase += 5.5;
  } else if (params.trainPriority === 'passenger') {
    completionBase -= 5.0; // passenger priority constrains block extensions
  } else if (params.trainPriority === 'freight') {
    completionBase -= 2.0;
  }

  const simulatedCompletion = Math.min(99.0, Math.max(38.0, Math.round(completionBase * 10) / 10));
  const workOrdersCount = Math.min(20, Math.max(7, Math.round((simulatedCompletion / 100) * 20)));

  // 2. Asset Availability Calculation (%)
  // High maintenance completion increases long-term asset availability and eliminates temporary speed restrictions (TSR).
  // However, very long blocks without bundling cause daytime corridor starvation.
  let availabilityBase = 94.7;
  const healthBenefit = (simulatedCompletion - 82.0) * 0.055;
  const bundlingBonus = isBundled ? 1.4 : -1.8;
  const downtimePenalty = Math.max(0, params.blockDurationHours - 4.2) * (isBundled ? 0.35 : 1.1);

  let simulatedAvailability = availabilityBase + healthBenefit + bundlingBonus - downtimePenalty;
  simulatedAvailability = Math.min(98.6, Math.max(88.2, Math.round(simulatedAvailability * 10) / 10));

  // 3. Conflict Count Calculation
  // Conflicts spike when blocks are either too rushed (<2.5h), unbundled, or when crew is understaffed causing block overruns
  let baseConflicts = 4;
  if (isBundled) {
    baseConflicts -= 2; // AI bundles co-located requests, wiping out overlap conflicts
  } else {
    baseConflicts += 2; // unbundled requests fight over same physical track
  }

  if (params.crewAvailability < 70) {
    baseConflicts += 2; // overruns past cleared window
  } else if (params.crewAvailability >= 95) {
    baseConflicts -= 1; // punctual execution
  }

  if (params.blockDurationHours > 4.5 && params.trainPriority === 'passenger') {
    baseConflicts += 2; // passenger train timetable collisions
  } else if (params.blockDurationHours <= 2.0 && params.trainPriority === 'maintenance') {
    baseConflicts += 1; // maintenance teams unable to vacate before next path
  }

  const simulatedConflicts = Math.max(0, Math.min(9, baseConflicts));

  // 4. Average Train Delay Calculation (minutes)
  let delayBase = 12.4;
  if (params.trainPriority === 'passenger') {
    delayBase = 4.8; // Passenger rakes prioritized
  } else if (params.trainPriority === 'freight') {
    delayBase = 16.2; // Freight green-signaled, passenger held
  } else if (params.trainPriority === 'maintenance') {
    delayBase = 14.8; // Curfews cause holding at upstream outer signals
  } else {
    delayBase = isBundled ? 6.5 : 13.5;
  }

  // Adjust for block duration length and conflicts
  delayBase += Math.max(0, params.blockDurationHours - 3.5) * 1.5;
  delayBase += simulatedConflicts * 1.2;
  const simulatedDelay = Math.max(1.8, Math.round(delayBase * 10) / 10);

  // 5. Secondary Indices
  const disruptionIndex = Math.min(100, Math.max(12, Math.round((simulatedDelay / 20) * 45 + simulatedConflicts * 6)));
  const throughputPerHour = Math.min(32, Math.max(16, Math.round(28 - (simulatedDelay / 4) + (isBundled ? 3 : -2))));
  const safetyMarginScore = Math.min(99, Math.max(55, Math.round(75 + (params.crewAvailability * 0.15) - (simulatedConflicts * 3.5))));

  const simulatedMetrics: SimulationMetrics = {
    assetAvailability: simulatedAvailability,
    assetAvailabilityDelta: Math.round((simulatedAvailability - BASELINE_METRICS.assetAvailability) * 10) / 10,
    conflictsCount: simulatedConflicts,
    conflictsDelta: simulatedConflicts - BASELINE_METRICS.conflictsCount,
    maintenanceCompletion: simulatedCompletion,
    maintenanceCompletionDelta: Math.round((simulatedCompletion - BASELINE_METRICS.maintenanceCompletion) * 10) / 10,
    avgTrainDelayMinutes: simulatedDelay,
    avgTrainDelayDelta: Math.round((simulatedDelay - BASELINE_METRICS.avgTrainDelayMinutes) * 10) / 10,
    disruptionIndex,
    throughputTrainsPerHour: throughputPerHour,
    workOrdersCompletedCount: workOrdersCount,
    safetyMarginScore,
  };

  // Generate contextual AI assessment narrative
  const aiAssessment = generateAIAssessment(params, simulatedMetrics);

  return {
    params,
    timestamp: new Date().toISOString(),
    baseline: BASELINE_METRICS,
    simulated: simulatedMetrics,
    aiAssessment,
  };
}

function generateAIAssessment(
  params: SimulationParams, 
  sim: SimulationMetrics
): SimulationResult['aiAssessment'] {
  if (params.crewAvailability < 70) {
    return {
      status: 'critical',
      title: 'Manning Deficit Risk: High Operational Vulnerability',
      summary: `Crew & machine capacity at ${params.crewAvailability}% severely limits field execution. ${20 - sim.workOrdersCompletedCount} deferred work orders remain pending on high-speed track segments.`,
      keyTakeaway: 'High likelihood of track possession overruns leading to emergency Temporary Speed Restrictions (TSR) and unplanned passenger holding.',
      recommendedActions: [
        'Deploy mobile auxiliary crews from adjacent AGC division to bridge gap',
        'Prioritize Level-1 ultrasonic rail flaw (USFD) and point machine work orders exclusively',
        'Reschedule routine OHE vegetation clearing to off-peak periods',
      ],
    };
  }

  if (!params.bundlingEnabled) {
    return {
      status: 'warning',
      title: 'Unbundled Friction: Multi-Departmental Fragmentation',
      summary: 'Disabling cross-departmental coordination increases cumulative track possession demand by 4.2 hours across parallel engineering divisions.',
      keyTakeaway: 'Engineering, S&T, and Electrical will enforce separate block corridors, causing duplicate track isolations and elevating conflict frequency to ' + sim.conflictsCount + ' active clashes.',
      recommendedActions: [
        'Re-enable AI Multi-Department Bundling to reclaim ~18% corridor capacity',
        'Consolidate Electrical OHE dropper maintenance with Track Tamping windows',
        'Designate unified sectional site coordinator for joint possession handover',
      ],
    };
  }

  if (params.trainPriority === 'passenger' && sim.assetAvailability >= 95.5) {
    return {
      status: 'optimal',
      title: 'Optimal Passenger Transit Corridor Profile',
      summary: `High passenger punctuality achieved with average train delay compressed to ${sim.avgTrainDelayMinutes} min (-${Math.abs(sim.avgTrainDelayDelta)} min delta), maintaining ${sim.assetAvailability}% asset readiness.`,
      keyTakeaway: 'Rajdhani and Vande Bharat paths are 100% conflict-free while completing ' + sim.workOrdersCompletedCount + ' prioritized maintenance work orders in condensed micro-blocks.',
      recommendedActions: [
        'Approve optimized timetable for immediate dispatch to Northern Railway Controller',
        'Alert freight control to route heavy container rakes via TKD freight bypass siding',
        'Lock in 2.5h curfew window between 01:30 and 04:00 IST',
      ],
    };
  }

  if (params.blockDurationHours >= 4.0 && sim.maintenanceCompletion >= 90) {
    return {
      status: 'optimal',
      title: 'High-Yield Asset Rejuvenation Strategy',
      summary: `Extended ${params.blockDurationHours}h window yields maximum mechanized output (${sim.maintenanceCompletion}% completion), clearing heavy maintenance backlog across T-101, T-102, and T-201.`,
      keyTakeaway: 'Asset availability projected to rise to ' + sim.assetAvailability + '% (+ ' + sim.assetAvailabilityDelta + '%), substantially lowering subsequent unforecast track breakdown incidents.',
      recommendedActions: [
        'Execute multi-track simultaneous possession during scheduled weekend window',
        'Ensure BCM and 09-3X tamping machines are pre-staged at junction loops by 23:00 IST',
        'Schedule follow-up USFD testing after track stabilization',
      ],
    };
  }

  return {
    status: 'balanced',
    title: 'Balanced Operations Profile: Stable Corridor Equilibrium',
    summary: `Simulation indicates stable operational equilibrium with ${sim.assetAvailability}% asset availability, ${sim.conflictsCount} projected conflicts, and ${sim.avgTrainDelayMinutes} min average transit delay.`,
    keyTakeaway: 'Routine operations can proceed with predictable throughput (approx. ' + sim.throughputTrainsPerHour + ' trains/hr) and healthy 84+ safety margins.',
    recommendedActions: [
      'Maintain standard 3.5h block allocations across Northern Railway sections',
      'Monitor live weather and track circuit telemetry in Conflict Center',
      'Review pending work order status prior to final dispatch',
    ],
  };
}
