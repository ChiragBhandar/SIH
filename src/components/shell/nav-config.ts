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
  ShoppingBag,
  Building2,
  Users,
  History,
  AlertTriangle,
  KeyRound,
  Wheat,
  Activity,
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
        href: "/dashboard",
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
        href: "/hives",
        icon: Wheat,
        requiredRoles: [
          USER_ROLES.SUPER_ADMIN,
          USER_ROLES.ORG_ADMIN,
          USER_ROLES.BEEKEEPER,
        ],
      },
      {
        id: "activities",
        label: "Colony Activities",
        href: "/activities",
        icon: Activity,
        requiredRoles: [
          USER_ROLES.SUPER_ADMIN,
          USER_ROLES.ORG_ADMIN,
          USER_ROLES.BEEKEEPER,
        ],
      },
      {
        id: "batches",
        label: "Honey Batches",
        href: "/batches",
        icon: Boxes,
        badge: "Active",
        badgeVariant: "honey",
      },
      {
        id: "custody",
        label: "Custody Transfers",
        href: "/custody",
        icon: ArrowLeftRight,
      },
      {
        id: "receiving",
        label: "Receiving",
        href: "/receiving",
        icon: PackageCheck,
      },
      {
        id: "processing",
        label: "Processing & Blending",
        href: "/processing",
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
        href: "/lab",
        icon: FlaskConical,
        requiredRoles: [
          USER_ROLES.SUPER_ADMIN,
          USER_ROLES.ORG_ADMIN,
          USER_ROLES.LAB_TECHNICIAN,
          USER_ROLES.PROCESSOR,
        ],
      },
      {
        id: "certifications",
        label: "Certifications",
        href: "/certifications",
        icon: Award,
      },
    ],
  },
  {
    id: "product",
    label: "Product & Market",
    items: [
      {
        id: "marketplace",
        label: "Marketplace",
        href: "/marketplace",
        icon: Store,
      },
      {
        id: "orders",
        label: "Marketplace Orders",
        href: "/marketplace/orders",
        icon: ShoppingBag,
      },
      {
        id: "bottles",
        label: "Bottles & QR Verification",
        href: "/bottles",
        icon: QrCode,
      },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    items: [
      {
        id: "admin-dashboard",
        label: "Admin Overview",
        href: "/admin",
        icon: LayoutDashboard,
        requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
      },
      {
        id: "organizations",
        label: "Organisations",
        href: "/admin/organisations",
        icon: Building2,
        requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
      },
      {
        id: "users",
        label: "Users & Roles",
        href: "/admin/users",
        icon: Users,
        requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
      },
      {
        id: "audit",
        label: "Audit History",
        href: "/admin/audit",
        icon: History,
        requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
      },
      {
        id: "exceptions",
        label: "Exceptions",
        href: "/admin/exceptions",
        icon: AlertTriangle,
        badge: 4,
        badgeVariant: "warning",
      },
      {
        id: "access-requests",
        label: "Access Requests",
        href: "/admin/access-requests",
        icon: KeyRound,
        badge: "1 New",
        badgeVariant: "secondary",
        requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
      },
      {
        id: "plausibility",
        label: "Field vs Sales Plausibility",
        href: "/admin/plausibility",
        icon: Activity,
        badge: "Review",
        badgeVariant: "honey",
        requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
      },
    ],
  },
];
