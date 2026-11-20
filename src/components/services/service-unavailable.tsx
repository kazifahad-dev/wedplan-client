import Link from "next/link";
import { SearchX, TriangleAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function ServiceUnavailable({
  variant,
}: {
  variant: "not-found" | "error";
}) {
  const notFound = variant === "not-found";
  const Icon = notFound ? SearchX : TriangleAlert;

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <Icon className="mb-4 h-12 w-12 text-primary" />
      <h1 className="font-heading text-3xl text-rose-dark">
        {notFound ? "Service not found" : "Something went wrong"}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {notFound
          ? "This service does not exist, or it is no longer available for booking."
          : "We could not load this service right now. Please try again in a moment."}
      </p>
      <Link href="/services" className={buttonVariants({ className: "mt-6" })}>
        Browse Services
      </Link>
    </div>
  );
}