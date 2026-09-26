import React from 'react';
import { Wrench, Radio, Zap, CheckCircle2 } from 'lucide-react';

interface DeptCompletion {
  dept: string;
  icon: React.ReactNode;
  planned: number;
  completed: number;
  rate: number;
  accentColor: string;
  badgeBg: string;
}

export const MaintenanceCompletionChart: React.FC = () => {
  const departments: DeptCompletion[] = [
    {
      dept: 'Engineering (Track & Bridges)',
      icon: <Wrench className="h-4 w-4 text-rail-emerald" />,
      planned: 24,
      completed: 22,
      rate: 91.6,
      accentColor: 'bg-rail-emerald',
      badgeBg: 'bg-rail-emerald/15 text-rail-emerald border-rail-emerald/30',
    },
    {
      dept: 'S&T (Signals & Telecom)',
      icon: <Radio className="h-4 w-4 text-rail-amber" />,
      planned: 18,
      completed: 17,
      rate: 94.4,
      accentColor: 'bg-rail-amber',
      badgeBg: 'bg-rail-amber/15 text-rail-amber border-rail-amber/30',
    },
    {
      dept: 'Electrical (Traction & OHE)',
      icon: <Zap className="h-4 w-4 text-rail-ai" />,
      planned: 16,
      completed: 15,
      rate: 93.8,
      accentColor: 'bg-rail-ai',
      badgeBg: 'bg-rail-ai/15 text-rail-ai border-rail-ai/30',
    },
  ];

  return (
    <div className="rounded-2xl border border-rail-border bg-rail-card p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-rail-amber flex items-center gap-1.5">
            Work Order Throughput
          </span>
          <h3 className="text-base font-bold text-rail-text tracking-tight mt-0.5">
            Maintenance Completion Rate
          </h3>
          <p className="text-xs text-rail-muted">
            Planned vs completed cross-department maintenance quotas this planning cycle
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-xs font-mono text-rail-muted block">Overall Success</span>
            <span className="text-lg font-black text-rail-text font-sans">93.1%</span>
          </div>
        </div>
      </div>

      {/* Department Breakdown Cards */}
      <div className="mt-5 space-y-4">
        {departments.map((d) => (
          <div key={d.dept} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                {d.icon}
                <span className="font-semibold text-rail-text">{d.dept}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-rail-muted">
                  {d.completed} of {d.planned} Done
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${d.badgeBg}`}>
                  {d.rate}%
                </span>
              </div>
            </div>

            {/* Target Progress Bar */}
            <div className="h-3 w-full rounded-full bg-rail-base overflow-hidden relative border border-rail-border">
              <div
                className={`h-full rounded-full ${d.accentColor} transition-all duration-700`}
                style={{ width: `${d.rate}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-5 pt-3.5 border-t border-rail-border flex items-center justify-between text-xs font-mono text-rail-muted">
        <span>54 / 58 Total Requests Fulfilled</span>
        <span className="text-rail-emerald font-semibold flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Zero Backlog Spillovers</span>
        </span>
      </div>
    </div>
  );
};
