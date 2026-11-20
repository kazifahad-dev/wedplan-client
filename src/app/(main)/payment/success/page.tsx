import { Suspense } from "react";
import type { Metadata } from "next";
import { PaymentSuccess } from "@/components/payment/payment-success";

export const metadata: Metadata = { title: "Payment Successful" };

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccess />
    </Suspense>
  );
}