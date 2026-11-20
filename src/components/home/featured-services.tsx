import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { ServiceCard } from "@/components/services/service-card";
import { SectionHeading } from "./section-heading";
import { getFeaturedServices } from "@/lib/data";

export async function FeaturedServices() {
  const services = await getFeaturedServices();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        title="Featured Wedding Services"
        subtitle="Handpicked services from our approved vendors"
      />

      {services.length === 0 ? (
        // খালি অবস্থা (বা সার্ভার ডাউন)
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          No services are available right now. Please check back soon.
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <FadeIn key={service._id} delay={(i % 3) * 0.1}>
                <ServiceCard service={service} />
              </FadeIn>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              View All Services
            </Link>
          </div>
        </>
      )}
    </section>
  );
}