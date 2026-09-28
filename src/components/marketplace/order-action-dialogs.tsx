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
import { useLanguage } from "@/context/language-context";

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
  const { tr } = useLanguage();
  const [notes, setNotes] = React.useState(
    tr(
      "Order accepted. Material batch reserved for dispatch.",
      "ऑर्डर स्वीकृत। प्रेषण के लिए सामग्री बैच आरक्षित कर दिया गया है।"
    )
  );

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
                <DialogTitle className="text-base font-bold">
                  {tr("Accept Marketplace Order", "मार्केटप्लेस ऑर्डर स्वीकृत करें")}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {tr("Confirm acceptance of order", "ऑर्डर स्वीकृति की पुष्टि करें")}{" "}
                  <strong className="font-mono">{order.id}</strong> {tr("for", "हेतु")}{" "}
                  {order.quantity} {order.unit}.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-3 rounded-lg bg-muted/20 border border-border/80 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{tr("Buyer:", "खरीदार:")}</span>
              <strong className="text-foreground">{order.buyerOrgName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{tr("Batch ID:", "बैच आईडी:")}</span>
              <strong className="font-mono text-foreground">{order.batchNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{tr("Quantity:", "मात्रा:")}</span>
              <strong className="font-mono text-emerald-700">{order.quantity} {order.unit}</strong>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-xs font-semibold text-foreground">
              {tr("Seller Confirmation Notes (Optional)", "विक्रेता पुष्टि टिप्पणी (वैकल्पिक)")}
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="text-xs resize-none"
              placeholder={tr(
                "e.g. Confirmed for shipping via Solan Logistics Bay 3...",
                "उदा. सोलन लॉजिस्टिक्स बे 3 के माध्यम से शिपिंग के लिए पुष्ट..."
              )}
            />
          </div>

          <DialogFooter className="pt-2 sm:justify-between gap-2 border-t border-border/60">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs h-8">
              {tr("Cancel", "रद्द करें")}
            </Button>
            <Button type="submit" size="sm" className="text-xs h-8 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white">
              {tr("Confirm Acceptance", "स्वीकृति की पुष्टि करें")}
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
  const { tr } = useLanguage();
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError(tr("Rejection reason is mandatory.", "अस्वीकृति का कारण अनिवार्य है।"));
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
                <DialogTitle className="text-base font-bold">
                  {tr("Reject Marketplace Order", "मार्केटप्लेस ऑर्डर अस्वीकृत करें")}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {tr(
                    "Rejection requires a documented commercial or logistic reason.",
                    "अस्वीकृति के लिए एक प्रलेखित वाणिज्यिक या लॉजिस्टिक कारण आवश्यक है।"
                  )}
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
              <span className="text-muted-foreground">{tr("Order ID:", "ऑर्डर आईडी:")}</span>
              <strong className="font-mono text-foreground">{order.id}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{tr("Buyer:", "खरीदार:")}</span>
              <strong className="text-foreground">{order.buyerOrgName}</strong>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>{tr("Rejection Reason (Required)", "अस्वीकृति का कारण (अनिवार्य)")}</span>
              <span className="text-rose-500 text-[10px]">*{tr("Required", "अनिवार्य")}</span>
            </label>
            <Textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setError(null);
              }}
              rows={3}
              className="text-xs resize-none"
              placeholder={tr(
                "e.g. Batch reserved for contract supply; requested delivery window not feasible...",
                "उदा. बैच अनुबंध आपूर्ति के लिए आरक्षित है; अनुरोधित डिलीवरी संभव नहीं है..."
              )}
              required
            />
          </div>

          <DialogFooter className="pt-2 sm:justify-between gap-2 border-t border-border/60">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs h-8">
              {tr("Back", "वापस")}
            </Button>
            <Button type="submit" size="sm" variant="destructive" className="text-xs h-8 font-semibold">
              {tr("Reject Order", "ऑर्डर अस्वीकृत करें")}
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
  const { tr } = useLanguage();
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError(tr("Cancellation reason is mandatory.", "रद्दीकरण का कारण अनिवार्य है।"));
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
                <DialogTitle className="text-base font-bold">
                  {tr("Cancel Marketplace Order", "मार्केटप्लेस ऑर्डर रद्द करें")}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {tr(
                    "Buyer cancellation will be recorded in the order audit history.",
                    "खरीदार द्वारा रद्दीकरण ऑर्डर ऑडिट इतिहास में दर्ज किया जाएगा।"
                  )}
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
              <span className="text-muted-foreground">{tr("Order ID:", "ऑर्डर आईडी:")}</span>
              <strong className="font-mono text-foreground">{order.id}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{tr("Batch ID:", "बैच आईडी:")}</span>
              <strong className="font-mono text-foreground">{order.batchNumber}</strong>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>{tr("Cancellation Reason (Required)", "रद्दीकरण का कारण (अनिवार्य)")}</span>
              <span className="text-rose-500 text-[10px]">*{tr("Required", "अनिवार्य")}</span>
            </label>
            <Textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setError(null);
              }}
              rows={3}
              className="text-xs resize-none"
              placeholder={tr(
                "e.g. Project schedule changed; duplicate purchase order...",
                "उदा. परियोजना कार्यक्रम बदला; दोहरा खरीद आदेश..."
              )}
              required
            />
          </div>

          <DialogFooter className="pt-2 sm:justify-between gap-2 border-t border-border/60">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs h-8">
              {tr("Keep Order", "ऑर्डर रखें")}
            </Button>
            <Button type="submit" size="sm" variant="destructive" className="text-xs h-8 font-semibold">
              {tr("Confirm Cancellation", "रद्दीकरण की पुष्टि करें")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
