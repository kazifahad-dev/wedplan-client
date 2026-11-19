import { Hero } from "@/components/home/hero";
import { FeaturedServices } from "@/components/home/featured-services";
import { CategoriesSection } from "@/components/home/categories-section";
import { WhyChoose } from "@/components/home/why-choose";
import { HowItWorks } from "@/components/home/how-it-works";
import { VendorCta } from "@/components/home/vendor-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedServices />
      <CategoriesSection />
      <WhyChoose />
      <HowItWorks />
      <VendorCta />
    </>
  );
}