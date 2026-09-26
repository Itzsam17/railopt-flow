import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  RotateCw, 
  ArrowRight, 
  X,
  Check
} from 'lucide-react';
import { runOptimizationPlan } from '../../services/api';
import { OptimizationResult } from '../../types/api';

interface OptimizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPlan: (result: OptimizationResult) => void;
}

interface StepItem {
  id: number;
  label: string;
  sublabel: string;
  durationMs: number;
}

export const OptimizationModal: React.FC<OptimizationModalProps> = ({
  isOpen,
  onClose,
  onApplyPlan,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [resultData, setResultData] = useState<OptimizationResult | null>(null);

  const steps: StepItem[] = [
    {
      id: 1,
      label: 'Ingesting Train Timetables & Corridor Telemetry',
      sublabel: 'Scanning 8 tracks & 30 active train paths across Northern Railway',
      durationMs: 1000,
    },
    {
      id: 2,
      label: 'Cross-Referencing Multi-Department Backlog',
      sublabel: 'Aggregating 20 requests across Engineering, S&T, and Electrical',
      durationMs: 1100,
    },
    {
      id: 3,
      label: 'Detecting Passenger Route Conflicts',
      sublabel: 'Identifying Rajdhani (#12952) & Shatabdi (#12004) possession overlaps',
      durationMs: 1000,
    },
    {
      id: 4,
      label: 'Executing Combinatorial Activity Bundling Solver',
      sublabel: 'Grouping compatible maintenance activities into unified block windows',
      durationMs: 1100,
    },
    {
      id: 5,
      label: 'Verifying Safety Headways & Computing Delta Metrics',
      sublabel: 'Finalizing asset availability models and train delay risk reduction',
      durationMs: 800,
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setIsCompleted(false);
      setProgressPercent(0);
      setResultData(null);
      return;
    }

    // Call backend API in parallel while running staged UI animation
    let optimizationPromise = runOptimizationPlan();

    let stepTimer: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    let step = 0;

    // Smooth continuous progress bar animation across ~5 seconds
    const totalDurationMs = steps.reduce((sum, s) => sum + s.durationMs, 0);
    const startTime = Date.now();

    progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(98, Math.round((elapsed / totalDurationMs) * 100));
      setProgressPercent(pct);
    }, 50);

    const advanceStep = () => {
      if (step < steps.length - 1) {
        step += 1;
        setCurrentStepIndex(step);
        stepTimer = setTimeout(advanceStep, steps[step].durationMs);
      } else {
        // Complete all steps
        optimizationPromise.then((data) => {
          setResultData(data);
          setProgressPercent(100);
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsCompleted(true);
          }, 400);
        });
      }
    };

    stepTimer = setTimeout(advanceStep, steps[0].durationMs);

    return () => {
      clearTimeout(stepTimer);
      clearInterval(progressInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-rail-border bg-rail-card p-6 lg:p-8">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-rail-muted hover:text-rail-text hover:bg-rail-subtle transition-colors"
          title="Close optimization modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-rail-ai/20 border border-rail-ai/40 flex items-center justify-center text-rail-ai">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-rail-ai font-semibold flex items-center gap-1.5">
              RailOpt Flow AI Engine
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-rail-emerald" />
            </span>
            <h2 className="text-xl font-extrabold text-rail-text tracking-tight">
              Automatic Cross-Department Block Optimization
            </h2>
          </div>
        </div>

        {/* STAGE A: Animated Execution Checklist (First 5 seconds) */}
        {!isCompleted ? (
          <div className="mt-8 space-y-6">
            {/* Progress Bar & Status */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-rail-muted flex items-center gap-2">
                  <RotateCw className="h-3.5 w-3.5 animate-spin text-rail-ai" />
                  <span>Executing Optimization Heuristic...</span>
                </span>
                <span className="text-rail-ai font-bold">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-rail-subtle overflow-hidden relative border border-rail-border">
                <div
                  className="h-full rounded-full bg-rail-ai transition-all duration-100 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Step Checklist Cards */}
            <div className="space-y-3">
              {steps.map((st, idx) => {
                const isDone = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div
                    key={st.id}
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all duration-300 ${
                      isDone
                        ? 'border-rail-emerald/30 bg-rail-emerald/5'
                        : isCurrent
                        ? 'border-rail-ai bg-rail-ai/10'
                        : 'border-rail-border/50 bg-rail-dark/40 opacity-40'
                    }`}
                  >
                    {/* Status Icon */}
                    <div className="shrink-0 mt-0.5">
                      {isDone ? (
                        <div className="h-5 w-5 rounded-full bg-rail-emerald/20 text-rail-emerald flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      ) : isCurrent ? (
                        <div className="h-5 w-5 rounded-full bg-rail-ai/20 text-rail-ai flex items-center justify-center">
                          <RotateCw className="h-3.5 w-3.5 animate-spin" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-rail-border bg-rail-dark text-rail-muted flex items-center justify-center text-[10px] font-mono font-bold">
                          {st.id}
                        </div>
                      )}
                    </div>

                    {/* Step Details */}
                    <div>
                      <h4
                        className={`text-xs font-bold leading-tight ${
                          isDone
                            ? 'text-rail-text'
                            : isCurrent
                            ? 'text-rail-ai'
                            : 'text-rail-muted'
                        }`}
                      >
                        {st.label}
                      </h4>
                      <p className="text-[11px] text-rail-muted mt-0.5">
                        {st.sublabel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* STAGE B: Result Summary with 4 Delta Metrics */
          <div className="mt-6 space-y-6 animate-in fade-in zoom-in-95 duration-400">
            {/* Success Headline */}
            <div className="p-4 rounded-xl border border-rail-emerald/40 bg-rail-subtle flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-rail-emerald/20 border border-rail-emerald/40 flex items-center justify-center text-rail-emerald">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-rail-emerald font-bold block">
                    OPTIMIZATION RUN COMPLETED SUCCESSFULLY
                  </span>
                  <h3 className="text-sm font-bold text-rail-text mt-0.5">
                    14 Work Orders Bundled into 5 Coordinated Track Windows
                  </h3>
                </div>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-mono bg-rail-dark border border-rail-border text-rail-muted">
                2.5h Planning Time Saved
              </span>
            </div>

            {/* 4 Delta Metrics Cards */}
            <div>
              <span className="text-[11px] font-mono uppercase text-rail-muted tracking-wider font-semibold block mb-2.5">
                PITCH DECK DELTA METRICS
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Metric 1: Asset Availability */}
                <div className="p-3.5 rounded-xl border border-rail-borderLight bg-rail-dark flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-rail-muted font-mono uppercase block">
                      Asset Availability
                    </span>
                    <div className="text-2xl font-black text-rail-text font-sans mt-1">
                      +2.4%
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-rail-border text-[11px] font-mono text-rail-ai font-semibold">
                    94.7% → 96.2%
                  </div>
                </div>

                {/* Metric 2: Conflict Reduction */}
                <div className="p-3.5 rounded-xl border border-rail-borderLight bg-rail-dark flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-rail-muted font-mono uppercase block">
                      Conflict Reduction
                    </span>
                    <div className="text-2xl font-black text-rail-emerald font-sans mt-1">
                      −73%
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-rail-border text-[11px] font-mono text-rail-emerald font-semibold">
                    4 Open → 0 Left
                  </div>
                </div>

                {/* Metric 3: Train Delay Risk */}
                <div className="p-3.5 rounded-xl border border-rail-borderLight bg-rail-dark flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-rail-muted font-mono uppercase block">
                      Delay Risk
                    </span>
                    <div className="text-2xl font-black text-rail-text font-sans mt-1">
                      −41%
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-rail-border text-[11px] font-mono text-rail-ai font-semibold">
                    Rajdhani Safe
                  </div>
                </div>

                {/* Metric 4: Maintenance Throughput */}
                <div className="p-3.5 rounded-xl border border-rail-borderLight bg-rail-dark flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-rail-muted font-mono uppercase block">
                      Work Density
                    </span>
                    <div className="text-2xl font-black text-rail-text font-sans mt-1">
                      +18%
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-rail-border text-[11px] font-mono text-rail-ai font-semibold">
                    Joint Possession
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Block Summary Chips */}
            <div className="p-3.5 rounded-xl border border-rail-border bg-rail-base text-xs font-mono">
              <span className="text-rail-muted block text-[10px] uppercase font-bold tracking-wider mb-2">
                COORDINATED BLOCKS SCHEDULED ACROSS CORRIDORS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-rail-card border border-rail-border">
                  <span className="text-rail-ai font-bold block">T-101 & T-102 (NDLS-AGC)</span>
                  <span className="text-[11px] text-rail-muted">01:00–05:30 (3 Depts Bundled)</span>
                </div>
                <div className="p-2 rounded-lg bg-rail-card border border-rail-border">
                  <span className="text-rail-ai font-bold block">T-104 (High-Speed)</span>
                  <span className="text-[11px] text-rail-muted">01:00–04:00 (Curfew Window)</span>
                </div>
                <div className="p-2 rounded-lg bg-rail-card border border-rail-border">
                  <span className="text-rail-ai font-bold block">T-201 & T-301 (DLI/CNB)</span>
                  <span className="text-[11px] text-rail-muted">Joint Eng + S&T + Elec</span>
                </div>
              </div>
            </div>

            {/* Footer Action: View Optimized Plan */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-rail-subtle hover:bg-rail-card text-rail-muted hover:text-rail-text text-xs font-mono font-medium transition-colors border border-rail-border"
              >
                Close
              </button>

              <button
                id="btn-view-optimized-plan"
                onClick={() => {
                  if (resultData) {
                    onApplyPlan(resultData);
                  }
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-rail-ai hover:bg-[#4D6F94] text-rail-text text-xs font-bold font-mono tracking-wide transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer border border-rail-borderLight"
              >
                <span>View Optimized Plan</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
