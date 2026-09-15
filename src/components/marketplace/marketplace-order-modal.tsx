"use client";

import * as React from "react";
import Link from "next/link";
import { MarketplaceListing, MarketplaceOrder } from "@/types/marketplace";
import { useTraceability } from "@/context/traceability-context";
import { useAuthSession } from "@/context/auth-session-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ArrowRight,
  Info,
} from "lucide-react";

interface MarketplaceOrderModalProps {
  listing: MarketplaceListing;
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: (order: MarketplaceOrder) => void;
}

export function MarketplaceOrderModal({
  listing,
  isOpen,
  onClose,
  onOrderCreated,
}: MarketplaceOrderModalProps) {
  const { createMarketplaceOrder, marketplaceOrders } = useTraceability();
  const { selectedOrg, user } = useAuthSession();

  // Wizard steps: 'form' -> 'review' -> 'confirmation'
  const [step, setStep] = React.useState<"form" | "review" | "confirmation">("form");

  // Form State
  const defaultBuyerOrg =
    selectedOrg?.id !== listing.sellerOrgId
      ? selectedOrg?.name || "Golden Hive Foods"
      : "Apex Honey Processors & Buyers";

  const [buyerOrgName, setBuyerOrgName] = React.useState(defaultBuyerOrg);
  const [buyerContactName, setBuyerContactName] = React.useState(user?.fullName || "Vikram Mehta (Procurement Lead)");
  const [quantity, setQuantity] = React.useState<number>(20.0);
  const [deliveryLocation, setDeliveryLocation] = React.useState(
    "Golden Hive Processing Plant Unit 4, Solan Industrial Area, HP 173212"
  );
  const [requestedDeliveryDate, setRequestedDeliveryDate] = React.useState("2026-09-25");
  const [buyerReference, setBuyerReference] = React.useState("PO-HC-2026-088");
  const [notes, setNotes] = React.useState(
    "Standard temperature-controlled delivery required. Full batch CoA and provenance seal required upon dispatch."
  );

  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = React.useState<MarketplaceOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Preview Order ID
  const previewOrderId = React.useMemo(() => {
    const nextSeq = String(marketplaceOrders.length + 1).padStart(4, "0");
    return `ORD-HC-2026-${nextSeq}`;
  }, [marketplaceOrders.length]);

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const numQty = Number(quantity);
    if (isNaN(numQty) || numQty <= 0) {
      setValidationError("Requested quantity must be greater than 0 kg.");
      return;
    }

    if (numQty > listing.availableQuantity) {
      setValidationError(
        `Requested quantity (${numQty} kg) exceeds available quantity (${listing.availableQuantity} kg).`
      );
      return;
    }

    if (!deliveryLocation.trim()) {
      setValidationError("Delivery and reference location is required.");
      return;
    }

    if (!requestedDeliveryDate) {
      setValidationError("Requested delivery date is required.");
      return;
    }

    setStep("review");
  };

  const handleConfirmOrder = () => {
    try {
      setIsSubmitting(true);
      setValidationError(null);

      const order = createMarketplaceOrder({
        listingId: listing.id,
        quantity: Number(quantity),
        deliveryLocation,
        requestedDeliveryDate,
        buyerReference,
        notes,
        buyerOrgName,
        buyerOrgId: selectedOrg?.id || "org-ghf-02",
        buyerContactName,
      });

      setCreatedOrder(order);
      setStep("confirmation");
      if (onOrderCreated) {
        onOrderCreated(order);
      }
    } catch (err: unknown) {
      setValidationError(err instanceof Error ? err.message : "Failed to place mock order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === "form" && (
          <form onSubmit={handleProceedToReview} className="space-y-4">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold">Place Mock Order</DialogTitle>
                  <DialogDescription className="text-xs">
                    Create a commercial purchase commitment referencing authoritative batch{" "}
                    <span className="font-mono font-semibold text-foreground">{listing.batchNumber}</span>.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Referenced Listing Context Banner */}
            <div className="rounded-lg border border-border/80 bg-muted/20 p-3 text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/60">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Listing</span>
                  <span className="font-mono font-bold text-foreground">{listing.id}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Authoritative Batch</span>
                  <span className="font-mono font-bold text-primary">{listing.batchNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Seller</span>
                  <span className="font-semibold text-foreground">{listing.sellerOrgName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Available Stock</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {listing.availableQuantity.toFixed(1)} {listing.unit}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Variety: <strong className="text-foreground">{listing.honeyVariety}</strong></span>
                <span>Traceability: <strong className="text-primary">{listing.traceabilityStatus}</strong></span>
              </div>
            </div>

            {/* Validation Error Alert */}
            {validationError && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <div>
                  <strong>Validation Notice:</strong> {validationError}
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Buyer Organisation</span>
                  <span className="text-[10px] text-muted-foreground font-normal">Commercial purchasing party</span>
                </label>
                <Input
                  value={buyerOrgName}
                  onChange={(e) => setBuyerOrgName(e.target.value)}
                  placeholder="e.g. Golden Hive Foods"
                  className="h-8 text-xs font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Requested Quantity ({listing.unit})</span>
                  <span className="text-[10px] text-muted-foreground font-mono">Max: {listing.availableQuantity} {listing.unit}</span>
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max={listing.availableQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  className="h-8 text-xs font-mono font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Buyer Purchase Order Ref
                </label>
                <Input
                  value={buyerReference}
                  onChange={(e) => setBuyerReference(e.target.value)}
                  placeholder="PO-HC-2026-XXXX"
                  className="h-8 text-xs font-mono"
                  required
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  Delivery / Receiving Facility Location
                </label>
                <Input
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="Facility address, Bay # or warehouse intake dock"
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Requested Delivery Date
                </label>
                <Input
                  type="date"
                  value={requestedDeliveryDate}
                  onChange={(e) => setRequestedDeliveryDate(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Buyer Contact / Agent Name
                </label>
                <Input
                  value={buyerContactName}
                  onChange={(e) => setBuyerContactName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  Commercial & Logistic Notes
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="text-xs resize-none"
                  placeholder="Optional packaging requirements, temp thresholds, or testing specs..."
                />
              </div>
            </div>

            <DialogFooter className="pt-2 sm:justify-between gap-2 border-t border-border/60">
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs h-8">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs h-8 gap-1.5 font-semibold">
                <span>Continue to Review</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </DialogFooter>
          </form>
        )}

        {/* STEP 2: ORDER REVIEW */}
        {step === "review" && (
          <div className="space-y-4">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold">Review Mock Order Summary</DialogTitle>
                  <DialogDescription className="text-xs">
                    Please verify the commercial order parameters before generating the mock purchase order.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* ORDER SUMMARY CARD */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3.5 text-xs shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-border/70">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    Generated Order Reference
                  </span>
                  <span className="font-mono font-bold text-primary text-sm">{previewOrderId}</span>
                </div>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs font-medium">
                  Status: Pending Seller Action
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg bg-muted/20 border border-border/80 space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    Buyer Organisation
                  </span>
                  <div className="font-bold text-foreground text-xs">{buyerOrgName}</div>
                  <div className="text-[11px] text-muted-foreground">Contact: {buyerContactName}</div>
                  <div className="text-[11px] font-mono text-muted-foreground">Ref: {buyerReference}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-muted/20 border border-border/80 space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    Seller Organisation
                  </span>
                  <div className="font-bold text-foreground text-xs">{listing.sellerOrgName}</div>
                  <div className="text-[11px] text-muted-foreground">{listing.sellerLocation}</div>
                  <div className="text-[11px] font-mono text-muted-foreground">Listing: {listing.id}</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/30 border border-border/80 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                      Authoritative Batch Identity
                    </span>
                    <span className="font-mono font-bold text-foreground text-xs">{listing.batchNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                      Variety / Botanical Source
                    </span>
                    <span className="font-medium text-foreground text-xs">{listing.honeyVariety}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                      Order Quantity
                    </span>
                    <span className="font-mono font-bold text-primary text-sm">
                      {Number(quantity).toFixed(1)} {listing.unit}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground space-y-1">
                  <div>
                    <strong className="text-foreground">Delivery Facility:</strong> {deliveryLocation}
                  </div>
                  <div>
                    <strong className="text-foreground">Requested Delivery:</strong> {requestedDeliveryDate}
                  </div>
                  {notes && (
                    <div>
                      <strong className="text-foreground">Notes:</strong> {notes}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* MANDATORY DOMAIN DISTINCTION INFORMATION MESSAGE */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs flex items-start gap-2.5 text-foreground">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-primary">Marketplace Commercial Transaction Rule</p>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  &ldquo;This mock order records a marketplace transaction. It does not itself transfer custody of the material.&rdquo;
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Authoritative batch <code>{listing.batchNumber}</code> remains authoritative with unbroken traceability. Physical dispatch will occur as a separate custody transfer event upon seller fulfillment.
                </p>
              </div>
            </div>

            <DialogFooter className="pt-2 sm:justify-between gap-2 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep("form")}
                className="text-xs h-8"
                disabled={isSubmitting}
              >
                Back to Edit
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
                className="text-xs h-8 gap-1.5 font-bold"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{isSubmitting ? "Submitting Order..." : "Place Mock Order"}</span>
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* STEP 3: ORDER CREATED CONFIRMATION */}
        {step === "confirmation" && createdOrder && (
          <div className="space-y-4 py-2">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Mock order placed
              </DialogTitle>
              <DialogDescription className="text-xs max-w-md mx-auto">
                Commercial mock order <strong className="font-mono text-foreground">{createdOrder.id}</strong> has been registered in the marketplace ledger.
              </DialogDescription>
            </div>

            {/* Confirmation Summary Card */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-xs shadow-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Order ID</span>
                  <span className="font-mono font-bold text-primary">{createdOrder.id}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Listing</span>
                  <span className="font-mono font-bold text-foreground">{createdOrder.listingId}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Batch ID</span>
                  <span className="font-mono font-bold text-foreground">{createdOrder.batchNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Status</span>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[11px] font-medium">
                    Pending
                  </Badge>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="text-muted-foreground">Quantity:</span>{" "}
                  <strong className="font-mono text-foreground">{createdOrder.quantity.toFixed(1)} {createdOrder.unit}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Seller:</span>{" "}
                  <strong className="text-foreground">{createdOrder.sellerOrgName}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Buyer:</span>{" "}
                  <strong className="text-foreground">{createdOrder.buyerOrgName}</strong>
                </div>
              </div>
            </div>

            {/* Traceability Note */}
            <div className="rounded-lg border border-border/80 bg-muted/20 p-3 text-[11px] text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Batch <strong>{createdOrder.batchNumber}</strong> remains authoritative. No duplicate batch was created, and physical custody transfer has not occurred yet.
              </span>
            </div>

            <DialogFooter className="pt-2 sm:justify-between gap-2 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs h-8"
              >
                Close Window
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  asChild
                  className="text-xs h-8"
                  onClick={onClose}
                >
                  <Link href="/marketplace/orders">
                    View All Orders
                  </Link>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  asChild
                  className="text-xs h-8 font-semibold"
                  onClick={onClose}
                >
                  <Link href={`/marketplace/orders/${createdOrder.id}`}>
                    <span>View Order Record</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
