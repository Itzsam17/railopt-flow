import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  ArrowRight, 
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SimulationParams, SimulationResult } from '../types/simulation';
import { 
  DEFAULT_SIMULATION_PARAMS, 
  runDeterministicSimulation 
} from '../services/simulationEngine';
import { SimulationControls } from '../components/simulation/SimulationControls';
import { SimulationResults } from '../components/simulation/SimulationResults';
import { SimulationCorridorImpact } from '../components/simulation/SimulationCorridorImpact';

export const SimulationPage: React.FC = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState<SimulationParams>(DEFAULT_SIMULATION_PARAMS);
  const [result, setResult] = useState<SimulationResult>(() => 
    runDeterministicSimulation(DEFAULT_SIMULATION_PARAMS)
  );
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  // Requirement 11: secondary metrics & parameter controls hidden behind 'Show details' expand
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Trigger recalculation simulation
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setAppliedSuccess(false);

    setTimeout(() => {
      const newResult = runDeterministicSimulation(params);
      setResult(newResult);
      setIsSimulating(false);
      // Auto-reveal details after running simulation per prompt
      setShowDetails(true);
    }, 450);
  };

  // Immediate preview update when sliders adjust, so metrics feel alive and responsive
  const handleParamsChange = (newParams: SimulationParams) => {
    setParams(newParams);
    setAppliedSuccess(false);
    const updated = runDeterministicSimulation(newParams);
    setResult(updated);
    // Reveal details after selecting a preset per prompt
    setShowDetails(true);
  };

  const handleApplyScenario = () => {
    setAppliedSuccess(true);
    setShowApplyModal(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Toolbar Action Bar (Replaces duplicate hero header and PRD badges) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-rail-border">
        <div className="flex items-center gap-2.5 text-xs text-rail-muted">
          <span className="inline-block h-2 w-2 rounded-full bg-rail-ai" />
          <span className="text-rail-text font-medium">Deterministic simulation active</span>
          <span className="text-rail-border">|</span>
          <span>Delhi Division decision matrix</span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowDetails((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rail-border bg-rail-card hover:bg-rail-raised text-xs text-rail-muted hover:text-rail-text transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-rail-ai" />
            <span>{showDetails ? 'Hide details' : 'Show details'}</span>
            {showDetails ? (
              <ChevronUp className="h-3.5 w-3.5 text-rail-muted" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-rail-muted" />
            )}
          </button>
        </div>
      </div>

      {/* Main Two-Column Simulation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Scenario Controls (4 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          <SimulationControls
            params={params}
            onChange={handleParamsChange}
            onRunSimulation={handleRunSimulation}
            isSimulating={isSimulating}
            showParameterControls={showDetails}
            onToggleControls={() => setShowDetails((prev) => !prev)}
          />
        </div>

        {/* Right Column: Live Recalculated Impact Metrics & Corridor State (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          <SimulationResults
            result={result}
            isSimulating={isSimulating}
            onApplyScenario={handleApplyScenario}
            appliedSuccess={appliedSuccess}
            showSecondaryMetrics={showDetails}
            onToggleDetails={() => setShowDetails((prev) => !prev)}
          />

          {showDetails && (
            <div className="animate-in fade-in duration-200">
              <SimulationCorridorImpact
                params={params}
                simulated={result.simulated}
              />
            </div>
          )}
        </div>

      </div>

      {/* Applied Scenario Confirmation Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-200">
          <div className="max-w-md w-full rounded-2xl border border-rail-border bg-rail-card p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rail-emerald/10 border border-rail-emerald/20 text-rail-emerald">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rail-text">
                  Scenario Parameters Applied
                </h3>
                <p className="text-xs text-rail-muted mt-1 leading-relaxed">
                  The simulated operational parameters ({params.blockDurationHours}h block duration,{' '}
                  <span className="text-rail-ai">{params.trainPriority}</span> priority,{' '}
                  {params.crewAvailability}% crew staffing) have been linked to the Block Planning engine.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rail-base border border-rail-border text-xs space-y-1.5 text-rail-muted">
              <div className="flex justify-between">
                <span>Predicted asset availability:</span>
                <span className="font-semibold text-rail-emerald">{result.simulated.assetAvailability}%</span>
              </div>
              <div className="flex justify-between">
                <span>Projected timetable conflicts:</span>
                <span className="font-semibold text-rail-ai">{result.simulated.conflictsCount} clashes</span>
              </div>
              <div className="flex justify-between">
                <span>Work orders executed:</span>
                <span className="font-semibold text-rail-text">{result.simulated.workOrdersCompletedCount} / 20</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-rail-muted hover:text-rail-text bg-rail-base hover:bg-rail-raised transition-colors cursor-pointer border border-rail-border"
              >
                Stay in Simulator
              </button>
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  navigate('/block-planning');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rail-text bg-rail-ai hover:bg-rail-ai/80 transition-colors cursor-pointer"
              >
                <span>Go to Block Planning</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
