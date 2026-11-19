import { redirect } from "next/navigation";
import { getServerSession } from "./session";
import { getDashboardPath } from "./roles";


export async function requireRole(role: "admin" | "vendor" | "customer") {
  const session = await getServerSession();

  if (!session) redirect("/sign-in");
  if (session.user.isBlocked) redirect("/blocked");

  
  if (session.user.role !== role) {
    redirect(getDashboardPath(session.user.role));
  }

  return session;
}