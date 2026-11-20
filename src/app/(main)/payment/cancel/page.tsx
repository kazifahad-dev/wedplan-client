import Link from "next/link";
import type { Metadata } from "next";
import { XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Payment Cancelled" };

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20">
      <Card className="py-0">
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <XCircle className="h-12 w-12 text-muted-foreground" />
          <h1 className="font-heading text-2xl text-rose-dark">Payment cancelled</h1>
          <p className="text-sm text-muted-foreground">
            No payment was made and your plan has not changed. You can upgrade
            to Premium whenever you are ready.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Link href="/dashboard/vendor/subscription" className={buttonVariants()}>
              Try again
            </Link>
            <Link
              href="/dashboard/vendor"
              className={buttonVariants({ variant: "outline" })}
            >
              Back to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}