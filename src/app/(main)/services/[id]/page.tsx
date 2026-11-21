import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ServiceGallery } from "@/components/services/service-gallery";
import { BookingPanel } from "@/components/services/booking-panel";
import { ServiceUnavailable } from "@/components/services/service-unavailable";
import { getService } from "@/lib/data";
import { getServerSession } from "@/lib/session";
import { formatPrice } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await getService(id);
  return {
    title: result.status === "ok" ? result.service.serviceName : "Service Details",
  };
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { id } = await params;

  
  const session = await getServerSession();
  if (!session) redirect(`/sign-in?callback=/services/${id}`);
  if (session.user.isBlocked) redirect("/blocked");

  const result = await getService(id);
  if (result.status !== "ok") {
    return <ServiceUnavailable variant={result.status} />;
  }

  const { service } = result;
  const vendorName =
    service.vendor?.businessName || service.vendor?.name || "WedPlan Vendor";

  
  const role = session.user.role;
  let blockedReason: string | null = null;
  if (role === "admin") {
    blockedReason = "Admin accounts cannot submit booking requests.";
  } else if (session.user.id === service.vendorId) {
    blockedReason = "This is your own service, so you cannot book it.";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link
        href="/services"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to services
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        
        <div className="space-y-6 lg:col-span-2">
          <ServiceGallery images={service.images} alt={service.serviceName} />

          <div>
            <Badge variant="secondary" className="mb-3 text-rose-dark">
              {service.category}
            </Badge>
            <h1 className="font-heading text-3xl font-semibold text-rose-dark sm:text-4xl">
              {service.serviceName}
            </h1>
            <p className="mt-2 flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              {service.location}
            </p>
          </div>

          <div>
            <h2 className="mb-2 font-heading text-xl text-rose-dark">
              About this service
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {service.description}
            </p>
          </div>
        </div>

       
        <aside>
          <div className="space-y-5 rounded-xl border bg-card p-6 shadow-sm lg:sticky lg:top-24">
            <div>
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-heading text-3xl font-semibold text-rose-dark">
                {formatPrice(service.price)}
              </p>
            </div>

            <div className="flex items-center gap-3 border-t pt-4">
              <Avatar className="h-11 w-11">
                {service.vendor?.image && (
                  <AvatarImage src={service.vendor.image} alt={vendorName} />
                )}
                <AvatarFallback className="bg-secondary text-rose-dark">
                  {vendorName[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Offered by</p>
                <p className="truncate font-medium">{vendorName}</p>
              </div>
              {service.vendor?.isPremium && (
                <Badge className="ml-auto bg-gold text-white hover:bg-gold">
                  Premium
                </Badge>
              )}
            </div>

            <BookingPanel
              serviceId={service._id}
              serviceName={service.serviceName}
              blockedReason={blockedReason}
              isCustomer={role === "customer"}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}