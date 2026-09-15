import { SourceLineageTrace } from "./quality";

export type BottleStatus = "Draft" | "Created" | "Published" | "Suspended";
export type QRStatus = "Not Generated" | "Generated" | "Active" | "Suspended";
export type BottleSize = "250 g" | "500 g" | "750 g" | "1 kg";

export interface Bottle {
  id: string; // e.g. "HC-BTL-2026-00001"
  productName: string; // e.g. "Highland Wild Mountain Raw Honey"
  sourceBatchId: string; // e.g. "HC-PB-2026-0003"
  sourceBatchNumber: string; // e.g. "HC-PB-2026-0003"
  honeyVariety: string; // e.g. "Himalayan Wild Multifloral"
  bottleSize: BottleSize;
  bottleSizeKg: number; // 0.25, 0.5, 0.75, 1.0
  packagingRunId: string; // e.g. "PKG-2026-0001"
  packagingDate: string; // "2026-09-14"
  packagingFacility: string; // "Golden Hive Bottling Plant, Solan"
  packagingLine?: string; // "Line 01 - Automatic Micro-Filler"
  lotReferenceCode: string; // e.g. "LOT-2026-09-B1"
  certificationId: string; // e.g. "CERT-HC-2026-0003"
  status: BottleStatus;
  qrStatus: QRStatus;
  qrIdentifier: string; // e.g. "QR-HC-00001"
  verificationUrl: string; // "/verify/HC-BTL-2026-00001"
  originRegion: string; // "Chamoli, Uttarakhand / Himalayan Region"
  harvestPeriod: string; // "September 2026"
  notes?: string;
  createdAt: string;
  publishedAt?: string;
  suspendedAt?: string;
  suspendedReason?: string;
  sourceLineage: SourceLineageTrace;
}

export interface PackagingRun {
  id: string; // e.g. "PKG-2026-0001"
  sourceBatchId: string;
  sourceBatchNumber: string;
  productName: string;
  honeyVariety: string;
  bottleSize: BottleSize;
  bottleCount: number;
  totalPackagedWeightKg: number;
  packagingDate: string;
  packagingFacility: string;
  packagingLine: string;
  lotReferenceCode: string;
  bottleIdRange: {
    start: string;
    end: string;
  };
  certificationId: string;
  notes?: string;
  createdAt: string;
}

export interface CreateBottlesInput {
  sourceBatchId: string;
  productName: string;
  bottleSize: BottleSize;
  numberOfBottles: number;
  packagingDate: string;
  packagingFacility: string;
  packagingLine: string;
  lotReferenceCode: string;
  notes?: string;
}

export interface PublicTraceabilityMilestone {
  stage: string;
  title: string;
  description: string;
  dateOrPeriod: string;
  status: "completed" | "verified";
  badge?: string;
}

export interface PublicConsumerVerification {
  bottleId: string;
  productName: string;
  honeyVariety: string;
  bottleSize: BottleSize;
  originRegion: string;
  harvestPeriod: string;
  processingStatus: string;
  qualityApprovalStatus: string;
  certificationReference: string;
  verificationStatus: "VALID" | "UNKNOWN" | "UNPUBLISHED" | "SUSPENDED";
  publishedAt?: string;
  suspendedReason?: string;
  trustBadges: {
    originRecorded: boolean;
    traceabilityComplete: boolean;
    qualityTested: boolean;
    certificationVerified: boolean;
  };
  milestones: PublicTraceabilityMilestone[];
  disclaimer: string;
}
