"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { EditorAccess } from "../../lib/editor-access";
import type { ContentKind } from "../../lib/content";

type AdminItem = {
  id: string;
  kind: string;
  title: string;
  subtitle: string | null;
  note: string | null;
  imageKey: string | null;
  imageName: string | null;
  updatedAt: number;
};

type TeamMember = {
  userId: string;
  email: string;
  displayName: string;
  role: string;
};

type Invite = { email: string };

const sections: Array<{
  kind: ContentKind;
  label: string;
  titleLabel: string;
  subtitleLabel: string;
  accent: string;
}> = [
  { kind: "characters", label: "玩偶图鉴", titleLabel: "角色或玩偶名字", subtitleLabel: "角色标签", accent: "#ff8fb1" },
  { kind: "drinks", label: "奶茶地图", titleLabel: "奶茶品牌", subtitleLabel: "单品或口味", accent: "#b9a7ff" },
  { kind: "food", label: "好吃清单", titleLabel: "食物或店名", subtitleLabel: "口味或分类", accent: "#72d6a5" },
  { kind: "album", label: "照片簿", titleLabel: "照片标题", subtitleLabel: "拍摄地点或日期", accent: "#ffd84c" },
];

export function AdminDashboard({
  user,
  initialAccess,
  ownerExists,
}: {
  user: { displayName: string; email: string };
  initialAccess: EditorAccess | null;
  ownerExists: boolean;
}) {
  const [access, setAccess] = useState(initialAccess);
  const [activeKind, setActiveKind] = useState<ContentKind>("characters");
  const [items, setItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<AdminItem | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [note, setNote] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const imageInput = useRef<HTMLInputElement>(null);

  const currentSection = sections.find((section) => section.kind === activeKind) ?? sections[0];

  const readJson = async <T,>(response: Response) => {
    const data = (await response.json().catch(() => ({}))) as T & { error?: string };
    if (!response.ok) throw new Error(data.error ?? "操作失败，请稍后再试");
    return data;
  };

  const loadItems = useCallback(async (kind: ContentKind) => {
    if (!access) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/content?kind=${kind}`, { cache: "no-store" });
      const data = await readJson<{ items: AdminItem[] }>(response);
      setItems(data.items);
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "读取失败");
    } finally {
      setLoading(false);
    }
  }, [access]);

  const loadTeam = useCallback(async () => {
    if (access?.role !== "owner") return;
    try {
      const response = await fetch("/api/admin/team", { cache: "no-store" });
      const data = await readJson<{ team: TeamMember[]; invites: Invite[] }>(response);
      setTeam(data.team);
      setInvites(data.invites);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "协作者列表读取失败");
    }
  }, [access]);

  useEffect(() => {
    void loadItems(activeKind);
  }, [activeKind, loadItems]);

  useEffect(() => {
    void loadTeam();
  }, [loadTeam]);

  const resetForm = () => {
    setEditing(null);
    setTitle("");
    setSubtitle("");
    setNote("");
    setRemoveImage(false);
    if (imageInput.current) imageInput.current.value = "";
  };

  const beginEdit = (item: AdminItem) => {
    setEditing(item);
    setTitle(item.title);
    setSubtitle(item.subtitle ?? "");
    setNote(item.note ?? "");
    setRemoveImage(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitContent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData();
    form.set("kind", activeKind);
    form.set("title", title);
    form.set("subtitle", subtitle);
    form.set("note", note);
    if (removeImage) form.set("removeImage", "1");
    const file = imageInput.current?.files?.[0];
    if (file) form.set("image", file);

    setMessage(editing ? "正在保存修改…" : "正在发布…");
    try {
      const response = await fetch(
        editing ? `/api/admin/content/${editing.id}` : "/api/admin/content",
        { method: editing ? "PATCH" : "POST", body: form },
      );
      await readJson(response);
      resetForm();
      await loadItems(activeKind);
      setMessage(editing ? "修改已同步到公开页面" : "新内容已同步到公开页面");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存失败");
    }
  };

  const deleteItem = async (item: AdminItem) => {
    if (!window.confirm(`确认删除“${item.title}”吗？删除后无法恢复。`)) return;
    try {
      const response = await fetch(`/api/admin/content/${item.id}`, { method: "DELETE" });
      await readJson(response);
      await loadItems(activeKind);
      setMessage("内容已删除");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "删除失败");
    }
  };

  const bootstrap = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/bootstrap", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: data.get("code") }),
      });
      const result = await readJson<{ owner: EditorAccess }>(response);
      setAccess(result.owner);
      setMessage("站长账号已启用");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "启用失败");
    }
  };

  const invite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });
      await readJson(response);
      setInviteEmail("");
      await loadTeam();
      setMessage("邀请已保存，让朋友用这个邮箱登录后台即可");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "邀请失败");
    }
  };

  const removeEditor = async (email: string) => {
    if (!window.confirm(`确认移除 ${email} 的编辑权限吗？`)) return;
    try {
      const response = await fetch("/api/admin/team", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      await readJson(response);
      await loadTeam();
      setMessage("编辑权限已移除");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "移除失败");
    }
  };

  if (!access) {
    return (
      <main className="admin-shell">
        <header className="admin-topbar">
          <a className="logo" href="/"><span>妍</span> YAN&apos;S CLUB</a>
          <a href="/api/admin/logout">退出登录</a>
        </header>
        <section className="admin-gate">
          <span>EDITOR ACCESS</span>
          <h1>{ownerExists ? "等待站长邀请" : "启用站长后台"}</h1>
          <p>当前登录账号：<b>{user.email}</b></p>
          {ownerExists ? (
            <p>请让站长在“协作者”里添加这个邮箱，然后重新打开本页面。</p>
          ) : (
            <form onSubmit={bootstrap}>
              <label htmlFor="bootstrap-code">站长启用码</label>
              <input id="bootstrap-code" name="code" type="password" required autoComplete="one-time-code" />
              <button type="submit">确认成为站长</button>
            </form>
          )}
          {message && <strong aria-live="polite">{message}</strong>}
          <a className="admin-back-link" href="/">← 返回网站</a>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <a className="logo" href="/"><span>妍</span> YAN&apos;S CLUB</a>
        <div><b>{access.displayName}</b><span>{access.role === "owner" ? "站长" : "协作者"}</span></div>
        <nav><a href="/">查看网站</a><a href="/api/admin/logout">退出</a></nav>
      </header>

      <section className="admin-hero">
        <span>SHARED EDITOR</span>
        <h1>网站编辑后台</h1>
        <p>这里发布的内容会同步给所有访客。可以新增、修改、删除，也可以上传真实照片。</p>
      </section>

      <nav className="admin-tabs" aria-label="编辑分类">
        {sections.map((section) => (
          <button
            key={section.kind}
            className={activeKind === section.kind ? "active" : ""}
            style={{ "--tab-accent": section.accent } as React.CSSProperties}
            onClick={() => { setActiveKind(section.kind); resetForm(); }}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <section className="admin-workspace" style={{ "--admin-accent": currentSection.accent } as React.CSSProperties}>
        <form className="admin-editor-form" onSubmit={submitContent}>
          <div className="admin-section-heading">
            <span>{editing ? "EDIT ITEM" : "NEW ITEM"}</span>
            <h2>{editing ? `修改：${editing.title}` : `添加${currentSection.label}内容`}</h2>
          </div>
          <label><span>{currentSection.titleLabel} *</span><input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={100} /></label>
          <label><span>{currentSection.subtitleLabel}</span><input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} maxLength={120} /></label>
          <label className="admin-wide"><span>备注</span><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} maxLength={800} /></label>
          <label className="admin-wide admin-file"><span>{editing?.imageKey ? "替换图片（不选择则保留原图）" : "上传图片（可选）"}</span><input ref={imageInput} type="file" accept="image/*" /></label>
          {editing?.imageKey && <label className="admin-remove-image"><input type="checkbox" checked={removeImage} onChange={(event) => setRemoveImage(event.target.checked)} /> 删除当前图片</label>}
          <div className="admin-form-actions"><button type="submit">{editing ? "保存修改" : "发布到网站"}</button>{editing && <button type="button" onClick={resetForm}>取消修改</button>}</div>
          {message && <strong className="admin-message" aria-live="polite">{message}</strong>}
        </form>

        <div className="admin-item-list">
          <div className="admin-section-heading"><span>PUBLISHED</span><h2>已发布内容</h2></div>
          {loading ? <p>正在读取…</p> : items.length === 0 ? <p className="admin-list-empty">这个分类还没有后台内容。</p> : items.map((item) => (
            <article key={item.id}>
              {item.imageKey ? <img src={`/api/media/${encodeURIComponent(item.imageKey)}`} alt="" /> : <div className="admin-item-placeholder">{item.title.slice(0, 1)}</div>}
              <div><small>{item.subtitle || currentSection.label}</small><h3>{item.title}</h3><p>{item.note || "暂无备注"}</p></div>
              <div className="admin-item-actions"><button onClick={() => beginEdit(item)}>修改</button><button onClick={() => void deleteItem(item)}>删除</button></div>
            </article>
          ))}
        </div>
      </section>

      {access.role === "owner" && (
        <section className="admin-team">
          <div className="admin-section-heading"><span>TEAM ACCESS</span><h2>协作者权限</h2><p>输入朋友的邮箱。对方使用这个邮箱和后台访问码登录后，即可编辑全部分类。</p></div>
          <form onSubmit={invite}><input type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="朋友的邮箱" required /><button type="submit">＋ 邀请协作者</button></form>
          <div className="admin-team-list">
            {team.map((member) => <article key={member.email}><div><b>{member.displayName}</b><span>{member.email}</span></div><em>{member.role === "owner" ? "站长" : "协作者"}</em>{member.role !== "owner" && <button onClick={() => void removeEditor(member.email)}>移除</button>}</article>)}
            {invites.map((entry) => <article key={entry.email}><div><b>等待首次登录</b><span>{entry.email}</span></div><em>已邀请</em><button onClick={() => void removeEditor(entry.email)}>撤销</button></article>)}
          </div>
        </section>
      )}
    </main>
  );
}
