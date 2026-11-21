export function DashboardPlaceholder({ title }: { title: string }) {
  return (
    <div className="rounded-lg border p-8 text-center text-muted-foreground">
      {title}:
    </div>
  );
}