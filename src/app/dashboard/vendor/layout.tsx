import { requireRole } from "@/lib/guards";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("vendor");
  return <DashboardShell role="vendor">{children}</DashboardShell>;
}