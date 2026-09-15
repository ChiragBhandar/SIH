import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { MarketplaceListingStatus, MarketplaceOrderStatus } from "@/types/marketplace";
import { CheckCircle2, Clock, XCircle, AlertTriangle, ShieldCheck, Tag, Ban } from "lucide-react";

export function ListingStatusBadge({
  status,
  className = "",
}: {
  status: MarketplaceListingStatus;
  className?: string;
}) {
  switch (status) {
    case "Active":
      return (
        <Badge
          variant="outline"
          className={`bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 font-medium ${className}`}
        >
          <CheckCircle2 className="h-3 w-3" />
          Active
        </Badge>
      );
    case "Reserved":
      return (
        <Badge
          variant="outline"
          className={`bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1 font-medium ${className}`}
        >
          <Clock className="h-3 w-3" />
          Reserved
        </Badge>
      );
    case "Draft":
      return (
        <Badge
          variant="outline"
          className={`bg-muted text-muted-foreground border-border gap-1 font-medium ${className}`}
        >
          <Tag className="h-3 w-3" />
          Draft
        </Badge>
      );
    case "Sold":
      return (
        <Badge
          variant="outline"
          className={`bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 gap-1 font-medium ${className}`}
        >
          <ShieldCheck className="h-3 w-3" />
          Sold Out
        </Badge>
      );
    case "Suspended":
      return (
        <Badge
          variant="outline"
          className={`bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 gap-1 font-medium ${className}`}
        >
          <Ban className="h-3 w-3" />
          Suspended
        </Badge>
      );
    case "Expired":
      return (
        <Badge
          variant="outline"
          className={`bg-muted text-muted-foreground border-border gap-1 font-medium ${className}`}
        >
          <AlertTriangle className="h-3 w-3" />
          Expired
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export function OrderStatusBadge({
  status,
  className = "",
}: {
  status: MarketplaceOrderStatus;
  className?: string;
}) {
  switch (status) {
    case "Pending":
      return (
        <Badge
          variant="outline"
          className={`bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1 font-medium ${className}`}
        >
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case "Accepted":
      return (
        <Badge
          variant="outline"
          className={`bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 font-medium ${className}`}
        >
          <CheckCircle2 className="h-3 w-3" />
          Accepted
        </Badge>
      );
    case "Fulfilled":
      return (
        <Badge
          variant="outline"
          className={`bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 gap-1 font-medium ${className}`}
        >
          <ShieldCheck className="h-3 w-3" />
          Fulfilled
        </Badge>
      );
    case "Rejected":
      return (
        <Badge
          variant="outline"
          className={`bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 gap-1 font-medium ${className}`}
        >
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>
      );
    case "Cancelled":
      return (
        <Badge
          variant="outline"
          className={`bg-muted text-muted-foreground border-border gap-1 font-medium ${className}`}
        >
          <Ban className="h-3 w-3" />
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
