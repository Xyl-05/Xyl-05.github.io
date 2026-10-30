"use client";

import { useState } from "react";
import type { FormEvent } from "react";

export function AdminLoginForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("正在登录…");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        displayName: form.get("displayName"),
        code: form.get("code"),
      }),
    });
    const result = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setMessage(result.error ?? "登录失败，请稍后再试");
      setLoading(false);
      return;
    }
    window.location.href = "/admin/";
  }

  return (
    <form onSubmit={submit}>
      <label htmlFor="admin-name">怎么称呼你</label>
      <input id="admin-name" name="displayName" autoComplete="name" maxLength={60} required />
      <label htmlFor="admin-email">邮箱</label>
      <input id="admin-email" name="email" type="email" autoComplete="email" required />
      <label htmlFor="admin-code">后台访问码</label>
      <input id="admin-code" name="code" type="password" autoComplete="current-password" required />
      <button type="submit" disabled={loading}>{loading ? "正在登录…" : "进入编辑后台"}</button>
      {message && <strong aria-live="polite">{message}</strong>}
    </form>
  );
}
