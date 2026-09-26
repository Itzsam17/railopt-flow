import React, { useState } from 'react';
import { 
  Radio, 
  Pause, 
  Play, 
  Train, 
  Activity, 
  AlertTriangle, 
  Sparkles, 
  Gauge, 
  Users, 
  RotateCcw, 
  PlusCircle 
} from 'lucide-react';
import { LiveTelemetryEvent, LiveEventType } from '../../types/liveOps';

interface LiveActivityFeedProps {
  events: LiveTelemetryEvent[];
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onAddManualEvent: () => void;
  onClearEvents: () => void;
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({
  events,
  isStreaming,
  onToggleStreaming,
  onAddManualEvent,
  onClearEvents,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | LiveEventType>('all');

  const filteredEvents = events.filter((evt) => {
    if (selectedFilter === 'all') return true;
    return evt.type === selectedFilter;
  });

  const getEventBadge = (type: LiveEventType) => {
    switch (type) {
      case 'TRAIN_MOVEMENT':
        return {
          icon: Train,
          label: 'TRAIN GPS',
          border: 'border-blue-500/30',
          bg: 'bg-blue-500/10',
          text: 'text-rail-ai',
        };
      case 'BLOCK_EVENT':
        return {
          icon: Activity,
          label: 'BLOCK STATUS',
          border: 'border-amber-500/30',
          bg: 'bg-amber-500/10',
          text: 'text-rail-amber',
        };
      case 'AI_DISPATCH':
        return {
          icon: Sparkles,
          label: 'AI DISPATCH',
          border: 'border-rail-ai/30',
          bg: 'bg-rail-ai/10',
          text: 'text-rail-ai',
        };
      case 'SAFETY_ALERT':
        return {
          icon: AlertTriangle,
          label: 'SAFETY RADAR',
          border: 'border-red-500/30',
          bg: 'bg-red-500/10',
          text: 'text-rail-red',
        };
      case 'SPEED_RESTRICTION':
        return {
          icon: Gauge,
          label: 'SPEED TSR',
          border: 'border-orange-500/30',
          bg: 'bg-orange-500/10',
          text: 'text-rail-orange',
        };
      case 'CREW_TELEMETRY':
        return {
          icon: Users,
          label: 'CREW TELEMETRY',
          border: 'border-emerald-500/30',
          bg: 'bg-emerald-500/10',
          text: 'text-rail-emerald',
        };
      default:
        return {
          icon: Radio,
          label: 'TELEMETRY',
          border: 'border-rail-border',
          bg: 'bg-rail-base',
          text: 'text-rail-muted',
        };
    }
  };

  return (
    <div className="rounded-2xl border border-rail-border bg-rail-card flex flex-col h-full max-h-[820px] overflow-hidden">
      
      {/* Feed Header */}
      <div className="p-4 border-b border-rail-border bg-rail-base space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${isStreaming ? 'bg-rail-emerald' : 'bg-rail-amber'}`} />
            <h3 className="text-sm font-bold text-rail-text tracking-wide uppercase font-mono">
              Live Operations Activity Feed
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-rail-border bg-rail-card text-rail-muted">
              {events.length} events
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Stream Play/Pause Toggle */}
            <button
              onClick={onToggleStreaming}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
                isStreaming
                  ? 'border-rail-emerald/40 text-rail-emerald bg-rail-emerald/10 hover:bg-rail-emerald/20'
                  : 'border-rail-amber/40 text-rail-amber bg-rail-amber/10 hover:bg-rail-amber/20'
              }`}
              title={isStreaming ? 'Pause live event telemetry stream' : 'Resume live event stream'}
            >
              {isStreaming ? (
                <>
                  <Pause className="h-3 w-3" />
                  <span>STREAMING</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 fill-current" />
                  <span>PAUSED</span>
                </>
              )}
            </button>

            {/* Quick Test Event Trigger */}
            <button
              onClick={onAddManualEvent}
              className="p-1.5 rounded-lg border border-rail-border bg-rail-card hover:bg-rail-raised text-rail-muted hover:text-rail-text transition-colors cursor-pointer"
              title="Push simulated event immediately"
            >
              <PlusCircle className="h-3.5 w-3.5" />
            </button>

            {/* Clear Feed */}
            <button
              onClick={onClearEvents}
              className="p-1.5 rounded-lg border border-rail-border bg-rail-card hover:bg-rail-raised text-rail-muted hover:text-rail-text transition-colors cursor-pointer"
              title="Clear event logs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-rail-raised text-rail-text font-bold'
                : 'text-rail-muted hover:text-rail-text hover:bg-rail-raised'
            }`}
          >
            All Logs
          </button>
          <button
            onClick={() => setSelectedFilter('TRAIN_MOVEMENT')}
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
              selectedFilter === 'TRAIN_MOVEMENT'
                ? 'bg-rail-ai/20 text-rail-ai font-bold border border-rail-ai/40'
                : 'text-rail-muted hover:text-rail-text hover:bg-rail-raised'
            }`}
          >
            Trains
          </button>
          <button
            onClick={() => setSelectedFilter('BLOCK_EVENT')}
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
              selectedFilter === 'BLOCK_EVENT'
                ? 'bg-rail-amber/20 text-rail-amber font-bold border border-rail-amber/40'
                : 'text-rail-muted hover:text-rail-text hover:bg-rail-raised'
            }`}
          >
            Blocks
          </button>
          <button
            onClick={() => setSelectedFilter('AI_DISPATCH')}
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
              selectedFilter === 'AI_DISPATCH'
                ? 'bg-rail-ai/20 text-rail-ai font-bold border border-rail-ai/40'
                : 'text-rail-muted hover:text-rail-text hover:bg-rail-raised'
            }`}
          >
            AI Alerts
          </button>
          <button
            onClick={() => setSelectedFilter('SAFETY_ALERT')}
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
              selectedFilter === 'SAFETY_ALERT'
                ? 'bg-rail-red/20 text-rail-red font-bold border border-rail-red/40'
                : 'text-rail-muted hover:text-rail-text hover:bg-rail-raised'
            }`}
          >
            Safety
          </button>
        </div>
      </div>

      {/* Events Stream List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-rail-muted text-xs font-mono">
            No events match the selected filter criteria.
          </div>
        ) : (
          filteredEvents.map((evt, idx) => {
            const badge = getEventBadge(evt.type);
            const Icon = badge.icon;
            const isLatest = idx === 0;

            return (
              <div
                key={evt.id}
                className={`p-3.5 rounded-xl border transition-all duration-300 relative ${
                  isLatest
                    ? 'border-rail-ai bg-rail-card'
                    : 'border-rail-border bg-rail-base hover:bg-rail-card'
                }`}
              >
                {/* Top metadata line */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${badge.border} ${badge.bg} ${badge.text}`}>
                      <Icon className="h-3 w-3" />
                      <span>{badge.label}</span>
                    </span>

                    {evt.trackName && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rail-base text-rail-muted border border-rail-border font-bold">
                        {evt.trackName}
                      </span>
                    )}

                    <span className="text-[11px] text-rail-muted font-mono">
                      · {evt.source}
                    </span>
                  </div>

                  <span className="text-[11px] text-rail-muted font-mono whitespace-nowrap">
                    {evt.timestamp}
                  </span>
                </div>

                {/* Event Message */}
                <p className="text-xs font-medium text-rail-text leading-snug">
                  {evt.message}
                </p>

                {/* Sub details & metric delta */}
                <div className="mt-2 flex items-center justify-between text-[11px] text-rail-muted border-t border-rail-border pt-1.5 font-mono">
                  <span className="truncate pr-2">{evt.detail || 'Nominal telemetry packet'}</span>
                  {evt.metricDelta && (
                    <span className="text-rail-ai font-bold whitespace-nowrap">
                      {evt.metricDelta}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Feed Footer */}
      <div className="px-4 py-2.5 border-t border-rail-border bg-rail-base flex items-center justify-between text-[11px] font-mono text-rail-muted">
        <span>Northern Railway RTIS Feed · 3.5s cycle</span>
        <span className="flex items-center gap-1 text-rail-emerald">
          <span className="h-2 w-2 rounded-full bg-rail-emerald" />
          Subscribed
        </span>
      </div>
    </div>
  );
};
