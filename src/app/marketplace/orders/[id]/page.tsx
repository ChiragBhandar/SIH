"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
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
          Loading order record...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Marketplace order not found"
          description={`No purchase order found matching ID "${orderId}".`}
          action={
            <Button asChild size="sm">
              <Link href="/marketplace/orders">Back to Orders</Link>
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
            <span>Back to Marketplace Orders</span>
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
              Commercial Mock Order
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Referencing material listing{" "}
            <Link href={`/marketplace/${order.listingId}`} className="font-mono text-foreground font-semibold hover:underline">
              {order.listingId}
            </Link>{" "}
            and batch{" "}
            <Link href={`/batches/${order.batchNumber}`} className="font-mono text-primary font-semibold hover:underline">
              {order.batchNumber}
            </Link>
          </p>
        </div>

        {/* Action Buttons for MVP Simulation */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {isPending && (
            <>
              <Button
                size="sm"
                onClick={() => setIsAcceptOpen(true)}
                className="h-8 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Accept Order</span>
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => setIsRejectOpen(true)}
                className="h-8 text-xs font-semibold gap-1.5"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Reject Order</span>
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
              <span>Cancel Order</span>
            </Button>
          )}

          <Button asChild variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <Link href={`/batches/${order.batchNumber}`}>
              <Boxes className="h-3.5 w-3.5" />
              <span>View Batch</span>
              <ExternalLink className="h-3 w-3 ml-0.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Commercial vs Custody Info Banner */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 text-xs flex items-start gap-2.5">
        <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-primary">Commercial Order vs Physical Custody Transfer</p>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            This order records a commercial marketplace contract. Batch identity <strong>{order.batchNumber}</strong> remains authoritative and intact. An order does NOT create a duplicate batch or automatically mark the batch as physically transferred.
          </p>
        </div>
      </div>

      {/* Rejection / Cancellation Notes Alert */}
      {order.rejectionReason && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-rose-800 dark:text-rose-300">Order Rejection Reason:</strong>
            <p className="text-rose-700 dark:text-rose-300 text-[11px] mt-0.5">{order.rejectionReason}</p>
          </div>
        </div>
      )}

      {order.cancellationReason && (
        <div className="rounded-xl border border-muted bg-muted/40 p-3.5 text-xs flex items-start gap-2.5">
          <Ban className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <strong className="text-foreground">Order Cancellation Reason:</strong>
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
              <CardTitle className="text-sm font-bold text-foreground">Commercial Parties</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-3 pb-4 space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-muted/20 border border-border/80 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                Buyer Party
              </span>
              <div className="font-bold text-foreground text-sm">{order.buyerOrgName}</div>
              <div className="text-[11px] text-muted-foreground">
                Representative: <strong>{order.buyerContactName}</strong>
              </div>
              <div className="text-[11px] font-mono text-muted-foreground">
                PO Reference: <strong className="text-foreground">{order.buyerReference}</strong>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/20 border border-border/80 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                Seller Party
              </span>
              <div className="font-bold text-foreground text-sm">{order.sellerOrgName}</div>
              <div className="text-[11px] text-muted-foreground">
                Commercial Reference: <strong>{order.listingId}</strong>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Material & Order Parameters Card */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold text-foreground">Material Commitment</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-3 pb-4 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-muted/20 border border-border/80">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                  Authoritative Batch ID
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
                  Ordered Quantity
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {order.quantity.toFixed(1)} {order.unit}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1 text-muted-foreground text-xs">
              <div>
                <strong className="text-foreground">Destination / Delivery Location:</strong>
                <p className="text-[11px] mt-0.5">{order.deliveryLocation}</p>
              </div>
              <div>
                <strong className="text-foreground">Requested Delivery Date:</strong>{" "}
                <span>{order.requestedDeliveryDate}</span>
              </div>
              {order.notes && (
                <div>
                  <strong className="text-foreground">Commercial Notes:</strong>
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
                Order Lifecycle Timeline
              </CardTitle>
              <CardDescription className="text-xs">
                Sequential progression of commercial agreement and subsequent fulfillment milestones.
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
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                        : isCurrent
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 animate-pulse"
                        : "bg-muted border-border text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? "✓" : idx + 1}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground">{step.step}</span>
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
            Commercial Audit Trail (Append-Only)
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
                  <span className="text-muted-foreground">• Actor: <strong className="text-foreground">{entry.actor}</strong></span>
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
