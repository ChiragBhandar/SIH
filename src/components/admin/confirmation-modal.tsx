"use client";

import * as React from "react";
import { AlertTriangle, Info, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "success" | "info";
  requireReason?: boolean;
  reasonPlaceholder?: string;
  reasonLabel?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm Action",
  cancelText = "Cancel",
  variant = "warning",
  requireReason = true,
  reasonPlaceholder = "Please provide the justification or operational context...",
  reasonLabel = "Mandatory Audit Justification / Reason",
}: ConfirmationModalProps) {
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requireReason && !reason.trim()) {
      setError("A reason is mandatory for immutable administrative logging.");
      return;
    }
    const finalReason = reason.trim();
    setReason("");
    setError("");
    onConfirm(finalReason);
    onClose();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <AlertTriangle className="w-5 h-5 text-destructive" />,
          iconBg: "bg-destructive/10 border-destructive/20",
          buttonVariant: "destructive" as const,
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
          iconBg: "bg-amber-50 border-amber-200",
          buttonVariant: "default" as const,
        };
      case "success":
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
          iconBg: "bg-emerald-50 border-emerald-200",
          buttonVariant: "default" as const,
        };
      default:
        return {
          icon: <Info className="w-5 h-5 text-sky-600" />,
          iconBg: "bg-sky-50 border-sky-200",
          buttonVariant: "default" as const,
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-xl overflow-hidden">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 mb-5">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${vStyles.iconBg}`}>
            {vStyles.icon}
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {requireReason && (
            <div>
              <label className="block text-[11px] font-semibold text-foreground uppercase tracking-wider mb-1.5">
                {reasonLabel} <span className="text-destructive">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError("");
                }}
                rows={3}
                placeholder={reasonPlaceholder}
                className={`w-full px-3 py-2 rounded-xl bg-background border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
                  error ? "border-destructive focus:ring-destructive/30" : "border-input"
                }`}
              />
              {error ? (
                <p className="text-xs text-destructive mt-1 font-medium">{error}</p>
              ) : (
                <p className="text-[11px] text-muted-foreground mt-1">
                  This action creates an append-only verifiable audit event.
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
            >
              {cancelText}
            </Button>
            <Button
              type="submit"
              size="sm"
              variant={vStyles.buttonVariant}
            >
              {confirmText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
