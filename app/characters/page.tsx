import type { Metadata } from "next";
import { SiteFooter } from "../components/site-footer";
import { SubpageHeader } from "../components/subpage-header";
import { SharedContentBoard } from "../components/shared-content-board";
import { assetPaths, toyFriends } from "../content/site-content";

export const metadata: Metadata = {
  title: "玩偶图鉴 | 妍的可爱宇宙",
  description: "以小玉 YUY 为主角的玩偶与卡通形象收藏。",
};

export default function CharactersPage() {
  return (
    <main className="subpage characters-page">
      <SubpageHeader
        label="01 / CHARACTER ARCHIVE"
        title="玩偶图鉴"
        description="YUY 永远站在中心位，其他可爱角色作为收藏宇宙里的朋友出现。"
      />

      <section className="character-spotlight">
        <div className="character-spotlight-image">
          <span>★ NO.1</span>
          <img src={assetPaths.yuyFlower} alt="小玉 YUY 花朵主题原作插画" />
        </div>
        <div className="character-spotlight-copy">
          <small>ABSOLUTE FAVORITE</small>
          <h2>小玉 YUY</h2>
          <p>这是整个个人 IP 网站最重要的视觉主角。首页、照片簿和角色收藏都会保留它的中心位置。</p>
          <div><span>主角位</span><span>可爱担当</span><span>收藏中心</span></div>
        </div>
      </section>

      <section className="friends-archive">
        <div className="subsection-heading"><span>FRIENDS LIST</span><h2>可爱朋友们</h2></div>
        <div className="friends-archive-grid">
          {toyFriends.map((friend, index) => (
            <article key={friend.name}>
              <span>0{index + 2}</span>
              <img src={friend.image} alt={friend.alt} />
              <h3>{friend.name}</h3>
              <p>收藏宇宙的常驻成员</p>
            </article>
          ))}
        </div>
      </section>

      <SharedContentBoard
        kind="characters"
        eyebrow="MORE CHARACTERS"
        title="继续扩大的收藏"
        description="站长和协作者可以从统一后台补充新的卡通角色、玩偶名字和真实照片。"
        emptyText="后台还没有添加新的玩偶。"
        accent="#ff8fb1"
      />

      <nav className="next-page-actions" aria-label="继续浏览">
        <a href="/drinks/"><span>NEXT 02</span>去看奶茶地图 →</a>
        <a href="/food/"><span>NEXT 03</span>打开好吃清单 →</a>
      </nav>
      <SiteFooter />
    </main>
  );
}
