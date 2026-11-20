import type { Category } from "@/lib/constants";

export interface ServiceVendor {
  name?: string;
  businessName?: string;
  image?: string;
  isPremium?: boolean;
}

export interface Service {
  _id: string;
  serviceName: string;
  category: Category;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  vendorId: string;
  vendor?: ServiceVendor;
  createdAt: string;
}

export interface ServicesResponse {
  items: Service[];
  total: number;
  page: number;
  totalPages: number;
}

export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";

export interface CustomerBooking {
  _id: string;
  eventDate: string;
  eventLocation: string;
  message?: string;
  status: BookingStatus;
  createdAt: string;
  service?: {
    _id?: string;
    serviceName?: string;
    price?: number;
    image?: string;
  };
  vendor?: { name?: string; businessName?: string; image?: string };
}


export interface VendorBooking {
  _id: string;
  eventDate: string;
  eventLocation: string;
  message?: string;
  status: BookingStatus;
  createdAt: string;
  service?: { _id?: string; serviceName?: string };
  customer?: { name?: string; email?: string; image?: string };
}


export interface SubscriptionInfo {
  plan: "free" | "premium";
  expiresAt: string | null;
}