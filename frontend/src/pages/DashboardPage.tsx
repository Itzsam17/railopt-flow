import React, { useEffect, useState } from 'react';
import { 
  RotateCw, 
  CalendarRange, 
  Clock, 
  TrendingDown, 
  Layers, 
  Train, 
  CheckCircle2,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { fetchDashboardKPIs, fetchTracks } from '../services/api';
import { DashboardKPIResponse, CorridorTrack } from '../types/api';
import { AssetAvailabilityHeroCard } from '../components/dashboard/AssetAvailabilityHeroCard';
import { KPICard } from '../components/dashboard/KPICard';
import { NetworkMap } from '../components/dashboard/NetworkMap';
import { AssetTargetWidget } from '../components/common/AssetTargetWidget';

export const DashboardPage: React.FC = () => {
  const [kpis, setKpis] = useState<DashboardKPIResponse | null>(null);
  const [tracks, setTracks] = useState<CorridorTrack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const [kpisData, tracksData] = await Promise.all([
        fetchDashboardKPIs(),
        fetchTracks(),
      ]);
      setKpis(kpisData);
      setTracks(tracksData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading || !kpis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[480px] space-y-4">
        <div className="h-10 w-10 rounded-full border-2 border-rail-ai border-t-transparent animate-spin" />
        <span className="text-sm text-rail-muted">
          Loading network telemetry and optimization metrics...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Quick Status Ribbon & Refresh Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-rail-border/60">
        <div className="flex items-center gap-2 text-xs text-rail-muted">
          <span className="inline-block h-2 w-2 rounded-full bg-rail-emerald" />
          <span>Live Corridor Feed Active</span>
          <span className="text-rail-borderLight">|</span>
          <span>Last synchronized: <strong className="text-slate-300 font-medium font-mono">{kpis.last_updated}</strong></span>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rail-card border border-rail-border text-xs text-rail-muted hover:text-rail-text transition-colors cursor-pointer disabled:opacity-50"
          title="Refresh telemetry"
        >
          <RotateCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-rail-ai' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Operational Quick-Counter Ribbon (Flatter, Quieter) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-rail-card border border-rail-border flex items-center gap-3">
          <Layers className="h-4 w-4 text-rail-ai shrink-0" />
          <div>
            <span className="text-rail-muted text-xs block">Network Corridors</span>
            <span className="text-sm font-semibold text-rail-text">{kpis.active_corridors} Active (8 Tracks)</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-rail-card border border-rail-border flex items-center gap-3">
          <Train className="h-4 w-4 text-rail-ai shrink-0" />
          <div>
            <span className="text-rail-muted text-xs block">Trains in Network</span>
            <span className="text-sm font-semibold text-rail-text">{kpis.trains_in_network} Movements</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-rail-card border border-rail-border flex items-center gap-3">
          <Activity className="h-4 w-4 text-rail-amber shrink-0" />
          <div>
            <span className="text-rail-muted text-xs block">Pending Work Orders</span>
            <span className="text-sm font-semibold text-rail-text">{kpis.pending_work_orders} Requests</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-rail-card border border-rail-border flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-rail-muted shrink-0" />
          <div>
            <span className="text-rail-muted text-xs block">Scheduling Conflicts</span>
            <span className="text-sm font-semibold text-rail-text">
              {kpis.open_conflicts_count} Open
              {kpis.critical_alerts_count > 0 ? (
                <span className="text-rail-red ml-1">({kpis.critical_alerts_count} Critical)</span>
              ) : (
                <span className="text-rail-muted ml-1 font-normal">(0 critical)</span>
              )}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-rail-card border border-rail-border flex items-center gap-3 col-span-2 sm:col-span-1">
          <CheckCircle2 className="h-4 w-4 text-rail-emerald shrink-0" />
          <div>
            <span className="text-rail-muted text-xs block">Coordinated Blocks</span>
            <span className="text-sm font-semibold text-rail-emerald">{kpis.active_blocks_count} Track Possessions</span>
          </div>
        </div>
      </div>


      {/* KPI Section with Visual Hierarchy: Asset Availability Dominates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5 items-stretch">
        {/* Dominant Hero KPI Card (Takes 3 columns on large screens) */}
        <div className="lg:col-span-3">
          <AssetAvailabilityHeroCard metric={kpis.asset_availability} />
        </div>

        {/* Supporting KPI Column (3 quieter cards + Asset Target widget) */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KPICard
            id="kpi-optimized-blocks"
            title="Optimized Blocks"
            value={kpis.optimized_blocks}
            subtitle="Bundled across 3 departments"
            delta="14 work orders bundled"
            deltaType="positive"
            icon={CalendarRange}
            accentColor="cyan"
            detailBadge="Windows Created"
          />

          <KPICard
            id="kpi-conflict-reduction"
            title="Conflict Reduction"
            value={kpis.conflict_reduction.display}
            subtitle={`${kpis.open_conflicts_count} active conflicts`}
            delta={kpis.conflict_reduction.delta_display}
            deltaType="positive"
            icon={TrendingDown}
            accentColor="emerald"
            detailBadge="AI Resolved"
          />

          <KPICard
            id="kpi-delay-risk"
            title="Delay Risk Reduction"
            value={kpis.delay_risk.display}
            subtitle={`Saved ${kpis.planning_time_saved_hours}h / planning cycle`}
            delta={kpis.delay_risk.delta_display}
            deltaType="positive"
            icon={Clock}
            accentColor="ai"
            detailBadge="Passenger Safeguard"
          />

          {/* Contextual Asset Target Widget */}
          <AssetTargetWidget compact={true} />
        </div>
      </div>

      {/* Network Map Component: Station Nodes, Tracks, Hover Info Panel */}
      <NetworkMap tracks={tracks} />
    </div>
  );
};
