import { and, count, eq, or } from "drizzle-orm";
import type { ChatGPTUser } from "../app/chatgpt-auth";
import { getDb } from "../db";
import { editorInvites, editors } from "../db/schema";

export type EditorRole = "owner" | "editor";

export type EditorAccess = {
  userId: string;
  email: string;
  displayName: string;
  role: EditorRole;
};

export async function hasOwner() {
  const db = getDb();
  const [result] = await db
    .select({ value: count() })
    .from(editors)
    .where(eq(editors.role, "owner"));
  return (result?.value ?? 0) > 0;
}

export async function resolveEditor(
  user: ChatGPTUser,
): Promise<EditorAccess | null> {
  const db = getDb();
  const normalizedEmail = user.email.trim().toLowerCase();
  const [existing] = await db
    .select()
    .from(editors)
    .where(
      or(eq(editors.userId, user.userId), eq(editors.email, normalizedEmail)),
    )
    .limit(1);

  if (existing) {
    if (
      existing.userId !== user.userId ||
      existing.displayName !== user.displayName
    ) {
      await db
        .update(editors)
        .set({ userId: user.userId, displayName: user.displayName })
        .where(eq(editors.email, normalizedEmail));
    }
    return {
      userId: user.userId,
      email: normalizedEmail,
      displayName: user.displayName,
      role: existing.role as EditorRole,
    };
  }

  const [invite] = await db
    .select()
    .from(editorInvites)
    .where(eq(editorInvites.email, normalizedEmail))
    .limit(1);
  if (!invite) return null;

  await db.insert(editors).values({
    userId: user.userId,
    email: normalizedEmail,
    displayName: user.displayName,
    role: "editor",
    invitedBy: invite.invitedBy,
    createdAt: Date.now(),
  });
  await db
    .delete(editorInvites)
    .where(
      and(
        eq(editorInvites.email, normalizedEmail),
        eq(editorInvites.invitedBy, invite.invitedBy),
      ),
    );

  return {
    userId: user.userId,
    email: normalizedEmail,
    displayName: user.displayName,
    role: "editor",
  };
}

export async function createFirstOwner(user: ChatGPTUser) {
  if (await hasOwner()) return null;
  const db = getDb();
  const owner: EditorAccess = {
    userId: user.userId,
    email: user.email.trim().toLowerCase(),
    displayName: user.displayName,
    role: "owner",
  };
  await db.insert(editors).values({
    ...owner,
    invitedBy: null,
    createdAt: Date.now(),
  });
  return owner;
}
