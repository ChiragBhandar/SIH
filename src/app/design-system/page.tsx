"use client";

import * as React from "react";
import { AppShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SearchField } from "@/components/ui/search-field";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { FilterControls } from "@/components/ui/filter-controls";
import {
  Layers,
  Sliders,
  TableProperties,
  AlertCircle,
  FileCheck2,
  Eye,
} from "lucide-react";

export default function DesignSystemPreviewPage() {
  // Form states
  const [searchValue, setSearchValue] = React.useState("");
  const [switchChecked, setSwitchChecked] = React.useState(true);
  const [checkboxChecked, setCheckboxChecked] = React.useState(true);
  const [filterSelected, setFilterSelected] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Sample table rows
  const sampleBatches = [
    {
      id: "HC-BATCH-1092",
      type: "Raw Acacia Honey",
      volume: "850 kg",
      status: "success" as const,
      statusLabel: "Certified",
      origin: "Highland Apiaries #4",
      updated: "2026-09-12",
    },
    {
      id: "HC-BATCH-1093",
      type: "Wild Forest Floral",
      volume: "1,200 kg",
      status: "warning" as const,
      statusLabel: "In Custody Transit",
      origin: "Northern Valley Co-op",
      updated: "2026-09-13",
    },
    {
      id: "HC-BATCH-1094",
      type: "Organic Clover Honey",
      volume: "450 kg",
      status: "info" as const,
      statusLabel: "Testing in Lab",
      origin: "Meadowland Apiary",
      updated: "2026-09-14",
    },
    {
      id: "HC-BATCH-1095",
      type: "Manuka Mono-floral",
      volume: "310 kg",
      status: "error" as const,
      statusLabel: "Quality Exception",
      origin: "East Ridge Apiary",
      updated: "2026-09-14",
    },
  ];

  const filterOptions = [
    { id: "all", label: "All Items", count: 4 },
    { id: "certified", label: "Certified", count: 1 },
    { id: "transit", label: "In Transit", count: 1 },
    { id: "testing", label: "Testing", count: 1 },
  ];

  return (
    <AppShell
      breadcrumbs={[
        { label: "Honey Chain", href: "#" },
        { label: "Design System Foundation", active: true },
      ]}
      defaultNavId="dashboard"
    >
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Page Context Banner */}
        <div className="flex flex-col gap-2 border-b border-border/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Design System & Application Shell
              </h1>
              <Badge variant="honey" className="font-mono text-xs">
                Step 2 Complete
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Operational component foundation and layout shell configured for the Honey Chain B2B traceability platform.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5 shadow-xs">
                  <Eye className="h-3.5 w-3.5" />
                  <span>Modal Dialog Demo</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Audit Verification Modal</DialogTitle>
                  <DialogDescription>
                    This is an accessible modal dialog demonstration configured with focus trapping and ESC dismissal.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2 text-xs">
                  <div className="rounded-md border border-border bg-muted/40 p-3">
                    <p className="font-medium text-foreground">Cryptographic Checksum</p>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground break-all">
                      0x8f2d91c73a4b601e29c8e43ff0189b741029c919d3ea47c92b810d720a4b9e28
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Immutable Blockchain State</span>
                    <StatusBadge status="success">Verified On-Chain</StatusBadge>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
                    Dismiss
                  </Button>
                  <Button size="sm" onClick={() => setDialogOpen(false)}>
                    Acknowledge
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Section Tabs */}
        <Tabs defaultValue="components" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="components" className="gap-1.5 text-xs">
              <Layers className="h-3.5 w-3.5" />
              Components
            </TabsTrigger>
            <TabsTrigger value="forms" className="gap-1.5 text-xs">
              <Sliders className="h-3.5 w-3.5" />
              Form Controls
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-1.5 text-xs">
              <TableProperties className="h-3.5 w-3.5" />
              Data & Tables
            </TabsTrigger>
            <TabsTrigger value="states" className="gap-1.5 text-xs">
              <AlertCircle className="h-3.5 w-3.5" />
              States & Feedback
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Core Components & Badges */}
          <TabsContent value="components" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Button Variants */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Button Hierarchy</CardTitle>
                  <CardDescription className="text-xs">
                    Consistent button variants, restrained shadows, and subtle transitions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm">Primary</Button>
                    <Button size="sm" variant="secondary">Secondary</Button>
                    <Button size="sm" variant="outline">Outline</Button>
                    <Button size="sm" variant="ghost">Ghost</Button>
                    <Button size="sm" variant="destructive">Destructive</Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
                    <Button size="xs" variant="outline" className="h-7 text-xs px-2">Size XS</Button>
                    <Button size="sm">Size SM (Default)</Button>
                    <Button size="lg">Size LG</Button>
                    <Button disabled size="sm">Disabled</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Status Badges */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Operational Status Badges</CardTitle>
                  <CardDescription className="text-xs">
                    Semantic status indicators with accessible contrast and status dots.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status="success">Certified</StatusBadge>
                    <StatusBadge status="warning">In Transit</StatusBadge>
                    <StatusBadge status="error">Rejected</StatusBadge>
                    <StatusBadge status="info">Processing</StatusBadge>
                    <StatusBadge status="honey">Verified Origin</StatusBadge>
                    <StatusBadge status="neutral">Archived</StatusBadge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
                    <StatusBadge status="warning" pulse>
                      Active Lab Analysis
                    </StatusBadge>
                    <Badge variant="outline">Outline Badge</Badge>
                    <Badge variant="honey">Honey Accent</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: Form Controls */}
          <TabsContent value="forms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Form & Input Primitives</CardTitle>
                <CardDescription className="text-xs">
                  Clean, accessible inputs with unified focus rings and subtle borders.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-foreground">Standard Input</label>
                    <Input placeholder="e.g. Batch Lot Identifier" className="mt-1" />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground">Search Field with Clear</label>
                    <SearchField
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onClear={() => setSearchValue("")}
                      placeholder="Search batches, apiaries..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground">Select Dropdown</label>
                    <Select defaultValue="acacia">
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Honey Floral Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acacia">Pure Acacia</SelectItem>
                        <SelectItem value="wildflower">Wildflower Blossom</SelectItem>
                        <SelectItem value="manuka">Manuka High-Purity</SelectItem>
                        <SelectItem value="clover">White Clover</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-foreground">Notes / Textarea</label>
                    <Textarea
                      placeholder="Enter custody transfer observations or inspection notes..."
                      className="mt-1 min-h-[95px]"
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sample-check"
                        checked={checkboxChecked}
                        onCheckedChange={(checked) => setCheckboxChecked(Boolean(checked))}
                      />
                      <label htmlFor="sample-check" className="text-xs text-foreground cursor-pointer">
                        Require laboratory certificate verification before transfer
                      </label>
                    </div>

                    <div className="flex items-center justify-between rounded-md border border-border p-2.5">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-foreground">Immutable Blockchain Logging</span>
                        <span className="text-[11px] text-muted-foreground">Log each event to tamper-evident ledger</span>
                      </div>
                      <Switch
                        checked={switchChecked}
                        onCheckedChange={setSwitchChecked}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: Data & Tables */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-base">Operational Data Table</CardTitle>
                    <CardDescription className="text-xs">
                      Clean data presentation with status badges, filters, and pagination.
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline" className="gap-1.5 self-start">
                    <FileCheck2 className="h-3.5 w-3.5 text-primary" />
                    <span>Export CSV</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FilterControls
                  options={filterOptions}
                  selectedId={filterSelected}
                  onSelect={setFilterSelected}
                  onClear={() => setFilterSelected("all")}
                />

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch Identifier</TableHead>
                      <TableHead>Honey Type</TableHead>
                      <TableHead>Net Volume</TableHead>
                      <TableHead>Origin / Producer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleBatches.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-mono text-xs font-semibold text-foreground">
                          {row.id}
                        </TableCell>
                        <TableCell className="text-xs">{row.type}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{row.volume}</TableCell>
                        <TableCell className="text-xs">{row.origin}</TableCell>
                        <TableCell>
                          <StatusBadge status={row.status}>
                            {row.statusLabel}
                          </StatusBadge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            Inspect
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Pagination
                  currentPage={currentPage}
                  totalPages={4}
                  onPageChange={setCurrentPage}
                  totalItems={16}
                  pageSize={4}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: States & Feedback */}
          <TabsContent value="states" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Loading & Skeleton States</CardTitle>
                  <CardDescription className="text-xs">
                    Visual placeholders during asynchronous operations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 rounded-md border border-border p-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                  <LoadingState message="Synchronizing cryptographic chain records..." />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Empty & Error Handlers</CardTitle>
                  <CardDescription className="text-xs">
                    Reusable indicators for missing data and network/operational errors.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ErrorState
                    compact
                    message="Network timeout while querying remote lab registry."
                    onRetry={() => {}}
                  />
                  <EmptyState
                    title="No Custody Transfers Pending"
                    description="All honey batches have been acknowledged by receiving facilities."
                    action={
                      <Button size="sm" variant="outline">
                        Create New Transfer
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
