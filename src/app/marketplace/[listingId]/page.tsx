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
import { getListingProductImage, getListingPricing } from "@/components/marketplace/marketplace-product-card";
import {
  Store,
  ArrowLeft,
  Boxes,
  ShoppingBag,
  ExternalLink,
  Star,
  ShieldCheck,
  MapPin,
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

import { useLanguage } from "@/context/language-context";

function ListingDetailContent() {
  const { tr, trStatus } = useLanguage();
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
          {tr("Loading listing record...", "लिस्टिंग रिकॉर्ड लोड हो रहा है...")}
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <EmptyState
          icon={Store}
          title={tr("Marketplace listing not found", "मार्केटप्लेस लिस्टिंग नहीं मिली")}
          description={tr(
            `No material listing found matching ID "${listingId}".`,
            `"${listingId}" आईडी से मेल खाती कोई लिस्टिंग नहीं मिली।`
          )}
          action={
            <Button asChild size="sm">
              <Link href="/marketplace">{tr("Back to Marketplace", "मार्केटप्लेस पर वापस")}</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const isOrderable = listing.status === "Active" && listing.availableQuantity > 0;
  const imgSrc = getListingProductImage(listing);
  const { price, mrp, discount } = getListingPricing(listing);

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
            <span>{tr("Back to Marketplace", "मार्केटप्लेस पर वापस")}</span>
          </Link>
        </Button>
      </div>

      {/* Main Listing Header with Image Hero */}
      <div className="bg-card p-5 sm:p-6 rounded-2xl border border-border shadow-xs flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-56 h-56 rounded-xl overflow-hidden shrink-0 border border-border/80 shadow-xs relative bg-muted/40">
          <img
            src={imgSrc}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge className="bg-amber-500 text-slate-950 font-bold text-[10px] uppercase shadow-xs">
              {listing.badge || tr("Verified Pure", "सत्यापित शुद्ध")}
            </Badge>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded">
              {listing.id}
            </span>
            <ListingStatusBadge status={listing.status} />
            <Badge variant="outline" className="text-xs font-mono border-primary/30 text-primary">
              {listing.listingType}
            </Badge>
            <span className="inline-flex items-center gap-1 rounded bg-emerald-600 text-white px-1.5 py-0.5 text-xs font-bold shadow-2xs">
              <span>{(listing.rating || 4.8).toFixed(1)}</span>
              <Star className="h-3 w-3 fill-white" />
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {listing.title}
            </h1>
            <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 mt-1">
              <span>{tr("Seller:", "विक्रेता:")} <strong className="text-foreground">{listing.sellerOrgName}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-amber-500" /> {tr("Origin:", "उत्पत्ति:")} <strong className="text-foreground">{listing.originRegion}</strong></span>
            </p>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-3xl font-black text-foreground font-mono">
              ₹{price.toLocaleString("en-IN")}
            </span>
            <span className="text-sm font-semibold text-muted-foreground">/ {tr("kg", "किग्रा")}</span>
            <span className="text-sm text-muted-foreground line-through font-mono ml-2">₹{mrp}</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{discount}% {tr("OFF", "छूट")}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {isOrderable && (
              <Button
                onClick={() => setIsOrderModalOpen(true)}
                className="gap-2 text-xs h-9 font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{tr("Place Order", "ऑर्डर दें")}</span>
              </Button>
            )}

            <Button asChild variant="outline" size="sm" className="h-9 text-xs gap-1.5">
              <Link href={`/batches/${listing.batchNumber}`}>
                <Boxes className="h-3.5 w-3.5" />
                <span>{tr("Authoritative Batch", "प्रामाणिक बैच")}</span>
                <ExternalLink className="h-3 w-3 ml-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Specification Attributes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="shadow-xs bg-card border-border/80">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              {tr("Available Supply", "उपलब्ध आपूर्ति")}
            </span>
            <div className="text-xl font-mono font-bold text-emerald-700">
              {listing.availableQuantity.toFixed(1)} {tr(listing.unit, listing.unit)}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {tr("Total Produced:", "कुल उत्पादन:")} {listing.originalQuantity.toFixed(1)} {tr(listing.unit, listing.unit)}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card border-border/80">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              {tr("Honey Variety", "शहद की किस्म")}
            </span>
            <div className="text-sm font-bold text-foreground truncate">
              {listing.honeyVariety}
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              {listing.dominantFlora || tr("Pure botanical source", "शुद्ध वानस्पतिक स्रोत")}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card border-border/80">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              {tr("Quality & Verification", "गुणवत्ता एवं सत्यापन")}
            </span>
            <div className="text-xs font-semibold text-foreground truncate">
              {trStatus(listing.qualityStatus)}
            </div>
            <p className="text-[10px] text-primary font-medium truncate">
              {listing.certificateNumber ? `${tr("Cert:", "प्रमाणपत्र:")} ${listing.certificateNumber}` : tr("Single-Source Verified", "एकल-स्रोत सत्यापित")}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs bg-card border-border/80">
          <CardContent className="p-4 space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
              {tr("Commercial Terms", "व्यावसायिक शर्तें")}
            </span>
            <div className="text-sm font-mono font-bold text-foreground truncate">
              {listing.pricePerUnit || tr("B2B Contract Rate", "बी2बी अनुबंध दर")}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {tr("Terms: Pre-dispatch inspection", "शर्तें: प्रेषण पूर्व निरीक्षण")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Material Description & Specification Note */}
      {listing.notes && (
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-2 border-b border-border/60">
            <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wider">
              {tr("Material Notes & Processing Specifications", "सामग्री नोट्स एवं प्रसंस्करण विनिर्देश")}
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
                  {tr("Order Activity on this Listing", "इस लिस्टिंग पर ऑर्डर गतिविधि")} ({orders.length})
                </CardTitle>
              </div>
              <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
                <Link href="/marketplace/orders">
                  {tr("View All Marketplace Orders →", "सभी मार्केटप्लेस ऑर्डर देखें →")}
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
                    {tr("Buyer:", "क्रेता:")} <strong>{ord.buyerOrgName}</strong> • {tr("Qty:", "मात्रा:")} <strong>{ord.quantity} {tr(ord.unit, ord.unit)}</strong> • {tr("Ref:", "संदर्भ:")} <code>{ord.buyerReference}</code>
                  </p>
                </div>

                <Button asChild size="sm" variant="outline" className="h-7 text-xs shrink-0">
                  <Link href={`/marketplace/orders/${ord.id}`}>
                    <span>{tr("View Order Record →", "ऑर्डर रिकॉर्ड देखें →")}</span>
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
  const { tr } = useLanguage();
  return (
    <AuthGuard>
      <AppShell
        breadcrumbs={[
          { label: tr("Honey Chain", "हनी चेन"), href: "/dashboard" },
          { label: tr("Marketplace", "मार्केटप्लेस"), href: "/marketplace" },
          { label: tr("Listing Detail", "लिस्टिंग विवरण"), active: true },
        ]}
        defaultNavId="marketplace"
      >
        <ListingDetailContent />
      </AppShell>
    </AuthGuard>
  );
}
