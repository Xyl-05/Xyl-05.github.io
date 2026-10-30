export async function POST() {
  return Response.json({ error: "请从后台登录页面进入" }, { status: 410 });
}
