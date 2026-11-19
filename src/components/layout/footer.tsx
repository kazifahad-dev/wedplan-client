import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { CATEGORIES } from "@/lib/constants";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-up", label: "Sign Up" },
];

const SOCIALS = [
  { href: "https://facebook.com", label: "Facebook", icon: FaFacebookF },
  { href: "https://instagram.com", label: "Instagram", icon: FaInstagram },
  { href: "https://x.com", label: "X (Twitter)", icon: FaXTwitter },
  { href: "https://linkedin.com", label: "LinkedIn", icon: FaLinkedinIn },
];

export function Footer() {
  return (
    <footer className="border-t bg-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        
        <div className="space-y-3">
          <Link
            href="/"
            className="font-heading text-2xl font-semibold text-rose-dark"
          >
            WedPlan
          </Link>
          <p className="text-sm text-muted-foreground">
            WedPlan connects couples with trusted wedding vendors. Discover
            services, compare options and request bookings, all in one place.
          </p>
        </div>

       
        <div>
          <h3 className="mb-3 font-heading text-lg text-rose-dark">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        
        <div>
          <h3 className="mb-3 font-heading text-lg text-rose-dark">
            Categories
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  href={`/services?category=${encodeURIComponent(category)}`}
                  className="hover:text-primary"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        
        <div>
          <h3 className="mb-3 font-heading text-lg text-rose-dark">Contact</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> support@wedplan.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" /> +880 1700-000000
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> Dhaka, Bangladesh
            </li>
          </ul>

          <div className="mt-4 flex gap-3">
            {SOCIALS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-rose-dark"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} WedPlan. All rights reserved.
      </div>
    </footer>
  );
}