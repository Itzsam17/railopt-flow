import React from 'react';
import { 
  Network, 
  Gauge
} from 'lucide-react';
import { SimulationParams, SimulationMetrics } from '../../types/simulation';

interface SimulationCorridorImpactProps {
  params: SimulationParams;
  simulated: SimulationMetrics;
}

interface SimulatedTrackState {
  id: string;
  name: string;
  corridor: string;
  status: 'optimal' | 'block' | 'restricted' | 'standby';
  maxSpeedKmh: number;
  scheduledWork: string;
  capacityScore: number;
}

export const SimulationCorridorImpact: React.FC<SimulationCorridorImpactProps> = ({
  params,
  simulated,
}) => {
  // Derive simulated track conditions based on parameters
  const tracks: SimulatedTrackState[] = [
    {
      id: '1',
      name: 'T-101',
      corridor: 'NDLS - AGC Mainline',
      status: params.blockDurationHours > 4.0 ? 'block' : 'optimal',
      maxSpeedKmh: params.crewAvailability >= 80 ? 130 : 90,
      scheduledWork: params.bundlingEnabled 
        ? 'Bundled: Tamping (09-3X) + Point Overhaul + Catenary'
        : 'Isolated: Track Tamping only',
      capacityScore: params.bundlingEnabled ? 95 : 78,
    },
    {
      id: '2',
      name: 'T-102',
      corridor: 'NDLS - AGC Loop Fast',
      status: 'block',
      maxSpeedKmh: 110,
      scheduledWork: 'Ballast Cleaning (BCM) Window',
      capacityScore: 82,
    },
    {
      id: '3',
      name: 'T-103',
      corridor: 'AGC South Division',
      status: 'optimal',
      maxSpeedKmh: 130,
      scheduledWork: 'All Clear · Express Throughput Path',
      capacityScore: 98,
    },
    {
      id: '4',
      name: 'T-104',
      corridor: 'AGC Freight Loop',
      status: simulated.conflictsCount > 3 ? 'restricted' : 'optimal',
      maxSpeedKmh: simulated.conflictsCount > 3 ? 45 : 100,
      scheduledWork: simulated.conflictsCount > 3 ? 'Caution: TSR 45 km/h (Interlocking Hold)' : 'Clear: S&T Logic Checked',
      capacityScore: simulated.conflictsCount > 3 ? 54 : 88,
    },
    {
      id: '5',
      name: 'T-201',
      corridor: 'DLI - GZB Up Suburban',
      status: params.trainPriority === 'passenger' ? 'optimal' : 'block',
      maxSpeedKmh: 110,
      scheduledWork: 'Turnout Renewal + Signal Upgrade',
      capacityScore: params.trainPriority === 'passenger' ? 92 : 70,
    },
    {
      id: '6',
      name: 'T-202',
      corridor: 'DLI - GZB Down Suburban',
      status: 'optimal',
      maxSpeedKmh: 110,
      scheduledWork: 'Local EMU Transit Corridors Active',
      capacityScore: 96,
    },
    {
      id: '7',
      name: 'T-301',
      corridor: 'NDLS - TKD Yard Bypass',
      status: params.trainPriority === 'freight' ? 'optimal' : 'restricted',
      maxSpeedKmh: 75,
      scheduledWork: 'Flash Butt Rail Welding + OHE Earthing',
      capacityScore: params.trainPriority === 'freight' ? 88 : 65,
    },
    {
      id: '8',
      name: 'T-302',
      corridor: 'TKD DFC Freight Link',
      status: 'optimal',
      maxSpeedKmh: 100,
      scheduledWork: 'Heavy Haul Freight Path Open',
      capacityScore: 94,
    },
  ];

  // Filter if specific corridor selected
  const filteredTracks = tracks.filter((t) => {
    if (params.corridorFocus === 'ndls-agc') return t.corridor.includes('NDLS - AGC') || t.corridor.includes('AGC');
    if (params.corridorFocus === 'dli-gzb') return t.corridor.includes('DLI - GZB');
    if (params.corridorFocus === 'ndls-tkd') return t.corridor.includes('NDLS - TKD') || t.corridor.includes('TKD');
    return true;
  });

  return (
    <div className="rounded-2xl border border-rail-border bg-rail-card p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rail-border pb-3">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-rail-ai" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-rail-text font-mono">
            Simulated Corridor Asset & Track Status Impact
          </h4>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-rail-muted">
          <span className="flex items-center gap-1.5 text-rail-emerald">
            <span className="h-2 w-2 rounded-full bg-rail-emerald" /> Optimal Flow
          </span>
          <span className="flex items-center gap-1.5 text-rail-ai">
            <span className="h-2 w-2 rounded-full bg-rail-ai" /> Active Possession
          </span>
          <span className="flex items-center gap-1.5 text-rail-amber">
            <span className="h-2 w-2 rounded-full bg-rail-amber" /> Restricted / TSR
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredTracks.map((track) => {
          const isOptimal = track.status === 'optimal';
          const isBlock = track.status === 'block';

          return (
            <div
              key={track.id}
              className={`p-3.5 rounded-xl border transition-all duration-200 ${
                isOptimal
                  ? 'border-rail-emerald/30 bg-rail-emerald/5 hover:border-rail-emerald/50'
                  : isBlock
                  ? 'border-rail-ai/40 bg-rail-ai/10 hover:border-rail-ai/60'
                  : 'border-rail-amber/40 bg-rail-amber/10 hover:border-rail-amber/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-mono text-rail-text">
                    {track.name}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                    isOptimal
                      ? 'border-rail-emerald/40 text-rail-emerald'
                      : isBlock
                      ? 'border-rail-ai/40 text-rail-ai'
                      : 'border-rail-amber/40 text-rail-amber'
                  }`}>
                    {isOptimal ? 'Available' : isBlock ? 'Block Window' : 'Speed Restr.'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-rail-muted">
                  <Gauge className="h-3 w-3 text-rail-muted" />
                  <span>{track.maxSpeedKmh} km/h</span>
                </div>
              </div>

              <div className="text-[11px] text-rail-muted font-mono mb-2">
                {track.corridor}
              </div>

              <div className="text-[11px] text-rail-text bg-rail-base p-2 rounded-lg border border-rail-border leading-snug line-clamp-2">
                {track.scheduledWork}
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-rail-muted">
                <span>Capacity Yield</span>
                <span className={`font-bold ${
                  track.capacityScore >= 90 ? 'text-rail-emerald' : track.capacityScore >= 75 ? 'text-rail-ai' : 'text-rail-amber'
                }`}>
                  {track.capacityScore}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
