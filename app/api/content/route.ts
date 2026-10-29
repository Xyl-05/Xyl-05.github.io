import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { contentItems } from "../../../db/schema";
import { isContentKind } from "../../../lib/content";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const kind = new URL(request.url).searchParams.get("kind");
  if (!isContentKind(kind)) {
    return Response.json({ error: "内容分类不正确" }, { status: 400 });
  }

  const items = await getDb()
    .select({
      id: contentItems.id,
      kind: contentItems.kind,
      title: contentItems.title,
      subtitle: contentItems.subtitle,
      note: contentItems.note,
      imageKey: contentItems.imageKey,
      imageName: contentItems.imageName,
      createdAt: contentItems.createdAt,
      updatedAt: contentItems.updatedAt,
    })
    .from(contentItems)
    .where(eq(contentItems.kind, kind))
    .orderBy(desc(contentItems.updatedAt));

  return Response.json({ items });
}
