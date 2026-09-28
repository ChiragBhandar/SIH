"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MarketplaceListing } from "@/types/marketplace";
import { useLanguage } from "@/context/language-context";
import {
  Star,
  ShieldCheck,
  MapPin,
  ShoppingBag,
  ExternalLink,
  Wheat,
  Layers,
  Sparkles,
  Flame,
  CheckCircle2,
  ChevronRight,
  TrendingDown,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MarketplaceProductCardProps {
  listing: MarketplaceListing;
  onOrderClick: (listing: MarketplaceListing) => void;
}

export function getListingProductImage(listing: MarketplaceListing): string {
  if (listing.imageUrl) return listing.imageUrl;
  const variety = (listing.honeyVariety || "").toLowerCase();
  if (variety.includes("apple") || variety.includes("acacia")) {
    return "/images/products/apple_acacia.jpg";
  }
  if (variety.includes("lavender")) {
    return "/images/products/lavender_forest.jpg";
  }
  if (listing.lineageType === "processed" || listing.listingType?.includes("Processed")) {
    return "/images/products/processed_pure.jpg";
  }
  return "/images/products/multifloral.jpg";
}

export function getListingPricing(listing: MarketplaceListing) {
  let price = listing.numericPrice;
  if (!price && listing.pricePerUnit) {
    const matched = listing.pricePerUnit.match(/\d+/);
    if (matched) price = parseInt(matched[0], 10);
  }
  price = price || 580;
  const mrp = listing.mrpPrice || Math.round(price * 1.15);
  const discount = listing.discountPercent || Math.max(5, Math.round(((mrp - price) / mrp) * 100));
  return { price, mrp, discount };
}

export function MarketplaceProductCard({ listing, onOrderClick }: MarketplaceProductCardProps) {
  const { tr, trStatus } = useLanguage();
  const imgSrc = getListingProductImage(listing);
  const { price, mrp, discount } = getListingPricing(listing);

  const isSoldOut = listing.status === "Sold" || listing.availableQuantity <= 0;
  const isReserved = listing.status === "Reserved";
  const isDraft = listing.status === "Draft";
  const isOrderable = listing.status === "Active" && listing.availableQuantity > 0;
  const isLowStock = listing.availableQuantity > 0 && listing.availableQuantity <= 60;
  const isRaw = listing.lineageType === "raw" || listing.listingType.includes("Raw");

  const rating = listing.rating || 4.8;
  const reviewCount = listing.reviewCount || 36;
  const badgeLabel = listing.badge || (isRaw ? tr("100% Pure Raw", "100% शुद्ध कच्चा") : tr("Lab Certified", "लैब प्रमाणित"));

  // Stock percentage
  const originalQty = listing.originalQuantity || listing.availableQuantity || 100;
  const stockPercent = Math.min(100, Math.max(5, Math.round((listing.availableQuantity / originalQty) * 100)));

  return (
    <div className="group rounded-2xl border border-border/80 bg-card text-card-foreground shadow-xs hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Top Product Image Container */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-muted/40">
          <img
            src={imgSrc}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Frosted gradient bottom overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Top Left Badges: Commerce Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {badgeLabel && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500 text-slate-950 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                <Sparkles className="h-3 w-3" />
                {badgeLabel}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-md text-white px-2 py-0.5 text-[10px] font-semibold border border-white/20">
              {isRaw ? <Wheat className="h-3 w-3 text-amber-300" /> : <Layers className="h-3 w-3 text-sky-300" />}
              {isRaw ? tr("Raw Honey", "कच्चा शहद") : tr("Processed Honey", "प्रसंस्कृत शहद")}
            </span>
          </div>

          {/* Top Right: Stock / Availability Tag */}
          <div className="absolute top-2.5 right-2.5 z-10">
            {isSoldOut ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-600/90 backdrop-blur-md text-white px-2 py-0.5 text-[11px] font-bold shadow-md">
                {tr("Sold Out", "बिक चुका")}
              </span>
            ) : isReserved ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-600/90 backdrop-blur-md text-white px-2 py-0.5 text-[11px] font-bold shadow-md">
                {tr("Reserved", "आरक्षित")}
              </span>
            ) : isDraft ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-700/90 backdrop-blur-md text-white px-2 py-0.5 text-[11px] font-semibold shadow-md">
                {tr("Draft Lot", "ड्राफ्ट लॉट")}
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-orange-600/95 backdrop-blur-md text-white px-2 py-0.5 text-[11px] font-bold shadow-md animate-pulse">
                <Flame className="h-3 w-3" />
                {tr("Low Stock", "कम स्टॉक")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/90 backdrop-blur-md text-white px-2 py-0.5 text-[11px] font-bold shadow-md">
                {tr("In Stock", "स्टॉक में")}
              </span>
            )}
          </div>

          {/* Bottom Overlay: Origin & Elevation Tag */}
          <div className="absolute bottom-2 left-2.5 right-2.5 z-10 flex items-center justify-between text-white/95 text-[11px]">
            <div className="flex items-center gap-1 truncate font-medium drop-shadow-sm">
              <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{listing.originRegion || listing.sellerLocation}</span>
            </div>
            {listing.elevation && (
              <span className="shrink-0 bg-white/20 backdrop-blur-md rounded px-1.5 py-0.2 text-[10px] font-mono">
                {listing.elevation}
              </span>
            )}
          </div>
        </div>

        {/* Card Main Info */}
        <div className="p-4 space-y-3">
          {/* Seller Organization & Assured Badge */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-muted-foreground truncate font-medium">
              {tr("By", "द्वारा")}{" "}
              <strong className="text-foreground hover:underline cursor-pointer">{listing.sellerOrgName}</strong>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20 px-2 py-0.5 text-[10px] font-bold tracking-tight shrink-0">
              <ShieldCheck className="h-3 w-3" />
              {tr("Assured", "विश्वसनीय")}
            </span>
          </div>

          {/* Honey Variety / Title */}
          <div>
            <Link
              href={`/marketplace/${listing.id}`}
              className="group-hover:text-primary transition-colors block"
            >
              <h3 className="font-bold text-base leading-snug line-clamp-1 text-foreground">
                {listing.honeyVariety}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-[11px] text-muted-foreground bg-muted/60 px-1.5 py-0.2 rounded border border-border/50">
                {listing.id}
              </span>
              <span className="text-muted-foreground text-[11px]">•</span>
              <Link
                href={`/batches/${listing.batchNumber}`}
                className="font-mono text-[11px] text-primary hover:underline flex items-center gap-0.5"
                title={tr("View Batch Lineage", "बैच वंशावली देखें")}
              >
                <span>{tr("Batch", "बैच")} {listing.batchNumber}</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </Link>
            </div>
          </div>

          {/* Ratings Pill */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded bg-emerald-600 text-white px-1.5 py-0.5 text-xs font-bold shadow-2xs">
              <span>{rating.toFixed(1)}</span>
              <Star className="h-3 w-3 fill-white" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              ({reviewCount} {tr("verified B2B reviews", "सत्यापित B2B समीक्षाएं")})
            </span>
            <span className="text-muted-foreground text-[10px]">•</span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold truncate">
              {trStatus(listing.qualityStatus.split("(")[0].trim())}
            </span>
          </div>

          {/* Pricing Section */}
          <div className="pt-2 border-t border-border/60">
            <div className="flex items-baseline gap-2">
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-foreground tracking-tight font-mono">
                  ₹{price.toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-semibold text-muted-foreground ml-1">
                  /{tr("kg", "किग्रा")}
                </span>
              </div>
              <span className="text-xs text-muted-foreground line-through font-mono">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {discount}% {tr("OFF", "छूट")}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-0.5">
              <span>{tr("B2B Commercial Bulk Lot", "B2B वाणिज्यिक थोक लॉट")}</span>
              <span className="font-medium text-foreground">{tr("Min. Order 5 kg", "न्यूनतम ऑर्डर 5 किग्रा")}</span>
            </div>
          </div>

          {/* Stock Level Progress Indicator */}
          <div className="space-y-1 bg-muted/30 p-2.5 rounded-xl border border-border/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium flex items-center gap-1">
                <span>{tr("Available Stock:", "उपलब्ध स्टॉक:")}</span>
              </span>
              <span className={`font-mono font-bold ${isSoldOut ? "text-rose-600" : isLowStock ? "text-orange-600" : "text-emerald-600 dark:text-emerald-400"}`}>
                {listing.availableQuantity.toFixed(1)} {listing.unit}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isSoldOut
                    ? "bg-rose-500"
                    : isLowStock
                    ? "bg-orange-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${isSoldOut ? 0 : stockPercent}%` }}
              />
            </div>
          </div>

          {/* Key Product Highlights */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {listing.moisturePercent && (
              <span className="inline-flex items-center gap-1 rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                💧 {tr("Moisture", "नमी")} {listing.moisturePercent}%
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground truncate max-w-[190px]">
              🌿 {listing.dominantFlora || "Himalayan Flora"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-semibold">
              <CheckCircle2 className="h-2.5 w-2.5" />
              {tr("Traceable", "सत्यापनीय")}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="p-3 bg-muted/15 border-t border-border/60 flex items-center gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex-1 text-xs font-semibold h-9 rounded-xl hover:bg-muted"
        >
          <Link href={`/marketplace/${listing.id}`}>
            <span>{tr("View Details", "विवरण देखें")}</span>
            <ChevronRight className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
          </Link>
        </Button>

        {isOrderable ? (
          <Button
            size="sm"
            onClick={() => onOrderClick(listing)}
            className="flex-1 text-xs font-bold h-9 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm gap-1.5"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{tr("Place Order", "ऑर्डर दें")}</span>
          </Button>
        ) : (
          <Button
            size="sm"
            disabled
            variant="secondary"
            className="flex-1 text-xs font-semibold h-9 rounded-xl opacity-60 cursor-not-allowed"
          >
            {isSoldOut
              ? tr("Sold Out", "बिक चुका")
              : isReserved
              ? tr("Reserved", "आरक्षित")
              : tr("Unavailable", "अनुपलब्ध")}
          </Button>
        )}
      </div>
    </div>
  );
}
