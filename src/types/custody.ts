export type CustodyStatus =
  | "Draft"
  | "Pending Acceptance"
  | "Accepted"
  | "Rejected"
  | "Cancelled";

export interface CustodyTimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  role?: string;
  orgName?: string;
  status: "completed" | "current" | "upcoming" | "alert";
  badge?: string;
}

export interface CustodyTransfer {
  id: string; // e.g. "TR-2026-0081"
  batchId: string; // e.g. "HC-RH-2026-0003"
  batchNumber: string;
  sourceOrgId: string;
  sourceOrgName: string;
  sourceApiaryId: string;
  sourceApiaryName: string;
  honeyType: string;
  harvestDate: string;
  destinationOrgId: string;
  destinationOrgName: string;
  destinationFacility: string;
  quantityKg: number;
  transferDate: string;
  expectedArrivalDate: string;
  transportRef: string;
  notes?: string;
  status: CustodyStatus;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  receivingRecordId?: string;
  events: CustodyTimelineEvent[];
}

export type ReceivingCondition =
  | "Good"
  | "Minor issue"
  | "Damaged"
  | "Contaminated / Suspect";

export type RejectionReason =
  | "Quantity mismatch"
  | "Packaging damage"
  | "Quality concern"
  | "Incorrect shipment"
  | "Other";

export interface ReceivingRecord {
  id: string; // e.g. "RCV-2026-0042"
  transferId: string;
  batchId: string;
  sourceOrgId: string;
  sourceOrgName: string;
  receivingOrgId: string;
  receivingOrgName: string;
  facilityLocation: string;
  expectedQuantityKg: number;
  receivedQuantityKg: number;
  containerRef: string;
  receivedDate: string;
  condition: ReceivingCondition;
  temperatureCelsius?: number;
  packagingCondition: string;
  notes?: string;
  decision: "Accepted" | "Rejected";
  rejectionReason?: RejectionReason;
  rejectionNotes?: string;
  receivedBy: string;
  createdAt: string;
}

export interface CreateCustodyTransferInput {
  batchId: string;
  destinationOrgId: string;
  destinationFacility: string;
  quantityKg: number;
  transferDate: string;
  expectedArrivalDate: string;
  transportRef: string;
  notes?: string;
  createdBy?: string;
}

export interface AcceptReceivingInput {
  receivedQuantityKg: number;
  containerRef: string;
  receivedDate: string;
  condition: ReceivingCondition;
  temperatureCelsius?: number;
  packagingCondition: string;
  notes?: string;
  receivedBy?: string;
}

export interface RejectReceivingInput {
  rejectionReason: RejectionReason;
  rejectionNotes: string;
  receivedDate: string;
  rejectedBy?: string;
}
