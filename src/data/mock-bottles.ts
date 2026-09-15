import { Bottle, PackagingRun, PublicConsumerVerification, BottleSize } from "@/types/bottle";
import { MOCK_CERTIFICATIONS } from "./mock-quality";

export const BOTTLE_SIZE_WEIGHTS: Record<BottleSize, number> = {
  "250 g": 0.25,
  "500 g": 0.5,
  "750 g": 0.75,
  "1 kg": 1.0,
};

const cert1Lineage = MOCK_CERTIFICATIONS[0].sourceLineage;

export const MOCK_PACKAGING_RUNS: PackagingRun[] = [
  {
    id: "PKG-2026-0001",
    sourceBatchId: "HC-PB-2026-0001",
    sourceBatchNumber: "HC-PB-2026-0001",
    productName: "Highland Wild Multifloral Raw Honey",
    honeyVariety: "Himalayan Wild Multifloral (Micro-filtered)",
    bottleSize: "500 g",
    bottleCount: 100,
    totalPackagedWeightKg: 50.0,
    packagingDate: "2026-09-14",
    packagingFacility: "Golden Hive Packaging Line 1, Solan Industrial Facility",
    packagingLine: "Line 01 - Automatic Micro-Filler",
    lotReferenceCode: "LOT-2026-09-PB1",
    bottleIdRange: {
      start: "HC-BTL-2026-00001",
      end: "HC-BTL-2026-00100",
    },
    certificationId: "CERT-HC-2026-0001",
    notes: "Initial retail packaging run for Highland North certified harvest batch.",
    createdAt: "2026-09-14T12:00:00.000Z",
  },
];

