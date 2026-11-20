import type { Metadata } from "next";
import { MyBookings } from "@/components/dashboard/customer/my-bookings";

export const metadata: Metadata = { title: "My Bookings" };

export default function MyBookingsPage() {
  return <MyBookings />;
}