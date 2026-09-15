"use client";

import * as React from "react";
import Link from "next/link";
import {
  Hexagon,
  Shield,
  Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/user-avatar";
import { NAVIGATION_CONFIG, NavItem } from "./nav-config";
import { UserRole } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  activeNavId: string;
  onSelectNav?: (id: string) => void;
  currentRole: UserRole;
  currentRoleName?: string;
  currentOrg: string;
  currentOrgType?: string;
}

export function Sidebar({
  activeNavId,
  onSelectNav,
  currentRole,
  currentRoleName,
  currentOrg,
  currentOrgType,
}: SidebarProps) {
  // Filter navigation items by active user role context
  const filteredGroups = React.useMemo(() => {
    return NAVIGATION_CONFIG.map((group) => {
      const items = group.items.filter((item) => {
        if (!item.requiredRoles || item.requiredRoles.length === 0) {
          return true;
        }
        return item.requiredRoles.includes(currentRole);
      });
      return { ...group, items };
    }).filter((group) => group.items.length > 0);
  }, [currentRole]);

  return (
    <aside className="hidden h-screen w-64 flex-col shrink-0 border-r border-border bg-card md:flex z-30 select-none">
      {/* Brand Header */}
      <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs">
            <Hexagon className="h-4 w-4 fill-current stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground">
              Honey Chain
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
              Traceability B2B
            </span>
          </div>
        </div>
      </div>

      {/* Organisation Context Indicator */}
      <div className="shrink-0 border-b border-border/60 bg-muted/20 px-4 py-2.5">
        <div className="flex items-center gap-2 text-xs">
          <Building className="h-3.5 w-3.5 text-primary shrink-0" />
          <div className="flex flex-col overflow-hidden w-full">
            <span className="truncate font-medium text-foreground">
              {currentOrg}
            </span>
            <span className="text-[10px] text-muted-foreground truncate">
              {currentOrgType || "Enterprise Organization"}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-primary font-semibold mt-0.5 capitalize">
              <Shield className="h-3 w-3 text-primary/80 shrink-0" />
              {currentRoleName || currentRole.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Item Groups */}
      <div className="flex-1 overflow-y-auto min-h-0 px-3 py-4 space-y-6">
        {filteredGroups.map((group) => (
          <div key={group.id} className="space-y-1">
            <h4 className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              {group.label}
            </h4>
            <div className="space-y-0.5">
              {group.items.map((item: NavItem) => {
                const Icon = item.icon;
                const isActive = activeNavId === item.id;
                const isRoute = item.href && item.href.startsWith("/");

                const content = (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary" />
                    )}
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors mr-3",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span className="truncate flex-1 text-left">
                      {item.label}
                    </span>
                    {item.badge !== undefined && (
                      <Badge
                        variant={item.badgeVariant || "secondary"}
                        className="ml-auto text-[10px] px-1.5 py-0 font-mono"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                );

                const commonClasses = cn(
                  "group relative flex w-full items-center rounded-md px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer",
                  isActive
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                );

                if (isRoute) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => onSelectNav?.(item.id)}
                      className={commonClasses}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectNav?.(item.id)}
                    className={commonClasses}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile Footer */}
      <div className="shrink-0 mt-auto border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-md bg-muted/30 p-2">
          <UserAvatar name="Chirag Operator" size="md" />
          <div className="flex flex-col overflow-hidden text-xs">
            <span className="truncate font-medium text-foreground">
              Chirag Operator
            </span>
            <span className="truncate text-[10px] text-muted-foreground">
              operator@honeychain.io
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
