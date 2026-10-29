import type { Metadata } from "next";
import { PhotoAlbum } from "../components/photo-album";
import { SharedContentBoard } from "../components/shared-content-board";
import { SiteFooter } from "../components/site-footer";
import { SubpageHeader } from "../components/subpage-header";

export const metadata: Metadata = {
  title: "照片簿 | 妍的可爱宇宙",
  description: "可以翻页，也可以由站长和协作者持续更新的可爱照片簿。",
};

export default function AlbumPage() {
  return (
    <main className="subpage album-page-route">
      <SubpageHeader
        label="04 / PHOTO ALBUM"
        title="可爱照片簿"
        description="保留翻页相册，也把站长和协作者从后台发布的新照片收进同一个空间。"
      />
      <SharedContentBoard
        kind="album"
        eyebrow="NEW PHOTOS"
        title="最近加入的照片"
        description="后台上传的照片会在这里同步展示给所有访客。"
        emptyText="后台还没有添加新的照片。"
        accent="#ffd84c"
      />
      <PhotoAlbum />
      <nav className="next-page-actions" aria-label="继续浏览">
        <a href="/food/"><span>BACK 03</span>← 返回好吃清单</a>
        <a href="/characters/"><span>BACK 01</span>← 返回玩偶图鉴</a>
      </nav>
      <SiteFooter />
    </main>
  );
}
