"use client";

import * as React from "react";
import Link from "next/link";
import { useAuthSession } from "@/context/auth-session-context";
import { USER_ROLES, UserRole } from "@/lib/constants";
import { ShieldAlert, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { useLanguage } from "@/context/language-context";

interface AdminRoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export function AdminRoleGuard({
  children,
  allowedRoles = [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
  fallbackTitle,
  fallbackDescription,
}: AdminRoleGuardProps) {
  const { user, selectedRole, allRoles, switchRole } = useAuthSession();
  const { tr, trRole } = useLanguage();

  const currentRole = (selectedRole?.systemRole || user?.role) as UserRole | undefined;
  const isAuthorized = currentRole ? allowedRoles.includes(currentRole) : false;

  if (!isAuthorized) {
    const adminRoleOption = allRoles.find(
      (r) => r.systemRole === USER_ROLES.SUPER_ADMIN || r.systemRole === USER_ROLES.ORG_ADMIN
    );

    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <Card className="max-w-lg w-full border-border shadow-md overflow-hidden text-center">
          <CardContent className="p-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-5 text-amber-600">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <Badge variant="outline" className="text-xs font-semibold border-amber-200 text-amber-800 bg-amber-50 mb-3">
              {tr("Simulation Security Notice", "सुरक्षा नियंत्रण सूचना")}
            </Badge>

            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mb-2">
              {fallbackTitle || tr("Administrative Access Restricted", "प्रशासनिक पहुंच प्रतिबंधित")}
            </h2>

            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-6">
              {fallbackDescription ||
                tr(
                  "You are currently logged in with a non-administrative operational role. In the simulated environment, select an administrative role to access governance, audit records, and security controls.",
                  "आप वर्तमान में गैर-प्रशासनिक परिचालन भूमिका के साथ लॉग इन हैं। शासन, ऑडिट रिकॉर्ड और नियंत्रणों तक पहुंचने के लिए व्यवस्थापक भूमिका चुनें।"
                )}
            </p>

            <div className="bg-muted/50 border border-border rounded-xl p-4 text-left mb-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{tr("Current Simulated Role:", "वर्तमान अनुकरणीय भूमिका:")}</span>
                <span className="font-semibold text-foreground capitalize">
                  {selectedRole?.name ? trRole(selectedRole.name) : user?.fullName || tr("Standard User", "मानक उपयोगकर्ता")}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{tr("Required Permission:", "आवश्यक अनुमति:")}</span>
                <span className="font-mono text-amber-700 font-semibold">
                  SUPER_ADMIN or ORG_ADMIN
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {adminRoleOption && (
                <Button
                  type="button"
                  onClick={() => switchRole(adminRoleOption.id)}
                  className="w-full sm:w-auto gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {tr("Switch to Admin Role", "व्यवस्थापक भूमिका पर जाएं")}
                </Button>
              )}
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto gap-2"
              >
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4" />
                  {tr("Return to Dashboard", "डैशबोर्ड पर लौटें")}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
