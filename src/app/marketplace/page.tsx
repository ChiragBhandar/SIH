"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { MarketplaceListing } from "@/types/marketplace";
import { ListingStatusBadge } from "@/components/marketplace/marketplace-status-badge";
import { MarketplaceOrderModal } from "@/components/marketplace/marketplace-order-modal";
import {
  Store,
  Boxes,
  ShoppingBag,
  Clock,
  Search,
  ExternalLink,
  Wheat,
  Layers,
  Info,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";

function MarketplaceContent() {
  const { marketplaceListings, marketplaceOrders, isLoaded } = useTraceability();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards");

  // Order modal state
  const [activeListingForOrder, setActiveListingForOrder] = React.useState<MarketplaceListing | null>(null);

  // Summary counts
  const activeListingsCount = marketplaceListings.filter((l) => l.status === "Active").length;
  const availableBatchesCount = new Set(marketplaceListings.map((l) => l.batchNumber)).size;
  const ordersPlacedCount = marketplaceOrders.length;
  const pendingOrdersCount = marketplaceOrders.filter((o) => o.status === "Pending").length;

  // Filtered listings
  const filteredListings = React.useMemo(() => {
    return marketplaceListings.filter((listing) => {
      const matchesSearch =
        searchQuery === "" ||
        listing.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.sellerOrgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.honeyVariety.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        selectedType === "all" ||
        (selectedType === "raw" && (listing.listingType.includes("Raw") || listing.lineageType === "raw")) ||
        (selectedType === "processed" && (listing.listingType.includes("Processed") || listing.lineageType === "processed"));

      const matchesStatus =
        selectedStatus === "all" || listing.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [marketplaceListings, searchQuery, selectedType, selectedStatus]);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading traceable marketplace listings...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Domain Distinction */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-card p-6 rounded-xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[11px] font-semibold text-primary border-primary/30 bg-primary/10 gap-1">
              <Store className="h-3 w-3" />
              B2B Traceable Materials & Products
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-mono">
              Commercial Ledger
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Marketplace</h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Browse eligible traceable material and approved product listings. Order commitments link directly to authoritative honey batches without duplicating records or mutating material lineage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button asChild variant="outline" size="sm">
            <Link href="/marketplace/orders">
              <ShoppingBag className="h-4 w-4 text-primary" />
              <span>View Orders ({marketplaceOrders.length})</span>
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/batches">
              <Boxes className="h-4 w-4" />
              <span>Honey Batches</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Active Listings
              </span>
              <div className="text-2xl font-bold text-foreground font-mono">{activeListingsCount}</div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                Ready for procurement
              </span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Store className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Available Batches
              </span>
              <div className="text-2xl font-bold text-foreground font-mono">{availableBatchesCount}</div>
              <span className="text-[10px] text-muted-foreground">Authoritative identities</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Boxes className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Orders Placed
              </span>
              <div className="text-2xl font-bold text-foreground font-mono">{ordersPlacedCount}</div>
              <span className="text-[10px] text-muted-foreground">Commercial transactions</span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Pending Orders
              </span>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">
                {pendingOrdersCount}
              </div>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                Awaiting seller response
              </span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commercial vs Custody Rule Callout */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5 sm:mt-0" />
          <span className="text-muted-foreground">
            <strong className="text-foreground">Commercial Protocol:</strong> Marketplace orders create legally-binding purchase records referencing authoritative batch records. Physical material transfer remains a separate custody transfer event.
          </span>
        </div>
        <Badge variant="outline" className="font-mono text-[10px] shrink-0 border-primary/30 text-primary">
          Non-Mutating Batch Reference
        </Badge>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3.5 rounded-lg border border-border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search listings, batch number, seller, or honey variety..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Material Type filter */}
          <Tabs value={selectedType} onValueChange={setSelectedType} className="w-auto">
            <TabsList className="h-9 p-1">
              <TabsTrigger value="all" className="text-xs">All Materials</TabsTrigger>
              <TabsTrigger value="raw" className="text-xs">Raw Honey</TabsTrigger>
              <TabsTrigger value="processed" className="text-xs">Processed</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="draft">Draft</option>
          </select>

          {/* View toggle */}
          <div className="hidden md:flex border border-border rounded-lg p-0.5">
            <Button
              type="button"
              variant={viewMode === "cards" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="h-7 text-xs px-2.5"
            >
              Cards
            </Button>
            <Button
              type="button"
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-7 text-xs px-2.5"
            >
              Table
            </Button>
          </div>
        </div>
      </div>

      {/* Listing Views */}
      {filteredListings.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No marketplace listings found"
          description="Try adjusting your search query or material status filter."
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedType("all");
                setSelectedStatus("all");
              }}
            >
              Clear Filters
            </Button>
          }
        />
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map((listing) => {
            const isOrderable = listing.status === "Active" && listing.availableQuantity > 0;
            const isRaw = listing.lineageType === "raw" || listing.listingType.includes("Raw");

            return (
              <Card
                key={listing.id}
                className="border-border bg-card shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-foreground">
                            {listing.id}
                          </span>
                          <ListingStatusBadge status={listing.status} />
                        </div>
                        <CardTitle className="text-sm font-bold text-foreground">
                          {listing.title}
                        </CardTitle>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-mono shrink-0 gap-1"
                      >
                        {isRaw ? <Wheat className="h-3 w-3 text-amber-600" /> : <Layers className="h-3 w-3 text-primary" />}
                        {listing.listingType}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-3 pb-3 space-y-3 text-xs">
                    {/* Key Attributes */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/20 border border-border/70">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                          Authoritative Batch
                        </span>
                        <Link
                          href={`/batches/${listing.batchNumber}`}
                          className="font-mono font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          <span>{listing.batchNumber}</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                          Available Stock
                        </span>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {listing.availableQuantity.toFixed(1)} {listing.unit}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Seller:</span>
                        <strong className="text-foreground font-medium">{listing.sellerOrgName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Variety:</span>
                        <strong className="text-foreground font-medium">{listing.honeyVariety}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Traceability:</span>
                        <span className="text-primary font-medium">{listing.traceabilityStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quality Rating:</span>
                        <span className="text-foreground">{listing.qualityStatus}</span>
                      </div>
                      {listing.pricePerUnit && (
                        <div className="flex justify-between pt-1 border-t border-border/50">
                          <span>Listing Rate:</span>
                          <strong className="font-mono text-foreground">{listing.pricePerUnit}</strong>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>

                <div className="p-3 bg-muted/10 border-t border-border/60 flex items-center justify-between gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/marketplace/${listing.id}`}>
                      <span>View Listing</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>

                  {isOrderable && (
                    <Button
                      size="sm"
                      onClick={() => setActiveListingForOrder(listing)}
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Place Order</span>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <Card className="border-border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="text-[11px] bg-muted/40">
                <TableHead className="font-semibold">Listing ID</TableHead>
                <TableHead className="font-semibold">Product / Material</TableHead>
                <TableHead className="font-semibold">Authoritative Batch</TableHead>
                <TableHead className="font-semibold">Seller Organisation</TableHead>
                <TableHead className="font-semibold">Variety</TableHead>
                <TableHead className="font-semibold text-right">Available</TableHead>
                <TableHead className="font-semibold">Traceability</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredListings.map((listing) => {
                const isOrderable = listing.status === "Active" && listing.availableQuantity > 0;
                return (
                  <TableRow key={listing.id} className="text-xs hover:bg-muted/30">
                    <TableCell className="font-mono font-bold text-foreground">
                      <Link href={`/marketplace/${listing.id}`} className="hover:underline">
                        {listing.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{listing.title}</div>
                      <span className="text-[10px] text-muted-foreground">{listing.listingType}</span>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/batches/${listing.batchNumber}`}
                        className="font-mono text-primary hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>{listing.batchNumber}</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{listing.sellerOrgName}</TableCell>
                    <TableCell className="text-foreground">{listing.honeyVariety}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {listing.availableQuantity.toFixed(1)} {listing.unit}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                        {listing.traceabilityStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ListingStatusBadge status={listing.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                          <Link href={`/marketplace/${listing.id}`}>View</Link>
                        </Button>
                        {isOrderable && (
                          <Button
                            size="sm"
                            onClick={() => setActiveListingForOrder(listing)}
                            className="h-7 text-xs font-semibold"
                          >
                            Order
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Place Order Modal */}
      {activeListingForOrder && (
        <MarketplaceOrderModal
          listing={activeListingForOrder}
          isOpen={!!activeListingForOrder}
          onClose={() => setActiveListingForOrder(null)}
          onOrderCreated={() => {
            // refresh or keep state
          }}
        />
      )}
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <AuthGuard>
      <AppShell>
        <MarketplaceContent />
      </AppShell>
    </AuthGuard>
  );
}
