"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Wheat,
  Factory,
  ShoppingBag,
  User,
  FlaskConical,
  Shield,
  ArrowRight,
  ArrowLeft,
  Info,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthSession } from "@/context/auth-session-context";
import { useLanguage } from "@/context/language-context";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { AuthGuard } from "@/components/auth/auth-guard";
import { BrandLogo } from "@/components/ui/brand-logo";
import { ActiveRole } from "@/types/auth";
import { cn } from "@/lib/utils";

const ROLE_ICONS = {
  wheat: Wheat,
  factory: Factory,
  "shopping-bag": ShoppingBag,
  user: User,
  flask: FlaskConical,
  shield: Shield,
};

function SelectRoleContent() {
  const router = useRouter();
  const {
    user,
    selectedOrg,
    allRoles,
    selectedRole,
    selectRole,
  } = useAuthSession();
  const { t } = useLanguage();

  // Find suitable default role based on org available roles if possible
  const defaultRoleId = React.useMemo(() => {
    if (selectedRole) return selectedRole.id;
    if (selectedOrg?.availableRoleIds && selectedOrg.availableRoleIds.length > 0) {
      return selectedOrg.availableRoleIds[0];
    }
    return allRoles[0]?.id || "";
  }, [selectedRole, selectedOrg, allRoles]);

  const [chosenRoleId, setChosenRoleId] = React.useState<string>(defaultRoleId);

  const handleContinue = () => {
    if (!chosenRoleId) return;
    selectRole(chosenRoleId);
    router.push("/dashboard");
  };

  const selectedOrgTrans = selectedOrg ? t.selectOrgPage.orgs[selectedOrg.id] : null;

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      {/* Header */}
      <header className="flex h-16 w-full items-center justify-between px-4 sm:px-6 border-b border-border/60 bg-background/80 backdrop-blur-xs">
        <BrandLogo href="/" size="sm" subtitle={t.selectRolePage.headerSubtitle} priority />

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <div className="hidden sm:flex flex-col text-right mr-2">
            <span className="text-xs font-semibold text-foreground">{user?.fullName}</span>
            <span className="text-[10px] text-muted-foreground">{user?.email}</span>
          </div>
          <Link
            href="/select-organisation"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.selectRolePage.changeOrg}</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                ✓
              </span>
              <span className="text-xs font-medium">{t.selectRolePage.step1}</span>
            </div>
            <div className="h-0.5 w-8 bg-primary" />
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                2
              </span>
              <span className="text-xs font-semibold text-foreground">{t.selectRolePage.step2}</span>
            </div>
          </div>

          {/* Context Banner: Active Organisation */}
          {selectedOrg && (
            <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{t.selectRolePage.activeOrgLabel}</span>
                    <span className="font-semibold text-foreground">
                      {selectedOrgTrans?.name || selectedOrg.name}
                    </span>
                    <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0">
                      {selectedOrg.shortIdentifier}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {t.selectRolePage.typeLabel} {selectedOrgTrans?.displayType || selectedOrg.displayType}
                  </span>
                </div>
              </div>

              <Link
                href="/select-organisation"
                className="text-xs text-primary font-medium hover:underline hidden sm:inline"
              >
                {t.selectRolePage.switchBtn}
              </Link>
            </div>
          )}

          {/* Card Frame */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-2 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {t.selectRolePage.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {t.selectRolePage.subtitle}
              </p>
            </div>

            {/* Important Product Concept Callout */}
            <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-muted-foreground">
              <Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="font-medium text-foreground">{t.selectRolePage.infoTitle}</strong>{" "}
                {t.selectRolePage.infoBody}
              </p>
            </div>

            {/* Role Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allRoles.map((role: ActiveRole) => {
                const IconComponent = ROLE_ICONS[role.iconName] || Shield;
                const isSelected = chosenRoleId === role.id;
                const isOrgRecommended = selectedOrg?.availableRoleIds?.includes(role.id);
                const roleTrans = t.selectRolePage.roles[role.id];
                const roleName = roleTrans?.name || role.name;
                const roleDesc = roleTrans?.description || role.description;
                const roleCapabilities = roleTrans?.capabilities || role.capabilities;

                return (
                  <div
                    key={role.id}
                    onClick={() => setChosenRoleId(role.id)}
                    className={cn(
                      "group relative flex flex-col justify-between rounded-xl border p-4 transition-all cursor-pointer select-none text-left",
                      isSelected
                        ? "border-primary bg-primary/[0.04] ring-2 ring-primary/60 shadow-xs"
                        : "border-border bg-background/50 hover:border-input hover:bg-muted/30"
                    )}
                  >
                    <div>
                      {/* Top row: Icon & Status */}
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted text-muted-foreground border-border group-hover:text-foreground"
                          )}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isOrgRecommended && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                              {t.selectRolePage.orgRoleBadge}
                            </Badge>
                          )}
                          {isSelected && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Name & description */}
                      <h2 className="text-sm font-bold text-foreground mb-1">
                        {roleName}
                      </h2>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                        {roleDesc}
                      </p>
                    </div>

                    {/* Relevant capabilities */}
                    <div className="border-t border-border/60 pt-3 space-y-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                        {t.selectRolePage.capabilitiesLabel}
                      </span>
                      <ul className="space-y-1">
                        {roleCapabilities.map((cap, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
                          >
                            <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
                            <span className="truncate">{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => router.push("/select-organisation")}
                className="h-10 px-4 text-xs gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{t.selectRolePage.backBtn}</span>
              </Button>

              <Button
                onClick={handleContinue}
                disabled={!chosenRoleId}
                className="h-10 px-6 gap-2 text-xs font-semibold cursor-pointer"
              >
                <span>{t.selectRolePage.continueBtn}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        <span>{t.selectRolePage.footerText}</span>
      </footer>
    </div>
  );
}

export default function SelectRolePage() {
  return (
    <AuthGuard requiredLevel="org">
      <SelectRoleContent />
    </AuthGuard>
  );
}
