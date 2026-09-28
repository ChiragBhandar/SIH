import { Organization, ActiveRole, User } from "@/types/auth";
import { USER_ROLES } from "@/lib/constants";

export const MOCK_ORGANISATIONS: Organization[] = [
  {
    id: "org-hac-01",
    name: "Highland Apiaries Cooperative",
    code: "HAC",
    type: "producer",
    displayType: "Beekeeper Cooperative",
    shortIdentifier: "ORG-HAC-01",
    membershipInfo: "Active Member • Beekeeper & Org Admin",
    availableRoleIds: ["beekeeper", "org_admin"],
    registrationNumber: "REG-COOP-2024-883",
    isActive: true,
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2026-03-01T12:00:00Z",
  },
  {
    id: "org-ghf-02",
    name: "Golden Hive Foods",
    code: "GHF",
    type: "processor",
    displayType: "Manufacturer",
    shortIdentifier: "ORG-GHF-02",
    membershipInfo: "Enterprise Partner • Manufacturer & Buyer",
    availableRoleIds: ["manufacturer", "buyer", "org_admin"],
    registrationNumber: "REG-MFG-2023-412",
    isActive: true,
    createdAt: "2023-06-10T10:00:00Z",
    updatedAt: "2026-02-28T14:30:00Z",
  },
  {
    id: "org-ptl-03",
    name: "PureTrace Labs",
    code: "PTL",
    type: "laboratory",
    displayType: "Laboratory",
    shortIdentifier: "ORG-PTL-03",
    membershipInfo: "Accredited Lab • Lab Admin",
    availableRoleIds: ["lab_admin", "org_admin"],
    registrationNumber: "REG-LAB-ISO17025-99",
    isActive: true,
    createdAt: "2023-09-20T11:15:00Z",
    updatedAt: "2026-03-10T09:45:00Z",
  },
];

export const MOCK_ROLES: ActiveRole[] = [
  {
    id: "beekeeper",
    name: "Beekeeper",
    description: "Log hives, floral origins, and harvest batches.",
    capabilities: [
      "Register hives & apiaries",
      "Log raw honey harvest",
      "Tag floral & GPS origins",
    ],
    iconName: "wheat",
    systemRole: USER_ROLES.BEEKEEPER,
  },
  {
    id: "manufacturer",
    name: "Manufacturer",
    description: "Process, blend, and package honey into retail jars.",
    capabilities: [
      "Accept raw batches",
      "Manage processing & blending",
      "Bottle & link QR codes",
    ],
    iconName: "factory",
    systemRole: USER_ROLES.PROCESSOR,
  },
  {
    id: "buyer",
    name: "Buyer",
    description: "Buy bulk honey and verify shipment transfers.",
    capabilities: [
      "Browse verified batches",
      "Verify purity & lab tests",
      "Confirm custody transfer",
    ],
    iconName: "shopping-bag",
    systemRole: USER_ROLES.LOGISTICS,
  },
  {
    id: "consumer",
    name: "Consumer",
    description: "Verify honey authenticity and view test certificates.",
    capabilities: [
      "Scan jar QR codes",
      "Track farm-to-jar journey",
      "View purity lab tests",
    ],
    iconName: "user",
    systemRole: USER_ROLES.CONSUMER,
  },
  {
    id: "lab_admin",
    name: "Lab Admin",
    description: "Test samples, verify purity scores, and sign certificates.",
    capabilities: [
      "Log honey samples",
      "Run purity & NMR tests",
      "Issue signed certificates",
    ],
    iconName: "flask",
    systemRole: USER_ROLES.LAB_TECHNICIAN,
  },
  {
    id: "org_admin",
    name: "Organisation Admin",
    description: "Manage team members, permissions, and organization settings.",
    capabilities: [
      "Manage team access",
      "Org keys & profiles",
      "Review audit logs",
    ],
    iconName: "shield",
    systemRole: USER_ROLES.ORG_ADMIN,
  },
];

export const MOCK_USER: User = {
  id: "usr-demo-001",
  email: "operator@honeychain.io",
  fullName: "Chirag Operator",
  role: USER_ROLES.SUPER_ADMIN,
  permissions: ["*"],
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2026-03-14T00:00:00Z",
};
