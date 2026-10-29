"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type StoredPhoto = {
  id: string;
  name: string;
  blob: Blob;
  createdAt: number;
};

type PreviewPhoto = StoredPhoto & { url: string };

const DB_NAME = "yan-private-photo-album";
const STORE_NAME = "photos";
const MAX_FILE_SIZE = 12 * 1024 * 1024;

function openPhotoDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readPhotos() {
  const database = await openPhotoDatabase();
  return new Promise<StoredPhoto[]>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result as StoredPhoto[]);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

async function savePhoto(photo: StoredPhoto) {
  const database = await openPhotoDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(photo);
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => reject(transaction.error);
  });
}

async function removePhoto(id: string) {
  const database = await openPhotoDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(id);
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => reject(transaction.error);
  });
}

export function AlbumUploader() {
  const [photos, setPhotos] = useState<PreviewPhoto[]>([]);
  const [message, setMessage] = useState("还没有添加私人照片");
  const previewsRef = useRef<PreviewPhoto[]>([]);

  const refreshPhotos = useCallback(async () => {
    previewsRef.current.forEach((photo) => URL.revokeObjectURL(photo.url));
    const storedPhotos = (await readPhotos()).sort((a, b) => b.createdAt - a.createdAt);
    const previews = storedPhotos.map((photo) => ({ ...photo, url: URL.createObjectURL(photo.blob) }));
    previewsRef.current = previews;
    setPhotos(previews);
    setMessage(previews.length ? `当前设备已保存 ${previews.length} 张照片` : "还没有添加私人照片");
  }, []);

  useEffect(() => {
    refreshPhotos().catch(() => setMessage("当前浏览器暂时无法保存照片"));
    return () => previewsRef.current.forEach((photo) => URL.revokeObjectURL(photo.url));
  }, [refreshPhotos]);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const validFiles = Array.from(files).filter((file) => file.type.startsWith("image/") && file.size <= MAX_FILE_SIZE);
    if (!validFiles.length) {
      setMessage("请选择 JPG、PNG、WebP 等图片，每张不超过 12MB");
      return;
    }

    try {
      setMessage("正在保存到当前设备…");
      await Promise.all(validFiles.map((file, index) => savePhoto({
        id: `${Date.now()}-${index}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`,
        name: file.name,
        blob: file,
        createdAt: Date.now() + index,
      })));
      await refreshPhotos();
    } catch {
      setMessage("保存失败，请检查浏览器是否允许本地存储");
    }
  };

  const handleRemove = async (id: string) => {
    await removePhoto(id);
    await refreshPhotos();
  };

  return (
    <section className="upload-section" aria-labelledby="upload-title">
      <div className="upload-panel">
        <div className="upload-copy">
          <span>PRIVATE ON THIS DEVICE</span>
          <h2 id="upload-title">怎么添加照片？</h2>
          <ol>
            <li>点击“选择照片”按钮</li>
            <li>从手机或电脑选择一张或多张图片</li>
            <li>照片会出现在下面的私人照片墙</li>
          </ol>
          <p>照片只保存在当前设备的这个浏览器里，不会被上传到公开网站，也不会被其他访客看到。</p>
        </div>
        <div className="upload-action">
          <input
            id="private-photo-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              void handleFiles(event.target.files);
              event.currentTarget.value = "";
            }}
          />
          <label htmlFor="private-photo-upload">＋ 选择照片</label>
          <small>支持多选 · 单张不超过 12MB</small>
          <strong aria-live="polite">{message}</strong>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="private-photo-grid">
          {photos.map((photo, index) => (
            <figure key={photo.id}>
              <img src={photo.url} alt={`私人照片 ${index + 1}`} />
              <figcaption><span>{photo.name}</span><button onClick={() => handleRemove(photo.id)} aria-label={`删除 ${photo.name}`}>删除</button></figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
