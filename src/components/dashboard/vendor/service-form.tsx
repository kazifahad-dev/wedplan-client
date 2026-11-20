"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePicker } from "./image-picker";
import { apiFetch } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { CATEGORIES } from "@/lib/constants";
import { SELECT_CLASS } from "@/lib/styles";
import type { Service } from "@/types";

interface ServiceFormProps {
  initial?: Service; // থাকলে এডিট, না থাকলে নতুন সার্ভিস
  submitLabel: string;
  onSuccess: () => void;
}

export function ServiceForm({ initial, submitLabel, onSuccess }: ServiceFormProps) {
  const router = useRouter();

  const [serviceName, setServiceName] = useState(initial?.serviceName ?? "");
  const [category, setCategory] = useState<string>(initial?.category ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [existing, setExisting] = useState<string[]>(initial?.images ?? []);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  function fail(message: string) {
    toast.error(message);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // ফ্রন্টএন্ডের যাচাই (সার্ভারও আবার যাচাই করে)
    if (serviceName.trim().length < 3) return fail("Service name must be at least 3 characters");
    if (!category) return fail("Please select a category");
    if (description.trim().length < 10) return fail("Description must be at least 10 characters");
    const priceNumber = Number(price);
    if (!priceNumber || priceNumber <= 0) return fail("Price must be greater than 0");
    if (location.trim().length < 2) return fail("Location is required");
    if (existing.length + files.length === 0) return fail("Please add at least one image");

    setLoading(true);
    try {
      // ১. নতুন ছবিগুলো ImgBB-তে আপলোড (একসাথে)
      const uploaded = await Promise.all(files.map((f) => uploadImage(f)));

      // ২. সার্ভিস সেভ। vendorId বা status পাঠাই না, ওগুলো সার্ভার নিজে বসায়
      const payload = {
        serviceName: serviceName.trim(),
        category,
        description: description.trim(),
        price: priceNumber,
        location: location.trim(),
        images: [...existing, ...uploaded],
      };

      await apiFetch(initial ? `/api/services/${initial._id}` : "/api/services", {
        method: initial ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });

      toast.success(initial ? "Service updated successfully" : "Service submitted for admin review");
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      if (message.includes("Free plan")) {
        // ফ্রি প্ল্যানের সীমা: আপগ্রেডের লিংক দেখাই
        toast.error(message, {
          action: {
            label: "Upgrade",
            onClick: () => router.push("/dashboard/vendor/subscription"),
          },
        });
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="serviceName">Service name</Label>
          <Input
            id="serviceName"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            type="number"
            min="1"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g. Dhaka"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <ImagePicker
        existing={existing}
        onExistingChange={setExisting}
        files={files}
        onFilesChange={setFiles}
      />

      <Button type="submit" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}