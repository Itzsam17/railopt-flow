import React from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Play, 
  Clock, 
  Users, 
  Layers, 
  Train, 
  ShieldCheck, 
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  SimulationParams, 
  ScenarioPreset, 
  TrainPriorityMode 
} from '../../types/simulation';
import { SCENARIO_PRESETS, DEFAULT_SIMULATION_PARAMS } from '../../services/simulationEngine';

interface SimulationControlsProps {
  params: SimulationParams;
  onChange: (params: SimulationParams) => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
  showParameterControls?: boolean;
  onToggleControls?: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  params,
  onChange,
  onRunSimulation,
  isSimulating,
  showParameterControls = false,
  onToggleControls,
}) => {
  const handlePresetSelect = (preset: ScenarioPreset) => {
    onChange({ ...preset.params });
  };

  const handleReset = () => {
    onChange({ ...DEFAULT_SIMULATION_PARAMS });
  };

  const getCrewStatus = (crew: number) => {
    if (crew >= 90) return { label: 'Optimal manning', color: 'text-rail-emerald border-rail-emerald/30 bg-rail-emerald/10' };
    if (crew >= 75) return { label: 'Adequate staffing', color: 'text-rail-ai border-rail-ai/30 bg-rail-ai/10' };
    if (crew >= 65) return { label: 'Moderate shortage', color: 'text-rail-amber border-rail-amber/30 bg-rail-amber/10' };
    return { label: 'Manning deficit', color: 'text-rail-red border-rail-red/30 bg-rail-red/10' };
  };

  const crewStatus = getCrewStatus(params.crewAvailability);

  const priorityOptions: { mode: TrainPriorityMode; title: string; subtitle: string; icon: any }[] = [
    {
      mode: 'balanced',
      title: 'Balanced Network',
      subtitle: 'Standard timetable hierarchy',
      icon: Train,
    },
    {
      mode: 'passenger',
      title: 'Passenger Express',
      subtitle: 'Vande Bharat & Rajdhani protected',
      icon: Zap,
    },
    {
      mode: 'freight',
      title: 'Freight Corridor',
      subtitle: 'Coal and goods paths cleared',
      icon: ShieldCheck,
    },
    {
      mode: 'maintenance',
      title: 'Maintenance Focus',
      subtitle: 'Expanded possession curfews',
      icon: Layers,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Scenario Presets (Always visible by default per prompt) */}
      <div className="rounded-2xl border border-rail-border bg-rail-card p-5">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-rail-ai" />
            <span className="text-xs font-semibold text-slate-200">
              Scenario presets
            </span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-rail-muted hover:text-white transition-colors cursor-pointer px-2 py-1 rounded hover:bg-rail-subtle"
            title="Reset to default baseline parameters"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset baseline</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SCENARIO_PRESETS.map((preset) => {
            const isSelected = 
              params.blockDurationHours === preset.params.blockDurationHours &&
              params.trainPriority === preset.params.trainPriority &&
              params.crewAvailability === preset.params.crewAvailability &&
              params.bundlingEnabled === preset.params.bundlingEnabled;

            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-rail-ai bg-rail-subtle'
                    : 'border-rail-border bg-rail-subtle/50 hover:bg-rail-cardHover'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-white">
                    {preset.name}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${preset.badgeColor}`}>
                    {preset.badge}
                  </span>
                </div>
                <p className="text-xs text-rail-muted line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>

        {onToggleControls && (
          <button
            onClick={onToggleControls}
            className="w-full mt-3.5 pt-3 border-t border-rail-border/80 flex items-center justify-center gap-2 text-xs text-rail-ai hover:text-blue-400 font-medium transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{showParameterControls ? 'Hide parameter controls' : 'Customize operational parameters'}</span>
            {showParameterControls ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Main Interactive Controls Card (Behind 'Show details' / customize toggle) */}
      {showParameterControls && (
        <div className="rounded-2xl border border-rail-border bg-rail-card p-5 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 pb-3 border-b border-rail-border">
            <SlidersHorizontal className="h-4 w-4 text-rail-ai" />
            <h3 className="text-xs font-semibold text-rail-text">
              Operational parameter controls
            </h3>
          </div>

          {/* 1. Block Duration Slider */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-rail-text">
                <Clock className="h-3.5 w-3.5 text-rail-ai" />
                <span>Maintenance block window</span>
              </label>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-rail-base border border-rail-border text-xs">
                <span className="font-semibold text-rail-ai">{params.blockDurationHours.toFixed(1)}</span>
                <span className="text-rail-muted">hours</span>
              </div>
            </div>

            <input
              type="range"
              min="1.5"
              max="6.0"
              step="0.5"
              value={params.blockDurationHours}
              onChange={(e) => onChange({ ...params, blockDurationHours: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-rail-base rounded-lg appearance-none cursor-pointer accent-[#5B7FA6]"
            />

            <div className="flex justify-between items-center text-[11px] text-rail-muted">
              <span>1.5h (Micro)</span>
              <span className={params.blockDurationHours === 3.5 ? 'text-rail-ai font-medium' : ''}>
                3.5h (Standard)
              </span>
              <span className={params.blockDurationHours >= 5.0 ? 'text-rail-amber font-medium' : ''}>
                6.0h (Extended)
              </span>
            </div>
          </div>

          {/* 2. Train Priority Hierarchy Selector */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-medium text-rail-text">
              <Train className="h-3.5 w-3.5 text-rail-ai" />
              <span>Timetable priority hierarchy</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {priorityOptions.map((opt) => {
                const isSelected = params.trainPriority === opt.mode;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.mode}
                    type="button"
                    onClick={() => onChange({ ...params, trainPriority: opt.mode })}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-rail-ai bg-rail-ai/10 text-rail-text'
                        : 'border-rail-border bg-rail-base text-rail-muted hover:text-rail-text hover:bg-rail-raised'
                    }`}
                  >
                    <div className={`mt-0.5 p-1 rounded-lg ${isSelected ? 'bg-rail-ai/20 text-rail-ai' : 'bg-rail-card text-rail-muted'}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold leading-tight text-rail-text">{opt.title}</div>
                      <div className="text-[11px] text-rail-muted mt-0.5 leading-snug">{opt.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Crew & Heavy Machinery Availability */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-rail-text">
                <Users className="h-3.5 w-3.5 text-rail-emerald" />
                <span>Crew & fleet availability</span>
              </label>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${crewStatus.color}`}>
                  {crewStatus.label}
                </span>
                <span className="text-xs font-semibold text-rail-text bg-rail-base px-2 py-0.5 rounded border border-rail-border">
                  {params.crewAvailability}%
                </span>
              </div>
            </div>

            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={params.crewAvailability}
              onChange={(e) => onChange({ ...params, crewAvailability: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-rail-base rounded-lg appearance-none cursor-pointer accent-[#4F9A6E]"
            />

            <div className="flex justify-between items-center text-[11px] text-rail-muted">
              <span>50% (Deficit)</span>
              <span>75% (Nominal)</span>
              <span>100% (Full)</span>
            </div>
          </div>

          {/* 4. Cross-Departmental Bundling Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-rail-border bg-rail-base">
            <div className="flex items-center gap-2.5">
              <div className={`p-1.5 rounded-lg border ${
                params.bundlingEnabled 
                  ? 'bg-rail-ai/20 border-rail-ai/30 text-rail-ai' 
                  : 'bg-rail-card border-rail-border text-rail-muted'
              }`}>
                <Layers className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-rail-text flex items-center gap-1.5">
                  <span>Cross-department bundling</span>
                  {params.bundlingEnabled && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-rail-ai/20 text-rail-ai border border-rail-ai/30">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-rail-muted">
                  Synchronize Engineering, S&T, and Electrical into shared windows
                </div>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={params.bundlingEnabled}
                onChange={(e) => onChange({ ...params, bundlingEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-rail-card peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rail-ai"></div>
            </label>
          </div>

          {/* 5. Corridor Focus Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-rail-muted block">
              Corridor focus
            </label>
            <select
              value={params.corridorFocus}
              onChange={(e) => onChange({ ...params, corridorFocus: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl bg-rail-base border border-rail-border text-xs text-rail-text focus:outline-none focus:border-rail-ai cursor-pointer"
            >
              <option value="all">Network-wide (All 3 Corridors · 8 Tracks)</option>
              <option value="ndls-agc">Corridor 1: New Delhi – Agra Cantt</option>
              <option value="dli-gzb">Corridor 2: Delhi Jn – Ghaziabad</option>
              <option value="ndls-tkd">Corridor 3: New Delhi – Tuglakabad</option>
            </select>
          </div>

          {/* Run Simulation CTA */}
          <div className="pt-2">
            <button
              id="btn-run-simulation"
              onClick={onRunSimulation}
              disabled={isSimulating}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-rail-text transition-colors cursor-pointer ${
                isSimulating
                  ? 'bg-slate-700 cursor-not-allowed text-rail-muted'
                  : 'bg-rail-ai hover:bg-rail-ai/80'
              }`}
            >
              {isSimulating ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Simulating scenario impact...</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current text-white" />
                  <span>Run scenario recalculation</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
