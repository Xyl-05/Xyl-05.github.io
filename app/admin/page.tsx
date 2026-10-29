import type { Metadata } from "next";
import { AdminDashboard } from "../components/admin-dashboard";
import { requireChatGPTUser } from "../chatgpt-auth";
import { hasOwner, resolveEditor } from "../../lib/editor-access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "网站编辑后台 | 妍的可爱宇宙",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin/");
  const [access, ownerExists] = await Promise.all([
    resolveEditor(user),
    hasOwner(),
  ]);

  return (
    <AdminDashboard
      user={{ displayName: user.displayName, email: user.email }}
      initialAccess={access}
      ownerExists={ownerExists}
    />
  );
}
