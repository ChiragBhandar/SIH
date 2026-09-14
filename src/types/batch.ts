import { BaseEntity } from "./common";
import { BatchStatus, LabTestResult, CustodyTransferStatus } from "@/lib/constants";

export interface ApiaryLocation {
  latitude: number;
  longitude: number;
  region: string;
  floraType: string[];
}

export interface HoneyBatch extends BaseEntity {
  batchNumber: string;
  status: BatchStatus;
  beekeeperId: string;
  beekeeperName: string;
  apiaryLocation: ApiaryLocation;
  harvestDate: string;
  honeyType: string;
  weightKg: number;
  moisturePercentage?: number;
  qrCodeUrl?: string;
  blockchainHash?: string;
}

export interface CustodyTransferRecord extends BaseEntity {
  batchId: string;
  fromOrgId: string;
  fromOrgName: string;
  toOrgId: string;
  toOrgName: string;
  status: CustodyTransferStatus;
  timestamp: string;
  transferWeightKg: number;
  verifiedBy?: string;
  signature?: string;
}

export interface LabCertificate extends BaseEntity {
  batchId: string;
  laboratoryId: string;
  laboratoryName: string;
  certificateNumber: string;
  result: LabTestResult;
  purityScore: number;
  pollenAnalysis: string;
  hashingRecord: string;
  issuedAt: string;
}
