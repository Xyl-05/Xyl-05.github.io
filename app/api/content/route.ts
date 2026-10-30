import { isContentKind } from "../../../lib/content";
import { readSiteState } from "../../../lib/site-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const kind = new URL(request.url).searchParams.get("kind");
  if (!isContentKind(kind)) {
    return Response.json({ error: "内容分类不正确" }, { status: 400 });
  }

  const state = await readSiteState();
  const items = state.contentItems
    .filter((item) => item.kind === kind)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return Response.json({ items });
}
