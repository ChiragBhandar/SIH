"use client";

import * as React from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { Copy, Check, ExternalLink, Download, Printer, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";
import { APP_BASE_URL } from "@/lib/constants";

interface QRCodeViewProps {
  bottleId: string;
  qrIdentifier?: string;
  productName?: string;
  status?: string;
  size?: number;
  showActions?: boolean;
}

export function QRCodeView({
  bottleId,
  qrIdentifier = "QR-HC-00001",
  status = "Active",
  size = 200,
  showActions = true,
}: QRCodeViewProps) {
  const { tr, trStatus } = useLanguage();
  const [copied, setCopied] = React.useState(false);
  const [qrDataUrl, setQrDataUrl] = React.useState<string | null>(null);
  const [qrSvgString, setQrSvgString] = React.useState<string | null>(null);
  const [qrError, setQrError] = React.useState(false);

  const verifyPath = `/verify/${bottleId}`;
  // Production domain — QR codes always encode the live Vercel URL
  const fullUrl = `${APP_BASE_URL}${verifyPath}`;

  // Generate real QR code (PNG data URL for display + SVG string for download)
  React.useEffect(() => {
    let cancelled = false;

    async function generate() {
      try {
        const dataUrl = await QRCode.toDataURL(fullUrl, {
          errorCorrectionLevel: "H",
          margin: 2,
          width: 400,
          color: { dark: "#0f172a", light: "#ffffff" },
        });
        const svgStr = await QRCode.toString(fullUrl, {
          type: "svg",
          errorCorrectionLevel: "H",
          margin: 2,
          color: { dark: "#0f172a", light: "#ffffff" },
        });
        if (!cancelled) {
          setQrDataUrl(dataUrl);
          setQrSvgString(svgStr);
          setQrError(false);
        }
      } catch (err) {
        console.error("QR generation failed:", err);
        if (!cancelled) setQrError(true);
      }
    }

    generate();
    return () => { cancelled = true; };
  }, [fullUrl]);

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `${bottleId}-qr-code.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${bottleId}-qr-code.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!qrDataUrl) return;
    const win = window.open("", "_blank", "width=600,height=700");
    if (!win) return;
    const productInfo = qrIdentifier || bottleId;
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>QR Code — ${bottleId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Inter',sans-serif;display:flex;flex-direction:column;align-items:center;
         justify-content:center;min-height:100vh;background:#fff;padding:24px}
    .card{border:2px solid #d97706;border-radius:16px;padding:28px 32px;
          text-align:center;max-width:340px;width:100%}
    .brand{font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;
           color:#d97706;margin-bottom:16px}
    img{width:260px;height:260px;display:block;margin:0 auto}
    .cta{margin-top:16px;font-size:13px;font-weight:700;color:#0f172a;letter-spacing:.02em}
    .product{margin-top:6px;font-size:11px;color:#64748b}
    .id{margin-top:10px;font-size:10px;font-family:monospace;color:#94a3b8;letter-spacing:.05em}
    @media print{body{padding:0;justify-content:flex-start;padding-top:40px}}
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">🐝 Honey Chain — Verified Traceability</div>
    <img src="${qrDataUrl}" alt="QR Code for ${bottleId}" />
    <div class="cta">Scan to verify this product</div>
    <div class="product">${productInfo}</div>
    <div class="id">${bottleId}</div>
  </div>
  <script>window.onload=()=>{window.print()}</script>
</body>
</html>`);
    win.document.close();
  };

  // ─── Status badge colour ──────────────────────────────────────────────────
  const statusClass =
    status === "Active" || status === "Published"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : status === "Suspended"
      ? "bg-rose-50 text-rose-800 border-rose-200"
      : "bg-amber-50 text-amber-800 border-amber-200";

  return (
    /* Outer wrapper — full width, column, centred */
    <div className="flex flex-col items-center gap-5 w-full">

      {/* ── QR image frame ───────────────────────────────────────────────── */}
      <div className="relative">
        <div
          className="p-3 rounded-2xl bg-white border-2 border-amber-400/40 shadow-md
                     transition-all duration-200 hover:border-amber-500 hover:shadow-lg"
        >
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR code for ${bottleId} — Scan to verify`}
              width={size}
              height={size}
              className="block rounded"
              style={{ imageRendering: "pixelated" }}
            />
          ) : qrError ? (
            <div
              className="flex flex-col items-center justify-center gap-2
                         text-xs text-muted-foreground bg-muted/30 rounded"
              style={{ width: size, height: size }}
            >
              <span className="text-xl">⚠</span>
              <span>QR unavailable</span>
            </div>
          ) : (
            <div
              className="animate-pulse bg-muted/50 rounded"
              style={{ width: size, height: size }}
            />
          )}
        </div>

        {/* Scan badge — horizontally centred below the frame */}
        <div
          className="absolute -bottom-3.5 left-1/2 -translate-x-1/2
                     bg-amber-500 text-slate-950 px-3 py-0.5 rounded-full
                     text-[10px] font-bold tracking-widest uppercase shadow-sm
                     flex items-center gap-1 whitespace-nowrap"
        >
          <Sparkles className="h-2.5 w-2.5 shrink-0" />
          <span>{tr("Scan to Verify", "सत्यापित करने के लिए स्कैन करें")}</span>
        </div>
      </div>

      {/* ── Bottle ID + status + QR ref ──────────────────────────────────── */}
      <div className="flex flex-col items-center gap-1.5 mt-1">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs text-foreground bg-muted/60 px-2 py-0.5 rounded border border-border">
            {bottleId}
          </span>
          <Badge variant="outline" className={`text-[10px] uppercase font-semibold ${statusClass}`}>
            {trStatus(status)}
          </Badge>
        </div>
        <p className="text-[11px] font-mono text-muted-foreground">{qrIdentifier}</p>
      </div>

      {/* ── Actions section ──────────────────────────────────────────────── */}
      {showActions && (
        <div className="w-full flex flex-col gap-2">

          {/* URL bar */}
          <div className="flex items-center rounded-lg border border-border/80 bg-muted/40 overflow-hidden">
            <span
              className="flex-1 min-w-0 font-mono text-[10px] text-muted-foreground
                         px-3 py-2 truncate select-all"
            >
              {fullUrl || verifyPath}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2
                         text-[10px] font-semibold text-primary
                         border-l border-border/60 hover:bg-primary/8
                         transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span className="text-emerald-700">{tr("Copied!", "कॉपी!")}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 shrink-0" />
                  <span>{tr("Copy", "कॉपी")}</span>
                </>
              )}
            </button>
          </div>

          {/* Three action buttons — equal width */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-9 text-xs gap-1.5 border-primary/30 text-primary
                         hover:bg-primary/5 cursor-pointer justify-center"
            >
              <Link href={verifyPath} target="_blank">
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                <span>{tr("Preview", "प्रीव्यू")}</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPng}
              disabled={!qrDataUrl}
              className="h-9 text-xs gap-1.5 cursor-pointer justify-center disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span>{tr("Download", "डाउनलोड")}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={!qrDataUrl}
              className="h-9 text-xs gap-1.5 cursor-pointer justify-center disabled:opacity-50"
            >
              <Printer className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span>{tr("Print", "प्रिंट")}</span>
            </Button>
          </div>

          {/* SVG download — subtle secondary link */}
          {qrSvgString && (
            <button
              type="button"
              onClick={handleDownloadSvg}
              className="flex items-center justify-center gap-1.5 text-[10px]
                         text-muted-foreground hover:text-primary transition-colors
                         cursor-pointer py-0.5"
            >
              <Download className="h-2.5 w-2.5 shrink-0" />
              <span className="underline underline-offset-2">
                {tr("Download SVG (vector / print quality)", "SVG डाउनलोड करें (प्रिंट)")}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
