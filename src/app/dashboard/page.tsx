"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useAuthSession } from "@/context/auth-session-context";
import {
  Building2,
  Shield,
  Wheat,
  Factory,
  ShoppingBag,
  User,
  FlaskConical,
  Boxes,
  Activity,
  ArrowRight,
  Sparkles,
  Info,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ROLE_ICONS = {
  wheat: Wheat,
  factory: Factory,
  "shopping-bag": ShoppingBag,
  user: User,
  flask: FlaskConical,
  shield: Shield,
};

function DashboardContent() {
  const { user, selectedOrg, selectedRole } = useAuthSession();
  const [activeDialogWorkflow, setActiveDialogWorkflow] = React.useState<string | null>(null);

  const RoleIcon = selectedRole?.iconName
    ? ROLE_ICONS[selectedRole.iconName] || Shield
    : Shield;

  const gettingStartedItems = [
    {
      id: "register-hive",
      title: "Register hive / apiary",
      description:
        "Establish new apiary coordinates, register physical boxes, and pair NFC/RFID hive identifiers.",
      icon: Wheat,
      badge: "Step 4 Ready",
      actionLabel: "Register Apiary",
      href: "/hives/new",
    },
    {
      id: "capture-activity",
      title: "Capture activity",
      description:
        "Record beekeeper yard activities, queen status inspections, floral foraging blooms, and pest treatments.",
      icon: Activity,
      badge: "Step 4 Ready",
      actionLabel: "Log Inspection",
      href: "/activities/new",
    },
    {
      id: "create-batch",
      title: "Create honey batch",
      description:
        "Extract raw honey into bulk containers, generate immutable batch serials, and initiate lab testing pipelines.",
      icon: Boxes,
      badge: "Step 4 Ready",
      actionLabel: "Start Harvest Batch",
      href: "/batches/new",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Operational Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Signed in as <strong className="text-foreground">{user?.fullName || "Operator"}</strong> • Authenticated session connected to Honey Chain network.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono py-1 px-2.5 gap-1.5 border-primary/30 text-primary">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Session Verified
          </Badge>
        </div>
      </div>

      {/* Context Proof Section: Organisation & Active Role */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selected Organisation Card */}
        <Card className="border-primary/20 bg-card shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                Active Organisation
              </span>
              <Link
                href="/select-organisation"
                className="text-xs text-primary font-medium hover:underline"
              >
                Switch Entity
              </Link>
            </div>
            <CardTitle className="text-lg font-bold text-foreground mt-1">
              {selectedOrg?.name || "Highland Apiaries Cooperative"}
            </CardTitle>
            <CardDescription className="text-xs">
              Entity Type: <span className="font-medium text-foreground">{selectedOrg?.displayType || "Beekeeper Cooperative"}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-mono text-[11px]">
                ID: {selectedOrg?.shortIdentifier || "ORG-HAC-01"}
              </Badge>
              <Badge variant="outline" className="text-[11px]">
                {selectedOrg?.membershipInfo || "Active Member"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              All batch creations, custody transfers, and certification requests logged in this session are digitally bound to this organisation.
            </p>
          </CardContent>
        </Card>

        {/* Selected Active Role Card */}
        <Card className="border-primary/20 bg-card shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Active Session Role
              </span>
              <Link
                href="/select-role"
                className="text-xs text-primary font-medium hover:underline"
              >
                Change Role
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <RoleIcon className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-bold text-foreground">
                {selectedRole?.name || "Beekeeper"}
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              {selectedRole?.description || "Manage apiaries, record floral origins, and register harvest batches."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-0 text-xs">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">
              Active Session Capabilities:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedRole?.capabilities.map((cap, i) => (
                <Badge key={i} variant="outline" className="text-[10px] py-0 font-normal">
                  ✓ {cap}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              Getting Started
            </h2>
            <p className="text-xs text-muted-foreground">
              Primary entry points for operational traceability workflows
            </p>
          </div>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            Frontend placeholders for upcoming modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gettingStartedItems.map((item) => {
            const ItemIcon = item.icon;
            return (
              <Card
                key={item.id}
                className="flex flex-col justify-between border-border bg-card/60 hover:bg-card hover:border-input transition-colors shadow-xs"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ItemIcon className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {item.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold text-foreground">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs gap-1.5 h-8 font-medium cursor-pointer"
                    asChild
                  >
                    <Link href={item.href}>
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Security & Traceability Trust Info */}
      <div className="rounded-lg border border-border/70 bg-muted/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 text-primary shrink-0" />
          <span>
            Operating in <strong className="font-medium text-foreground">{selectedOrg?.name}</strong> as <strong className="font-medium text-foreground">{selectedRole?.name}</strong>. Data writes simulate cryptographic consensus.
          </span>
        </div>
        <Link
          href="/design-system"
          className="text-primary text-xs hover:underline shrink-0"
        >
          View Design System Components →
        </Link>
      </div>

      {/* Modal Dialog for Placeholder Workflow notice */}
      <Dialog
        open={!!activeDialogWorkflow}
        onOpenChange={(open) => !open && setActiveDialogWorkflow(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <DialogTitle className="text-center text-base">
              {activeDialogWorkflow}
            </DialogTitle>
            <DialogDescription className="text-center text-xs space-y-2 pt-2">
              <p>
                This entry point connects directly to the upcoming workflow module.
              </p>
              <p className="text-muted-foreground text-[11px]">
                In Step 3, authentication, organisation scoping, and active session roles are fully established and bound to this view. Detailed hive registrations and batch tracking will follow in subsequent steps.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-2">
            <Button
              size="sm"
              onClick={() => setActiveDialogWorkflow(null)}
              className="text-xs px-6"
            >
              Understood
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: "Honey Chain", href: "/dashboard" },
          { label: "Operational Dashboard", active: true },
        ]}
        defaultNavId="dashboard"
      >
        <DashboardContent />
      </AppShell>
    </AuthGuard>
  );
}
