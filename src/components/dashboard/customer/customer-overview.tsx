"use client";

import Link from "next/link";
import { CalendarCheck, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "../page-header";
import { StatCard } from "../stat-card";
import { StatusBadge } from "../status-badge";
import { useApi } from "@/hooks/use-api";
import { formatDate } from "@/lib/format";
import type { CustomerBooking } from "@/types";

export function CustomerOverview() {
  const { data, error, reload } = useApi<CustomerBooking[]>("/api/bookings/mine");

  
  const count = (status: string) =>
    data?.filter((b) => b.status === status).length;

  return (
    <>
      <PageHeader
        title="Overview"
        description="A quick look at your booking requests"
        action={
          <Link href="/services" className={buttonVariants()}>
            Browse Services
          </Link>
        }
      />

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
          <Button size="sm" variant="outline" onClick={reload}>
            Try again
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Booking Requests" value={data?.length} icon={CalendarCheck} />
        <StatCard label="Pending Bookings" value={count("pending")} icon={Clock} />
        <StatCard label="Accepted Bookings" value={count("accepted")} icon={CheckCircle2} />
        <StatCard label="Rejected Bookings" value={count("rejected")} icon={XCircle} />
      </div>

      
      {data && data.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-xl text-rose-dark">Recent Requests</h2>
            <Link
              href="/dashboard/customer/bookings"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <Card className="py-0">
            <CardContent className="divide-y p-0">
              {data.slice(0, 3).map((b) => (
                <div
                  key={b._id}
                  className="flex flex-wrap items-center justify-between gap-2 p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {b.service?.serviceName ?? "Service unavailable"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(b.eventDate, true)} · {b.eventLocation}
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}

      {data && data.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed bg-background p-10 text-center">
          <p className="font-heading text-xl text-rose-dark">No booking requests yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Find a wedding service you love and send your first request.
          </p>
        </div>
      )}
    </>
  );
}