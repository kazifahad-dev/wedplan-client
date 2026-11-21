"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, Loader2, TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import type { PaymentStatus } from "@/types";

type Phase =
  | { name: "checking" }
  | { name: "confirmed"; info: PaymentStatus }
  | { name: "timeout" }
  | { name: "error"; message: string };

const MAX_ATTEMPTS = 10;

export function PaymentSuccess() {
  const sessionId = useSearchParams().get("session_id");
  const [phase, setPhase] = useState<Phase>({ name: "checking" });
  const [round, setRound] = useState(0); 

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;

    
    async function check() {
      try {
        const info = await apiFetch<PaymentStatus>(
          `/api/payments/status?session_id=${encodeURIComponent(sessionId!)}`
        );
        if (cancelled) return;
        if (info.confirmed) {
          setPhase({ name: "confirmed", info });
          return;
        }
      } catch (err) {
        if (!cancelled) {
          setPhase({
            name: "error",
            message: err instanceof Error ? err.message : "Could not verify payment",
          });
        }
        return;
      }

      attempts += 1;
      if (attempts >= MAX_ATTEMPTS) {
        if (!cancelled) setPhase({ name: "timeout" });
        return;
      }
      timer = setTimeout(check, 2000);
    }

    check();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [sessionId, round]);

  if (!sessionId) {
    return (
      <Shell
        icon={<TriangleAlert className="h-12 w-12 text-primary" />}
        title="No payment found"
        text="We could not find a payment session. If you just paid, open the Subscription page to check your plan."
      >
        <Link href="/dashboard/vendor/subscription" className={buttonVariants()}>
          Go to Subscription
        </Link>
      </Shell>
    );
  }

  if (phase.name === "checking") {
    return (
      <Shell
        icon={<Loader2 className="h-12 w-12 animate-spin text-primary" />}
        title="Confirming your payment"
        text="Please wait a moment while we confirm your payment with Stripe."
      />
    );
  }

  if (phase.name === "confirmed") {
    const { info } = phase;
    const amount =
      info.amount !== undefined && info.currency
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: info.currency.toUpperCase(),
          }).format(info.amount)
        : null;

    return (
      <Shell
        icon={<CheckCircle2 className="h-12 w-12 text-emerald-600" />}
        title="Payment successful"
        text={`Your Premium plan is now active${amount ? ` (${amount} paid)` : ""}. You can publish unlimited services.`}
      >
        <Link href="/dashboard/vendor" className={buttonVariants()}>
          Go to Dashboard
        </Link>
        <Link
          href="/dashboard/vendor/subscription"
          className={buttonVariants({ variant: "outline" })}
        >
          View Subscription
        </Link>
      </Shell>
    );
  }

  if (phase.name === "timeout") {
    return (
      <Shell
        icon={<Clock className="h-12 w-12 text-primary" />}
        title="Still confirming"
        text="Your payment is taking longer than usual to confirm. Premium activates automatically once Stripe confirms it. You can check again in a moment."
      >
        <Button
          onClick={() => {
            setPhase({ name: "checking" });
            setRound((r) => r + 1);
          }}
        >
          Check again
        </Button>
        <Link
          href="/dashboard/vendor/subscription"
          className={buttonVariants({ variant: "outline" })}
        >
          View Subscription
        </Link>
      </Shell>
    );
  }

  return (
    <Shell
      icon={<TriangleAlert className="h-12 w-12 text-destructive" />}
      title="Could not verify payment"
      text={phase.message}
    >
      <Link href="/dashboard/vendor/subscription" className={buttonVariants()}>
        Go to Subscription
      </Link>
    </Shell>
  );
}

function Shell({
  icon,
  title,
  text,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-20">
      <Card className="py-0">
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          {icon}
          <h1 className="font-heading text-2xl text-rose-dark">{title}</h1>
          <p className="text-sm text-muted-foreground">{text}</p>
          {children && <div className="mt-3 flex flex-wrap justify-center gap-2">{children}</div>}
        </CardContent>
      </Card>
    </div>
  );
}