import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { PageHeader } from "./page-header";
import { ProfileForm } from "./profile-form";

export async function ProfileSettings() {
  const session = await getServerSession();
  if (!session) redirect("/sign-in");

  const u = session.user;

  return (
    <>
      <PageHeader
        title="Profile Settings"
        description="Update your personal information"
      />
      <ProfileForm
        initial={{
          name: u.name,
          email: u.email,
          image: u.image,
          role: u.role ?? "customer",
          businessName: u.businessName,
        }}
      />
    </>
  );
}