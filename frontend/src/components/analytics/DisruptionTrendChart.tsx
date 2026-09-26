import React, { useState } from 'react';
import { TrendingDown } from 'lucide-react';

interface DisruptionPoint {
  week: string;
  delayMins: number;
}

export const DisruptionTrendChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data: DisruptionPoint[] = [
    { week: 'W1', delayMins: 420 },
    { week: 'W2', delayMins: 385 },
    { week: 'W3', delayMins: 310 },
    { week: 'W4', delayMins: 260 },
    { week: 'W5', delayMins: 215 },
    { week: 'W6', delayMins: 180 },
    { week: 'W7', delayMins: 155 },
    { week: 'W8', delayMins: 145 },
  ];

  // SVG coordinate dimensions (600 x 240)
  const width = 600;
  const height = 240;
  const paddingX = 50;
  const paddingY = 35;

  const minVal = 100;
  const maxVal = 460;

  const getX = (idx: number) => paddingX + (idx / (data.length - 1)) * (width - 2 * paddingX);
  const getY = (val: number) => height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);

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

  const coords = data.map((d, i) => ({ x: getX(i), y: getY(d.delayMins) }));
  const linePath = makeSmoothPath(coords);
  const areaPath = `${linePath} L ${getX(data.length - 1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`;

  return (
    <div className="rounded-2xl border border-rail-border bg-rail-card p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-rail-ai flex items-center gap-1.5">
            Passenger Disruption Reduction
          </span>
          <h3 className="text-base font-bold text-rail-text tracking-tight mt-0.5">
            Train Disruption Reduction Trend
          </h3>
          <p className="text-xs text-rail-muted">
            Daily passenger train delay minutes across Northern Railway (W1 to W8)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-xs font-mono text-rail-muted block">Current Level</span>
            <span className="text-lg font-black text-rail-ai font-sans">145 min/day</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="mt-4 relative select-none">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Minimal Horizontal Gridlines */}
          {[150, 250, 350, 450].map((tick) => {
            const y = getY(tick);
            return (
              <g key={`grid-${tick}`}>
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
                  {tick}m
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="rgba(91, 127, 166, 0.08)" />

          {/* Line Path */}
          <path
            d={linePath}
            fill="none"
            stroke="#5B7FA6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {data.map((d, idx) => {
            const x = getX(idx);
            const y = getY(d.delayMins);
            const isHovered = hoveredIdx === idx;

            return (
              <g key={`disruption-${d.week}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 5 : 3.5}
                  fill="#14171C"
                  stroke="#5B7FA6"
                  strokeWidth={isHovered ? 2.5 : 2}
                  className="transition-all duration-150"
                />

                {/* X Axis Label */}
                <text
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  fill={isHovered ? '#E8E6DF' : '#8A8F98'}
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  {d.week}
                </text>

                {/* Hitbox */}
                <rect
                  x={x - 25}
                  y={paddingY}
                  width="50"
                  height={height - 2 * paddingY}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />

                {/* Hover Tooltip Box */}
                {isHovered && (
                  <g transform={`translate(${x}, ${y - 40})`}>
                    <rect
                      x="-50"
                      y="0"
                      width="100"
                      height="30"
                      rx="4"
                      fill="#1B1F26"
                      stroke="#2E343D"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="19"
                      textAnchor="middle"
                      fill="#E8E6DF"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {d.delayMins} min / day
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Summary */}
      <div className="mt-3 pt-3 border-t border-rail-border flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-rail-emerald">
          <TrendingDown className="h-3.5 w-3.5" />
          <span>−65.4% Cumulative Disruption Drop</span>
        </div>
        <span className="text-rail-muted">420m (W1) → 145m (W8)</span>
      </div>
    </div>
  );
};
