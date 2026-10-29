import { env } from "cloudflare:workers";

type StoredMedia = {
  body: BodyInit;
  httpMetadata?: { contentType?: string };
  customMetadata?: Record<string, string>;
  etag?: string;
};

type MediaBucket = {
  put(
    key: string,
    value: ArrayBuffer,
    options?: {
      httpMetadata?: { contentType?: string };
      customMetadata?: Record<string, string>;
    },
  ): Promise<unknown>;
  get(key: string): Promise<StoredMedia | null>;
  delete(key: string): Promise<void>;
};

export function getMediaBucket(): MediaBucket {
  const bucket = (env as unknown as { MEDIA?: MediaBucket }).MEDIA;
  if (!bucket) {
    throw new Error("图片存储暂未连接");
  }
  return bucket;
}

export function getBootstrapCode() {
  return (
    (env as unknown as { ADMIN_BOOTSTRAP_CODE?: string })
      .ADMIN_BOOTSTRAP_CODE ?? ""
  );
}
