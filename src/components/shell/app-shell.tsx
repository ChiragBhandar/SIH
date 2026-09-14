"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import { BreadcrumbItem } from "@/components/ui/breadcrumb";
import { USER_ROLES, UserRole } from "@/lib/constants";

export interface AppShellProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  defaultNavId?: string;
}

export function AppShell({
  children,
  breadcrumbs = [
    { label: "Honey Chain", href: "#" },
    { label: "Design System & Shell Preview", active: true },
  ],
  defaultNavId = "dashboard",
}: AppShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const [activeNavId, setActiveNavId] = React.useState(defaultNavId);
  const [currentOrg, setCurrentOrg] = React.useState("Highland Apiaries Cooperative");
  const [currentRole, setCurrentRole] = React.useState<UserRole>(USER_ROLES.SUPER_ADMIN);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Collapsible Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        activeNavId={activeNavId}
        onSelectNav={setActiveNavId}
        currentRole={currentRole}
        currentOrg={currentOrg}
      />

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        activeNavId={activeNavId}
        onSelectNav={setActiveNavId}
        currentRole={currentRole}
        currentOrg={currentOrg}
      />

      {/* Main App Canvas */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header
          onMenuToggle={() => setIsMobileNavOpen(true)}
          breadcrumbs={breadcrumbs}
          currentOrg={currentOrg}
          onOrgChange={setCurrentOrg}
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
