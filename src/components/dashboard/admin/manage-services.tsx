"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "../page-header";
import { DetailRow } from "../detail-row";
import { StatusBadge } from "../status-badge";
import { Pagination } from "./pagination";
import { EmptyPanel, ErrorPanel, TableSkeleton } from "./table-states";
import { useApi } from "@/hooks/use-api";
import { useDebounce } from "@/hooks/use-debounce";
import { usePage } from "@/hooks/use-page";
import { apiFetch } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/format";
import { SELECT_CLASS } from "@/lib/styles";
import type { AdminService, Paginated } from "@/types";

const STATUSES = ["pending", "approved", "rejected"];

export function ManageServices({ initialStatus }: { initialStatus?: string }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(
    initialStatus && STATUSES.includes(initialStatus) ? initialStatus : ""
  );
  const [category, setCategory] = useState("");
  const debouncedSearch = useDebounce(search);
  const [page, setPage] = usePage(`${debouncedSearch}|${status}|${category}`);

  const [viewing, setViewing] = useState<AdminService | null>(null);
  const [deleting, setDeleting] = useState<AdminService | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deletingNow, setDeletingNow] = useState(false);

  const qs = new URLSearchParams({ page: String(page), limit: "10" });
  if (debouncedSearch.trim()) qs.set("search", debouncedSearch.trim());
  if (status) qs.set("status", status);
  if (category) qs.set("category", category);

  const { data, error, loading, reload } = useApi<Paginated<AdminService>>(
    `/api/admin/services?${qs}`
  );

  async function changeStatus(service: AdminService, next: "approved" | "rejected") {
    setBusyId(service._id);
    try {
      await apiFetch(`/api/admin/services/${service._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      });
      toast.success(next === "approved" ? "Service approved" : "Service rejected");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update service");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeletingNow(true);
    try {
      await apiFetch(`/api/admin/services/${deleting._id}`, { method: "DELETE" });
      toast.success("Service deleted");
      setDeleting(null);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete service");
    } finally {
      setDeletingNow(false);
    }
  }

  const vendorLabel = (s: AdminService) =>
    s.vendor?.businessName || s.vendor?.name || "Unknown vendor";

  return (
    <>
      <PageHeader
        title="Manage Services"
        description="Only approved and active services are visible on the public Browse Services page"
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by service name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-background pl-9"
            aria-label="Search services"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={SELECT_CLASS}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={SELECT_CLASS}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <Card className="gap-0 overflow-hidden py-0">
        {!data && loading && <TableSkeleton />}
        {error && <ErrorPanel message={error} onRetry={reload} />}

        {data && data.items.length === 0 && (
          <EmptyPanel
            title="No services found"
            text="Try a different search or filter."
          />
        )}

        {data && data.items.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((s) => (
                  <TableRow key={s._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-secondary">
                          {s.images?.[0] && (
                            <Image
                              src={s.images[0]}
                              alt={s.serviceName}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="max-w-[200px] truncate font-medium">{s.serviceName}</p>
                          <p className="max-w-[200px] truncate text-xs text-muted-foreground">
                            {s.category}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-[160px] truncate">{vendorLabel(s)}</p>
                      <p className="max-w-[160px] truncate text-xs text-muted-foreground">
                        {s.vendor?.email}
                      </p>
                    </TableCell>
                    <TableCell className="font-medium">{formatPrice(s.price)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <StatusBadge status={s.status} />
                        {!s.isActive && <StatusBadge status="inactive" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <Button size="sm" variant="outline" onClick={() => setViewing(s)}>
                          View
                        </Button>
                        {s.status !== "approved" && (
                          <Button
                            size="sm"
                            disabled={busyId === s._id}
                            onClick={() => changeStatus(s, "approved")}
                          >
                            {busyId === s._id && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
                            Approve
                          </Button>
                        )}
                        {s.status !== "rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busyId === s._id}
                            onClick={() => changeStatus(s, "rejected")}
                          >
                            Reject
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => setDeleting(s)}>
                          Delete
                        </Button>
                      </div>
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

     
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-xl text-rose-dark">
                  {viewing.serviceName}
                </DialogTitle>
                <DialogDescription>Review this service before approving</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-2">
                {viewing.images.map((src, i) => (
                  <div key={`${src}-${i}`} className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
                    <Image src={src} alt={`${viewing.serviceName} ${i + 1}`} fill sizes="150px" className="object-cover" />
                  </div>
                ))}
              </div>

              <dl className="space-y-3">
                <DetailRow label="Status"><StatusBadge status={viewing.status} /></DetailRow>
                <DetailRow label="Availability">
                  <StatusBadge status={viewing.isActive ? "active" : "inactive"} />
                </DetailRow>
                <DetailRow label="Category">{viewing.category}</DetailRow>
                <DetailRow label="Price">{formatPrice(viewing.price)}</DetailRow>
                <DetailRow label="Location">{viewing.location}</DetailRow>
                <DetailRow label="Vendor">{vendorLabel(viewing)}</DetailRow>
                <DetailRow label="Vendor email">{viewing.vendor?.email ?? "-"}</DetailRow>
                <DetailRow label="Created on">{formatDate(viewing.createdAt)}</DetailRow>
              </dl>

              <p className="whitespace-pre-line text-sm text-muted-foreground">
                {viewing.description}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>

      
      <Dialog open={!!deleting} onOpenChange={(o) => !o && !deletingNow && setDeleting(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this service?</DialogTitle>
            <DialogDescription>
              &quot;{deleting?.serviceName}&quot; will be permanently removed. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleting(null)} disabled={deletingNow}>
              Cancel
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