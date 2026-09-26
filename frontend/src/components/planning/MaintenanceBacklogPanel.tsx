import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Clock, 
  GripVertical, 
  CheckCircle2, 
  Wrench, 
  Radio, 
  Zap, 
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MaintenanceRequestItem, DepartmentType, PriorityLevel } from '../../types/api';

interface MaintenanceBacklogPanelProps {
  requests: MaintenanceRequestItem[];
  scheduledWorkOrderNos: Set<string>;
  onScheduleQuick?: (request: MaintenanceRequestItem) => void;
}

export const MaintenanceBacklogPanel: React.FC<MaintenanceBacklogPanelProps> = ({
  requests,
  scheduledWorkOrderNos,
  onScheduleQuick,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  // Requirement 14: Track which cards have expanded details
  const [expandedCardIds, setExpandedCardIds] = useState<Set<number>>(new Set());

  const toggleDetails = (id: number) => {
    setExpandedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const departmentIcons: Record<DepartmentType, React.ReactNode> = {
    Engineering: <Wrench className="h-3.5 w-3.5 text-rail-emerald" />,
    'S&T': <Radio className="h-3.5 w-3.5 text-rail-amber" />,
    Electrical: <Zap className="h-3.5 w-3.5 text-rail-ai" />,
  };

  const priorityStyles: Record<PriorityLevel, { border: string; bg: string; text: string; badge: string }> = {
    critical: {
      border: 'border-l-rail-red',
      bg: 'hover:bg-rail-red/5',
      text: 'text-rail-red',
      badge: 'bg-rail-red/10 text-rail-red border-rail-red/20',
    },
    high: {
      border: 'border-l-rail-orange',
      bg: 'hover:bg-rail-orange/5',
      text: 'text-rail-orange',
      badge: 'bg-rail-orange/10 text-rail-orange border-rail-orange/20',
    },
    medium: {
      border: 'border-l-rail-amber',
      bg: 'hover:bg-rail-amber/5',
      text: 'text-rail-amber',
      badge: 'bg-rail-amber/10 text-rail-amber border-rail-amber/20',
    },
    low: {
      border: 'border-l-rail-ai',
      bg: 'hover:bg-rail-ai/5',
      text: 'text-rail-ai',
      badge: 'bg-rail-ai/10 text-rail-ai border-rail-ai/20',
    },
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    if (selectedDept !== 'all' && r.department !== selectedDept) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        r.work_order_no.toLowerCase().includes(q) ||
        r.activity_type.toLowerCase().includes(q) ||
        r.track_name.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const engCount = requests.filter((r) => r.department === 'Engineering').length;
  const sntCount = requests.filter((r) => r.department === 'S&T').length;
  const eleCount = requests.filter((r) => r.department === 'Electrical').length;

  const handleDragStart = (e: React.DragEvent, req: MaintenanceRequestItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(req));
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-rail-border bg-rail-card overflow-hidden">
      {/* Panel Header */}
      <div className="p-4 border-b border-rail-border bg-rail-subtle/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-rail-ai/15 border border-rail-ai/30 flex items-center justify-center text-rail-ai">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rail-text tracking-wide">
                Maintenance Backlog
              </h3>
              <span className="text-xs text-rail-muted">
                {requests.length} work orders
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] bg-rail-card text-rail-muted border border-rail-border">
            Drag to schedule
          </span>
        </div>

        {/* Search Input */}
        <div className="mt-3 relative">
          <Search className="h-3.5 w-3.5 text-rail-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activity, track, or order..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-rail-subtle border border-rail-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-rail-text placeholder-rail-muted focus:outline-none focus:border-rail-borderLight transition-colors"
          />
        </div>

        {/* Department Filter Tabs */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          <button
            onClick={() => setSelectedDept('all')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer shrink-0 ${
              selectedDept === 'all'
                ? 'bg-rail-card border border-rail-borderLight text-rail-text font-medium'
                : 'text-rail-muted hover:text-rail-text'
            }`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setSelectedDept('Engineering')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer shrink-0 ${
              selectedDept === 'Engineering'
                ? 'bg-rail-emerald/15 border border-rail-emerald/30 text-rail-emerald font-medium'
                : 'text-rail-muted hover:text-rail-text'
            }`}
          >
            Eng ({engCount})
          </button>
          <button
            onClick={() => setSelectedDept('S&T')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer shrink-0 ${
              selectedDept === 'S&T'
                ? 'bg-rail-amber/15 border border-rail-amber/30 text-rail-amber font-medium'
                : 'text-rail-muted hover:text-rail-text'
            }`}
          >
            S&T ({sntCount})
          </button>
          <button
            onClick={() => setSelectedDept('Electrical')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer shrink-0 ${
              selectedDept === 'Electrical'
                ? 'bg-rail-ai/15 border border-rail-ai/30 text-rail-ai font-medium'
                : 'text-rail-muted hover:text-rail-text'
            }`}
          >
            Elec ({eleCount})
          </button>
        </div>
      </div>

      {/* Draggable Cards List (Trimmed by default with Details expand per Requirement 14) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[calc(100vh-280px)] min-h-[400px]">
        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-xs text-rail-muted">
            <AlertCircle className="h-6 w-6 mx-auto mb-2 text-slate-600" />
            No work orders match the selected filters.
          </div>
        ) : (
          filteredRequests.map((req) => {
            const isScheduled = scheduledWorkOrderNos.has(req.work_order_no);
            const priStyle = priorityStyles[req.priority];
            const isExpanded = expandedCardIds.has(req.id);

            return (
              <div
                key={req.id}
                draggable={!isScheduled}
                onDragStart={(e) => handleDragStart(e, req)}
                className={`group relative rounded-xl border border-rail-border border-l-4 ${
                  priStyle.border
                } bg-rail-subtle/70 p-3 transition-colors select-none ${
                  isScheduled
                    ? 'opacity-50 cursor-not-allowed bg-rail-subtle/30'
                    : 'cursor-grab active:cursor-grabbing hover:border-rail-borderLight hover:bg-rail-cardHover'
                }`}
              >
                {/* Decision-relevant facts (What, Where, Priority) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
                    {!isScheduled && (
                      <GripVertical className="h-3.5 w-3.5 text-rail-muted shrink-0" />
                    )}
                    <h4 className="text-xs font-semibold text-rail-text truncate">
                      {req.activity_type}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rail-card text-rail-text border border-rail-border">
                      {req.track_name}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${priStyle.badge}`}
                    >
                      {req.priority}
                    </span>
                  </div>
                </div>

                {/* Expanded metadata behind 'Details' toggle */}
                {isExpanded && (
                  <div className="mt-2.5 pt-2 border-t border-rail-border/80 space-y-1.5 text-xs text-rail-muted animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[11px] font-mono text-rail-muted">
                      <span>Order: <strong className="text-rail-text font-medium">{req.work_order_no}</strong></span>
                      <span>Target: {req.track_name}</span>
                    </div>
                  </div>
                )}

                {/* Footer: Dept, Duration, Details toggle, Schedule status */}
                <div className="mt-2.5 pt-2 border-t border-rail-border/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-rail-muted">
                    {departmentIcons[req.department]}
                    <span>{req.department}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-rail-muted text-[11px]">
                      <Clock className="h-3 w-3" />
                      <span>{req.duration_hours}h</span>
                    </div>

                    <button
                      onClick={() => toggleDetails(req.id)}
                      className="text-rail-muted hover:text-rail-text transition-colors cursor-pointer text-[11px] flex items-center gap-0.5 ml-1"
                    >
                      <span>{isExpanded ? 'Less' : 'Details'}</span>
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>

                    {isScheduled ? (
                      <span className="flex items-center gap-1 text-rail-emerald font-medium text-[11px] ml-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Scheduled</span>
                      </span>
                    ) : (
                      onScheduleQuick && (
                        <button
                          onClick={() => onScheduleQuick(req)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] px-2 py-0.5 rounded bg-rail-ai/20 hover:bg-rail-ai/30 text-rail-ai border border-rail-ai/30 cursor-pointer ml-1"
                          title="Place on timeline"
                        >
                          + Place
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-rail-border bg-rail-subtle/50 text-[11px] text-rail-muted text-center">
        Drag pending work orders onto timeline tracks to synchronize multi-department maintenance windows.
      </div>
    </div>
  );
};
