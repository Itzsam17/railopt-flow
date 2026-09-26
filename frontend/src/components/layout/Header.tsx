import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Play, Clock, MapPin, Sparkles, Menu } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

const routeTitleMap: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Railway Operations Command Center',
    subtitle: 'Integrated Network Overview & Asset Availability',
  },
  '/dashboard': {
    title: 'Railway Operations Command Center',
    subtitle: 'Integrated Network Overview & Asset Availability',
  },
  '/block-planning': {
    title: 'Block Planning Workspace',
    subtitle: 'Coordinated Multi-Department Maintenance Scheduling',
  },
  '/conflict-center': {
    title: 'Conflict Resolution Center',
    subtitle: 'Automated Detection & Conflict Mitigation Engine',
  },
  '/analytics': {
    title: 'Optimization Analytics & Trends',
    subtitle: 'Asset Availability Impact & Disruption Deltas',
  },
  '/simulation': {
    title: 'What-If Operational Simulation',
    subtitle: 'Dynamic Parameter Modelling & Constraint Testing',
  },
  '/live-operations': {
    title: 'Live Network Operations',
    subtitle: 'Real-time Corridor Telemetry & Event Feed',
  },
};

interface HeaderProps {
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const location = useLocation();
  const [timeStr, setTimeStr] = useState<string>('');
  const { startDemo, isDemoActive, currentStepIndex, totalSteps, isMinimized, toggleMinimized } = useDemo();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentMeta = routeTitleMap[location.pathname] || {
    title: 'RailOpt Flow System',
    subtitle: 'AI Automatic Block Planning',
  };

  return (
    <header className="h-16 bg-rail-subtle border-b border-rail-border px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Current Screen Title & Subtitle with Mobile Hamburger */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded-lg border border-rail-border bg-rail-dark text-rail-muted hover:text-rail-text transition-colors cursor-pointer"
            title="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="flex flex-col">
          <h1 className="text-sm md:text-base font-bold text-rail-text tracking-wide flex items-center gap-2 truncate max-w-[200px] sm:max-w-none">
            {currentMeta.title}
          </h1>
          <span className="text-[11px] md:text-xs text-rail-muted font-normal truncate max-w-[220px] sm:max-w-none">
            {currentMeta.subtitle}
          </span>
        </div>
      </div>

      {/* Right Controls & Status Indicators */}
      <div className="flex items-center gap-3">
        {/* Division Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rail-card border border-rail-border text-xs text-rail-muted">
          <MapPin className="h-3.5 w-3.5 text-rail-ai" />
          <span className="text-rail-text font-medium">Northern Railway</span>
          <span className="text-rail-borderLight text-[11px]">/</span>
          <span className="text-rail-muted">Delhi Division</span>
        </div>

        {/* Live Operational Status: Physical Signal Lamp Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rail-card border border-rail-border text-xs">
          <span className="h-2 w-2 rounded-full bg-rail-emerald inline-block" />
          <span className="text-rail-emerald font-medium text-xs">
            System Operational
          </span>
        </div>

        {/* Clock */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-rail-muted px-2 py-1">
          <Clock className="h-3.5 w-3.5 text-rail-muted" />
          <span className="font-mono text-rail-text">{timeStr || '--:--:-- IST'}</span>
        </div>

        {/* Start Demo Button */}
        <button
          id="btn-start-demo"
          className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer active:scale-95 border ${
            isDemoActive
              ? 'text-rail-text bg-rail-emerald hover:bg-[#43825D] border-rail-borderLight'
              : 'text-rail-text bg-rail-ai hover:bg-[#4D6F94] border-rail-borderLight'
          }`}
          onClick={() => {
            if (isDemoActive) {
              if (isMinimized) toggleMinimized();
            } else {
              startDemo();
            }
          }}
          title={isDemoActive ? 'Demo tour is running. Click to view presenter card.' : 'Start guided multi-screen demo sequence'}
        >
          {isDemoActive ? (
            <>
              <span className="h-2 w-2 rounded-full bg-white inline-block" />
              <span>Tour Active ({currentStepIndex + 1}/{totalSteps})</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current text-rail-text" />
              <span>Start Demo</span>
              <Sparkles className="h-3 w-3 text-rail-text/80" />
            </>
          )}
        </button>
      </div>
    </header>
  );
};

