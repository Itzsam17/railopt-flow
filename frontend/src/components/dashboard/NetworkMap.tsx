import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Network, 
  Train, 
  Wrench, 
  AlertTriangle, 
  ExternalLink, 
  Compass,
  Filter,
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react';
import { CorridorTrack, TrackStatus } from '../../types/api';

interface NetworkMapProps {
  tracks: CorridorTrack[];
}

interface StationNode {
  code: string;
  name: string;
  x: number;
  y: number;
  isJunction?: boolean;
}

interface TrackRouteGeometry {
  trackName: string;
  corridorName: string;
  startStation: string;
  endStation: string;
  pathD: string;
  labelX: number;
  labelY: number;
}

export const NetworkMap: React.FC<NetworkMapProps> = ({ tracks }) => {
  const navigate = useNavigate();
  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);
  const [hoveredTrackId, setHoveredTrackId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [corridorFilter, setCorridorFilter] = useState<string>('all');

  // Realistic station layout for Northern Railway Delhi Division (960 x 440 coordinate space)
  const stations: StationNode[] = [
    // Central Hub
    { code: 'NDLS', name: 'New Delhi Central', x: 260, y: 190, isJunction: true },
    
    // Corridor 2 (Upper North-East: DLI - GZB)
    { code: 'DLI', name: 'Old Delhi Jn', x: 200, y: 110, isJunction: true },
    { code: 'ANVT', name: 'Anand Vihar', x: 380, y: 120 },
    { code: 'GZB', name: 'Ghaziabad Jn', x: 530, y: 110, isJunction: true },

    // Corridor 3 (East: NDLS - CNB via Aligarh)
    { code: 'DER', name: 'Dadri Jn', x: 490, y: 220 },
    { code: 'ALJN', name: 'Aligarh Jn', x: 680, y: 240, isJunction: true },
    { code: 'CNB', name: 'Kanpur Central', x: 860, y: 260, isJunction: true },

    // Corridor 1 (South: NDLS - AGC via Mathura)
    { code: 'FDB', name: 'Faridabad', x: 290, y: 270 },
    { code: 'PWL', name: 'Palwal', x: 340, y: 340 },
    { code: 'MTJ', name: 'Mathura Jn', x: 440, y: 390, isJunction: true },
    { code: 'AGC', name: 'Agra Cantt', x: 580, y: 400, isJunction: true },
  ];

  // Geometries for the 8 tracks across 3 corridors
  const trackGeometries: TrackRouteGeometry[] = [
    // Corridor 1: NDLS - AGC
    {
      trackName: 'T-101',
      corridorName: 'NDLS - AGC (Delhi-Palwal Up Main)',
      startStation: 'NDLS',
      endStation: 'PWL',
      pathD: 'M 260 190 Q 275 230 290 270 T 340 340',
      labelX: 295,
      labelY: 250,
    },
    {
      trackName: 'T-102',
      corridorName: 'NDLS - AGC (Palwal-Mathura Down)',
      startStation: 'PWL',
      endStation: 'MTJ',
      pathD: 'M 340 340 Q 390 365 440 390',
      labelX: 390,
      labelY: 360,
    },
    {
      trackName: 'T-103',
      corridorName: 'NDLS - AGC (Mathura-Agra Up Main)',
      startStation: 'MTJ',
      endStation: 'AGC',
      pathD: 'M 440 390 Q 510 395 580 400',
      labelX: 510,
      labelY: 415,
    },
    {
      trackName: 'T-104',
      corridorName: 'NDLS - AGC (Agra High-Speed Chord)',
      startStation: 'FDB',
      endStation: 'AGC',
      pathD: 'M 290 270 C 370 290, 480 340, 580 400',
      labelX: 430,
      labelY: 315,
    },

    // Corridor 2: DLI - GZB
    {
      trackName: 'T-201',
      corridorName: 'DLI - GZB (Main Line 1)',
      startStation: 'DLI',
      endStation: 'GZB',
      pathD: 'M 200 110 Q 365 95 530 110',
      labelX: 365,
      labelY: 90,
    },
    {
      trackName: 'T-202',
      corridorName: 'DLI - GZB (Suburban Link via ANVT)',
      startStation: 'NDLS',
      endStation: 'GZB',
      pathD: 'M 260 190 Q 380 120 530 110',
      labelX: 385,
      labelY: 155,
    },

    // Corridor 3: NDLS - CNB
    {
      trackName: 'T-301',
      corridorName: 'NDLS - CNB (Express Line to Aligarh)',
      startStation: 'NDLS',
      endStation: 'ALJN',
      pathD: 'M 260 190 Q 470 205 680 240',
      labelX: 470,
      labelY: 200,
    },
    {
      trackName: 'T-302',
      corridorName: 'NDLS - CNB (Freight & Passenger Trunk)',
      startStation: 'ALJN',
      endStation: 'CNB',
      pathD: 'M 680 240 Q 770 250 860 260',
      labelX: 770,
      labelY: 240,
    },
  ];

  // Physical signal lamp colors on matte surfaces
  const statusStyles: Record<TrackStatus, { stroke: string; text: string; label: string; badgeBg: string }> = {
    available: {
      stroke: '#4F9A6E', // Signal Green (muted)
      text: 'text-rail-emerald',
      label: 'Available',
      badgeBg: 'bg-rail-emerald/15 border-rail-emerald/30 text-rail-emerald',
    },
    block: {
      stroke: '#5B7FA6', // Steel Blue (muted AI interactive)
      text: 'text-rail-ai',
      label: 'AI-Coordinated Block',
      badgeBg: 'bg-rail-ai/15 border-rail-ai/30 text-rail-ai',
    },
    maintenance: {
      stroke: '#C99A3B', // Signal Amber (muted)
      text: 'text-rail-amber',
      label: 'Maintenance Active',
      badgeBg: 'bg-rail-amber/15 border-rail-amber/30 text-rail-amber',
    },
    conflict: {
      stroke: '#B4453F', // Signal Red (muted)
      text: 'text-rail-red',
      label: 'Conflict Detected',
      badgeBg: 'bg-rail-red/15 border-rail-red/30 text-rail-red',
    },
    unavailable: {
      stroke: '#2E343D', // Graphite Line
      text: 'text-rail-muted',
      label: 'Unavailable',
      badgeBg: 'bg-rail-card border-rail-border text-rail-muted',
    },
  };


  // Merge track live data with geometry
  const tracksWithGeo = trackGeometries.map((geo) => {
    const data = tracks.find((t) => t.name === geo.trackName) || {
      id: Math.floor(Math.random() * 1000),
      name: geo.trackName,
      zone: 'Northern Railway',
      division: 'DLI',
      current_status: 'available' as TrackStatus,
      active_trains_count: 2,
      pending_maintenance_count: 1,
      active_conflicts_count: 0,
    };
    return { ...geo, ...data };
  });

  // Filter tracks
  const filteredTracks = tracksWithGeo.filter((track) => {
    if (statusFilter !== 'all' && track.current_status !== statusFilter) return false;
    if (corridorFilter !== 'all' && !track.corridorName.includes(corridorFilter)) return false;
    return true;
  });

  const activeTrack = tracksWithGeo.find((t) => t.id === (hoveredTrackId ?? selectedTrackId)) || tracksWithGeo[3]; // default to T-104 (conflict) for dramatic demo inspection

  return (
    <div className="rounded-2xl border border-rail-border bg-rail-card overflow-hidden">
      {/* Map Control Toolbar */}
      <div className="p-4 border-b border-rail-border bg-rail-base flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-rail-raised border border-rail-border flex items-center justify-center text-rail-ai">
            <Network className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-rail-text tracking-wide">
                Delhi Division Network Topology Map
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rail-base text-rail-muted border border-rail-border">
                Live Status Canvas
              </span>
            </div>
            <p className="text-xs text-rail-muted">
              Northern Railway · 3 Corridors · 8 Monitored Tracks · Live Status Overlay
            </p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Chips */}
          <div className="flex items-center bg-rail-base p-1 rounded-lg border border-rail-border text-xs font-mono">
            <span className="text-rail-muted px-2 py-1 text-[11px] flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Status:
            </span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                statusFilter === 'all'
                  ? 'bg-rail-raised text-rail-text font-medium'
                  : 'text-rail-muted hover:text-rail-text'
              }`}
            >
              All (8)
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                statusFilter === 'available'
                  ? 'bg-rail-emerald/20 text-rail-emerald border border-rail-emerald/30 font-medium'
                  : 'text-slate-400 hover:text-rail-emerald'
              }`}
            >
              Available (4)
            </button>
            <button
              onClick={() => setStatusFilter('block')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                statusFilter === 'block'
                  ? 'bg-rail-ai/20 text-rail-ai border border-rail-ai/30 font-medium'
                  : 'text-rail-muted hover:text-rail-ai'
              }`}
            >
              AI Block (1)
            </button>
            <button
              onClick={() => setStatusFilter('maintenance')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                statusFilter === 'maintenance'
                  ? 'bg-rail-amber/20 text-rail-amber border border-rail-amber/30 font-medium'
                  : 'text-slate-400 hover:text-rail-amber'
              }`}
            >
              Maintenance (1)
            </button>
            <button
              onClick={() => setStatusFilter('conflict')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                statusFilter === 'conflict'
                  ? 'bg-rail-red/20 text-rail-red border border-rail-red/30 font-medium'
                  : 'text-slate-400 hover:text-rail-red'
              }`}
            >
              Conflict (2)
            </button>
          </div>

          {/* Corridor Dropdown Selector */}
          <select
            value={corridorFilter}
            onChange={(e) => setCorridorFilter(e.target.value)}
            className="bg-rail-dark border border-rail-border text-xs rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-rail-ai"
          >
            <option value="all">All 3 Corridors</option>
            <option value="NDLS - AGC">NDLS - AGC (Delhi-Agra)</option>
            <option value="DLI - GZB">DLI - GZB (Delhi-Ghaziabad)</option>
            <option value="NDLS - CNB">NDLS - CNB (Delhi-Kanpur)</option>
          </select>
        </div>
      </div>

      {/* Main Canvas & Inspector Split View */}
      <div className="grid grid-cols-1 xl:grid-cols-12 relative">
        {/* SVG Interactive Map (8 cols on XL) */}
        <div className="xl:col-span-8 p-4 bg-[#14171C] relative overflow-hidden flex items-center justify-center min-h-[440px]">
          {/* Subtle Radar/Grid Background */}
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[340px] w-[340px] rounded-full border border-rail-border/40 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[540px] w-[540px] rounded-full border border-rail-border/20 pointer-events-none" />

          <svg
            viewBox="0 0 960 440"
            className="w-full h-auto max-h-[420px] select-none z-10"
          >
            {/* Inactive Background Track Footprints (Flat Matte Steel) */}
            {trackGeometries.map((t) => (
              <path
                key={`bg-${t.trackName}`}
                d={t.pathD}
                fill="none"
                stroke="#21262E"
                strokeWidth="8"
                strokeLinecap="round"
              />
            ))}

            {/* Active Colored Tracks (Physical Signal Lines, Crisp & Flat) */}
            {filteredTracks.map((t) => {
              const style = statusStyles[t.current_status];
              const isSelected = selectedTrackId === t.id;
              const isHovered = hoveredTrackId === t.id;

              return (
                <g key={`track-group-${t.trackName}`}>
                  {/* Invisible wide hitbox for easy mouse hover */}
                  <path
                    d={t.pathD}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="24"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredTrackId(t.id)}
                    onMouseLeave={() => setHoveredTrackId(null)}
                    onClick={() => setSelectedTrackId(t.id)}
                  />

                  {/* Rendered Track Stroke */}
                  <path
                    d={t.pathD}
                    fill="none"
                    stroke={style.stroke}
                    strokeWidth={isSelected || isHovered ? 4.5 : 3.0}
                    strokeLinecap="round"
                    strokeDasharray={t.current_status === 'block' ? '8 4' : undefined}
                    className="transition-all duration-200 cursor-pointer pointer-events-none"
                    style={{
                      strokeOpacity: isHovered || isSelected ? 1 : 0.9,
                    }}
                  />

                  {/* Track Label Badge */}
                  <g
                    transform={`translate(${t.labelX}, ${t.labelY})`}
                    className="cursor-pointer"
                    onClick={() => setSelectedTrackId(t.id)}
                    onMouseEnter={() => setHoveredTrackId(t.id)}
                    onMouseLeave={() => setHoveredTrackId(null)}
                  >
                    <rect
                      x="-24"
                      y="-11"
                      width="48"
                      height="22"
                      rx="3"
                      fill="#1B1F26"
                      stroke={style.stroke}
                      strokeWidth={isSelected || isHovered ? 1.5 : 1}
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill="#E8E6DF"
                    >
                      {t.name}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Station Nodes */}
            {stations.map((s) => (
              <g key={`station-${s.code}`} transform={`translate(${s.x}, ${s.y})`}>
                {/* Station Node Outer Ring */}
                {s.isJunction && (
                  <circle
                    r="12"
                    fill="none"
                    stroke="#5B7FA6"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    className="opacity-70"
                  />
                )}
                {/* Station Core Pin */}
                <circle
                  r={s.isJunction ? 6 : 4.5}
                  fill={s.isJunction ? '#14171C' : '#1B1F26'}
                  stroke={s.isJunction ? '#5B7FA6' : '#8A8F98'}
                  strokeWidth={s.isJunction ? 2 : 1.5}
                />

                {/* Station Label */}
                <text
                  x="0"
                  y={s.y > 220 ? 18 : -12}
                  textAnchor="middle"
                  fill="#E8E6DF"
                  fontSize={s.isJunction ? 10.5 : 9}
                  fontWeight={s.isJunction ? 'bold' : '500'}
                  fontFamily="sans-serif"
                  letterSpacing="0.05em"
                  className="pointer-events-none"
                >
                  {s.code}
                </text>
                <text
                  x="0"
                  y={s.y > 220 ? 28 : -22}
                  textAnchor="middle"
                  fill="#8A8F98"
                  fontSize="7.5"
                  fontFamily="sans-serif"
                  className="pointer-events-none"
                >
                  {s.name}
                </text>
              </g>
            ))}
          </svg>

          {/* Compass Rose Accent */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[10px] font-mono text-rail-muted bg-rail-dark px-2 py-1 rounded border border-rail-border pointer-events-none">
            <Compass className="h-3 w-3 text-rail-ai" />
            <span>NR · DLI TOPOLOGY</span>
          </div>
        </div>


        {/* Hover / Selected Track Info Panel (4 cols on XL) */}
        <div className="xl:col-span-4 p-5 bg-rail-subtle/80 border-t xl:border-t-0 xl:border-l border-rail-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-rail-muted">
                Track Inspector
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${
                  statusStyles[activeTrack.current_status].badgeBg
                }`}
              >
                {statusStyles[activeTrack.current_status].label}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg text-white border"
                style={{
                  backgroundColor: `${statusStyles[activeTrack.current_status].stroke}20`,
                  borderColor: statusStyles[activeTrack.current_status].stroke,
                }}
              >
                {activeTrack.name}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {activeTrack.corridorName}
                </h4>
                <p className="text-xs text-rail-muted">
                  {activeTrack.zone} · {activeTrack.division} Division
                </p>
              </div>
            </div>

            {/* Dynamic Status Banner */}
            <div className="mt-4 p-3 rounded-xl bg-rail-card border border-rail-border">
              {activeTrack.current_status === 'conflict' ? (
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-rail-red shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-rail-red block">
                      Active Conflict: T-104 Express Corridor Possession
                    </span>
                    <p className="text-xs text-slate-300 mt-1">
                      Maintenance work order WO-2024-ENG-08 overlaps with scheduled Rajdhani (#12952) movement. 
                      Bundle recommendation available.
                    </p>
                  </div>
                </div>
              ) : activeTrack.current_status === 'block' ? (
                <div className="flex items-start gap-2.5">
                  <Zap className="h-4 w-4 text-rail-ai shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-rail-ai block">
                      AI Coordinated Maintenance Window Active
                    </span>
                    <p className="text-xs text-rail-muted mt-1">
                      3 synchronized work orders (OHE + Track Tamping + Axle Counter) active in single 3.5h window.
                    </p>
                  </div>
                </div>
              ) : activeTrack.current_status === 'maintenance' ? (
                <div className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-rail-amber shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-rail-amber block">
                      Scheduled Department Work In Progress
                    </span>
                    <p className="text-xs text-slate-300 mt-1">
                      Electrical S&T traction overhead wire calibration underway. Cleared at 14:30 IST.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-rail-emerald shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-rail-emerald block">
                      Corridor Operational & Clear
                    </span>
                    <p className="text-xs text-slate-300 mt-1">
                      Track geometry within safety limits. Signal interlocking telemetry nominal.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-rail-dark border border-rail-border">
                <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-mono uppercase">
                  <Train className="h-3 w-3 text-rail-ai" />
                  <span>Trains</span>
                </div>
                <span className="text-sm font-bold text-white font-mono mt-1 block">
                  {activeTrack.active_trains_count} Active
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-rail-dark border border-rail-border">
                <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-mono uppercase">
                  <Wrench className="h-3 w-3 text-rail-amber" />
                  <span>Work Orders</span>
                </div>
                <span className="text-sm font-bold text-white font-mono mt-1 block">
                  {activeTrack.pending_maintenance_count} Pending
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-rail-dark border border-rail-border">
                <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-mono uppercase">
                  <AlertTriangle className="h-3 w-3 text-rail-red" />
                  <span>Conflicts</span>
                </div>
                <span
                  className={`text-sm font-bold font-mono mt-1 block ${
                    activeTrack.active_conflicts_count > 0 ? 'text-rail-red' : 'text-slate-400'
                  }`}
                >
                  {activeTrack.active_conflicts_count}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="mt-6 pt-4 border-t border-rail-border space-y-2">
            {activeTrack.current_status === 'conflict' ? (
              <button
                onClick={() => navigate('/conflict-center')}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rail-red/20 border border-rail-red/40 text-rail-red hover:bg-rail-red/30 transition-colors text-xs font-semibold"
              >
                <span>Resolve in Conflict Center</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/block-planning')}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rail-ai/20 border border-rail-ai/40 text-rail-ai hover:bg-rail-ai/30 transition-colors text-xs font-semibold"
              >
                <span>Open in Block Planning Workspace</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Map Legend Footer */}
      <div className="px-5 py-3 border-t border-rail-border bg-rail-dark flex flex-wrap items-center justify-between text-xs font-mono text-rail-muted">
        <span className="font-semibold text-rail-text">STATUS LEGEND:</span>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rail-emerald inline-block" />
            <span>Available / Open</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rail-ai inline-block" />
            <span>AI Coordinated Block</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rail-amber inline-block" />
            <span>Maintenance Possession</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rail-red inline-block" />
            <span>Critical Conflict</span>
          </div>
        </div>
      </div>
    </div>
  );
};

