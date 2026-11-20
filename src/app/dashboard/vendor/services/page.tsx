import type { Metadata } from "next";
import { MyServices } from "@/components/dashboard/vendor/my-services";

export const metadata: Metadata = { title: "My Services" };

export default function MyServicesPage() {
  return <MyServices />;
}