import type { Metadata } from "next";
import { ManageUsers } from "@/components/dashboard/admin/manage-users";

export const metadata: Metadata = { title: "Manage Users" };

export default function ManageUsersPage() {
  return <ManageUsers />;
}