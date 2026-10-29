import type { Metadata } from "next";
import { AlbumUploader } from "../components/album-uploader";
import { PhotoAlbum } from "../components/photo-album";
import { SiteFooter } from "../components/site-footer";
import { SubpageHeader } from "../components/subpage-header";

export const metadata: Metadata = {
  title: "照片簿 | 妍的可爱宇宙",
  description: "可以翻页，也可以在当前设备添加私人照片的可爱照片簿。",
};

export default function AlbumPage() {
  return (
    <main className="subpage album-page-route">
      <SubpageHeader
        label="04 / PHOTO ALBUM"
        title="私人照片簿"
        description="选择照片后会在当前设备生成私人照片墙，不会自动上传到公开网络。"
      />
      <AlbumUploader />
      <PhotoAlbum />
      <nav className="next-page-actions" aria-label="继续浏览">
        <a href="/food/"><span>BACK 03</span>← 返回好吃清单</a>
        <a href="/characters/"><span>BACK 01</span>← 返回玩偶图鉴</a>
      </nav>
      <SiteFooter />
    </main>
  );
}
