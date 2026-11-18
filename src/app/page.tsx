import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <h1 className="font-heading text-5xl font-semibold text-rose-dark">
        WedPlan
      </h1>
      <p className="max-w-md text-muted-foreground">
        Theme check: rose gold is working.
      </p>
      <div className="flex gap-3">
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button className="bg-gold text-white hover:bg-gold/90">Gold</Button>
      </div>
    </main>
  );
}