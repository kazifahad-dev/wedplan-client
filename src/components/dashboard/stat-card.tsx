import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// value না থাকলে (ডাটা লোড হচ্ছে) স্কেলিটন দেখায়
export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: number | string;
  icon: LucideIcon;
}) {
  return (
    <Card className="py-0">
      <CardContent className="flex items-center gap-4 p-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          {value === undefined ? (
            <Skeleton className="mt-1 h-7 w-16" />
          ) : (
            <p className="font-heading text-2xl font-semibold">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}