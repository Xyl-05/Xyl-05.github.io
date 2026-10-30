import { readMedia } from "../../../../lib/site-store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string }> },
) {
  const { key } = await context.params;
  const object = await readMedia(key);
  if (!object || object.statusCode !== 200) return new Response("Not found", { status: 404 });

  return new Response(object.stream, {
    headers: {
      "content-type": object.blob.contentType ?? "application/octet-stream",
      "cache-control": "public, max-age=31536000, immutable",
      ...(object.blob.etag ? { etag: object.blob.etag } : {}),
    },
  });
}
