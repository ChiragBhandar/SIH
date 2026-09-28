"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/context/auth-session-context";
import { BrandLogo } from "@/components/ui/brand-logo";

export interface AuthGuardProps {
  children: React.ReactNode;
  /**
   * Minimum step required:
   * - "auth": user must be logged in (used by select-organisation)
   * - "org": user must be logged in and have selected an org (used by select-role)
   * - "full": user must be logged in, selected org, and selected role (used by dashboard and shell)
   */
  requiredLevel?: "auth" | "org" | "full";
}

export function AuthGuard({ children, requiredLevel = "full" }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, hasSelectedOrg, hasSelectedRole, isInitialized } = useAuthSession();

  React.useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (requiredLevel === "org" && !hasSelectedOrg) {
      router.replace("/select-organisation");
      return;
    }

    if (requiredLevel === "full") {
      if (!hasSelectedOrg) {
        router.replace("/select-organisation");
        return;
      }
      if (!hasSelectedRole) {
        router.replace("/select-role");
        return;
      }
    }
  }, [
    isInitialized,
    isAuthenticated,
    hasSelectedOrg,
    hasSelectedRole,
    requiredLevel,
    router,
  ]);

  // Loading state while session is being restored from local storage
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card border border-border shadow-md animate-pulse p-2.5">
            <BrandLogo variant="mark" size="sm" imageClassName="h-9 w-auto" priority />
          </div>
          <p className="text-xs font-mono tracking-wider text-muted-foreground uppercase">
            Restoring session...
          </p>
        </div>
      </div>
    );
  }

  // Prevent flash of protected UI if redirecting
  if (!isAuthenticated) return null;
  if (requiredLevel === "org" && !hasSelectedOrg) return null;
  if (requiredLevel === "full" && (!hasSelectedOrg || !hasSelectedRole)) return null;

  return <>{children}</>;
}
