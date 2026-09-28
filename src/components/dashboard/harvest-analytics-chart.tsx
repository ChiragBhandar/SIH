"use client";

import * as React from "react";
import Link from "next/link";
import {
  BarChart3,
  Boxes,
  Wheat,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

interface MonthlyHarvestData {
  month: string;
  monthHi: string;
  totalKg: number;
  batchesCount: number;
  avgMoisture: number; // %
  purityScore: number; // %
  isProjected?: boolean;
  floraBreakdown: {
    name: string;
    kg: number;
    color: string;
  }[];
}

const MONTHLY_HARVEST_DATA: MonthlyHarvestData[] = [
  {
    month: "May",
    monthHi: "मई",
    totalKg: 142.0,
    batchesCount: 2,
    avgMoisture: 18.2,
    purityScore: 98,
    floraBreakdown: [
      { name: "Apple Blossom", kg: 85.0, color: "#f59e0b" },
      { name: "Mustard", kg: 57.0, color: "#fbbf24" },
    ],
  },
  {
    month: "Jun",
    monthHi: "जून",
    totalKg: 198.5,
    batchesCount: 3,
    avgMoisture: 17.8,
    purityScore: 99,
    floraBreakdown: [
      { name: "Himalayan Flora", kg: 120.5, color: "#d97706" },
      { name: "White Clover", kg: 78.0, color: "#10b981" },
    ],
  },
  {
    month: "Jul",
    monthHi: "जुलाई",
    totalKg: 220.0,
    batchesCount: 3,
    avgMoisture: 17.5,
    purityScore: 100,
    floraBreakdown: [
      { name: "Wild Thyme", kg: 135.0, color: "#d97706" },
      { name: "White Clover", kg: 85.0, color: "#10b981" },
    ],
  },
  {
    month: "Aug",
    monthHi: "अगस्त",
    totalKg: 245.8,
    batchesCount: 4,
    avgMoisture: 17.1,
    purityScore: 100,
    floraBreakdown: [
      { name: "Highland Wild", kg: 160.8, color: "#d97706" },
      { name: "Acacia", kg: 85.0, color: "#f59e0b" },
    ],
  },
  {
    month: "Sep",
    monthHi: "सितम्बर",
    totalKg: 281.1,
    batchesCount: 3,
    avgMoisture: 16.9,
    purityScore: 100,
    floraBreakdown: [
      { name: "Wild Multifloral", kg: 185.5, color: "#d97706" },
      { name: "Acacia Nectar", kg: 95.6, color: "#f59e0b" },
    ],
  },
  {
    month: "Oct*",
    monthHi: "अक्टूबर*",
    totalKg: 312.0,
    batchesCount: 4,
    avgMoisture: 17.0,
    purityScore: 99,
    isProjected: true,
    floraBreakdown: [
      { name: "White Clover", kg: 180.0, color: "#10b981" },
      { name: "Late Acacia", kg: 132.0, color: "#f59e0b" },
    ],
  },
];

export function HarvestAnalyticsChart() {
  const { isHindi } = useLanguage();
  const [selectedMonthIdx, setSelectedMonthIdx] = React.useState<number>(4); // defaults to September (current)
  const [metricView, setMetricView] = React.useState<"volume" | "quality">("volume");

  const activeMonth = MONTHLY_HARVEST_DATA[selectedMonthIdx];
  const maxVolume = 350; // max scale kg

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold text-foreground">
              {isHindi ? "उत्पादन व पराग विविधता रुझान" : "Harvest Velocity & Floral Diversity"}
            </CardTitle>
            <Badge variant="outline" className="text-[10px] font-mono">
              6-Month Trend
            </Badge>
          </div>
          <CardDescription className="text-xs">
            {isHindi
              ? "माहवार शहद उत्पादन मात्रा और वानस्पतिक स्रोतों का तुलनात्मक विश्लेषण"
              : "Historical harvest yields, moisture metrics, and botanical source breakdown"}
          </CardDescription>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center gap-1.5 self-start sm:self-center bg-muted/40 p-0.5 rounded-lg border border-border/60">
          <button
            type="button"
            onClick={() => setMetricView("volume")}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
              metricView === "volume"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isHindi ? "मात्रा (किग्रा)" : "Yield (kg)"}
          </button>
          <button
            type="button"
            onClick={() => setMetricView("quality")}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
              metricView === "quality"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isHindi ? "गुणवत्ता व नमी" : "Moisture & Purity"}
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-5">
        {/* Interactive Bar Chart Representation */}
        <div className="space-y-2">
          <div className="h-44 sm:h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-1 border-b border-border/60 relative">
            {/* Horizontal guide lines */}
            <div className="absolute inset-x-0 top-6 border-b border-dashed border-border/40 text-[10px] text-muted-foreground/60 flex justify-between">
              <span>{metricView === "volume" ? "300 kg" : "100% Purity"}</span>
            </div>
            <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-border/30 text-[10px] text-muted-foreground/60 flex justify-between">
              <span>{metricView === "volume" ? "150 kg" : "18% Moisture Max"}</span>
            </div>

            {MONTHLY_HARVEST_DATA.map((item, idx) => {
              const isSelected = idx === selectedMonthIdx;
              const heightPercent =
                metricView === "volume"
                  ? Math.min(100, Math.round((item.totalKg / maxVolume) * 100))
                  : Math.round(item.purityScore * 0.9);

              return (
                <div
                  key={item.month}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  onClick={() => setSelectedMonthIdx(idx)}
                >
                  {/* Floating value on top of selected / hovered */}
                  <div
                    className={`text-[10px] sm:text-xs font-mono font-bold mb-1.5 transition-all ${
                      isSelected
                        ? "text-primary scale-110"
                        : "text-muted-foreground opacity-70 group-hover:opacity-100"
                    }`}
                  >
                    {metricView === "volume" ? `${Math.round(item.totalKg)}k` : `${item.avgMoisture}%`}
                  </div>

                  {/* Bar Body Container */}
                  <div className="h-28 sm:h-32 w-full max-w-[42px] relative flex flex-col justify-end rounded-t-md overflow-hidden bg-muted/30 group-hover:bg-muted/50 transition-all">
                    {/* Projected indicator pattern */}
                    {item.isProjected && (
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(217,119,6,0.1)_4px,rgba(217,119,6,0.1)_8px)] z-10" />
                    )}

                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-md transition-all duration-300 relative ${
                        isSelected
                          ? "bg-linear-to-t from-amber-600 to-amber-400 shadow-sm"
                          : "bg-linear-to-t from-amber-600/70 to-amber-500/50 group-hover:from-amber-600 group-hover:to-amber-500"
                      }`}
                    >
                      {/* Highlight border on selected */}
                      {isSelected && (
                        <div className="absolute inset-0 border-2 border-primary rounded-t-md pointer-events-none" />
                      )}
                    </div>
                  </div>

                  {/* X Axis Month Label */}
                  <span
                    className={`mt-2 text-xs font-semibold transition-colors ${
                      isSelected
                        ? "text-primary font-bold"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {isHindi ? item.monthHi : item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Month Detail Strip */}
        <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-foreground">
                {isHindi ? activeMonth.monthHi : activeMonth.month} {isHindi ? "विवरण" : "Harvest Snapshot"}
              </span>
              {activeMonth.isProjected && (
                <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {isHindi ? "एआई अनुमान" : "Forecast"}
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              {activeMonth.batchesCount} {isHindi ? "बैच दर्ज" : "batches recorded"} • {isHindi ? "औसत नमी" : "Avg Moisture"}:{" "}
              <strong className="text-foreground">{activeMonth.avgMoisture}%</strong> (FSSAI standard &lt;20%)
            </p>
          </div>

          {/* Flora Source Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {activeMonth.floraBreakdown.map((f) => (
              <div
                key={f.name}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-card border border-border/70 text-xs"
              >
                <Wheat className="h-3.5 w-3.5 text-amber-600" />
                <span className="font-medium text-foreground">{f.name}</span>
                <span className="font-mono text-[11px] text-muted-foreground font-semibold">
                  {f.kg} kg
                </span>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs font-medium gap-1 ml-auto sm:ml-0"
              asChild
            >
              <Link href="/batches">
                <span>{isHindi ? "बैच देखें" : "View Batches"}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
