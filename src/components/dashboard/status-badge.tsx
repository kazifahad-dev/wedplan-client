import { Badge } from "@/components/ui/badge";

const STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-emerald-100 text-emerald-800",
  approved: "bg-emerald-100 text-emerald-800",
  active: "bg-emerald-100 text-emerald-800",
  paid: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-gray-200 text-gray-700",
  inactive: "bg-gray-200 text-gray-700",
  blocked: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="secondary" className={`capitalize ${STYLES[status] ?? ""}`}>
      {status}
    </Badge>
  );
}