import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface DataPoint {
  day: string;
  manual: number;
  ai: number;
}

export const AvailabilityTrendChart: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data: DataPoint[] = [
    { day: 'Mon', manual: 92.4, ai: 94.2 },
    { day: 'Tue', manual: 93.1, ai: 95.0 },
    { day: 'Wed', manual: 92.8, ai: 95.4 },
    { day: 'Thu', manual: 94.0, ai: 95.8 },
    { day: 'Fri', manual: 93.5, ai: 95.9 },
    { day: 'Sat', manual: 94.1, ai: 96.1 },
    { day: 'Sun', manual: 94.7, ai: 96.2 },
  ];

  // SVG coordinate calculations (600 x 240)
  const width = 600;
  const height = 240;
  const paddingX = 45;
  const paddingY = 35;

  const minVal = 91.0;
  const maxVal = 97.0;

  const getX = (idx: number) => paddingX + (idx / (data.length - 1)) * (width - 2 * paddingX);
  const getY = (val: number) => height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);

  // Create smooth curved SVG path
  const makeSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const aiCoords = data.map((d, i) => ({ x: getX(i), y: getY(d.ai) }));
  const manualCoords = data.map((d, i) => ({ x: getX(i), y: getY(d.manual) }));

  const aiPath = makeSmoothPath(aiCoords);
  const manualPath = makeSmoothPath(manualCoords);

  // Area under AI curve
  const aiAreaPath = `${aiPath} L ${getX(data.length - 1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`;

  return (
    <div className="rounded-2xl border border-rail-border bg-rail-card p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-rail-ai flex items-center gap-1.5">
            Availability Trend (Target: 96.2%)
          </span>
          <h3 className="text-base font-bold text-rail-text tracking-tight mt-0.5">
            Asset Availability Trend
          </h3>
          <p className="text-xs text-rail-muted">
            Manual baseline vs RailOpt Flow AI target over 7-day cycle
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-sm bg-[#8A8F98]" />
            <span className="text-rail-muted">Manual (Baseline)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-3 rounded-sm bg-rail-ai" />
            <span className="text-rail-ai font-medium">RailOpt Flow</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="mt-4 relative select-none">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Minimal Gridlines */}
          {[92, 94, 96].map((tick) => {
            const y = getY(tick);
            return (
              <g key={`tick-${tick}`}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#2E343D"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  fill="#8A8F98"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          {/* Target 96.2% Guideline */}
          <line
            x1={paddingX}
            y1={getY(96.2)}
            x2={width - paddingX}
            y2={getY(96.2)}
            stroke="#4F9A6E"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
          <text
            x={width - paddingX + 6}
            y={getY(96.2) + 3}
            fill="#4F9A6E"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Target 96.2%
          </text>

          {/* AI Area Flat Fill */}
          <path d={aiAreaPath} fill="rgba(91, 127, 166, 0.08)" />

          {/* Manual Baseline Curve */}
          <path
            d={manualPath}
            fill="none"
            stroke="#8A8F98"
            strokeWidth="2"
            strokeDasharray="5 3"
          />

          {/* AI Optimized Curve */}
          <path
            d={aiPath}
            fill="none"
            stroke="#5B7FA6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Data Points & Interactive Hitboxes */}
          {data.map((d, idx) => {
            const x = getX(idx);
            const yManual = getY(d.manual);
            const yAi = getY(d.ai);
            const isHovered = hoveredIndex === idx;

            return (
              <g key={`points-${d.day}`}>
                {/* Manual Point Dot */}
                <circle cx={x} cy={yManual} r="3" fill="#8A8F98" />

                {/* AI Point Dot */}
                <circle
                  cx={x}
                  cy={yAi}
                  r={isHovered ? 5 : 3.5}
                  fill="#14171C"
                  stroke="#5B7FA6"
                  strokeWidth={isHovered ? 2.5 : 2}
                  className="transition-all duration-150"
                />

                {/* Day Label on X Axis */}
                <text
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  fill={isHovered ? '#E8E6DF' : '#8A8F98'}
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  {d.day}
                </text>

                {/* Invisible Vertical Hitbox */}
                <rect
                  x={x - 25}
                  y={paddingY}
                  width="50"
                  height={height - 2 * paddingY}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                {/* Hover Tooltip Box */}
                {isHovered && (
                  <g transform={`translate(${x}, ${yAi - 45})`}>
                    <rect
                      x="-55"
                      y="0"
                      width="110"
                      height="36"
                      rx="4"
                      fill="#1B1F26"
                      stroke="#2E343D"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="15"
                      textAnchor="middle"
                      fill="#5B7FA6"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      AI: {d.ai}% (+{(d.ai - d.manual).toFixed(1)}%)
                    </text>
                    <text
                      x="0"
                      y="28"
                      textAnchor="middle"
                      fill="#8A8F98"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      Manual: {d.manual}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Insight */}
      <div className="mt-3 pt-3 border-t border-rail-border flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-rail-emerald">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>+2.4% Net Corridor Uptime Gain Achieved</span>
        </div>
        <span className="text-rail-muted">Baseline 94.7% → Target 96.2%</span>
      </div>
    </div>
  );
};
