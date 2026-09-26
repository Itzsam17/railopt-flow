import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  TrendingUp, 
  RotateCcw, 
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AIRecommendation } from '../../types/api';

interface AIRecommendationsPanelProps {
  onGeneratePlan: () => void;
  onApplyRecommendation: (rec: AIRecommendation) => void;
  onResetTimeline: () => void;
  isGenerating: boolean;
  appliedRecIds: Set<string>;
}

export const AIRecommendationsPanel: React.FC<AIRecommendationsPanelProps> = ({
  onGeneratePlan,
  onApplyRecommendation,
  onResetTimeline,
  isGenerating,
  appliedRecIds,
}) => {
  // Requirement 14: State to track which cards have their Details expanded
  const [expandedCardIds, setExpandedCardIds] = useState<Set<string>>(new Set());

  const toggleCardDetails = (id: string) => {
    setExpandedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const recommendations: AIRecommendation[] = [
    {
      id: 'rec-1',
      title: 'Cross-Department Bundle on T-102',
      track_name: 'T-102',
      description: 'Synchronize Ballast Cleaning with S&T Glued Joint and Electrical Neutral Insulator in single 3.5h window.',
      departments: ['Engineering', 'S&T', 'Electrical'],
      work_orders: ['WO-ENG-2026-082', 'WO-SNT-2026-042', 'WO-ELE-2026-012'],
      suggested_start_hour: 1.5,
      duration_hours: 3.5,
      gain_metric: '+1.8% Uptime',
      impact_tag: 'High Impact',
    },
    {
      id: 'rec-2',
      title: 'Night-Curfew Shift on T-104',
      track_name: 'T-104',
      description: 'Move ultrasonic rail testing & interlocking logic check to 01:00-04:00 to clear peak Rajdhani (#12952) path.',
      departments: ['Engineering', 'S&T'],
      work_orders: ['WO-ENG-2026-084', 'WO-SNT-2026-044'],
      suggested_start_hour: 1.0,
      duration_hours: 3.0,
      gain_metric: 'Eliminates Conflict',
      impact_tag: 'Zero Disruption',
    },
    {
      id: 'rec-3',
      title: 'Turnout & Contact Wire Joint Window',
      track_name: 'T-201',
      description: 'Execute Diamond Cross Renewal concurrently with S&T Aspect Upgrade and Electrical Stagger tuning.',
      departments: ['Engineering', 'S&T', 'Electrical'],
      work_orders: ['WO-ENG-2026-085', 'WO-SNT-2026-045', 'WO-ELE-2026-015'],
      suggested_start_hour: 2.0,
      duration_hours: 3.5,
      gain_metric: '+22% Density',
      impact_tag: 'Throughput',
    },
  ];

  return (
    <div className="flex flex-col h-full rounded-2xl border border-rail-border bg-rail-card overflow-hidden">
      {/* Panel Header */}
      <div className="p-4 border-b border-rail-border bg-rail-subtle/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-rail-ai/15 border border-rail-ai/30 flex items-center justify-center text-rail-ai">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rail-text tracking-wide">
                AI Optimization Panel
              </h3>
              <span className="text-xs text-rail-muted">
                Multi-Department Bundling Engine
              </span>
            </div>
          </div>
          <button
            onClick={onResetTimeline}
            className="flex items-center gap-1 text-xs text-rail-muted hover:text-rail-text px-2 py-1 rounded bg-rail-subtle border border-rail-border transition-colors cursor-pointer"
            title="Reset scheduled blocks"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Primary CTA: Generate Optimized Plan */}
        <div className="mt-4">
          <button
            id="btn-generate-optimized-plan"
            onClick={onGeneratePlan}
            disabled={isGenerating}
            className="w-full rounded-xl px-4 py-2.5 bg-rail-ai hover:bg-[#4D6F94] border border-rail-borderLight text-rail-text font-semibold text-xs tracking-wide transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="h-3.5 w-3.5 rounded-full border-2 border-rail-text border-t-transparent animate-spin" />
                <span>Analyzing corridors & conflicts...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-rail-text" />
                <span>Generate Optimized Plan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recommended Bundles List (Trimmed with Details expand) */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        <div className="flex items-center justify-between text-xs text-rail-muted px-1">
          <span className="font-medium text-rail-text">Recommended Bundles</span>
          <span className="text-rail-ai font-medium">3 opportunities</span>
        </div>

        {recommendations.map((rec) => {
          const isApplied = appliedRecIds.has(rec.id);
          const isExpanded = expandedCardIds.has(rec.id);

          return (
            <div
              key={rec.id}
              className={`rounded-xl border p-3.5 transition-colors ${
                isApplied
                  ? 'border-rail-emerald/30 bg-rail-emerald/5'
                  : 'border-rail-border bg-rail-subtle/50 hover:border-rail-borderLight'
              }`}
            >
              {/* Top row: Track (Where) & Impact */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-rail-card text-rail-text border border-rail-border">
                    {rec.track_name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-rail-ai/10 text-rail-ai border border-rail-ai/20 font-medium">
                    {rec.impact_tag}
                  </span>
                </div>
                <span className="text-xs font-semibold text-rail-emerald flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {rec.gain_metric}
                </span>
              </div>

              {/* Title (What) */}
              <h4 className="text-xs font-bold text-rail-text mt-2 leading-snug">
                {rec.title}
              </h4>

              {/* Collapsed vs Expanded details (Requirement 14) */}
              {isExpanded && (
                <div className="mt-2.5 pt-2.5 border-t border-rail-border/80 space-y-2 animate-in fade-in duration-150">
                  <p className="text-xs text-rail-muted leading-relaxed">
                    {rec.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {rec.work_orders.map((wo) => (
                      <span
                        key={wo}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rail-card text-rail-muted border border-rail-border"
                      >
                        {wo}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Card Footer: Duration, Details Toggle, Apply Button */}
              <div className="mt-3 pt-2.5 border-t border-rail-border/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-rail-muted flex items-center gap-1 text-[11px]">
                    <Clock className="h-3 w-3 text-rail-muted" />
                    {rec.duration_hours}h
                  </span>

                  <button
                    onClick={() => toggleCardDetails(rec.id)}
                    className="flex items-center gap-0.5 text-rail-muted hover:text-rail-text transition-colors cursor-pointer text-[11px]"
                  >
                    <span>{isExpanded ? 'Less' : 'Details'}</span>
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                </div>

                <button
                  onClick={() => onApplyRecommendation(rec)}
                  disabled={isApplied}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer border ${
                    isApplied
                      ? 'bg-rail-emerald/15 text-rail-emerald border border-rail-emerald/30 cursor-default'
                      : 'bg-rail-ai hover:bg-[#4D6F94] border-rail-borderLight text-rail-text'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Applied</span>
                    </>
                  ) : (
                    <>
                      <span>Apply</span>
                      <ArrowRight className="h-3 w-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Target Metric Impact Projection Box */}
      <div className="p-3 border-t border-rail-border bg-rail-subtle text-xs space-y-1.5">
        <span className="text-[11px] text-rail-muted font-medium block">
          Optimization impact projection
        </span>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-1.5 rounded-lg bg-rail-card border border-rail-border">
            <span className="text-[10px] text-rail-muted block">Availability</span>
            <span className="text-xs font-bold text-rail-emerald">+2.4%</span>
          </div>
          <div className="p-1.5 rounded-lg bg-rail-card border border-rail-border">
            <span className="text-[10px] text-rail-muted block">Conflicts</span>
            <span className="text-xs font-bold text-rail-emerald">−73%</span>
          </div>
          <div className="p-1.5 rounded-lg bg-rail-card border border-rail-border">
            <span className="text-[10px] text-rail-muted block">Delay Risk</span>
            <span className="text-xs font-bold text-rail-emerald">−41%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
