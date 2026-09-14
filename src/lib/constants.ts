export const APP_NAME = "Honey Chain";
export const APP_DESCRIPTION = "Honey-Material Traceability & Consumer Trust Platform";

export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  ORG_ADMIN: "org_admin",
  BEEKEEPER: "beekeeper",
  PROCESSOR: "processor",
  LAB_TECHNICIAN: "lab_technician",
  LOGISTICS: "logistics",
  CONSUMER: "consumer",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const BATCH_STATUS = {
  HARVESTED: "harvested",
  IN_TRANSIT: "in_transit",
  RECEIVED: "received",
  IN_PROCESSING: "in_processing",
  TESTING: "testing",
  CERTIFIED: "certified",
  REJECTED: "rejected",
  BOTTLED: "bottled",
  DISTRIBUTED: "distributed",
} as const;

export type BatchStatus = (typeof BATCH_STATUS)[keyof typeof BATCH_STATUS];

export const CUSTODY_TRANSFER_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
} as const;

export type CustodyTransferStatus = (typeof CUSTODY_TRANSFER_STATUS)[keyof typeof CUSTODY_TRANSFER_STATUS];

export const LAB_TEST_RESULT = {
  PENDING: "pending",
  PASSED: "passed",
  FAILED: "failed",
} as const;

export type LabTestResult = (typeof LAB_TEST_RESULT)[keyof typeof LAB_TEST_RESULT];
