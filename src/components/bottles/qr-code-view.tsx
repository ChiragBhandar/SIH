"use client";

import * as React from "react";
import Link from "next/link";
import { Copy, Check, ExternalLink, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QRCodeViewProps {
  bottleId: string;
  qrIdentifier?: string;
  productName?: string;
  status?: string;
  size?: number;
  showActions?: boolean;
}

// Deterministic pattern generator based on string to create authentic-looking QR matrix
function generateDeterministicMatrix(seed: string, size = 25): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  // 1. Finder patterns (Top-left, Top-right, Bottom-left) 7x7
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = true;
        } else {
          matrix[startY + r][startX + c] = false;
        }
      }
    }
  };

  drawFinder(0, 0); // Top-left
  drawFinder(size - 7, 0); // Top-right
  drawFinder(0, size - 7); // Bottom-left

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Hash-based data fills
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder zones
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= size - 8;
      const inBottomLeft = r >= size - 8 && c < 8;
      const inCenter = r >= 10 && r <= 14 && c >= 10 && c <= 14;

      if (inTopLeft || inTopRight || inBottomLeft || inCenter) continue;

      const val = Math.sin(hash * (r + 1) * (c + 1)) * 10000;
      matrix[r][c] = (val - Math.floor(val)) > 0.48;
    }
  }

  return matrix;
}

export function QRCodeView({
  bottleId,
  qrIdentifier = "QR-HC-00001",
  status = "Active",
  size = 200,
  showActions = true,
}: QRCodeViewProps) {
  const [copied, setCopied] = React.useState(false);
  const [downloadNotice, setDownloadNotice] = React.useState(false);

  const verifyPath = `/verify/${bottleId}`;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const fullUrl = `${origin}${verifyPath}`;

  const matrix = React.useMemo(() => generateDeterministicMatrix(bottleId), [bottleId]);
  const matrixSize = matrix.length;
  const cellSize = 100 / matrixSize;

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrintDownload = () => {
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 2500);
  };

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      {/* QR Code Canvas Frame */}
      <div
        className="relative p-4 rounded-xl bg-white text-slate-900 border-2 border-amber-500/30 shadow-md flex flex-col items-center justify-center transition-all hover:border-amber-500 hover:shadow-lg group"
        style={{ width: size + 32, height: size + 32 }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          shapeRendering="crispEdges"
        >
          {/* Background */}
          <rect width="100" height="100" fill="#ffffff" />

          {/* Matrix Cells */}
          {matrix.map((row, rIdx) =>
            row.map((cell, cIdx) =>
              cell ? (
                <rect
                  key={`${rIdx}-${cIdx}`}
                  x={cIdx * cellSize}
                  y={rIdx * cellSize}
                  width={cellSize + 0.05}
                  height={cellSize + 0.05}
                  fill="#0f172a"
                />
              ) : null
            )
          )}

          {/* Center Bee Emblem */}
          <circle cx="50" cy="50" r="8" fill="#ffffff" stroke="#d97706" strokeWidth="1" />
          <text
            x="50"
            y="53.5"
            textAnchor="middle"
            fontSize="7"
            fill="#d97706"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            HC
          </text>
        </svg>

        {/* Scan indicator badge */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1 whitespace-nowrap">
          <Sparkles className="h-2.5 w-2.5" />
          <span>Scan to Verify</span>
        </div>
      </div>

      {/* Meta Identifiers */}
      <div className="space-y-1 w-full max-w-xs">
        <div className="flex items-center justify-center gap-2">
          <span className="font-mono font-bold text-xs text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border">
            {bottleId}
          </span>
          <Badge
            variant="outline"
            className={`text-[10px] uppercase font-semibold ${
              status === "Active" || status === "Published"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : status === "Suspended"
                ? "bg-rose-50 text-rose-800 border-rose-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            {status}
          </Badge>
        </div>
        <p className="text-[11px] font-mono text-muted-foreground truncate">
          {qrIdentifier}
        </p>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="w-full space-y-2 pt-1">
          {/* Public Link Preview Box */}
          <div className="flex items-center justify-between gap-1 p-1.5 pl-2.5 rounded-lg border border-border/80 bg-muted/40 text-left text-xs">
            <span className="font-mono text-[11px] text-muted-foreground truncate select-all">
              {verifyPath}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-xs shrink-0 gap-1 text-primary hover:text-primary cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-[10px] text-emerald-700 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span className="text-[10px]">Copy</span>
                </>
              )}
            </Button>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8 text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/5 cursor-pointer"
            >
              <Link href={verifyPath} target="_blank">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Test Public View</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintDownload}
              className="h-8 text-xs gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Export Sticker</span>
            </Button>
          </div>

          {downloadNotice && (
            <p className="text-[11px] text-emerald-700 animate-in fade-in slide-in-from-top-1">
              ✓ Sticker print vector simulated for {bottleId}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
