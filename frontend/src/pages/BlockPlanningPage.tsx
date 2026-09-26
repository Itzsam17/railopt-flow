import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  X,
  Zap
} from 'lucide-react';
import { MaintenanceBacklogPanel } from '../components/planning/MaintenanceBacklogPanel';
import { GanttTimeline } from '../components/planning/GanttTimeline';
import { AIRecommendationsPanel } from '../components/planning/AIRecommendationsPanel';
import { OptimizationModal } from '../components/planning/OptimizationModal';
import { fetchMaintenanceRequests } from '../services/api';
import { 
  MaintenanceRequestItem, 
  TimelineBlock, 
  AIRecommendation, 
  OptimizationResult 
} from '../types/api';

export const BlockPlanningPage: React.FC = () => {
  const [requests, setRequests] = useState<MaintenanceRequestItem[]>([]);
  const [blocks, setBlocks] = useState<TimelineBlock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [appliedRecIds, setAppliedRecIds] = useState<Set<string>>(new Set());
  const [optimizationBanner, setOptimizationBanner] = useState<OptimizationResult | null>(null);

  // Initial baseline blocks
  const initialBlocks: TimelineBlock[] = [
    {
      id: 'block-init-1',
      track_name: 'T-102',
      start_hour: 1.5,
      duration_hours: 4.0,
      source: 'ai',
      status: 'active',
      linked_work_orders: ['WO-ENG-2026-082', 'WO-SNT-2026-042', 'WO-ELE-2026-012'],
      departments: ['Engineering', 'S&T', 'Electrical'],
      activities: ['Ballast Cleaning (BCM)', 'Insulated Joint Renewal', 'Neutral Insulator'],
      efficiency_score: 98.0,
    },
    {
      id: 'block-init-2',
      track_name: 'T-301',
      start_hour: 9.0,
      duration_hours: 3.0,
      source: 'manual',
      status: 'scheduled',
      linked_work_orders: ['WO-ENG-2026-087', 'WO-ELE-2026-016'],
      departments: ['Engineering', 'Electrical'],
      activities: ['Mobile Flash Butt Rail Welding', 'Earthing Overhaul'],
      efficiency_score: 89.0,
    },
  ];

  useEffect(() => {
    const initData = async () => {
      try {
        const reqData = await fetchMaintenanceRequests();
        setRequests(reqData);
        setBlocks(initialBlocks);
      } catch (err) {
        console.error('Failed to load initial planning data:', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // Compute set of currently scheduled work order numbers
  const scheduledWorkOrderNos = new Set<string>();
  blocks.forEach((b) => {
    b.linked_work_orders.forEach((wo) => scheduledWorkOrderNos.add(wo));
  });

  // Handle dropping a card onto the timeline row
  const handleDropRequest = (req: MaintenanceRequestItem, targetRow: string, startHour: number) => {
    const existingIndex = blocks.findIndex(
      (b) =>
        b.track_name === targetRow &&
        Math.abs(b.start_hour - startHour) < 2.0
    );

    if (existingIndex >= 0) {
      const updated = [...blocks];
      const target = { ...updated[existingIndex] };
      if (!target.linked_work_orders.includes(req.work_order_no)) {
        target.linked_work_orders = [...target.linked_work_orders, req.work_order_no];
      }
      if (!target.departments.includes(req.department)) {
        target.departments = [...target.departments, req.department];
      }
      if (!target.activities.includes(req.activity_type)) {
        target.activities = [...target.activities, req.activity_type];
      }
      if (target.departments.length > 1) {
        target.source = 'ai';
        target.efficiency_score = 96.0;
      }
      updated[existingIndex] = target;
      setBlocks(updated);
    } else {
      const newBlock: TimelineBlock = {
        id: `block-${Date.now()}`,
        track_name: targetRow,
        start_hour: Math.max(0, Math.min(20, startHour)),
        duration_hours: req.duration_hours,
        source: 'manual',
        status: 'scheduled',
        linked_work_orders: [req.work_order_no],
        departments: [req.department],
        activities: [req.activity_type],
        efficiency_score: 85.0,
      };
      setBlocks([...blocks, newBlock]);
    }
  };

  const handleScheduleQuick = (req: MaintenanceRequestItem) => {
    handleDropRequest(req, req.track_name, 6.0);
  };

  const handleRemoveBlock = (blockId: string | number) => {
    setBlocks(blocks.filter((b) => String(b.id) !== String(blockId)));
  };

  const handleUpdateDuration = (blockId: string | number, deltaHours: number) => {
    setBlocks(
      blocks.map((b) => (String(b.id) === String(blockId) ? { ...b, duration_hours: Math.max(1, b.duration_hours + deltaHours) } : b))
    );
  };

  const handleApplyRecommendation = (rec: AIRecommendation) => {
    const newBlock: TimelineBlock = {
      id: `ai-bundle-${rec.id}`,
      track_name: rec.track_name,
      start_hour: rec.suggested_start_hour,
      duration_hours: rec.duration_hours,
      source: 'ai',
      status: 'scheduled',
      linked_work_orders: rec.work_orders,
      departments: rec.departments,
      activities: [rec.description],
      efficiency_score: 97.0,
    };
    setBlocks((prev) => [...prev.filter((b) => b.track_name !== rec.track_name), newBlock]);
    setAppliedRecIds((prev) => new Set([...prev, rec.id]));
  };

  const handleApplyOptimizedPlan = (result: OptimizationResult) => {
    setBlocks(result.optimized_blocks);
    setOptimizationBanner(result);
    setAppliedRecIds(new Set(['rec-1', 'rec-2', 'rec-3']));
  };

  const handleResetTimeline = () => {
    setBlocks(initialBlocks);
    setAppliedRecIds(new Set());
    setOptimizationBanner(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[480px] space-y-4">
        <div className="h-10 w-10 rounded-full border-2 border-rail-ai border-t-transparent animate-spin" />
        <span className="text-sm text-rail-muted">
          Loading multi-department backlog and Gantt timeline...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top Toolbar Action Bar (Replaces duplicate hero header and PRD badges) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-rail-border/60">
        <div className="flex items-center gap-2.5 text-xs text-rail-muted">
          <span className="inline-block h-2 w-2 rounded-full bg-rail-ai" />
          <span className="text-slate-200 font-medium">
            {blocks.length} scheduled windows
          </span>
          <span className="text-rail-borderLight">|</span>
          <span>{scheduledWorkOrderNos.size} of {requests.length} requests bundled</span>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            id="btn-open-optimization-modal"
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-rail-ai hover:bg-[#4D6F94] border border-rail-borderLight text-rail-text text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Zap className="h-3.5 w-3.5 text-rail-text" />
            <span>Generate Optimized Plan</span>
          </button>
        </div>
      </div>

      {/* AI Optimization Result Success Banner */}
      {optimizationBanner && (
        <div className="p-4 rounded-xl border border-rail-ai/30 bg-rail-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-200 text-xs">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-rail-ai/15 border border-rail-ai/30 flex items-center justify-center text-rail-ai shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-rail-ai block">
                AI Coordination Complete (Run #{optimizationBanner.run_id})
              </span>
              <p className="text-xs text-rail-muted mt-0.5">
                {optimizationBanner.summary_message}
              </p>
            </div>
          </div>

          {/* 4 Delta Metrics Display */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="px-2.5 py-1 rounded bg-rail-card border border-rail-border">
              <span className="text-rail-muted block text-[10px]">Availability</span>
              <span className="text-rail-emerald font-semibold">+{optimizationBanner.delta_metrics.availability_delta}%</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-rail-card border border-rail-border">
              <span className="text-rail-muted block text-[10px]">Conflicts</span>
              <span className="text-rail-emerald font-semibold">{optimizationBanner.delta_metrics.conflict_delta}%</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-rail-card border border-rail-border">
              <span className="text-rail-muted block text-[10px]">Delay Risk</span>
              <span className="text-rail-ai font-semibold">{optimizationBanner.delta_metrics.delay_risk_delta}%</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-rail-card border border-rail-border">
              <span className="text-rail-muted block text-[10px]">Throughput</span>
              <span className="text-rail-emerald font-semibold">+{optimizationBanner.delta_metrics.efficiency_delta}%</span>
            </div>
            <button
              onClick={() => setOptimizationBanner(null)}
              className="p-1 rounded text-rail-muted hover:text-rail-text cursor-pointer"
              title="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3-Column Core Planning Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[640px]">
        {/* Column 1: Left Backlog Panel (3 cols on LG) */}
        <div className="lg:col-span-3 xl:col-span-3">
          <MaintenanceBacklogPanel
            requests={requests}
            scheduledWorkOrderNos={scheduledWorkOrderNos}
            onScheduleQuick={handleScheduleQuick}
          />
        </div>

        {/* Column 2: Center Gantt / Timeline (6 cols on LG) */}
        <div className="lg:col-span-6 xl:col-span-6">
          <GanttTimeline
            blocks={blocks}
            onDropRequest={handleDropRequest}
            onRemoveBlock={handleRemoveBlock}
            onUpdateDuration={handleUpdateDuration}
          />
        </div>

        {/* Column 3: Right AI Recommendations Panel (3 cols on LG) */}
        <div className="lg:col-span-3 xl:col-span-3">
          <AIRecommendationsPanel
            onGeneratePlan={() => setIsModalOpen(true)}
            onApplyRecommendation={handleApplyRecommendation}
            onResetTimeline={handleResetTimeline}
            isGenerating={isModalOpen}
            appliedRecIds={appliedRecIds}
          />
        </div>
      </div>

      {/* Full-Screen / Modal AI Optimization Flow */}
      <OptimizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApplyPlan={handleApplyOptimizedPlan}
      />
    </div>
  );
};
