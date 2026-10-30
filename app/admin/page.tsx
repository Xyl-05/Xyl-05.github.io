import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminDashboard } from "../components/admin-dashboard";
import { getAdminSession } from "../../lib/admin-session";
import { resolveEditor } from "../../lib/editor-access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "网站编辑后台 | 妍的可爱宇宙",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login/");
  const access = await resolveEditor(user);
  if (!access) redirect("/admin/login/");

  return (
    <AdminDashboard
      user={{ displayName: user.displayName, email: user.email }}
      initialAccess={access}
      ownerExists
    />
  );
}
