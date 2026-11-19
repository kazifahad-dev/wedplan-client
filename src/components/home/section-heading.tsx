export function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <h2 className="font-heading text-3xl font-semibold text-rose-dark sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold" />
    </div>
  );
}