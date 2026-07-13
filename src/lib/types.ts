export type ListingStatus =
  | "pending_review"
  | "under_inspection"
  | "approved"
  | "rejected"
  | "listed"
  | "sold";

export type TicketStatus = "open" | "in_progress" | "waiting_customer" | "resolved";

export interface PricingBreakdown {
  basePrice: number;
  refurbishment: number;
  repair: number;
  transportation: number;
  inspection: number;
  documentation: number;
  commission: number;
  margin: number;
  finalPrice: number;
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  registrationYear: number;
  fuelType: string;
  transmission: string;
  kmDriven: number;
  ownership: string;
  registrationState: string;
  registrationCity: string;
  vin: string;
  insuranceStatus: string;
  roadTaxStatus: string;
  serviceHistory: string;
  accidentHistory: string;
  keys: number;
  exteriorCondition: string;
  interiorCondition: string;
  engineCondition: string;
  tireCondition: string;
  batteryCondition: string;
  defects: string;
  modifications: string;
  description: string;
  expectedPrice: number;
  address: string;
  preferredContactTime: string;
  bodyType: string;
  images: string[];
  status: ListingStatus;
  pricing?: PricingBreakdown;
  createdAt: number;
  views?: number;
  featured?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin" | "agent";
}

export interface Ticket {
  id: string;
  userId?: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  status: TicketStatus;
  createdAt: number;
}

export interface Offer {
  id: string;
  listingId: string;
  buyerName: string;
  amount: number;
  message: string;
  createdAt: number;
}
