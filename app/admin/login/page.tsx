import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "../../components/admin-login-form";
import { getAdminSession } from "../../../lib/admin-session";
import { resolveEditor } from "../../../lib/editor-access";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "登录编辑后台 | 妍的可爱宇宙" };

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session && (await resolveEditor(session))) redirect("/admin/");
  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <a className="logo" href="/"><span>妍</span> YAN&apos;S CLUB</a>
        <a href="/">返回网站</a>
      </header>
      <section className="admin-gate">
        <span>ONLINE EDITOR</span>
        <h1>登录网站编辑后台</h1>
        <p>站长首次登录会自动建立账号；朋友需要先由站长邀请邮箱。</p>
        <AdminLoginForm />
        <a className="admin-back-link" href="/">← 返回网站</a>
      </section>
    </main>
  );
}
