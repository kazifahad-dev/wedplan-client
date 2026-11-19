"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function BlockedPage() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-heading text-3xl text-rose-dark">Account blocked</h1>
      <p className="max-w-md text-muted-foreground">
        Your account has been blocked by an administrator. Please contact
        support if you think this is a mistake.
      </p>
      <Button onClick={handleSignOut}>Sign out</Button>
    </div>
  );
}