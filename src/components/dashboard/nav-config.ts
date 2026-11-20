import {
  CalendarCheck,
  Crown,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Package,
  PlusCircle,
  Receipt,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

export type DashboardRole = "customer" | "vendor" | "admin";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean; // Overview শুধু হুবহু মিললেই সক্রিয়
}

export const DASHBOARD_NAV: Record<
  DashboardRole,
  { title: string; items: NavItem[] }
> = {
  customer: {
    title: "Customer Dashboard",
    items: [
      { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/customer/bookings", label: "My Bookings", icon: CalendarCheck },
      { href: "/dashboard/customer/profile", label: "Profile Settings", icon: UserCog },
    ],
  },
  vendor: {
    title: "Vendor Dashboard",
    items: [
      { href: "/dashboard/vendor", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/vendor/services", label: "My Services", icon: Package },
      { href: "/dashboard/vendor/add-service", label: "Add Service", icon: PlusCircle },
      { href: "/dashboard/vendor/bookings", label: "Booking Requests", icon: Inbox },
      { href: "/dashboard/vendor/subscription", label: "Subscription", icon: Crown },
      { href: "/dashboard/vendor/profile", label: "Profile Settings", icon: UserCog },
    ],
  },
  admin: {
    title: "Admin Dashboard",
    items: [
      { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
      { href: "/dashboard/admin/services", label: "Manage Services", icon: ListChecks },
      { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt },
      { href: "/dashboard/admin/profile", label: "Profile Settings", icon: UserCog },
    ],
  },
};