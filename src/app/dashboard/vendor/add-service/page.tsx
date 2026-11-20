"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import { ServiceForm } from "@/components/dashboard/vendor/service-form";

export default function AddServicePage() {
  const router = useRouter();

  return (
    <>
      <PageHeader
        title="Add Service"
        description="New services are reviewed by an admin before they appear on the website"
      />
      <Card className="max-w-3xl py-0">
        <CardContent className="p-6">
          <ServiceForm
            submitLabel="Submit for Review"
            onSuccess={() => router.push("/dashboard/vendor/services")}
          />
        </CardContent>
      </Card>
    </>
  );
}