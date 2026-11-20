import type { Metadata } from "next";
import { BookingRequests } from "@/components/dashboard/vendor/booking-requests";

export const metadata: Metadata = { title: "Booking Requests" };

export default function VendorBookingsPage() {
  return <BookingRequests />;
}