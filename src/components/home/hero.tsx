"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Heart, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-secondary via-background to-accent">
      {/* ঝাপসা সাজসজ্জার বৃত্ত */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        {/* লেখা */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6 text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-1.5 text-sm text-rose-dark">
            <Sparkles className="h-4 w-4 text-gold" />
            Your dream wedding starts here
          </span>

          <h1 className="font-heading text-4xl font-semibold leading-tight text-rose-dark sm:text-5xl lg:text-6xl">
            Find the Perfect Vendors for Your Perfect Day
          </h1>

          <p className="mx-auto max-w-xl text-lg text-muted-foreground lg:mx-0">
            Discover trusted photographers, venues, decorators, caterers and
            more. Compare services and send booking requests in a few clicks.
          </p>

          <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/services"
              className={buttonVariants({ size: "lg" })}
            >
              Explore Wedding Services
            </Link>
            <Link
              href="/sign-up"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Join as a Vendor
            </Link>
          </div>
        </motion.div>

        {/* বিয়ের থিমের ইলাস্ট্রেশন: দুটো আংটি */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-full"
          >
            <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
              <defs>
                <linearGradient id="roseGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#e8b4b8" />
                  <stop offset="1" stopColor="#b76e79" />
                </linearGradient>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#e6c992" />
                  <stop offset="1" stopColor="#c9a26b" />
                </linearGradient>
              </defs>
              <circle cx="200" cy="200" r="180" fill="url(#roseGrad)" opacity="0.15" />
              <circle cx="200" cy="200" r="130" fill="none" stroke="#c9a26b" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.7" />
              <circle cx="160" cy="215" r="68" fill="none" stroke="url(#roseGrad)" strokeWidth="16" />
              <circle cx="240" cy="215" r="68" fill="none" stroke="url(#goldGrad)" strokeWidth="16" />
              <polygon points="240,130 256,110 240,90 224,110" fill="#ffffff" stroke="#c9a26b" strokeWidth="3" />
            </svg>
          </motion.div>

          <Heart className="absolute left-4 top-10 h-8 w-8 fill-primary/70 text-primary/70" />
          <Heart className="absolute bottom-12 right-6 h-6 w-6 fill-gold/80 text-gold/80" />
          <Heart className="absolute right-12 top-6 h-5 w-5 fill-primary/50 text-primary/50" />
        </motion.div>
      </div>
    </section>
  );
}