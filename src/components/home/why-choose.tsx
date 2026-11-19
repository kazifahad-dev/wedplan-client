import { BadgeDollarSign, CalendarCheck, Lock, ShieldCheck } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "../section-heading";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Reviewed Vendors",
    text: "Every service is reviewed by our admin team before it appears on the platform.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Booking Requests",
    text: "Send a booking request with your date and location, and track its status anytime.",
  },
  {
    icon: BadgeDollarSign,
    title: "Transparent Pricing",
    text: "See prices upfront, then search, filter and sort services to fit your budget.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    text: "Vendor subscriptions are processed securely through Stripe checkout.",
  },
];

export function WhyChoose() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        title="Why Choose WedPlan?"
        subtitle="Planning a wedding is stressful enough. We keep the vendor part simple."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, text }, i) => (
          <FadeIn key={title} delay={i * 0.1}>
            <div className="h-full rounded-xl border bg-card p-6 text-center shadow-sm">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="mb-2 font-heading text-lg font-semibold text-rose-dark">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}