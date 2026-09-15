"use client";

import * as React from "react";
import Link from "next/link";
import { useAuthSession } from "@/context/auth-session-context";
import { USER_ROLES, UserRole } from "@/lib/constants";
import { ShieldAlert, ShieldCheck, ArrowLeft } from "lucide-react";

interface AdminRoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export function AdminRoleGuard({
  children,
  allowedRoles = [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
  fallbackTitle = "Administrative Access Restricted",
  fallbackDescription = "You are currently logged in with a non-administrative operational role. In the simulated environment, select an administrative role to access governance, audit records, and security controls.",
}: AdminRoleGuardProps) {
  const { user, selectedRole, allRoles, switchRole } = useAuthSession();

  const currentRole = (selectedRole?.systemRole || user?.role) as UserRole | undefined;
  const isAuthorized = currentRole ? allowedRoles.includes(currentRole) : false;

  if (!isAuthorized) {
    const adminRoleOption = allRoles.find(
      (r) => r.systemRole === USER_ROLES.SUPER_ADMIN || r.systemRole === USER_ROLES.ORG_ADMIN
    );

    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-stone-900 border border-amber-900/40 rounded-2xl p-8 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center mx-auto mb-6 shadow-inner text-amber-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            Simulation Security Notice
          </span>

          <h2 className="text-2xl font-bold text-stone-100 tracking-tight mb-3">
            {fallbackTitle}
          </h2>

          <p className="text-stone-400 text-sm leading-relaxed mb-6">
            {fallbackDescription}
          </p>

          <div className="bg-stone-950/60 border border-stone-800/80 rounded-xl p-4 text-left mb-6 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Current Simulated Role:</span>
              <span className="font-semibold text-stone-200 capitalize">
                {selectedRole?.name || user?.fullName || "Standard User"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Required Permission:</span>
              <span className="font-mono text-amber-400 font-semibold">
                SUPER_ADMIN or ORG_ADMIN
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {adminRoleOption && (
              <button
                type="button"
                onClick={() => switchRole(adminRoleOption.id)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20"
              >
                <ShieldCheck className="w-4 h-4" />
                Switch to Admin Role
              </button>
            )}
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-stone-800 text-stone-200 font-medium text-sm hover:bg-stone-700 transition-all border border-stone-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
