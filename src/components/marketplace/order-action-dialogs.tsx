"use client";

import * as React from "react";
import { MarketplaceOrder } from "@/types/marketplace";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, Ban, AlertTriangle } from "lucide-react";

interface AcceptOrderDialogProps {
  order: MarketplaceOrder;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => void;
}

export function AcceptOrderDialog({
  order,
  isOpen,
  onClose,
  onConfirm,
}: AcceptOrderDialogProps) {
  const [notes, setNotes] = React.useState("Order accepted. Material batch reserved for dispatch.");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(notes);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">Accept Marketplace Order</DialogTitle>
                <DialogDescription className="text-xs">
                  Confirm acceptance of order <strong className="font-mono">{order.id}</strong> for {order.quantity} {order.unit}.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-3 rounded-lg bg-muted/20 border border-border/80 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Buyer:</span>
              <strong className="text-foreground">{order.buyerOrgName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Batch ID:</span>
              <strong className="font-mono text-foreground">{order.batchNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity:</span>
              <strong className="font-mono text-emerald-700">{order.quantity} {order.unit}</strong>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-xs font-semibold text-foreground">
              Seller Confirmation Notes (Optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="text-xs resize-none"
              placeholder="e.g. Confirmed for shipping via Solan Logistics Bay 3..."
            />
          </div>

          <DialogFooter className="pt-2 sm:justify-between gap-2 border-t border-border/60">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs h-8">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="text-xs h-8 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white">
              Confirm Acceptance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface RejectOrderDialogProps {
  order: MarketplaceOrder;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function RejectOrderDialog({
  order,
  isOpen,
  onClose,
  onConfirm,
}: RejectOrderDialogProps) {
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Rejection reason is mandatory.");
      return;
    }
    onConfirm(reason.trim());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                <XCircle className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">Reject Marketplace Order</DialogTitle>
                <DialogDescription className="text-xs">
                  Rejection requires a documented commercial or logistic reason.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 rounded-lg bg-muted/20 border border-border/80 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID:</span>
              <strong className="font-mono text-foreground">{order.id}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Buyer:</span>
              <strong className="text-foreground">{order.buyerOrgName}</strong>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Rejection Reason (Required)</span>
              <span className="text-rose-500 text-[10px]">* Required</span>
            </label>
            <Textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setError(null);
              }}
              rows={3}
              className="text-xs resize-none"
              placeholder="e.g. Batch reserved for contract supply; requested delivery window not feasible..."
              required
            />
          </div>

          <DialogFooter className="pt-2 sm:justify-between gap-2 border-t border-border/60">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs h-8">
              Back
            </Button>
            <Button type="submit" size="sm" variant="destructive" className="text-xs h-8 font-semibold">
              Reject Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface CancelOrderDialogProps {
  order: MarketplaceOrder;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function CancelOrderDialog({
  order,
  isOpen,
  onClose,
  onConfirm,
}: CancelOrderDialogProps) {
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Cancellation reason is mandatory.");
      return;
    }
    onConfirm(reason.trim());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                <Ban className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">Cancel Marketplace Order</DialogTitle>
                <DialogDescription className="text-xs">
                  Buyer cancellation will be recorded in the order audit history.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 rounded-lg bg-muted/20 border border-border/80 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID:</span>
              <strong className="font-mono text-foreground">{order.id}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Batch ID:</span>
              <strong className="font-mono text-foreground">{order.batchNumber}</strong>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Cancellation Reason (Required)</span>
              <span className="text-rose-500 text-[10px]">* Required</span>
            </label>
            <Textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setError(null);
              }}
              rows={3}
              className="text-xs resize-none"
              placeholder="e.g. Project schedule changed; duplicate purchase order..."
              required
            />
          </div>

          <DialogFooter className="pt-2 sm:justify-between gap-2 border-t border-border/60">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs h-8">
              Keep Order
            </Button>
            <Button type="submit" size="sm" variant="destructive" className="text-xs h-8 font-semibold">
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
