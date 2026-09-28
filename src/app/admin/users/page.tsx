"use client";

import * as React from "react";
import Link from "next/link";
import { useTraceability } from "@/context/traceability-context";
import { useLanguage } from "@/context/language-context";
import { AdminRoleGuard, StatusBadge, ConfirmationModal } from "@/components/admin";
import {
  Search,
  Filter,
  Ban,
  RotateCcw,
  Key,
  ChevronRight,
  UserCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminUsersPage() {
  const {
    adminUsers,
    adminOrganisations,
    assignUserRole,
    updateUserStatus,
  } = useTraceability();
  const { tr, trRole, isHindi } = useLanguage();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedOrg, setSelectedOrg] = React.useState<string>("all");
  const [selectedRole, setSelectedRole] = React.useState<string>("all");

  // Role Assignment Modal State
  const [roleModalOpen, setRoleModalOpen] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const [newRoleInput, setNewRoleInput] = React.useState("Organisation Admin");
  const [roleReason, setRoleReason] = React.useState("");
  const [roleError, setRoleError] = React.useState("");

  // Status Change Confirmation Modal State
  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [targetStatusUserId, setTargetStatusUserId] = React.useState<string | null>(null);
  const [targetStatus, setTargetStatus] = React.useState<"Active" | "Disabled">("Active");

  const activeTargetUser = adminUsers.find((u) => u.id === selectedUserId);
  const targetStatusUser = adminUsers.find((u) => u.id === targetStatusUserId);

  const formatLastActivity = (act: string) => {
    if (!isHindi || !act) return act;
    return act
      .replace("Just now", "अभी-अभी")
      .replace("minutes ago", "मिनट पहले")
      .replace("minute ago", "मिनट पहले")
      .replace("hours ago", "घंटे पहले")
      .replace("hour ago", "घंटे पहले")
      .replace("days ago", "दिन पहले")
      .replace("day ago", "दिन पहले");
  };

  const filteredUsers = React.useMemo(() => {
    return adminUsers.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.organizationName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesOrg = selectedOrg === "all" || user.organizationId === selectedOrg;
      const matchesRole =
        selectedRole === "all" ||
        user.roles.some((r) => r.toLowerCase().includes(selectedRole.toLowerCase()));

      return matchesSearch && matchesOrg && matchesRole;
    });
  }, [adminUsers, searchQuery, selectedOrg, selectedRole]);

  const handleOpenRoleModal = (userId: string) => {
    setSelectedUserId(userId);
    setNewRoleInput("Organisation Admin");
    setRoleReason("");
    setRoleError("");
    setRoleModalOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleReason.trim()) {
      setRoleError(tr("Audit justification is required for role modification.", "भूमिका संशोधन के लिए ऑडिट औचित्य आवश्यक है।"));
      return;
    }
    if (selectedUserId) {
      assignUserRole(selectedUserId, newRoleInput, roleReason.trim());
      setRoleModalOpen(false);
    }
  };

  const handleOpenStatusModal = (userId: string, newStatus: "Active" | "Disabled") => {
    setTargetStatusUserId(userId);
    setTargetStatus(newStatus);
    setStatusModalOpen(true);
  };

  const handleConfirmStatus = (reason: string) => {
    if (targetStatusUserId) {
      updateUserStatus(targetStatusUserId, targetStatus, reason);
    }
  };

  return (
    <AdminRoleGuard>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 font-medium">
              <Link href="/admin" className="hover:text-foreground transition-colors">
                {tr("Administration", "प्रशासन")}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span className="text-foreground font-semibold">{tr("Users & Roles", "उपयोगकर्ता एवं भूमिकाएं")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {tr("Users & Capabilities", "उपयोगकर्ता एवं भूमिकाएं")}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
              {tr(
                "Govern user permissions, provision multi-role credentials across organisations, and audit authorization history.",
                "उपयोगकर्ता अनुमतियों को नियंत्रित करें, संगठनों में बहु-भूमिका क्रेडेंशियल्स का प्रावधान करें और प्राधिकरण इतिहास का ऑडिट करें।"
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs py-1 px-2.5 bg-card">
              {tr("Total:", "कुल:")} <strong className="ml-1 text-foreground">{adminUsers.length}</strong> {tr("Accounts", "खाते")}
            </Badge>
          </div>
        </div>

        {/* Filter Bar */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardContent className="p-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={tr("Search user name, email, or org...", "उपयोगकर्ता नाम, ईमेल या संगठन से खोजें...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-background border border-input text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Filter className="w-3.5 h-3.5" />
                <span>{tr("Organisation:", "संगठन:")}</span>
                <select
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  className="bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">{tr("All Organisations", "सभी संगठन")}</option>
                  {adminOrganisations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{tr("Role:", "भूमिका:")}</span>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="all">{tr("All Roles", "सभी भूमिकाएं")}</option>
                  <option value="Beekeeper">{trRole("Beekeeper")}</option>
                  <option value="Processor">{trRole("Processor")}</option>
                  <option value="Lab Technician">{trRole("Lab Technician")}</option>
                  <option value="Buyer">{trRole("Buyer")}</option>
                  <option value="Organisation Admin">{trRole("Organisation Admin")}</option>
                  <option value="Super Admin">{trRole("Super Admin")}</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("User", "उपयोगकर्ता")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("Organisation", "संगठन")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("Roles & Capabilities", "भूमिकाएं एवं क्षमताएं")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("Status", "स्थिति")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground">{tr("Last Activity", "अंतिम गतिविधि")}</TableHead>
                  <TableHead className="text-[11px] uppercase font-semibold text-muted-foreground text-right">{tr("Actions", "कार्रवाई")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                      {tr("No users match the search filters.", "खोज फ़िल्टर से कोई उपयोगकर्ता मेल नहीं खाता।")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/40 transition-colors">
                      {/* User identity */}
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <UserAvatar
                            src={user.avatarUrl}
                            name={user.fullName}
                            size="md"
                          />
                          <div>
                            <span className="font-semibold text-foreground text-xs sm:text-sm block">
                              {user.fullName}
                            </span>
                            <span className="text-muted-foreground text-[11px] font-mono">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Organisation */}
                      <TableCell>
                        <div className="flex flex-col">
                          <Link
                            href={`/admin/organisations/${user.organizationId}`}
                            className="font-medium text-foreground hover:text-primary transition-colors"
                          >
                            {user.organizationName}
                          </Link>
                          {user.directDepartment && (
                            <span className="text-[10px] text-muted-foreground">
                              {user.directDepartment}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Roles */}
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {user.roles.map((r, i) => (
                            <Badge
                              key={i}
                              variant={r.includes("Admin") ? "warning" : "secondary"}
                              className="text-[10px] font-medium py-0 px-1.5"
                            >
                              {trRole(r)}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={user.status} variant="userStatus" size="sm" />
                      </TableCell>

                      {/* Last Activity */}
                      <TableCell className="text-muted-foreground font-mono text-[11px]">
                        {formatLastActivity(user.lastActivity)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenRoleModal(user.id)}
                            className="h-7 text-xs gap-1"
                            title={tr("Assign or add role", "भूमिका सौंपें या जोड़ें")}
                          >
                            <Key className="w-3.5 h-3.5 text-amber-600" />
                            <span>{tr("Assign Role", "भूमिका सौंपें")}</span>
                          </Button>

                          {user.status === "Active" ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenStatusModal(user.id, "Disabled")}
                              className="h-7 px-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                              title={tr("Disable Account", "खाता अक्षम करें")}
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenStatusModal(user.id, "Active")}
                              className="h-7 px-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                              title={tr("Enable Account", "खाता सक्षम करें")}
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Assign Role Custom Modal */}
        {roleModalOpen && activeTargetUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-6 shadow-xl">
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-3.5 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {tr(`Assign Role to ${activeTargetUser.fullName}`, `${activeTargetUser.fullName} को भूमिका सौंपें`)}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {tr("Organisation:", "संगठन:")} {activeTargetUser.organizationName}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveRole} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-foreground uppercase tracking-wider mb-1.5">
                    {tr("Select Role to Provision:", "सौंपने के लिए भूमिका चुनें:")}
                  </label>
                  <select
                    value={newRoleInput}
                    onChange={(e) => setNewRoleInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-input text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="Beekeeper">{trRole("Beekeeper")} {tr("(Field & Harvest Registration)", "(फील्ड एवं कटाई पंजीकरण)")}</option>
                    <option value="Apiary Master">{trRole("Apiary Master")} {tr("(Colony & Hive Management)", "(कॉलोनी एवं छत्ता प्रबंधन)")}</option>
                    <option value="Processor">{trRole("Processor")} {tr("(Micro-filtration & Blending)", "(सूक्ष्म-निस्पंदन एवं मिश्रण)")}</option>
                    <option value="Packaging Line Operator">{tr("Packaging Line Operator", "पैकेजिंग लाइन ऑपरेटर")}</option>
                    <option value="Lab Technician">{trRole("Lab Technician")} {tr("(Testing & Analysis)", "(परीक्षण एवं विश्लेषण)")}</option>
                    <option value="Buyer">{trRole("Buyer")} {tr("(Commercial Procurement)", "(वाणिज्यिक खरीद)")}</option>
                    <option value="Organisation Admin">{trRole("Organisation Admin")} {tr("(Team Management)", "(टीम प्रबंधन)")}</option>
                    <option value="Super Admin">{trRole("Super Admin")} {tr("(System Governance)", "(सिस्टम प्रशासन)")}</option>
                    <option value="Regulatory Officer">{trRole("Regulatory Officer")} {tr("(Anti-Fraud Sentinel)", "(धोखाधड़ी रोधी निगरानी)")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-foreground uppercase tracking-wider mb-1.5">
                    {tr("Current Active Roles:", "वर्तमान सक्रिय भूमिकाएं:")}
                  </label>
                  <div className="flex flex-wrap gap-1 p-2.5 bg-muted/40 rounded-lg border border-border">
                    {activeTargetUser.roles.map((r, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-[11px] font-medium py-0.5 px-2"
                      >
                        {trRole(r)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-foreground uppercase tracking-wider mb-1.5">
                    {tr("Mandatory Audit Justification", "अनिवार्य ऑडिट औचित्य")} <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    value={roleReason}
                    onChange={(e) => {
                      setRoleReason(e.target.value);
                      if (roleError) setRoleError("");
                    }}
                    rows={3}
                    placeholder={tr(
                      "Provide justification for provisioning this administrative capability...",
                      "इस प्रशासनिक क्षमता के प्रावधान के लिए औचित्य प्रदान करें..."
                    )}
                    className={`w-full px-3 py-2 rounded-lg bg-background border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                      roleError ? "border-destructive" : "border-input"
                    }`}
                  />
                  {roleError && <p className="text-xs text-destructive mt-1 font-medium">{roleError}</p>}
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setRoleModalOpen(false)}
                  >
                    {tr("Cancel", "रद्द करें")}
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                  >
                    {tr("Provision Role & Log Event", "भूमिका सौंपें एवं इवेंट दर्ज करें")}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User Status Modal */}
        <ConfirmationModal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          onConfirm={handleConfirmStatus}
          title={
            targetStatus === "Disabled"
              ? tr(`Disable User Account "${targetStatusUser?.fullName}"?`, `उपयोगकर्ता खाता "${targetStatusUser?.fullName}" को अक्षम करें?`)
              : tr(`Enable User Account "${targetStatusUser?.fullName}"?`, `उपयोगकर्ता खाता "${targetStatusUser?.fullName}" को सक्षम करें?`)
          }
          description={
            targetStatus === "Disabled"
              ? tr(
                  "This will deactivate simulated login access and revoke signing privileges while keeping historical cryptographic audit events untouched.",
                  "यह ऐतिहासिक क्रिप्टोग्राफिक ऑडिट इवेंट को अप्रभावित रखते हुए लॉगिन पहुंच को निष्क्रिय करेगा और हस्ताक्षर विशेषाधिकारों को रद्द करेगा।"
                )
              : tr(
                  "This will restore active login privileges and allow the user to record activities.",
                  "यह सक्रिय लॉगिन विशेषाधिकार बहाल करेगा और उपयोगकर्ता को गतिविधियों को रिकॉर्ड करने की अनुमति देगा।"
                )
          }
          confirmText={targetStatus === "Disabled" ? tr("Disable Account", "खाता अक्षम करें") : tr("Enable Account", "खाता सक्षम करें")}
          variant={targetStatus === "Disabled" ? "danger" : "success"}
          reasonPlaceholder={tr("Enter operational reason for status change...", "स्थिति परिवर्तन के लिए परिचालन कारण दर्ज करें...")}
        />
      </div>
    </AdminRoleGuard>
  );
}
