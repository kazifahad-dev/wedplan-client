import { Suspense } from "react";
import type { Metadata } from "next";
import { ServicesBrowser } from "@/components/services/services-browser";
import { ServiceGridSkeleton } from "@/components/services/service-card-skeleton";

export const metadata: Metadata = { title: "Browse Services" };

export default function ServicesPage() {
  return (
    <>
      <section className="bg-linear-to-br from-secondary via-background to-accent px-4 py-12 text-center">
        <h1 className="font-heading text-4xl font-semibold text-rose-dark sm:text-5xl">
          Browse Wedding Services
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Search and compare photographers, venues, decorators, caterers and
          more from our approved vendors.
        </p>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* useSearchParams ব্যবহার করায় Suspense দিতে হয় */}
        <Suspense fallback={<ServiceGridSkeleton />}>
          <ServicesBrowser />
        </Suspense>
      </div>
    </>
  );
}