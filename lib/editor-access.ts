import type { AdminIdentity } from "./admin-session";
import { readSiteState, writeSiteState } from "./site-store";

export type EditorRole = "owner" | "editor";

export type EditorAccess = {
  userId: string;
  email: string;
  displayName: string;
  role: EditorRole;
};

export async function hasOwner() {
  const state = await readSiteState();
  return state.editors.some((editor) => editor.role === "owner");
}

export async function resolveEditor(
  user: AdminIdentity,
): Promise<EditorAccess | null> {
  const state = await readSiteState();
  const normalizedEmail = user.email.trim().toLowerCase();
  const existing = state.editors.find(
    (editor) => editor.userId === user.userId || editor.email === normalizedEmail,
  );

  if (existing) {
    if (
      existing.userId !== user.userId ||
      existing.displayName !== user.displayName
    ) {
      existing.userId = user.userId;
      existing.displayName = user.displayName;
      await writeSiteState(state);
    }
    return {
      userId: user.userId,
      email: normalizedEmail,
      displayName: user.displayName,
      role: existing.role as EditorRole,
    };
  }

  const invite = state.editorInvites.find((entry) => entry.email === normalizedEmail);
  if (!invite) return null;

  state.editors.push({
    userId: user.userId,
    email: normalizedEmail,
    displayName: user.displayName,
    role: "editor",
    invitedBy: invite.invitedBy,
    createdAt: Date.now(),
  });
  state.editorInvites = state.editorInvites.filter((entry) => entry.email !== normalizedEmail);
  await writeSiteState(state);

  return {
    userId: user.userId,
    email: normalizedEmail,
    displayName: user.displayName,
    role: "editor",
  };
}

export async function createFirstOwner(user: AdminIdentity) {
  const state = await readSiteState();
  if (state.editors.some((editor) => editor.role === "owner")) return null;
  const owner: EditorAccess = {
    userId: user.userId,
    email: user.email.trim().toLowerCase(),
    displayName: user.displayName,
    role: "owner",
  };
  state.editors.push({
    ...owner,
    invitedBy: null,
    createdAt: Date.now(),
  });
  await writeSiteState(state);
  return owner;
}
