import type { Metadata } from "next";
import { ManageServices } from "@/components/dashboard/admin/manage-services";

export const metadata: Metadata = { title: "Manage Services" };

export default async function ManageServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  return <ManageServices initialStatus={status} />;
}