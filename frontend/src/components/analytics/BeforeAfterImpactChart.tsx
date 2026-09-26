import React from 'react';
import { Sparkles } from 'lucide-react';

interface MetricComparison {
  name: string;
  beforeVal: number;
  afterVal: number;
  unit: string;
  beforeDisplay: string;
  afterDisplay: string;
  deltaDisplay: string;
  isPositiveReduction?: boolean;
}

export const BeforeAfterImpactChart: React.FC = () => {
  const metrics: MetricComparison[] = [
    {
      name: 'Asset Availability',
      beforeVal: 94.7,
      afterVal: 96.2,
      unit: '%',
      beforeDisplay: '94.7%',
      afterDisplay: '96.2%',
      deltaDisplay: '+2.4% Gain',
    },
    {
      name: 'Scheduling Conflicts',
      beforeVal: 15,
      afterVal: 4,
      unit: ' conflicts',
      beforeDisplay: '15 Active',
      afterDisplay: '4 Active',
      deltaDisplay: '−73% Reduction',
      isPositiveReduction: true,
    },
    {
      name: 'Train Delay Risk Index',
      beforeVal: 68,
      afterVal: 40,
      unit: ' / 100',
      beforeDisplay: '68 / 100',
      afterDisplay: '40 / 100',
      deltaDisplay: '−41% Disruption',
      isPositiveReduction: true,
    },
    {
      name: 'Maintenance Density',
      beforeVal: 62,
      afterVal: 80,
      unit: '%',
      beforeDisplay: '62% Work/Slot',
      afterDisplay: '80% Work/Slot',
      deltaDisplay: '+18% Throughput',
    },
  ];

  return (
    <div className="rounded-2xl border border-rail-border bg-rail-card p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-rail-ai flex items-center gap-1.5">
            Operational Impact Assessment
          </span>
          <h3 className="text-base font-bold text-rail-text tracking-tight mt-0.5">
            Before / After Optimization Impact
          </h3>
          <p className="text-xs text-rail-muted">
            Comparative performance across 4 core operational commitments
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-3 rounded-sm bg-[#8A8F98]" />
            <span className="text-rail-muted">Before (Manual)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-3 rounded-sm bg-rail-ai" />
            <span className="text-rail-ai font-medium">After (RailOpt Flow)</span>
          </div>
        </div>
      </div>

      {/* Grouped Comparative Bars */}
      <div className="mt-5 space-y-4">
        {metrics.map((m) => {
          const maxVal = Math.max(m.beforeVal, m.afterVal) * 1.15;
          const beforeWidth = (m.beforeVal / maxVal) * 100;
          const afterWidth = (m.afterVal / maxVal) * 100;

          return (
            <div key={m.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-rail-text">{m.name}</span>
                <span className="text-rail-emerald font-bold px-2 py-0.5 rounded bg-rail-emerald/10 border border-rail-emerald/30 text-[10px]">
                  {m.deltaDisplay}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {/* Before Bar */}
                <div className="rounded-lg bg-rail-base p-2 border border-rail-border flex items-center justify-between">
                  <span className="text-[11px] text-rail-muted">Manual Baseline:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-[#2E343D] rounded-full overflow-hidden">
                      <div className="h-full bg-[#8A8F98] rounded-full" style={{ width: `${beforeWidth}%` }} />
                    </div>
                    <span className="text-rail-text font-bold w-12 text-right">{m.beforeDisplay}</span>
                  </div>
                </div>

                {/* After Bar */}
                <div className="rounded-lg bg-rail-card p-2 border border-rail-border flex items-center justify-between">
                  <span className="text-[11px] text-rail-ai font-semibold flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI Optimized:
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-[#2E343D] rounded-full overflow-hidden">
                      <div className="h-full bg-rail-ai rounded-full" style={{ width: `${afterWidth}%` }} />
                    </div>
                    <span className="text-rail-text font-bold w-12 text-right">{m.afterDisplay}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Summary Strip */}
      <div className="mt-4 pt-3 border-t border-rail-border text-xs font-mono text-rail-muted flex items-center justify-between">
        <span>Average Planning Time Reclaimed:</span>
        <span className="text-rail-text font-bold font-mono">2.5+ Hours / Planning Cycle</span>
      </div>
    </div>
  );
};
