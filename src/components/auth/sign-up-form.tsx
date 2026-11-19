"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleButton } from "./google-button";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload";
import { PASSWORD_HINT, validatePassword } from "@/lib/password";
import { safeRedirect } from "@/lib/roles";

type Role = "customer" | "vendor";

const ROLES: { value: Role; title: string; text: string }[] = [
  { value: "customer", title: "Customer", text: "I'm planning a wedding" },
  { value: "vendor", title: "Vendor", text: "I offer wedding services" },
];

export function SignUpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callback = safeRedirect(params.get("callback"));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("customer");
  const [businessName, setBusinessName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setLoading(true);
    try {
      
      let image: string | undefined;
      if (file) image = await uploadImage(file);

     
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image,
        role,
        businessName:
          role === "vendor" ? businessName.trim() || undefined : undefined,
      });

      if (error) {
        toast.error(error.message || "Sign up failed");
        return;
      }

      toast.success("Account created successfully!");
      router.push(callback);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-2xl">Create your account</CardTitle>
        <CardDescription>Join WedPlan and start planning today</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <GoogleButton callbackURL={callback} />

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or sign up with email
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                aria-pressed={role === r.value}
                className={`rounded-lg border p-3 text-left transition ${
                  role === r.value
                    ? "border-primary bg-secondary ring-1 ring-primary"
                    : "hover:bg-accent"
                }`}
              >
                <p className="text-sm font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.text}</p>
              </button>
            ))}
          </div>

          
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {preview && <AvatarImage src={preview} alt="Profile preview" />}
              <AvatarFallback>
                <Camera className="h-5 w-5 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <Label htmlFor="image">Profile image (optional)</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleFile} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {role === "vendor" && (
            <div className="space-y-2">
              <Label htmlFor="businessName">Business name (optional)</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">{PASSWORD_HINT}</p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center text-sm text-muted-foreground">
        Already have an account?&nbsp;
        <Link
          href={`/sign-in${params.get("callback") ? `?callback=${encodeURIComponent(callback)}` : ""}`}
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}