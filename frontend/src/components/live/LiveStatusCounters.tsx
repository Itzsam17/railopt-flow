import React from 'react';
import { 
  Activity, 
  Train, 
  AlertTriangle, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { LiveOperationalCounters } from '../../types/liveOps';

interface LiveStatusCountersProps {
  counters: LiveOperationalCounters;
}

export const LiveStatusCounters: React.FC<LiveStatusCountersProps> = ({ counters }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Active Blocks Counter - Visually Dominant Focal Point (Raised Surface) */}
      <div className="rounded-2xl border border-rail-border bg-rail-raised p-5 relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rail-amber flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" />
              Active Track Blocks
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-rail-amber/30 text-rail-amber bg-rail-amber/10 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-rail-amber" />
              <span>In progress</span>
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold text-rail-text tracking-tight">
              {counters.activeBlocks}
            </span>
            <span className="text-xs text-rail-muted">
              possession active (T-102)
            </span>
          </div>
        </div>

        <div className="mt-3.5 text-xs text-rail-text bg-rail-base p-2.5 rounded-lg border border-rail-border flex items-center justify-between">
          <span className="text-rail-amber truncate font-medium">BCM Ballast Cleaning</span>
          <span className="text-rail-muted flex items-center gap-1 text-[11px]">
            <Clock className="h-3 w-3 text-rail-muted" />
            02:15h remaining
          </span>
        </div>
      </div>

      {/* 2. Trains in Network Counter (Flatter, quieter) */}
      <div className="rounded-xl border border-rail-border bg-rail-card p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-rail-muted flex items-center gap-1.5">
              <Train className="h-3.5 w-3.5 text-rail-ai" />
              Trains in network
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full border border-rail-ai/30 text-rail-ai bg-rail-ai/10">
              {counters.onTimePunctualityPercent}% punctual
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-rail-text tracking-tight">
              {counters.trainsInNetwork}
            </span>
            <span className="text-xs text-rail-muted">
              active movements
            </span>
          </div>
        </div>

        <div className="mt-3 text-xs text-rail-muted pt-2 border-t border-rail-border flex items-center justify-between">
          <span>18 Express · 8 Suburban</span>
          <span className="text-rail-text font-medium">4 Freight</span>
        </div>
      </div>

      {/* 3. Critical Alerts Counter (Neutral when 0 per prompt) */}
      <div className="rounded-xl border border-rail-border bg-rail-card p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-rail-muted flex items-center gap-1.5">
              <AlertTriangle className={`h-3.5 w-3.5 ${counters.criticalAlerts > 0 ? 'text-rail-red' : 'text-rail-muted'}`} />
              Critical alerts
            </span>
            {counters.criticalAlerts > 0 ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-rail-red/40 text-rail-red bg-rail-red/10">
                Action required
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full border border-rail-border text-rail-muted bg-rail-base">
                Clear
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold tracking-tight ${counters.criticalAlerts > 0 ? 'text-rail-red' : 'text-rail-text'}`}>
              {counters.criticalAlerts}
            </span>
            <span className="text-xs text-rail-muted">
              safety warnings
            </span>
          </div>
        </div>

        <div className="mt-3 text-xs text-rail-muted pt-2 border-t border-rail-border flex items-center justify-between">
          <span>{counters.criticalAlerts > 0 ? 'Review interlocking clash' : 'Zero safety violations'}</span>
          <span className="text-rail-emerald font-medium">Optimal</span>
        </div>
      </div>

      {/* 4. Safety Interlocking Status */}
      <div className="rounded-xl border border-rail-border bg-rail-card p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-rail-muted flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-rail-emerald" />
              Safety index
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-rail-emerald/30 text-rail-emerald bg-rail-emerald/10">
              Verified
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-rail-emerald tracking-tight">
              100%
            </span>
            <span className="text-xs text-rail-muted">
              interlocking integrity
            </span>
          </div>
        </div>

        <div className="mt-3 text-xs text-rail-muted pt-2 border-t border-rail-border flex items-center justify-between">
          <span>Kavach ATP active</span>
          <span className="text-rail-text font-medium">DLI Division</span>
        </div>
      </div>
    </div>
  );
};
