import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Send, 
  Activity, 
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SimulationResult } from '../../types/simulation';

interface SimulationResultsProps {
  result: SimulationResult;
  isSimulating: boolean;
  onApplyScenario: () => void;
  appliedSuccess: boolean;
  showSecondaryMetrics?: boolean;
  onToggleDetails?: () => void;
}

export const SimulationResults: React.FC<SimulationResultsProps> = ({
  result,
  isSimulating,
  onApplyScenario,
  appliedSuccess,
  showSecondaryMetrics = false,
  onToggleDetails,
}) => {
  const { baseline, simulated, aiAssessment } = result;

  // Determine delta badge styles
  const getAvailabilityBadge = () => {
    const delta = simulated.assetAvailabilityDelta;
    if (delta > 0) {
      return {
        text: `+${delta.toFixed(1)}%`,
        icon: TrendingUp,
        className: 'text-rail-emerald bg-rail-emerald/10 border-rail-emerald/30',
        label: 'Availability Uplift',
      };
    } else if (delta < 0) {
      return {
        text: `${delta.toFixed(1)}%`,
        icon: TrendingDown,
        className: 'text-rail-red bg-rail-red/10 border-rail-red/30',
        label: 'Availability Drop',
      };
    }
    return {
      text: '0.0%',
      icon: Activity,
      className: 'text-slate-400 bg-rail-subtle border-rail-border',
      label: 'Neutral',
    };
  };

  const getConflictBadge = () => {
    const delta = simulated.conflictsDelta;
    if (delta < 0) {
      return {
        text: `${delta} resolved`,
        className: 'text-rail-emerald bg-rail-emerald/10 border-rail-emerald/30',
      };
    } else if (delta > 0) {
      return {
        text: `+${delta} new clashes`,
        className: 'text-rail-red bg-rail-red/10 border-rail-red/30',
      };
    }
    return {
      text: 'No change',
      className: 'text-slate-400 bg-rail-subtle border-rail-border',
    };
  };

  const getCompletionBadge = () => {
    const delta = simulated.maintenanceCompletionDelta;
    if (delta > 0) {
      return {
        text: `+${delta.toFixed(1)}%`,
        className: 'text-rail-emerald bg-rail-emerald/10 border-rail-emerald/30',
      };
    } else if (delta < 0) {
      return {
        text: `${delta.toFixed(1)}%`,
        className: 'text-rail-amber bg-rail-amber/10 border-rail-amber/30',
      };
    }
    return {
      text: 'Baseline',
      className: 'text-slate-400 bg-rail-subtle border-rail-border',
    };
  };

  const getDelayBadge = () => {
    const delta = simulated.avgTrainDelayDelta;
    if (delta < 0) {
      return {
        text: `${delta.toFixed(1)}m saved`,
        className: 'text-rail-emerald bg-rail-emerald/10 border-rail-emerald/30',
      };
    } else if (delta > 0) {
      return {
        text: `+${delta.toFixed(1)}m delay`,
        className: 'text-rail-amber bg-rail-amber/10 border-rail-amber/30',
      };
    }
    return {
      text: 'Baseline',
      className: 'text-slate-400 bg-rail-subtle border-rail-border',
    };
  };

  const availBadge = getAvailabilityBadge();
  const conflictBadge = getConflictBadge();
  const compBadge = getCompletionBadge();
  const delayBadge = getDelayBadge();

  return (
    <div className={`space-y-6 transition-opacity duration-300 ${isSimulating ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Primary Asset Availability Metric (Always visible and visually dominant - Focal Raised Element) */}
      <div className="rounded-2xl border border-rail-border bg-rail-raised p-6 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold text-rail-ai flex items-center gap-1.5">
                Primary Simulation Output
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${availBadge.className}`}>
                <availBadge.icon className="h-3 w-3" />
                <span>{availBadge.text}</span>
              </span>
            </div>
            <h3 className="text-base font-bold text-rail-text tracking-tight">
              Simulated Asset Availability
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {onToggleDetails && (
              <button
                onClick={onToggleDetails}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rail-border bg-rail-card hover:bg-rail-cardHover text-xs text-rail-muted hover:text-rail-text transition-colors cursor-pointer"
              >
                <span>{showSecondaryMetrics ? 'Hide details' : 'Show details'}</span>
                {showSecondaryMetrics ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>
            )}

            <button
              onClick={onApplyScenario}
              disabled={appliedSuccess}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                appliedSuccess
                  ? 'bg-rail-emerald/20 border border-rail-emerald/40 text-rail-emerald'
                  : 'bg-rail-ai hover:bg-rail-ai/80 text-rail-text'
              }`}
            >
              {appliedSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Applied</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Commit to Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-extrabold text-rail-text tracking-tight">
                {simulated.assetAvailability.toFixed(1)}%
              </span>
              <span className="text-xs text-rail-muted">
                (Baseline: {baseline.assetAvailability}%)
              </span>
            </div>

            {/* Target progress bar */}
            <div className="mt-3.5 space-y-1">
              <div className="flex justify-between text-xs text-rail-muted">
                <span>Target: 96.0%</span>
                <span className={simulated.assetAvailability >= 96 ? 'text-rail-emerald font-medium' : 'text-rail-muted'}>
                  {simulated.assetAvailability >= 96 ? 'Target exceeded' : 'Below target'}
                </span>
              </div>
              <div className="w-full h-2 bg-rail-base border border-rail-border rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-rail-emerald transition-all duration-500 ease-out" 
                  style={{ width: `${Math.min(100, (simulated.assetAvailability / 100) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-6 p-4 rounded-xl border border-rail-border bg-rail-base text-xs">
            <div className="flex items-center gap-2 text-rail-ai font-medium mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Assessment Summary</span>
            </div>
            <p className="text-rail-text leading-relaxed text-xs">
              {aiAssessment.title}: {aiAssessment.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Metrics & Comparison (Behind 'Show details' toggle) */}
      {showSecondaryMetrics && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Secondary Metric Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Metric 2: Open Conflicts */}
            <div className="rounded-xl border border-rail-border bg-rail-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-rail-muted flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-rail-amber" />
                  Timetable conflicts
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${conflictBadge.className}`}>
                  {conflictBadge.text}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold tracking-tight ${
                  simulated.conflictsCount === 0 ? 'text-rail-emerald' : simulated.conflictsCount > 4 ? 'text-rail-red' : 'text-rail-text'
                }`}>
                  {simulated.conflictsCount}
                </span>
                <span className="text-xs text-rail-muted">
                  clashes (was {baseline.conflictsCount})
                </span>
              </div>

              <p className="text-xs text-rail-muted mt-2.5 leading-relaxed">
                {simulated.conflictsCount <= 1 
                  ? 'Zero or minimal path overlapping across express lines.' 
                  : `${simulated.conflictsCount} route clashes require automatic or manual resolution.`}
              </p>
            </div>

            {/* Metric 3: Train Delay Impact */}
            <div className="rounded-xl border border-rail-border bg-rail-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-rail-muted flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-rail-ai" />
                  Average train delay
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${delayBadge.className}`}>
                  {delayBadge.text}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-rail-text tracking-tight">
                  {simulated.avgTrainDelayMinutes.toFixed(1)}
                  <span className="text-xs font-normal text-rail-muted ml-1">min</span>
                </span>
                <span className="text-xs text-rail-muted">
                  (was {baseline.avgTrainDelayMinutes}m)
                </span>
              </div>

              <p className="text-xs text-rail-muted mt-2.5 leading-relaxed">
                Corridor disruption score rated at <strong className="text-rail-text">{simulated.disruptionIndex}/100</strong>.
              </p>
            </div>

            {/* Metric 4: Maintenance Completion */}
            <div className="rounded-xl border border-rail-border bg-rail-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-rail-muted flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-rail-emerald" />
                  Work completion
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${compBadge.className}`}>
                  {compBadge.text}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-rail-text tracking-tight">
                  {simulated.maintenanceCompletion.toFixed(1)}%
                </span>
                <span className="text-xs text-rail-muted">
                  ({simulated.workOrdersCompletedCount}/20 orders)
                </span>
              </div>

              <div className="mt-3.5 w-full h-1.5 bg-rail-base border border-rail-border rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-rail-emerald transition-all duration-500 ease-out" 
                  style={{ width: `${Math.min(100, simulated.maintenanceCompletion)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Before vs After Impact Comparative Breakdown */}
          <div className="rounded-2xl border border-rail-border bg-rail-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rail-border pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-rail-ai" />
                <h4 className="text-xs font-semibold text-rail-text">
                  Baseline vs. simulated scenario comparison
                </h4>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-rail-muted">
                  <span className="h-2 w-2 rounded-full bg-[#8A8F98]" />
                  Baseline plan
                </span>
                <span className="flex items-center gap-1.5 text-rail-ai font-medium">
                  <span className="h-2 w-2 rounded-full bg-rail-ai" />
                  Simulated scenario
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-1 text-xs">
              {/* Row 1: Asset Availability */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-rail-muted">Track asset availability</span>
                  <div className="flex gap-4">
                    <span className="text-rail-muted">{baseline.assetAvailability}%</span>
                    <span className="text-rail-border">→</span>
                    <span className="text-rail-text font-medium">{simulated.assetAvailability}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-rail-base border border-rail-border rounded-lg p-0.5 flex gap-1">
                  <div 
                    className="h-full bg-[#8A8F98] rounded transition-all duration-500"
                    style={{ width: `${(baseline.assetAvailability / 100) * 100}%` }}
                  />
                  <div 
                    className={`h-full rounded transition-all duration-500 ${
                      simulated.assetAvailability >= baseline.assetAvailability ? 'bg-rail-emerald' : 'bg-rail-red'
                    }`}
                    style={{ width: `${Math.abs(simulated.assetAvailabilityDelta)}%` }}
                  />
                </div>
              </div>

              {/* Row 2: Work Orders Executed */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-rail-muted">Work orders executed (out of 20)</span>
                  <div className="flex gap-4">
                    <span className="text-rail-muted">{baseline.workOrdersCompletedCount} / 20</span>
                    <span className="text-rail-border">→</span>
                    <span className="text-rail-text font-medium">{simulated.workOrdersCompletedCount} / 20</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-rail-base border border-rail-border rounded-lg p-0.5 flex">
                  <div 
                    className="h-full bg-rail-ai rounded transition-all duration-500"
                    style={{ width: `${(simulated.workOrdersCompletedCount / 20) * 100}%` }}
                  />
                </div>
              </div>

              {/* Row 3: Timetable Friction (Conflicts Count) */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-rail-muted">Timetable clashes & critical conflicts</span>
                  <div className="flex gap-4">
                    <span className="text-rail-muted">{baseline.conflictsCount} clashes</span>
                    <span className="text-rail-border">→</span>
                    <span className={`font-medium ${simulated.conflictsCount <= 1 ? 'text-rail-emerald' : 'text-rail-amber'}`}>
                      {simulated.conflictsCount} clashes
                    </span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-rail-base border border-rail-border rounded-lg p-0.5 flex">
                  <div 
                    className={`h-full rounded transition-all duration-500 ${
                      simulated.conflictsCount <= 2 ? 'bg-rail-emerald' : simulated.conflictsCount <= 4 ? 'bg-rail-amber' : 'bg-rail-red'
                    }`}
                    style={{ width: `${Math.min(100, (simulated.conflictsCount / 10) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Row 4: Train Throughput */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-rail-muted">Corridor train throughput rate</span>
                  <div className="flex gap-4">
                    <span className="text-rail-muted">{baseline.throughputTrainsPerHour} trains/h</span>
                    <span className="text-rail-border">→</span>
                    <span className="text-rail-text font-medium">{simulated.throughputTrainsPerHour} trains/h</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-rail-base border border-rail-border rounded-lg p-0.5 flex">
                  <div 
                    className="h-full bg-rail-ai rounded transition-all duration-500"
                    style={{ width: `${Math.min(100, (simulated.throughputTrainsPerHour / 35) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
