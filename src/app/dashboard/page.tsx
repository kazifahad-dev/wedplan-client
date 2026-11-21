import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { getDashboardPath } from "@/lib/roles";


export default async function DashboardIndex() {
  const session = await getServerSession();

  if (!session) redirect("/sign-in?callback=/dashboard");
  if (session.user.isBlocked) redirect("/sign-in");

  redirect(getDashboardPath(session.user.role));
}