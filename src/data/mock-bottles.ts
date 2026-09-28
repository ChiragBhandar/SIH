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

/**
 * Normalizes user-entered bottle codes, supporting shorthand numbers,
 * case variations, and full pasted QR URLs.
 * e.g. "00001" -> "HC-BTL-2026-00001"
 *      "42"    -> "HC-BTL-2026-00042"
 *      "hc-btl-2026-00002" -> "HC-BTL-2026-00002"
 *      "https://honeychain.io/verify/HC-BTL-2026-00001" -> "HC-BTL-2026-00001"
 */
export function normalizeBottleId(input: string): string {
  if (!input) return "";
  let clean = input.trim();

  // If a full verification URL was pasted
  const urlMatch = clean.match(/\/verify\/([a-zA-Z0-9\-_]+)/i);
  if (urlMatch) {
    clean = urlMatch[1];
  }

  // Strip query strings or trailing punctuation if pasted
  clean = clean.split("?")[0].replace(/[^a-zA-Z0-9\-_]/g, "");

  // If user entered only digits, e.g. "1", "00001", "42", "100"
  if (/^\d{1,5}$/.test(clean)) {
    const num = parseInt(clean, 10);
    return `HC-BTL-2026-${String(num).padStart(5, "0")}`;
  }

  // If user entered shorthand like "BTL-1", "HC-00001", "HC-BTL-00001"
  const prefixMatch = clean.match(/^(?:HC-)?(?:BTL-)?(?:2026-)?(\d{1,5})$/i);
  if (prefixMatch) {
    const num = parseInt(prefixMatch[1], 10);
    return `HC-BTL-2026-${String(num).padStart(5, "0")}`;
  }

  return clean.toUpperCase();
}

/**
 * Intelligently resolves any bottle identifier:
 * 1. Checks custom dynamic bottles (e.g. from localStorage)
 * 2. Checks static MOCK_BOTTLES
 * 3. Resolves serialized units in certified packaging runs (e.g. PKG-2026-0001 bottles 1-100)
 */
export function findBottle(rawId: string, customBottles?: Bottle[]): Bottle | undefined {
  if (!rawId) return undefined;
  const normId = normalizeBottleId(rawId);
  const upperRaw = rawId.trim().toUpperCase();

  // 1. Check custom bottles passed in
  if (customBottles && customBottles.length > 0) {
    const foundCustom = customBottles.find(
      (b) => b.id.toUpperCase() === normId || b.id.toUpperCase() === upperRaw
    );
    if (foundCustom) return foundCustom;
  }

  // 2. Check static mock bottles
  const foundMock = MOCK_BOTTLES.find(
    (b) => b.id.toUpperCase() === normId || b.id.toUpperCase() === upperRaw
  );
  if (foundMock) return foundMock;

  // 3. Check packaging run ranges (e.g. PKG-2026-0001 covers 00001 to 00100)
  const rangeMatch = normId.match(/^HC-BTL-2026-(\d{5})$/);
  if (rangeMatch) {
    const num = parseInt(rangeMatch[1], 10);
    if (num >= 1 && num <= 500) {
      const isSecondRun = num > 100 && num <= 200;
      const certLineage = cert1Lineage;
      const formattedNum = String(num).padStart(5, "0");

      return {
        id: `HC-BTL-2026-${formattedNum}`,
        productName: isSecondRun
          ? "Valley Pure Raw Acacia Honey"
          : "Highland Wild Multifloral Raw Honey",
        sourceBatchId: isSecondRun ? "HC-PB-2026-0003" : "HC-PB-2026-0001",
        sourceBatchNumber: isSecondRun ? "HC-PB-2026-0003" : "HC-PB-2026-0001",
        honeyVariety: isSecondRun
          ? "Kullu Valley Acacia & Apple Blossom"
          : "Himalayan Wild Multifloral (Micro-filtered)",
        bottleSize: (num % 2 === 0 ? "500 g" : "250 g") as BottleSize,
        bottleSizeKg: num % 2 === 0 ? 0.5 : 0.25,
        packagingRunId: isSecondRun ? "PKG-2026-0002" : "PKG-2026-0001",
        packagingDate: "2026-09-14",
        packagingFacility: "Golden Hive Packaging Line 1, Solan Industrial Facility",
        packagingLine: "Line 01 - Automatic Micro-Filler",
        lotReferenceCode: isSecondRun ? "LOT-2026-09-PB3" : "LOT-2026-09-PB1",
        certificationId: isSecondRun ? "CERT-HC-2026-0003" : "CERT-HC-2026-0001",
        status: "Published",
        qrStatus: "Active",
        qrIdentifier: `QR-HC-${formattedNum}`,
        verificationUrl: `/verify/HC-BTL-2026-${formattedNum}`,
        originRegion: isSecondRun
          ? "Kullu Valley, Himachal Pradesh"
          : "Chamoli, Uttarakhand / Himalayan Region",
        harvestPeriod: "September 2026",
        notes: isSecondRun
          ? "Valley South spring harvest certified single-batch retail bottle."
          : "Highland North origin single-batch certified retail bottle.",
        createdAt: "2026-09-14T12:00:00.000Z",
        publishedAt: "2026-09-14T12:15:00.000Z",
        sourceLineage: certLineage,
      };
    }
  }

  return undefined;
}

