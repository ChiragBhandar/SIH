"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/context/auth-session-context";
import { Hexagon } from "lucide-react";

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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md animate-pulse">
            <Hexagon className="h-6 w-6 fill-current stroke-[2.5]" />
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
