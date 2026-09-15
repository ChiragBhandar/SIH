"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { ListingStatusBadge, OrderStatusBadge } from "@/components/marketplace/marketplace-status-badge";
import { LineageFlowView } from "@/components/marketplace/lineage-flow-view";
import { MarketplaceOrderModal } from "@/components/marketplace/marketplace-order-modal";
import {
  Store,
  ArrowLeft,
  Boxes,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

function ListingDetailContent() {
  const params = useParams();
  const listingId = params?.listingId as string;

  const {
    getMarketplaceListing,
    getMarketplaceOrdersByListing,
    isLoaded,
  } = useTraceability();

  const [isOrderModalOpen, setIsOrderModalOpen] = React.useState(false);

  const listing = getMarketplaceListing(listingId);
  const orders = listing ? getMarketplaceOrdersByListing(listing.id) : [];

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading listing record...
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <EmptyState
          icon={Store}
          title="Marketplace listing not found"
          description={`No material listing found matching ID "${listingId}".`}
          action={
            <Button asChild size="sm">
              <Link href="/marketplace">Back to Marketplace</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const isOrderable = listing.status === "Active" && listing.availableQuantity > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-xs text-muted-foreground hover:text-foreground -ml-2 h-8 gap-1.5"
        >
          <Link href="/marketplace">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Marketplace</span>
          </Link>
        </Button>
      </div>

      {/* Main Listing Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card p-5 sm:p-6 rounded-xl border border-border shadow-xs">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded">
              {listing.id}
            </span>
            <ListingStatusBadge status={listing.status} />
            <Badge variant="outline" className="text-xs font-mono border-primary/30 text-primary">
              {listing.listingType}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {listing.title}
          </h1>
          <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
            <span>Seller: <strong className="text-foreground">{listing.sellerOrgName}</strong></span>
            <span>•</span>
            <span>Origin: <strong className="text-foreground">{listing.originRegion}</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isOrderable && (
            <Button
              onClick={() => setIsOrderModalOpen(true)}
              className="gap-2 text-xs h-9 font-bold shadow-xs"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Place Mock Order</span>
            </Button>
          )}

          <Button asChild variant="outline" size="sm" className="h-9 text-xs gap-1.5">
            <Link href={`/batches/${listing.batchNumber}`}>
              <Boxes className="h-3.5 w-3.5" />
              <span>Authoritative Batch</span>
              <ExternalLink className="h-3 w-3 ml-0.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Specification Attributes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="shadow-xs bg-card border-border/80">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Available Supply
            </span>
            <div className="text-xl font-mono font-bold text-emerald-700">
              {listing.availableQuantity.toFixed(1)} {listing.unit}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Total Produced: {listing.originalQuantity.toFixed(1)} {listing.unit}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card border-border/80">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Honey Variety
            </span>
            <div className="text-sm font-bold text-foreground truncate">
              {listing.honeyVariety}
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              {listing.dominantFlora || "Pure botanical source"}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card border-border/80">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Quality & Verification
            </span>
            <div className="text-xs font-semibold text-foreground truncate">
              {listing.qualityStatus}
            </div>
            <p className="text-[10px] text-primary font-medium truncate">
              {listing.certificateNumber ? `Cert: ${listing.certificateNumber}` : "Single-Source Verified"}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card border-border/80">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Commercial Terms
            </span>
            <div className="text-sm font-mono font-bold text-foreground truncate">
              {listing.pricePerUnit || "B2B Contract Rate"}
            </div>
            <p className="text-[10px] text-muted-foreground">
              Terms: Pre-dispatch inspection
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Material Description & Specification Note */}
      {listing.notes && (
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-2 border-b border-border/60">
            <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wider">
              Material Notes & Processing Specifications
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 pb-3 text-xs text-muted-foreground leading-relaxed">
            {listing.notes}
          </CardContent>
        </Card>
      )}

      {/* Simplified Source & Traceability Lineage */}
      <LineageFlowView
        listing={listing}
        batchUrl={`/batches/${listing.batchNumber}`}
      />

      {/* Orders associated with this listing */}
      {orders.length > 0 && (
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold text-foreground">
                  Order Activity on this Listing ({orders.length})
                </CardTitle>
              </div>
              <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
                <Link href="/marketplace/orders">
                  View All Marketplace Orders →
                </Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-3 space-y-2 text-xs">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-3 rounded-lg border border-border/80 bg-muted/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/marketplace/orders/${ord.id}`}
                      className="font-mono font-bold text-primary hover:underline"
                    >
                      {ord.id}
                    </Link>
                    <OrderStatusBadge status={ord.status} />
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Buyer: <strong>{ord.buyerOrgName}</strong> • Qty: <strong>{ord.quantity} {ord.unit}</strong> • Ref: <code>{ord.buyerReference}</code>
                  </p>
                </div>

                <Button asChild size="sm" variant="outline" className="h-7 text-xs shrink-0">
                  <Link href={`/marketplace/orders/${ord.id}`}>
                    <span>View Order Record →</span>
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Place Order Modal */}
      {isOrderModalOpen && (
        <MarketplaceOrderModal
          listing={listing}
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          onOrderCreated={() => {
            // modal callback
          }}
        />
      )}
    </div>
  );
}

export default function MarketplaceListingDetailPage() {
  return (
    <AuthGuard>
      <AppShell>
        <ListingDetailContent />
      </AppShell>
    </AuthGuard>
  );
}
