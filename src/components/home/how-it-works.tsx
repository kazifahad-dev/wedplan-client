import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "../section-heading";

const STEPS = [
  {
    title: "Discover",
    text: "Browse services by category and location, then compare prices and details.",
  },
  {
    title: "Request",
    text: "Pick your event date and send a booking request to your favourite vendor.",
  },
  {
    title: "Celebrate",
    text: "Once the vendor accepts, you are all set. Enjoy your special day.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-secondary/50 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          title="How WedPlan Works"
          subtitle="Three simple steps from idea to booking"
        />

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.15}>
              <div className="text-center">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary font-heading text-2xl text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mb-2 font-heading text-xl font-semibold text-rose-dark">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}