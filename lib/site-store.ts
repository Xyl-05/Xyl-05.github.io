import { del, get, put } from "@vercel/blob";
import type { ContentKind } from "./content";

export type StoredContentItem = {
  id: string;
  kind: ContentKind;
  title: string;
  subtitle: string | null;
  note: string | null;
  imageKey: string | null;
  imageName: string | null;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
};

export type StoredEditor = {
  userId: string;
  email: string;
  displayName: string;
  role: "owner" | "editor";
  invitedBy: string | null;
  createdAt: number;
};

export type StoredInvite = {
  email: string;
  invitedBy: string;
  createdAt: number;
};

export type SiteState = {
  contentItems: StoredContentItem[];
  editors: StoredEditor[];
  editorInvites: StoredInvite[];
};

const STATE_PATH = "site-data/content.json";
const emptyState = (): SiteState => ({
  contentItems: [],
  editors: [],
  editorInvites: [],
});

export async function readSiteState(): Promise<SiteState> {
  const result = await get(STATE_PATH, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return emptyState();
  try {
    const parsed = (await new Response(result.stream).json()) as Partial<SiteState>;
    return {
      contentItems: Array.isArray(parsed.contentItems) ? parsed.contentItems : [],
      editors: Array.isArray(parsed.editors) ? parsed.editors : [],
      editorInvites: Array.isArray(parsed.editorInvites) ? parsed.editorInvites : [],
    };
  } catch {
    return emptyState();
  }
}

export async function writeSiteState(state: SiteState) {
  await put(STATE_PATH, JSON.stringify(state), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
  });
}

export async function uploadMedia(key: string, file: File) {
  await put(`media/${key}`, file, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: false,
    contentType: file.type || "application/octet-stream",
  });
}

export async function readMedia(key: string) {
  return get(`media/${key}`, { access: "private", useCache: true });
}

export async function deleteMedia(key: string) {
  await del(`media/${key}`);
}
