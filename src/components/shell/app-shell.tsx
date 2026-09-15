"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import { BreadcrumbItem } from "@/components/ui/breadcrumb";
import { USER_ROLES, UserRole } from "@/lib/constants";

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
  breadcrumbs = [
    { label: "Honey Chain", href: "#" },
    { label: "Dashboard", active: true },
  ],
  defaultNavId = "dashboard",
  overrideOrg,
  overrideOrgType,
  overrideRole,
  overrideRoleName,
}: AppShellProps) {
  const session = useAuthSession();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const [activeNavId, setActiveNavId] = React.useState(defaultNavId);

  const currentOrg = overrideOrg || session.selectedOrg?.name || "Highland Apiaries Cooperative";
  const currentOrgType = overrideOrgType || session.selectedOrg?.displayType || "Beekeeper Cooperative";
  const currentRole = overrideRole || session.selectedRole?.systemRole || USER_ROLES.BEEKEEPER;
  const currentRoleName = overrideRoleName || session.selectedRole?.name || "Beekeeper";

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Collapsible Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        activeNavId={activeNavId}
        onSelectNav={setActiveNavId}
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
        onSelectNav={setActiveNavId}
        currentRole={currentRole}
        currentRoleName={currentRoleName}
        currentOrg={currentOrg}
        currentOrgType={currentOrgType}
      />

      {/* Main App Canvas */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header
          onMenuToggle={() => setIsMobileNavOpen(true)}
          breadcrumbs={breadcrumbs}
          currentOrg={currentOrg}
          currentOrgType={currentOrgType}
          currentRole={currentRole}
          currentRoleName={currentRoleName}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
