"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { ContentKind } from "../../lib/content";

type PublicItem = {
  id: string;
  title: string;
  subtitle: string | null;
  note: string | null;
  imageKey: string | null;
};

type SharedContentBoardProps = {
  kind: ContentKind;
  eyebrow: string;
  title: string;
  description: string;
  emptyText: string;
  accent: string;
};

export function SharedContentBoard({
  kind,
  eyebrow,
  title,
  description,
  emptyText,
  accent,
}: SharedContentBoardProps) {
  const [items, setItems] = useState<PublicItem[]>([]);
  const [status, setStatus] = useState("正在读取最新内容…");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/content?kind=${kind}`, { signal: controller.signal })
      .then(async (response) => {
        const data = (await response.json()) as { items?: PublicItem[]; error?: string };
        if (!response.ok) throw new Error(data.error);
        setItems(data.items ?? []);
        setStatus("");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("最新内容暂时没有加载出来");
      });
    return () => controller.abort();
  }, [kind]);

  return (
    <section
      className={`shared-content-section shared-content-${kind}`}
      style={{ "--content-accent": accent } as CSSProperties}
    >
      <div className="local-content-heading">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      {status && <p className="shared-status" aria-live="polite">{status}</p>}
      {!status && items.length === 0 && (
        <div className="shared-empty">
          <span>✦</span>
          <p>{emptyText}</p>
          <a href="/admin/">登录编辑后台添加</a>
        </div>
      )}

      {items.length > 0 && (
        <div className="shared-entry-grid">
          {items.map((item) => (
            <article key={item.id}>
              {item.imageKey ? (
                <img src={`/api/media/${encodeURIComponent(item.imageKey)}`} alt={item.title} />
              ) : (
                <div className="entry-placeholder">{item.title.slice(0, 1)}</div>
              )}
              <div>
                {item.subtitle && <span>{item.subtitle}</span>}
                <h3>{item.title}</h3>
                {item.note && <p>{item.note}</p>}
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="shared-editor-link">
        <span>站长和协作者</span>
        <a href="/admin/">进入编辑后台 →</a>
      </div>
    </section>
  );
}
