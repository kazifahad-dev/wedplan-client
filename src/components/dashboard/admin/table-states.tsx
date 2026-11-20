import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function ErrorPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="p-10 text-center">
      <p className="font-medium text-destructive">{message}</p>
      <Button className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

export function EmptyPanel({ title, text }: { title: string; text: string }) {
  return (
    <div className="p-12 text-center">
      <p className="font-heading text-xl text-rose-dark">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}