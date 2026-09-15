import { BaseEntity } from "./common";
import { UserRole } from "@/lib/constants";

export interface Organization extends BaseEntity {
  name: string;
  code: string;
  type: "producer" | "processor" | "laboratory" | "distributor" | "regulatory";
  displayType: string;
  shortIdentifier: string;
  membershipInfo: string;
  availableRoleIds: string[];
  registrationNumber?: string;
  isActive: boolean;
}

export interface ActiveRole {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  iconName: "wheat" | "factory" | "shopping-bag" | "user" | "flask" | "shield";
  systemRole: UserRole;
}

export interface User extends BaseEntity {
  email: string;
  fullName: string;
  role: UserRole;
  organizationId?: string;
  organization?: Organization;
  permissions: string[];
  isActive: boolean;
  avatarUrl?: string;
}

export interface AuthSession {
  user: User | null;
  selectedOrg: Organization | null;
  selectedRole: ActiveRole | null;
  isAuthenticated: boolean;
  hasSelectedOrg: boolean;
  hasSelectedRole: boolean;
}

