"use client";

import * as React from "react";
import {
  Apiary,
  Hive,
  ColonyActivity,
  HarvestBatch,
} from "@/types/traceability";
import {
  CustodyTransfer,
  ReceivingRecord,
  CreateCustodyTransferInput,
  AcceptReceivingInput,
  RejectReceivingInput,
} from "@/types/custody";
import {
  ProcessingJob,
  CreateProcessingJobInput,
  ProcessingInputBatchRef,
} from "@/types/processing";
import {
  LabTest,
  HoneyCertificate,
  SubmitLabSampleInput,
  ApproveLabTestInput,
  RejectLabTestInput,
  RequestCorrectionLabTestInput,
  QualityParameterResult,
  QualityDecisionEvent,
  SourceLineageTrace,
} from "@/types/quality";
import {
  Bottle,
  PackagingRun,
  CreateBottlesInput,
  PublicConsumerVerification,
} from "@/types/bottle";
import {
  MarketplaceListing,
  MarketplaceOrder,
  CreateMarketplaceOrderInput,
  BatchMarketplaceActivity,
} from "@/types/marketplace";
import {
  AdminOrganization,
  AdminUser,
  AuditEvent,
  ComplianceException,
  AccessRequest,
  PlausibilityAlert,
  AdminOrgStatus,
  ExceptionStatus,
  AuditEventType,
  AuditEntityRef,
} from "@/types/admin";
import {
  MOCK_APIARIES,
  MOCK_HIVES,
  MOCK_ACTIVITIES,
  MOCK_BATCHES,
  MOCK_CUSTODY_TRANSFERS,
  MOCK_RECEIVING_RECORDS,
  MOCK_PROCESSING_JOBS,
} from "@/data/mock-traceability";
import {
  MOCK_LAB_TESTS,
  MOCK_CERTIFICATIONS,
  MOCK_LABORATORIES,
  MOCK_LAB_ANALYSTS,
  DEFAULT_QUALITY_PARAMETERS,
} from "@/data/mock-quality";
import {
  MOCK_BOTTLES,
  MOCK_PACKAGING_RUNS,
  BOTTLE_SIZE_WEIGHTS,
  buildPublicVerification,
} from "@/data/mock-bottles";
import {
  MOCK_MARKETPLACE_LISTINGS,
  MOCK_MARKETPLACE_ORDERS,
} from "@/data/mock-marketplace";
import {
  MOCK_ADMIN_ORGANISATIONS,
  MOCK_ADMIN_USERS,
  MOCK_AUDIT_EVENTS,
  MOCK_EXCEPTIONS,
  MOCK_ACCESS_REQUESTS,
  MOCK_PLAUSIBILITY_ALERTS,
} from "@/data/mock-admin";
import { MOCK_ORGANISATIONS } from "@/data/mock-auth";

const STORAGE_KEY = "honey_chain_mock_traceability_v7";

interface TraceabilityState {
  apiaries: Apiary[];
  hives: Hive[];
  activities: ColonyActivity[];
  batches: HarvestBatch[];
  custodyTransfers: CustodyTransfer[];
  receivingRecords: ReceivingRecord[];
  processingJobs: ProcessingJob[];
  labTests: LabTest[];
  certifications: HoneyCertificate[];
  bottles: Bottle[];
  packagingRuns: PackagingRun[];
  marketplaceListings: MarketplaceListing[];
  marketplaceOrders: MarketplaceOrder[];
  adminOrganisations: AdminOrganization[];
  adminUsers: AdminUser[];
  auditEvents: AuditEvent[];
  exceptions: ComplianceException[];
  accessRequests: AccessRequest[];
  plausibilityAlerts: PlausibilityAlert[];
}

const DEFAULT_STATE: TraceabilityState = {
  apiaries: MOCK_APIARIES,
  hives: MOCK_HIVES,
  activities: MOCK_ACTIVITIES,
  batches: MOCK_BATCHES,
  custodyTransfers: MOCK_CUSTODY_TRANSFERS,
  receivingRecords: MOCK_RECEIVING_RECORDS,
  processingJobs: MOCK_PROCESSING_JOBS,
  labTests: MOCK_LAB_TESTS,
  certifications: MOCK_CERTIFICATIONS,
  bottles: MOCK_BOTTLES,
  packagingRuns: MOCK_PACKAGING_RUNS,
  marketplaceListings: MOCK_MARKETPLACE_LISTINGS,
  marketplaceOrders: MOCK_MARKETPLACE_ORDERS,
  adminOrganisations: MOCK_ADMIN_ORGANISATIONS,
  adminUsers: MOCK_ADMIN_USERS,
  auditEvents: MOCK_AUDIT_EVENTS,
  exceptions: MOCK_EXCEPTIONS,
  accessRequests: MOCK_ACCESS_REQUESTS,
  plausibilityAlerts: MOCK_PLAUSIBILITY_ALERTS,
};

