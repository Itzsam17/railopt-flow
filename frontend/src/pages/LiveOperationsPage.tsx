import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Activity, 
  X,
  ChevronRight
} from 'lucide-react';
import { CorridorTrack } from '../types/api';
import { LiveTelemetryEvent, LiveOperationalCounters } from '../types/liveOps';
import { fetchTracks, FALLBACK_TRACKS } from '../services/api';
import { 
  INITIAL_LIVE_COUNTERS, 
  INITIAL_LIVE_EVENTS, 
  generateNextLiveEvent 
} from '../services/liveOpsService';
import { LiveStatusCounters } from '../components/live/LiveStatusCounters';
import { NetworkMap } from '../components/dashboard/NetworkMap';
import { LiveActivityFeed } from '../components/live/LiveActivityFeed';
import { LiveCorridorQuickStats } from '../components/live/LiveCorridorQuickStats';

export const LiveOperationsPage: React.FC = () => {
  const [tracks, setTracks] = useState<CorridorTrack[]>(FALLBACK_TRACKS);
  const [counters, setCounters] = useState<LiveOperationalCounters>(INITIAL_LIVE_COUNTERS);
  const [events, setEvents] = useState<LiveTelemetryEvent[]>(INITIAL_LIVE_EVENTS);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  // Requirement 13: Keep 4 counters + map as primary view; activity feed in collapsible side panel
  const [showFeedPanel, setShowFeedPanel] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    async function loadTracks() {
      try {
        const data = await fetchTracks();
        if (mounted && data && data.length > 0) {
          setTracks(data);
        }
      } catch (err) {
        console.warn('Using fallback tracks for Live Operations:', err);
      }
    }
    loadTracks();
    return () => {
      mounted = false;
    };
  }, []);

  // Real-time client-side telemetry simulation timer (fires every 3.5 seconds)
  useEffect(() => {
    if (!isStreaming) return;

    const timer = setInterval(() => {
      const newEvent = generateNextLiveEvent();
      setEvents((prev) => [newEvent, ...prev.slice(0, 35)]);

      setCounters((prev) => ({
        ...prev,
        onTimePunctualityPercent: Math.min(99.4, Math.max(94.2, Math.round((prev.onTimePunctualityPercent + (Math.random() * 0.4 - 0.2)) * 10) / 10)),
      }));
    }, 3500);

    return () => clearInterval(timer);
  }, [isStreaming]);

  const handleAddManualEvent = () => {
    const manualEvt = generateNextLiveEvent();
    setEvents((prev) => [manualEvt, ...prev.slice(0, 35)]);
  };

  const handleClearEvents = () => {
    setEvents([]);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Toolbar Action Bar (Replaces duplicate hero header and fixes layout overlap) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-rail-border">
        <div className="flex items-center gap-2.5 text-xs text-rail-muted">
          <span className="inline-block h-2 w-2 rounded-full bg-rail-emerald" />
          <span className="text-rail-text font-medium">RTIS telemetry streaming active</span>
          <span className="text-rail-border">|</span>
          <span>Delhi Division command feed</span>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Toggle Collapsible Activity Feed Button */}
          <button
            onClick={() => setShowFeedPanel((prev) => !prev)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              showFeedPanel
                ? 'bg-rail-ai/20 border-rail-ai text-rail-ai'
                : 'bg-rail-card border-rail-border hover:border-rail-border text-rail-muted hover:text-rail-text'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Activity Feed ({events.length})</span>
            {showFeedPanel ? <ChevronRight className="h-3.5 w-3.5" /> : null}
          </button>
        </div>
      </div>

      {/* 4 Status Counters Row (With clear visual hierarchy) */}
      <LiveStatusCounters counters={counters} />

      {/* Main Workspace Layout */}
      <div className="relative">
        <div className={`space-y-6 transition-all duration-300 ${showFeedPanel ? 'lg:mr-[420px]' : ''}`}>
          {/* Primary View: Corridor Network Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-rail-text">
                <Radio className="h-4 w-4 text-rail-ai" />
                <span>Live Corridor Network Topography</span>
              </div>
              <span className="text-xs text-rail-muted">
                Hover stations and tracks for telemetry
              </span>
            </div>

            <NetworkMap tracks={tracks} />
          </div>

          {/* Infrastructure Quick Telemetry Bar */}
          <LiveCorridorQuickStats />
        </div>

        {/* Collapsible Activity Feed Side Panel */}
        {showFeedPanel && (
          <div className="fixed top-16 right-0 bottom-0 z-40 w-full sm:w-[420px] bg-rail-card border-l border-rail-border p-4 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-rail-border">
              <div className="flex items-center gap-2 text-xs font-semibold text-rail-text">
                <Activity className="h-4 w-4 text-rail-ai" />
                <span>Live Telemetry Activity Feed</span>
              </div>
              <button
                onClick={() => setShowFeedPanel(false)}
                className="p-1 rounded-lg text-rail-muted hover:text-rail-text hover:bg-rail-raised transition-colors cursor-pointer"
                title="Close feed panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <LiveActivityFeed
              events={events}
              isStreaming={isStreaming}
              onToggleStreaming={() => setIsStreaming((prev) => !prev)}
              onAddManualEvent={handleAddManualEvent}
              onClearEvents={handleClearEvents}
            />
          </div>
        )}
      </div>
    </div>
  );
};
