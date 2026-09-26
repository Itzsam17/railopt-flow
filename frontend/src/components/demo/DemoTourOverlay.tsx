import React from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles, 
  Minimize2, 
  Maximize2,
  Volume2,
  CheckCircle2
} from 'lucide-react';
import { useDemo, DEMO_TOUR_STEPS } from '../../context/DemoContext';

export const DemoTourOverlay: React.FC = () => {
  const {
    isDemoActive,
    currentStepIndex,
    currentStep,
    isAutoPlaying,
    secondsRemaining,
    totalSteps,
    isMinimized,
    stopDemo,
    nextStep,
    prevStep,
    goToStep,
    toggleAutoPlay,
    toggleMinimized,
  } = useDemo();

  if (!isDemoActive) return null;

  // Minimized Floating Pill View
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-rail-border bg-rail-card">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-rail-ai" />
            <span className="text-xs font-mono font-bold text-rail-text">
              🎬 Demo {currentStepIndex + 1}/{totalSteps}
            </span>
          </div>

          <div className="text-xs font-semibold text-rail-muted truncate max-w-[200px]">
            {currentStep.title}
          </div>

          <div className="flex items-center gap-1.5 border-l border-rail-border pl-2">
            <button
              onClick={toggleAutoPlay}
              className="p-1 rounded text-rail-muted hover:text-rail-text"
              title={isAutoPlaying ? 'Pause' : 'Resume'}
            >
              {isAutoPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-current" />}
            </button>
            <button
              onClick={nextStep}
              className="p-1 rounded text-rail-muted hover:text-rail-text"
              title="Next"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={toggleMinimized}
              className="p-1 rounded text-rail-muted hover:text-rail-text"
              title="Expand Narrator Window"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={stopDemo}
              className="p-1 rounded text-rail-muted hover:text-rail-red"
              title="End Tour"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = Math.max(0, Math.min(100, ((currentStep.durationSeconds - secondsRemaining) / currentStep.durationSeconds) * 100));

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-xl w-[calc(100vw-3rem)] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-2xl border border-rail-border bg-rail-card overflow-hidden transition-all duration-300">
        
        {/* Step Countdown Progress Bar */}
        <div className="w-full h-1 bg-rail-base overflow-hidden">
          <div 
            className="h-full bg-rail-ai transition-all duration-1000 ease-linear"
            style={{ width: isAutoPlaying ? `${progressPercent}%` : '100%' }}
          />
        </div>

        {/* Presenter Card Header */}
        <div className="p-4 border-b border-rail-border flex items-center justify-between bg-rail-base">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rail-raised border border-rail-border text-rail-ai">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rail-ai">
                  {currentStep.badge}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full border border-rail-border bg-rail-card text-rail-muted">
                  {isAutoPlaying ? `Auto in ${secondsRemaining}s` : 'Paused'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMinimized}
              className="p-1.5 rounded-lg hover:bg-rail-raised text-rail-muted hover:text-rail-text transition-colors cursor-pointer"
              title="Minimize to floating pill"
            >
              <Minimize2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={stopDemo}
              className="p-1.5 rounded-lg hover:bg-rail-raised text-rail-muted hover:text-rail-red transition-colors cursor-pointer"
              title="Close Demo Tour (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3.5">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-rail-text tracking-tight">
                {currentStep.title}
              </h3>
              <span className="text-[10px] font-mono text-rail-muted uppercase tracking-wider">
                {currentStep.route}
              </span>
            </div>
            <p className="text-xs text-rail-ai font-mono mt-0.5">
              {currentStep.subtitle}
            </p>
          </div>

          {/* Key Highlight Metric Badge */}
          <div className="p-2.5 rounded-xl bg-rail-base border border-rail-border flex items-center gap-2 text-xs font-mono text-rail-text">
            <CheckCircle2 className="h-4 w-4 text-rail-emerald shrink-0" />
            <span className="truncate">{currentStep.keyHighlight}</span>
          </div>

          {/* Narrator Teleprompter Script */}
          <div className="p-3.5 rounded-xl bg-rail-base border border-rail-border relative">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-rail-ai uppercase mb-1 font-bold">
              <Volume2 className="h-3 w-3" />
              <span>Presenter Script (Read Aloud to Jury)</span>
            </div>
            <p className="text-xs text-rail-text leading-relaxed font-sans italic">
              "{currentStep.narratorScript}"
            </p>
          </div>
        </div>

        {/* Control Footer */}
        <div className="p-3 px-5 border-t border-rail-border bg-rail-base flex items-center justify-between">
          {/* Quick Jump Selector */}
          <select
            value={currentStepIndex}
            onChange={(e) => goToStep(parseInt(e.target.value, 10))}
            className="px-2.5 py-1.5 rounded-lg bg-rail-card border border-rail-border text-xs text-rail-text font-mono focus:outline-none focus:border-rail-ai cursor-pointer"
          >
            {DEMO_TOUR_STEPS.map((s, idx) => (
              <option key={s.stepNumber} value={idx}>
                {s.stepNumber}. {s.title}
              </option>
            ))}
          </select>

          {/* Player Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center transition-all cursor-pointer ${
                currentStepIndex === 0
                  ? 'border-rail-border text-rail-muted opacity-40 cursor-not-allowed'
                  : 'border-rail-border bg-rail-card text-rail-muted hover:text-rail-text hover:bg-rail-raised'
              }`}
              title="Previous Step (Left Arrow)"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={toggleAutoPlay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rail-border bg-rail-card text-xs font-mono font-semibold text-rail-text hover:bg-rail-raised transition-colors cursor-pointer"
              title={isAutoPlaying ? 'Pause Auto-Play (Space)' : 'Start Auto-Play (Space)'}
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              onClick={nextStep}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs text-rail-text bg-rail-ai hover:bg-rail-ai/80 transition-all cursor-pointer active:scale-95"
              title="Next Step (Right Arrow)"
            >
              <span>{currentStepIndex === totalSteps - 1 ? 'Finish Tour' : 'Next Step'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
