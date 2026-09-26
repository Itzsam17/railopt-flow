import React from 'react';
import { Target, TrendingUp } from 'lucide-react';

interface AssetTargetWidgetProps {
  className?: string;
  compact?: boolean;
}

export const AssetTargetWidget: React.FC<AssetTargetWidgetProps> = ({ className = '', compact = false }) => {
  return (
    <div className={`rounded-xl bg-rail-card border border-rail-border flex flex-col gap-2.5 ${compact ? 'p-3' : 'p-4'} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-rail-ai/10 flex items-center justify-center">
            <Target className="h-3.5 w-3.5 text-rail-ai" />
          </div>
          <span className="text-xs font-medium text-rail-text">Asset Target</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-rail-emerald font-semibold">
          <TrendingUp className="h-3 w-3" />
          <span>+2.4%</span>
        </div>
      </div>

      <div className="w-full bg-rail-subtle rounded-full h-2 overflow-hidden border border-rail-border">
        <div 
          className="bg-rail-emerald h-full rounded-full transition-all duration-500" 
          style={{ width: '96.2%' }}
        />
      </div>

      <div className="flex justify-between items-center text-xs text-rail-muted">
        <span>Current: <strong className="text-rail-text font-medium">94.7%</strong></span>
        <span>Predicted Target: <strong className="text-rail-emerald font-medium">96.2%</strong></span>
      </div>
    </div>
  );
};

