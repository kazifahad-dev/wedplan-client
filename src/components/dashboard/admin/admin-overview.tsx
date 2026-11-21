"use client";

import Link from "next/link";
import { Clock, Package, Receipt, Store, UserRound, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageHeader } from "../page-header";
import { StatCard } from "../stat-card";
import { useApi } from "@/hooks/use-api";
import type { AdminStats } from "@/types";

export function AdminOverview() {
  const { data, error, reload } = useApi<AdminStats>("/api/admin/stats");

  return (
    <>
      <PageHeader
        title="Overview"
        description="A summary of everything happening on WedPlan"
      />

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
          <Button size="sm" variant="outline" onClick={reload}>
            Try again
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Registered Users" value={data?.totalUsers} icon={Users} />
        <StatCard label="Total Vendors" value={data?.totalVendors} icon={Store} />
        <StatCard label="Total Customers" value={data?.totalCustomers} icon={UserRound} />
        <StatCard label="Total Services" value={data?.totalServices} icon={Package} />
        <StatCard label="Pending Services" value={data?.pendingServices} icon={Clock} />
        <StatCard label="Total Transactions" value={data?.totalTransactions} icon={Receipt} />
      </div>

      
      {data && data.pendingServices > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-900">
            {data.pendingServices}{" "}
            {data.pendingServices === 1 ? "service is" : "services are"} waiting
            for your review.
          </p>
          <Link
            href="/dashboard/admin/services?status=pending"
            className={buttonVariants({ size: "sm" })}
          >
            Review now
          </Link>
        </div>
      )}
    </>
  );
}