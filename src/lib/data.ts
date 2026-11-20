import { cache } from "react";
import type { Service } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL;


export async function getFeaturedServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API}/api/services/featured`, {
      cache: "no-store", 
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  try {
    const res = await fetch(`${API}/api/services/categories`, {
      cache: "no-store",
    });
    if (!res.ok) return {};
    const rows: { category: string; count: number }[] = await res.json();
    return Object.fromEntries(rows.map((r) => [r.category, r.count]));
  } catch {
    return {};
  }
}

export type ServiceResult =
  | { status: "ok"; service: Service }
  | { status: "not-found" }
  | { status: "error" };


export const getService = cache(async (id: string): Promise<ServiceResult> => {
  
  if (!/^[0-9a-fA-F]{24}$/.test(id)) return { status: "not-found" };

  try {
    const res = await fetch(`${API}/api/services/${id}`, {
      cache: "no-store",
    });
    if (res.status === 404 || res.status === 400) return { status: "not-found" };
    if (!res.ok) return { status: "error" };
    return { status: "ok", service: await res.json() };
  } catch {
    return { status: "error" };
  }
});