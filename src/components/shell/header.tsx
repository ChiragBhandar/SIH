"use client";

import * as React from "react";
import {
  Menu,
  Building,
  Check,
  ChevronsUpDown,
  Shield,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { UserAvatar } from "@/components/ui/user-avatar";
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



        {/* User profile dropdown with Role context */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full ring-offset-background transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              aria-label="User account menu"
            >
              <UserAvatar
                src={session.user?.avatarUrl}
                name={activeUserName}
                size="md"
              />
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
