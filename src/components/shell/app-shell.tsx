"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import { BreadcrumbItem } from "@/components/ui/breadcrumb";
import { USER_ROLES, UserRole } from "@/lib/constants";
import { getActiveNavId, getDefaultBreadcrumbs } from "./nav-config";
import { useAuthSession } from "@/context/auth-session-context";

export interface AppShellProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  defaultNavId?: string;
  overrideOrg?: string;
  overrideOrgType?: string;
  overrideRole?: UserRole;
  overrideRoleName?: string;
}

export function AppShell({
  children,
  breadcrumbs: customBreadcrumbs,
  defaultNavId,
  overrideOrg,
  overrideOrgType,
  overrideRole,
  overrideRoleName,
}: AppShellProps) {
  const pathname = usePathname();
  const session = useAuthSession();
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

  // Dynamically compute active navigation item from current route
  const activeNavId = React.useMemo(() => {
    if (defaultNavId) return defaultNavId;
    return getActiveNavId(pathname);
  }, [pathname, defaultNavId]);

  // Dynamically compute breadcrumbs if custom breadcrumbs not provided
  const breadcrumbs = React.useMemo(() => {
    if (customBreadcrumbs && customBreadcrumbs.length > 0) {
      return customBreadcrumbs;
    }
    return getDefaultBreadcrumbs(pathname);
  }, [pathname, customBreadcrumbs]);

  const currentOrg = overrideOrg || session.selectedOrg?.name || "Highland Apiaries Cooperative";
  const currentOrgType = overrideOrgType || session.selectedOrg?.displayType || "Beekeeper Cooperative";
  const currentRole = overrideRole || session.selectedRole?.systemRole || USER_ROLES.BEEKEEPER;
  const currentRoleName = overrideRoleName || session.selectedRole?.name || "Beekeeper";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Desktop Fixed Sidebar */}
      <Sidebar
        activeNavId={activeNavId}
        currentRole={currentRole}
        currentRoleName={currentRoleName}
        currentOrg={currentOrg}
        currentOrgType={currentOrgType}
      />

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        activeNavId={activeNavId}
        currentRole={currentRole}
        currentRoleName={currentRoleName}
        currentOrg={currentOrg}
        currentOrgType={currentOrgType}
      />

      {/* Main App Canvas - Independent Scroll */}
      <div className="flex flex-1 flex-col h-screen min-w-0 overflow-hidden">
        <Header
          onMenuToggle={() => setIsMobileNavOpen(true)}
          breadcrumbs={breadcrumbs}
          currentOrg={currentOrg}
          currentOrgType={currentOrgType}
          currentRole={currentRole}
          currentRoleName={currentRoleName}
        />

        <main className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

