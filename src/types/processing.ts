export type ProcessType =
  | "Filtering"
  | "Settling"
  | "Blending"
  | "Heating"
  | "Filling preparation"
  | "Other";

export type ProcessingStatus =
  | "Ready"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export interface ProcessingInputBatchRef {
  batchId: string; // e.g. "HC-RH-2026-0003"
  batchNumber: string;
  sourceOrgId?: string;
  sourceOrgName: string;
  honeyType: string;
  availableQuantityKg: number;
  usedQuantityKg: number;
  containerRef?: string;
}

export interface ProcessingFacility {
  id: string;
  name: string;
  location: string;
  lines: string[];
}

export interface ProcessingOperator {
  id: string;
  name: string;
  role: string;
  certification?: string;
}

export interface ProcessingJob {
  id: string; // e.g. "PRC-2026-0001"
  processReferenceNumber?: string;
  processType: ProcessType;
  status: ProcessingStatus;
  facility: string;
  line: string;
  operator: string;
  startDate: string;
  endDate?: string;
  processNotes?: string;

  // Input batches
  inputBatches: ProcessingInputBatchRef[];
  totalInputQuantityKg: number;

  // Output specification
  outputBatchId: string; // e.g. "HC-PB-2026-0001"
  outputHoneyType: string;
  outputQuantityKg: number;
  yieldPercentage: number;
  outputStorageLocation: string;
  outputContainerRef: string;
  outputNotes?: string;

  // Context & Audit
  orgId: string;
  orgName: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProcessingJobInput {
  processType: ProcessType;
  facility: string;
  line: string;
  operator: string;
  startDate: string;
  endDate?: string;
  processNotes?: string;
  processReferenceNumber?: string;

  inputs: Array<{
    batchId: string;
    usedQuantityKg: number;
  }>;

  outputHoneyType: string;
  outputQuantityKg: number;
  outputStorageLocation: string;
  outputContainerRef: string;
  outputNotes?: string;
  createdBy?: string;
  orgId?: string;
  orgName?: string;
}
