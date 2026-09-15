"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { OrderStatusBadge } from "@/components/marketplace/marketplace-status-badge";
import {
  ShoppingBag,
  Store,
  Search,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
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

function MarketplaceOrdersContent() {
  const { marketplaceOrders, isLoaded } = useTraceability();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  const pendingCount = marketplaceOrders.filter((o) => o.status === "Pending").length;
  const acceptedCount = marketplaceOrders.filter((o) => o.status === "Accepted").length;

  const filteredOrders = React.useMemo(() => {
    return marketplaceOrders.filter((order) => {
      const matchesSearch =
        searchQuery === "" ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.listingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.buyerOrgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.sellerOrgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.buyerReference.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || order.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [marketplaceOrders, searchQuery, selectedStatus]);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          Loading commercial marketplace orders...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-card p-6 rounded-xl border border-border shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[11px] font-semibold text-primary border-primary/30 bg-primary/10 gap-1">
              <ShoppingBag className="h-3 w-3" />
              Commercial Purchase Ledger
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-mono">
              Immutable Commercial Commitments
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Marketplace Orders</h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Commercial purchasing commitments and supply contracts across verified traceable honey batches. Orders maintain batch reference without mutating underlying production lineage.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button asChild size="sm" className="h-9 text-xs gap-1.5 shadow-xs font-semibold">
            <Link href="/marketplace">
              <Store className="h-4 w-4" />
              <span>Browse Marketplace</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3.5 rounded-lg border border-border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, batch, seller, buyer, or PO ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-auto">
            <TabsList className="h-9 p-1">
              <TabsTrigger value="all" className="text-xs">All Orders ({marketplaceOrders.length})</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="accepted" className="text-xs">
                Accepted ({acceptedCount})
              </TabsTrigger>
              <TabsTrigger value="fulfilled" className="text-xs">Fulfilled</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No marketplace orders found"
          description="No purchase orders match your search criteria. Browse the marketplace to place an order."
          action={
            <Button asChild size="sm">
              <Link href="/marketplace">Browse Marketplace Listings</Link>
            </Button>
          }
        />
      ) : (
        <Card className="border-border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="text-[11px] bg-muted/40">
                <TableHead className="font-semibold">Order ID</TableHead>
                <TableHead className="font-semibold">Listing</TableHead>
                <TableHead className="font-semibold">Authoritative Batch</TableHead>
                <TableHead className="font-semibold">Seller Organisation</TableHead>
                <TableHead className="font-semibold">Buyer Organisation</TableHead>
                <TableHead className="font-semibold text-right">Quantity</TableHead>
                <TableHead className="font-semibold">Order Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="text-xs hover:bg-muted/30">
                  <TableCell className="font-mono font-bold text-foreground">
                    <Link
                      href={`/marketplace/orders/${order.id}`}
                      className="text-primary hover:underline"
                    >
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/marketplace/${order.listingId}`}
                      className="font-mono text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {order.listingId}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/batches/${order.batchNumber}`}
                      className="font-mono font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>{order.batchNumber}</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </Link>
                  </TableCell>
                  <TableCell className="text-foreground">{order.sellerOrgName}</TableCell>
                  <TableCell className="text-foreground font-medium">{order.buyerOrgName}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {order.quantity.toFixed(1)} {order.unit}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-[11px] whitespace-nowrap">
                    {order.orderDate.split("T")[0]}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                      <Link href={`/marketplace/orders/${order.id}`}>
                        <span>View Order</span>
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

export default function MarketplaceOrdersPage() {
  return (
    <AuthGuard>
      <AppShell>
        <MarketplaceOrdersContent />
      </AppShell>
    </AuthGuard>
  );
}
