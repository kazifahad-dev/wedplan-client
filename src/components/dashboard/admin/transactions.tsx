"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "../page-header";
import { StatusBadge } from "../status-badge";
import { Pagination } from "./pagination";
import { EmptyPanel, ErrorPanel, TableSkeleton } from "./table-states";
import { useApi } from "@/hooks/use-api";
import { formatDate } from "@/lib/format";
import type { AdminTransaction, Paginated } from "@/types";

export function Transactions() {
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useApi<Paginated<AdminTransaction>>(
    `/api/admin/transactions?page=${page}&limit=10`
  );

  const money = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Subscription payments from vendors"
      />

      <div className="mb-4 flex gap-2 rounded-lg bg-secondary p-3 text-sm text-rose-dark">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Payment records are created only by verified Stripe webhook events
          and cannot be edited here.
        </p>
      </div>

      <Card className="gap-0 overflow-hidden py-0">
        {!data && loading && <TableSkeleton />}
        {error && <ErrorPanel message={error} onRetry={reload} />}

        {data && data.items.length === 0 && (
          <EmptyPanel
            title="No transactions yet"
            text="Payments will appear here after vendors upgrade to Premium."
          />
        )}

        {data && data.items.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell>
                      <p className="max-w-[200px] truncate font-medium">
                        {t.vendor?.businessName || t.vendor?.name || "Unknown vendor"}
                      </p>
                      <p className="max-w-[200px] truncate text-xs text-muted-foreground">
                        {t.vendor?.email}
                      </p>
                    </TableCell>
                    <TableCell className="capitalize">{t.plan}</TableCell>
                    <TableCell className="font-medium">
                      {money(t.amount, t.currency)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(t.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              total={data.total}
              onChange={setPage}
            />
          </>
        )}
      </Card>
    </>
  );
}