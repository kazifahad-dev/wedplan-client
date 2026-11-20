import type { Metadata } from "next";
import { Transactions } from "@/components/dashboard/admin/transactions";

export const metadata: Metadata = { title: "Transactions" };

export default function TransactionsPage() {
  return <Transactions />;
}