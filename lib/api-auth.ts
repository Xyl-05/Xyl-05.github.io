import { getChatGPTUser } from "../app/chatgpt-auth";
import { resolveEditor } from "./editor-access";

export async function getApiEditor() {
  const user = await getChatGPTUser();
  if (!user) return { status: "unauthenticated" as const };
  const access = await resolveEditor(user);
  if (!access) return { status: "forbidden" as const, user };
  return { status: "ok" as const, user, access };
}

export function apiAuthError(status: "unauthenticated" | "forbidden") {
  return Response.json(
    {
      error:
        status === "unauthenticated"
          ? "请先登录编辑后台"
          : "这个账号还没有编辑权限",
    },
    { status: status === "unauthenticated" ? 401 : 403 },
  );
}
