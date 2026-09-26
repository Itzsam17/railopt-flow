import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DemoTourStep } from '../types/demo';

export const DEMO_TOUR_STEPS: DemoTourStep[] = [
  {
    stepNumber: 1,
    title: 'Command Center & Network Topology',
    subtitle: 'Integrated Overview & Asset Availability Baseline',
    route: '/dashboard',
    narratorScript: 'Welcome to RailOpt Flow. We begin at the Railway Operations Command Center for Northern Railway Delhi Division. Notice the 94.7% baseline Asset Availability and the interactive network topology map tracking 8 tracks across 3 high-density corridors.',
    keyHighlight: 'Asset Availability 94.7% · 8 Tracks Active · 30 Trains in Corridor',
    durationSeconds: 9,
    badge: 'Step 1 of 10 · Command Center',
  },
  {
    stepNumber: 2,
    title: 'Multi-Departmental Maintenance Backlog',
    subtitle: 'Coordinated Scheduling Workspace',
    route: '/block-planning',
    narratorScript: 'Here in the Block Planning Workspace, we observe 20 pending work orders filed independently by Engineering (tamping/rail welding), S&T (electronic interlocking), and Electrical (OHE catenary). Historically, lack of inter-departmental visibility caused massive corridor gridlock.',
    keyHighlight: '20 Independent Work Orders · Engineering + S&T + Electrical Backlog',
    durationSeconds: 9,
    badge: 'Step 2 of 10 · Work Orders',
  },
  {
    stepNumber: 3,
    title: 'Automated Conflict Detection Radar',
    subtitle: 'Intelligent Timetable Clash Identification',
    route: '/conflict-center',
    narratorScript: 'RailOpt Flow automatically flags 4 critical operational conflicts. For example, on Track T-104, an S&T point machine overhaul overlaps directly with the peak transit window of Train 12424 (Dibrugarh Rajdhani Express), threatening severe passenger delays.',
    keyHighlight: '4 Active Clashes · Rajdhani & Vande Bharat Route Collision Prevention',
    durationSeconds: 9,
    badge: 'Step 3 of 10 · Conflict Radar',
  },
  {
    stepNumber: 4,
    title: 'Cross-Department AI Bundling Engine',
    subtitle: 'Simultaneous Multi-Discipline Possessions',
    route: '/block-planning',
    narratorScript: 'With one click on "Generate Optimized Plan", the RailOpt AI engine calculates track geometries, gang constraints, and timetable paths. It bundles co-located requests into synchronized blocks, eliminating duplicate track possessions.',
    keyHighlight: 'Multi-Discipline Bundling · 14 Requests Merged · 4–6s Computation',
    durationSeconds: 8,
    badge: 'Step 4 of 10 · AI Bundling',
  },
  {
    stepNumber: 5,
    title: 'Optimized Unified Gantt Timeline',
    subtitle: 'AI-Generated Coordinated Possession Windows',
    route: '/block-planning',
    narratorScript: 'The timeline displays the optimized schedule: 5 synchronized blocks highlighted in cyan. Track T-101 and T-102 now host simultaneous Engineering, S&T, and OHE maintenance during single curfew windows, saving over 3 hours of net track downtime.',
    keyHighlight: '5 Unified Possession Blocks · 96.5% Scheduling Efficiency Score',
    durationSeconds: 9,
    badge: 'Step 5 of 10 · Gantt Schedule',
  },
  {
    stepNumber: 6,
    title: 'One-Click Automated Conflict Resolution',
    subtitle: 'Timetable Curfew Mitigation',
    route: '/conflict-center',
    narratorScript: 'Returning to the Conflict Center, the planner resolves clashes using "Resolve Automatically". The AI shifts non-critical maintenance to 01:00-04:00 nocturnal curfews and regulates freight paths at yard loops, reducing open conflicts to zero.',
    keyHighlight: 'Zero Passenger Delays · Auto-Mitigation · Timetable Recalibrated',
    durationSeconds: 8,
    badge: 'Step 6 of 10 · Auto-Resolution',
  },
  {
    stepNumber: 7,
    title: 'Quantified Optimization Analytics',
    subtitle: 'Availability Uplift & Disruption Compression',
    route: '/analytics',
    narratorScript: 'The Analytics suite proves tangible ROI: Asset Availability climbs by +2.4% (projected 97.1%), passenger train delay risk drops by 41%, and maintenance throughput jumps by 18%. Every metric links directly to divisional data.',
    keyHighlight: '+2.4% Availability Uplift · -41% Disruption · 5 Real-Time Telemetry Charts',
    durationSeconds: 9,
    badge: 'Step 7 of 10 · Analytics Suite',
  },
  {
    stepNumber: 8,
    title: 'Operational What-If Simulation',
    subtitle: 'Stress-Testing Network Constraints',
    route: '/simulation',
    narratorScript: 'Planners stress-test scenarios using the What-If Simulator. By adjusting block durations from 1.5h to 6.0h, toggling passenger vs freight priority, or simulating monsoonal crew shortages, the deterministic engine instantly projects corridor outcomes.',
    keyHighlight: 'Live Slider Engine · Deterministic Formulas · Instant Scenario Projection',
    durationSeconds: 9,
    badge: 'Step 8 of 10 · Simulation Studio',
  },
  {
    stepNumber: 9,
    title: 'Live Network Operations Telemetry',
    subtitle: 'Real-Time RTIS GPS & Event Stream',
    route: '/live-operations',
    narratorScript: 'Finally, in Live Operations, the execution phase is monitored in real-time. GPS telemetry streams Vande Bharat and freight rake speeds, live possession countdowns, and automated site clearance handovers across Northern Railway.',
    keyHighlight: 'Real-Time Event Stream · RTIS GPS Telemetry · Live Status Counters',
    durationSeconds: 9,
    badge: 'Step 9 of 10 · Live Telemetry',
  },
  {
    stepNumber: 10,
    title: 'Mission Accomplished: RailOpt Flow',
    subtitle: 'Intelligent Railway Operations Platform',
    route: '/dashboard',
    narratorScript: 'RailOpt Flow revolutionizes Indian Railways maintenance: turning siloed departmental possession into a synchronized, predictive, and conflict-free corridor flow. Thank you for viewing the RailOpt Flow presentation!',
    keyHighlight: 'Production-Ready Railway Operations Suite',
    durationSeconds: 10,
    badge: 'Step 10 of 10 · Presentation Complete',
  },
];

