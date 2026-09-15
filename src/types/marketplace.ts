export type MarketplaceListingStatus =
  | "Draft"
  | "Active"
  | "Reserved"
  | "Sold"
  | "Suspended"
  | "Expired";

export type MarketplaceListingType =
  | "Raw Honey Material"
  | "Processed Honey Product";

export interface MarketplaceListing {
  id: string; // e.g. "LIST-HC-2026-0003"
  title: string;
  listingType: MarketplaceListingType;
  batchId: string; // references internal or formatted ID like "HC-RH-2026-0003"
  batchNumber: string; // authoritative batch number e.g. "HC-RH-2026-0003"
  sellerOrgId: string;
  sellerOrgName: string;
  sellerLocation: string;
  honeyVariety: string;
  originRegion: string;
  harvestDate?: string;
  processingDate?: string;
  availableQuantity: number;
  originalQuantity: number;
  unit: string; // "kg"
  pricePerUnit?: string;
  traceabilityStatus: string; // e.g. "Traceability Available"
  qualityStatus: string; // e.g. "Grade A Organic", "Lab Certified"
  certificateNumber?: string;
  status: MarketplaceListingStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  lineageType: "raw" | "processed";
  apiaryName?: string;
  dominantFlora?: string;
  elevation?: string;
}

export type MarketplaceOrderStatus =
  | "Pending"
  | "Accepted"
  | "Fulfilled"
  | "Cancelled"
  | "Rejected";

export interface OrderStatusHistoryEntry {
  status: MarketplaceOrderStatus;
  timestamp: string;
  actor: string;
  notes?: string;
}

export interface OrderTimelineStep {
  step: string;
  description: string;
  timestamp: string;
  status: "completed" | "current" | "upcoming";
}

export interface MarketplaceOrder {
  id: string; // e.g. "ORD-HC-2026-0001"
  listingId: string;
  batchId: string;
  batchNumber: string;
  productName: string;
  sellerOrgId: string;
  sellerOrgName: string;
  buyerOrgId: string;
  buyerOrgName: string;
  buyerContactName: string;
  buyerReference: string;
  deliveryLocation: string;
  requestedDeliveryDate: string;
  quantity: number;
  unit: string;
  status: MarketplaceOrderStatus;
  orderDate: string;
  notes?: string;
  rejectionReason?: string;
  cancellationReason?: string;
  statusHistory: OrderStatusHistoryEntry[];
  timeline: OrderTimelineStep[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateMarketplaceOrderInput {
  listingId: string;
  quantity: number;
  deliveryLocation: string;
  requestedDeliveryDate: string;
  buyerReference: string;
  notes?: string;
  buyerOrgId?: string;
  buyerOrgName?: string;
  buyerContactName?: string;
}

export interface BatchMarketplaceActivity {
  listingId?: string;
  listingStatus?: MarketplaceListingStatus;
  orderId?: string;
  orderStatus?: MarketplaceOrderStatus;
  quantityKg: number;
  buyerName?: string;
  sellerName?: string;
  orderDate?: string;
}
