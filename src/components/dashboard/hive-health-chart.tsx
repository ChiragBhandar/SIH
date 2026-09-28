"use client";

import * as React from "react";
import Link from "next/link";
import {
  Thermometer,
  Droplets,
  ArrowRight,
  Activity,
  RefreshCw,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  WifiOff,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

export interface TelemetryPoint {
  time: string; // e.g., "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"
  tempC: number;
  humidity: number;
  acousticHz: number;
  status: "optimal" | "stable" | "warning";
  readingNote: string;
}

const TELEMETRY_SERIES: TelemetryPoint[] = [
  {
    time: "06:00",
    tempC: 33.8,
    humidity: 64,
    acousticHz: 165,
    status: "optimal",
    readingNote: "Dawn pre-forage cluster warming.",
  },
  {
    time: "09:00",
    tempC: 34.2,
    humidity: 62,
    acousticHz: 180,
    status: "optimal",
    readingNote: "Active worker flight departures.",
  },
  {
    time: "12:00",
    tempC: 34.8,
    humidity: 59,
    acousticHz: 195,
    status: "optimal",
    readingNote: "Peak midday nectar return & fanning.",
  },
  {
    time: "15:00",
    tempC: 35.0,
    humidity: 58,
    acousticHz: 190,
    status: "optimal",
    readingNote: "Internal hive cooling fans engaged.",
  },
  {
    time: "18:00",
    tempC: 34.6,
    humidity: 61,
    acousticHz: 175,
    status: "optimal",
    readingNote: "Colony returned; evening nectar curing.",
  },
  {
    time: "21:00",
    tempC: 34.4,
    humidity: 63,
    acousticHz: 168,
    status: "optimal",
    readingNote: "Night moisture reduction in progress.",
  },
];

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

export function HiveHealthChart() {
  const { isHindi } = useLanguage();
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const [metricMode, setMetricMode] = React.useState<"temp" | "acoustic">("temp");
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [showStatusDetails, setShowStatusDetails] = React.useState<"attention" | "offline" | null>(null);

  const points = TELEMETRY_SERIES;

  // Selected or latest reading
  const currentIdx = hoveredIdx !== null ? hoveredIdx : 4; // defaults to 18:00
  const activeReading = points[currentIdx];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // SVG Chart dimensions
  const width = 450;
  const height = 110;
  const paddingX = 25;
  const paddingTop = 20;
  const paddingBottom = 20;

  // Map values according to active metric
  const values = points.map((p) => (metricMode === "temp" ? p.tempC : p.acousticHz));
  const minVal = Math.min(...values) * 0.98;
  const maxVal = Math.max(...values) * 1.02;
  const range = maxVal - minVal || 1;

  const svgCoords = points.map((pt, idx) => {
    const val = metricMode === "temp" ? pt.tempC : pt.acousticHz;
    const x = paddingX + (idx / (points.length - 1)) * (width - paddingX * 2);
    const normalizedY = (val - minVal) / range;
    const y = height - paddingBottom - normalizedY * (height - paddingTop - paddingBottom);
    return { x, y, data: pt, index: idx };
  });

  const linePath = buildSmoothSvgPath(svgCoords);
  const areaPath = svgCoords.length > 0
    ? `${linePath} L ${svgCoords[svgCoords.length - 1].x} ${height} L ${svgCoords[0].x} ${height} Z`
    : "";

  const activeCoord = svgCoords[currentIdx];

  return (
    <Card className="p-5 border-border/80 bg-card shadow-xs relative overflow-hidden flex flex-col justify-between">
      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full bg-emerald-500 ${isRefreshing ? "animate-ping" : "animate-pulse"}`} />
              {isHindi ? "प्रत्यक्ष स्थिति" : "LIVE CONDITIONS"}
            </span>

            {/* Quick Switcher for Metric Mode */}
            <button
              type="button"
              onClick={() => setMetricMode(metricMode === "temp" ? "acoustic" : "temp")}
              className="text-[10px] text-muted-foreground hover:text-foreground font-mono bg-muted/50 hover:bg-muted px-1.5 py-0.5 rounded transition-colors"
              title="Switch between Temperature/Humidity and Acoustic Buzz frequency"
            >
              {metricMode === "temp" ? "IoT Telemetry" : "Colony Hz"}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Refresh IoT Telemetry"
              onClick={handleRefresh}
              className="h-8 w-8 rounded-lg border border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              title={isHindi ? "सेंसर डेटा ताज़ा करें" : "Refresh IoT Telemetry"}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            </button>

            <Link
              href="/hives"
              className="h-8 w-8 rounded-lg border border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              title={isHindi ? "सभी छत्ते देखें" : "View all hives"}
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
          {isHindi ? "छत्ता स्वास्थ्य एवं वायुमंडल" : "Hive health"}
        </h3>

        {/* Two Metric Columns (Brood temp & Humidity) */}
        <div className="mt-3 grid grid-cols-2 gap-4 divide-x divide-border/60">
          {/* Brood Temp Metric */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Thermometer className="h-4 w-4 text-amber-500" />
              <span>{isHindi ? "ब्रूड तापमान" : "Brood temp"}</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              {activeReading.tempC.toFixed(1)}°C
            </div>
            <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {isHindi ? "अनुकूल (34–36°C)" : "Optimal"}
            </div>
          </div>

          {/* Humidity / Acoustic Metric */}
          <div className="pl-4 space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              {metricMode === "temp" ? (
                <>
                  <Droplets className="h-4 w-4 text-amber-500" />
                  <span>{isHindi ? "आर्द्रता" : "Humidity"}</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 text-purple-500" />
                  <span>{isHindi ? "ध्वनि आवृत्ति" : "Colony Buzz"}</span>
                </>
              )}
            </div>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              {metricMode === "temp" ? `${activeReading.humidity}%` : `${activeReading.acousticHz} Hz`}
            </div>
            <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {metricMode === "temp"
                ? isHindi ? "स्थिर" : "Stable"
                : isHindi ? "शांत रानी स्थिति" : "Calm Queen Status"}
            </div>
          </div>
        </div>

        {/* Smooth Telemetry Curve SVG */}
        <div className="relative mt-3 w-full select-none">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-24 sm:h-28 overflow-visible"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <defs>
              {/* Forest Green Gradient Fill */}
              <linearGradient id="forestHealthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#15803d" stopOpacity="0.28" />
                <stop offset="60%" stopColor="#15803d" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#15803d" stopOpacity="0.0" />
              </linearGradient>

              {/* Line Stroke Gradient */}
              <linearGradient id="forestLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#166534" />
                <stop offset="50%" stopColor="#15803d" />
                <stop offset="100%" stopColor="#166534" />
              </linearGradient>
            </defs>

            {/* Subtle horizontal grid lines */}
            <line
              x1={paddingX}
              y1={height - paddingBottom}
              x2={width - paddingX}
              y2={height - paddingBottom}
              stroke="currentColor"
              className="text-border/30"
              strokeWidth="1"
            />

            {/* Area Fill */}
            <path d={areaPath} fill="url(#forestHealthGradient)" />

            {/* Main Smooth Line */}
            <path
              d={linePath}
              fill="none"
              stroke="url(#forestLine)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Active Vertical Crosshair */}
            {activeCoord && hoveredIdx !== null && (
              <line
                x1={activeCoord.x}
                y1={paddingTop - 4}
                x2={activeCoord.x}
                y2={height - paddingBottom}
                stroke="#15803d"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                className="opacity-70 animate-in fade-in duration-150"
              />
            )}

            {/* Interactive Points */}
            {svgCoords.map((coord, idx) => {
              const isSelected = idx === currentIdx;
              return (
                <g
                  key={idx}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onClick={() => setHoveredIdx(idx)}
                >
                  <circle cx={coord.x} cy={coord.y} r="16" fill="transparent" />

                  {isSelected && (
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r="8"
                      fill="#15803d"
                      opacity="0.25"
                      className="animate-ping"
                    />
                  )}

                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isSelected ? "5" : "3.5"}
                    fill="#166534"
                    stroke="#ffffff"
                    strokeWidth={isSelected ? "2.5" : "1.8"}
                    className="transition-all duration-150 drop-shadow-xs"
                  />
                </g>
              );
            })}
          </svg>

          {/* Floating Tooltip during scrub */}
          {hoveredIdx !== null && activeCoord && (
            <div
              className="absolute z-20 pointer-events-none transition-all duration-150 bg-popover/95 backdrop-blur-md border border-border shadow-md rounded-lg p-2 text-xs -translate-x-1/2 -top-2 min-w-[140px]"
              style={{
                left: `${(activeCoord.x / width) * 100}%`,
              }}
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-1 mb-1 font-bold text-foreground">
                <span>{activeReading.time}</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  {activeReading.tempC}°C
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground space-y-0.5">
                <div>{isHindi ? "आर्द्रता" : "Humidity"}: {activeReading.humidity}%</div>
                <div className="text-[10px] text-foreground font-medium truncate">
                  {activeReading.readingNote}
                </div>
              </div>
            </div>
          )}

          {/* X-Axis Timestamps */}
          <div className="flex justify-between items-center px-4 sm:px-6 mt-1 text-xs font-semibold text-muted-foreground">
            {points.map((pt, idx) => (
              <button
                key={pt.time}
                type="button"
                onClick={() => setHoveredIdx(idx)}
                className={`cursor-pointer transition-colors ${
                  idx === currentIdx
                    ? "text-emerald-700 dark:text-emerald-400 font-bold scale-105"
                    : "hover:text-foreground"
                }`}
              >
                {pt.time}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Status Footer (44 healthy • 3 need attention • 1 sensor offline) */}
      <div className="mt-4 pt-3 border-t border-border/50">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
          {/* Healthy count */}
          <Link
            href="/hives"
            className="flex items-center gap-1.5 text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span>44 {isHindi ? "स्वस्थ छत्ते" : "healthy"}</span>
          </Link>

          <span className="text-muted-foreground/40">•</span>

          {/* Attention count with interactive flyout */}
          <button
            type="button"
            onClick={() =>
              setShowStatusDetails(showStatusDetails === "attention" ? null : "attention")
            }
            className="flex items-center gap-1.5 text-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
            <span>3 {isHindi ? "ध्यान आवश्यक" : "need attention"}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>

          <span className="text-muted-foreground/40">•</span>

          {/* Offline count */}
          <button
            type="button"
            onClick={() =>
              setShowStatusDetails(showStatusDetails === "offline" ? null : "offline")
            }
            className="flex items-center gap-1.5 text-foreground hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
          >
            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
            <span>1 {isHindi ? "सेंसर ऑफ़लाइन" : "sensor offline"}</span>
          </button>
        </div>

        {/* Interactive Attention / Offline Drawer Dropdown */}
        {showStatusDetails === "attention" && (
          <div className="mt-2.5 p-2.5 rounded-lg border border-amber-300 bg-amber-50/80 dark:bg-amber-950/40 dark:border-amber-800 text-xs space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between font-bold text-amber-950 dark:text-amber-200">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                {isHindi ? "ध्यान आकर्षित करने वाले छत्ते:" : "Colonies Flagged for Attention:"}
              </span>
              <button
                type="button"
                onClick={() => setShowStatusDetails(null)}
                className="text-[10px] text-amber-800 hover:underline cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1 text-[11px] text-amber-900/90 dark:text-amber-300/90">
              <div className="flex justify-between items-center">
                <span><strong>HIVE-HN-03</strong>: Virgin queen mating check</span>
                <Link href="/hives" className="text-primary hover:underline text-[10px]">Inspect →</Link>
              </div>
              <div className="flex justify-between items-center">
                <span><strong>HIVE-OR-02</strong>: Varroa mite board count due</span>
                <Link href="/hives" className="text-primary hover:underline text-[10px]">Inspect →</Link>
              </div>
              <div className="flex justify-between items-center">
                <span><strong>HIVE-VS-05</strong>: Moisture condensation alert (+4%)</span>
                <Link href="/hives" className="text-primary hover:underline text-[10px]">Inspect →</Link>
              </div>
            </div>
          </div>
        )}

        {showStatusDetails === "offline" && (
          <div className="mt-2.5 p-2.5 rounded-lg border border-rose-300 bg-rose-50/80 dark:bg-rose-950/40 dark:border-rose-800 text-xs space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between font-bold text-rose-950 dark:text-rose-200">
              <span className="flex items-center gap-1.5">
                <WifiOff className="h-3.5 w-3.5 text-rose-600" />
                {isHindi ? "ऑफ़लाइन टेलीमेट्री नोड:" : "Offline Telemetry Sensor:"}
              </span>
              <button
                type="button"
                onClick={() => setShowStatusDetails(null)}
                className="text-[10px] text-rose-800 hover:underline cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-rose-900/90 dark:text-rose-300/90 leading-relaxed">
              <strong>Sensor NFC-9481-OR03</strong> (Oak Ridge Stand #3) battery exhausted. Last pinged 14h ago. Manual inspection recommended.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
