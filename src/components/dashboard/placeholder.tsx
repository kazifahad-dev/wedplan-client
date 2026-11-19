"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

export function DashboardPlaceholder({ title }: { title: string }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [result, setResult] = useState("");

  async function testApi() {
    try {
      const data = await apiFetch("/api/me"); 
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setResult(e instanceof Error ? e.message : "Error");
    }
  }

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
          router.refresh();
        },
      },
    });
  }

  return (
    <main className="mx-auto max-w-xl space-y-4 p-8">
      <h1 className="font-heading text-3xl text-rose-dark">{title}</h1>
      <p>
        {isPending
          ? "Loading..."
          : `Signed in as ${session?.user.name} (${session?.user.role})`}
      </p>
      <div className="flex gap-3">
        <Button onClick={testApi}>Test Express API</Button>
        <Button variant="outline" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
      {result && (
        <pre className="overflow-auto rounded-lg bg-secondary p-4 text-sm">
          {result}
        </pre>
      )}
    </main>
  );
}