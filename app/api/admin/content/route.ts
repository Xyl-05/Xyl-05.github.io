import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { contentItems } from "../../../../db/schema";
import { apiAuthError, getApiEditor } from "../../../../lib/api-auth";
import {
  cleanText,
  isContentKind,
  safeImageName,
} from "../../../../lib/content";
import { getMediaBucket } from "../../../../lib/media";

export const dynamic = "force-dynamic";
const MAX_IMAGE_SIZE = 12 * 1024 * 1024;

export async function GET(request: Request) {
  const auth = await getApiEditor();
  if (auth.status !== "ok") return apiAuthError(auth.status);

  const kind = new URL(request.url).searchParams.get("kind");
  if (!isContentKind(kind)) {
    return Response.json({ error: "内容分类不正确" }, { status: 400 });
  }
  const items = await getDb()
    .select()
    .from(contentItems)
    .where(eq(contentItems.kind, kind))
    .orderBy(desc(contentItems.updatedAt));
  return Response.json({ items });
}

export async function POST(request: Request) {
  const auth = await getApiEditor();
  if (auth.status !== "ok") return apiAuthError(auth.status);

  const form = await request.formData();
  const kind = cleanText(form.get("kind"), 30);
  const title = cleanText(form.get("title"), 100);
  const subtitle = cleanText(form.get("subtitle"), 120);
  const note = cleanText(form.get("note"), 800);
  if (!isContentKind(kind) || !title) {
    return Response.json({ error: "请填写标题并选择正确分类" }, { status: 400 });
  }

  const image = form.get("image");
  if (image instanceof File && image.size > MAX_IMAGE_SIZE) {
    return Response.json({ error: "图片不能超过 12MB" }, { status: 400 });
  }
  if (image instanceof File && image.size && !image.type.startsWith("image/")) {
    return Response.json({ error: "只能上传图片文件" }, { status: 400 });
  }

  const id = crypto.randomUUID();
  let imageKey: string | null = null;
  let imageName: string | null = null;
  try {
    if (image instanceof File && image.size) {
      imageName = safeImageName(image.name);
      imageKey = `${id}-${imageName}`;
      await getMediaBucket().put(imageKey, await image.arrayBuffer(), {
        httpMetadata: { contentType: image.type },
        customMetadata: { originalName: image.name },
      });
    }

    const now = Date.now();
    const item = {
      id,
      kind,
      title,
      subtitle: subtitle || null,
      note: note || null,
      imageKey,
      imageName,
      createdBy: auth.access.userId,
      createdAt: now,
      updatedAt: now,
    };
    await getDb().insert(contentItems).values(item);
    return Response.json({ item }, { status: 201 });
  } catch (error) {
    if (imageKey) await getMediaBucket().delete(imageKey).catch(() => undefined);
    console.error(error);
    return Response.json({ error: "保存失败，请稍后再试" }, { status: 500 });
  }
}
