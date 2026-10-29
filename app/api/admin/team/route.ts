import { asc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { editorInvites, editors } from "../../../../db/schema";
import { apiAuthError, getApiEditor } from "../../../../lib/api-auth";

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
  const db = getDb();
  const [team, invites] = await Promise.all([
    db.select().from(editors).orderBy(asc(editors.createdAt)),
    db.select().from(editorInvites).orderBy(asc(editorInvites.createdAt)),
  ]);
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
  const db = getDb();
  const [existing] = await db
    .select({ email: editors.email })
    .from(editors)
    .where(eq(editors.email, email))
    .limit(1);
  if (existing) {
    return Response.json({ error: "这个账号已经可以编辑" }, { status: 409 });
  }
  await db
    .insert(editorInvites)
    .values({ email, invitedBy: auth.access.userId, createdAt: Date.now() })
    .onConflictDoUpdate({
      target: editorInvites.email,
      set: { invitedBy: auth.access.userId, createdAt: Date.now() },
    });
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
  const db = getDb();
  await Promise.all([
    db.delete(editorInvites).where(eq(editorInvites.email, email)),
    db
      .delete(editors)
      .where(eq(editors.email, email)),
  ]);
  return Response.json({ ok: true });
}
