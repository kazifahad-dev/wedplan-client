"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { formatDate } from "@/lib/format";
import { SELECT_CLASS } from "@/lib/styles";
import type { AdminUser, Paginated } from "@/types";

export function ManageUsers() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const debouncedSearch = useDebounce(search);
  const [page, setPage] = usePage(`${debouncedSearch}|${role}`);

  const [viewing, setViewing] = useState<AdminUser | null>(null);
  const [target, setTarget] = useState<{ user: AdminUser; block: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  // সার্ভারে পাঠানোর কোয়েরি
  const qs = new URLSearchParams({ page: String(page), limit: "10" });
  if (debouncedSearch.trim()) qs.set("search", debouncedSearch.trim());
  if (role) qs.set("role", role);

  const { data, error, loading, reload } = useApi<Paginated<AdminUser>>(
    `/api/admin/users?${qs}`
  );

  async function confirmBlock() {
    if (!target) return;
    setSaving(true);
    try {
      await apiFetch(`/api/admin/users/${target.user._id}/block`, {
        method: "PATCH",
        body: JSON.stringify({ isBlocked: target.block }),
      });
      toast.success(target.block ? "User blocked" : "User unblocked");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update user");
    } finally {
      setSaving(false);
      setTarget(null);
      reload();
    }
  }

  return (
    <>
      <PageHeader
        title="Manage Users"
        description="View registered users and block or unblock accounts"
      />

      {/* সার্চ ও ফিল্টার */}
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-background pl-9"
            aria-label="Search users"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={SELECT_CLASS}
          aria-label="Filter by role"
        >
          <option value="">All roles</option>
          <option value="customer">Customers</option>
          <option value="vendor">Vendors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <Card className="gap-0 overflow-hidden py-0">
        {!data && loading && <TableSkeleton />}
        {error && <ErrorPanel message={error} onRetry={reload} />}

        {data && data.items.length === 0 && (
          <EmptyPanel
            title="No users found"
            text="Try a different search or filter."
          />
        )}

        {data && data.items.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          {u.image && <AvatarImage src={u.image} alt={u.name} />}
                          <AvatarFallback className="bg-secondary text-rose-dark">
                            {u.name[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{u.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={u.isBlocked ? "blocked" : "active"} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {u.createdAt ? formatDate(u.createdAt) : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setViewing(u)}>
                          View
                        </Button>
                        {/* অ্যাডমিন অ্যাকাউন্ট ব্লক করা যায় না (সার্ভারও আটকায়) */}
                        {u.role !== "admin" && (
                          <Button
                            size="sm"
                            variant={u.isBlocked ? "default" : "destructive"}
                            onClick={() => setTarget({ user: u, block: !u.isBlocked })}
                          >
                            {u.isBlocked ? "Unblock" : "Block"}
                          </Button>
                        )}
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

      {/* ইউজারের বিবরণ */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="sm:max-w-md">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-xl text-rose-dark">
                  {viewing.name}
                </DialogTitle>
                <DialogDescription>User details</DialogDescription>
              </DialogHeader>
              <dl className="space-y-3">
                <DetailRow label="Email">{viewing.email}</DetailRow>
                <DetailRow label="Role">
                  <span className="capitalize">{viewing.role}</span>
                </DetailRow>
                <DetailRow label="Status">
                  <StatusBadge status={viewing.isBlocked ? "blocked" : "active"} />
                </DetailRow>
                {viewing.role === "vendor" && (
                  <>
                    <DetailRow label="Business name">
                      {viewing.businessName || "-"}
                    </DetailRow>
                    <DetailRow label="Subscription">
                      <span className="capitalize">
                        {viewing.subscriptionPlan ?? "free"}
                      </span>
                    </DetailRow>
                    {viewing.subscriptionExpiresAt && (
                      <DetailRow label="Premium until">
                        {formatDate(viewing.subscriptionExpiresAt)}
                      </DetailRow>
                    )}
                  </>
                )}
                <DetailRow label="Joined">
                  {viewing.createdAt ? formatDate(viewing.createdAt) : "-"}
                </DetailRow>
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ব্লক/আনব্লক নিশ্চিতকরণ */}
      <Dialog open={!!target} onOpenChange={(o) => !o && !saving && setTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {target?.block ? "Block" : "Unblock"} {target?.user.name}?
            </DialogTitle>
            <DialogDescription>
              {target?.block
                ? "They will lose access to all protected features until you unblock them."
                : "They will be able to use the platform again."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setTarget(null)} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant={target?.block ? "destructive" : "default"}
              onClick={confirmBlock}
              disabled={saving}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {target?.block ? "Yes, block" : "Yes, unblock"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}