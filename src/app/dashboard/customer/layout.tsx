import { requireRole } from "@/lib/guards";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("customer");
  return <DashboardShell role="customer">{children}</DashboardShell>;
}