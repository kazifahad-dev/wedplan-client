"use client";

import { useState } from "react";
import { Check, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "../page-header";
import { useApi } from "@/hooks/use-api";
import { apiFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { FREE_SERVICE_LIMIT, PREMIUM_PRICE } from "@/lib/constants";
import type { SubscriptionInfo } from "@/types";

const FREE_FEATURES = [
  `Maximum ${FREE_SERVICE_LIMIT} active services`,
  "Basic vendor dashboard",
  "Booking request management",
];

const PREMIUM_FEATURES = [
  "Unlimited active services",
  "Premium Vendor badge",
  "All Free plan features",
];

function Features({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function SubscriptionPlans() {
  const { data, error, reload } = useApi<SubscriptionInfo>(
    "/api/payments/my-subscription"
  );
  const [redirecting, setRedirecting] = useState(false);

  const isPremium = data?.plan === "premium";

  async function handleUpgrade() {
    setRedirecting(true);
    try {
     
      const { url } = await apiFetch<{ url: string | null }>(
        "/api/payments/create-checkout-session",
        { method: "POST", body: JSON.stringify({}) }
      );
      if (!url) throw new Error("Could not start checkout");
      window.location.href = url; 
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start checkout");
      setRedirecting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Subscription"
        description="Choose the plan that fits your business"
      />

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
          <Button size="sm" variant="outline" onClick={reload}>
            Try again
          </Button>
        </div>
      )}

      {!data && !error && (
        <div className="grid max-w-4xl gap-6 md:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      )}

      {data && (
        <div className="grid max-w-4xl gap-6 md:grid-cols-2">
          
          <Card className={`py-0 ${!isPremium ? "border-primary ring-1 ring-primary" : ""}`}>
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl text-rose-dark">Free</h2>
                {!isPremium && <Badge>Current plan</Badge>}
              </div>
              <p className="font-heading text-4xl font-semibold">
                $0
                <span className="text-base font-normal text-muted-foreground"> / forever</span>
              </p>
              <Features items={FREE_FEATURES} />
            </CardContent>
          </Card>

          
          <Card className={`py-0 ${isPremium ? "border-gold ring-1 ring-gold" : ""}`}>
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-heading text-2xl text-rose-dark">
                  <Crown className="h-5 w-5 text-gold" />
                  Premium
                </h2>
                {isPremium && (
                  <Badge className="bg-gold text-white hover:bg-gold">Current plan</Badge>
                )}
              </div>
              <p className="font-heading text-4xl font-semibold">
                ${PREMIUM_PRICE}
                <span className="text-base font-normal text-muted-foreground"> / month</span>
              </p>
              <Features items={PREMIUM_FEATURES} />

              {isPremium ? (
                <p className="rounded-lg bg-secondary p-3 text-sm">
                  Your Premium plan is active
                  {data.expiresAt && ` until ${formatDate(data.expiresAt)}`}.
                </p>
              ) : (
                <Button
                  className="w-full bg-gold text-white hover:bg-gold/90"
                  size="lg"
                  onClick={handleUpgrade}
                  disabled={redirecting}
                >
                  {redirecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Upgrade to Premium
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <p className="mt-6 max-w-4xl text-xs text-muted-foreground">
        Payments run in Stripe test mode. Use card number 4242 4242 4242 4242
        with any future expiry date and any CVC.
      </p>
    </>
  );
}