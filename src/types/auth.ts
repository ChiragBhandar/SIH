import { BaseEntity } from "./common";
import { UserRole } from "@/lib/constants";

export interface Organization extends BaseEntity {
  name: string;
  code: string;
  type: "producer" | "processor" | "laboratory" | "distributor" | "regulatory";
  registrationNumber?: string;
  isActive: boolean;
}

export interface User extends BaseEntity {
  email: string;
  fullName: string;
  role: UserRole;
  organizationId?: string;
  organization?: Organization;
  permissions: string[];
  isActive: boolean;
}

export interface AuthSession {
  user: User | null;
  token?: string;
  currentOrganization?: Organization | null;
  isAuthenticated: boolean;
}
