import React, { useState } from 'react';
import { 
  Download,
  TrendingUp,
  TrendingDown,
  Clock,
  Wrench
} from 'lucide-react';
import { AvailabilityTrendChart } from '../components/analytics/AvailabilityTrendChart';
import { BeforeAfterImpactChart } from '../components/analytics/BeforeAfterImpactChart';
import { BlockUtilizationChart } from '../components/analytics/BlockUtilizationChart';
import { MaintenanceCompletionChart } from '../components/analytics/MaintenanceCompletionChart';
import { DisruptionTrendChart } from '../components/analytics/DisruptionTrendChart';
import { AssetTargetWidget } from '../components/common/AssetTargetWidget';

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'qtd'>('7d');
  // Requirement 12: Default to showing ONE primary chart at a time with a tab/toggle
  const [activePrimaryChart, setActivePrimaryChart] = useState<'availability' | 'beforeAfter'>('availability');

  return (
    <div className="space-y-6">
      {/* Top Toolbar Action Bar (Replaces duplicate hero header and PRD badges) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-rail-border/60">
        <div className="flex items-center gap-2.5 text-xs text-rail-muted">
          <span className="inline-block h-2 w-2 rounded-full bg-rail-ai" />
          <span className="text-slate-200 font-medium">Performance telemetry active</span>
          <span className="text-rail-borderLight">|</span>
          <span>Delhi Division impact metrics</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          {/* Time Horizon Switcher */}
          <div className="flex items-center bg-rail-card p-0.5 rounded-lg border border-rail-border text-xs">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                timeRange === '7d'
                  ? 'bg-rail-subtle text-white font-medium border border-rail-borderLight'
                  : 'text-rail-muted hover:text-white'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                timeRange === '30d'
                  ? 'bg-rail-subtle text-white font-medium border border-rail-borderLight'
                  : 'text-rail-muted hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('qtd')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                timeRange === 'qtd'
                  ? 'bg-rail-subtle text-white font-medium border border-rail-borderLight'
                  : 'text-rail-muted hover:text-white'
              }`}
            >
              Quarter
            </button>
          </div>

          <button
            onClick={() => alert('Exporting RailOpt Flow Analytics Executive Report (PDF / CSV)...')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rail-card border border-rail-border hover:border-rail-borderLight text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-rail-ai" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 Top-line KPIs Strip (with visual hierarchy) & Contextual Asset Target */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
        {/* Dominant Top KPI Card (Primary focal element) */}
        <div className="p-4 rounded-xl border border-rail-borderLight bg-rail-raised flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rail-ai">Predicted Asset Availability</span>
            <TrendingUp className="h-4 w-4 text-rail-emerald" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-rail-text tracking-tight">96.2%</span>
            <span className="text-xs text-rail-emerald font-semibold">+2.4% gain</span>
          </div>
          <span className="text-xs text-rail-muted mt-2 block">Baseline: 94.7%</span>
        </div>

        {/* Supporting KPI 2: Conflict Reduction */}
        <div className="p-4 rounded-xl border border-rail-border bg-rail-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rail-muted">Conflict Reduction</span>
            <TrendingDown className="h-4 w-4 text-rail-emerald" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-rail-text tracking-tight">−73%</span>
            <span className="text-xs text-rail-emerald font-medium">11 eliminated</span>
          </div>
          <span className="text-xs text-rail-muted mt-2 block">Post AI coordination</span>
        </div>

        {/* Supporting KPI 3: Passenger Delay Reclaimed */}
        <div className="p-4 rounded-xl border border-rail-border bg-rail-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rail-muted">Passenger Delay Saved</span>
            <Clock className="h-4 w-4 text-rail-ai" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-rail-text tracking-tight">1,240</span>
            <span className="text-xs text-rail-muted">min / mo</span>
          </div>
          <span className="text-xs text-rail-muted mt-2 block">−41% disruption risk</span>
        </div>

        {/* Supporting KPI 4: Maintenance Density */}
        <div className="p-4 rounded-xl border border-rail-border bg-rail-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rail-muted">Maintenance Density</span>
            <Wrench className="h-4 w-4 text-rail-ai" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-rail-text tracking-tight">+18%</span>
            <span className="text-xs text-rail-muted">throughput</span>
          </div>
          <span className="text-xs text-rail-muted mt-2 block">2.5h saved / cycle</span>
        </div>

        {/* Contextual Asset Target Widget (Item 5) */}
        <AssetTargetWidget compact={true} className="col-span-1 sm:col-span-2 lg:col-span-1" />
      </div>

      {/* Primary Chart Toggle Tabs (Requirement 12: default to showing ONE at a time) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-rail-border/60 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePrimaryChart('availability')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                activePrimaryChart === 'availability'
                  ? 'bg-rail-card border-rail-borderLight text-white font-semibold'
                  : 'border-transparent text-rail-muted hover:text-white'
              }`}
            >
              Availability Trend
            </button>
            <button
              onClick={() => setActivePrimaryChart('beforeAfter')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                activePrimaryChart === 'beforeAfter'
                  ? 'bg-rail-card border-rail-borderLight text-white font-semibold'
                  : 'border-transparent text-rail-muted hover:text-white'
              }`}
            >
              Before / After Impact
            </button>
          </div>

          <span className="text-xs text-rail-muted hidden sm:block">
            {activePrimaryChart === 'availability' ? 'Showing 7-day trajectory' : 'Showing 4-metric comparison'}
          </span>
        </div>

        {/* Single Primary Chart View */}
        <div className="animate-in fade-in duration-200">
          {activePrimaryChart === 'availability' ? (
            <AvailabilityTrendChart />
          ) : (
            <BeforeAfterImpactChart />
          )}
        </div>
      </div>

      {/* Secondary Performance Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
        {/* Block Utilization */}
        <BlockUtilizationChart />

        {/* Maintenance Completion Rate */}
        <MaintenanceCompletionChart />

        {/* Train Disruption Reduction Trend (Spans full width on LG) */}
        <div className="lg:col-span-2">
          <DisruptionTrendChart />
        </div>
      </div>
    </div>
  );
};
