"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarX2, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "../page-header";
import { StatusBadge } from "../status-badge";
import { useApi } from "@/hooks/use-api";
import { apiFetch } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import type { CustomerBooking } from "@/types";

const FILTERS = ["all", "pending", "accepted", "rejected", "cancelled"] as const;

export function MyBookings() {
  const { data, error, loading, reload } =
    useApi<CustomerBooking[]>("/api/bookings/mine");

  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [selected, setSelected] = useState<CustomerBooking | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const visible =
    data?.filter((b) => filter === "all" || b.status === filter) ?? [];

  function closeDialog() {
    setSelected(null);
    setConfirming(false);
  }

  async function handleCancel(id: string) {
    setCancelling(true);
    try {
      await apiFetch(`/api/bookings/${id}/cancel`, { method: "PATCH" });
      toast.success("Booking request cancelled");
      closeDialog();
      reload(); 
    } catch (err) {
      
      toast.error(err instanceof Error ? err.message : "Could not cancel booking");
      reload();
    } finally {
      setCancelling(false);
    }
  }

  return (
    <>
      <PageHeader
        title="My Bookings"
        description="Track the status of your booking requests"
      />

      
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

     
      {!data && loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      )}

      
      {error && (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="font-medium text-destructive">{error}</p>
          <Button className="mt-4" onClick={reload}>
            Try again
          </Button>
        </div>
      )}

      
      {data && visible.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border border-dashed bg-background p-12 text-center">
          <CalendarX2 className="mb-3 h-10 w-10 text-primary" />
          <p className="font-heading text-xl text-rose-dark">
            {data.length === 0 ? "No bookings yet" : `No ${filter} bookings`}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.length === 0
              ? "Browse services and send your first booking request."
              : "Try a different filter."}
          </p>
          {data.length === 0 && (
            <Link href="/services" className={buttonVariants({ className: "mt-4" })}>
              Browse Services
            </Link>
          )}
        </div>
      )}

      
      <div className="space-y-3">
        {visible.map((b) => (
          <Card key={b._id} className="py-0">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-secondary sm:h-20 sm:w-28">
                {b.service?.image && (
                  <Image
                    src={b.service.image}
                    alt={b.service.serviceName ?? "Service"}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-medium">
                    {b.service?.serviceName ?? "Service unavailable"}
                  </h3>
                  <StatusBadge status={b.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  by {b.vendor?.businessName || b.vendor?.name || "Vendor"}
                </p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {formatDate(b.eventDate, true)} · {b.eventLocation}
                </p>
                <p className="text-xs text-muted-foreground">
                  Requested on {formatDate(b.createdAt)}
                </p>
              </div>

              <Button variant="outline" onClick={() => setSelected(b)}>
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      
      <Dialog open={!!selected} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-xl text-rose-dark">
                  {selected.service?.serviceName ?? "Service unavailable"}
                </DialogTitle>
                <DialogDescription>Booking request details</DialogDescription>
              </DialogHeader>

              <dl className="space-y-3 text-sm">
                <Row label="Status">
                  <StatusBadge status={selected.status} />
                </Row>
                <Row label="Vendor">
                  {selected.vendor?.businessName || selected.vendor?.name || "Vendor"}
                </Row>
                {selected.service?.price !== undefined && (
                  <Row label="Service price">{formatPrice(selected.service.price)}</Row>
                )}
                <Row label="Event date">{formatDate(selected.eventDate, true)}</Row>
                <Row label="Event location">{selected.eventLocation}</Row>
                <Row label="Requested on">{formatDate(selected.createdAt)}</Row>
                <Row label="Your message">
                  {selected.message || "No message"}
                </Row>
              </dl>

              <div className="flex flex-wrap justify-end gap-2 pt-2">
                {selected.service?._id && (
                  <Link
                    href={`/services/${selected.service._id}`}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    View Service
                  </Link>
                )}

                
                {selected.status === "pending" && !confirming && (
                  <Button variant="destructive" onClick={() => setConfirming(true)}>
                    Cancel Request
                  </Button>
                )}
              </div>

              {confirming && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <p className="text-sm">
                    Are you sure you want to cancel this booking request?
                  </p>
                  <div className="mt-3 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirming(false)}
                      disabled={cancelling}
                    >
                      Keep it
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancel(selected._id)}
                      disabled={cancelling}
                    >
                      {cancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Yes, cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}