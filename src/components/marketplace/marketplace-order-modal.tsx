"use client";

import * as React from "react";
import Link from "next/link";
import { MarketplaceListing, MarketplaceOrder } from "@/types/marketplace";
import { useTraceability } from "@/context/traceability-context";
import { useAuthSession } from "@/context/auth-session-context";
import { useLanguage } from "@/context/language-context";
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
  const { tr, trStatus } = useLanguage();

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
      setValidationError(tr("Requested quantity must be greater than 0 kg.", "अनुरोधित मात्रा 0 किग्रा से अधिक होनी चाहिए।"));
      return;
    }

    if (numQty > listing.availableQuantity) {
      setValidationError(
        tr(
          `Requested quantity (${numQty} kg) exceeds available quantity (${listing.availableQuantity} kg).`,
          `अनुरोधित मात्रा (${numQty} किग्रा) उपलब्ध मात्रा (${listing.availableQuantity} किग्रा) से अधिक है।`
        )
      );
      return;
    }

    if (!deliveryLocation.trim()) {
      setValidationError(tr("Delivery and reference location is required.", "वितरण एवं संदर्भ स्थान आवश्यक है।"));
      return;
    }

    if (!requestedDeliveryDate) {
      setValidationError(tr("Requested delivery date is required.", "अनुरोधित वितरण तिथि आवश्यक है।"));
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
      setValidationError(err instanceof Error ? err.message : tr("Failed to place mock order", "ऑर्डर देने में विफल"));
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
                  <DialogTitle className="text-base font-bold">
                    {tr("Place Commercial Order", "वाणिज्यिक ऑर्डर दें")}
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    {tr("Create a commercial purchase commitment referencing authoritative batch", "अधिकृत बैच के संदर्भ में वाणिज्यिक खरीद प्रतिबद्धता बनाएं")}{" "}
                    <span className="font-mono font-semibold text-foreground">{listing.batchNumber}</span>.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Referenced Listing Context Banner */}
            <div className="rounded-lg border border-border/80 bg-muted/20 p-3 text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/60">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">{tr("Listing", "लिस्टिंग")}</span>
                  <span className="font-mono font-bold text-foreground">{listing.id}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">{tr("Authoritative Batch", "अधिकृत बैच")}</span>
                  <span className="font-mono font-bold text-primary">{listing.batchNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">{tr("Seller", "विक्रेता")}</span>
                  <span className="font-semibold text-foreground">{listing.sellerOrgName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">{tr("Available Stock", "उपलब्ध स्टॉक")}</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {listing.availableQuantity.toFixed(1)} {listing.unit}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{tr("Variety:", "किस्म:")} <strong className="text-foreground">{listing.honeyVariety}</strong></span>
                <span>{tr("Traceability:", "ट्रेसेबिलिटी:")} <strong className="text-primary">{trStatus(listing.traceabilityStatus)}</strong></span>
              </div>
            </div>

            {/* Validation Error Alert */}
            {validationError && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <strong>{tr("Validation Notice:", "सत्यापन सूचना:")}</strong> {validationError}
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>{tr("Buyer Organisation", "खरीदार संगठन")}</span>
                  <span className="text-[10px] text-muted-foreground font-normal">{tr("Commercial purchasing party", "वाणिज्यिक खरीद पक्ष")}</span>
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
                  <span>{tr("Requested Quantity", "अनुरोधित मात्रा")} ({listing.unit})</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{tr("Max:", "अधिकतम:")} {listing.availableQuantity} {listing.unit}</span>
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
                  {tr("Buyer Purchase Order Ref", "खरीदार खरीद आदेश (PO) संदर्भ")}
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
                  {tr("Delivery / Receiving Facility Location", "वितरण / आवक सुविधा स्थान")}
                </label>
                <Input
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder={tr("Facility address, Bay # or warehouse intake dock", "सुविधा का पता, बे संख्या या गोदाम इनटेक डॉक")}
                  className="h-8 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  {tr("Requested Delivery Date", "अनुरोधित वितरण तिथि")}
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
                  {tr("Buyer Contact / Agent Name", "खरीदार संपर्क / एजेंट नाम")}
                </label>
                <Input
                  value={buyerContactName}
                  onChange={(e) => setBuyerContactName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  {tr("Commercial & Logistic Notes", "वाणिज्यिक एवं लॉजिस्टिक टिप्पणी")}
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="text-xs resize-none"
                  placeholder={tr(
                    "Optional packaging requirements, temp thresholds, or testing specs...",
                    "वैकल्पिक पैकेजिंग आवश्यकताएं, तापमान सीमा, या परीक्षण विनिर्देश..."
                  )}
                />
              </div>
            </div>

            <DialogFooter className="pt-2 sm:justify-between gap-2 border-t border-border/60">
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs h-8">
                {tr("Cancel", "रद्द करें")}
              </Button>
              <Button type="submit" size="sm" className="text-xs h-8 gap-1.5 font-semibold">
                <span>{tr("Continue to Review", "समीक्षा के लिए आगे बढ़ें")}</span>
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
                  <DialogTitle className="text-base font-bold">
                    {tr("Review Order Summary", "ऑर्डर सारांश की समीक्षा करें")}
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    {tr(
                      "Please verify the commercial order parameters before generating the purchase order.",
                      "कृपया खरीद आदेश जारी करने से पहले वाणिज्यिक ऑर्डर मापदंडों की पुष्टि करें।"
                    )}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* ORDER SUMMARY CARD */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3.5 text-xs shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-border/70">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    {tr("Generated Order Reference", "उत्पन्न ऑर्डर संदर्भ")}
                  </span>
                  <span className="font-mono font-bold text-primary text-sm">{previewOrderId}</span>
                </div>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs font-medium">
                  {tr("Status: Pending Seller Action", "स्थिति: विक्रेता कार्रवाई लंबित")}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg bg-muted/20 border border-border/80 space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    {tr("Buyer Organisation", "खरीदार संगठन")}
                  </span>
                  <div className="font-bold text-foreground text-xs">{buyerOrgName}</div>
                  <div className="text-[11px] text-muted-foreground">{tr("Contact:", "संपर्क:")} {buyerContactName}</div>
                  <div className="text-[11px] font-mono text-muted-foreground">{tr("Ref:", "संदर्भ:")} {buyerReference}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-muted/20 border border-border/80 space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                    {tr("Seller Organisation", "विक्रेता संगठन")}
                  </span>
                  <div className="font-bold text-foreground text-xs">{listing.sellerOrgName}</div>
                  <div className="text-[11px] text-muted-foreground">{listing.sellerLocation}</div>
                  <div className="text-[11px] font-mono text-muted-foreground">{tr("Listing:", "लिस्टिंग:")} {listing.id}</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/30 border border-border/80 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                      {tr("Authoritative Batch Identity", "अधिकृत बैच पहचान")}
                    </span>
                    <span className="font-mono font-bold text-foreground text-xs">{listing.batchNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                      {tr("Variety / Botanical Source", "किस्म / वानस्पतिक स्रोत")}
                    </span>
                    <span className="font-medium text-foreground text-xs">{listing.honeyVariety}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                      {tr("Order Quantity", "ऑर्डर मात्रा")}
                    </span>
                    <span className="font-mono font-bold text-primary text-sm">
                      {Number(quantity).toFixed(1)} {listing.unit}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground space-y-1">
                  <div>
                    <strong className="text-foreground">{tr("Delivery Facility:", "वितरण सुविधा:")}</strong> {deliveryLocation}
                  </div>
                  <div>
                    <strong className="text-foreground">{tr("Requested Delivery:", "अनुरोधित वितरण:")}</strong> {requestedDeliveryDate}
                  </div>
                  {notes && (
                    <div>
                      <strong className="text-foreground">{tr("Notes:", "टिप्पणी:")}</strong> {notes}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* DOMAIN DISTINCTION INFORMATION MESSAGE */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs flex items-start gap-2.5 text-foreground">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-primary">{tr("Marketplace Commercial Transaction Rule", "मार्केटप्लेस वाणिज्यिक लेनदेन नियम")}</p>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  {tr(
                    "This order records a marketplace transaction. It does not itself transfer custody of the material.",
                    "यह ऑर्डर एक मार्केटप्लेस लेनदेन दर्ज करता है। यह स्वयं सामग्री की कस्टडी को स्थानांतरित नहीं करता है।"
                  )}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {tr(
                    "Authoritative batch remains authoritative with unbroken traceability. Physical dispatch will occur as a separate custody transfer event upon seller fulfillment.",
                    "अधिकृत बैच अटूट ट्रेसेबिलिटी के साथ अधिकृत बना रहता है। विक्रेता पूर्ति पर भौतिक प्रेषण एक अलग कस्टडी हस्तांतरण घटना के रूप में होगा।"
                  )}
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
                {tr("Back to Edit", "संपादित करने के लिए वापस")}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
                className="text-xs h-8 gap-1.5 font-bold"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{isSubmitting ? tr("Submitting Order...", "ऑर्डर सबमिट हो रहा है...") : tr("Place Order", "ऑर्डर दें")}</span>
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* STEP 3: ORDER CREATED CONFIRMATION */}
        {step === "confirmation" && createdOrder && (
          <div className="space-y-4 py-2">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {tr("Commercial Order Placed Successfully", "वाणिज्यिक ऑर्डर सफलतापूर्वक दर्ज हुआ")}
              </DialogTitle>
              <DialogDescription className="text-xs max-w-md mx-auto">
                {tr("Commercial purchase order", "वाणिज्यिक खरीद आदेश")}{" "}
                <strong className="font-mono text-foreground">{createdOrder.id}</strong>{" "}
                {tr("has been registered in the marketplace ledger.", "मार्केटप्लेस लेजर में पंजीकृत कर दिया गया है।")}
              </DialogDescription>
            </div>

            {/* Confirmation Summary Card */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-xs shadow-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">{tr("Order ID", "ऑर्डर आईडी")}</span>
                  <span className="font-mono font-bold text-primary">{createdOrder.id}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">{tr("Listing", "लिस्टिंग")}</span>
                  <span className="font-mono font-bold text-foreground">{createdOrder.listingId}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">{tr("Batch ID", "बैच आईडी")}</span>
                  <span className="font-mono font-bold text-foreground">{createdOrder.batchNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">{tr("Status", "स्थिति")}</span>
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 text-[11px] font-medium">
                    {trStatus("Pending")}
                  </Badge>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="text-muted-foreground">{tr("Quantity:", "मात्रा:")}</span>{" "}
                  <strong className="font-mono text-foreground">{createdOrder.quantity.toFixed(1)} {createdOrder.unit}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">{tr("Seller:", "विक्रेता:")}</span>{" "}
                  <strong className="text-foreground">{createdOrder.sellerOrgName}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">{tr("Buyer:", "खरीदार:")}</span>{" "}
                  <strong className="text-foreground">{createdOrder.buyerOrgName}</strong>
                </div>
              </div>
            </div>

            {/* Traceability Note */}
            <div className="rounded-lg border border-border/80 bg-muted/20 p-3 text-[11px] text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                {tr("Batch", "बैच")} <strong>{createdOrder.batchNumber}</strong>{" "}
                {tr(
                  "remains authoritative. No duplicate batch was created, and physical custody transfer has not occurred yet.",
                  "अधिकृत बना रहता है। कोई डुप्लिकेट बैच नहीं बनाया गया, और भौतिक कस्टडी ट्रांसफर अभी नहीं हुआ है।"
                )}
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
                {tr("Close Window", "विंडो बंद करें")}
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
                    {tr("View All Orders", "सभी ऑर्डर देखें")}
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
                    <span>{tr("View Order Record", "ऑर्डर रिकॉर्ड देखें")}</span>
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