interface DemoContextType {
  isDemoActive: boolean;
  currentStepIndex: number;
  currentStep: DemoTourStep;
  isAutoPlaying: boolean;
  secondsRemaining: number;
  totalSteps: number;
  isMinimized: boolean;
  startDemo: () => void;
  stopDemo: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  toggleAutoPlay: () => void;
  toggleMinimized: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(DEMO_TOUR_STEPS[0].durationSeconds);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const currentStep = DEMO_TOUR_STEPS[currentStepIndex];

  // Navigate to step route when step changes
  const applyStep = useCallback((index: number) => {
    const step = DEMO_TOUR_STEPS[index];
    if (step) {
      setCurrentStepIndex(index);
      setSecondsRemaining(step.durationSeconds);
      if (location.pathname !== step.route) {
        navigate(step.route);
      }
    }
  }, [location.pathname, navigate]);

  const startDemo = () => {
    setIsDemoActive(true);
    setIsAutoPlaying(true);
    setIsMinimized(false);
    applyStep(0);
  };

  const stopDemo = () => {
    setIsDemoActive(false);
    setIsAutoPlaying(false);
  };

  const nextStep = useCallback(() => {
    if (currentStepIndex < DEMO_TOUR_STEPS.length - 1) {
      applyStep(currentStepIndex + 1);
    } else {
      stopDemo();
    }
  }, [currentStepIndex, applyStep]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      applyStep(currentStepIndex - 1);
    }
  }, [currentStepIndex, applyStep]);

  const goToStep = (index: number) => {
    if (index >= 0 && index < DEMO_TOUR_STEPS.length) {
      applyStep(index);
    }
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying((prev) => !prev);
  };

  const toggleMinimized = () => {
    setIsMinimized((prev) => !prev);
  };

  // Auto-play timer countdown
  useEffect(() => {
    if (!isDemoActive || !isAutoPlaying) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          nextStep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isDemoActive, isAutoPlaying, nextStep]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (!isDemoActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopDemo();
      } else if (e.key === 'ArrowRight') {
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        prevStep();
      } else if (e.key === ' ') {
        e.preventDefault();
        toggleAutoPlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDemoActive, nextStep, prevStep]);

  return (
    <DemoContext.Provider
      value={{
        isDemoActive,
        currentStepIndex,
        currentStep,
        isAutoPlaying,
        secondsRemaining,
        totalSteps: DEMO_TOUR_STEPS.length,
        isMinimized,
        startDemo,
        stopDemo,
        nextStep,
        prevStep,
        goToStep,
        toggleAutoPlay,
        toggleMinimized,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
