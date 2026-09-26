import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  RotateCw, 
  Train, 
  MapPin, 
  ArrowRight,
  Compass
} from 'lucide-react';
import { ConflictItem, ConflictSeverity } from '../../types/api';

interface ConflictCardProps {
  conflict: ConflictItem;
  onResolve: (id: number) => Promise<void>;
}

export const ConflictCard: React.FC<ConflictCardProps> = ({ conflict, onResolve }) => {
  const navigate = useNavigate();
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);

  const isResolved = conflict.status === 'resolved';

  const severityConfigs: Record<ConflictSeverity, { border: string; bg: string; badge: string; text: string; label: string }> = {
    critical: {
      border: 'border-l-rail-red',
      bg: 'bg-rail-card/90',
      badge: 'bg-rail-red/20 text-rail-red border-rail-red/40',
      text: 'text-rail-red',
      label: 'CRITICAL CONFLICT',
    },
    high: {
      border: 'border-l-rail-orange',
      bg: 'bg-rail-card/90',
      badge: 'bg-rail-orange/20 text-rail-orange border-rail-orange/40',
      text: 'text-rail-orange',
      label: 'HIGH SEVERITY',
    },
    medium: {
      border: 'border-l-rail-amber',
      bg: 'bg-rail-card/90',
      badge: 'bg-rail-amber/20 text-rail-amber border-rail-amber/40',
      text: 'text-rail-amber',
      label: 'MEDIUM SEVERITY',
    },
  };

  const currentCfg = severityConfigs[conflict.severity];

  const handleResolveClick = async () => {
    setIsResolving(true);
    try {
      await onResolve(conflict.id);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border border-rail-border border-l-4 ${
        isResolved ? 'border-l-rail-emerald' : currentCfg.border
      } ${
        isResolved ? 'bg-rail-card' : currentCfg.bg
      } p-5 transition-all duration-300 relative overflow-hidden`}
    >

      {/* Header: Track, Status, Severity, Time Window */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
              isResolved
                ? 'bg-rail-emerald/20 text-rail-emerald border border-rail-emerald/40'
                : 'bg-rail-dark text-rail-text border border-rail-border'
            }`}
          >
            {conflict.track_name}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-rail-text font-mono">
                {conflict.track_name} Corridor Possession Collision
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                  isResolved
                    ? 'bg-rail-emerald/15 text-rail-emerald border-rail-emerald/30'
                    : currentCfg.badge
                }`}
              >
                {isResolved ? 'RESOLVED' : currentCfg.label}
              </span>
            </div>
            <p className="text-xs text-rail-muted flex items-center gap-1.5 mt-0.5">
              <MapPin className="h-3 w-3 text-rail-muted" />
              <span>Northern Railway · Delhi Division</span>
            </p>
          </div>
        </div>

        {/* Time Window Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rail-dark border border-rail-border text-xs font-mono text-rail-muted">
          <Clock className="h-3.5 w-3.5 text-rail-ai" />
          <span>{conflict.time_window || 'Operational Window'}</span>
        </div>
      </div>

      {/* Conflict Description */}
      <div className="mt-4">
        <p className="text-xs text-slate-200 leading-relaxed font-sans">
          {conflict.description}
        </p>
      </div>

      {/* Affected Trains Chips */}
      {conflict.affected_trains && conflict.affected_trains.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono text-rail-muted uppercase">
            Impacted Services:
          </span>
          {conflict.affected_trains.map((train, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono"
            >
              <Train className="h-3 w-3 text-rail-ai" />
              <span>{train}</span>
            </span>
          ))}
        </div>
      )}

      {/* AI Recommendation Box */}
      <div className="mt-4 rounded-xl border border-rail-borderLight bg-rail-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-rail-ai font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Automated Mitigation Strategy</span>
          </div>
          <span className="text-[10px] font-mono text-rail-emerald font-semibold">
            0 Train Delay Predicted
          </span>
        </div>
        <p className="text-xs text-rail-muted mt-2 leading-relaxed">
          {conflict.ai_recommendation}
        </p>
      </div>

      {/* Collapsible Review Details Drawer */}
      {isReviewOpen && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-200 text-xs">
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
            DETAILED TECHNICAL IMPACT & BYPASS ROUTING ANALYSIS
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
            <div className="p-3 rounded-lg bg-rail-dark border border-rail-border">
              <span className="text-[10px] font-mono text-rail-ai uppercase block font-semibold">
                Alternative Routing Feasibility
              </span>
              <p className="text-[11px] text-slate-300 mt-1 leading-normal">
                Loop line T-103 Up Main has 92m clearance and nominal signal interlocking. Re-routing preserves punctuality with ±0 min timetable deviation.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-rail-dark border border-rail-border">
              <span className="text-[10px] font-mono text-rail-emerald uppercase block font-semibold">
                Maintenance Crew Safety Clearance
              </span>
              <p className="text-[11px] text-slate-300 mt-1 leading-normal">
                Electrical isolation power block (OHE 25kV) synchronized with mechanized gang possession without duplicate traction shutoff.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-[11px] font-mono text-rail-ai hover:underline flex items-center gap-1"
            >
              <Compass className="h-3 w-3" />
              <span>Inspect {conflict.track_name} on Network Map</span>
            </button>
            <span className="text-slate-600">·</span>
            <button
              onClick={() => navigate('/block-planning')}
              className="text-[11px] font-mono text-rail-ai hover:underline flex items-center gap-1"
            >
              <span>View in Block Planning Workspace</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setIsReviewOpen(!isReviewOpen)}
          className="text-xs font-mono text-rail-muted hover:text-rail-text flex items-center gap-1 transition-colors"
        >
          <span>{isReviewOpen ? 'Hide Investigation' : 'Review Details'}</span>
          {isReviewOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        <div className="flex items-center gap-2">
          {isResolved ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rail-emerald/15 border border-rail-emerald/30 text-rail-emerald text-xs font-mono font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Conflict Mitigated</span>
            </div>
          ) : (
            <button
              id={`btn-resolve-conflict-${conflict.id}`}
              onClick={handleResolveClick}
              disabled={isResolving}
              className="px-4 py-2 rounded-xl bg-rail-ai hover:bg-[#4D6F94] border border-rail-borderLight text-rail-text text-xs font-semibold font-mono transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
            >
              {isResolving ? (
                <RotateCw className="h-3.5 w-3.5 animate-spin text-rail-text" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-rail-text" />
              )}
              <span>{isResolving ? 'Resolving Conflict...' : 'Resolve Automatically'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
