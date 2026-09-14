import { BaseEntity } from "./common";

export interface AuditLogEntry extends BaseEntity {
  entityType: "batch" | "organization" | "user" | "transfer" | "lab_test" | "bottle";
  entityId: string;
  action: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  metadata: Record<string, unknown>;
  previousStateHash?: string;
  currentStateHash: string;
  immutableTimestamp: string;
}
