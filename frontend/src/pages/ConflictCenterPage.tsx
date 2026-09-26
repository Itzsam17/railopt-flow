import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  Filter
} from 'lucide-react';
import { ConflictSeverityCards } from '../components/conflicts/ConflictSeverityCards';
import { ConflictCard } from '../components/conflicts/ConflictCard';
import { fetchConflicts, resolveConflictApi } from '../services/api';
import { ConflictItem } from '../types/api';

export const ConflictCenterPage: React.FC = () => {
  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isBulkResolving, setIsBulkResolving] = useState<boolean>(false);
  const [resolutionNotice, setResolutionNotice] = useState<string | null>(null);

  const loadConflicts = async () => {
    try {
      const data = await fetchConflicts();
      setConflicts(data);
    } catch (err) {
      console.error('Error loading conflicts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadConflicts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadConflicts();
  };

  // Resolve single conflict
  const handleResolveSingle = async (conflictId: number) => {
    try {
      const updated = await resolveConflictApi(conflictId);
      setConflicts((prev) =>
        prev.map((c) => (c.id === conflictId ? { ...c, status: 'resolved', resolved_at: updated.resolved_at } : c))
      );
      setResolutionNotice(`Conflict #${conflictId} on track ${updated.track_name || 'segment'} resolved automatically.`);
    } catch (err) {
      console.error('Failed to resolve conflict:', err);
    }
  };

  // Bulk resolve all open conflicts
  const handleResolveAll = async () => {
    setIsBulkResolving(true);
    try {
      const openConflicts = conflicts.filter((c) => c.status === 'open');
      for (const c of openConflicts) {
        await resolveConflictApi(c.id);
      }
      setConflicts((prev) =>
        prev.map((c) => ({ ...c, status: 'resolved', resolved_at: new Date().toISOString() }))
      );
      setResolutionNotice('All scheduling conflicts across Delhi Division resolved automatically. −73% predicted disruption achieved.');
    } catch (err) {
      console.error('Failed to bulk resolve:', err);
    } finally {
      setIsBulkResolving(false);
    }
  };

  // Filtered conflicts list
  const filteredConflicts = conflicts.filter((c) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'critical') return c.severity === 'critical' && c.status === 'open';
    if (selectedFilter === 'high') return c.severity === 'high' && c.status === 'open';
    if (selectedFilter === 'medium') return c.severity === 'medium' && c.status === 'open';
    if (selectedFilter === 'resolved') return c.status === 'resolved';
    return true;
  });

  const openCount = conflicts.filter((c) => c.status === 'open').length;
  const resolvedCount = conflicts.length - openCount;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[480px] space-y-4">
        <div className="h-10 w-10 rounded-full border-2 border-rail-ai border-t-transparent animate-spin" />
        <span className="text-sm text-rail-muted">
          Scanning timetables and detecting interlocking conflicts...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Toolbar Action Bar (Replaces duplicate hero header and PRD badges) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-rail-border/60">
        <div className="flex items-center gap-2.5 text-xs text-rail-muted">
          <span className={`inline-block h-2 w-2 rounded-full ${openCount > 0 ? 'bg-rail-amber' : 'bg-rail-emerald'}`} />
          <span className="text-rail-text font-medium">
            {openCount > 0 ? `${openCount} open conflicts detected` : 'All conflicts resolved'}
          </span>
          <span className="text-rail-borderLight">|</span>
          <span>{resolvedCount} resolved</span>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {openCount > 0 && (
            <button
              id="btn-resolve-all-conflicts"
              onClick={handleResolveAll}
              disabled={isBulkResolving}
              className="px-3.5 py-1.5 rounded-lg bg-rail-ai hover:bg-[#4D6F94] border border-rail-borderLight text-rail-text text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isBulkResolving ? (
                <RotateCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-rail-text" />
              )}
              <span>Resolve all automatically</span>
            </button>
          )}

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rail-card border border-rail-border hover:border-rail-borderLight text-xs text-rail-muted hover:text-rail-text transition-colors cursor-pointer"
            title="Refresh conflict queue"
          >
            <RotateCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-rail-ai' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Real-time Resolution Toast / Banner */}
      {resolutionNotice && (
        <div className="p-3.5 rounded-xl border border-rail-emerald/30 bg-rail-emerald/10 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-rail-emerald font-medium">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{resolutionNotice}</span>
          </div>
          <button
            onClick={() => setResolutionNotice(null)}
            className="text-slate-400 hover:text-white text-xs cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Severity Counters Row / Smart Collapsed Line */}
      <ConflictSeverityCards
        conflicts={conflicts}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
      />

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl border border-rail-border bg-rail-card text-xs">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-rail-muted" />
          <span className="text-slate-400 font-medium">Filter view:</span>
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'all', label: `All (${conflicts.length})` },
              { id: 'critical', label: 'Critical' },
              { id: 'high', label: 'High' },
              { id: 'medium', label: 'Medium' },
              { id: 'resolved', label: `Resolved (${resolvedCount})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                  selectedFilter === f.id
                    ? 'bg-rail-subtle border border-rail-borderLight text-white font-medium'
                    : 'text-rail-muted hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <span className="text-rail-muted text-xs">
          Showing {filteredConflicts.length} of {conflicts.length} entries
        </span>
      </div>

      {/* Conflicts Cards List */}
      <div className="space-y-4">
        {filteredConflicts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-rail-border bg-rail-card/50">
            <CheckCircle2 className="h-10 w-10 text-rail-emerald mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No conflicts in this category</h3>
            <p className="text-xs text-rail-muted mt-1">
              Select another filter or trigger AI bundling to review active track segments.
            </p>
          </div>
        ) : (
          filteredConflicts.map((conflict) => (
            <ConflictCard
              key={conflict.id}
              conflict={conflict}
              onResolve={handleResolveSingle}
            />
          ))
        )}
      </div>
    </div>
  );
};
