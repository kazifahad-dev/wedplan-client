"use client";

import { useState } from "react";
import { CalendarDays, Inbox, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { formatDate } from "@/lib/format";
import type { VendorBooking } from "@/types";

const FILTERS = ["all", "pending", "accepted", "rejected", "cancelled"] as const;

type Decision = { booking: VendorBooking; action: "accepted" | "rejected" };

export function BookingRequests() {
  const { data, error, loading, reload } =
    useApi<VendorBooking[]>("/api/bookings/vendor");

  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [decision, setDecision] = useState<Decision | null>(null);
  const [saving, setSaving] = useState(false);

  const visible =
    data?.filter((b) => filter === "all" || b.status === filter) ?? [];

  const countOf = (f: (typeof FILTERS)[number]) =>
    f === "all" ? data?.length : data?.filter((b) => b.status === f).length;

  async function confirmDecision() {
    if (!decision) return;
    setSaving(true);
    try {
      await apiFetch(`/api/bookings/${decision.booking._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: decision.action }),
      });
      toast.success(
        decision.action === "accepted" ? "Booking accepted" : "Booking rejected"
      );
    } catch (err) {
      
      toast.error(err instanceof Error ? err.message : "Could not update booking");
    } finally {
      setSaving(false);
      setDecision(null);
      reload(); 
    }
  }

  return (
    <>
      <PageHeader
        title="Booking Requests"
        description="Review requests from customers for your services"
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
            {data && <span className="ml-1 opacity-70">({countOf(f)})</span>}
          </Button>
        ))}
      </div>

      {!data && loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
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
          <Inbox className="mb-3 h-10 w-10 text-primary" />
          <p className="font-heading text-xl text-rose-dark">
            {data.length === 0 ? "No booking requests yet" : `No ${filter} requests`}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.length === 0
              ? "Requests from customers will appear here."
              : "Try a different filter."}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {visible.map((b) => (
          <Card key={b._id} className="py-0">
            <CardContent className="space-y-4 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {b.customer?.image && (
                      <AvatarImage src={b.customer.image} alt={b.customer.name ?? ""} />
                    )}
                    <AvatarFallback className="bg-secondary text-rose-dark">
                      {b.customer?.name?.[0]?.toUpperCase() ?? "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {b.customer?.name ?? "Customer"}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {b.customer?.email}
                    </p>
                  </div>
                </div>
                <StatusBadge status={b.status} />
              </div>

              
              <div className="grid gap-2 text-sm sm:grid-cols-3">
                <p>
                  <span className="block text-xs text-muted-foreground">Service</span>
                  <span className="font-medium">
                    {b.service?.serviceName ?? "Service unavailable"}
                  </span>
                </p>
                <p>
                  <span className="block text-xs text-muted-foreground">Event date</span>
                  <span className="flex items-center gap-1 font-medium">
                    <CalendarDays className="h-3.5 w-3.5 text-primary" />
                    {formatDate(b.eventDate, true)}
                  </span>
                </p>
                <p>
                  <span className="block text-xs text-muted-foreground">Event location</span>
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {b.eventLocation}
                  </span>
                </p>
              </div>

            
              <div className="rounded-lg bg-secondary/60 p-3 text-sm">
                <span className="block text-xs text-muted-foreground">
                  Customer message
                </span>
                {b.message || (
                  <span className="text-muted-foreground">No message</span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Requested on {formatDate(b.createdAt)}
                </p>

                
                {b.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDecision({ booking: b, action: "rejected" })}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setDecision({ booking: b, action: "accepted" })}
                    >
                      Accept
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

     
      <Dialog open={!!decision} onOpenChange={(o) => !o && !saving && setDecision(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {decision?.action === "accepted" ? "Accept" : "Reject"} this request?
            </DialogTitle>
            <DialogDescription>
              {decision?.booking.customer?.name ?? "The customer"} requested{" "}
              {decision?.booking.service?.serviceName ?? "your service"} for{" "}
              {decision && formatDate(decision.booking.eventDate, true)}. Once you
              decide, it cannot be changed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDecision(null)} disabled={saving}>
              Go back
            </Button>
            <Button
              variant={decision?.action === "rejected" ? "destructive" : "default"}
              onClick={confirmDecision}
              disabled={saving}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, {decision?.action === "accepted" ? "accept" : "reject"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}