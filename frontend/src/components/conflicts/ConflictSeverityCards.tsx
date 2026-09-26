import React from 'react';
import { 
  AlertCircle, 
  Flame, 
  AlertTriangle, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { ConflictItem } from '../../types/api';

interface ConflictSeverityCardsProps {
  conflicts: ConflictItem[];
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const ConflictSeverityCards: React.FC<ConflictSeverityCardsProps> = ({
  conflicts,
  selectedFilter,
  onSelectFilter,
}) => {
  const total = conflicts.length;
  const critical = conflicts.filter((c) => c.severity === 'critical' && c.status === 'open').length;
  const high = conflicts.filter((c) => c.severity === 'high' && c.status === 'open').length;
  const medium = conflicts.filter((c) => c.severity === 'medium' && c.status === 'open').length;
  const resolved = conflicts.filter((c) => c.status === 'resolved').length;
  const activeCount = critical + high + medium;

  // When zero active severities exist (all critical, high, medium are 0)
  // Collapse into a single compact "0 active — X resolved" summary line per prompt
  if (activeCount === 0) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-rail-border bg-rail-card">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-rail-emerald/10 border border-rail-emerald/20 flex items-center justify-center text-rail-emerald shrink-0">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-white">0 active</span>
            <span className="text-rail-muted">—</span>
            <span className="text-rail-muted">{resolved} resolved across all corridors</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onSelectFilter('all')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer border ${
              selectedFilter === 'all'
                ? 'bg-rail-subtle border-rail-borderLight text-white font-medium'
                : 'border-transparent text-rail-muted hover:text-white'
            }`}
          >
            All ({total})
          </button>
          <button
            onClick={() => onSelectFilter('resolved')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer border ${
              selectedFilter === 'resolved'
                ? 'bg-rail-emerald/10 border-rail-emerald/30 text-rail-emerald font-medium'
                : 'border-transparent text-rail-muted hover:text-white'
            }`}
          >
            Resolved ({resolved})
          </button>
        </div>
      </div>
    );
  }

  // When active severities exist: show cards with clear hierarchy and neutral styling for zero-value tiles
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
      {/* 1. Total Monitored */}
      <button
        onClick={() => onSelectFilter('all')}
        className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
          selectedFilter === 'all'
            ? 'border-rail-borderLight bg-rail-cardHover'
            : 'border-rail-border bg-rail-card hover:bg-rail-cardHover'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-rail-muted">
            Total monitored
          </span>
          <AlertCircle className="h-4 w-4 text-rail-muted" />
        </div>
        <div className="text-2xl font-bold text-rail-text tracking-tight mt-2">
          {total}
        </div>
        <span className="text-xs text-rail-muted mt-1 block">
          All system clashes
        </span>
      </button>

      {/* 2. Critical Conflicts (Neutral when 0, Alert Red only when > 0, Primary focal element) */}
      <button
        onClick={() => onSelectFilter('critical')}
        className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
          selectedFilter === 'critical'
            ? critical > 0
              ? 'border-rail-red/60 bg-rail-raised'
              : 'border-rail-borderLight bg-rail-cardHover'
            : critical > 0
            ? 'border-rail-red/40 bg-rail-raised hover:border-rail-red/60'
            : 'border-rail-border bg-rail-card hover:bg-rail-cardHover'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${critical > 0 ? 'text-rail-red font-semibold' : 'text-rail-muted'}`}>
            Critical severity
          </span>
          <Flame className={`h-4 w-4 ${critical > 0 ? 'text-rail-red' : 'text-rail-muted'}`} />
        </div>
        <div className={`text-2xl font-bold tracking-tight mt-2 ${critical > 0 ? 'text-rail-red' : 'text-rail-muted'}`}>
          {critical}
        </div>
        <span className="text-xs text-rail-muted mt-1 block">
          {critical > 0 ? 'Immediate action required' : 'No critical conflicts'}
        </span>
      </button>

      {/* 3. High Severity (Neutral when 0, Orange only when > 0) */}
      <button
        onClick={() => onSelectFilter('high')}
        className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
          selectedFilter === 'high'
            ? high > 0
              ? 'border-rail-orange/60 bg-rail-orange/10'
              : 'border-rail-borderLight bg-rail-cardHover'
            : high > 0
            ? 'border-rail-orange/30 bg-rail-card hover:bg-rail-orange/5'
            : 'border-rail-border bg-rail-card hover:bg-rail-cardHover'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${high > 0 ? 'text-rail-orange font-semibold' : 'text-rail-muted'}`}>
            High severity
          </span>
          <AlertTriangle className={`h-4 w-4 ${high > 0 ? 'text-rail-orange' : 'text-rail-muted'}`} />
        </div>
        <div className={`text-2xl font-bold tracking-tight mt-2 ${high > 0 ? 'text-rail-orange' : 'text-rail-muted'}`}>
          {high}
        </div>
        <span className="text-xs text-rail-muted mt-1 block">
          Uncoordinated depts
        </span>
      </button>

      {/* 4. Medium Severity (Neutral when 0, Amber only when > 0) */}
      <button
        onClick={() => onSelectFilter('medium')}
        className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
          selectedFilter === 'medium'
            ? medium > 0
              ? 'border-rail-amber/60 bg-rail-amber/10'
              : 'border-rail-borderLight bg-rail-cardHover'
            : medium > 0
            ? 'border-rail-amber/30 bg-rail-card hover:bg-rail-amber/5'
            : 'border-rail-border bg-rail-card hover:bg-rail-cardHover'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${medium > 0 ? 'text-rail-amber font-semibold' : 'text-rail-muted'}`}>
            Medium severity
          </span>
          <Clock className={`h-4 w-4 ${medium > 0 ? 'text-rail-amber' : 'text-rail-muted'}`} />
        </div>
        <div className={`text-2xl font-bold tracking-tight mt-2 ${medium > 0 ? 'text-rail-amber' : 'text-slate-300'}`}>
          {medium}
        </div>
        <span className="text-xs text-rail-muted mt-1 block">
          Freight buffer risk
        </span>
      </button>

      {/* 5. Resolved */}
      <button
        onClick={() => onSelectFilter('resolved')}
        className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
          selectedFilter === 'resolved'
            ? 'border-rail-emerald/60 bg-rail-emerald/10'
            : 'border-rail-border bg-rail-card hover:bg-rail-cardHover'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-rail-muted">
            Resolved
          </span>
          <CheckCircle2 className="h-4 w-4 text-rail-emerald" />
        </div>
        <div className="text-2xl font-bold text-rail-emerald tracking-tight mt-2">
          {resolved}
        </div>
        <span className="text-xs text-rail-muted mt-1 block">
          AI mitigated
        </span>
      </button>
    </div>
  );
};
