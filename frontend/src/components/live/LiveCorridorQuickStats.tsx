import React from 'react';
import { 
  Zap, 
  Radio, 
  ShieldCheck, 
  Thermometer
} from 'lucide-react';

export const LiveCorridorQuickStats: React.FC = () => {
  return (
    <div className="rounded-2xl border border-rail-border bg-rail-card p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        
        {/* Metric 1: OHE Traction Power */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-rail-base border border-rail-border">
          <div className="p-2 rounded-lg bg-rail-emerald/15 border border-rail-emerald/30 text-rail-emerald">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-rail-muted uppercase">Traction Power</div>
            <div className="text-sm font-bold text-rail-text flex items-center gap-1.5">
              <span>25 kV AC</span>
              <span className="text-[10px] text-rail-emerald font-normal">Nominal</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Signaling Interlocking */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-rail-base border border-rail-border">
          <div className="p-2 rounded-lg bg-rail-ai/15 border border-rail-ai/30 text-rail-ai">
            <Radio className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-rail-muted uppercase">Electronic Interlocking</div>
            <div className="text-sm font-bold text-rail-text flex items-center gap-1.5">
              <span>Auto EI</span>
              <span className="text-[10px] text-rail-ai font-normal">99.9% Uptime</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Axle Counters */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-rail-base border border-rail-border">
          <div className="p-2 rounded-lg bg-rail-emerald/15 border border-rail-emerald/30 text-rail-emerald">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-rail-muted uppercase">Track Occupation</div>
            <div className="text-sm font-bold text-rail-text flex items-center gap-1.5">
              <span>Dual DAC</span>
              <span className="text-[10px] text-rail-emerald font-normal">Healthy</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Ambient Track Conditions */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-rail-base border border-rail-border">
          <div className="p-2 rounded-lg bg-rail-ai/15 border border-rail-ai/30 text-rail-ai">
            <Thermometer className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] text-rail-muted uppercase">Rail Environment</div>
            <div className="text-sm font-bold text-rail-text flex items-center gap-1.5">
              <span>28°C Dry</span>
              <span className="text-[10px] text-rail-ai font-normal">Adhesion 1.0</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
