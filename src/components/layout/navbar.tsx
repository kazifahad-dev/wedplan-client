"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, Settings } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getDashboardPath } from "@/lib/roles";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
 
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);

  const user = session?.user;
  const dashboardPath = getDashboardPath(user?.role);
  const initials = (user?.name ?? "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  async function handleLogout() {
    setOpen(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/");
          router.refresh();
        },
        onError: () => toast.error("Logout failed. Please try again."),
      },
    });
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        <Link
          href="/"
          className="font-heading text-2xl font-semibold text-rose-dark"
        >
          WedPlan
        </Link>

        
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href) ? "text-primary" : "text-foreground/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          
          <div className="hidden items-center gap-2 md:flex">
            {isPending ? (
              <Skeleton className="h-9 w-9 rounded-full" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9">
                    {user.image && (
                      <AvatarImage src={user.image} alt={user.name} />
                    )}
                    <AvatarFallback className="bg-secondary text-rose-dark">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="mt-1 text-xs capitalize text-primary">
                      {user.role}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => go(dashboardPath)}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => go(`${dashboardPath}/profile`)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className={buttonVariants({ variant: "ghost" })}
                >
                  Sign In
                </Link>
                <Link href="/sign-up" className={buttonVariants()}>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle className="font-heading text-xl text-rose-dark">
              WedPlan
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-1 px-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                className={`rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-accent ${
                  isActive(link.href) ? "text-primary" : ""
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="my-3 h-px bg-border" />

            {isPending ? (
              <Skeleton className="h-9 w-full" />
            ) : user ? (
              <>
                <div className="mb-2 flex items-center gap-3 px-3">
                  <Avatar className="h-10 w-10">
                    {user.image && (
                      <AvatarImage src={user.image} alt={user.name} />
                    )}
                    <AvatarFallback className="bg-secondary text-rose-dark">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="text-xs capitalize text-primary">
                      {user.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => go(dashboardPath)}
                  className="rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => go(`${dashboardPath}/profile`)}
                  className="rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-md px-3 py-2 text-left text-sm text-destructive hover:bg-accent"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => go("/sign-in")}>
                  Sign In
                </Button>
                <Button onClick={() => go("/sign-up")}>Sign Up</Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}