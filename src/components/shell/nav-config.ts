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

/**
 * Derives the active navigation item ID from current pathname.
 * Handles exact matches, subpaths, and nested detail routes.
 */
export function getActiveNavId(pathname: string): string {
  if (!pathname || pathname === "/" || pathname === "/dashboard") {
    return "dashboard";
  }

  const cleanPath = pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

  // Flatten all items across all groups
  const allItems = NAVIGATION_CONFIG.flatMap((group) => group.items);

  // Sort by href length descending so longer/more specific paths match first
  // (e.g. /marketplace/orders matches before /marketplace, /admin/organisations before /admin)
  const sortedItems = [...allItems].sort((a, b) => b.href.length - a.href.length);

  for (const item of sortedItems) {
    if (cleanPath === item.href || cleanPath.startsWith(`${item.href}/`)) {
      return item.id;
    }
  }

  // Handle aliases or special routes
  if (cleanPath.startsWith("/verify") || cleanPath.startsWith("/qr-verification")) {
    return "bottles";
  }
  if (cleanPath.startsWith("/laboratory-testing")) {
    return "laboratory";
  }

  return "dashboard";
}

export interface NavBreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

/**
 * Builds default breadcrumbs based on current pathname and nav config.
 */
export function getDefaultBreadcrumbs(pathname: string): NavBreadcrumbItem[] {
  if (!pathname || pathname === "/" || pathname === "/dashboard") {
    return [
      { label: "Honey Chain", href: "/dashboard" },
      { label: "Dashboard", active: true },
    ];
  }

  const activeId = getActiveNavId(pathname);

  // Find the group and item for the activeId
  for (const group of NAVIGATION_CONFIG) {
    const item = group.items.find((i) => i.id === activeId);
    if (item) {
      if (group.id === "overview") {
        return [
          { label: "Honey Chain", href: "/dashboard" },
          { label: item.label, active: true },
        ];
      }
      return [
        { label: "Honey Chain", href: "/dashboard" },
        { label: group.label, href: item.href },
        { label: item.label, active: true },
      ];
    }
  }

  return [
    { label: "Honey Chain", href: "/dashboard" },
    { label: "Dashboard", active: true },
  ];
}

