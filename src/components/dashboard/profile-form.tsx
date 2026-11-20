"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload";

interface ProfileFormProps {
  initial: {
    name: string;
    email: string;
    image?: string | null;
    role: string;
    businessName?: string | null;
  };
}

export function ProfileForm({ initial }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [businessName, setBusinessName] = useState(initial.businessName ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isVendor = initial.role === "vendor";

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!picked.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (picked.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Please enter your full name");
      return;
    }

    setLoading(true);
    try {
      // নতুন ছবি বাছলে আগে ImgBB-তে আপলোড
      const image = file ? await uploadImage(file) : undefined;

      // শুধু নাম, ছবি, ব্যবসার নাম পাঠাই। role বা subscription এখানে পাঠানোর উপায় নেই
      // (সার্ভারও এগুলো আটকায়)
      const { error } = await authClient.updateUser({
        name: name.trim(),
        ...(image ? { image } : {}),
        ...(isVendor ? { businessName: businessName.trim() } : {}),
      });

      if (error) {
        toast.error(error.message || "Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully");
      setFile(null);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const shownImage = preview ?? initial.image ?? undefined;

  return (
    <Card className="max-w-2xl py-0">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20">
              {shownImage && <AvatarImage src={shownImage} alt={name} />}
              <AvatarFallback className="bg-secondary text-rose-dark">
                <Camera className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <Label htmlFor="image">Profile image</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleFile} />
              <p className="text-xs text-muted-foreground">JPG or PNG, up to 5MB</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={initial.email} disabled />
            </div>

            {isVendor && (
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="businessName">Business name</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="role">Account role</Label>
              <Input id="role" value={initial.role} disabled className="capitalize" />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}