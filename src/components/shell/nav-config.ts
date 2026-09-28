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
  labelHi?: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeHi?: string | number;
  badgeVariant?: "honey" | "secondary" | "success" | "warning";
  requiredRoles?: UserRole[];
}

export interface NavGroup {
  id: string;
  label: string;
  labelHi?: string;
  items: NavItem[];
}

export const NAVIGATION_CONFIG: NavGroup[] = [
  {
    id: "overview",
    label: "Main",
    labelHi: "मुख्य",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        labelHi: "डैशबोर्ड",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: "traceability",
    label: "Management",
    labelHi: "प्रबंधन",
    items: [
      {
        id: "apiary",
        label: "Hives & Apiaries",
        labelHi: "छत्ते और मधुमक्खी फार्म",
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
        labelHi: "कॉलोनी गतिविधियाँ",
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
        labelHi: "शहद के बैच",
        href: "/batches",
        icon: Boxes,
        badge: "Active",
        badgeHi: "सक्रिय",
        badgeVariant: "honey",
      },
      {
        id: "custody",
        label: "Custody Transfers",
        labelHi: "कस्टडी ट्रांसफर",
        href: "/custody",
        icon: ArrowLeftRight,
      },
      {
        id: "receiving",
        label: "Receiving",
        labelHi: "आवक रसीद",
        href: "/receiving",
        icon: PackageCheck,
      },
      {
        id: "processing",
        label: "Processing & Blending",
        labelHi: "प्रसंस्करण एवं मिश्रण",
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
    labelHi: "गुणवत्ता एवं परीक्षण",
    items: [
      {
        id: "laboratory",
        label: "Laboratory Testing",
        labelHi: "प्रयोगशाला परीक्षण",
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
        labelHi: "गुणवत्ता प्रमाणपत्र",
        href: "/certifications",
        icon: Award,
      },
    ],
  },
  {
    id: "product",
    label: "Product & Market",
    labelHi: "उत्पाद एवं बाज़ार",
    items: [
      {
        id: "marketplace",
        label: "Marketplace",
        labelHi: "बाज़ार (मार्केटप्लेस)",
        href: "/marketplace",
        icon: Store,
      },
      {
        id: "orders",
        label: "Marketplace Orders",
        labelHi: "मार्केटप्लेस ऑर्डर",
        href: "/marketplace/orders",
        icon: ShoppingBag,
      },
      {
        id: "bottles",
        label: "Bottles & QR Verification",
        labelHi: "बोतलें और क्यूआर सत्यापन",
        href: "/bottles",
        icon: QrCode,
      },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    labelHi: "प्रशासन एवं निगरानी",
    items: [
      {
        id: "admin-dashboard",
        label: "Admin Overview",
        labelHi: "प्रशासन अवलोकन",
        href: "/admin",
        icon: LayoutDashboard,
        requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
      },
      {
        id: "organizations",
        label: "Organisations",
        labelHi: "संगठन",
        href: "/admin/organisations",
        icon: Building2,
        requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
      },
      {
        id: "users",
        label: "Users & Roles",
        labelHi: "उपयोगकर्ता एवं भूमिकाएं",
        href: "/admin/users",
        icon: Users,
        requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
      },
      {
        id: "audit",
        label: "Audit History",
        labelHi: "ऑडिट इतिहास",
        href: "/admin/audit",
        icon: History,
        requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
      },
      {
        id: "exceptions",
        label: "Exceptions",
        labelHi: "अपवाद",
        href: "/admin/exceptions",
        icon: AlertTriangle,
        badge: 4,
        badgeHi: 4,
        badgeVariant: "warning",
      },
      {
        id: "access-requests",
        label: "Access Requests",
        labelHi: "एक्सेस अनुरोध",
        href: "/admin/access-requests",
        icon: KeyRound,
        badge: "1 New",
        badgeHi: "1 नया",
        badgeVariant: "secondary",
        requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ORG_ADMIN],
      },
      {
        id: "plausibility",
        label: "Field vs Sales Plausibility",
        labelHi: "उत्पादन बनाम बिक्री विश्लेषण",
        href: "/admin/plausibility",
        icon: Activity,
        badge: "Review",
        badgeHi: "समीक्षा",
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

