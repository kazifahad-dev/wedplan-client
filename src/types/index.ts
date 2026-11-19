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