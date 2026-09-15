export type TestPanelType =
  | "Basic quality panel"
  | "Full honey quality panel"
  | "Adulteration screening"
  | "Microbiological panel"
  | "Custom";

export type TestPriority = "Normal" | "Urgent";

export type LabTestStatus =
  | "Awaiting Analysis"
  | "In Analysis"
  | "Approved"
  | "Rejected"
  | "Correction Required";

export type QualityDecisionType = "Approved" | "Rejected" | "Correction Requested";

export type LabRejectionReason =
  | "Quality parameter outside specification"
  | "Adulteration concern"
  | "Microbiological concern"
  | "Sample integrity issue"
  | "Documentation issue"
  | "Other";

export interface QualityParameterResult {
  id: string;
  name: string;
  category: "Physical & Chemical" | "Enzymatic & Freshness" | "Purity & Adulteration" | "Microbiological";
  value: string;
  unit: string;
  referenceRange: string;
  status: "pass" | "fail" | "pending";
  notes?: string;
}

export interface QualityDecisionEvent {
  id: string;
  decisionType: QualityDecisionType;
  timestamp: string;
  analyst: string;
  notes: string;
  reason?: LabRejectionReason | string;
  certificateId?: string;
  targetTestStatus: LabTestStatus;
}

export interface LabSample {
  id: string; // e.g. "SAMPLE-LAB-2026-0001"
  batchId: string; // e.g. "HC-PB-2026-0003"
  batchNumber: string;
  quantity: string; // e.g. "250 ml" or "500 g"
  containerRef: string;
  collectionDateTime: string;
  collectedBy: string;
  samplingNotes?: string;
}

export interface LaboratoryInfo {
  id: string;
  name: string;
  accreditation: string;
  location: string;
}

export interface LabAnalyst {
  id: string;
  name: string;
  role: string;
  licenseNumber?: string;
}

export interface LabTest {
  id: string; // e.g. "TEST-2026-0001"
  batchId: string;
  batchNumber: string;
  sample: LabSample;
  testPanel: TestPanelType;
  priority: TestPriority;
  status: LabTestStatus;
  laboratory: LaboratoryInfo;
  analyst: LabAnalyst;
  submittedBy: string;
  submittedDate: string;
  expectedCompletionDate?: string;
  completedDate?: string;
  results: QualityParameterResult[];
  decisionsHistory: QualityDecisionEvent[];
  certificateId?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SourceLineageTrace {
  apiaryId?: string;
  apiaryName?: string;
  apiaryLocation?: string;
  hiveIds?: string[];
  hiveIdentifiers?: string[];
  rawBatchId?: string;
  rawBatchNumber?: string;
  harvestDate?: string;
  transferId?: string;
  receivingRecordId?: string;
  processingJobId?: string;
  processingFacility?: string;
  processedBatchId: string;
  processedBatchNumber: string;
  processingDate?: string;
  honeyType: string;
  outputWeightKg: number;
  labTestId: string;
  certificateId: string;
}

export interface HoneyCertificate {
  id: string; // e.g. "CERT-HC-2026-0003"
  batchId: string;
  batchNumber: string;
  testId: string;
  issuedBy: string;
  accreditationNumber: string;
  issuedDate: string;
  validStatus: "Active" | "Suspended" | "Revoked";
  certificationType: string;
  honeyType: string;
  certifiedWeightKg: number;
  analystName: string;
  sealNumber: string;
  summaryVerdict: string;
  approvedParameters: QualityParameterResult[];
  sourceLineage: SourceLineageTrace;
  createdAt: string;
}

export interface SubmitLabSampleInput {
  batchId: string;
  sampleId?: string;
  sampleQuantity: string;
  sampleContainerRef: string;
  collectionDateTime: string;
  collectedBy: string;
  samplingNotes?: string;
  testPanel: TestPanelType;
  priority: TestPriority;
  expectedCompletionDate?: string;
  laboratoryId?: string;
  analystId?: string;
}

export interface ApproveLabTestInput {
  analyst: string;
  approvalDate: string;
  certificateNumber: string;
  notes?: string;
}

export interface RejectLabTestInput {
  analyst: string;
  rejectionDate: string;
  reason: LabRejectionReason | string;
  notes: string;
}

export interface RequestCorrectionLabTestInput {
  analyst: string;
  requestDate: string;
  reason: string;
  notes: string;
}
