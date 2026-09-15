import { BaseEntity } from "./common";
import { UserRole } from "@/lib/constants";

export type AdminOrgType =
  | "Beekeeper Cooperative"
  | "Manufacturer"
  | "Laboratory"
  | "Buyer"
  | "Administrator";

export type AdminOrgStatus = "Active" | "Pending" | "Suspended";

export interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  roles: string[];
  lastActive: string;
  avatarUrl?: string;
}

export interface OrganizationFacility {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity?: string;
  status: "Operational" | "Maintenance" | "Standby";
}

export interface AdminOrganization extends BaseEntity {
  name: string;
  code: string;
  type: AdminOrgType;
  rawType: "producer" | "processor" | "laboratory" | "buyer" | "regulatory";
  status: AdminOrgStatus;
  membersCount: number;
  members: OrganizationMember[];
  facilities: OrganizationFacility[];
  registrationNumber: string;
  assignedRoles: string[];
  contactEmail: string;
  contactPhone: string;
  headquarters: string;
  complianceRating: number;
  lastAuditDate: string;
  notes?: string;
}

export interface AdminUser extends BaseEntity {
  fullName: string;
  email: string;
  organizationId: string;
  organizationName: string;
  roles: string[];
  systemRole: UserRole;
  status: "Active" | "Disabled" | "Pending";
  lastActivity: string;
  avatarUrl?: string;
  permissions: string[];
  directDepartment?: string;
}

export type AuditEventType =
  | "Apiary Registered"
  | "Hive Registered"
  | "Activity Recorded"
  | "Harvest Created"
  | "Batch Created"
  | "Custody Transfer"
  | "Receiving"
  | "Processing"
  | "Laboratory Test"
  | "Certification"
  | "Bottle Created"
  | "Bottle Published"
  | "Marketplace Listing"
  | "Marketplace Order"
  | "Access Request"
  | "Role Assignment"
  | "Exception"
  | "Administrative Action";

export interface AuditActor {
  id: string;
  name: string;
  role: string;
  email?: string;
  organizationName: string;
}

export interface AuditEntityRef {
  type: string;
  id: string;
  title: string;
  href?: string;
}

export interface AuditEvent extends BaseEntity {
  eventType: AuditEventType;
  actor: AuditActor;
  organisation: {
    id: string;
    name: string;
    code: string;
  };
  entity: AuditEntityRef;
  timestamp: string;
  source:
    | "System Engine"
    | "Manual Entry"
    | "IoT Device"
    | "Lab Analyzer"
    | "Smart Contract"
    | "Marketplace Dispatcher"
    | "Admin Console";
  status: "verified" | "flagged" | "corrected" | "pending_review";
  action: string;
  previousEventHash: string;
  currentEventHash: string;
  immutableTimestamp: string;
  metadata: Record<string, unknown>;
  isAppendOnly: true;
}

export type ExceptionType =
  | "Receiving Rejection"
  | "Quality Rejection"
  | "Quantity Mismatch"
  | "Missing Traceability Link"
  | "Suspicious Yield"
  | "Access Issue"
  | "Other";

export type ExceptionSeverity = "low" | "medium" | "high" | "critical";
export type ExceptionStatus = "open" | "investigating" | "resolved" | "dismissed";

export interface LineageTraceStep {
  step: string;
  entityType: string;
  entityId: string;
  title: string;
  status: string;
  timestamp: string;
  details: string;
  location?: string;
  actor?: string;
}

export interface ComplianceException extends BaseEntity {
  type: ExceptionType;
  relatedEntity: AuditEntityRef;
  reportedBy: {
    name: string;
    role: string;
    organisation: string;
  };
  createdDate: string;
  severity: ExceptionSeverity;
  status: ExceptionStatus;
  description: string;
  lineageTrace: LineageTraceStep[];
  investigationNotes?: string;
  resolution?: {
    resolvedBy: string;
    resolvedAt: string;
    reason: string;
    correctiveAction: string;
  };
  auditEventId?: string;
}

export type AccessRequestStatus = "pending" | "approved" | "denied" | "expired";

export interface AccessRequest extends BaseEntity {
  requester: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  organisation: string;
  requestedResource: string;
  reason: string;
  requestedScope: string[];
  requestedAt: string;
  status: AccessRequestStatus;
  decision?: {
    decidedBy: string;
    decidedAt: string;
    decision: "approved" | "denied";
    reason?: string;
    grantedScope?: string[];
    auditEventId?: string;
  };
}

export interface PlausibilityBatchRef {
  id: string;
  name: string;
  honeyType: string;
  harvestKg: number;
  processedKg: number;
  status: string;
}

export interface PlausibilityOrderRef {
  id: string;
  buyer: string;
  quantityKg: number;
  date: string;
}

export interface PlausibilityAlert extends BaseEntity {
  title: string;
  category:
    | "yield_mismatch"
    | "sales_volume"
    | "quantity_discrepancy"
    | "traceability_gap"
    | "balanced_production";
  severity: "normal" | "warning" | "alert" | "critical";
  harvestVolumeKg: number;
  processedVolumeKg: number;
  listedVolumeKg: number;
  soldVolumeKg: number;
  discrepancyRatio: string;
  alertMessage: string;
  explanation: string;
  requiresHumanReview: boolean;
  relatedBatches: PlausibilityBatchRef[];
  relatedOrders: PlausibilityOrderRef[];
  status: "under_review" | "verified_balanced" | "investigation_opened" | "dismissed";
  lastCheckedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}
