import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarRange,
  AlertTriangle,
  BarChart3,
  SlidersHorizontal,
  Activity,
  Sparkles,
  Train,
  ChevronRight,
  X
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    description: 'Command Center & Network Overview',
  },
  {
    name: 'Block Planning',
    path: '/block-planning',
    icon: CalendarRange,
    badge: 'AI Engine',
    badgeColor: 'bg-rail-ai/20 text-rail-ai border-rail-ai/30',
    description: 'Gantt Timeline & Coordinated Blocks',
  },
  {
    name: 'Conflict Center',
    path: '/conflict-center',
    icon: AlertTriangle,
    badge: '4 Open',
    badgeColor: 'bg-rail-orange/20 text-rail-orange border-rail-orange/30',
    description: 'Conflict Detection & Auto Resolution',
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: BarChart3,
    description: 'Availability & Efficiency Deltas',
  },
  {
    name: 'Simulation',
    path: '/simulation',
    icon: SlidersHorizontal,
    description: 'What-If Impact Modelling',
  },
  {
    name: 'Live Operations',
    path: '/live-operations',
    icon: Activity,
    badge: 'LIVE',
    badgeColor: 'bg-rail-emerald/20 text-rail-emerald border-rail-emerald/30 animate-pulse',
    description: 'Real-time Feed & Track Availability',
  },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const sidebarContent = (
    <div className="w-72 bg-rail-subtle border-r border-rail-border flex flex-col h-screen select-none shrink-0 transition-all duration-300">
      {/* Brand Header */}
      <div className="p-5 border-b border-rail-border flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-rail-raised border border-rail-border flex items-center justify-center text-rail-ai">
              <Train className="h-6 w-6 text-rail-ai" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-wider text-rail-text flex items-center gap-1.5">
                RailOpt <span className="text-rail-ai font-normal">Flow</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-mono text-rail-muted flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 text-rail-ai" />
                AI Block Planning
              </span>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-rail-muted hover:text-rail-text hover:bg-rail-card transition-colors"
              title="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-xs font-semibold text-rail-muted">
          Navigation
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => onCloseMobile?.()}
            className={({ isActive }) =>
              `group relative flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition-all duration-150 border ${
                isActive
                  ? 'bg-rail-card text-rail-text border-rail-borderLight'
                  : 'text-rail-muted hover:text-rail-text hover:bg-rail-cardHover/60 border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Accent Line */}
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-rail-ai rounded-r" />
                )}

                <div className="flex items-center gap-3">
                  <item.icon
                    className={`h-5 w-5 transition-colors ${
                      isActive
                        ? 'text-rail-ai'
                        : 'text-rail-muted group-hover:text-rail-text'
                    }`}
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-sm leading-tight">{item.name}</span>
                    <span className="text-[11px] text-rail-muted leading-tight font-normal hidden lg:block">
                      {item.description.split('&')[0]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-rail-ai" />
                  )}
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User / Controller Footer Profile */}
      <div className="p-3.5 border-t border-rail-border bg-rail-card/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-rail-raised border border-rail-borderLight flex items-center justify-center font-bold text-xs text-rail-ai">
              CP
            </div>
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-rail-emerald ring-2 ring-rail-dark" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-rail-text">Chief Planner</span>
            <span className="text-[11px] text-rail-muted">Corridor Controller</span>
          </div>
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-rail-subtle border border-rail-border text-rail-muted">
          Delhi Div
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (hidden on small screens, flex on md and up) */}
      <aside className="hidden md:flex h-screen shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          <div 
            className="fixed inset-0 bg-black/75"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 flex h-full animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

