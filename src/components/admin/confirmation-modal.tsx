"use client";

import * as React from "react";
import { AlertTriangle, Info, CheckCircle2, X } from "lucide-react";

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
          icon: <AlertTriangle className="w-6 h-6 text-rose-400" />,
          iconBg: "bg-rose-950/60 border-rose-800/60",
          button: "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
          iconBg: "bg-amber-950/60 border-amber-800/60",
          button: "bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-900/30 font-semibold",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
          iconBg: "bg-emerald-950/60 border-emerald-800/60",
          button: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30 font-semibold",
        };
      default:
        return {
          icon: <Info className="w-6 h-6 text-sky-400" />,
          iconBg: "bg-sky-950/60 border-sky-800/60",
          button: "bg-sky-600 hover:bg-sky-500 text-white shadow-sky-900/30",
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-5">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${vStyles.iconBg}`}>
            {vStyles.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-100 tracking-tight">{title}</h3>
            <p className="text-sm text-stone-400 mt-1 leading-relaxed">{description}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {requireReason && (
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                {reasonLabel} <span className="text-rose-400">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError("");
                }}
                rows={3}
                placeholder={reasonPlaceholder}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                  error ? "border-rose-500/60 focus:ring-rose-500/50" : "border-stone-800"
                }`}
              />
              {error ? (
                <p className="text-xs text-rose-400 mt-1">{error}</p>
              ) : (
                <p className="text-xs text-stone-500 mt-1">
                  This action creates an append-only verifiable audit event.
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-medium transition-colors"
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg ${vStyles.button}`}
            >
              {confirmText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
