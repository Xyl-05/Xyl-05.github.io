import { eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { contentItems } from "../../../../../db/schema";
import { apiAuthError, getApiEditor } from "../../../../../lib/api-auth";
import { cleanText, safeImageName } from "../../../../../lib/content";
import { getMediaBucket } from "../../../../../lib/media";

export const dynamic = "force-dynamic";
const MAX_IMAGE_SIZE = 12 * 1024 * 1024;

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await getApiEditor();
  if (auth.status !== "ok") return apiAuthError(auth.status);
  const { id } = await context.params;
  const db = getDb();
  const [current] = await db
    .select()
    .from(contentItems)
    .where(eq(contentItems.id, id))
    .limit(1);
  if (!current) return Response.json({ error: "内容不存在" }, { status: 404 });

  const form = await request.formData();
  const title = cleanText(form.get("title"), 100);
  const subtitle = cleanText(form.get("subtitle"), 120);
  const note = cleanText(form.get("note"), 800);
  if (!title) return Response.json({ error: "标题不能为空" }, { status: 400 });

  const image = form.get("image");
  if (image instanceof File && image.size > MAX_IMAGE_SIZE) {
    return Response.json({ error: "图片不能超过 12MB" }, { status: 400 });
  }
  if (image instanceof File && image.size && !image.type.startsWith("image/")) {
    return Response.json({ error: "只能上传图片文件" }, { status: 400 });
  }

  let imageKey = current.imageKey;
  let imageName = current.imageName;
  let newlyUploadedKey: string | null = null;
  const shouldRemoveImage = form.get("removeImage") === "1";
  try {
    if (image instanceof File && image.size) {
      imageName = safeImageName(image.name);
      newlyUploadedKey = `${id}-${crypto.randomUUID()}-${imageName}`;
      await getMediaBucket().put(newlyUploadedKey, await image.arrayBuffer(), {
        httpMetadata: { contentType: image.type },
        customMetadata: { originalName: image.name },
      });
      imageKey = newlyUploadedKey;
    } else if (shouldRemoveImage) {
      imageKey = null;
      imageName = null;
    }

    await db
      .update(contentItems)
      .set({
        title,
        subtitle: subtitle || null,
        note: note || null,
        imageKey,
        imageName,
        updatedAt: Date.now(),
      })
      .where(eq(contentItems.id, id));

    if (current.imageKey && current.imageKey !== imageKey) {
      await getMediaBucket().delete(current.imageKey).catch(() => undefined);
    }
    return Response.json({ ok: true });
  } catch (error) {
    if (newlyUploadedKey) {
      await getMediaBucket().delete(newlyUploadedKey).catch(() => undefined);
    }
    console.error(error);
    return Response.json({ error: "修改失败，请稍后再试" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await getApiEditor();
  if (auth.status !== "ok") return apiAuthError(auth.status);
  const { id } = await context.params;
  const db = getDb();
  const [current] = await db
    .select()
    .from(contentItems)
    .where(eq(contentItems.id, id))
    .limit(1);
  if (!current) return Response.json({ error: "内容不存在" }, { status: 404 });

  await db.delete(contentItems).where(eq(contentItems.id, id));
  if (current.imageKey) {
    await getMediaBucket().delete(current.imageKey).catch(() => undefined);
  }
  return Response.json({ ok: true });
}
