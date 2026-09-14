"use client";

import * as React from "react";
import {
  Hexagon,
  ChevronLeft,
  ChevronRight,
  Shield,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NAVIGATION_CONFIG, NavItem } from "./nav-config";
import { UserRole } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeNavId: string;
  onSelectNav: (id: string) => void;
  currentRole: UserRole;
  currentOrg: string;
}

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  activeNavId,
  onSelectNav,
  currentRole,
  currentOrg,
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
    <TooltipProvider delayDuration={150}>
      <aside
        className={cn(
          "relative hidden h-screen flex-col border-r border-border bg-card transition-all duration-300 md:flex z-30",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs">
              <Hexagon className="h-4 w-4 fill-current stroke-[2.5]" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-foreground">
                  Honey Chain
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                  Traceability B2B
                </span>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Organisation Context Indicator */}
        {!isCollapsed && (
          <div className="border-b border-border/60 bg-muted/20 px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs">
              <Building className="h-3.5 w-3.5 text-primary shrink-0" />
              <div className="flex flex-col overflow-hidden">
                <span className="truncate font-medium text-foreground">
                  {currentOrg}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground capitalize">
                  <Shield className="h-3 w-3 text-primary/80" />
                  {currentRole.replace("_", " ")} mode
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Item Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {filteredGroups.map((group) => (
            <div key={group.id} className="space-y-1">
              {!isCollapsed && (
                <h4 className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  {group.label}
                </h4>
              )}
              <div className="space-y-0.5">
                {group.items.map((item: NavItem) => {
                  const Icon = item.icon;
                  const isActive = activeNavId === item.id;

                  const navButton = (
                    <button
                      type="button"
                      onClick={() => onSelectNav(item.id)}
                      className={cn(
                        "group relative flex w-full items-center rounded-md px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer",
                        isActive
                          ? "bg-accent text-accent-foreground font-semibold"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                        isCollapsed && "justify-center px-0"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary" />
                      )}
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground",
                          !isCollapsed && "mr-3"
                        )}
                      />
                      {!isCollapsed && (
                        <>
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
                      )}
                    </button>
                  );

                  if (isCollapsed) {
                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">
                          <p className="font-medium">{item.label}</p>
                          {item.badge && (
                            <span className="text-[10px] text-muted-foreground">
                              ({item.badge})
                            </span>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return <React.Fragment key={item.id}>{navButton}</React.Fragment>;
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Profile Footer */}
        <div className="border-t border-border p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-md bg-muted/30 p-2",
              isCollapsed && "justify-center p-1"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              HC
            </div>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden text-xs">
                <span className="truncate font-medium text-foreground">
                  Chirag Operator
                </span>
                <span className="truncate text-[10px] text-muted-foreground">
                  operator@honeychain.io
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
