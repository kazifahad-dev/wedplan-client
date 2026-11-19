import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";

export function VendorCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <FadeIn>
        <div className="rounded-2xl bg-rose-dark px-6 py-12 text-center text-white sm:px-12">
          <h2 className="font-heading text-3xl font-semibold sm:text-4xl">
            Are you a wedding vendor?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Create your profile, publish your services and receive booking
            requests from couples. Start free and upgrade to Premium anytime.
          </p>
          <Link
            href="/sign-up"
            className={buttonVariants({
              size: "lg",
              className: "mt-6 bg-gold text-white hover:bg-gold/90",
            })}
          >
            Become a Vendor
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}