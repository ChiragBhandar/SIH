"use client";

import * as React from "react";
import { Sparkles, Calendar, TrendingUp, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

export interface ForecastPoint {
  period: string; // e.g., "W1", "W2", "W3", "W4"
  label: string; // e.g., "Week 1 (Oct 1 - Oct 7)"
  predictedKg: number;
  minKg: number;
  maxKg: number;
  bloomFlora: string;
  weatherOutlook: string;
  notes: string;
}

export interface ForecastDataset {
  id: string;
  apiaryName: string;
  totalPredictedKg: number;
  expectedMinKg: number;
  expectedMaxKg: number;
  confidencePercent: number;
  momGrowthPercent: number;
  recommendationTitle: string;
  recommendationText: string;
  points: ForecastPoint[];
}

const FORECAST_DATASETS: Record<string, ForecastDataset> = {
  all: {
    id: "all",
    apiaryName: "All Apiary Yards",
    totalPredictedKg: 312,
    expectedMinKg: 288,
    expectedMaxKg: 334,
    confidencePercent: 87,
    momGrowthPercent: 11,
    recommendationTitle: "Strong nectar window ahead.",
    recommendationText:
      "Acacia bloom and stable night temperatures support above-baseline collection. Inspect Hive 12 before adding a super.",
    points: [
      {
        period: "W1",
        label: "Week 1 (Oct 1 - 7)",
        predictedKg: 64,
        minKg: 58,
        maxKg: 70,
        bloomFlora: "Early Wild Thyme & Clover",
        weatherOutlook: "Mild, 22°C daytime",
        notes: "Colonies transitioning to late-autumn brood cycle.",
      },
      {
        period: "W2",
        label: "Week 2 (Oct 8 - 14)",
        predictedKg: 78,
        minKg: 71,
        maxKg: 85,
        bloomFlora: "Peak White Clover bloom",
        weatherOutlook: "Sunny, optimal flight hours",
        notes: "High nectar flow expected in Chamoli region.",
      },
      {
        period: "W3",
        label: "Week 3 (Oct 15 - 21)",
        predictedKg: 89,
        minKg: 82,
        maxKg: 95,
        bloomFlora: "Highland Wild Acacia & Clover",
        weatherOutlook: "Stable 20°C, low wind",
        notes: "Peak extraction window for high-purity batch.",
      },
      {
        period: "W4",
        label: "Week 4 (Oct 22 - 31)",
        predictedKg: 81,
        minKg: 77,
        maxKg: 84,
        bloomFlora: "Late Mountain Blossom",
        weatherOutlook: "Cooler evenings, 15°C",
        notes: "Tapering flow; prepare frames for final harvest.",
      },
    ],
  },
  highland: {
    id: "highland",
    apiaryName: "Highland North (Chamoli)",
    totalPredictedKg: 195,
    expectedMinKg: 182,
    expectedMaxKg: 210,
    confidencePercent: 91,
    momGrowthPercent: 14,
    recommendationTitle: "Exceptional mountain flora density.",
    recommendationText:
      "Elevation 1,850m shows pristine moisture levels. Hive 02 and 08 are nearing full super capacity.",
    points: [
      {
        period: "W1",
        label: "Week 1 (Oct 1 - 7)",
        predictedKg: 40,
        minKg: 36,
        maxKg: 44,
        bloomFlora: "Highland Wild Thyme",
        weatherOutlook: "Crisp mountain air, 19°C",
        notes: "Worker bee forage activity above baseline.",
      },
      {
        period: "W2",
        label: "Week 2 (Oct 8 - 14)",
        predictedKg: 49,
        minKg: 45,
        maxKg: 53,
        bloomFlora: "White Clover & Himalayan Flora",
        weatherOutlook: "Clear skies",
        notes: "Zero pesticide drift recorded in perimeter.",
      },
      {
        period: "W3",
        label: "Week 3 (Oct 15 - 21)",
        predictedKg: 56,
        minKg: 52,
        maxKg: 60,
        bloomFlora: "Full alpine flora bloom",
        weatherOutlook: "Optimal barometric pressure",
        notes: "Anticipated Grade A monofloral classification.",
      },
      {
        period: "W4",
        label: "Week 4 (Oct 22 - 31)",
        predictedKg: 50,
        minKg: 47,
        maxKg: 53,
        bloomFlora: "Late Clover",
        weatherOutlook: "First cold snap expected",
        notes: "Seal honey supers and conduct pre-winter check.",
      },
    ],
  },
  valley: {
    id: "valley",
    apiaryName: "Valley South (Kullu)",
    totalPredictedKg: 117,
    expectedMinKg: 106,
    expectedMaxKg: 124,
    confidencePercent: 84,
    momGrowthPercent: 8,
    recommendationTitle: "Apple orchard cover crop flow active.",
    recommendationText:
      "Mustard and secondary wild flowers providing steady nectar. Ensure mite traps remain clear.",
    points: [
      {
        period: "W1",
        label: "Week 1 (Oct 1 - 7)",
        predictedKg: 24,
        minKg: 22,
        maxKg: 26,
        bloomFlora: "Wild Mustard & Meadow Flora",
        weatherOutlook: "Sunny, 24°C",
        notes: "Good pollen collection in brood frames.",
      },
      {
        period: "W2",
        label: "Week 2 (Oct 8 - 14)",
        predictedKg: 29,
        minKg: 26,
        maxKg: 32,
        bloomFlora: "Late Orchard Blossom",
        weatherOutlook: "Mild humidity, 55%",
        notes: "Colony weight increasing at 0.9kg/day.",
      },
      {
        period: "W3",
        label: "Week 3 (Oct 15 - 21)",
        predictedKg: 33,
        minKg: 30,
        maxKg: 35,
        bloomFlora: "Wild Meadow Nectar",
        weatherOutlook: "Scattered clouds",
        notes: "Ready for partial extraction cycle.",
      },
      {
        period: "W4",
        label: "Week 4 (Oct 22 - 31)",
        predictedKg: 31,
        minKg: 28,
        maxKg: 33,
        bloomFlora: "Residual clover",
        weatherOutlook: "Stable valley temperatures",
        notes: "Consolidate brood boxes for seasonal rest.",
      },
    ],
  },
};

/**
 * Builds smooth cubic bezier curve SVG string from an array of 2D points.
 */
function buildSmoothSvgPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) * 0.18;
    const cp1y = p1.y + (p2.y - p0.y) * 0.18;
    const cp2x = p2.x - (p3.x - p1.x) * 0.18;
    const cp2y = p2.y - (p3.y - p1.y) * 0.18;

    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return path;
}

