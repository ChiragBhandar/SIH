"use client";

import * as React from "react";
import Link from "next/link";
import { useTraceability } from "@/context/traceability-context";
import { AdminRoleGuard, EventTypeBadge } from "@/components/admin";
import { useLanguage } from "@/context/language-context";
import {
  Building2,
  Users,
  History,
  AlertTriangle,
  KeyRound,
  Activity,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Scale,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminDashboardPage() {
  const {
    adminOrganisations,
    adminUsers,
    auditEvents,
    exceptions,
    accessRequests,
    plausibilityAlerts,
  } = useTraceability();
  const { tr } = useLanguage();

  // Metrics calculations
  const totalOrgs = adminOrganisations.length;
  const pendingOrgs = adminOrganisations.filter((o) => o.status === "Pending").length;
  const suspendedOrgs = adminOrganisations.filter((o) => o.status === "Suspended").length;

  const totalUsers = adminUsers.length;
  const activeUsers = adminUsers.filter((u) => u.status === "Active").length;

  const openExceptions = exceptions.filter(
    (e) => e.status === "open" || e.status === "investigating"
  ).length;
  const criticalExceptions = exceptions.filter(
    (e) => (e.status === "open" || e.status === "investigating") && e.severity === "critical"
  ).length;

  const pendingRequests = accessRequests.filter((r) => r.status === "pending").length;
  const totalAuditLogs = auditEvents.length;

  // Recent system activity
  const recentEvents = auditEvents.slice(0, 8);

  return (
    <AdminRoleGuard>
      <div className="space-y-8 max-w-7xl mx-auto pb-12">
        {/* Page Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="outline" className="font-mono text-xs border-amber-200 text-amber-800 bg-amber-50">
                {tr("Governance & Control Plane", "शासन एवं नियंत्रण प्रणाली")}
              </Badge>
              <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {tr("Ledger Sync: Operational", "खाता बही सिंक: सक्रिय")}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {tr("Administration", "प्रशासन")}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
              {tr(
                "Govern organisations, permissions, audit records, exceptions, and operational controls.",
                "संस्थाओं, अनुमतियों, ऑडिट रिकॉर्ड, विसंगतियों और परिचालन नियंत्रणों का प्रबंधन करें।"
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/admin/audit">
                <History className="w-4 h-4 text-amber-600" />
                <span>{tr("View Immutable Audit Log", "अपरिवर्तनीय ऑडिट लॉग देखें")}</span>
              </Link>
            </Button>
            <Button asChild size="sm" className="gap-2">
              <Link href="/admin/plausibility">
                <Activity className="w-4 h-4" />
                <span>{tr("Plausibility Review", "सत्यता समीक्षा")}</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Organisations */}
          <Link href="/admin/organisations" className="group">
            <Card className="h-full border-border/80 bg-card hover:border-primary/40 transition-all duration-150 hover:shadow-xs">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {tr("Organisations", "संस्थाएं")}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200 group-hover:bg-amber-100 transition-colors">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-mono mb-1">
                    {totalOrgs}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    {pendingOrgs > 0 && (
                      <span className="text-amber-700 font-semibold">{pendingOrgs} {tr("Pending", "लंबित")}</span>
                    )}
                    {suspendedOrgs > 0 && (
                      <span className="text-destructive font-semibold">• {suspendedOrgs} {tr("Suspended", "निलंबित")}</span>
                    )}
                    {pendingOrgs === 0 && suspendedOrgs === 0 && (
                      <span className="text-emerald-700 font-medium">{tr("All Active & Verified", "सभी सक्रिय व सत्यापित")}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Users */}
          <Link href="/admin/users" className="group">
            <Card className="h-full border-border/80 bg-card hover:border-primary/40 transition-all duration-150 hover:shadow-xs">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {tr("Users & Roles", "उपयोगकर्ता व भूमिकाएं")}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700 border border-sky-200 group-hover:bg-sky-100 transition-colors">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-mono mb-1">
                    {totalUsers}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="text-emerald-700 font-semibold">{activeUsers} {tr("Active", "सक्रिय")}</span>
                    <span>{tr("across 8 entities", "8 संस्थाओं में")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Open Exceptions */}
          <Link href="/admin/exceptions" className="group">
            <Card className="h-full border-border/80 bg-card hover:border-primary/40 transition-all duration-150 hover:shadow-xs">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {tr("Open Exceptions", "सक्रिय विसंगतियां")}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-700 border border-rose-200 group-hover:bg-rose-100 transition-colors">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-mono mb-1 flex items-baseline gap-2">
                    {openExceptions}
                    {criticalExceptions > 0 && (
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        {criticalExceptions} {tr("Critical", "गंभीर")}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span>{exceptions.length - openExceptions} {tr("Resolved or Dismissed", "निराकृत या खारिज")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Pending Access Requests */}
          <Link href="/admin/access-requests" className="group">
            <Card className="h-full border-border/80 bg-card hover:border-primary/40 transition-all duration-150 hover:shadow-xs">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {tr("Access Requests", "पहुंच अनुरोध")}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-700 border border-purple-200 group-hover:bg-purple-100 transition-colors">
                    <KeyRound className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-mono mb-1 flex items-baseline gap-2">
                    {pendingRequests}
                    {pendingRequests > 0 && (
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {tr("Needs Review", "समीक्षा आवश्यक")}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span>{tr("Restricted Data Scopes", "प्रतिबंधित डेटा स्कोप")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Audit Events */}
          <Link href="/admin/audit" className="group">
            <Card className="h-full border-border/80 bg-card hover:border-primary/40 transition-all duration-150 hover:shadow-xs">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {tr("Audit Events", "ऑडिट घटनाएं")}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 group-hover:bg-emerald-100 transition-colors">
                    <History className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-mono mb-1">
                    {totalAuditLogs}
                  </div>
                  <div className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{tr("Append-Only Chain", "अपरिवर्तनीय श्रृंखला")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Administration Modules Grid */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
              {tr("Operational Governance Modules", "परिचालन शासन मॉड्यूल")}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {tr(
                "Access core administrative consoles and statutory compliance controls.",
                "मुख्य प्रशासनिक कंसोल और वैधानिक अनुपालन नियंत्रणों तक पहुंचें।"
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: Organisations */}
            <Link href="/admin/organisations" className="group">
              <Card className="h-full border-border/80 bg-card hover:border-primary/50 transition-all duration-150 hover:shadow-sm flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {tr("Organisations", "संस्थाएं")}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    {tr(
                      "Manage registered beekeeper cooperatives, manufacturers, analytical laboratories, distributors, and regulatory bodies.",
                      "पंजीकृत मधुमक्खी पालक सहकारी समितियों, निर्माताओं, प्रयोगशालाओं और वितरकों का प्रबंधन करें।"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs font-semibold text-primary">
                    <span className="text-muted-foreground font-medium">{totalOrgs} {tr("Registered Entities", "पंजीकृत संस्थाएं")}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {tr("Manage Orgs", "संस्थाएं प्रबंधित करें")} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Card 2: Users & Roles */}
            <Link href="/admin/users" className="group">
              <Card className="h-full border-border/80 bg-card hover:border-primary/50 transition-all duration-150 hover:shadow-sm flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {tr("Users & Roles", "उपयोगकर्ता व भूमिकाएं")}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    {tr(
                      "Provision multiple operational and governance roles per account across cooperatives, facilities, and departments.",
                      "सहकारी समितियों, संयंत्रों और विभागों में प्रति खाता परिचालन और शासन भूमिकाएं आवंटित करें।"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs font-semibold text-primary">
                    <span className="text-muted-foreground font-medium">{totalUsers} {tr("Provisioned Accounts", "आवंटित खाते")}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {tr("Assign Roles", "भूमिकाएं सौंपें")} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Card 3: Complete Audit History */}
            <Link href="/admin/audit" className="group">
              <Card className="h-full border-border/80 bg-card hover:border-primary/50 transition-all duration-150 hover:shadow-sm flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <History className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {tr("Complete Audit History", "पूर्ण ऑडिट इतिहास")}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    {tr(
                      "Searchable and filterable append-only audit log covering operational, custody, lab certification, and administrative events.",
                      "परिचालन, कस्टडी, लैब प्रमाणीकरण और प्रशासनिक घटनाओं को कवर करने वाला अपरिवर्तनीय ऑडिट लॉग।"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs font-semibold text-primary">
                    <span className="text-muted-foreground font-medium">{totalAuditLogs} {tr("Verified Audit Events", "सत्यापित ऑडिट घटनाएं")}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {tr("Inspect Log", "लॉग निरीक्षण")} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Card 4: Exceptions & Anomalies */}
            <Link href="/admin/exceptions" className="group">
              <Card className="h-full border-border/80 bg-card hover:border-primary/50 transition-all duration-150 hover:shadow-sm flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {tr("Exceptions & Anomalies", "विसंगतियाँ और अनियमितताएं")}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    {tr(
                      "Investigate temperature violations, quality parameter failures, weight mismatches, and traceability gaps with full context.",
                      "तापमान उल्लंघन, गुणवत्ता मापदंड विफलता, वजन बेमेल और ट्रैसेबिलिटी अंतराल की जांच करें।"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs font-semibold text-primary">
                    <span className="text-muted-foreground font-medium">{openExceptions} {tr("Active Cases", "सक्रिय मामले")}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {tr("Triage Cases", "मामले जांचें")} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Card 5: Access Requests */}
            <Link href="/admin/access-requests" className="group">
              <Card className="h-full border-border/80 bg-card hover:border-primary/50 transition-all duration-150 hover:shadow-sm flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {tr("Access Requests", "पहुंच अनुरोध")}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    {tr(
                      "Review requests for restricted raw spectrometry data, precise GPS geofences, and supply chain telemetry clearance.",
                      "प्रतिबंधित कच्चा स्पेक्ट्रोमेट्री डेटा, सटीक जीपीएस जियोफ़ेंस और आपूर्ति श्रृंखला टेलीमेट्री अनुरोधों की समीक्षा करें।"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs font-semibold text-primary">
                    <span className="text-muted-foreground font-medium">{pendingRequests} {tr("Pending Decisions", "लंबित निर्णय")}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {tr("Review Scopes", "स्कोप की समीक्षा")} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Card 6: Field vs Sales Plausibility */}
            <Link href="/admin/plausibility" className="group">
              <Card className="h-full border-border/80 bg-card hover:border-primary/50 transition-all duration-150 hover:shadow-sm flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Activity className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {tr("Field vs Sales Plausibility", "उत्पादन बनाम बिक्री सत्यता")}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    {tr(
                      "Reconcile harvest production vs processing yield vs commercial sales commitments with human review safeguards.",
                      "कटाई उत्पादन बनाम प्रसंस्करण उपज बनाम वाणिज्यिक बिक्री प्रतिबद्धताओं का मिलान करें।"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs font-semibold text-primary">
                    <span className="text-muted-foreground font-medium">{plausibilityAlerts.length} {tr("Plausibility Envelopes", "सत्यता लिफाफे")}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {tr("Inspect Envelopes", "लिफाफे जांचें")} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* System Activity Section */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-bold text-foreground">
                    {tr("System Activity", "सिस्टम गतिविधि")}
                  </CardTitle>
                  <Badge variant="outline" className="text-[11px] font-semibold border-emerald-200 text-emerald-800 bg-emerald-50">
                    {tr("Live Feed", "लाइव फ़ीड")}
                  </Badge>
                </div>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  {tr(
                    "Chronological stream of verified events across organisations, traceability checkpoints, and governance actions.",
                    "संस्थाओं, ट्रैसेबिलिटी चौकियों और शासन कार्रवाइयों में सत्यापित घटनाओं की कालानुक्रमिक धारा।"
                  )}
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs text-primary font-semibold hover:text-primary">
                <Link href="/admin/audit">
                  {tr("All Events", "सभी घटनाएं")} ({totalAuditLogs}) &rarr;
                </Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {recentEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="py-3.5 px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <EventTypeBadge type={evt.eventType} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground text-xs sm:text-sm">{evt.action}</span>
                        <span className="font-mono text-xs text-muted-foreground">({evt.id})</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground mt-1">
                        <span>
                          {tr("Actor:", "कर्ता:")} <strong className="text-foreground font-medium">{evt.actor.name}</strong> ({evt.actor.role})
                        </span>
                        <span>•</span>
                        <span>
                          {tr("Org:", "संस्था:")} <strong className="text-foreground font-medium">{evt.organisation.name}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                    <span className="text-xs font-mono text-muted-foreground">
                      {new Date(evt.timestamp).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <Button asChild variant="outline" size="sm" className="h-7 text-xs gap-1">
                      <Link href={`/admin/audit/${evt.id}`}>
                        <span>{tr("Inspect", "निरीक्षण")}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminRoleGuard>
  );
}
