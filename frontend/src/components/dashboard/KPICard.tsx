import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral' | 'warning';
  icon: LucideIcon;
  accentColor?: 'ai' | 'cyan' | 'emerald' | 'orange' | 'amber' | 'red';
  detailBadge?: string;
  featured?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  id,
  title,
  value,
  subtitle,
  delta,
  deltaType = 'positive',
  icon: Icon,
  accentColor = 'ai',
  detailBadge,
  featured = false,
}) => {
  const deltaColorMap = {
    positive: 'text-rail-emerald bg-rail-emerald/10 border-rail-emerald/20',
    negative: 'text-rail-red bg-rail-red/10 border-rail-red/20',
    warning: 'text-rail-amber bg-rail-amber/10 border-rail-amber/20',
    neutral: 'text-rail-muted bg-rail-subtle border-rail-border',
  };

  const accentTextMap = {
    ai: 'text-rail-ai',
    cyan: 'text-rail-ai',
    emerald: 'text-rail-emerald',
    orange: 'text-rail-orange',
    amber: 'text-rail-amber',
    red: 'text-rail-red',
  };

  if (featured) {
    return (
      <div
        id={id}
        className="rounded-2xl border border-rail-borderLight bg-rail-card p-6 flex flex-col justify-between transition-colors"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rail-text">
              {title}
            </span>
            <div className={`h-8 w-8 rounded-lg bg-rail-subtle border border-rail-border flex items-center justify-center ${accentTextMap[accentColor]}`}>
              <Icon className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-rail-text tracking-tight">
              {value}
            </span>
            {detailBadge && (
              <span className="text-xs text-rail-muted">
                {detailBadge}
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-rail-border flex items-center justify-between">
          <span className="text-xs text-rail-muted truncate">
            {subtitle}
          </span>
          {delta && (
            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${deltaColorMap[deltaType]}`}>
              {delta}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Supporting, flatter, quieter card
  return (
    <div
      id={id}
      className="rounded-xl border border-rail-border bg-rail-card p-4 flex flex-col justify-between transition-colors hover:border-rail-borderLight"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-rail-muted">
            {title}
          </span>
          <Icon className={`h-4 w-4 ${accentTextMap[accentColor] || 'text-rail-muted'}`} />
        </div>

        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-rail-text tracking-tight">
            {value}
          </span>
          {detailBadge && (
            <span className="text-xs text-rail-muted">
              {detailBadge}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-rail-border flex items-center justify-between">
        <span className="text-xs text-rail-muted truncate max-w-[130px]">
          {subtitle}
        </span>
        {delta && (
          <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${deltaColorMap[deltaType]}`}>
            {delta}
          </span>
        )}
      </div>
    </div>
  );
};