export function YieldForecastChart() {
  const { isHindi } = useLanguage();
  const [activeApiaryKey, setActiveApiaryKey] = React.useState<string>("all");
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const dataset = FORECAST_DATASETS[activeApiaryKey] || FORECAST_DATASETS.all;
  const points = dataset.points;

  // Chart coordinate mapping
  const width = 540;
  const height = 150;
  const paddingX = 35;
  const paddingTop = 25;
  const paddingBottom = 25;

  // Compute scale
  const values = points.map((p) => p.predictedKg);
  const minVal = Math.min(...values) * 0.85;
  const maxVal = Math.max(...values) * 1.15;
  const range = maxVal - minVal || 1;

  const svgCoords = points.map((pt, idx) => {
    const x = paddingX + (idx / (points.length - 1)) * (width - paddingX * 2);
    const normalizedY = (pt.predictedKg - minVal) / range;
    const y = height - paddingBottom - normalizedY * (height - paddingTop - paddingBottom);
    return { x, y, data: pt, index: idx };
  });

  const linePath = buildSmoothSvgPath(svgCoords);
  const areaPath = svgCoords.length > 0
    ? `${linePath} L ${svgCoords[svgCoords.length - 1].x} ${height} L ${svgCoords[0].x} ${height} Z`
    : "";

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;
  const activeCoord = hoveredIndex !== null ? svgCoords[hoveredIndex] : null;

  return (
    <Card className="p-5 border-border/80 bg-card shadow-xs relative overflow-hidden flex flex-col justify-between">
      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            {isHindi ? "एआई-संवर्धित पूर्वानुमान" : "AI-ASSISTED FORECAST"}
          </span>

          <div className="flex items-center gap-2">
            {/* Apiary Filter Selector */}
            <select
              aria-label="Filter Forecast by Apiary"
              value={activeApiaryKey}
              onChange={(e) => {
                setActiveApiaryKey(e.target.value);
                setHoveredIndex(null);
              }}
              className="text-[11px] font-medium bg-muted/50 border border-border/70 rounded-md px-2 py-0.5 text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40"
            >
              <option value="all">{isHindi ? "सभी शालाएं" : "All Apiaries"}</option>
              <option value="highland">{isHindi ? "चमोली शाला" : "Highland North"}</option>
              <option value="valley">{isHindi ? "कुल्लू शाला" : "Valley South"}</option>
            </select>

            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              {dataset.confidencePercent}% {isHindi ? "सटीकता" : "confidence"}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
          {isHindi ? "अक्टूबर उत्पादन दृष्टिकोण" : "October yield outlook"}
        </h3>

        {/* Big Number & Range */}
        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            {activePoint ? activePoint.predictedKg : dataset.totalPredictedKg}
          </div>
          <div className="space-y-0.5">
            <div className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1">
              <span>{isHindi ? "किग्रा अनुमानित उत्पादन" : "kg predicted yield"}</span>
              {activePoint && (
                <Badge variant="outline" className="text-[10px] font-mono py-0 px-1 ml-1 text-amber-600 border-amber-300">
                  {activePoint.period}
                </Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {activePoint
                ? `${isHindi ? "संभावित दायरा" : "Expected range"} ${activePoint.minKg}–${activePoint.maxKg} kg`
                : `${isHindi ? "संभावित दायरा" : "Expected range"} ${dataset.expectedMinKg}–${dataset.expectedMaxKg} kg`}
            </div>
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div className="relative mt-4 w-full select-none">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-32 sm:h-36 overflow-visible"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              {/* Amber Area Gradient */}
              <linearGradient id="amberYieldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>

              {/* Confidence Band Gradient */}
              <linearGradient id="amberGlow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>

            {/* Subtle horizontal grid lines */}
            <line
              x1={paddingX}
              y1={height - paddingBottom}
              x2={width - paddingX}
              y2={height - paddingBottom}
              stroke="currentColor"
              className="text-border/40"
              strokeWidth="1"
            />
            <line
              x1={paddingX}
              y1={paddingTop + (height - paddingTop - paddingBottom) / 2}
              x2={width - paddingX}
              y2={paddingTop + (height - paddingTop - paddingBottom) / 2}
              stroke="currentColor"
              className="text-border/20"
              strokeDasharray="4 4"
              strokeWidth="1"
            />

            {/* Area Fill */}
            <path d={areaPath} fill="url(#amberYieldGradient)" />

            {/* Main Smooth Curve Line */}
            <path
              d={linePath}
              fill="none"
              stroke="url(#amberGlow)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Active Vertical Crosshair Line */}
            {activeCoord && (
              <line
                x1={activeCoord.x}
                y1={paddingTop - 6}
                x2={activeCoord.x}
                y2={height - paddingBottom}
                stroke="#d97706"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                className="opacity-70 animate-in fade-in duration-150"
              />
            )}

            {/* Interactive Data Points */}
            {svgCoords.map((coord, idx) => {
              const isHovered = hoveredIndex === idx;
              return (
                <g
                  key={idx}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onClick={() => setHoveredIndex(isHovered ? null : idx)}
                >
                  {/* Invisible hit target for smooth mobile & desktop scrubbing */}
                  <circle cx={coord.x} cy={coord.y} r="18" fill="transparent" />

                  {/* Outer animated halo ring on hover */}
                  {isHovered && (
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r="9"
                      fill="#f59e0b"
                      opacity="0.3"
                      className="animate-ping"
                    />
                  )}

                  {/* Visible point circle */}
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isHovered ? "5.5" : "4"}
                    fill="#d97706"
                    stroke="#ffffff"
                    strokeWidth={isHovered ? "2.5" : "1.8"}
                    className="transition-all duration-150 drop-shadow-xs"
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Tooltip */}
          {activeCoord && activePoint && (
            <div
              className="absolute z-20 pointer-events-none transition-all duration-150 bg-popover/95 backdrop-blur-md border border-border shadow-md rounded-lg p-2.5 text-xs -translate-x-1/2 -top-1 sm:-top-2 min-w-[170px]"
              style={{
                left: `${(activeCoord.x / width) * 100}%`,
              }}
            >
              <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-1 mb-1.5">
                <span className="font-bold text-foreground">{activePoint.label}</span>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                  {activePoint.predictedKg} kg
                </span>
              </div>
              <div className="space-y-0.5 text-[11px] text-muted-foreground">
                <div className="flex justify-between">
                  <span>{isHindi ? "सीमा" : "Expected"}:</span>
                  <span className="font-mono text-foreground font-medium">
                    {activePoint.minKg} - {activePoint.maxKg} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{isHindi ? "प्रमुख वनस्पति" : "Flora"}:</span>
                  <span className="text-foreground truncate max-w-[100px] text-right">
                    {activePoint.bloomFlora}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* X-Axis Labels */}
          <div className="flex justify-between items-center px-4 sm:px-6 mt-1 text-xs font-semibold text-muted-foreground">
            {points.map((pt, idx) => (
              <button
                key={pt.period}
                type="button"
                onClick={() => setHoveredIndex(hoveredIndex === idx ? null : idx)}
                className={`cursor-pointer transition-colors ${
                  hoveredIndex === idx
                    ? "text-amber-600 dark:text-amber-400 font-bold scale-105"
                    : "hover:text-foreground"
                }`}
              >
                {pt.period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actionable Field Recommendation Card */}
      <div className="mt-4 p-3 rounded-lg border border-emerald-200/80 bg-emerald-50/60 dark:bg-emerald-950/20 dark:border-emerald-800/40 text-xs text-foreground flex items-start gap-2.5 transition-colors">
        <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-[12px] font-medium leading-relaxed">
            <strong className="text-emerald-900 dark:text-emerald-300 font-semibold mr-1">
              {isHindi
                ? activePoint ? `${activePoint.label}: ` : "अमृत प्रवाह की अनुकूल स्थिति:"
                : activePoint ? `${activePoint.label}: ` : dataset.recommendationTitle}
            </strong>
            <span className="text-emerald-950/80 dark:text-emerald-200/80">
              {isHindi
                ? activePoint ? activePoint.notes : "बबूल और तिपतिया घास का खिलना चरम पर है। अतिरिक्त सुपर बॉक्स तैयार रखें।"
                : activePoint ? activePoint.notes : dataset.recommendationText}
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}
