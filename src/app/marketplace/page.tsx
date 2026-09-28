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
  MarketplaceProductCard,
  getListingProductImage,
  getListingPricing,
} from "@/components/marketplace/marketplace-product-card";
import { useLanguage } from "@/context/language-context";
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
  Star,
  ArrowUpDown,
  Filter,
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
  const { tr, trStatus } = useLanguage();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<string>("featured");
  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards");

  // Order modal state
  const [activeListingForOrder, setActiveListingForOrder] = React.useState<MarketplaceListing | null>(null);

  // Summary counts
  const activeListingsCount = marketplaceListings.filter((l) => l.status === "Active").length;
  const availableBatchesCount = new Set(marketplaceListings.map((l) => l.batchNumber)).size;
  const ordersPlacedCount = marketplaceOrders.length;
  const pendingOrdersCount = marketplaceOrders.filter((o) => o.status === "Pending").length;

  // Filtered and sorted listings
  const filteredListings = React.useMemo(() => {
    const list = marketplaceListings.filter((listing) => {
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

    return list.sort((a, b) => {
      const pricingA = getListingPricing(a);
      const pricingB = getListingPricing(b);
      if (sortBy === "price-asc") return pricingA.price - pricingB.price;
      if (sortBy === "price-desc") return pricingB.price - pricingA.price;
      if (sortBy === "rating") return (b.rating || 4.5) - (a.rating || 4.5);
      if (sortBy === "stock") return b.availableQuantity - a.availableQuantity;
      return 0; // featured
    });
  }, [marketplaceListings, searchQuery, selectedType, selectedStatus, sortBy]);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          {tr("Loading traceable marketplace listings...", "ट्रेसेबल मार्केटप्लेस लिस्टिंग लोड हो रही है...")}
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
              {tr("B2B Traceable Materials & Products", "B2B ट्रेसेबल सामग्री एवं उत्पाद")}
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-mono">
              {tr("Commercial Ledger", "वाणिज्यिक खाता बही")}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {tr("Marketplace", "बाजार (मार्केटप्लेस)")}
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            {tr(
              "Browse eligible traceable material and approved product listings. Order commitments link directly to authoritative honey batches without duplicating records or mutating material lineage.",
              "पात्र ट्रेस करने योग्य सामग्री और अनुमोदित उत्पाद लिस्टिंग ब्राउज़ करें। ऑर्डर सीधे प्रमाणित बैचों से जुड़े होते हैं।"
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button asChild variant="outline" size="sm">
            <Link href="/marketplace/orders">
              <ShoppingBag className="h-4 w-4 text-primary" />
              <span>{tr("View Orders", "ऑर्डर देखें")} ({marketplaceOrders.length})</span>
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/batches">
              <Boxes className="h-4 w-4" />
              <span>{tr("Honey Batches", "शहद बैच")}</span>
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
                {tr("Active Listings", "सक्रिय लिस्टिंग")}
              </span>
              <div className="text-2xl font-bold text-foreground font-mono">{activeListingsCount}</div>
              <span className="text-[10px] text-emerald-700 font-medium">
                {tr("Ready for procurement", "खरीद हेतु उपलब्ध")}
              </span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Store className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                {tr("Available Batches", "उपलब्ध बैच")}
              </span>
              <div className="text-2xl font-bold text-foreground font-mono">{availableBatchesCount}</div>
              <span className="text-[10px] text-muted-foreground">
                {tr("Authoritative identities", "प्रमाणित पहचान")}
              </span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-700 border border-orange-200">
              <Boxes className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                {tr("Orders Placed", "किए गए ऑर्डर")}
              </span>
              <div className="text-2xl font-bold text-foreground font-mono">{ordersPlacedCount}</div>
              <span className="text-[10px] text-muted-foreground">
                {tr("Commercial transactions", "व्यावसायिक लेनदेन")}
              </span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                {tr("Pending Orders", "लंबित ऑर्डर")}
              </span>
              <div className="text-2xl font-bold text-foreground font-mono">
                {pendingOrdersCount}
              </div>
              <span className="text-[10px] text-amber-800 font-medium">
                {tr("Awaiting seller response", "विक्रेता प्रतिक्रिया प्रतीक्षारत")}
              </span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commercial vs Custody Rule Callout */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5 sm:mt-0" />
          <span className="text-muted-foreground">
            <strong className="text-foreground">{tr("Commercial Protocol:", "व्यावसायिक प्रोटोकॉल:")}</strong>{" "}
            {tr(
              "Marketplace orders create legally-binding purchase records referencing authoritative batch records. Physical material transfer remains a separate custody transfer event.",
              "मार्केटप्लेस ऑर्डर कानूनी रूप से बाध्यकारी खरीद रिकॉर्ड बनाते हैं। भौतिक सामग्री स्थानांतरण एक अलग कस्टडी ट्रांसफर घटना रहती है।"
            )}
          </span>
        </div>
        <Badge variant="outline" className="font-mono text-[10px] shrink-0 border-primary/30 text-primary">
          {tr("Non-Mutating Batch Reference", "अपरिवर्तनीय बैच संदर्भ")}
        </Badge>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col gap-3 bg-card p-4 rounded-xl border border-border shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={tr("Search honey listings, batch number, seller, or floral variety...", "शहद लिस्टिंग, बैच, विक्रेता या पुष्प किस्म खोजें...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-background/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Material Type filter */}
            <Tabs value={selectedType} onValueChange={setSelectedType} className="w-auto">
              <TabsList className="h-9 p-1">
                <TabsTrigger value="all" className="text-xs">{tr("All Products", "सभी उत्पाद")}</TabsTrigger>
                <TabsTrigger value="raw" className="text-xs">{tr("Raw Honey", "कच्चा शहद")}</TabsTrigger>
                <TabsTrigger value="processed" className="text-xs">{tr("Processed", "प्रसंस्कृत")}</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Status filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">{tr("All Availability", "सभी उपलब्धता")}</option>
              <option value="active">{tr("In Stock / Active", "स्टॉक में / सक्रिय")}</option>
              <option value="reserved">{tr("Reserved", "आरक्षित")}</option>
              <option value="sold">{tr("Sold Out", "बिक चुका")}</option>
              <option value="draft">{tr("Draft Lots", "प्रारूप लॉट")}</option>
            </select>

            {/* Sort by dropdown */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-medium"
              >
                <option value="featured">{tr("Featured / Relevant", "विशेष / प्रासंगिक")}</option>
                <option value="price-asc">{tr("Price: Low to High", "कीमत: कम से ज्यादा")}</option>
                <option value="price-desc">{tr("Price: High to Low", "कीमत: ज्यादा से कम")}</option>
                <option value="rating">{tr("Customer Rating", "ग्राहक रेटिंग")}</option>
                <option value="stock">{tr("Stock Quantity", "स्टॉक मात्रा")}</option>
              </select>
            </div>

            {/* View toggle */}
            <div className="hidden sm:flex border border-border rounded-lg p-0.5 bg-muted/40">
              <Button
                type="button"
                variant={viewMode === "cards" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="h-7 text-xs px-2.5 font-medium"
              >
                {tr("Cards", "कार्ड्स")}
              </Button>
              <Button
                type="button"
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-7 text-xs px-2.5 font-medium"
              >
                {tr("Table", "तालिका")}
              </Button>
            </div>
          </div>
        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/60">
          <div>
            {tr("Showing", "प्रदर्शित")} <strong className="text-foreground">{filteredListings.length}</strong> {tr("honey products in B2B catalog", "शहद उत्पाद कैटलॉग में")}
          </div>
          {(searchQuery || selectedType !== "all" || selectedStatus !== "all" || sortBy !== "featured") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedType("all");
                setSelectedStatus("all");
                setSortBy("featured");
              }}
              className="text-primary hover:underline font-medium text-xs"
            >
              {tr("Reset Filters", "फ़िल्टर रीसेट करें")}
            </button>
          )}
        </div>
      </div>

      {/* Listing Views */}
      {filteredListings.length === 0 ? (
        <EmptyState
          icon={Store}
          title={tr("No marketplace listings found", "कोई लिस्टिंग नहीं मिली")}
          description={tr("Try adjusting your search query or material status filter.", "अपनी खोज या स्थिति फ़िल्टर को समायोजित करने का प्रयास करें।")}
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedType("all");
                setSelectedStatus("all");
                setSortBy("featured");
              }}
            >
              {tr("Clear Filters", "फ़िल्टर हटाएं")}
            </Button>
          }
        />
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map((listing) => (
            <MarketplaceProductCard
              key={listing.id}
              listing={listing}
              onOrderClick={setActiveListingForOrder}
            />
          ))}
        </div>
      ) : (
        /* Modern Table View */
        <Card className="border-border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-[11px] bg-muted/40 uppercase tracking-wider font-semibold">
                  <TableHead className="w-16">{tr("Product", "उत्पाद")}</TableHead>
                  <TableHead>{tr("Listing & Batch", "लिस्टिंग और बैच")}</TableHead>
                  <TableHead>{tr("Seller / Origin", "विक्रेता / मूल")}</TableHead>
                  <TableHead>{tr("Rating", "रेटिंग")}</TableHead>
                  <TableHead>{tr("Price / kg", "कीमत / किग्रा")}</TableHead>
                  <TableHead className="text-right">{tr("Available Stock", "उपलब्ध स्टॉक")}</TableHead>
                  <TableHead>{tr("Status", "स्थिति")}</TableHead>
                  <TableHead className="text-right pr-4">{tr("Action", "कार्रवाई")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.map((listing) => {
                  const isOrderable = listing.status === "Active" && listing.availableQuantity > 0;
                  const imgSrc = getListingProductImage(listing);
                  const { price, mrp, discount } = getListingPricing(listing);

                  return (
                    <TableRow key={listing.id} className="text-xs hover:bg-muted/30">
                      <TableCell>
                        <div className="h-12 w-12 rounded-lg overflow-hidden border border-border/80 relative shrink-0">
                          <img
                            src={imgSrc}
                            alt={listing.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5 min-w-[200px]">
                          <Link href={`/marketplace/${listing.id}`} className="font-bold text-foreground hover:text-primary transition-colors block">
                            {listing.honeyVariety}
                          </Link>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <span className="font-mono">{listing.id}</span>
                            <span>•</span>
                            <Link
                              href={`/batches/${listing.batchNumber}`}
                              className="font-mono text-primary hover:underline flex items-center gap-0.5"
                            >
                              <span>{listing.batchNumber}</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </Link>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5 min-w-[140px]">
                          <div className="font-medium text-foreground">{listing.sellerOrgName}</div>
                          <div className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                            {listing.originRegion || listing.sellerLocation}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex items-center gap-1 rounded bg-emerald-600 text-white px-1.5 py-0.5 text-[11px] font-bold">
                          <span>{(listing.rating || 4.8).toFixed(1)}</span>
                          <Star className="h-2.5 w-2.5 fill-white" />
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="font-black text-foreground font-mono text-sm">
                            ₹{price.toLocaleString("en-IN")}
                          </div>
                          <div className="flex items-center gap-1 text-[10px]">
                            <span className="text-muted-foreground line-through font-mono">₹{mrp}</span>
                            <span className="text-emerald-600 font-bold">{discount}% {tr("off", "छूट")}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {listing.availableQuantity.toFixed(1)} {listing.unit}
                        </div>
                        <span className="text-[10px] text-muted-foreground">{tr("Bulk Lot", "थोक लॉट")}</span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <ListingStatusBadge status={listing.status} />
                      </TableCell>
                      <TableCell className="text-right pr-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button asChild variant="outline" size="sm" className="h-7 text-xs">
                            <Link href={`/marketplace/${listing.id}`}>{tr("View", "देखें")}</Link>
                          </Button>
                          {isOrderable && (
                            <Button
                              size="sm"
                              onClick={() => setActiveListingForOrder(listing)}
                              className="h-7 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-2xs gap-1"
                            >
                              <ShoppingBag className="h-3.5 w-3.5" />
                              <span>{tr("Order", "ऑर्डर")}</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
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
  const { tr } = useLanguage();
  return (
    <AuthGuard>
      <AppShell
        breadcrumbs={[
          { label: tr("Honey Chain", "हनी चेन"), href: "/dashboard" },
          { label: tr("Marketplace", "बाजार"), active: true },
        ]}
        defaultNavId="marketplace"
      >
        <MarketplaceContent />
      </AppShell>
    </AuthGuard>
  );
}
