import { createAdminSession, isValidAccessCode } from "../../../../lib/admin-session";
import { readSiteState, writeSiteState } from "../../../../lib/site-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    displayName?: string;
    code?: string;
  } | null;
  const email = body?.email?.trim().toLowerCase() ?? "";
  const displayName = body?.displayName?.trim().slice(0, 60) || email.split("@")[0];
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json({ error: "请填写正确的邮箱" }, { status: 400 });
  }
  if (!isValidAccessCode(body?.code)) {
    return Response.json({ error: "后台访问码不正确" }, { status: 403 });
  }

  const state = await readSiteState();
  const ownerExists = state.editors.some((editor) => editor.role === "owner");
  let editor = state.editors.find((entry) => entry.email === email);
  const invite = state.editorInvites.find((entry) => entry.email === email);

  if (!editor && !ownerExists) {
    editor = {
      userId: crypto.randomUUID(),
      email,
      displayName,
      role: "owner",
      invitedBy: null,
      createdAt: Date.now(),
    };
    state.editors.push(editor);
    await writeSiteState(state);
  } else if (!editor && invite) {
    editor = {
      userId: crypto.randomUUID(),
      email,
      displayName,
      role: "editor",
      invitedBy: invite.invitedBy,
      createdAt: Date.now(),
    };
    state.editors.push(editor);
    state.editorInvites = state.editorInvites.filter((entry) => entry.email !== email);
    await writeSiteState(state);
  } else if (!editor) {
    return Response.json(
      { error: "这个邮箱还没有编辑权限，请先让站长邀请" },
      { status: 403 },
    );
  } else if (editor.displayName !== displayName) {
    editor.displayName = displayName;
    await writeSiteState(state);
  }

  await createAdminSession({
    userId: editor.userId,
    email: editor.email,
    displayName: editor.displayName,
  });
  return Response.json({ ok: true });
}
