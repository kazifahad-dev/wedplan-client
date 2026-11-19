import type { Service } from "@/types";

const API = process.env.NEXT_PUBLIC_API_URL;

// সার্ভার বন্ধ বা এরর হলেও পেজ ভাঙবে না, খালি তালিকা ফেরত দেয়
export async function getFeaturedServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API}/api/services/featured`, {
      cache: "no-store", // সবসময় ডাটাবেসের সর্বশেষ তথ্য
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