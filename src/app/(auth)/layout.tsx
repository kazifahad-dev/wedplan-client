import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary/50 px-4 py-10">
      <Link
        href="/"
        className="mb-6 font-heading text-3xl font-semibold text-rose-dark"
      >
        WedPlan
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}