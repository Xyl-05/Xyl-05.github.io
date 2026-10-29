"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

type ContentKind = "characters" | "drinks" | "food";

type StoredEntry = {
  id: string;
  kind: ContentKind;
  title: string;
  subtitle: string;
  note: string;
  image?: Blob;
  createdAt: number;
};

type PreviewEntry = StoredEntry & { imageUrl?: string };

type LocalContentBoardProps = {
  kind: ContentKind;
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  noteLabel: string;
  emptyText: string;
  accent: string;
};

const DATABASE_NAME = "yan-personal-content";
const STORE_NAME = "entries";
const MAX_IMAGE_SIZE = 12 * 1024 * 1024;

function openContentDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readEntries(kind: ContentKind) {
  const database = await openContentDatabase();
  return new Promise<StoredEntry[]>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve((request.result as StoredEntry[]).filter((entry) => entry.kind === kind));
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

async function writeEntry(entry: StoredEntry) {
  const database = await openContentDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(entry);
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => reject(transaction.error);
  });
}

async function deleteEntry(id: string) {
  const database = await openContentDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(id);
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => reject(transaction.error);
  });
}

export function LocalContentBoard({
  kind,
  eyebrow,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  noteLabel,
  emptyText,
  accent,
}: LocalContentBoardProps) {
  const [entries, setEntries] = useState<PreviewEntry[]>([]);
  const [entryTitle, setEntryTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState<File>();
  const [status, setStatus] = useState(emptyText);
  const previewsRef = useRef<PreviewEntry[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshEntries = useCallback(async () => {
    previewsRef.current.forEach((entry) => entry.imageUrl && URL.revokeObjectURL(entry.imageUrl));
    const storedEntries = (await readEntries(kind)).sort((a, b) => b.createdAt - a.createdAt);
    const previews = storedEntries.map((entry) => ({
      ...entry,
      imageUrl: entry.image ? URL.createObjectURL(entry.image) : undefined,
    }));
    previewsRef.current = previews;
    setEntries(previews);
    setStatus(previews.length ? `当前设备已保存 ${previews.length} 条内容` : emptyText);
  }, [emptyText, kind]);

  useEffect(() => {
    refreshEntries().catch(() => setStatus("当前浏览器暂时无法保存内容"));
    return () => previewsRef.current.forEach((entry) => entry.imageUrl && URL.revokeObjectURL(entry.imageUrl));
  }, [refreshEntries]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!entryTitle.trim()) {
      setStatus(`请先填写${primaryLabel}`);
      return;
    }
    if (image && image.size > MAX_IMAGE_SIZE) {
      setStatus("图片不能超过 12MB");
      return;
    }

    try {
      setStatus("正在保存到当前设备…");
      await writeEntry({
        id: `${Date.now()}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`,
        kind,
        title: entryTitle.trim(),
        subtitle: subtitle.trim(),
        note: note.trim(),
        image,
        createdAt: Date.now(),
      });
      setEntryTitle("");
      setSubtitle("");
      setNote("");
      setImage(undefined);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await refreshEntries();
    } catch {
      setStatus("保存失败，请检查浏览器是否允许本地存储");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry(id);
      await refreshEntries();
    } catch {
      setStatus("删除失败，请稍后重试");
    }
  };

  return (
    <section className="local-content-section" style={{ "--content-accent": accent } as CSSProperties}>
      <div className="local-content-heading">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="local-content-editor">
        <form onSubmit={handleSubmit}>
          <label>
            <span>{primaryLabel} *</span>
            <input value={entryTitle} onChange={(event) => setEntryTitle(event.target.value)} placeholder={`填写${primaryLabel}`} />
          </label>
          <label>
            <span>{secondaryLabel}</span>
            <input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} placeholder={`填写${secondaryLabel}`} />
          </label>
          <label className="wide-field">
            <span>{noteLabel}</span>
            <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder={`写下${noteLabel}`} rows={3} />
          </label>
          <label className="wide-field file-field">
            <span>添加一张图片（可选）</span>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0])} />
          </label>
          <button type="submit">＋ 保存到这个页面</button>
          <small>只保存在当前设备，不会修改所有访客看到的公共内容。</small>
          <strong aria-live="polite">{status}</strong>
        </form>
      </div>

      {entries.length > 0 && (
        <div className="local-entry-grid">
          {entries.map((entry) => (
            <article key={entry.id}>
              {entry.imageUrl ? <img src={entry.imageUrl} alt={entry.title} /> : <div className="entry-placeholder">{entry.title.slice(0, 1)}</div>}
              <div>
                {entry.subtitle && <span>{entry.subtitle}</span>}
                <h3>{entry.title}</h3>
                {entry.note && <p>{entry.note}</p>}
                <button onClick={() => handleDelete(entry.id)} aria-label={`删除 ${entry.title}`}>删除</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