export const MOCK_BOTTLES: Bottle[] = [
  {
    id: "HC-BTL-2026-00001",
    productName: "Highland Wild Multifloral Raw Honey",
    sourceBatchId: "HC-PB-2026-0001",
    sourceBatchNumber: "HC-PB-2026-0001",
    honeyVariety: "Himalayan Wild Multifloral (Micro-filtered)",
    bottleSize: "500 g",
    bottleSizeKg: 0.5,
    packagingRunId: "PKG-2026-0001",
    packagingDate: "2026-09-14",
    packagingFacility: "Golden Hive Packaging Line 1, Solan Industrial Facility",
    packagingLine: "Line 01 - Automatic Micro-Filler",
    lotReferenceCode: "LOT-2026-09-PB1",
    certificationId: "CERT-HC-2026-0001",
    status: "Published",
    qrStatus: "Active",
    qrIdentifier: "QR-HC-00001",
    verificationUrl: "/verify/HC-BTL-2026-00001",
    originRegion: "Chamoli, Uttarakhand / Himalayan Region",
    harvestPeriod: "September 2026",
    notes: "Highland North origin single-batch certified retail bottle.",
    createdAt: "2026-09-14T12:00:00.000Z",
    publishedAt: "2026-09-14T12:15:00.000Z",
    sourceLineage: cert1Lineage,
  },
  {
    id: "HC-BTL-2026-00002",
    productName: "Highland Wild Multifloral Raw Honey",
    sourceBatchId: "HC-PB-2026-0001",
    sourceBatchNumber: "HC-PB-2026-0001",
    honeyVariety: "Himalayan Wild Multifloral (Micro-filtered)",
    bottleSize: "500 g",
    bottleSizeKg: 0.5,
    packagingRunId: "PKG-2026-0001",
    packagingDate: "2026-09-14",
    packagingFacility: "Golden Hive Packaging Line 1, Solan Industrial Facility",
    packagingLine: "Line 01 - Automatic Micro-Filler",
    lotReferenceCode: "LOT-2026-09-PB1",
    certificationId: "CERT-HC-2026-0001",
    status: "Published",
    qrStatus: "Active",
    qrIdentifier: "QR-HC-00002",
    verificationUrl: "/verify/HC-BTL-2026-00002",
    originRegion: "Chamoli, Uttarakhand / Himalayan Region",
    harvestPeriod: "September 2026",
    notes: "Highland North origin single-batch certified retail bottle.",
    createdAt: "2026-09-14T12:00:00.000Z",
    publishedAt: "2026-09-14T12:15:00.000Z",
    sourceLineage: cert1Lineage,
  },
  {
    id: "HC-BTL-2026-00003",
    productName: "Highland Wild Multifloral Raw Honey",
    sourceBatchId: "HC-PB-2026-0001",
    sourceBatchNumber: "HC-PB-2026-0001",
    honeyVariety: "Himalayan Wild Multifloral (Micro-filtered)",
    bottleSize: "500 g",
    bottleSizeKg: 0.5,
    packagingRunId: "PKG-2026-0001",
    packagingDate: "2026-09-14",
    packagingFacility: "Golden Hive Packaging Line 1, Solan Industrial Facility",
    packagingLine: "Line 01 - Automatic Micro-Filler",
    lotReferenceCode: "LOT-2026-09-PB1",
    certificationId: "CERT-HC-2026-0001",
    status: "Created",
    qrStatus: "Generated",
    qrIdentifier: "QR-HC-00003",
    verificationUrl: "/verify/HC-BTL-2026-00003",
    originRegion: "Chamoli, Uttarakhand / Himalayan Region",
    harvestPeriod: "September 2026",
    notes: "Pre-release inventory unit held in staging area.",
    createdAt: "2026-09-14T12:00:00.000Z",
    sourceLineage: cert1Lineage,
  },
  {
    id: "HC-BTL-2026-00004",
    productName: "Highland Wild Multifloral Raw Honey",
    sourceBatchId: "HC-PB-2026-0001",
    sourceBatchNumber: "HC-PB-2026-0001",
    honeyVariety: "Himalayan Wild Multifloral (Micro-filtered)",
    bottleSize: "500 g",
    bottleSizeKg: 0.5,
    packagingRunId: "PKG-2026-0001",
    packagingDate: "2026-09-14",
    packagingFacility: "Golden Hive Packaging Line 1, Solan Industrial Facility",
    packagingLine: "Line 01 - Automatic Micro-Filler",
    lotReferenceCode: "LOT-2026-09-PB1",
    certificationId: "CERT-HC-2026-0001",
    status: "Suspended",
    qrStatus: "Suspended",
    qrIdentifier: "QR-HC-00004",
    verificationUrl: "/verify/HC-BTL-2026-00004",
    originRegion: "Chamoli, Uttarakhand / Himalayan Region",
    harvestPeriod: "September 2026",
    notes: "Packaging inspection flagged for label alignment check.",
    suspendedReason: "Verification temporarily paused for packaging QC audit.",
    createdAt: "2026-09-14T12:00:00.000Z",
    suspendedAt: "2026-09-14T13:00:00.000Z",
    sourceLineage: cert1Lineage,
  },
  {
    id: "HC-BTL-2026-00005",
    productName: "Highland Wild Multifloral Raw Honey",
    sourceBatchId: "HC-PB-2026-0001",
    sourceBatchNumber: "HC-PB-2026-0001",
    honeyVariety: "Himalayan Wild Multifloral (Micro-filtered)",
    bottleSize: "500 g",
    bottleSizeKg: 0.5,
    packagingRunId: "PKG-2026-0001",
    packagingDate: "2026-09-14",
    packagingFacility: "Golden Hive Packaging Line 1, Solan Industrial Facility",
    packagingLine: "Line 01 - Automatic Micro-Filler",
    lotReferenceCode: "LOT-2026-09-PB1",
    certificationId: "CERT-HC-2026-0001",
    status: "Published",
    qrStatus: "Active",
    qrIdentifier: "QR-HC-00005",
    verificationUrl: "/verify/HC-BTL-2026-00005",
    originRegion: "Chamoli, Uttarakhand / Himalayan Region",
    harvestPeriod: "September 2026",
    createdAt: "2026-09-14T12:00:00.000Z",
    publishedAt: "2026-09-14T12:15:00.000Z",
    sourceLineage: cert1Lineage,
  },
];

