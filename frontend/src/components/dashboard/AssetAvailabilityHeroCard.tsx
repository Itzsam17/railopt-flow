import React from 'react';
import { ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';
import { KPIMetric } from '../../types/api';

interface AssetAvailabilityHeroCardProps {
  metric: KPIMetric;
}

export const AssetAvailabilityHeroCard: React.FC<AssetAvailabilityHeroCardProps> = ({ metric }) => {
  const currentValue = metric.value;
  const targetValue = metric.target ?? 96.2;
  const deltaValue = metric.delta ?? 2.4;

  return (
    <div className="relative rounded-2xl border border-rail-borderLight bg-rail-raised p-6 col-span-1 lg:col-span-2 flex flex-col justify-between">
      <div>
        {/* Card Header Tag */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-rail-card border border-rail-border flex items-center justify-center text-rail-ai">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-rail-ai flex items-center gap-1.5">
                Primary Operational Metric
              </span>
              <h3 className="text-base font-bold text-rail-text tracking-tight">
                Network Asset Availability
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rail-emerald/10 border border-rail-emerald/20 text-rail-emerald text-xs font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>+{deltaValue}% predicted</span>
          </div>
        </div>

        {/* Big Metric Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Main Number */}
          <div className="md:col-span-7">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl lg:text-6xl font-extrabold text-rail-text tracking-tight">
                {metric.display}
              </span>
              <span className="text-sm font-medium text-rail-muted">
                Current Operational Index
              </span>
            </div>

            {/* Target Progress Bar */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-rail-muted">
                <span>Baseline: 92.3%</span>
                <span className="text-rail-text font-medium">Target: {targetValue}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-rail-card border border-rail-border overflow-hidden relative">
                <div
                  className="h-full rounded-full bg-rail-emerald transition-all duration-700"
                  style={{ width: `${Math.min(currentValue, 100)}%` }}
                />
                {/* Target Marker Pin */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-rail-text"
                  style={{ left: `${targetValue}%` }}
                  title={`Target: ${targetValue}%`}
                />
              </div>
            </div>
          </div>

          {/* AI Uplift Highlight Box */}
          <div className="md:col-span-5 rounded-xl border border-rail-border bg-rail-card p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-rail-ai">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Bundling Impact</span>
            </div>
            <p className="text-xs text-rail-muted mt-2 leading-relaxed">
              Consolidating Engineering, S&T, and Electrical windows recovers 
              <strong className="text-rail-text font-semibold"> +2.4% uptime </strong> 
              and saves over 2.5 hours per maintenance cycle.
            </p>
            <div className="mt-3 pt-2.5 border-t border-rail-border flex items-center justify-between text-xs text-rail-muted">
              <span>Throughput Delta:</span>
              <span className="text-rail-emerald font-medium">+18% work density</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Metrics Footer Strip */}
      <div className="mt-6 pt-4 border-t border-rail-border grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <span className="text-rail-muted block">Corridor Uptime</span>
          <span className="text-sm font-semibold text-rail-text mt-0.5 block">99.1% High Priority</span>
        </div>
        <div className="border-x border-rail-border">
          <span className="text-rail-muted block">Unplanned Disruption</span>
          <span className="text-sm font-semibold text-rail-emerald mt-0.5 block">−41% Reduced</span>
        </div>
        <div>
          <span className="text-rail-muted block">Window Cap</span>
          <span className="text-sm font-semibold text-rail-text mt-0.5 block">3.5 hrs / Block</span>
        </div>
      </div>
    </div>
  );
};

