"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, PackageOpen } from "lucide-react";
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
import { DetailRow } from "../detail-row";
import { ServiceForm } from "./service-form";
import { useApi } from "@/hooks/use-api";
import { apiFetch } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import type { Service } from "@/types";

export function MyServices() {
  const router = useRouter();
  const { data, error, loading, reload } = useApi<Service[]>("/api/services/mine");

  const [viewing, setViewing] = useState<Service | null>(null);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deletingNow, setDeletingNow] = useState(false);

  function showError(err: unknown, fallback: string) {
    const message = err instanceof Error ? err.message : fallback;
    if (message.includes("Free plan")) {
      toast.error(message, {
        action: {
          label: "Upgrade",
          onClick: () => router.push("/dashboard/vendor/subscription"),
        },
      });
    } else {
      toast.error(message);
    }
  }

  async function toggleAvailability(service: Service) {
    setBusyId(service._id);
    try {
      await apiFetch(`/api/services/${service._id}/availability`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !service.isActive }),
      });
      toast.success(service.isActive ? "Service deactivated" : "Service activated");
      reload();
    } catch (err) {
      showError(err, "Could not update availability");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeletingNow(true);
    try {
      await apiFetch(`/api/services/${deleting._id}`, { method: "DELETE" });
      toast.success("Service deleted");
      setDeleting(null);
      reload();
    } catch (err) {
      showError(err, "Could not delete service");
    } finally {
      setDeletingNow(false);
    }
  }

  return (
    <>
      <PageHeader
        title="My Services"
        description="Manage the services you offer"
        action={
          <Link href="/dashboard/vendor/add-service" className={buttonVariants()}>
            Add Service
          </Link>
        }
      />

      {/* লোডিং */}
      {!data && loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* এরর */}
      {error && (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="font-medium text-destructive">{error}</p>
          <Button className="mt-4" onClick={reload}>
            Try again
          </Button>
        </div>
      )}

      {/* খালি অবস্থা */}
      {data && data.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border border-dashed bg-background p-12 text-center">
          <PackageOpen className="mb-3 h-10 w-10 text-primary" />
          <p className="font-heading text-xl text-rose-dark">No services yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first service to start receiving booking requests.
          </p>
          <Link
            href="/dashboard/vendor/add-service"
            className={buttonVariants({ className: "mt-4" })}
          >
            Add Service
          </Link>
        </div>
      )}

      {/* তালিকা */}
      <div className="space-y-3">
        {data?.map((s) => (
          <Card key={s._id} className="py-0">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
              <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg bg-secondary sm:h-28 sm:w-40">
                {s.images?.[0] && (
                  <Image
                    src={s.images[0]}
                    alt={s.serviceName}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-medium">{s.serviceName}</h3>
                  <StatusBadge status={s.status} />
                  <StatusBadge status={s.isActive ? "active" : "inactive"} />
                </div>

                <p className="flex flex-wrap items-center gap-x-3 text-sm text-muted-foreground">
                  <span>{s.category}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {s.location}
                  </span>
                  <span className="font-medium text-rose-dark">{formatPrice(s.price)}</span>
                </p>

                {s.status === "pending" && (
                  <p className="text-xs text-amber-700">
                    Waiting for admin approval. Not visible to customers yet.
                  </p>
                )}
                {s.status === "rejected" && (
                  <p className="text-xs text-destructive">
                    Rejected by admin. This service is hidden from customers.
                  </p>
                )}

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button size="sm" variant="outline" onClick={() => setViewing(s)}>
                    View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(s)}>
                    Edit
                  </Button>
                  {s.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyId === s._id}
                      onClick={() => toggleAvailability(s)}
                    >
                      {busyId === s._id && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                      {s.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => setDeleting(s)}>
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* বিবরণ ডায়ালগ */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-xl text-rose-dark">
                  {viewing.serviceName}
                </DialogTitle>
                <DialogDescription>Service information</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-2">
                {viewing.images.map((src, i) => (
                  <div key={`${src}-${i}`} className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
                    <Image src={src} alt={`${viewing.serviceName} ${i + 1}`} fill sizes="150px" className="object-cover" />
                  </div>
                ))}
              </div>

              <dl className="space-y-3">
                <DetailRow label="Approval status"><StatusBadge status={viewing.status} /></DetailRow>
                <DetailRow label="Availability">
                  <StatusBadge status={viewing.isActive ? "active" : "inactive"} />
                </DetailRow>
                <DetailRow label="Category">{viewing.category}</DetailRow>
                <DetailRow label="Price">{formatPrice(viewing.price)}</DetailRow>
                <DetailRow label="Location">{viewing.location}</DetailRow>
                <DetailRow label="Created on">{formatDate(viewing.createdAt)}</DetailRow>
              </dl>

              <p className="whitespace-pre-line text-sm text-muted-foreground">
                {viewing.description}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* এডিট ডায়ালগ */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {editing && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-xl text-rose-dark">
                  Edit Service
                </DialogTitle>
                <DialogDescription>Update your service details and images</DialogDescription>
              </DialogHeader>
              <ServiceForm
                key={editing._id}
                initial={editing}
                submitLabel="Save Changes"
                onSuccess={() => {
                  setEditing(null);
                  reload();
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ডিলিট নিশ্চিতকরণ */}
      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this service?</DialogTitle>
            <DialogDescription>
              &quot;{deleting?.serviceName}&quot; will be permanently removed. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleting(null)} disabled={deletingNow}>
              Keep it
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deletingNow}>
              {deletingNow && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Yes, delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}