"use client";

import * as React from "react";
import {
  Menu,
  Bell,
  HelpCircle,
  Building,
  Check,
  ChevronsUpDown,
  Search,
  Shield,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from "@/lib/constants";
import { useAuthSession } from "@/context/auth-session-context";
import { useRouter } from "next/navigation";

export interface HeaderProps {
  onMenuToggle: () => void;
  breadcrumbs: BreadcrumbItem[];
  currentOrg?: string;
  currentOrgType?: string;
  onOrgChange?: (orgId: string) => void;
  currentRole?: UserRole;
  currentRoleName?: string;
  onRoleChange?: (roleId: string) => void;
  onSignOut?: () => void;
  userName?: string;
  userEmail?: string;
}

export function Header({
  onMenuToggle,
  breadcrumbs,
  currentOrg: propOrg,
  currentOrgType: propOrgType,
  onOrgChange: propOnOrgChange,
  currentRoleName: propRoleName,
  onRoleChange: propOnRoleChange,
  onSignOut: propOnSignOut,
  userName: propUserName,
  userEmail: propUserEmail,
}: HeaderProps) {
  const router = useRouter();
  const session = useAuthSession();

  const activeOrgName = propOrg || session.selectedOrg?.name || "Highland Apiaries Cooperative";
  const activeOrgType = propOrgType || session.selectedOrg?.displayType || "Beekeeper Cooperative";
  const activeRoleName = propRoleName || session.selectedRole?.name || "Beekeeper";
  const activeUserName = propUserName || session.user?.fullName || "Chirag Operator";
  const activeUserEmail = propUserEmail || session.user?.email || "operator@honeychain.io";

  const handleOrgSwitch = (orgId: string) => {
    if (propOnOrgChange) {
      propOnOrgChange(orgId);
    } else {
      session.switchOrganisation(orgId);
    }
  };

  const handleRoleSwitch = (roleId: string) => {
    if (propOnRoleChange) {
      propOnRoleChange(roleId);
    } else {
      session.switchRole(roleId);
    }
  };

  const handleSignOut = () => {
    if (propOnSignOut) {
      propOnSignOut();
    } else {
      session.logout();
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-xs sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="h-9 w-9 md:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Breadcrumb items={breadcrumbs} className="hidden sm:flex" />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search Shortcut */}
        <button
          type="button"
          className="hidden items-center gap-2 rounded-md border border-input bg-muted/40 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted md:flex"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Quick search...</span>
          <kbd className="pointer-events-none ml-2 inline-flex h-4 select-none items-center rounded border border-border bg-background px-1 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        {/* Organisation Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 px-2.5 text-xs font-normal max-w-[200px] truncate sm:max-w-none"
            >
              <Building className="h-3.5 w-3.5 text-primary shrink-0" />
              <div className="flex items-center gap-1.5 truncate">
                <span className="truncate font-medium">{activeOrgName}</span>
                <span className="hidden lg:inline text-[10px] text-muted-foreground">
                  ({activeOrgType})
                </span>
              </div>
              <ChevronsUpDown className="h-3 w-3 text-muted-foreground ml-0.5 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="flex items-center justify-between text-xs">
              <span>Active Organisation</span>
              <button
                onClick={() => router.push("/select-organisation")}
                className="text-[10px] text-primary hover:underline font-normal cursor-pointer"
              >
                Change...
              </button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {session.allOrganisations.map((org) => {
              const isSelected = org.name === activeOrgName || org.id === session.selectedOrg?.id;
              return (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleOrgSwitch(org.id)}
                  className="flex items-center justify-between py-2 text-xs cursor-pointer"
                >
                  <div className="flex flex-col overflow-hidden mr-2">
                    <span className="font-medium text-foreground truncate">{org.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {org.displayType} • {org.shortIdentifier}
                    </span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notification bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between text-xs">
              <span>Notifications</span>
              <span className="text-[10px] text-muted-foreground">3 unread</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-1 p-2">
              <div className="rounded-md p-2 text-xs hover:bg-muted/60 transition-colors">
                <p className="font-semibold text-foreground">Batch #HC-9820 Verified</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Lab test results certified with purity score 99.4%</p>
                <p className="text-[10px] text-muted-foreground mt-1">12 minutes ago</p>
              </div>
              <div className="rounded-md p-2 text-xs hover:bg-muted/60 transition-colors">
                <p className="font-semibold text-foreground">Custody Transfer Accepted</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Apex Processors acknowledged 420 kg raw honey.</p>
                <p className="text-[10px] text-muted-foreground mt-1">1 hour ago</p>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Support Entry */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hidden sm:flex"
          aria-label="Help and Documentation"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>

        {/* User profile dropdown with Role context */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full ring-offset-background transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                HC
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="flex flex-col space-y-0.5">
              <span className="text-xs font-semibold text-foreground">{activeUserName}</span>
              <span className="text-[11px] text-muted-foreground">{activeUserEmail}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                Active Session Role:
              </span>
              <div className="flex items-center justify-between mt-1 rounded-md bg-primary/10 border border-primary/20 px-2 py-1">
                <span className="text-xs font-semibold text-primary">{activeRoleName}</span>
                <button
                  onClick={() => router.push("/select-role")}
                  className="text-[10px] text-primary hover:underline font-normal cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[11px] font-normal text-muted-foreground">
              Switch Active Role:
            </DropdownMenuLabel>
            {session.allRoles.map((r) => {
              const isSelected = r.id === session.selectedRole?.id;
              return (
                <DropdownMenuItem
                  key={r.id}
                  onClick={() => handleRoleSwitch(r.id)}
                  className="flex items-center justify-between text-xs cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-primary" />
                    {r.name}
                  </span>
                  {isSelected && <Check className="h-3 w-3 text-primary" />}
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-xs text-rose-600 focus:text-rose-600 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
