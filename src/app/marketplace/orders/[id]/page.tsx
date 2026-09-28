"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { useLanguage } from "@/context/language-context";
import { OrderStatusBadge } from "@/components/marketplace/marketplace-status-badge";
import {
  AcceptOrderDialog,
  RejectOrderDialog,
  CancelOrderDialog,
} from "@/components/marketplace/order-action-dialogs";
import {
  ShoppingBag,
  ArrowLeft,
  Boxes,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  ExternalLink,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

function OrderDetailContent() {
  const params = useParams();
  const orderId = params?.id as string;
  const { tr, trStatus } = useLanguage();

  const {
    getMarketplaceOrder,
    acceptMarketplaceOrder,
    rejectMarketplaceOrder,
    cancelMarketplaceOrder,
    isLoaded,
  } = useTraceability();

  // Action dialog states
  const [isAcceptOpen, setIsAcceptOpen] = React.useState(false);
  const [isRejectOpen, setIsRejectOpen] = React.useState(false);
  const [isCancelOpen, setIsCancelOpen] = React.useState(false);

  const order = getMarketplaceOrder(orderId);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          {tr("Loading order record...", "ऑर्डर रिकॉर्ड लोड हो रहा है...")}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <EmptyState
          icon={ShoppingBag}
          title={tr("Marketplace order not found", "मार्केटप्लेस ऑर्डर नहीं मिला")}
          description={tr(
            `No purchase order found matching ID "${orderId}".`,
            `आईडी "${orderId}" से मेल खाता कोई खरीद ऑर्डर नहीं मिला।`
          )}
          action={
            <Button asChild size="sm">
              <Link href="/marketplace/orders">{tr("Back to Orders", "ऑर्डर पर वापस जाएं")}</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const isPending = order.status === "Pending";
  const isAccepted = order.status === "Accepted";

  const handleAccept = (notes?: string) => {
    acceptMarketplaceOrder(order.id, notes);
  };

  const handleReject = (reason: string) => {
    rejectMarketplaceOrder(order.id, reason);
  };

  const handleCancel = (reason: string) => {
    cancelMarketplaceOrder(order.id, reason);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back navigation */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-xs text-muted-foreground hover:text-foreground -ml-2 h-8 gap-1.5"
        >
          <Link href="/marketplace/orders">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{tr("Back to Marketplace Orders", "मार्केटप्लेस ऑर्डर पर वापस")}</span>
          </Link>
        </Button>
      </div>

      {/* Main Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card p-5 sm:p-6 rounded-xl border border-border shadow-xs">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">
              {order.id}
            </h1>
            <OrderStatusBadge status={order.status} />
            <Badge variant="outline" className="text-xs font-mono border-primary/30 text-primary">
              {tr("Commercial Purchase Order", "वाणिज्यिक खरीद ऑर्डर")}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {tr("Referencing material listing", "सामग्री लिस्टिंग संदर्भ")}{" "}
            <Link href={`/marketplace/${order.listingId}`} className="font-mono text-foreground font-semibold hover:underline">
              {order.listingId}
            </Link>{" "}
            {tr("and batch", "एवं बैच")}{" "}
            <Link href={`/batches/${order.batchNumber}`} className="font-mono text-primary font-semibold hover:underline">
              {order.batchNumber}
            </Link>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {isPending && (
            <>
              <Button
                size="sm"
                onClick={() => setIsAcceptOpen(true)}
                className="h-8 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{tr("Accept Order", "ऑर्डर स्वीकार करें")}</span>
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => setIsRejectOpen(true)}
                className="h-8 text-xs font-semibold gap-1.5"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>{tr("Reject Order", "ऑर्डर अस्वीकार करें")}</span>
              </Button>
            </>
          )}

          {(isPending || isAccepted) && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsCancelOpen(true)}
              className="h-8 text-xs text-rose-600 hover:text-rose-700 border-rose-500/30 hover:bg-rose-500/10 gap-1.5"
            >
              <Ban className="h-3.5 w-3.5" />
              <span>{tr("Cancel Order", "ऑर्डर रद्द करें")}</span>
            </Button>
          )}

          <Button asChild variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <Link href={`/batches/${order.batchNumber}`}>
              <Boxes className="h-3.5 w-3.5" />
              <span>{tr("View Batch", "बैच देखें")}</span>
              <ExternalLink className="h-3 w-3 ml-0.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Commercial vs Custody Info Banner */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 text-xs flex items-start gap-2.5">
        <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-primary">
            {tr("Commercial Order vs Physical Custody Transfer", "वाणिज्यिक ऑर्डर बनाम भौतिक कस्टडी ट्रांसफर")}
          </p>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            {tr(
              "This order records a commercial marketplace contract. Batch identity remains authoritative and intact. An order does NOT create a duplicate batch or automatically mark the batch as physically transferred.",
              "यह ऑर्डर एक वाणिज्यिक मार्केटप्लेस अनुबंध दर्ज करता है। बैच पहचान अधिकृत और अक्षुण्ण रहती है। ऑर्डर डुप्लिकेट बैच नहीं बनाता है और न ही बैच को स्वचालित रूप से भौतिक रूप से स्थानांतरित चिह्नित करता है।"
            )}
          </p>
        </div>
      </div>

      {/* Rejection / Cancellation Notes Alert */}
      {order.rejectionReason && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-rose-900">{tr("Order Rejection Reason:", "ऑर्डर अस्वीकृति कारण:")}</strong>
            <p className="text-rose-800 text-[11px] mt-0.5">{order.rejectionReason}</p>
          </div>
        </div>
      )}

      {order.cancellationReason && (
        <div className="rounded-xl border border-muted bg-muted/40 p-3.5 text-xs flex items-start gap-2.5">
          <Ban className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <strong className="text-foreground">{tr("Order Cancellation Reason:", "ऑर्डर रद्दीकरण कारण:")}</strong>
            <p className="text-muted-foreground text-[11px] mt-0.5">{order.cancellationReason}</p>
          </div>
        </div>
      )}

      {/* Key Specification Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Parties Card */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold text-foreground">
                {tr("Commercial Parties", "व्यावसायिक पक्षकार")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-3 pb-4 space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-muted/20 border border-border/80 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                {tr("Buyer Party", "खरीदार पक्ष")}
              </span>
              <div className="font-bold text-foreground text-sm">{order.buyerOrgName}</div>
              <div className="text-[11px] text-muted-foreground">
                {tr("Representative:", "प्रतिनिधि:")} <strong>{order.buyerContactName}</strong>
              </div>
              <div className="text-[11px] font-mono text-muted-foreground">
                {tr("PO Reference:", "पीओ संदर्भ:")} <strong className="text-foreground">{order.buyerReference}</strong>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/20 border border-border/80 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                {tr("Seller Party", "विक्रेता पक्ष")}
              </span>
              <div className="font-bold text-foreground text-sm">{order.sellerOrgName}</div>
              <div className="text-[11px] text-muted-foreground">
                {tr("Commercial Reference:", "वाणिज्यिक संदर्भ:")} <strong>{order.listingId}</strong>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Material & Order Parameters Card */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold text-foreground">
                {tr("Material Commitment", "सामग्री प्रतिबद्धता")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-3 pb-4 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-muted/20 border border-border/80">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                  {tr("Authoritative Batch ID", "अधिकृत बैच आईडी")}
                </span>
                <Link
                  href={`/batches/${order.batchNumber}`}
                  className="font-mono font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>{order.batchNumber}</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </Link>
              </div>

              <div className="p-2.5 rounded-lg bg-muted/20 border border-border/80">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                  {tr("Ordered Quantity", "ऑर्डर की गई मात्रा")}
                </span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
                  {order.quantity.toFixed(1)} {order.unit}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1 text-muted-foreground text-xs">
              <div>
                <strong className="text-foreground">{tr("Destination / Delivery Location:", "गंतव्य / वितरण स्थान:")}</strong>
                <p className="text-[11px] mt-0.5">{order.deliveryLocation}</p>
              </div>
              <div>
                <strong className="text-foreground">{tr("Requested Delivery Date:", "अनुरोधित वितरण तिथि:")}</strong>{" "}
                <span>{order.requestedDeliveryDate}</span>
              </div>
              {order.notes && (
                <div>
                  <strong className="text-foreground">{tr("Commercial Notes:", "वाणिज्यिक टिप्पणी:")}</strong>
                  <p className="text-[11px] mt-0.5">{order.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ORDER TIMELINE */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <div>
              <CardTitle className="text-sm font-bold text-foreground">
                {tr("Order Lifecycle Timeline", "ऑर्डर जीवनचक्र समयरेखा")}
              </CardTitle>
              <CardDescription className="text-xs">
                {tr(
                  "Sequential progression of commercial agreement and subsequent fulfillment milestones.",
                  "वाणिज्यिक समझौते और आगामी पूर्ति चरणों की अनुक्रमिक प्रगति।"
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5 pb-6">
          <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-3 before:sm:left-4 before:top-2 before:bottom-3 before:w-0.5 before:bg-border">
            {order.timeline.map((step, idx) => {
              const isCompleted = step.status === "completed";
              const isCurrent = step.status === "current";

              return (
                <div key={idx} className="relative group">
                  <div
                    className={`absolute -left-6 sm:-left-8 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold ${
                      isCompleted
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : isCurrent
                        ? "bg-amber-50 border-amber-300 text-amber-800 animate-pulse"
                        : "bg-muted border-border text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? "✓" : idx + 1}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground">{tr(step.step, step.step)}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{step.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Status History (Append-only) */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-2 border-b border-border/60">
          <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wider">
            {tr("Commercial Audit Trail (Append-Only)", "वाणिज्यिक ऑडिट ट्रेल (केवल-जोड़ने योग्य)")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 pb-3 space-y-2 text-xs">
          {order.statusHistory.map((entry, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg border border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px]"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <OrderStatusBadge status={entry.status} className="text-[10px] py-0" />
                  <span className="text-muted-foreground">
                    • {tr("Actor:", "कर्ता:")} <strong className="text-foreground">{entry.actor}</strong>
                  </span>
                </div>
                {entry.notes && <p className="text-muted-foreground">{entry.notes}</p>}
              </div>
              <span className="font-mono text-muted-foreground text-[10px] shrink-0">
                {entry.timestamp.replace("T", " ").substring(0, 19)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Dialogs */}
      {isAcceptOpen && (
        <AcceptOrderDialog
          order={order}
          isOpen={isAcceptOpen}
          onClose={() => setIsAcceptOpen(false)}
          onConfirm={handleAccept}
        />
      )}

      {isRejectOpen && (
        <RejectOrderDialog
          order={order}
          isOpen={isRejectOpen}
          onClose={() => setIsRejectOpen(false)}
          onConfirm={handleReject}
        />
      )}

      {isCancelOpen && (
        <CancelOrderDialog
          order={order}
          isOpen={isCancelOpen}
          onClose={() => setIsCancelOpen(false)}
          onConfirm={handleCancel}
        />
      )}
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <AuthGuard>
      <AppShell>
        <OrderDetailContent />
      </AppShell>
    </AuthGuard>
  );
}
