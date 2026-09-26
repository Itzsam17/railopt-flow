import React, { useState } from 'react';
import { 
  CalendarRange, 
  Sparkles, 
  UserCheck, 
  Trash2, 
  Plus, 
  Minus, 
  Layers, 
  MoveHorizontal
} from 'lucide-react';
import { TimelineBlock, MaintenanceRequestItem } from '../../types/api';

interface GanttTimelineProps {
  blocks: TimelineBlock[];
  onDropRequest: (req: MaintenanceRequestItem, targetRow: string, startHour: number) => void;
  onRemoveBlock: (blockId: string | number) => void;
  onUpdateDuration: (blockId: string | number, deltaHours: number) => void;
  onUpdateStartHour?: (blockId: string | number, newStartHour: number) => void;
}

export const GanttTimeline: React.FC<GanttTimelineProps> = ({
  blocks,
  onDropRequest,
  onRemoveBlock,
  onUpdateDuration,
}) => {
  const [selectedBlock, setSelectedBlock] = useState<TimelineBlock | null>(null);
  const [dragOverRow, setDragOverRow] = useState<string | null>(null);

  // 8 Tracks across 3 Corridors + 3 Department Maintenance Crews
  const trackRows = [
    { id: 'T-101', name: 'T-101', corridor: 'NDLS - AGC (Delhi-Palwal)', type: 'track' },
    { id: 'T-102', name: 'T-102', corridor: 'NDLS - AGC (Palwal-Mathura)', type: 'track' },
    { id: 'T-103', name: 'T-103', corridor: 'NDLS - AGC (Mathura-Agra)', type: 'track' },
    { id: 'T-104', name: 'T-104', corridor: 'NDLS - AGC (Agra High-Speed)', type: 'track' },
    { id: 'T-201', name: 'T-201', corridor: 'DLI - GZB (Main 1)', type: 'track' },
    { id: 'T-202', name: 'T-202', corridor: 'DLI - GZB (Suburban Chord)', type: 'track' },
    { id: 'T-301', name: 'T-301', corridor: 'NDLS - CNB (Express Line)', type: 'track' },
    { id: 'T-302', name: 'T-302', corridor: 'NDLS - CNB (Freight Trunk)', type: 'track' },
  ];

  const crewRows = [
    { id: 'Crew-ENG-01', name: 'Crew-ENG-01', corridor: 'Engineering Mechanized Gang', type: 'crew' },
    { id: 'Crew-SNT-01', name: 'Crew-SNT-01', corridor: 'S&T Signal Interlocking Team', type: 'crew' },
    { id: 'Crew-ELE-01', name: 'Crew-ELE-01', corridor: 'Electrical OHE Tower Wagon Gang', type: 'crew' },
  ];

  const allRows = [...trackRows, ...crewRows];

  // 24 Hour timeline marks (every 2 hours)
  const hourTicks = Array.from({ length: 13 }, (_, i) => i * 2);

  const handleDragOver = (e: React.DragEvent, rowId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverRow(rowId);
  };

  const handleDragLeave = () => {
    setDragOverRow(null);
  };

  const handleDrop = (e: React.DragEvent, rowId: string) => {
    e.preventDefault();
    setDragOverRow(null);
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      const req: MaintenanceRequestItem = JSON.parse(dataStr);

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const dropHour = Math.max(0, Math.min(20, Math.floor((clickX / rect.width) * 24)));

      onDropRequest(req, rowId, dropHour);
    } catch (err) {
      console.error('Error handling timeline drop:', err);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-rail-borderLight bg-rail-raised overflow-hidden relative">
      {/* Timeline Controls & Header */}
      <div className="p-4 border-b border-rail-border bg-rail-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-rail-subtle border border-rail-border flex items-center justify-center text-rail-ai">
            <CalendarRange className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-rail-text tracking-wide">
                Corridor Block Scheduling Timeline
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rail-subtle text-rail-ai border border-rail-border">
                24-Hour Horizon (00:00 - 24:00)
              </span>
            </div>
            <p className="text-xs text-rail-muted">
              Rows = Monitored Tracks & Cross-Dept Work Gangs · Drag work orders from backlog to schedule
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-4 rounded bg-[#1B2028] border border-rail-borderLight" />
            <span className="text-rail-muted">Manual Block</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-4 rounded bg-[#212E3D] border border-rail-ai" />
            <span className="text-rail-ai font-semibold">AI-Optimized Window</span>
          </div>
        </div>
      </div>

      {/* Main Gantt Grid Container */}
      <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] min-h-[460px]">
        <div className="min-w-[780px]">
          {/* Timeline Time Header */}
          <div className="grid grid-cols-12 border-b border-rail-border bg-rail-dark/95 sticky top-0 z-20">
            <div className="col-span-3 p-3 border-r border-rail-border text-xs font-mono uppercase font-semibold text-slate-400">
              Track / Maintenance Crew
            </div>
            <div className="col-span-9 relative flex items-center h-10 px-2 select-none">
              {hourTicks.map((h) => (
                <div
                  key={`hour-${h}`}
                  className="absolute text-[11px] font-mono text-slate-400 -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${(h / 24) * 100}%` }}
                >
                  <span>{h.toString().padStart(2, '0')}:00</span>
                  <div className="h-2 w-px bg-slate-700 mt-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Peak Passenger Caution Highlighting Overlay */}
          <div className="relative">
            {/* Caution Window 1: Morning Rush (08:00 - 10:30) */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none bg-rail-amber/5 border-x border-dashed border-rail-amber/20 z-0"
              style={{ left: `${(3 / 12) * 100 + (8 / 24) * ((9 / 12) * 100)}%`, width: `${(2.5 / 24) * ((9 / 12) * 100)}%` }}
            >
              <span className="absolute top-2 left-1 text-[9px] font-mono text-rail-amber opacity-60 uppercase">
                Peak Traffic
              </span>
            </div>

            {/* Caution Window 2: Evening Rush (17:00 - 20:00) */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none bg-rail-amber/5 border-x border-dashed border-rail-amber/20 z-0"
              style={{ left: `${(3 / 12) * 100 + (17 / 24) * ((9 / 12) * 100)}%`, width: `${(3 / 24) * ((9 / 12) * 100)}%` }}
            >
              <span className="absolute top-2 left-1 text-[9px] font-mono text-rail-amber opacity-60 uppercase">
                Peak Traffic
              </span>
            </div>

            {/* Rows */}
            {allRows.map((row) => {
              const isOver = dragOverRow === row.id;
              const rowBlocks = blocks.filter((b) => b.track_name === row.id);
              const isCrew = row.type === 'crew';

              return (
                <div
                  key={row.id}
                  className={`grid grid-cols-12 border-b border-rail-border/60 transition-colors ${
                    isCrew ? 'bg-rail-subtle' : 'bg-rail-card/40'
                  } ${isOver ? 'bg-rail-ai/10' : ''}`}
                >
                  {/* Left Row Label */}
                  <div className="col-span-3 p-3 border-r border-rail-border flex items-center justify-between z-10 bg-rail-card">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-7 w-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                          isCrew
                            ? 'bg-rail-ai/20 text-rail-ai border border-rail-ai/30'
                            : 'bg-rail-base text-rail-text border border-rail-border'
                        }`}
                      >
                        {isCrew ? <UserCheck className="h-3.5 w-3.5" /> : row.name}
                      </div>
                      <div className="truncate">
                        <span className="text-xs font-bold text-rail-text font-mono block">
                          {row.name}
                        </span>
                        <span className="text-[10px] text-rail-muted truncate block max-w-[130px]">
                          {row.corridor}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Timeline Canvas (Interactive Drop Zone) */}
                  <div
                    className="col-span-9 relative h-14 p-1 flex items-center select-none"
                    onDragOver={(e) => handleDragOver(e, row.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, row.id)}
                  >
                    {/* Hour Vertical Grid Lines */}
                    {hourTicks.map((h) => (
                      <div
                        key={`line-${h}`}
                        className="absolute top-0 bottom-0 w-px bg-slate-800/40 pointer-events-none"
                        style={{ left: `${(h / 24) * 100}%` }}
                      />
                    ))}

                    {/* Drop Indicator placeholder when dragging over */}
                    {isOver && (
                      <div className="absolute inset-y-1.5 inset-x-2 border-2 border-dashed border-rail-ai rounded-lg bg-rail-ai/10 flex items-center justify-center pointer-events-none z-10">
                        <span className="text-[11px] font-mono text-rail-ai font-bold flex items-center gap-1">
                          <Plus className="h-3.5 w-3.5" /> Drop to schedule block window on {row.id}
                        </span>
                      </div>
                    )}

                    {/* Render Scheduled Blocks on this row */}
                    {rowBlocks.map((block) => {
                      const isAi = block.source === 'ai';
                      const leftPercent = (block.start_hour / 24) * 100;
                      const widthPercent = Math.max((block.duration_hours / 24) * 100, 5);
                      const isSelected = selectedBlock?.id === block.id;

                      const startFormatted = `${Math.floor(block.start_hour)
                        .toString()
                        .padStart(2, '0')}:${Math.round((block.start_hour % 1) * 60)
                        .toString()
                        .padStart(2, '0')}`;
                      const endHour = block.start_hour + block.duration_hours;
                      const endFormatted = `${Math.floor(endHour)
                        .toString()
                        .padStart(2, '0')}:${Math.round((endHour % 1) * 60)
                        .toString()
                        .padStart(2, '0')}`;

                      return (
                        <div
                          key={block.id}
                          onClick={() => setSelectedBlock(block)}
                          className={`absolute top-1.5 bottom-1.5 rounded-lg px-2.5 py-1 transition-all duration-200 cursor-pointer flex items-center justify-between group z-10 ${
                            isAi
                              ? 'bg-[#1E293B] border border-rail-ai text-rail-text'
                              : 'bg-[#1B2028] border border-rail-borderLight text-rail-text hover:border-slate-500'
                          } ${isSelected ? 'ring-2 ring-rail-text ring-offset-1 ring-offset-rail-dark' : ''}`}
                          style={{
                            left: `${leftPercent}%`,
                            width: `${widthPercent}%`,
                          }}
                          title={`${block.track_name}: ${startFormatted} - ${endFormatted} (${block.duration_hours}h) · ${block.linked_work_orders.length} bundled`}
                        >
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            {isAi ? (
                              <Sparkles className="h-3.5 w-3.5 text-rail-ai shrink-0" />
                            ) : (
                              <MoveHorizontal className="h-3.5 w-3.5 text-rail-muted shrink-0" />
                            )}
                            <div className="truncate">
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-mono font-bold tracking-tight text-rail-text truncate">
                                  {isAi ? '⚡ AI-Block' : 'Manual'}
                                </span>
                                <span className="text-[9px] font-mono opacity-80">
                                  ({startFormatted}–{endFormatted})
                                </span>
                              </div>
                              <span className="text-[9px] text-slate-300 font-mono block truncate">
                                {block.linked_work_orders.length > 1
                                  ? `${block.linked_work_orders.length} WOs Bundled (${block.departments.join(', ')})`
                                  : block.linked_work_orders[0] || '1 Work Order'}
                              </span>
                            </div>
                          </div>

                          {/* Quick Duration & Delete Actions on Hover */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 ml-1 bg-rail-dark/80 rounded px-1 border border-slate-700">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateDuration(block.id, -0.5);
                              }}
                              className="p-0.5 text-slate-400 hover:text-white"
                              title="Decrease 30 mins"
                            >
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateDuration(block.id, 0.5);
                              }}
                              className="p-0.5 text-slate-400 hover:text-white"
                              title="Extend 30 mins"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveBlock(block.id);
                              }}
                              className="p-0.5 text-rail-red hover:text-red-400"
                              title="Remove block possession"
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Block Detailed Inspection Modal / Bottom Drawer */}
      {selectedBlock && (
        <div className="p-4 border-t border-rail-border bg-rail-card flex flex-wrap items-center justify-between gap-4 z-20">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                selectedBlock.source === 'ai'
                  ? 'bg-rail-ai/20 border border-rail-ai text-rail-ai'
                  : 'bg-rail-subtle border border-rail-border text-rail-text'
              }`}
            >
              {selectedBlock.source === 'ai' ? <Sparkles className="h-5 w-5" /> : <Layers className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-rail-text font-mono">
                  {selectedBlock.track_name} — {selectedBlock.source === 'ai' ? 'AI Coordinated Block Window' : 'Manual Possession'}
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedBlock.duration_hours} Hours Window
                </span>
                {selectedBlock.efficiency_score && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rail-emerald/15 text-rail-emerald border border-rail-emerald/30 font-bold">
                    {selectedBlock.efficiency_score}% Efficiency Score
                  </span>
                )}
              </div>
              <p className="text-xs text-rail-muted mt-0.5">
                Bundled Work Orders: <strong className="text-rail-ai">{selectedBlock.linked_work_orders.join(', ')}</strong> · Departments: {selectedBlock.departments.join(' + ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateDuration(selectedBlock.id, 0.5)}
              className="px-3 py-1.5 rounded-lg bg-rail-base border border-rail-border hover:border-rail-ai text-xs font-mono text-rail-text transition-colors"
            >
              +30m Extend
            </button>
            <button
              onClick={() => {
                onRemoveBlock(selectedBlock.id);
                setSelectedBlock(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-rail-red/20 border border-rail-red/40 text-rail-red hover:bg-rail-red/30 text-xs font-mono transition-colors flex items-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Unschedule</span>
            </button>
            <button
              onClick={() => setSelectedBlock(null)}
              className="px-3 py-1.5 rounded-lg bg-rail-base text-rail-muted hover:text-rail-text border border-rail-border text-xs font-mono"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
