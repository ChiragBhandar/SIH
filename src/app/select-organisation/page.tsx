"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Hexagon,
  Building2,
  CheckCircle2,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthSession } from "@/context/auth-session-context";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Organization } from "@/types/auth";
import { cn } from "@/lib/utils";

function SelectOrganisationContent() {
  const router = useRouter();
  const {
    user,
    allOrganisations,
    selectedOrg,
    selectOrganisation,
    logout,
  } = useAuthSession();

  const [chosenOrgId, setChosenOrgId] = React.useState<string>(
    selectedOrg?.id || allOrganisations[0]?.id || ""
  );

  const handleContinue = () => {
    if (!chosenOrgId) return;
    selectOrganisation(chosenOrgId);
    router.push("/select-role");
  };

  const handleSignOut = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      {/* Top minimal header */}
      <header className="flex h-16 w-full items-center justify-between px-6 border-b border-border/60 bg-background/80 backdrop-blur-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <Hexagon className="h-4 w-4 fill-current stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground">Honey Chain</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
              Onboarding & Session Setup
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-foreground">{user?.fullName}</span>
            <span className="text-[10px] text-muted-foreground">{user?.email}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-xs text-muted-foreground hover:text-foreground h-8 gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                1
              </span>
              <span className="text-xs font-semibold text-foreground">Organisation</span>
            </div>
            <div className="h-0.5 w-8 bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-[11px] font-medium">
                2
              </span>
              <span className="text-xs font-medium">Active Role</span>
            </div>
          </div>

          {/* Card Frame */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Choose your organisation
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Select the registered enterprise or cooperative entity you are operating on behalf of for this session.
              </p>
            </div>

            {/* Organisations List / Cards */}
            <div className="space-y-3">
              {allOrganisations.map((org: Organization) => {
                const isSelected = chosenOrgId === org.id;

                return (
                  <div
                    key={org.id}
                    onClick={() => setChosenOrgId(org.id)}
                    className={cn(
                      "group relative flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border p-4 transition-all cursor-pointer select-none",
                      isSelected
                        ? "border-primary bg-primary/[0.04] ring-1 ring-primary/40 shadow-xs"
                        : "border-border bg-background/50 hover:border-input hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted text-muted-foreground border-border group-hover:text-foreground"
                        )}
                      >
                        <Building2 className="h-5 w-5" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-sm font-semibold text-foreground">
                            {org.name}
                          </h2>
                          <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0">
                            {org.shortIdentifier}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground/80">
                            {org.displayType}
                          </span>
                          <span>•</span>
                          <span>{org.membershipInfo}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-0 flex items-center justify-end">
                      {isSelected ? (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                          <CheckCircle2 className="h-4 w-4 fill-primary text-primary-foreground" />
                          <span>Selected</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                          Click to select
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-border">
              <span className="text-[11px] text-muted-foreground text-center sm:text-left">
                Need to register a new organisation? Contact platform administration.
              </span>

              <Button
                onClick={handleContinue}
                disabled={!chosenOrgId}
                className="h-10 px-6 gap-2 text-xs font-semibold shrink-0"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        <span>Honey Chain Trust Network • Organisation Registry Context</span>
      </footer>
    </div>
  );
}

export default function SelectOrganisationPage() {
  return (
    <AuthGuard requiredLevel="auth">
      <SelectOrganisationContent />
    </AuthGuard>
  );
}
