import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatPrice } from "@/lib/format";
import type { Service } from "@/types";

export function ServiceCard({ service }: { service: Service }) {
  const vendorName =
    service.vendor?.businessName || service.vendor?.name || "WedPlan Vendor";
  const cover = service.images?.[0];

  return (
    <Card className="group h-full gap-0 overflow-hidden py-0 transition-shadow hover:shadow-lg">
      {/* ছবি */}
      <div className="relative aspect-4/3 overflow-hidden bg-secondary">
        {cover && (
          <Image
            src={cover}
            alt={service.serviceName}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <Badge className="absolute left-3 top-3 bg-background/90 text-rose-dark hover:bg-background/90">
          {service.category}
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-1 font-heading text-lg font-semibold">
          {service.serviceName}
        </h3>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            {service.location}
          </span>
          <span className="font-semibold text-rose-dark">
            {formatPrice(service.price)}
          </span>
        </div>

        {/* ভেন্ডরের তথ্য */}
        <div className="flex items-center gap-2 border-t pt-3">
          <Avatar className="h-7 w-7">
            {service.vendor?.image && (
              <AvatarImage src={service.vendor.image} alt={vendorName} />
            )}
            <AvatarFallback className="bg-secondary text-xs text-rose-dark">
              {vendorName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-sm text-muted-foreground">
            {vendorName}
          </span>
          {service.vendor?.isPremium && (
            <Badge className="ml-auto bg-gold text-white hover:bg-gold">
              Premium
            </Badge>
          )}
        </div>

        <Link
          href={`/services/${service._id}`}
          className={buttonVariants({ className: "mt-auto w-full" })}
        >
          View Details
        </Link>
      </CardContent>
    </Card>
  );
}