/**
 * Creates a sanitized PublicConsumerVerification payload.
 * Crucially removes all sensitive internal data (user identities, carrier logistics, prices, audit IDs).
 */
export function buildPublicVerification(bottle?: Bottle): PublicConsumerVerification {
  if (!bottle) {
    return {
      bottleId: "UNKNOWN",
      productName: "Unknown Product",
      honeyVariety: "Unknown Variety",
      bottleSize: "500 g",
      originRegion: "Unknown Origin",
      harvestPeriod: "Unknown Period",
      processingStatus: "Unverified",
      qualityApprovalStatus: "Unverified",
      certificationReference: "None",
      verificationStatus: "UNKNOWN",
      trustBadges: {
        originRecorded: false,
        traceabilityComplete: false,
        qualityTested: false,
        certificationVerified: false,
      },
      milestones: [],
      disclaimer: "No verified record exists for this identifier.",
    };
  }

  let verificationStatus: "VALID" | "UNKNOWN" | "UNPUBLISHED" | "SUSPENDED" = "VALID";
  if (bottle.status === "Suspended" || bottle.qrStatus === "Suspended") {
    verificationStatus = "SUSPENDED";
  } else if (bottle.status === "Draft" || bottle.status === "Created") {
    verificationStatus = "UNPUBLISHED";
  } else if (bottle.status === "Published") {
    verificationStatus = "VALID";
  }

  const originRegion = bottle.originRegion || "Uttarakhand / Himalayan Region";
  const harvestPeriod = bottle.harvestPeriod || "September 2026";

  return {
    bottleId: bottle.id,
    productName: bottle.productName,
    honeyVariety: bottle.honeyVariety,
    bottleSize: bottle.bottleSize,
    originRegion,
    harvestPeriod,
    processingStatus: "Verified processing event (Low-temp micro-filtration)",
    qualityApprovalStatus: "Laboratory tested & certified pure",
    certificationReference: bottle.certificationId,
    verificationStatus,
    publishedAt: bottle.publishedAt,
    suspendedReason: bottle.suspendedReason,
    trustBadges: {
      originRecorded: !!bottle.sourceLineage?.apiaryName,
      traceabilityComplete: !!bottle.sourceLineage?.rawBatchId && !!bottle.sourceLineage?.processedBatchId,
      qualityTested: !!bottle.sourceLineage?.labTestId,
      certificationVerified: !!bottle.certificationId,
    },
    milestones: [
      {
        stage: "Harvest",
        title: "Harvest Recorded at Source",
        description: `Raw honey harvested from verified regional apiaries in ${originRegion}.`,
        dateOrPeriod: harvestPeriod,
        status: "verified",
        badge: "Apiary Origin",
      },
      {
        stage: "Processing",
        title: "Processed by Verified Manufacturer",
        description: "Gentle low-temperature clarification and filtration preserving native enzymes.",
        dateOrPeriod: bottle.packagingDate || "September 2026",
        status: "verified",
        badge: "Processing Verified",
      },
      {
        stage: "Laboratory",
        title: "Quality Testing Completed",
        description: "Multi-parameter laboratory analysis verifying purity, moisture, and absence of adulterants.",
        dateOrPeriod: "September 2026",
        status: "verified",
        badge: "Lab Tested",
      },
      {
        stage: "Certification",
        title: "Quality Approved & Certified",
        description: `Official quality certificate ${bottle.certificationId} issued by accredited testing laboratory.`,
        dateOrPeriod: "September 2026",
        status: "verified",
        badge: "Certified Authentic",
      },
      {
        stage: "Bottle",
        title: "Product Identity & QR Code Created",
        description: `Individual packaged bottle ${bottle.id} registered for consumer verification.`,
        dateOrPeriod: bottle.packagingDate || "September 2026",
        status: "completed",
        badge: "Packaging Completed",
      },
    ],
    disclaimer:
      "Based on the official digital traceability records available for this product on the Honey Chain registry.",
  };
}
