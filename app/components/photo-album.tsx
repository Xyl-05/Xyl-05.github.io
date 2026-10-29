"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { albumPages, assetPaths } from "../content/site-content";

export function PhotoAlbum() {
  const [page, setPage] = useState(0);
  const [turning, setTurning] = useState(false);

  const turn = useCallback((direction: number) => {
    if (turning) return;
    setTurning(true);
    window.setTimeout(() => {
      setPage((current) => (current + direction + albumPages.length) % albumPages.length);
      setTurning(false);
    }, 220);
  }, [turning]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") turn(1);
      if (event.key === "ArrowLeft") turn(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turn]);

  const current = albumPages[page];

  return (
    <section className="album-section" id="album">
      <div className="album-heading">
        <div><span>03 / PHOTO ALBUM</span><h2>翻一翻，<br />妍的照片簿</h2></div>
        <p>点击左右按钮，或者用键盘方向键翻页。<br />现在是示意照片，之后可以替换成她的真实照片。</p>
      </div>

      <div className="album-wrap">
        <div className="album-dots" />
        <div className="book-spine"><span /><span /><span /><span /><span /></div>
        <div className={`album-page ${turning ? "is-turning" : ""}`}>
          <div className="photo-side">
            <div className="photo-frame" style={{ "--accent": current.color } as CSSProperties}>
              <img src={current.image} alt={`${current.title}相册示意照片`} />
              <span>{current.number}</span>
            </div>
            <span className="photo-tape" />
          </div>
          <div className="note-side">
            <span className="page-count">PAGE {page + 1} / {albumPages.length}</span>
            <span className="tiny-yuy"><img src={assetPaths.yuyMain} alt="小玉 YUY 卡通形象" /></span>
            <h3>{current.title}</h3>
            <p>{current.note}</p>
            <div className="doodle-line">✦ · ✿ · ✦ · ✿ · ✦</div>
          </div>
        </div>

        <div className="album-controls">
          <button onClick={() => turn(-1)} aria-label="上一张照片">←</button>
          <div>
            {albumPages.map((item, index) => (
              <button
                key={item.number}
                onClick={() => setPage(index)}
                className={index === page ? "active" : ""}
                aria-label={`查看第 ${index + 1} 页`}
                aria-current={index === page ? "page" : undefined}
              />
            ))}
          </div>
          <button onClick={() => turn(1)} aria-label="下一张照片">→</button>
        </div>
      </div>
    </section>
  );
}
