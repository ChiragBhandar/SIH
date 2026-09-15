export type ApiaryStatus = "active" | "inactive" | "quarantine";

export interface Apiary {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  elevation: string;
  dominantFlora: string;
  hiveCount: number;
  status: ApiaryStatus;
  lastInspectionDate: string;
  notes?: string;
  registeredAt: string;
  registeredBy: string;
  createdAt?: string;
  updatedAt?: string;
}

export type HiveType = "Langstroth" | "Top-Bar" | "Warre" | "Traditional Log";

export type QueenStatus =
  | "Active & Laying"
  | "Virgin"
  | "Supersedure"
  | "Queenless"
  | "Requeening Needed";

export type HiveHealthStatus = "healthy" | "monitoring" | "treated" | "dormant";

export interface Hive {
  id: string;
  identifier: string;
  internalCode: string;
  apiaryId: string;
  apiaryName: string;
  hiveType: HiveType;
  installationDate: string;
  queenStatus: QueenStatus;
  locationInApiary: string;
  nfcRfidId: string;
  status: HiveHealthStatus;
  lastInspectionDate: string;
  lastActivity: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ActivityType =
  | "Inspection"
  | "Feeding"
  | "Queen observation"
  | "Pest treatment"
  | "Floral observation"
  | "Harvest Preparation";

export interface ColonyActivity {
  id: string;
  type: ActivityType;
  hiveId: string;
  hiveIdentifier: string;
  apiaryId: string;
  apiaryName: string;
  timestamp: string;
  weather: string;
  temperature: string;
  humidity: string;
  floralObservation: string;
  queenStatus: QueenStatus;
  notes: string;
  recordedBy: string;
  syncStatus: "synced" | "pending_sync";
  createdAt?: string;
  updatedAt?: string;
}

export interface TraceabilityTimelineStep {
  title: string;
  description: string;
  timestamp: string;
  status: "completed" | "current" | "upcoming";
  actor?: string;
  badge?: string;
}

export type BatchStatusType =
  | "Raw Batch Created"
  | "Pending Custody Transfer"
  | "In Transit"
  | "Received"
  | "Consumed partially for processing"
  | "In Processing"
  | "Processed Batch Created"
  | "Lab Testing"
  | "Quality Approved"
  | "Rejected"
  | "Correction Requested"
  | "Correction Required";

export interface DerivedSourceBatchRef {
  batchId: string;
  batchNumber: string;
  usedQuantityKg: number;
  sourceOrgName: string;
  honeyType: string;
}

export interface HarvestBatch {
  id: string;
  batchNumber: string;
  batchType?: "Raw Honey" | "Processed Honey";
  sourceApiaryId?: string;
  sourceApiaryName?: string;
  sourceHiveIds?: string[];
  sourceHiveIdentifiers?: string[];
  harvestDate?: string;
  processingDate?: string;
  honeyType: string;
  weightKg: number; // original/produced weight
  usedQuantityKg?: number; // amount used in processing
  remainingWeightKg?: number; // available amount left
  containerRef: string;
  storageLocation: string;
  status: BatchStatusType;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  currentCustodyOrgId?: string;
  currentCustodyOrgName?: string;
  activeTransferId?: string;
  receivingRecordId?: string;
  processingJobId?: string;
  derivedFromBatches?: DerivedSourceBatchRef[];
  downstreamProcessingJobs?: string[];
  labTestId?: string;
  certificateId?: string;
  isEligibleForLabTesting?: boolean;
  isEligibleForBottling?: boolean;
  traceabilityStatus: string;
  timeline: TraceabilityTimelineStep[];
}

