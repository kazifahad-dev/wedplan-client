import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="font-heading text-7xl text-primary">404</p>
      <h1 className="font-heading text-2xl text-rose-dark">Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link href="/" className={buttonVariants({ className: "mt-2" })}>
        Back to Home
      </Link>
    </div>
  );
}