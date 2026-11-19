import Link from "next/link";
import {
  Building2,
  Camera,
  Flower2,
  Shirt,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "../section-heading";
import { CATEGORIES } from "@/lib/constants";
import { getCategoryCounts } from "@/lib/data";

const ICONS: Record<(typeof CATEGORIES)[number], LucideIcon> = {
  "Photography & Videography": Camera,
  "Wedding Venues": Building2,
  "Decoration & Florist": Flower2,
  "Catering Services": UtensilsCrossed,
  "Makeup & Styling": Sparkles,
  "Wedding Fashion": Shirt,
};

export async function CategoriesSection() {
  const counts = await getCategoryCounts();

  return (
    <section className="bg-secondary/50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          title="Explore by Category"
          subtitle="Everything you need for your big day, in one place"
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((category, i) => {
            const Icon = ICONS[category];
            const count = counts[category] ?? 0;
            return (
              <FadeIn key={category} delay={i * 0.07}>
                <Link
                  href={`/services?category=${encodeURIComponent(category)}`}
                  className="group flex h-full flex-col items-center gap-3 rounded-xl border bg-card p-5 text-center transition hover:-translate-y-1 hover:border-primary hover:shadow-md"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-medium">{category}</span>
                  <span className="text-xs text-muted-foreground">
                    {count} {count === 1 ? "service" : "services"}
                  </span>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}