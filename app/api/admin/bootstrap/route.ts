import { getChatGPTUser } from "../../../chatgpt-auth";
import { createFirstOwner, hasOwner } from "../../../../lib/editor-access";
import { getBootstrapCode } from "../../../../lib/media";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) {
    return Response.json({ error: "请先登录" }, { status: 401 });
  }
  if (await hasOwner()) {
    return Response.json({ error: "站长账号已经建立" }, { status: 409 });
  }

  const body = (await request.json().catch(() => null)) as { code?: string } | null;
  const expectedCode = getBootstrapCode();
  if (!expectedCode || body?.code?.trim() !== expectedCode) {
    return Response.json({ error: "站长启用码不正确" }, { status: 403 });
  }

  const owner = await createFirstOwner(user);
  if (!owner) {
    return Response.json({ error: "站长账号已经建立" }, { status: 409 });
  }
  return Response.json({ ok: true, owner });
}
