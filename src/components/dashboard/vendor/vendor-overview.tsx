"use client";

import Link from "next/link";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Crown,
  Package,
  PlusCircle,
} from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "../page-header";
import { StatCard } from "../stat-card";
import { StatusBadge } from "../status-badge";
import { useApi } from "@/hooks/use-api";
import { formatDate } from "@/lib/format";
import { FREE_SERVICE_LIMIT } from "@/lib/constants";
import type { Service, SubscriptionInfo, VendorBooking } from "@/types";

export function VendorOverview() {
  const services = useApi<Service[]>("/api/services/mine");
  const bookings = useApi<VendorBooking[]>("/api/bookings/vendor");
  const subscription = useApi<SubscriptionInfo>("/api/payments/my-subscription");

  const list = services.data;
  const total = list?.length;
  // "Active" মানে approved এবং চালু
  const active = list?.filter((s) => s.status === "approved" && s.isActive).length;
  // ফ্রি প্ল্যানের সীমায় যা গোনা হয় (rejected বাদে চালু সব)
  const usedSlots =
    list?.filter((s) => s.isActive && s.status !== "rejected").length ?? 0;

  const pending = bookings.data?.filter((b) => b.status === "pending");
  const accepted = bookings.data?.filter((b) => b.status === "accepted").length;

  const plan = subscription.data?.plan;
  const error = services.error || bookings.error || subscription.error;

  function reloadAll() {
    services.reload();
    bookings.reload();
    subscription.reload();
  }

  return (
    <>
      <PageHeader
        title="Overview"
        description="A summary of your services and booking requests"
        action={
          <Link href="/dashboard/vendor/add-service" className={buttonVariants()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Service
          </Link>
        }
      />

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
          <Button size="sm" variant="outline" onClick={reloadAll}>
            Try again
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Services" value={total} icon={Package} />
        <StatCard label="Active Services" value={active} icon={CheckCircle2} />
        <StatCard label="Pending Booking Requests" value={pending?.length} icon={Clock} />
        <StatCard label="Accepted Bookings" value={accepted} icon={CalendarCheck} />
        <StatCard
          label="Current Subscription Plan"
          value={plan ? (plan === "premium" ? "Premium" : "Free") : undefined}
          icon={Crown}
        />
      </div>

      {/* প্ল্যান ব্যবহার */}
      {plan && list && (
        <Card className="mt-6 py-0">
          <CardContent className="space-y-3 p-5">
            {plan === "free" ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Active service slots (Free plan)</span>
                  <span className="text-muted-foreground">
                    {usedSlots} of {FREE_SERVICE_LIMIT} used
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{
                      width: `${Math.min((usedSlots / FREE_SERVICE_LIMIT) * 100, 100)}%`,
                    }}
                  />
                </div>
                <Link
                  href="/dashboard/vendor/subscription"
                  className="inline-block text-sm text-primary hover:underline"
                >
                  Upgrade to Premium for unlimited services
                </Link>
              </>
            ) : (
              <p className="text-sm">
                <span className="font-medium text-gold">Premium vendor</span>
                {subscription.data?.expiresAt &&
                  ` · active until ${formatDate(subscription.data.expiresAt)}`}
                . You can publish unlimited services.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* অপেক্ষমাণ বুকিং রিকোয়েস্ট */}
      {pending && pending.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-xl text-rose-dark">Pending Requests</h2>
            <Link
              href="/dashboard/vendor/bookings"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <Card className="py-0">
            <CardContent className="divide-y p-0">
              {pending.slice(0, 3).map((b) => (
                <div
                  key={b._id}
                  className="flex flex-wrap items-center justify-between gap-2 p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {b.customer?.name ?? "Customer"} · {b.service?.serviceName ?? "Service"}
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
    </>
  );
}