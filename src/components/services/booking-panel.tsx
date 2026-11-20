"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";

interface BookingPanelProps {
  serviceId: string;
  serviceName: string;
  blockedReason: string | null; // বুক করা নিষেধ থাকলে কারণ
  isCustomer: boolean;
}

// আগামীকালের তারিখ (YYYY-MM-DD)। সার্ভার অতীতের তারিখ গ্রহণ করে না
function tomorrow() {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function BookingPanel({
  serviceId,
  serviceName,
  blockedReason,
  isCustomer,
}: BookingPanelProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");

  // বুক করার অনুমতি না থাকলে ফর্মের বদলে কারণ দেখাই
  if (blockedReason) {
    return (
      <div className="flex gap-2 rounded-lg bg-secondary p-4 text-sm text-rose-dark">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{blockedReason}</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!eventDate) {
      toast.error("Please choose your event date");
      return;
    }
    if (eventLocation.trim().length < 2) {
      toast.error("Please enter the event location");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          serviceId,
          eventDate,
          eventLocation: eventLocation.trim(),
          message: message.trim() || undefined,
        }),
      });

      toast.success("Booking request sent!", {
        description: "The vendor will review it shortly.",
        action: isCustomer
          ? {
              label: "View bookings",
              onClick: () => router.push("/dashboard/customer/bookings"),
            }
          : undefined,
      });

      setOpen(false);
      setEventDate("");
      setEventLocation("");
      setMessage("");
    } catch (err) {
      // সার্ভারের বার্তাই দেখাই (যেমন ডুপ্লিকেট বুকিং, নিজের সার্ভিস ইত্যাদি)
      toast.error(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button size="lg" className="w-full" onClick={() => setOpen(true)}>
        <CalendarCheck className="mr-2 h-4 w-4" />
        Request Booking
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-rose-dark">
              Book {serviceName}
            </DialogTitle>
            <DialogDescription>
              Send a request to the vendor. They will accept or reject it from
              their dashboard.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event date</Label>
              <Input
                id="eventDate"
                type="date"
                min={tomorrow()}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventLocation">Event location</Label>
              <Input
                id="eventLocation"
                placeholder="e.g. Banani, Dhaka"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Additional message (optional)</Label>
              <Textarea
                id="message"
                rows={3}
                maxLength={500}
                placeholder="Tell the vendor about your wedding"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Booking Request
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}