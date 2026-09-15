"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/context/auth-session-context";
import { Hexagon } from "lucide-react";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, hasSelectedOrg, hasSelectedRole, isInitialized } = useAuthSession();

  React.useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.replace("/login");
    } else if (!hasSelectedOrg) {
      router.replace("/select-organisation");
    } else if (!hasSelectedRole) {
      router.replace("/select-role");
    } else {
      router.replace("/dashboard");
    }
  }, [isInitialized, isAuthenticated, hasSelectedOrg, hasSelectedRole, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md animate-pulse">
          <Hexagon className="h-6 w-6 fill-current stroke-[2.5]" />
        </div>
        <p className="text-xs font-mono tracking-wider text-muted-foreground uppercase">
          Initializing Honey Chain...
        </p>
      </div>
    </div>
  );
}
