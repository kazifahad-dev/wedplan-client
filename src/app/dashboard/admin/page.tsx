import type { Metadata } from "next";
import { AdminOverview } from "@/components/dashboard/admin/admin-overview";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default function AdminDashboardPage() {
  return <AdminOverview />;
}