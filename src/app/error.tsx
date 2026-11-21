"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="font-heading text-7xl text-primary">Oops</p>
      <h1 className="font-heading text-2xl text-rose-dark">
        Something went wrong
      </h1>
      <p className="max-w-md text-muted-foreground">
        An unexpected error occurred while loading this page. Please try again,
        or go back to the home page.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <Button onClick={() => retry()}>Try again</Button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}