function readStorage(): TraceabilityState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_STATE;
    const parsed = JSON.parse(stored);
    return {
      apiaries: Array.isArray(parsed.apiaries) && parsed.apiaries.length > 0 ? parsed.apiaries : MOCK_APIARIES,
      hives: Array.isArray(parsed.hives) && parsed.hives.length > 0 ? parsed.hives : MOCK_HIVES,
      activities: Array.isArray(parsed.activities) && parsed.activities.length > 0 ? parsed.activities : MOCK_ACTIVITIES,
      batches: Array.isArray(parsed.batches) && parsed.batches.length > 0 ? parsed.batches : MOCK_BATCHES,
      custodyTransfers: Array.isArray(parsed.custodyTransfers) && parsed.custodyTransfers.length > 0 ? parsed.custodyTransfers : MOCK_CUSTODY_TRANSFERS,
      receivingRecords: Array.isArray(parsed.receivingRecords) && parsed.receivingRecords.length > 0 ? parsed.receivingRecords : MOCK_RECEIVING_RECORDS,
      processingJobs: Array.isArray(parsed.processingJobs) && parsed.processingJobs.length > 0 ? parsed.processingJobs : MOCK_PROCESSING_JOBS,
      labTests: Array.isArray(parsed.labTests) && parsed.labTests.length > 0 ? parsed.labTests : MOCK_LAB_TESTS,
      certifications: Array.isArray(parsed.certifications) && parsed.certifications.length > 0 ? parsed.certifications : MOCK_CERTIFICATIONS,
      bottles: Array.isArray(parsed.bottles) && parsed.bottles.length > 0 ? parsed.bottles : MOCK_BOTTLES,
      packagingRuns: Array.isArray(parsed.packagingRuns) && parsed.packagingRuns.length > 0 ? parsed.packagingRuns : MOCK_PACKAGING_RUNS,
      marketplaceListings: Array.isArray(parsed.marketplaceListings) && parsed.marketplaceListings.length > 0 ? parsed.marketplaceListings : MOCK_MARKETPLACE_LISTINGS,
      marketplaceOrders: Array.isArray(parsed.marketplaceOrders) && parsed.marketplaceOrders.length > 0 ? parsed.marketplaceOrders : MOCK_MARKETPLACE_ORDERS,
      adminOrganisations: Array.isArray(parsed.adminOrganisations) && parsed.adminOrganisations.length > 0 ? parsed.adminOrganisations : MOCK_ADMIN_ORGANISATIONS,
      adminUsers: Array.isArray(parsed.adminUsers) && parsed.adminUsers.length > 0 ? parsed.adminUsers : MOCK_ADMIN_USERS,
      auditEvents: Array.isArray(parsed.auditEvents) && parsed.auditEvents.length > 0 ? parsed.auditEvents : MOCK_AUDIT_EVENTS,
      exceptions: Array.isArray(parsed.exceptions) && parsed.exceptions.length > 0 ? parsed.exceptions : MOCK_EXCEPTIONS,
      accessRequests: Array.isArray(parsed.accessRequests) && parsed.accessRequests.length > 0 ? parsed.accessRequests : MOCK_ACCESS_REQUESTS,
      plausibilityAlerts: Array.isArray(parsed.plausibilityAlerts) && parsed.plausibilityAlerts.length > 0 ? parsed.plausibilityAlerts : MOCK_PLAUSIBILITY_ALERTS,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function writeStorage(state: TraceabilityState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

// Memory store & reactive subscription
let memoryState: TraceabilityState = DEFAULT_STATE;
const storeListeners = new Set<() => void>();

function updateStore(nextState: TraceabilityState) {
  memoryState = nextState;
  writeStorage(memoryState);
  storeListeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  storeListeners.add(callback);
  return () => {
    storeListeners.delete(callback);
  };
}

function getSnapshot(): TraceabilityState {
  return memoryState;
}

function getServerSnapshot(): TraceabilityState {
  return DEFAULT_STATE;
}

export interface TraceabilityContextValue {
  apiaries: Apiary[];
  hives: Hive[];
  activities: ColonyActivity[];
  batches: HarvestBatch[];
  custodyTransfers: CustodyTransfer[];
  receivingRecords: ReceivingRecord[];
  processingJobs: ProcessingJob[];
  isLoaded: boolean;
  addApiary: (data: {
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    elevation: string;
    dominantFlora: string;
    hiveCount: number;
    status?: "active" | "inactive" | "quarantine";
    notes?: string;
  }) => Apiary;
  addHive: (data: {
    identifier: string;
    internalCode: string;
    apiaryId: string;
    hiveType: Hive["hiveType"];
    installationDate: string;
    queenStatus: Hive["queenStatus"];
    locationInApiary: string;
    nfcRfidId: string;
    status?: Hive["status"];
    notes?: string;
  }) => Hive;
  addActivity: (data: {
    type: ColonyActivity["type"];
    hiveId: string;
    weather: string;
    temperature: string;
    humidity: string;
    floralObservation: string;
    queenStatus: ColonyActivity["queenStatus"];
    notes: string;
    recordedBy?: string;
  }) => ColonyActivity;
  addBatch: (data: {
    sourceApiaryId: string;
    sourceHiveIds: string[];
    harvestDate: string;
    honeyType: string;
    weightKg: number;
    containerRef: string;
    storageLocation: string;
    notes?: string;
    createdBy?: string;
  }) => HarvestBatch;
  addCustodyTransfer: (data: CreateCustodyTransferInput) => CustodyTransfer;
  acceptReceiving: (
    transferId: string,
    data: AcceptReceivingInput
  ) => { transfer: CustodyTransfer; record: ReceivingRecord; batch?: HarvestBatch };
  rejectReceiving: (
    transferId: string,
    data: RejectReceivingInput
  ) => { transfer: CustodyTransfer; record: ReceivingRecord; batch?: HarvestBatch };
  addProcessingJob: (
    data: CreateProcessingJobInput
  ) => { job: ProcessingJob; outputBatch: HarvestBatch };
  getApiary: (id: string) => Apiary | undefined;
  getHive: (id: string) => Hive | undefined;
  getHivesByApiary: (apiaryId: string) => Hive[];
  getActivitiesByHive: (hiveId: string) => ColonyActivity[];
  getBatch: (id: string) => HarvestBatch | undefined;
  getCustodyTransfer: (id: string) => CustodyTransfer | undefined;
  getCustodyTransfersByBatch: (batchId: string) => CustodyTransfer[];
  getIncomingTransfersByOrg: (orgId: string) => CustodyTransfer[];
  getOutgoingTransfersByOrg: (orgId: string) => CustodyTransfer[];
  getReceivingRecord: (id: string) => ReceivingRecord | undefined;
  getReceivingRecordByTransfer: (transferId: string) => ReceivingRecord | undefined;
  getReceivingRecordByBatch: (batchId: string) => ReceivingRecord | undefined;
  getProcessingJob: (id: string) => ProcessingJob | undefined;
  getProcessingJobsByInputBatch: (batchId: string) => ProcessingJob[];
  getProcessingJobByOutputBatch: (batchId: string) => ProcessingJob | undefined;
  getEligibleProcessingBatches: (orgId?: string) => HarvestBatch[];
  labTests: LabTest[];
  certifications: HoneyCertificate[];
  submitLabSample: (input: SubmitLabSampleInput) => LabTest;
  updateLabTestResults: (testId: string, results: QualityParameterResult[]) => LabTest;
  approveLabTest: (testId: string, input: ApproveLabTestInput) => HoneyCertificate;
  rejectLabTest: (testId: string, input: RejectLabTestInput) => LabTest;
  requestCorrectionLabTest: (testId: string, input: RequestCorrectionLabTestInput) => LabTest;
  getLabTest: (id: string) => LabTest | undefined;
  getLabTestsByBatch: (batchIdOrNumber: string) => LabTest[];
  getCertification: (id: string) => HoneyCertificate | undefined;
  getCertificationByBatch: (batchIdOrNumber: string) => HoneyCertificate | undefined;
  getEligibleLabTestingBatches: () => HarvestBatch[];
  bottles: Bottle[];
  packagingRuns: PackagingRun[];
  createPackagingRun: (input: CreateBottlesInput) => { run: PackagingRun; bottles: Bottle[] };
  publishBottle: (bottleId: string) => Bottle;
  publishAllBatchBottles: (packagingRunId: string) => Bottle[];
  suspendBottle: (bottleId: string, reason?: string) => Bottle;
  getBottle: (id: string) => Bottle | undefined;
  getBottlesByBatch: (batchIdOrNumber: string) => Bottle[];
  getPackagingRun: (id: string) => PackagingRun | undefined;
  getPublicVerification: (bottleId: string) => PublicConsumerVerification;
  getEligibleBottlingBatches: () => HarvestBatch[];
  marketplaceListings: MarketplaceListing[];
  marketplaceOrders: MarketplaceOrder[];
  getMarketplaceListing: (id: string) => MarketplaceListing | undefined;
  getMarketplaceListingsByBatch: (batchIdOrNumber: string) => MarketplaceListing[];
  getMarketplaceOrder: (id: string) => MarketplaceOrder | undefined;
  getMarketplaceOrdersByListing: (listingId: string) => MarketplaceOrder[];
  getMarketplaceOrdersByBatch: (batchIdOrNumber: string) => MarketplaceOrder[];
  createMarketplaceOrder: (input: CreateMarketplaceOrderInput) => MarketplaceOrder;
  acceptMarketplaceOrder: (orderId: string, notes?: string) => MarketplaceOrder;
  rejectMarketplaceOrder: (orderId: string, reason: string) => MarketplaceOrder;
  cancelMarketplaceOrder: (orderId: string, reason: string) => MarketplaceOrder;
  getBatchMarketplaceActivity: (batchIdOrNumber: string) => BatchMarketplaceActivity[];
  adminOrganisations: AdminOrganization[];
  adminUsers: AdminUser[];
  auditEvents: AuditEvent[];
  exceptions: ComplianceException[];
  accessRequests: AccessRequest[];
  plausibilityAlerts: PlausibilityAlert[];
  getAdminOrganisation: (id: string) => AdminOrganization | undefined;
  getAdminUser: (id: string) => AdminUser | undefined;
  getAuditEvent: (id: string) => AuditEvent | undefined;
  getException: (id: string) => ComplianceException | undefined;
  getAccessRequest: (id: string) => AccessRequest | undefined;
  getPlausibilityAlert: (id: string) => PlausibilityAlert | undefined;
  getAuditEventsByEntity: (entityId: string) => AuditEvent[];
  getAuditEventsByOrg: (orgId: string) => AuditEvent[];
  addAuditEvent: (data: {
    eventType: AuditEventType;
    actor?: Partial<AuditEvent["actor"]>;
    organisation?: Partial<AuditEvent["organisation"]>;
    entity: AuditEntityRef;
    action: string;
    source?: AuditEvent["source"];
    metadata?: Record<string, unknown>;
    status?: AuditEvent["status"];
  }) => AuditEvent;
  updateOrganisationStatus: (orgId: string, status: AdminOrgStatus, reason: string) => void;
  assignUserRole: (userId: string, newRole: string, reason: string) => void;
  updateUserStatus: (userId: string, status: "Active" | "Disabled", reason: string) => void;
  updateExceptionStatus: (
    exceptionId: string,
    status: ExceptionStatus,
    reason?: string,
    notes?: string,
    correctiveAction?: string
  ) => void;
  decideAccessRequest: (
    requestId: string,
    decision: "approved" | "denied",
    reason?: string,
    grantedScope?: string[]
  ) => void;
  updatePlausibilityStatus: (
    alertId: string,
    status: PlausibilityAlert["status"],
    notes?: string
  ) => void;
  resetToMockData: () => void;
}

const TraceabilityContext = React.createContext<TraceabilityContextValue | undefined>(undefined);

export function TraceabilityProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    memoryState = readStorage();
    storeListeners.forEach((listener) => listener());
  }, []);

  const state = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setHasMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const addApiary = React.useCallback(
    (data: {
      name: string;
      location: string;
      latitude: number;
      longitude: number;
      elevation: string;
      dominantFlora: string;
      hiveCount: number;
      status?: "active" | "inactive" | "quarantine";
      notes?: string;
    }): Apiary => {
      const newId = `apiary-${Date.now().toString(36)}`;
      const newApiary: Apiary = {
        id: newId,
        name: data.name,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        elevation: data.elevation || "1,500 m",
        dominantFlora: data.dominantFlora,
        hiveCount: Number(data.hiveCount) || 0,
        status: data.status || "active",
        lastInspectionDate: "Recently registered",
        notes: data.notes || "",
        registeredAt: new Date().toISOString(),
        registeredBy: "Chirag Operator (Highland Apiaries)",
      };

      const next = {
        ...memoryState,
        apiaries: [newApiary, ...memoryState.apiaries],
      };
      updateStore(next);
      return newApiary;
    },
    []
  );

  const addHive = React.useCallback(
    (data: {
      identifier: string;
      internalCode: string;
      apiaryId: string;
      hiveType: Hive["hiveType"];
      installationDate: string;
      queenStatus: Hive["queenStatus"];
      locationInApiary: string;
      nfcRfidId: string;
      status?: Hive["status"];
      notes?: string;
    }): Hive => {
      const parentApiary = memoryState.apiaries.find((a) => a.id === data.apiaryId);
      const apiaryName = parentApiary ? parentApiary.name : "Highland Apiary";
      const newId = `hive-${Date.now().toString(36)}`;

      const newHive: Hive = {
        id: newId,
        identifier: data.identifier,
        internalCode: data.internalCode,
        apiaryId: data.apiaryId,
        apiaryName,
        hiveType: data.hiveType,
        installationDate: data.installationDate || new Date().toISOString().split("T")[0],
        queenStatus: data.queenStatus,
        locationInApiary: data.locationInApiary,
        nfcRfidId: data.nfcRfidId,
        status: data.status || "healthy",
        lastInspectionDate: "Just registered",
        lastActivity: "Hive commissioned into apiary yard.",
        notes: data.notes || "",
      };

      const updatedApiaries = memoryState.apiaries.map((apiary) => {
        if (apiary.id === data.apiaryId) {
          return {
            ...apiary,
            hiveCount: apiary.hiveCount + 1,
            lastInspectionDate: "Recently updated",
          };
        }
        return apiary;
      });

      const next = {
        ...memoryState,
        apiaries: updatedApiaries,
        hives: [newHive, ...memoryState.hives],
      };
      updateStore(next);
      return newHive;
    },
    []
  );

  const addActivity = React.useCallback(
    (data: {
      type: ColonyActivity["type"];
      hiveId: string;
      weather: string;
      temperature: string;
      humidity: string;
      floralObservation: string;
      queenStatus: ColonyActivity["queenStatus"];
      notes: string;
      recordedBy?: string;
    }): ColonyActivity => {
      const targetHive = memoryState.hives.find((h) => h.id === data.hiveId);
      const targetApiary = targetHive
        ? memoryState.apiaries.find((a) => a.id === targetHive.apiaryId)
        : undefined;

      const newId = `act-${Date.now().toString(36)}`;
      const now = new Date();
      const formattedDate = `${now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`;

      const newActivity: ColonyActivity = {
        id: newId,
        type: data.type,
        hiveId: data.hiveId,
        hiveIdentifier: targetHive?.identifier || "HIVE-UNKNOWN",
        apiaryId: targetHive?.apiaryId || "apiary-01",
        apiaryName: targetApiary?.name || "Highland Apiary",
        timestamp: now.toISOString(),
        weather: data.weather,
        temperature: data.temperature,
        humidity: data.humidity,
        floralObservation: data.floralObservation,
        queenStatus: data.queenStatus,
        notes: data.notes,
        recordedBy: data.recordedBy || "Chirag Operator (Beekeeper)",
        syncStatus: "synced",
      };

      const updatedHives = memoryState.hives.map((h) => {
        if (h.id === data.hiveId) {
          return {
            ...h,
            queenStatus: data.queenStatus,
            lastInspectionDate: formattedDate,
            lastActivity: `${data.type}: ${data.notes.slice(0, 60)}${data.notes.length > 60 ? "..." : ""}`,
          };
        }
        return h;
      });

      const next = {
        ...memoryState,
        hives: updatedHives,
        activities: [newActivity, ...memoryState.activities],
      };
      updateStore(next);
      return newActivity;
    },
    []
  );

  const addBatch = React.useCallback(
    (data: {
      sourceApiaryId: string;
      sourceHiveIds: string[];
      harvestDate: string;
      honeyType: string;
      weightKg: number;
      containerRef: string;
      storageLocation: string;
      notes?: string;
      createdBy?: string;
    }): HarvestBatch => {
      const sourceApiary = memoryState.apiaries.find((a) => a.id === data.sourceApiaryId);
      const linkedHives = memoryState.hives.filter((h) => data.sourceHiveIds.includes(h.id));
      const sourceHiveIdentifiers = linkedHives.map((h) => h.identifier);

      const count = memoryState.batches.length + 1;
      const batchNumber = `HC-RH-2026-${count.toString().padStart(4, "0")}`;
      const now = new Date();
      const formattedTimestamp = now.toISOString().replace("T", " ").substring(0, 16);
      const weight = Number(data.weightKg) || 0;

      const newBatch: HarvestBatch = {
        id: batchNumber,
        batchNumber,
        batchType: "Raw Honey",
        sourceApiaryId: data.sourceApiaryId,
        sourceApiaryName: sourceApiary?.name || "Highland Apiary",
        sourceHiveIds: data.sourceHiveIds,
        sourceHiveIdentifiers,
        harvestDate: data.harvestDate,
        honeyType: data.honeyType,
        weightKg: weight,
        usedQuantityKg: 0,
        remainingWeightKg: weight,
        containerRef: data.containerRef,
        storageLocation: data.storageLocation,
        status: "Raw Batch Created",
        notes: data.notes || "",
        createdBy: data.createdBy || "Chirag Operator (Beekeeper)",
        createdAt: now.toISOString(),
        currentCustodyOrgId: "org-hac-01",
        currentCustodyOrgName: "Highland Apiaries Cooperative",
        traceabilityStatus: "Traceability chain started",
        timeline: [
          {
            title: "Hive(s) registered & linked",
            description: `${sourceHiveIdentifiers.join(", ")} verified at ${sourceApiary?.name || "Apiary"}.`,
            timestamp: "Apiary Origin",
            status: "completed",
            actor: sourceApiary?.registeredBy || "Beekeeper",
            badge: "Hive Origin",
          },
          {
            title: "Harvest recorded & weighed",
            description: `${weight} kg extracted and sealed in container ${data.containerRef}.`,
            timestamp: `${data.harvestDate} (Harvest Day)`,
            status: "completed",
            actor: data.createdBy || "Beekeeper",
            badge: "Field Harvest",
          },
          {
            title: "Raw batch created",
            description: `Batch ${batchNumber} registered. Provenance locked to source apiary.`,
            timestamp: formattedTimestamp,
            status: "current",
            actor: data.createdBy || "Beekeeper",
            badge: "Traceability Chain Started",
          },
          {
            title: "Custody transfer initiated",
            description: "Awaiting dispatch & custody handoff to processing facility.",
            timestamp: "Upcoming",
            status: "upcoming",
            badge: "Next Step",
          },
          {
            title: "Manufacturer received",
            description: "Awaiting receiving confirmation by manufacturer.",
            timestamp: "Upcoming",
            status: "upcoming",
            badge: "Receiving",
          },
        ],
      };

      const next = {
        ...memoryState,
        batches: [newBatch, ...memoryState.batches],
      };
      updateStore(next);
      return newBatch;
    },
    []
  );

  const addCustodyTransfer = React.useCallback(
    (data: CreateCustodyTransferInput): CustodyTransfer => {
      const targetBatch = memoryState.batches.find(
        (b) => b.id === data.batchId || b.batchNumber === data.batchId
      );
      if (!targetBatch) {
        throw new Error(`Batch "${data.batchId}" not found for custody transfer.`);
      }

      const destOrg = MOCK_ORGANISATIONS.find((o) => o.id === data.destinationOrgId);
      const transferCount = memoryState.custodyTransfers.length + 80;
      const transferId = `TR-2026-${transferCount.toString().padStart(4, "0")}`;
      const now = new Date();
      const formattedTimestamp = now.toISOString().replace("T", " ").substring(0, 16);

      const destOrgName = destOrg?.name || "Golden Hive Foods";
      const sourceOrgName = targetBatch.currentCustodyOrgName || "Highland Apiaries Cooperative";
      const sourceOrgId = targetBatch.currentCustodyOrgId || "org-hac-01";

      const newTransfer: CustodyTransfer = {
        id: transferId,
        batchId: targetBatch.batchNumber,
        batchNumber: targetBatch.batchNumber,
        sourceOrgId,
        sourceOrgName,
        sourceApiaryId: targetBatch.sourceApiaryId || "apiary-01",
        sourceApiaryName: targetBatch.sourceApiaryName || "Highland Apiary",
        honeyType: targetBatch.honeyType,
        harvestDate: targetBatch.harvestDate || "2026-09-13",
        destinationOrgId: data.destinationOrgId,
        destinationOrgName: destOrgName,
        destinationFacility: data.destinationFacility,
        quantityKg: Number(data.quantityKg),
        transferDate: data.transferDate,
        expectedArrivalDate: data.expectedArrivalDate,
        transportRef: data.transportRef,
        notes: data.notes || "",
        status: "Pending Acceptance",
        createdBy: data.createdBy || "Chirag Operator (Beekeeper)",
        createdAt: now.toISOString(),
        events: [
          {
            id: `evt-${Date.now().toString(36)}-1`,
            title: "Raw batch created",
            description: `Batch ${targetBatch.batchNumber} extracted and registered at ${targetBatch.sourceApiaryName} (${targetBatch.weightKg} kg).`,
            timestamp: targetBatch.createdAt.replace("T", " ").substring(0, 16),
            actor: targetBatch.createdBy,
            orgName: sourceOrgName,
            status: "completed",
            badge: "Apiary Layer",
          },
          {
            id: `evt-${Date.now().toString(36)}-2`,
            title: "Transfer initiated",
            description: `Transfer ${transferId} created for ${destOrgName}. Transport ref: ${data.transportRef}. Quantity: ${data.quantityKg} kg.`,
            timestamp: formattedTimestamp,
            actor: data.createdBy || "Chirag Operator (Beekeeper)",
            orgName: sourceOrgName,
            status: "completed",
            badge: "Dispatched",
          },
          {
            id: `evt-${Date.now().toString(36)}-3`,
            title: "Pending manufacturer acceptance",
            description: `Consignment in transit. Awaiting intake verification and physical seal check at ${data.destinationFacility}.`,
            timestamp: "Awaiting Receipt",
            actor: destOrgName,
            orgName: destOrgName,
            status: "current",
            badge: "In Transit",
          },
          {
            id: `evt-${Date.now().toString(36)}-4`,
            title: "Receiving confirmation",
            description: `Manufacturer weight check, temperature audit, and receiving decision at ${data.destinationFacility}.`,
            timestamp: "Upcoming",
            actor: destOrgName,
            orgName: destOrgName,
            status: "upcoming",
            badge: "Intake",
          },
        ],
      };

      // Update source batch status and timeline
      const updatedBatches = memoryState.batches.map((batch) => {
        if (batch.id === targetBatch.id || batch.batchNumber === targetBatch.batchNumber) {
          const updatedTimeline = batch.timeline.map((step) => {
            if (step.title.includes("Custody transfer") || step.title.includes("transfer")) {
              return {
                title: "Custody transfer initiated",
                description: `Dispatched ${data.quantityKg} kg to ${destOrgName} via ${data.transportRef} (Transfer ID: ${transferId}).`,
                timestamp: formattedTimestamp,
                status: "completed" as const,
                actor: data.createdBy || "Rajesh Rawat (Beekeeper)",
                badge: "Transfer Dispatched",
              };
            }
            if (step.title.includes("Manufacturer received") || step.title.includes("received") || step.title.includes("Awaiting manufacturer")) {
              return {
                title: "Awaiting manufacturer receipt",
                description: `Consignment en route to ${destOrgName}. Awaiting receiving confirmation at ${data.destinationFacility}.`,
                timestamp: "Awaiting intake",
                status: "current" as const,
                actor: destOrgName,
                badge: "Pending Acceptance",
              };
            }
            return step;
          });

          return {
            ...batch,
            status: "Pending Custody Transfer" as const,
            activeTransferId: transferId,
            timeline: updatedTimeline,
          };
        }
        return batch;
      });

      const next: TraceabilityState = {
        ...memoryState,
        batches: updatedBatches,
        custodyTransfers: [newTransfer, ...memoryState.custodyTransfers],
      };
      updateStore(next);
      return newTransfer;
    },
    []
  );

  const acceptReceiving = React.useCallback(
    (
      transferId: string,
      data: AcceptReceivingInput
    ): { transfer: CustodyTransfer; record: ReceivingRecord; batch?: HarvestBatch } => {
      const targetTransfer = memoryState.custodyTransfers.find((t) => t.id === transferId);
      if (!targetTransfer) {
        throw new Error(`Transfer "${transferId}" not found.`);
      }

      const recCount = memoryState.receivingRecords.length + 39;
      const recordId = `RCV-2026-${recCount.toString().padStart(4, "0")}`;
      const now = new Date();
      const formattedTimestamp = now.toISOString().replace("T", " ").substring(0, 16);
      const receiverName = data.receivedBy || "Vikram Mehta (Plant Manager)";

      const newRecord: ReceivingRecord = {
        id: recordId,
        transferId: targetTransfer.id,
        batchId: targetTransfer.batchId,
        sourceOrgId: targetTransfer.sourceOrgId,
        sourceOrgName: targetTransfer.sourceOrgName,
        receivingOrgId: targetTransfer.destinationOrgId,
        receivingOrgName: targetTransfer.destinationOrgName,
        facilityLocation: targetTransfer.destinationFacility,
        expectedQuantityKg: targetTransfer.quantityKg,
        receivedQuantityKg: Number(data.receivedQuantityKg),
        containerRef: data.containerRef,
        receivedDate: data.receivedDate,
        condition: data.condition,
        temperatureCelsius: data.temperatureCelsius,
        packagingCondition: data.packagingCondition,
        notes: data.notes || "",
        decision: "Accepted",
        receivedBy: receiverName,
        createdAt: now.toISOString(),
      };

      const updatedTransferEvents = targetTransfer.events.map((evt) => {
        if (evt.title.includes("Pending manufacturer acceptance")) {
          return {
            ...evt,
            status: "completed" as const,
            timestamp: formattedTimestamp,
            description: `Intake inspection completed at ${targetTransfer.destinationFacility}. Condition: ${data.condition}.`,
          };
        }
        if (evt.title.includes("Receiving confirmation") || evt.title.includes("Upcoming")) {
          return {
            ...evt,
            title: "Receiving confirmed & accepted",
            description: `${data.receivedQuantityKg} kg verified into ${targetTransfer.destinationOrgName} inventory. Receiving record ${recordId} issued.`,
            timestamp: formattedTimestamp,
            actor: receiverName,
            status: "completed" as const,
            badge: "Accepted",
          };
        }
        return evt;
      });

      const updatedTransfer: CustodyTransfer = {
        ...targetTransfer,
        status: "Accepted",
        receivingRecordId: recordId,
        updatedAt: now.toISOString(),
        events: updatedTransferEvents,
      };

      const updatedTransfers = memoryState.custodyTransfers.map((t) =>
        t.id === transferId ? updatedTransfer : t
      );

      let updatedBatchTarget: HarvestBatch | undefined;
      const updatedBatches = memoryState.batches.map((batch) => {
        if (batch.id === targetTransfer.batchId || batch.batchNumber === targetTransfer.batchId) {
          const updatedTimeline = batch.timeline.map((step) => {
            if (
              step.title.includes("Awaiting manufacturer") ||
              step.title.includes("Manufacturer received") ||
              step.title.includes("received")
            ) {
              return {
                title: `Received by ${targetTransfer.destinationOrgName}`,
                description: `${data.receivedQuantityKg} kg accepted and logged into processing facility (${targetTransfer.destinationFacility}). Condition: ${data.condition}. Ready for processing.`,
                timestamp: formattedTimestamp,
                status: "completed" as const,
                actor: `${receiverName} (${targetTransfer.destinationOrgName})`,
                badge: "Received by Manufacturer",
              };
            }
            return step;
          });

          const currentRem = batch.remainingWeightKg !== undefined ? batch.remainingWeightKg : Number(data.receivedQuantityKg);

          const res: HarvestBatch = {
            ...batch,
            status: "Received",
            currentCustodyOrgId: targetTransfer.destinationOrgId,
            currentCustodyOrgName: targetTransfer.destinationOrgName,
            receivingRecordId: recordId,
            remainingWeightKg: currentRem,
            storageLocation: targetTransfer.destinationFacility,
            timeline: updatedTimeline,
            traceabilityStatus: "Traceability chain updated with manufacturer intake — Ready for processing",
          };
          updatedBatchTarget = res;
          return res;
        }
        return batch;
      });

      const next: TraceabilityState = {
        ...memoryState,
        batches: updatedBatches,
        custodyTransfers: updatedTransfers,
        receivingRecords: [newRecord, ...memoryState.receivingRecords],
      };
      updateStore(next);

      return {
        transfer: updatedTransfer,
        record: newRecord,
        batch: updatedBatchTarget,
      };
    },
    []
  );

  const rejectReceiving = React.useCallback(
    (
      transferId: string,
      data: RejectReceivingInput
    ): { transfer: CustodyTransfer; record: ReceivingRecord; batch?: HarvestBatch } => {
      const targetTransfer = memoryState.custodyTransfers.find((t) => t.id === transferId);
      if (!targetTransfer) {
        throw new Error(`Transfer "${transferId}" not found.`);
      }

      const recCount = memoryState.receivingRecords.length + 39;
      const recordId = `RCV-2026-${recCount.toString().padStart(4, "0")}`;
      const now = new Date();
      const formattedTimestamp = now.toISOString().replace("T", " ").substring(0, 16);
      const rejectorName = data.rejectedBy || "Vikram Mehta (Plant Manager)";

      const newRecord: ReceivingRecord = {
        id: recordId,
        transferId: targetTransfer.id,
        batchId: targetTransfer.batchId,
        sourceOrgId: targetTransfer.sourceOrgId,
        sourceOrgName: targetTransfer.sourceOrgName,
        receivingOrgId: targetTransfer.destinationOrgId,
        receivingOrgName: targetTransfer.destinationOrgName,
        facilityLocation: targetTransfer.destinationFacility,
        expectedQuantityKg: targetTransfer.quantityKg,
        receivedQuantityKg: 0,
        containerRef: targetTransfer.transportRef,
        receivedDate: data.receivedDate,
        condition: "Contaminated / Suspect",
        packagingCondition: "Rejected at intake",
        notes: `Rejected: ${data.rejectionReason}. ${data.rejectionNotes}`,
        decision: "Rejected",
        rejectionReason: data.rejectionReason,
        rejectionNotes: data.rejectionNotes,
        receivedBy: rejectorName,
        createdAt: now.toISOString(),
      };

      const updatedTransferEvents = targetTransfer.events.map((evt) => {
        if (evt.title.includes("Receiving confirmation") || evt.title.includes("Upcoming") || evt.title.includes("Pending")) {
          return {
            ...evt,
            title: "Receipt rejected — investigation required",
            description: `Intake rejected by ${targetTransfer.destinationOrgName}: Reason: ${data.rejectionReason}. Details: ${data.rejectionNotes}`,
            timestamp: formattedTimestamp,
            actor: rejectorName,
            status: "alert" as const,
            badge: "Rejected",
          };
        }
        return evt;
      });

      const updatedTransfer: CustodyTransfer = {
        ...targetTransfer,
        status: "Rejected",
        receivingRecordId: recordId,
        updatedAt: now.toISOString(),
        events: updatedTransferEvents,
      };

      const updatedTransfers = memoryState.custodyTransfers.map((t) =>
        t.id === transferId ? updatedTransfer : t
      );

      let updatedBatchTarget: HarvestBatch | undefined;
      const updatedBatches = memoryState.batches.map((batch) => {
        if (batch.id === targetTransfer.batchId || batch.batchNumber === targetTransfer.batchId) {
          const updatedTimeline = batch.timeline.map((step) => {
            if (
              step.title.includes("Awaiting manufacturer") ||
              step.title.includes("Manufacturer received") ||
              step.title.includes("received")
            ) {
              return {
                title: "Receipt rejected — investigation required",
                description: `Shipment rejected at ${targetTransfer.destinationFacility}. Reason: ${data.rejectionReason}. Notes: ${data.rejectionNotes}`,
                timestamp: formattedTimestamp,
                status: "current" as const,
                actor: `${rejectorName} (${targetTransfer.destinationOrgName})`,
                badge: "Intake Flagged",
              };
            }
            return step;
          });

          const res: HarvestBatch = {
            ...batch,
            status: "Rejected",
            timeline: updatedTimeline,
            traceabilityStatus: "Shipment rejected at receiving — investigation required",
          };
          updatedBatchTarget = res;
          return res;
        }
        return batch;
      });

      const next: TraceabilityState = {
        ...memoryState,
        batches: updatedBatches,
        custodyTransfers: updatedTransfers,
        receivingRecords: [newRecord, ...memoryState.receivingRecords],
      };
      updateStore(next);

      return {
        transfer: updatedTransfer,
        record: newRecord,
        batch: updatedBatchTarget,
      };
    },
    []
  );

  const addProcessingJob = React.useCallback(
    (data: CreateProcessingJobInput): { job: ProcessingJob; outputBatch: HarvestBatch } => {
      const now = new Date();
      const formattedTimestamp = now.toISOString().replace("T", " ").substring(0, 16);
      const jobCount = memoryState.processingJobs.length + 1;
      const jobId = `PRC-2026-${jobCount.toString().padStart(4, "0")}`;

      const processedBatchCount = memoryState.batches.filter(
        (b) => b.batchType === "Processed Honey" || b.batchNumber.startsWith("HC-PB")
      ).length + 1;
      const outputBatchId = `HC-PB-2026-${processedBatchCount.toString().padStart(4, "0")}`;

      // Validate inputs
      const inputBatchRefs: ProcessingInputBatchRef[] = [];
      let totalInputWeight = 0;

      for (const item of data.inputs) {
        const found = memoryState.batches.find(
          (b) => b.id === item.batchId || b.batchNumber === item.batchId
        );
        if (!found) {
          throw new Error(`Input batch "${item.batchId}" not found.`);
        }
        const avail = found.remainingWeightKg !== undefined ? found.remainingWeightKg : found.weightKg;
        if (item.usedQuantityKg > avail + 0.001) {
          throw new Error(
            `Selected quantity (${item.usedQuantityKg} kg) exceeds available quantity (${avail} kg) for batch ${found.batchNumber}.`
          );
        }
        totalInputWeight += item.usedQuantityKg;
        inputBatchRefs.push({
          batchId: found.batchNumber,
          batchNumber: found.batchNumber,
          sourceOrgId: found.currentCustodyOrgId || found.sourceApiaryId,
          sourceOrgName: found.currentCustodyOrgName || found.sourceApiaryName || "Supplier",
          honeyType: found.honeyType,
          availableQuantityKg: avail,
          usedQuantityKg: Number(item.usedQuantityKg),
          containerRef: found.containerRef,
        });
      }

      if (data.outputQuantityKg > totalInputWeight) {
        throw new Error(
          `Output quantity (${data.outputQuantityKg} kg) cannot be greater than total input quantity (${totalInputWeight} kg).`
        );
      }

      const yieldPercentage =
        totalInputWeight > 0
          ? Number(((data.outputQuantityKg / totalInputWeight) * 100).toFixed(2))
          : 0;

      const operator = data.operator || "Vikram Mehta (Plant Lead)";
      const facility = data.facility || "Golden Hive Processing Plant Unit 4, Solan Industrial Area";
      const orgId = data.orgId || "org-ghf-02";
      const orgName = data.orgName || "Golden Hive Foods";

      // 1. Update source batches (deduct remaining quantity, append processing step, keep intact!)
      const updatedBatches = memoryState.batches.map((batch) => {
        const matchingInput = data.inputs.find(
          (i) => i.batchId === batch.id || i.batchId === batch.batchNumber
        );
        if (matchingInput) {
          const prevUsed = batch.usedQuantityKg || 0;
          const newUsed = prevUsed + matchingInput.usedQuantityKg;
          const initialWeight = batch.weightKg;
          const newRemaining = Math.max(0, Number((initialWeight - newUsed).toFixed(2)));

          const prevDownstream = batch.downstreamProcessingJobs || [];
          const newDownstream = prevDownstream.includes(jobId)
            ? prevDownstream
            : [...prevDownstream, jobId];

          // Add timeline event to original batch
          const processingTimelineStep = {
            title: "Used as processing input",
            description: `${matchingInput.usedQuantityKg.toFixed(1)} kg used in Processing Job ${jobId} (${data.processType}) on ${data.line}. Produced ${outputBatchId}. Remaining raw volume: ${newRemaining.toFixed(1)} kg.`,
            timestamp: formattedTimestamp,
            status: "completed" as const,
            actor: `${operator} (${orgName})`,
            badge: "Processing Input",
          };

          return {
            ...batch,
            usedQuantityKg: newUsed,
            remainingWeightKg: newRemaining,
            status: "Consumed partially for processing" as const,
            downstreamProcessingJobs: newDownstream,
            timeline: [...batch.timeline, processingTimelineStep],
            traceabilityStatus: `Used in processing job ${jobId} (${outputBatchId})`,
          };
        }
        return batch;
      });

      // 2. Create the new distinct output processed batch
      const primaryInput = inputBatchRefs[0];
      const sourceBatchIdsString = inputBatchRefs.map((b) => `${b.batchNumber} (${b.usedQuantityKg} kg)`).join(", ");

      const outputBatch: HarvestBatch = {
        id: outputBatchId,
        batchNumber: outputBatchId,
        batchType: "Processed Honey",
        sourceApiaryId: primaryInput?.batchId || "apiary-01",
        sourceApiaryName: `Derived from: ${inputBatchRefs.map((b) => b.batchNumber).join(", ")}`,
        sourceHiveIds: [],
        sourceHiveIdentifiers: [],
        harvestDate: primaryInput ? "Harvest Provenance Preserved" : "2026-09-13",
        processingDate: data.startDate.split(" ")[0] || now.toISOString().split("T")[0],
        honeyType: data.outputHoneyType,
        weightKg: Number(data.outputQuantityKg),
        usedQuantityKg: 0,
        remainingWeightKg: Number(data.outputQuantityKg),
        containerRef: data.outputContainerRef,
        storageLocation: data.outputStorageLocation,
        status: "Processed Batch Created",
        notes: data.outputNotes || data.processNotes || "Processed batch retaining full verifiable provenance links to source raw honey batches.",
        createdBy: operator,
        createdAt: now.toISOString(),
        currentCustodyOrgId: orgId,
        currentCustodyOrgName: orgName,
        processingJobId: jobId,
        derivedFromBatches: inputBatchRefs.map((b) => ({
          batchId: b.batchId,
          batchNumber: b.batchNumber,
          usedQuantityKg: b.usedQuantityKg,
          sourceOrgName: b.sourceOrgName,
          honeyType: b.honeyType,
        })),
        traceabilityStatus: `Processed Honey Batch derived from ${sourceBatchIdsString}`,
        timeline: [
          {
            title: "Source raw batch material",
            description: `Derived from input batch(es): ${sourceBatchIdsString} with intact apiary origins.`,
            timestamp: "Source Lineage",
            status: "completed",
            actor: primaryInput?.sourceOrgName || "Highland Apiaries Cooperative",
            badge: "Origin Lineage",
          },
          {
            title: "Manufacturer intake & storage",
            description: `Input raw honey received and staged at ${facility}.`,
            timestamp: "Intake Verified",
            status: "completed",
            actor: orgName,
            badge: "Manufacturer Custody",
          },
          {
            title: "Processing & Blending run executed",
            description: `Job ${jobId} completed on ${data.line} (${data.processType}). ${totalInputWeight.toFixed(1)} kg input converted to ${data.outputQuantityKg.toFixed(1)} kg output (Yield: ${yieldPercentage}%).`,
            timestamp: formattedTimestamp,
            status: "completed",
            actor: `${operator} (${orgName})`,
            badge: "Processing Event",
          },
          {
            title: "Processed batch created & registered",
            description: `Batch ${outputBatchId} registered in container ${data.outputContainerRef} at ${data.outputStorageLocation}. Ready for testing and bottling.`,
            timestamp: formattedTimestamp,
            status: "current",
            actor: `${operator} (${orgName})`,
            badge: "Processed Batch Created",
          },
        ],
      };

      // 3. Create the Processing Job record
      const newJob: ProcessingJob = {
        id: jobId,
        processReferenceNumber: data.processReferenceNumber || `JOB-${jobId}`,
        processType: data.processType,
        status: "Completed",
        facility,
        line: data.line,
        operator,
        startDate: data.startDate,
        endDate: data.endDate || formattedTimestamp,
        processNotes: data.processNotes || "",
        inputBatches: inputBatchRefs,
        totalInputQuantityKg: totalInputWeight,
        outputBatchId,
        outputHoneyType: data.outputHoneyType,
        outputQuantityKg: Number(data.outputQuantityKg),
        yieldPercentage,
        outputStorageLocation: data.outputStorageLocation,
        outputContainerRef: data.outputContainerRef,
        outputNotes: data.outputNotes || "",
        orgId,
        orgName,
        createdBy: operator,
        createdAt: now.toISOString(),
      };

      const next: TraceabilityState = {
        ...memoryState,
        batches: [outputBatch, ...updatedBatches],
        processingJobs: [newJob, ...memoryState.processingJobs],
      };
      updateStore(next);

      return { job: newJob, outputBatch };
    },
    []
  );

  const getApiary = React.useCallback(
    (id: string) => memoryState.apiaries.find((a) => a.id === id),
    []
  );

  const getHive = React.useCallback(
    (id: string) => memoryState.hives.find((h) => h.id === id),
    []
  );

  const getHivesByApiary = React.useCallback(
    (apiaryId: string) => memoryState.hives.filter((h) => h.apiaryId === apiaryId),
    []
  );

  const getActivitiesByHive = React.useCallback(
    (hiveId: string) =>
      memoryState.activities
        .filter((a) => a.hiveId === hiveId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    []
  );

  const getBatch = React.useCallback(
    (id: string) => memoryState.batches.find((b) => b.id === id || b.batchNumber === id),
    []
  );

  const getCustodyTransfer = React.useCallback(
    (id: string) => memoryState.custodyTransfers.find((t) => t.id === id),
    []
  );

  const getCustodyTransfersByBatch = React.useCallback(
    (batchId: string) =>
      memoryState.custodyTransfers.filter(
        (t) => t.batchId === batchId || t.batchNumber === batchId
      ),
    []
  );

  const getIncomingTransfersByOrg = React.useCallback(
    (orgId: string) => memoryState.custodyTransfers.filter((t) => t.destinationOrgId === orgId),
    []
  );

  const getOutgoingTransfersByOrg = React.useCallback(
    (orgId: string) => memoryState.custodyTransfers.filter((t) => t.sourceOrgId === orgId),
    []
  );

  const getReceivingRecord = React.useCallback(
    (id: string) => memoryState.receivingRecords.find((r) => r.id === id),
    []
  );

  const getReceivingRecordByTransfer = React.useCallback(
    (transferId: string) =>
      memoryState.receivingRecords.find((r) => r.transferId === transferId),
    []
  );

  const getReceivingRecordByBatch = React.useCallback(
    (batchId: string) => memoryState.receivingRecords.find((r) => r.batchId === batchId),
    []
  );

  const getProcessingJob = React.useCallback(
    (id: string) => memoryState.processingJobs.find((j) => j.id === id),
    []
  );

  const getProcessingJobsByInputBatch = React.useCallback(
    (batchId: string) =>
      memoryState.processingJobs.filter((j) =>
        j.inputBatches.some((b) => b.batchId === batchId || b.batchNumber === batchId)
      ),
    []
  );

  const getProcessingJobByOutputBatch = React.useCallback(
    (batchId: string) =>
      memoryState.processingJobs.find(
        (j) => j.outputBatchId === batchId || j.outputBatchId.toLowerCase() === batchId.toLowerCase()
      ),
    []
  );

  const getEligibleProcessingBatches = React.useCallback(
    (orgId?: string) => {
      return memoryState.batches.filter((b) => {
        // Raw honey or received batches that belong to manufacturer or have been received
        const isRawOrEligible = b.batchType !== "Processed Honey";
        const hasRemainingWeight = (b.remainingWeightKg !== undefined ? b.remainingWeightKg : b.weightKg) > 0.05;
        const isReceived =
          b.status === "Received" ||
          b.status === "Consumed partially for processing" ||
          (orgId && b.currentCustodyOrgId === orgId) ||
          b.currentCustodyOrgId === "org-ghf-02" ||
          !!b.receivingRecordId;

        return isRawOrEligible && hasRemainingWeight && isReceived;
      });
    },
    []
  );

  const getEligibleLabTestingBatches = React.useCallback(() => {
    return memoryState.batches.filter((b) => {
      const isProcessed = b.batchType === "Processed Honey" || b.batchNumber.startsWith("HC-PB");
      const isReadyStatus =
        b.status === "Processed Batch Created" ||
        b.status === "Received" ||
        b.isEligibleForLabTesting;
      const notYetCertified = b.status !== "Quality Approved";
      return isProcessed && isReadyStatus && notYetCertified;
    });
  }, []);

  const getLabTest = React.useCallback(
    (id: string) => memoryState.labTests.find((t) => t.id === id),
    []
  );

  const getLabTestsByBatch = React.useCallback(
    (batchIdOrNumber: string) =>
      memoryState.labTests.filter(
        (t) => t.batchId === batchIdOrNumber || t.batchNumber === batchIdOrNumber
      ),
    []
  );

  const getCertification = React.useCallback(
    (id: string) => memoryState.certifications.find((c) => c.id === id),
    []
  );

  const getCertificationByBatch = React.useCallback(
    (batchIdOrNumber: string) =>
      memoryState.certifications.find(
        (c) => c.batchId === batchIdOrNumber || c.batchNumber === batchIdOrNumber
      ),
    []
  );

  const submitLabSample = React.useCallback((input: SubmitLabSampleInput): LabTest => {
    const batch = memoryState.batches.find(
      (b) => b.id === input.batchId || b.batchNumber === input.batchId
    );
    if (!batch) {
      throw new Error(`Batch ${input.batchId} not found.`);
    }

    const testCount = memoryState.labTests.length + 1;
    const testId = `TEST-2026-${String(testCount).padStart(4, "0")}`;
    const sampleId = input.sampleId || `SAMPLE-LAB-2026-${String(testCount).padStart(4, "0")}`;
    const now = new Date();
    const formattedTimestamp = `${now.toISOString().split("T")[0]} ${now.toTimeString().split(" ")[0].slice(0, 5)}`;

    const lab = input.laboratoryId
      ? MOCK_LABORATORIES.find((l) => l.id === input.laboratoryId) || MOCK_LABORATORIES[0]
      : MOCK_LABORATORIES[0];

    const analyst = input.analystId
      ? MOCK_LAB_ANALYSTS.find((a) => a.id === input.analystId) || MOCK_LAB_ANALYSTS[0]
      : MOCK_LAB_ANALYSTS[0];

    const initialResults: QualityParameterResult[] = DEFAULT_QUALITY_PARAMETERS.map((p) => ({
      ...p,
      status: "pending" as const,
      notes: "Awaiting analytical determination.",
    }));

    const newSample = {
      id: sampleId,
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      quantity: input.sampleQuantity,
      containerRef: input.sampleContainerRef,
      collectionDateTime: input.collectionDateTime,
      collectedBy: input.collectedBy,
      samplingNotes: input.samplingNotes,
    };

    const newTest: LabTest = {
      id: testId,
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      sample: newSample,
      testPanel: input.testPanel,
      priority: input.priority,
      status: "Awaiting Analysis",
      laboratory: lab,
      analyst,
      submittedBy: input.collectedBy,
      submittedDate: formattedTimestamp,
      expectedCompletionDate: input.expectedCompletionDate || "2026-09-16",
      results: initialResults,
      decisionsHistory: [],
      notes: input.samplingNotes || "",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    const updatedBatch: HarvestBatch = {
      ...batch,
      status: "Lab Testing",
      labTestId: testId,
      isEligibleForLabTesting: false,
      traceabilityStatus: `Sample ${sampleId} submitted to ${lab.name} for ${input.testPanel}`,
      timeline: [
        ...batch.timeline,
        {
          title: "Laboratory sample submitted",
          description: `${input.sampleQuantity} sample (${sampleId}) sealed in ${input.sampleContainerRef} and submitted to ${lab.name} for ${input.testPanel}.`,
          timestamp: formattedTimestamp,
          status: "completed",
          actor: input.collectedBy,
          badge: "Lab Sample Submitted",
        },
        {
          title: "Laboratory analysis",
          description: `Analysis pending at ${lab.name}.`,
          timestamp: "In Queue",
          status: "current",
          badge: "Awaiting Analysis",
        },
      ],
    };

    const updatedBatches = memoryState.batches.map((b) => (b.id === batch.id ? updatedBatch : b));

    const next: TraceabilityState = {
      ...memoryState,
      batches: updatedBatches,
      labTests: [newTest, ...memoryState.labTests],
    };

    updateStore(next);
    return newTest;
  }, []);

  const updateLabTestResults = React.useCallback(
    (testId: string, results: QualityParameterResult[]): LabTest => {
      const test = memoryState.labTests.find((t) => t.id === testId);
      if (!test) throw new Error(`Test ${testId} not found`);

      const now = new Date();
      const updatedTest: LabTest = {
        ...test,
        results,
        status: test.status === "Awaiting Analysis" ? "In Analysis" : test.status,
        updatedAt: now.toISOString(),
      };

      const updatedTests = memoryState.labTests.map((t) => (t.id === testId ? updatedTest : t));
      updateStore({ ...memoryState, labTests: updatedTests });
      return updatedTest;
    },
    []
  );

  const approveLabTest = React.useCallback(
    (testId: string, input: ApproveLabTestInput): HoneyCertificate => {
      const test = memoryState.labTests.find((t) => t.id === testId);
      if (!test) throw new Error(`Test ${testId} not found`);
      const batch = memoryState.batches.find((b) => b.id === test.batchId || b.batchNumber === test.batchNumber);
      if (!batch) throw new Error(`Batch ${test.batchId} not found`);

      const now = new Date();
      const formattedTimestamp = input.approvalDate || `${now.toISOString().split("T")[0]} ${now.toTimeString().split(" ")[0].slice(0, 5)}`;
      const certId = input.certificateNumber || `CERT-HC-2026-${String(memoryState.certifications.length + 1).padStart(4, "0")}`;

      const decisionEvent: QualityDecisionEvent = {
        id: `dec-${Date.now()}`,
        decisionType: "Approved",
        timestamp: formattedTimestamp,
        analyst: input.analyst,
        notes: input.notes || "All quality parameters within specifications. Approved for commercial certification.",
        certificateId: certId,
        targetTestStatus: "Approved",
      };

      // Set all results to pass if pending
      const approvedResults = test.results.map((r) =>
        r.status === "pending" ? { ...r, status: "pass" as const } : r
      );

      const updatedTest: LabTest = {
        ...test,
        status: "Approved",
        completedDate: formattedTimestamp,
        certificateId: certId,
        results: approvedResults,
        decisionsHistory: [...test.decisionsHistory, decisionEvent],
        updatedAt: now.toISOString(),
      };

      // Build Source Lineage
      const sourceRef = batch.derivedFromBatches && batch.derivedFromBatches.length > 0 ? batch.derivedFromBatches[0] : undefined;
      const rawBatch = sourceRef ? memoryState.batches.find((b) => b.id === sourceRef.batchId || b.batchNumber === sourceRef.batchNumber) : undefined;
      const transfer = rawBatch ? memoryState.custodyTransfers.find((t) => t.batchId === rawBatch.batchNumber || t.batchNumber === rawBatch.batchNumber) : undefined;
      const parentJob = batch.processingJobId ? memoryState.processingJobs.find((j) => j.id === batch.processingJobId) : undefined;
      const apiary = batch.sourceApiaryId ? memoryState.apiaries.find((a) => a.id === batch.sourceApiaryId) : undefined;

      const sourceLineage: SourceLineageTrace = {
        apiaryId: apiary?.id || rawBatch?.sourceApiaryId || "apiary-01",
        apiaryName: apiary?.name || rawBatch?.sourceApiaryName || "Highland North Apiary",
        apiaryLocation: apiary?.location || "Chamoli, Uttarakhand (30.3956° N, 79.3308° E)",
        hiveIds: batch.sourceHiveIds || rawBatch?.sourceHiveIds || ["hive-hn-01", "hive-hn-02"],
        hiveIdentifiers: batch.sourceHiveIdentifiers || rawBatch?.sourceHiveIdentifiers || ["HIVE-HN-01", "HIVE-HN-02"],
        rawBatchId: rawBatch?.id || "HC-RH-2026-0001",
        rawBatchNumber: rawBatch?.batchNumber || "HC-RH-2026-0001",
        harvestDate: rawBatch?.harvestDate || "2026-09-11",
        transferId: transfer?.id || rawBatch?.activeTransferId || "TR-2026-0079",
        receivingRecordId: rawBatch?.receivingRecordId || "RCV-2026-0038",
        processingJobId: batch.processingJobId || parentJob?.id || "PRC-2026-0001",
        processingFacility: parentJob?.facility || "Golden Hive Processing Plant Unit 4, Solan Industrial Area",
        processedBatchId: batch.id,
        processedBatchNumber: batch.batchNumber,
        processingDate: batch.processingDate || batch.harvestDate || "2026-09-14",
        honeyType: batch.honeyType,
        outputWeightKg: batch.weightKg,
        labTestId: test.id,
        certificateId: certId,
      };

      const newCert: HoneyCertificate = {
        id: certId,
        batchId: batch.id,
        batchNumber: batch.batchNumber,
        testId: test.id,
        issuedBy: test.laboratory.name,
        accreditationNumber: test.laboratory.accreditation,
        issuedDate: formattedTimestamp.split(" ")[0],
        validStatus: "Active",
        certificationType: "Pure Floral Authenticity & Safety Standard Grade A",
        honeyType: batch.honeyType,
        certifiedWeightKg: batch.weightKg,
        analystName: input.analyst,
        sealNumber: `SEAL-PTL-${Math.floor(1000 + Math.random() * 9000)}-GOLD`,
        summaryVerdict: `All physical, chemical, enzymatic, and isotopic purity parameters verified compliant with Honey Chain standard. Certified authentic ${batch.honeyType}.`,
        approvedParameters: approvedResults,
        sourceLineage,
        createdAt: now.toISOString(),
      };

      const updatedBatchTimeline = [
        ...batch.timeline.filter((t) => t.badge !== "Awaiting Analysis" && t.title !== "Quality decision & certification"),
        {
          title: "Laboratory analysis completed",
          description: `Multi-parameter testing verified compliant by ${input.analyst}.`,
          timestamp: formattedTimestamp,
          status: "completed" as const,
          actor: input.analyst,
          badge: "Lab Analysis",
        },
        {
          title: "Quality decision & certificate issued",
          description: `Quality Approved by ${input.analyst}. Certificate ${certId} issued. Batch is now eligible for bottle creation.`,
          timestamp: formattedTimestamp,
          status: "completed" as const,
          actor: input.analyst,
          badge: "Quality Certified",
        },
      ];

      const updatedBatch: HarvestBatch = {
        ...batch,
        status: "Quality Approved",
        certificateId: certId,
        labTestId: test.id,
        isEligibleForBottling: true,
        isEligibleForLabTesting: false,
        traceabilityStatus: "Quality approved & certified — Eligible for bottle creation",
        timeline: updatedBatchTimeline,
      };

      const updatedBatches = memoryState.batches.map((b) => (b.id === batch.id ? updatedBatch : b));
      const updatedTests = memoryState.labTests.map((t) => (t.id === testId ? updatedTest : t));

      const next: TraceabilityState = {
        ...memoryState,
        batches: updatedBatches,
        labTests: updatedTests,
        certifications: [newCert, ...memoryState.certifications],
      };

      updateStore(next);
      return newCert;
    },
    []
  );

  const rejectLabTest = React.useCallback(
    (testId: string, input: RejectLabTestInput): LabTest => {
      const test = memoryState.labTests.find((t) => t.id === testId);
      if (!test) throw new Error(`Test ${testId} not found`);
      const batch = memoryState.batches.find((b) => b.id === test.batchId || b.batchNumber === test.batchNumber);

      const now = new Date();
      const formattedTimestamp = input.rejectionDate || `${now.toISOString().split("T")[0]} ${now.toTimeString().split(" ")[0].slice(0, 5)}`;

      const decisionEvent: QualityDecisionEvent = {
        id: `dec-${Date.now()}`,
        decisionType: "Rejected",
        timestamp: formattedTimestamp,
        analyst: input.analyst,
        reason: input.reason,
        notes: input.notes,
        targetTestStatus: "Rejected",
      };

      const updatedTest: LabTest = {
        ...test,
        status: "Rejected",
        completedDate: formattedTimestamp,
        decisionsHistory: [...test.decisionsHistory, decisionEvent],
        updatedAt: now.toISOString(),
      };

      let updatedBatches = memoryState.batches;
      if (batch) {
        const updatedBatch: HarvestBatch = {
          ...batch,
          status: "Rejected",
          traceabilityStatus: "Quality rejected — Investigation required",
          timeline: [
            ...batch.timeline.filter((t) => t.badge !== "Awaiting Analysis"),
            {
              title: "Quality decision: Rejected",
              description: `Quality rejected by ${input.analyst}. Reason: ${input.reason}. Notes: ${input.notes}. Investigation required.`,
              timestamp: formattedTimestamp,
              status: "completed" as const,
              actor: input.analyst,
              badge: "Quality Rejected",
            },
          ],
        };
        updatedBatches = memoryState.batches.map((b) => (b.id === batch.id ? updatedBatch : b));
      }

      const updatedTests = memoryState.labTests.map((t) => (t.id === testId ? updatedTest : t));

      const next: TraceabilityState = {
        ...memoryState,
        batches: updatedBatches,
        labTests: updatedTests,
      };

      updateStore(next);
      return updatedTest;
    },
    []
  );

  const requestCorrectionLabTest = React.useCallback(
    (testId: string, input: RequestCorrectionLabTestInput): LabTest => {
      const test = memoryState.labTests.find((t) => t.id === testId);
      if (!test) throw new Error(`Test ${testId} not found`);
      const batch = memoryState.batches.find((b) => b.id === test.batchId || b.batchNumber === test.batchNumber);

      const now = new Date();
      const formattedTimestamp = input.requestDate || `${now.toISOString().split("T")[0]} ${now.toTimeString().split(" ")[0].slice(0, 5)}`;

      const decisionEvent: QualityDecisionEvent = {
        id: `dec-${Date.now()}`,
        decisionType: "Correction Requested",
        timestamp: formattedTimestamp,
        analyst: input.analyst,
        reason: input.reason,
        notes: input.notes,
        targetTestStatus: "Correction Required",
      };

      const updatedTest: LabTest = {
        ...test,
        status: "Correction Required",
        decisionsHistory: [...test.decisionsHistory, decisionEvent],
        updatedAt: now.toISOString(),
      };

      let updatedBatches = memoryState.batches;
      if (batch) {
        const updatedBatch: HarvestBatch = {
          ...batch,
          status: "Correction Requested",
          traceabilityStatus: "Correction requested — Re-evaluation pending",
          timeline: [
            ...batch.timeline,
            {
              title: "Correction requested",
              description: `Correction requested by ${input.analyst}. Reason: ${input.reason}. Notes: ${input.notes}.`,
              timestamp: formattedTimestamp,
              status: "current" as const,
              actor: input.analyst,
              badge: "Correction Requested",
            },
          ],
        };
        updatedBatches = memoryState.batches.map((b) => (b.id === batch.id ? updatedBatch : b));
      }

      const updatedTests = memoryState.labTests.map((t) => (t.id === testId ? updatedTest : t));

      const next: TraceabilityState = {
        ...memoryState,
        batches: updatedBatches,
        labTests: updatedTests,
      };

      updateStore(next);
      return updatedTest;
    },
    []
  );

  const createPackagingRun = React.useCallback(
    (input: CreateBottlesInput) => {
      const batch = memoryState.batches.find(
        (b) => b.id === input.sourceBatchId || b.batchNumber === input.sourceBatchId
      );
      if (!batch) throw new Error(`Batch ${input.sourceBatchId} not found`);

      const unitWeight = BOTTLE_SIZE_WEIGHTS[input.bottleSize] || 0.5;
      const totalPackagedWeightKg = Number((input.numberOfBottles * unitWeight).toFixed(2));
      const availableWeight = batch.remainingWeightKg !== undefined ? batch.remainingWeightKg : batch.weightKg;

      if (totalPackagedWeightKg > availableWeight + 0.001) {
        throw new Error(
          `Packaged quantity (${totalPackagedWeightKg} kg) exceeds available batch weight (${availableWeight} kg)`
        );
      }

      const cert = memoryState.certifications.find(
        (c) => c.batchId === batch.id || c.batchNumber === batch.batchNumber || c.id === batch.certificateId
      );
      const certId = cert?.id || batch.certificateId || "CERT-HC-2026-0001";
      const certLineage: SourceLineageTrace = cert?.sourceLineage || {
        apiaryId: batch.sourceApiaryId,
        apiaryName: batch.sourceApiaryName,
        hiveIds: batch.sourceHiveIds,
        hiveIdentifiers: batch.sourceHiveIdentifiers,
        processedBatchId: batch.id,
        processedBatchNumber: batch.batchNumber,
        honeyType: batch.honeyType,
        outputWeightKg: batch.weightKg,
        labTestId: batch.labTestId || "TEST-2026-0001",
        certificateId: certId,
      };

      const runNumber = memoryState.packagingRuns.length + 1;
      const runId = `PKG-2026-${String(runNumber).padStart(4, "0")}`;

      const startBottleNum = memoryState.bottles.length + 1;
      const endBottleNum = startBottleNum + input.numberOfBottles - 1;
      const startBottleId = `HC-BTL-2026-${String(startBottleNum).padStart(5, "0")}`;
      const endBottleId = `HC-BTL-2026-${String(endBottleNum).padStart(5, "0")}`;

      const now = new Date();
      const createdDateIso = now.toISOString();

      const newRun: PackagingRun = {
        id: runId,
        sourceBatchId: batch.id,
        sourceBatchNumber: batch.batchNumber,
        productName: input.productName,
        honeyVariety: batch.honeyType,
        bottleSize: input.bottleSize,
        bottleCount: input.numberOfBottles,
        totalPackagedWeightKg,
        packagingDate: input.packagingDate || createdDateIso.split("T")[0],
        packagingFacility: input.packagingFacility,
        packagingLine: input.packagingLine,
        lotReferenceCode: input.lotReferenceCode,
        bottleIdRange: {
          start: startBottleId,
          end: endBottleId,
        },
        certificationId: certId,
        notes: input.notes,
        createdAt: createdDateIso,
      };

      const newBottles: Bottle[] = [];
      for (let i = 0; i < input.numberOfBottles; i++) {
        const bNum = startBottleNum + i;
        const bId = `HC-BTL-2026-${String(bNum).padStart(5, "0")}`;
        const qrId = `QR-HC-${String(bNum).padStart(5, "0")}`;
        newBottles.push({
          id: bId,
          productName: input.productName,
          sourceBatchId: batch.id,
          sourceBatchNumber: batch.batchNumber,
          honeyVariety: batch.honeyType,
          bottleSize: input.bottleSize,
          bottleSizeKg: unitWeight,
          packagingRunId: runId,
          packagingDate: input.packagingDate || createdDateIso.split("T")[0],
          packagingFacility: input.packagingFacility,
          packagingLine: input.packagingLine,
          lotReferenceCode: input.lotReferenceCode,
          certificationId: certId,
          status: "Created",
          qrStatus: "Generated",
          qrIdentifier: qrId,
          verificationUrl: `/verify/${bId}`,
          originRegion: batch.sourceApiaryName?.includes("Highland")
            ? "Chamoli, Uttarakhand / Himalayan Region"
            : "Uttarakhand / Himalayan Region",
          harvestPeriod: batch.harvestDate
            ? new Date(batch.harvestDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })
            : "September 2026",
          notes: input.notes,
          createdAt: createdDateIso,
          sourceLineage: certLineage,
        });
      }

      const nextUsedWeight = (batch.usedQuantityKg || 0) + totalPackagedWeightKg;
      const nextRemainingWeight = Math.max(0, Number((availableWeight - totalPackagedWeightKg).toFixed(2)));

      const updatedBatch: HarvestBatch = {
        ...batch,
        usedQuantityKg: nextUsedWeight,
        remainingWeightKg: nextRemainingWeight,
        timeline: [
          ...batch.timeline,
          {
            title: "Bottling run created",
            description: `${input.numberOfBottles} × ${input.bottleSize} bottles (${totalPackagedWeightKg.toFixed(1)} kg) created under Run ${runId}. ${nextRemainingWeight.toFixed(1)} kg remaining in batch.`,
            timestamp: input.packagingDate || `${createdDateIso.split("T")[0]} ${now.toTimeString().split(" ")[0].slice(0, 5)}`,
            status: "completed",
            actor: input.packagingFacility,
            badge: "Bottling Run",
          },
        ],
      };

      const next: TraceabilityState = {
        ...memoryState,
        packagingRuns: [newRun, ...memoryState.packagingRuns],
        bottles: [...newBottles, ...memoryState.bottles],
        batches: memoryState.batches.map((b) => (b.id === batch.id ? updatedBatch : b)),
      };

      updateStore(next);
      return { run: newRun, bottles: newBottles };
    },
    []
  );

  const publishBottle = React.useCallback((bottleId: string): Bottle => {
    const bottle = memoryState.bottles.find((b) => b.id === bottleId);
    if (!bottle) throw new Error(`Bottle ${bottleId} not found`);

    const now = new Date();
    const updatedBottle: Bottle = {
      ...bottle,
      status: "Published",
      qrStatus: "Active",
      publishedAt: now.toISOString(),
      suspendedAt: undefined,
      suspendedReason: undefined,
    };

    const next: TraceabilityState = {
      ...memoryState,
      bottles: memoryState.bottles.map((b) => (b.id === bottleId ? updatedBottle : b)),
    };

    updateStore(next);
    return updatedBottle;
  }, []);

  const publishAllBatchBottles = React.useCallback((packagingRunId: string): Bottle[] => {
    const now = new Date();
    const publishedBottles: Bottle[] = [];

    const updatedBottles = memoryState.bottles.map((b) => {
      if (b.packagingRunId === packagingRunId && b.status !== "Suspended") {
        const updated: Bottle = {
          ...b,
          status: "Published",
          qrStatus: "Active",
          publishedAt: now.toISOString(),
        };
        publishedBottles.push(updated);
        return updated;
      }
      return b;
    });

    const next: TraceabilityState = {
      ...memoryState,
      bottles: updatedBottles,
    };

    updateStore(next);
    return publishedBottles;
  }, []);

  const suspendBottle = React.useCallback((bottleId: string, reason?: string): Bottle => {
    const bottle = memoryState.bottles.find((b) => b.id === bottleId);
    if (!bottle) throw new Error(`Bottle ${bottleId} not found`);

    const now = new Date();
    const updatedBottle: Bottle = {
      ...bottle,
      status: "Suspended",
      qrStatus: "Suspended",
      suspendedAt: now.toISOString(),
      suspendedReason: reason || "Verification temporarily suspended for quality review",
    };

    const next: TraceabilityState = {
      ...memoryState,
      bottles: memoryState.bottles.map((b) => (b.id === bottleId ? updatedBottle : b)),
    };

    updateStore(next);
    return updatedBottle;
  }, []);

  const getBottle = React.useCallback(
    (id: string) => {
      return state.bottles.find((b) => b.id === id);
    },
    [state.bottles]
  );

  const getBottlesByBatch = React.useCallback(
    (batchIdOrNumber: string) => {
      return state.bottles.filter(
        (b) => b.sourceBatchId === batchIdOrNumber || b.sourceBatchNumber === batchIdOrNumber
      );
    },
    [state.bottles]
  );

  const getPackagingRun = React.useCallback(
    (id: string) => {
      return state.packagingRuns.find((r) => r.id === id);
    },
    [state.packagingRuns]
  );

  const getPublicVerification = React.useCallback((bottleId: string): PublicConsumerVerification => {
    const bottle = memoryState.bottles.find((b) => b.id === bottleId);
    return buildPublicVerification(bottle);
  }, []);

  const getEligibleBottlingBatches = React.useCallback(() => {
    return state.batches.filter((b) => {
      const isProcessed = b.batchType === "Processed Honey" || b.batchNumber.startsWith("HC-PB");
      const isApproved = b.status === "Quality Approved" || b.isEligibleForBottling;
      const hasRemaining = (b.remainingWeightKg !== undefined ? b.remainingWeightKg : b.weightKg) > 0;
      return isProcessed && isApproved && hasRemaining;
    });
  }, [state.batches]);

  // Marketplace Methods
  const getMarketplaceListing = React.useCallback(
    (id: string): MarketplaceListing | undefined => {
      return state.marketplaceListings.find(
        (l) => l.id === id || l.batchId === id || l.batchNumber === id
      );
    },
    [state.marketplaceListings]
  );

  const getMarketplaceListingsByBatch = React.useCallback(
    (batchIdOrNumber: string): MarketplaceListing[] => {
      return state.marketplaceListings.filter(
        (l) => l.batchId === batchIdOrNumber || l.batchNumber === batchIdOrNumber
      );
    },
    [state.marketplaceListings]
  );

  const getMarketplaceOrder = React.useCallback(
    (id: string): MarketplaceOrder | undefined => {
      return state.marketplaceOrders.find((o) => o.id === id);
    },
    [state.marketplaceOrders]
  );

  const getMarketplaceOrdersByListing = React.useCallback(
    (listingId: string): MarketplaceOrder[] => {
      return state.marketplaceOrders.filter((o) => o.listingId === listingId);
    },
    [state.marketplaceOrders]
  );

  const getMarketplaceOrdersByBatch = React.useCallback(
    (batchIdOrNumber: string): MarketplaceOrder[] => {
      return state.marketplaceOrders.filter(
        (o) => o.batchId === batchIdOrNumber || o.batchNumber === batchIdOrNumber
      );
    },
    [state.marketplaceOrders]
  );

  const createMarketplaceOrder = React.useCallback(
    (input: CreateMarketplaceOrderInput): MarketplaceOrder => {
      const listing = memoryState.marketplaceListings.find((l) => l.id === input.listingId);
      if (!listing) {
        throw new Error(`Marketplace listing ${input.listingId} not found`);
      }
      if (listing.status !== "Active") {
        throw new Error(`Listing ${input.listingId} is ${listing.status} and cannot be ordered`);
      }
      if (input.quantity <= 0) {
        throw new Error("Requested quantity must be greater than 0");
      }
      if (input.quantity > listing.availableQuantity) {
        throw new Error(
          `Requested quantity (${input.quantity} kg) exceeds available quantity (${listing.availableQuantity} kg)`
        );
      }

      const existingCount = memoryState.marketplaceOrders.length;
      const orderSeq = String(existingCount + 1).padStart(4, "0");
      const orderId = `ORD-HC-2026-${orderSeq}`;

      const nowIso = new Date().toISOString();
      const nowFormatted = nowIso.replace("T", " ").substring(0, 16);

      const buyerName = input.buyerOrgName || "Golden Hive Foods";
      const buyerId = input.buyerOrgId || "org-ghf-02";
      const buyerContact = input.buyerContactName || "Procurement Officer";

      const newOrder: MarketplaceOrder = {
        id: orderId,
        listingId: listing.id,
        batchId: listing.batchId,
        batchNumber: listing.batchNumber,
        productName: `${listing.listingType}: ${listing.title}`,
        sellerOrgId: listing.sellerOrgId,
        sellerOrgName: listing.sellerOrgName,
        buyerOrgId: buyerId,
        buyerOrgName: buyerName,
        buyerContactName: buyerContact,
        buyerReference: input.buyerReference || `PO-HC-${Date.now().toString().slice(-4)}`,
        deliveryLocation: input.deliveryLocation,
        requestedDeliveryDate: input.requestedDeliveryDate,
        quantity: Number(input.quantity),
        unit: listing.unit || "kg",
        status: "Pending",
        orderDate: nowIso,
        notes: input.notes,
        statusHistory: [
          {
            status: "Pending",
            timestamp: nowIso,
            actor: `${buyerContact} (${buyerName})`,
            notes: "Commercial mock purchase order placed on marketplace.",
          },
        ],
        timeline: [
          {
            step: "Listing Created",
            description: `Listing ${listing.id} referencing batch ${listing.batchNumber} published by ${listing.sellerOrgName}.`,
            timestamp: listing.createdAt.replace("T", " ").substring(0, 16),
            status: "completed",
          },
          {
            step: "Mock Order Placed",
            description: `Buyer ${buyerName} placed order ${orderId} for ${input.quantity} ${listing.unit}.`,
            timestamp: nowFormatted,
            status: "completed",
          },
          {
            step: "Seller Response",
            description: `Awaiting acceptance or review by seller ${listing.sellerOrgName}.`,
            timestamp: "Awaiting Seller Action",
            status: "current",
          },
          {
            step: "Commercial Fulfillment",
            description: "Commercial delivery coordination. (Physical custody handover remains a separate traceability transfer event).",
            timestamp: "Upcoming",
            status: "upcoming",
          },
        ],
        createdAt: nowIso,
      };

      // Batch identity remains unchanged. No duplicate batch is created.
      const nextOrders = [newOrder, ...memoryState.marketplaceOrders];
      updateStore({
        ...memoryState,
        marketplaceOrders: nextOrders,
      });

      return newOrder;
    },
    []
  );

  const acceptMarketplaceOrder = React.useCallback(
    (orderId: string, notes?: string): MarketplaceOrder => {
      const order = memoryState.marketplaceOrders.find((o) => o.id === orderId);
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }
      const nowIso = new Date().toISOString();
      const nowFormatted = nowIso.replace("T", " ").substring(0, 16);

      const updatedOrder: MarketplaceOrder = {
        ...order,
        status: "Accepted",
        updatedAt: nowIso,
        statusHistory: [
          ...order.statusHistory,
          {
            status: "Accepted",
            timestamp: nowIso,
            actor: `Seller Representative (${order.sellerOrgName})`,
            notes: notes || "Commercial order terms accepted by seller.",
          },
        ],
        timeline: order.timeline.map((step) => {
          if (step.step === "Seller Response" || step.step === "Seller Accepted") {
            return {
              step: "Seller Accepted",
              description: `Seller ${order.sellerOrgName} accepted the order terms.${notes ? ` (${notes})` : ""}`,
              timestamp: nowFormatted,
              status: "completed" as const,
            };
          }
          if (step.step === "Commercial Fulfillment") {
            return {
              step: "Commercial Fulfillment",
              description: "Scheduled for fulfillment and delivery alignment.",
              timestamp: "In Progress",
              status: "current" as const,
            };
          }
          return step;
        }),
      };

      const nextOrders = memoryState.marketplaceOrders.map((o) => (o.id === orderId ? updatedOrder : o));
      updateStore({
        ...memoryState,
        marketplaceOrders: nextOrders,
      });
      return updatedOrder;
    },
    []
  );

  const rejectMarketplaceOrder = React.useCallback(
    (orderId: string, reason: string): MarketplaceOrder => {
      const order = memoryState.marketplaceOrders.find((o) => o.id === orderId);
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }
      if (!reason || !reason.trim()) {
        throw new Error("Rejection reason is required");
      }
      const nowIso = new Date().toISOString();
      const nowFormatted = nowIso.replace("T", " ").substring(0, 16);

      const updatedOrder: MarketplaceOrder = {
        ...order,
        status: "Rejected",
        rejectionReason: reason,
        updatedAt: nowIso,
        statusHistory: [
          ...order.statusHistory,
          {
            status: "Rejected",
            timestamp: nowIso,
            actor: `Seller Representative (${order.sellerOrgName})`,
            notes: `Rejected by seller: ${reason}`,
          },
        ],
        timeline: order.timeline.map((step) => {
          if (step.step === "Seller Response" || step.step === "Seller Accepted") {
            return {
              step: "Seller Rejected",
              description: `Order rejected by seller. Reason: ${reason}`,
              timestamp: nowFormatted,
              status: "completed" as const,
            };
          }
          if (step.step === "Commercial Fulfillment") {
            return {
              step: "Commercial Fulfillment",
              description: "Commercial order rejected. No physical transfer will occur.",
              timestamp: "Cancelled",
              status: "upcoming" as const,
            };
          }
          return step;
        }),
      };

      const nextOrders = memoryState.marketplaceOrders.map((o) => (o.id === orderId ? updatedOrder : o));
      updateStore({
        ...memoryState,
        marketplaceOrders: nextOrders,
      });
      return updatedOrder;
    },
    []
  );

  const cancelMarketplaceOrder = React.useCallback(
    (orderId: string, reason: string): MarketplaceOrder => {
      const order = memoryState.marketplaceOrders.find((o) => o.id === orderId);
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }
      if (!reason || !reason.trim()) {
        throw new Error("Cancellation reason is required");
      }
      const nowIso = new Date().toISOString();
      const nowFormatted = nowIso.replace("T", " ").substring(0, 16);

      const updatedOrder: MarketplaceOrder = {
        ...order,
        status: "Cancelled",
        cancellationReason: reason,
        updatedAt: nowIso,
        statusHistory: [
          ...order.statusHistory,
          {
            status: "Cancelled",
            timestamp: nowIso,
            actor: `Buyer Representative (${order.buyerOrgName})`,
            notes: `Cancelled by buyer: ${reason}`,
          },
        ],
        timeline: order.timeline.map((step) => {
          if (step.status === "current") {
            return {
              ...step,
              description: `Order cancelled. Reason: ${reason}`,
              timestamp: nowFormatted,
              status: "completed" as const,
            };
          }
          return step;
        }),
      };

      const nextOrders = memoryState.marketplaceOrders.map((o) => (o.id === orderId ? updatedOrder : o));
      updateStore({
        ...memoryState,
        marketplaceOrders: nextOrders,
      });
      return updatedOrder;
    },
    []
  );

  const getBatchMarketplaceActivity = React.useCallback(
    (batchIdOrNumber: string): BatchMarketplaceActivity[] => {
      const listings = state.marketplaceListings.filter(
        (l) => l.batchId === batchIdOrNumber || l.batchNumber === batchIdOrNumber
      );
      const orders = state.marketplaceOrders.filter(
        (o) => o.batchId === batchIdOrNumber || o.batchNumber === batchIdOrNumber
      );

      const activities: BatchMarketplaceActivity[] = [];

      listings.forEach((l) => {
        const linkedOrders = orders.filter((o) => o.listingId === l.id);
        if (linkedOrders.length > 0) {
          linkedOrders.forEach((o) => {
            activities.push({
              listingId: l.id,
              listingStatus: l.status,
              orderId: o.id,
              orderStatus: o.status,
              quantityKg: o.quantity,
              buyerName: o.buyerOrgName,
              sellerName: o.sellerOrgName,
              orderDate: o.orderDate,
            });
          });
        } else {
          activities.push({
            listingId: l.id,
            listingStatus: l.status,
            quantityKg: l.availableQuantity,
            sellerName: l.sellerOrgName,
          });
        }
      });

      return activities;
    },
    [state.marketplaceListings, state.marketplaceOrders]
  );

  const getAdminOrganisation = React.useCallback(
    (id: string): AdminOrganization | undefined => {
      return state.adminOrganisations.find((o) => o.id === id);
    },
    [state.adminOrganisations]
  );

  const getAdminUser = React.useCallback(
    (id: string): AdminUser | undefined => {
      return state.adminUsers.find((u) => u.id === id);
    },
    [state.adminUsers]
  );

  const getAuditEvent = React.useCallback(
    (id: string): AuditEvent | undefined => {
      return state.auditEvents.find((a) => a.id === id);
    },
    [state.auditEvents]
  );

  const getException = React.useCallback(
    (id: string): ComplianceException | undefined => {
      return state.exceptions.find((e) => e.id === id);
    },
    [state.exceptions]
  );

  const getAccessRequest = React.useCallback(
    (id: string): AccessRequest | undefined => {
      return state.accessRequests.find((r) => r.id === id);
    },
    [state.accessRequests]
  );

  const getPlausibilityAlert = React.useCallback(
    (id: string): PlausibilityAlert | undefined => {
      return state.plausibilityAlerts.find((p) => p.id === id);
    },
    [state.plausibilityAlerts]
  );

  const getAuditEventsByEntity = React.useCallback(
    (entityId: string): AuditEvent[] => {
      return state.auditEvents.filter((a) => a.entity.id === entityId);
    },
    [state.auditEvents]
  );

  const getAuditEventsByOrg = React.useCallback(
    (orgId: string): AuditEvent[] => {
      return state.auditEvents.filter((a) => a.organisation.id === orgId);
    },
    [state.auditEvents]
  );

  const addAuditEvent = React.useCallback(
    (data: {
      eventType: AuditEventType;
      actor?: Partial<AuditEvent["actor"]>;
      organisation?: Partial<AuditEvent["organisation"]>;
      entity: AuditEntityRef;
      action: string;
      source?: AuditEvent["source"];
      metadata?: Record<string, unknown>;
      status?: AuditEvent["status"];
    }): AuditEvent => {
      const lastEvent = memoryState.auditEvents[0] || null;
      const previousHash = lastEvent
        ? lastEvent.currentEventHash
        : "0x0000000000000000000000000000000000000000000000000000000000000000";
      const now = new Date().toISOString();
      const eventId = `AUD-2026-${String(memoryState.auditEvents.length + 8801).padStart(4, "0")}`;
      const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
      const currentHash = `0x${randomHex}${Date.now().toString(16)}`;

      const newEvent: AuditEvent = {
        id: eventId,
        eventType: data.eventType,
        actor: {
          id: data.actor?.id || "usr-demo-001",
          name: data.actor?.name || "Chirag Operator",
          role: data.actor?.role || "Super Admin",
          organizationName: data.actor?.organizationName || "Highland Apiaries Cooperative",
          email: data.actor?.email || "operator@honeychain.io",
        },
        organisation: {
          id: data.organisation?.id || "org-hac-01",
          name: data.organisation?.name || "Highland Apiaries Cooperative",
          code: data.organisation?.code || "HAC",
        },
        entity: data.entity,
        timestamp: now,
        source: data.source || "Admin Console",
        status: data.status || "verified",
        action: data.action,
        previousEventHash: previousHash,
        currentEventHash: currentHash,
        immutableTimestamp: new Date().toISOString(),
        metadata: data.metadata || {},
        isAppendOnly: true,
        createdAt: now,
        updatedAt: now,
      };

      updateStore({
        ...memoryState,
        auditEvents: [newEvent, ...memoryState.auditEvents],
      });

      return newEvent;
    },
    []
  );

  const updateOrganisationStatus = React.useCallback(
    (orgId: string, status: AdminOrgStatus, reason: string) => {
      const org = memoryState.adminOrganisations.find((o) => o.id === orgId);
      if (!org) return;

      const nextOrgs = memoryState.adminOrganisations.map((o) =>
        o.id === orgId ? { ...o, status, updatedAt: new Date().toISOString() } : o
      );

      const eventId = `AUD-2026-${String(memoryState.auditEvents.length + 8801).padStart(4, "0")}`;
      const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
      const lastEvent = memoryState.auditEvents[0];
      const previousHash = lastEvent ? lastEvent.currentEventHash : "0x0000000000000000000000000000000000000000000000000000000000000000";
      const now = new Date().toISOString();

      const newAudit: AuditEvent = {
        id: eventId,
        eventType: "Administrative Action",
        actor: {
          id: "usr-demo-001",
          name: "Chirag Operator",
          role: "Super Admin",
          organizationName: "National Honey Standards Board",
          email: "operator@honeychain.io",
        },
        organisation: {
          id: org.id,
          name: org.name,
          code: org.code,
        },
        entity: {
          type: "organization",
          id: org.id,
          title: `Organisation ${org.name}`,
          href: `/admin/organisations/${org.id}`,
        },
        timestamp: now,
        source: "Admin Console",
        status: status === "Suspended" ? "flagged" : "verified",
        action: `Updated status of organisation "${org.name}" (${org.code}) to ${status}. Reason: ${reason}`,
        previousEventHash: previousHash,
        currentEventHash: `0x${randomHex}${Date.now().toString(16)}`,
        immutableTimestamp: now,
        metadata: {
          organisationId: org.id,
          previousStatus: org.status,
          newStatus: status,
          reason,
        },
        isAppendOnly: true,
        createdAt: now,
        updatedAt: now,
      };

      updateStore({
        ...memoryState,
        adminOrganisations: nextOrgs,
        auditEvents: [newAudit, ...memoryState.auditEvents],
      });
    },
    []
  );

  const assignUserRole = React.useCallback(
    (userId: string, newRole: string, reason: string) => {
      const user = memoryState.adminUsers.find((u) => u.id === userId);
      if (!user) return;

      const updatedRoles = user.roles.includes(newRole)
        ? user.roles
        : [...user.roles, newRole];

      const nextUsers = memoryState.adminUsers.map((u) =>
        u.id === userId
          ? {
              ...u,
              roles: updatedRoles,
              updatedAt: new Date().toISOString(),
            }
          : u
      );

      const eventId = `AUD-2026-${String(memoryState.auditEvents.length + 8801).padStart(4, "0")}`;
      const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
      const lastEvent = memoryState.auditEvents[0];
      const previousHash = lastEvent ? lastEvent.currentEventHash : "0x0000000000000000000000000000000000000000000000000000000000000000";
      const now = new Date().toISOString();

      const newAudit: AuditEvent = {
        id: eventId,
        eventType: "Role Assignment",
        actor: {
          id: "usr-demo-001",
          name: "Chirag Operator",
          role: "Super Admin",
          organizationName: "Highland Apiaries Cooperative",
          email: "operator@honeychain.io",
        },
        organisation: {
          id: user.organizationId,
          name: user.organizationName,
          code: user.organizationId.replace("org-", "").toUpperCase(),
        },
        entity: {
          type: "user",
          id: user.id,
          title: `User ${user.fullName}`,
          href: "/admin/users",
        },
        timestamp: now,
        source: "Admin Console",
        status: "verified",
        action: `Assigned role "${newRole}" to ${user.fullName} (${user.email}) at ${user.organizationName}. Reason: ${reason}`,
        previousEventHash: previousHash,
        currentEventHash: `0x${randomHex}${Date.now().toString(16)}`,
        immutableTimestamp: now,
        metadata: {
          userId: user.id,
          assignedRole: newRole,
          allRoles: updatedRoles,
          reason,
        },
        isAppendOnly: true,
        createdAt: now,
        updatedAt: now,
      };

      updateStore({
        ...memoryState,
        adminUsers: nextUsers,
        auditEvents: [newAudit, ...memoryState.auditEvents],
      });
    },
    []
  );

  const updateUserStatus = React.useCallback(
    (userId: string, status: "Active" | "Disabled", reason: string) => {
      const user = memoryState.adminUsers.find((u) => u.id === userId);
      if (!user) return;

      const nextUsers = memoryState.adminUsers.map((u) =>
        u.id === userId
          ? {
              ...u,
              status,
              updatedAt: new Date().toISOString(),
            }
          : u
      );

      const eventId = `AUD-2026-${String(memoryState.auditEvents.length + 8801).padStart(4, "0")}`;
      const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
      const lastEvent = memoryState.auditEvents[0];
      const previousHash = lastEvent ? lastEvent.currentEventHash : "0x0000000000000000000000000000000000000000000000000000000000000000";
      const now = new Date().toISOString();

      const newAudit: AuditEvent = {
        id: eventId,
        eventType: "Administrative Action",
        actor: {
          id: "usr-demo-001",
          name: "Chirag Operator",
          role: "Super Admin",
          organizationName: "Highland Apiaries Cooperative",
          email: "operator@honeychain.io",
        },
        organisation: {
          id: user.organizationId,
          name: user.organizationName,
          code: user.organizationId.replace("org-", "").toUpperCase(),
        },
        entity: {
          type: "user",
          id: user.id,
          title: `User ${user.fullName}`,
          href: "/admin/users",
        },
        timestamp: now,
        source: "Admin Console",
        status: status === "Disabled" ? "flagged" : "verified",
        action: `Changed user status for ${user.fullName} to ${status}. Reason: ${reason}`,
        previousEventHash: previousHash,
        currentEventHash: `0x${randomHex}${Date.now().toString(16)}`,
        immutableTimestamp: now,
        metadata: {
          userId: user.id,
          newStatus: status,
          reason,
        },
        isAppendOnly: true,
        createdAt: now,
        updatedAt: now,
      };

      updateStore({
        ...memoryState,
        adminUsers: nextUsers,
        auditEvents: [newAudit, ...memoryState.auditEvents],
      });
    },
    []
  );

  const updateExceptionStatus = React.useCallback(
    (
      exceptionId: string,
      status: ExceptionStatus,
      reason?: string,
      notes?: string,
      correctiveAction?: string
    ) => {
      const exc = memoryState.exceptions.find((e) => e.id === exceptionId);
      if (!exc) return;

      const now = new Date().toISOString();
      const resolution =
        status === "resolved"
          ? {
              resolvedBy: "Chirag Operator (Super Admin)",
              resolvedAt: now,
              reason: reason || "Investigation verified and corrective measures implemented.",
              correctiveAction: correctiveAction || "Operational process updated and verified.",
            }
          : exc.resolution;

      const nextExceptions = memoryState.exceptions.map((e) =>
        e.id === exceptionId
          ? {
              ...e,
              status,
              investigationNotes: notes
                ? `${e.investigationNotes ? e.investigationNotes + " | " : ""}${notes}`
                : e.investigationNotes,
              resolution,
              updatedAt: now,
            }
          : e
      );

      const eventId = `AUD-2026-${String(memoryState.auditEvents.length + 8801).padStart(4, "0")}`;
      const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
      const lastEvent = memoryState.auditEvents[0];
      const previousHash = lastEvent ? lastEvent.currentEventHash : "0x0000000000000000000000000000000000000000000000000000000000000000";

      const newAudit: AuditEvent = {
        id: eventId,
        eventType: "Exception",
        actor: {
          id: "usr-demo-001",
          name: "Chirag Operator",
          role: "Super Admin",
          organizationName: "Highland Apiaries Cooperative",
          email: "operator@honeychain.io",
        },
        organisation: {
          id: "org-fss-06",
          name: "National Honey Standards Board",
          code: "NHSB",
        },
        entity: {
          type: "exception",
          id: exc.id,
          title: `Exception ${exc.id} (${exc.type})`,
          href: `/admin/exceptions/${exc.id}`,
        },
        timestamp: now,
        source: "Admin Console",
        status: status === "resolved" ? "verified" : "flagged",
        action: `Updated exception ${exc.id} status to ${status.toUpperCase()}.${reason ? ` Reason: ${reason}` : ""}${notes ? ` Notes: ${notes}` : ""}`,
        previousEventHash: previousHash,
        currentEventHash: `0x${randomHex}${Date.now().toString(16)}`,
        immutableTimestamp: now,
        metadata: {
          exceptionId: exc.id,
          type: exc.type,
          previousStatus: exc.status,
          newStatus: status,
          reason,
          correctiveAction,
        },
        isAppendOnly: true,
        createdAt: now,
        updatedAt: now,
      };

      updateStore({
        ...memoryState,
        exceptions: nextExceptions,
        auditEvents: [newAudit, ...memoryState.auditEvents],
      });
    },
    []
  );

  const decideAccessRequest = React.useCallback(
    (
      requestId: string,
      decision: "approved" | "denied",
      reason?: string,
      grantedScope?: string[]
    ) => {
      const req = memoryState.accessRequests.find((r) => r.id === requestId);
      if (!req) return;

      const now = new Date().toISOString();
      const decisionObj = {
        decidedBy: "Chirag Operator (Super Admin)",
        decidedAt: now,
        decision,
        reason: reason || (decision === "approved" ? "Access granted for legitimate verified purpose." : "Request denied."),
        grantedScope: decision === "approved" ? grantedScope || req.requestedScope : [],
      };

      const nextRequests = memoryState.accessRequests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: decision,
              decision: decisionObj,
              updatedAt: now,
            }
          : r
      );

      const eventId = `AUD-2026-${String(memoryState.auditEvents.length + 8801).padStart(4, "0")}`;
      const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
      const lastEvent = memoryState.auditEvents[0];
      const previousHash = lastEvent ? lastEvent.currentEventHash : "0x0000000000000000000000000000000000000000000000000000000000000000";

      const newAudit: AuditEvent = {
        id: eventId,
        eventType: "Access Request",
        actor: {
          id: "usr-demo-001",
          name: "Chirag Operator",
          role: "Super Admin",
          organizationName: "National Honey Standards Board",
          email: "operator@honeychain.io",
        },
        organisation: {
          id: "org-fss-06",
          name: "National Honey Standards Board",
          code: "NHSB",
        },
        entity: {
          type: "access_request",
          id: req.id,
          title: `Access Request ${req.id} (${req.requester.name})`,
          href: `/admin/access-requests/${req.id}`,
        },
        timestamp: now,
        source: "Admin Console",
        status: "verified",
        action: `${decision === "approved" ? "Approved" : "Denied"} access request ${req.id} from ${req.requester.name} (${req.organisation}). Resource: "${req.requestedResource}".${reason ? ` Reason: ${reason}` : ""}`,
        previousEventHash: previousHash,
        currentEventHash: `0x${randomHex}${Date.now().toString(16)}`,
        immutableTimestamp: now,
        metadata: {
          requestId: req.id,
          decision,
          grantedScope: decisionObj.grantedScope,
          reason: decisionObj.reason,
        },
        isAppendOnly: true,
        createdAt: now,
        updatedAt: now,
      };

      updateStore({
        ...memoryState,
        accessRequests: nextRequests,
        auditEvents: [newAudit, ...memoryState.auditEvents],
      });
    },
    []
  );

  const updatePlausibilityStatus = React.useCallback(
    (alertId: string, status: PlausibilityAlert["status"], notes?: string) => {
      const alert = memoryState.plausibilityAlerts.find((a) => a.id === alertId);
      if (!alert) return;

      const now = new Date().toISOString();
      const nextAlerts = memoryState.plausibilityAlerts.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status,
              reviewedBy: "Chirag Operator (Super Admin)",
              reviewedAt: now,
              reviewNotes: notes || a.reviewNotes,
              updatedAt: now,
            }
          : a
      );

      const eventId = `AUD-2026-${String(memoryState.auditEvents.length + 8801).padStart(4, "0")}`;
      const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
      const lastEvent = memoryState.auditEvents[0];
      const previousHash = lastEvent ? lastEvent.currentEventHash : "0x0000000000000000000000000000000000000000000000000000000000000000";

      const newAudit: AuditEvent = {
        id: eventId,
        eventType: "Administrative Action",
        actor: {
          id: "usr-demo-001",
          name: "Chirag Operator",
          role: "Super Admin",
          organizationName: "National Honey Standards Board",
          email: "operator@honeychain.io",
        },
        organisation: {
          id: "org-fss-06",
          name: "National Honey Standards Board",
          code: "NHSB",
        },
        entity: {
          type: "plausibility_alert",
          id: alert.id,
          title: `Plausibility Alert ${alert.id}`,
          href: "/admin/plausibility",
        },
        timestamp: now,
        source: "Admin Console",
        status: "verified",
        action: `Updated plausibility review status for "${alert.title}" to ${status}.${notes ? ` Notes: ${notes}` : ""}`,
        previousEventHash: previousHash,
        currentEventHash: `0x${randomHex}${Date.now().toString(16)}`,
        immutableTimestamp: now,
        metadata: {
          alertId: alert.id,
          status,
          notes,
        },
        isAppendOnly: true,
        createdAt: now,
        updatedAt: now,
      };

      updateStore({
        ...memoryState,
        plausibilityAlerts: nextAlerts,
        auditEvents: [newAudit, ...memoryState.auditEvents],
      });
    },
    []
  );

  const resetToMockData = React.useCallback(() => {
    updateStore(DEFAULT_STATE);
  }, []);

  const value = React.useMemo<TraceabilityContextValue>(
    () => ({
      apiaries: state.apiaries,
      hives: state.hives,
      activities: state.activities,
      batches: state.batches,
      custodyTransfers: state.custodyTransfers,
      receivingRecords: state.receivingRecords,
      processingJobs: state.processingJobs,
      labTests: state.labTests,
      certifications: state.certifications,
      bottles: state.bottles,
      packagingRuns: state.packagingRuns,
      marketplaceListings: state.marketplaceListings,
      marketplaceOrders: state.marketplaceOrders,
      adminOrganisations: state.adminOrganisations,
      adminUsers: state.adminUsers,
      auditEvents: state.auditEvents,
      exceptions: state.exceptions,
      accessRequests: state.accessRequests,
      plausibilityAlerts: state.plausibilityAlerts,
      isLoaded: hasMounted,
      addApiary,
      addHive,
      addActivity,
      addBatch,
      addCustodyTransfer,
      acceptReceiving,
      rejectReceiving,
      addProcessingJob,
      submitLabSample,
      updateLabTestResults,
      approveLabTest,
      rejectLabTest,
      requestCorrectionLabTest,
      createPackagingRun,
      publishBottle,
      publishAllBatchBottles,
      suspendBottle,
      getApiary,
      getHive,
      getHivesByApiary,
      getActivitiesByHive,
      getBatch,
      getCustodyTransfer,
      getCustodyTransfersByBatch,
      getIncomingTransfersByOrg,
      getOutgoingTransfersByOrg,
      getReceivingRecord,
      getReceivingRecordByTransfer,
      getReceivingRecordByBatch,
      getProcessingJob,
      getProcessingJobsByInputBatch,
      getProcessingJobByOutputBatch,
      getEligibleProcessingBatches,
      getEligibleLabTestingBatches,
      getEligibleBottlingBatches,
      getLabTest,
      getLabTestsByBatch,
      getCertification,
      getCertificationByBatch,
      getBottle,
      getBottlesByBatch,
      getPackagingRun,
      getPublicVerification,
      getMarketplaceListing,
      getMarketplaceListingsByBatch,
      getMarketplaceOrder,
      getMarketplaceOrdersByListing,
      getMarketplaceOrdersByBatch,
      createMarketplaceOrder,
      acceptMarketplaceOrder,
      rejectMarketplaceOrder,
      cancelMarketplaceOrder,
      getBatchMarketplaceActivity,
      getAdminOrganisation,
      getAdminUser,
      getAuditEvent,
      getException,
      getAccessRequest,
      getPlausibilityAlert,
      getAuditEventsByEntity,
      getAuditEventsByOrg,
      addAuditEvent,
      updateOrganisationStatus,
      assignUserRole,
      updateUserStatus,
      updateExceptionStatus,
      decideAccessRequest,
      updatePlausibilityStatus,
      resetToMockData,
    }),
    [
      state,
      hasMounted,
      addApiary,
      addHive,
      addActivity,
      addBatch,
      addCustodyTransfer,
      acceptReceiving,
      rejectReceiving,
      addProcessingJob,
      submitLabSample,
      updateLabTestResults,
      approveLabTest,
      rejectLabTest,
      requestCorrectionLabTest,
      createPackagingRun,
      publishBottle,
      publishAllBatchBottles,
      suspendBottle,
      getApiary,
      getHive,
      getHivesByApiary,
      getActivitiesByHive,
      getBatch,
      getCustodyTransfer,
      getCustodyTransfersByBatch,
      getIncomingTransfersByOrg,
      getOutgoingTransfersByOrg,
      getReceivingRecord,
      getReceivingRecordByTransfer,
      getReceivingRecordByBatch,
      getProcessingJob,
      getProcessingJobsByInputBatch,
      getProcessingJobByOutputBatch,
      getEligibleProcessingBatches,
      getEligibleLabTestingBatches,
      getEligibleBottlingBatches,
      getLabTest,
      getLabTestsByBatch,
      getCertification,
      getCertificationByBatch,
      getBottle,
      getBottlesByBatch,
      getPackagingRun,
      getPublicVerification,
      getMarketplaceListing,
      getMarketplaceListingsByBatch,
      getMarketplaceOrder,
      getMarketplaceOrdersByListing,
      getMarketplaceOrdersByBatch,
      createMarketplaceOrder,
      acceptMarketplaceOrder,
      rejectMarketplaceOrder,
      cancelMarketplaceOrder,
      getBatchMarketplaceActivity,
      getAdminOrganisation,
      getAdminUser,
      getAuditEvent,
      getException,
      getAccessRequest,
      getPlausibilityAlert,
      getAuditEventsByEntity,
      getAuditEventsByOrg,
      addAuditEvent,
      updateOrganisationStatus,
      assignUserRole,
      updateUserStatus,
      updateExceptionStatus,
      decideAccessRequest,
      updatePlausibilityStatus,
      resetToMockData,
    ]
  );

  return (
    <TraceabilityContext.Provider value={value}>
      {children}
    </TraceabilityContext.Provider>
  );
}

export function useTraceability() {
  const context = React.useContext(TraceabilityContext);
  if (!context) {
    throw new Error("useTraceability must be used within a TraceabilityProvider");
  }
  return context;
}
