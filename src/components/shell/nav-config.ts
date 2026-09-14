import {
  LayoutDashboard,
  Boxes,
  Layers,
  ArrowLeftRight,
  PackageCheck,
  FlaskConical,
  Award,
  QrCode,
  Store,
  Building2,
  Users,
  History,
  AlertTriangle,
  KeyRound,
  Wheat,
  LucideIcon,
} from "lucide-react";
import { USER_ROLES, UserRole } from "@/lib/constants";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeVariant?: "honey" | "secondary" | "success" | "warning";
  requiredRoles?: UserRole[];
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export const NAVIGATION_CONFIG: NavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "#dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: "traceability",
    label: "Traceability",
    items: [
      {
        id: "apiary",
        label: "Hives & Apiaries",
        href: "#apiary",
        icon: Wheat,
        requiredRoles: [
          USER_ROLES.SUPER_ADMIN,
          USER_ROLES.ORG_ADMIN,
          USER_ROLES.BEEKEEPER,
        ],
      },
      {
        id: "batches",
        label: "Honey Batches",
        href: "#batches",
        icon: Boxes,
        badge: "Active",
        badgeVariant: "honey",
      },
      {
        id: "custody",
        label: "Custody Transfers",
        href: "#custody",
        icon: ArrowLeftRight,
      },
      {
        id: "receiving",
        label: "Receiving",
        href: "#receiving",
        icon: PackageCheck,
      },
      {
        id: "processing",
        label: "Processing & Blending",
        href: "#processing",
        icon: Layers,
        requiredRoles: [
          USER_ROLES.SUPER_ADMIN,
          USER_ROLES.ORG_ADMIN,
          USER_ROLES.PROCESSOR,
        ],
      },
    ],
  },
  {
    id: "quality",
    label: "Quality & Testing",
    items: [
      {
        id: "laboratory",
        label: "Laboratory Testing",
        href: "#laboratory",
        icon: FlaskConical,
        requiredRoles: [
          USER_ROLES.SUPER_ADMIN,
          USER_ROLES.ORG_ADMIN,
          USER_ROLES.LAB_TECHNICIAN,
        ],
      },
      {
        id: "certifications",
        label: "Certifications",
        href: "#certifications",
        icon: Award,
      },
    ],
  },
  {
    id: "product",
    label: "Product & Market",
    items: [
      {
        id: "bottles",
        label: "Bottles & QR Verification",
        href: "#bottles",
        icon: QrCode,
      },
      {
        id: "marketplace",
        label: "Marketplace Orders",
        href: "#marketplace",
        icon: Store,
      },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    items: [
      {
        id: "organizations",
        label: "Organisations",
        href: "#organizations",
        icon: Building2,
        requiredRoles: [USER_ROLES.SUPER_ADMIN],
      },
      {
        id: "users",
        label: "Users & Roles",
        href: "#users",
        icon: Users,
        requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
      },
      {
        id: "audit",
        label: "Audit Log (Append-only)",
        href: "#audit",
        icon: History,
        requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
      },
      {
        id: "exceptions",
        label: "Exceptions",
        href: "#exceptions",
        icon: AlertTriangle,
        badge: 3,
        badgeVariant: "warning",
      },
      {
        id: "access-requests",
        label: "Access Requests",
        href: "#access-requests",
        icon: KeyRound,
        requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
      },
    ],
  },
];
