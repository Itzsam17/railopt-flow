import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface CorridorUtilization {
  corridor: string;
  productivePct: number;
  idlePct: number;
  totalHours: number;
}

export const BlockUtilizationChart: React.FC = () => {
  const corridors: CorridorUtilization[] = [
    { corridor: 'NDLS - AGC (Delhi - Agra Cantt)', productivePct: 86.4, idlePct: 13.6, totalHours: 14.5 },
    { corridor: 'DLI - GZB (Delhi - Ghaziabad)', productivePct: 82.1, idlePct: 17.9, totalHours: 9.5 },
    { corridor: 'NDLS - CNB (Delhi - Kanpur Central)', productivePct: 84.8, idlePct: 15.2, totalHours: 12.0 },
  ];

  return (
    <div className="rounded-2xl border border-rail-border bg-rail-card p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-rail-emerald flex items-center gap-1.5">
            Capacity Optimization
          </span>
          <h3 className="text-base font-bold text-rail-text tracking-tight mt-0.5">
            Block Utilization Efficiency
          </h3>
          <p className="text-xs text-rail-muted">
            Productive work execution vs idle track possession buffer across corridors
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-xs font-mono text-rail-muted block">Net Utilization</span>
            <span className="text-lg font-black text-rail-emerald font-sans">84.2%</span>
          </div>
        </div>
      </div>

      {/* Corridors Stacked Bars */}
      <div className="mt-5 space-y-4">
        {corridors.map((c) => (
          <div key={c.corridor} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-rail-text">{c.corridor}</span>
              <span className="text-rail-muted">{c.totalHours} hrs possession</span>
            </div>

            {/* Stacked Progress Bar */}
            <div className="h-6 w-full rounded-lg bg-rail-base overflow-hidden flex border border-rail-border text-[10px] font-mono font-bold">
              {/* Productive Segment */}
              <div
                className="h-full bg-rail-emerald flex items-center justify-center text-rail-text px-2 transition-all duration-700"
                style={{ width: `${c.productivePct}%` }}
                title={`Productive Execution: ${c.productivePct}%`}
              >
                {c.productivePct}% Productive
              </div>

              {/* Idle Buffer Segment */}
              <div
                className="h-full bg-[#2E343D] flex items-center justify-center text-rail-muted px-2 transition-all duration-700"
                style={{ width: `${c.idlePct}%` }}
                title={`Buffer / Lost Time: ${c.idlePct}%`}
              >
                {c.idlePct}% Buffer
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend & Baseline Comparison */}
      <div className="mt-5 pt-3.5 border-t border-rail-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-rail-emerald" />
            <span className="text-rail-text">Tool-on-Track Work</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded bg-[#2E343D]" />
            <span className="text-rail-muted">Headway Buffer</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-rail-emerald text-[11px]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>+25.6% vs uncoordinated manual baseline (58.6%)</span>
        </div>
      </div>
    </div>
  );
};
