"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DASHBOARD_NAV, type DashboardRole } from "./nav-config";


function SidebarContent({
  role,
  onNavigate,
}: {
  role: DashboardRole;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const config = DASHBOARD_NAV[role];
  const user = session?.user;

  function isActive(href: string, exact?: boolean) {
    return exact
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  async function handleLogout() {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        toast.success("Logged out successfully");
        router.push("/");
        router.refresh();
      },
      onError: () => {
        toast.error("Logout failed. Please try again.");
      },
    },
  });
}
  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-5 py-4">
        <Link
          href="/"
          className="font-heading text-2xl font-semibold text-rose-dark"
        >
          WedPlan
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground">{config.title}</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {config.items.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive(href, exact)
                ? "bg-primary text-primary-foreground"
                : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="space-y-2 border-t p-3">
        {user && (
          <div className="flex items-center gap-3 px-2 pb-2">
            <Avatar className="h-9 w-9">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback className="bg-secondary text-rose-dark">
                {user.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        )}
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground/70 hover:bg-accent"
        >
          <Home className="h-4 w-4" />
          Back to website
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-accent"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

export function DashboardShell({
  role,
  children,
}: {
  role: DashboardRole;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary/30 lg:pl-64">
      {/* ডেস্কটপ সাইডবার */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background lg:block">
        <SidebarContent role={role} />
      </aside>

      
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background px-4 lg:hidden">
        <Link
          href="/"
          className="font-heading text-xl font-semibold text-rose-dark"
        >
          WedPlan
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          aria-label="Open dashboard menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </header>

      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Dashboard menu</SheetTitle>
          </SheetHeader>
          <SidebarContent role={role} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}