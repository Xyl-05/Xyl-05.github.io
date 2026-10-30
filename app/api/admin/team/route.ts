import { apiAuthError, getApiEditor } from "../../../../lib/api-auth";
import { readSiteState, writeSiteState } from "../../../../lib/site-store";

export const dynamic = "force-dynamic";

async function requireOwner() {
  const auth = await getApiEditor();
  if (auth.status !== "ok") return auth;
  if (auth.access.role !== "owner") return { status: "forbidden" as const };
  return auth;
}

export async function GET() {
  const auth = await requireOwner();
  if (auth.status !== "ok") return apiAuthError(auth.status);
  const state = await readSiteState();
  const team = [...state.editors].sort((a, b) => a.createdAt - b.createdAt);
  const invites = [...state.editorInvites].sort((a, b) => a.createdAt - b.createdAt);
  return Response.json({ team, invites });
}

export async function POST(request: Request) {
  const auth = await requireOwner();
  if (auth.status !== "ok") return apiAuthError(auth.status);
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase() ?? "";
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json({ error: "请填写正确的邮箱" }, { status: 400 });
  }
  const state = await readSiteState();
  const existing = state.editors.find((editor) => editor.email === email);
  if (existing) {
    return Response.json({ error: "这个账号已经可以编辑" }, { status: 409 });
  }
  const invite = state.editorInvites.find((entry) => entry.email === email);
  if (invite) {
    invite.invitedBy = auth.access.userId;
    invite.createdAt = Date.now();
  } else {
    state.editorInvites.push({ email, invitedBy: auth.access.userId, createdAt: Date.now() });
  }
  await writeSiteState(state);
  return Response.json({ ok: true, email }, { status: 201 });
}

export async function DELETE(request: Request) {
  const auth = await requireOwner();
  if (auth.status !== "ok") return apiAuthError(auth.status);
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase() ?? "";
  if (!email) return Response.json({ error: "缺少邮箱" }, { status: 400 });
  if (email === auth.access.email) {
    return Response.json({ error: "不能移除自己的站长权限" }, { status: 400 });
  }
  const state = await readSiteState();
  state.editorInvites = state.editorInvites.filter((entry) => entry.email !== email);
  state.editors = state.editors.filter((editor) => editor.email !== email);
  await writeSiteState(state);
  return Response.json({ ok: true });
}
