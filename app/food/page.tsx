import type { Metadata } from "next";
import { SharedContentBoard } from "../components/shared-content-board";
import { SiteFooter } from "../components/site-footer";
import { SubpageHeader } from "../components/subpage-header";

export const metadata: Metadata = {
  title: "好吃清单 | 妍的可爱宇宙",
  description: "记录喜欢的食物、想吃清单和明确忌口。",
};

export default function FoodPage() {
  return (
    <main className="subpage food-page">
      <SubpageHeader
        label="03 / FOOD NOTES"
        title="好吃清单"
        description="喜欢好多好吃的，也认真记住点单时不能出现的香菜和芹菜。"
      />

      <section className="food-rules-section">
        <article className="food-yes-card">
          <span>YES, PLEASE!</span>
          <div className="food-smile" aria-hidden="true">☺</div>
          <h2>好多好吃的<br />都想试试</h2>
          <p>不把喜好限制成几样固定答案，遇到新的好吃的就继续往清单里加。</p>
        </article>
        <article className="food-no-card">
          <span>ORDER RULES</span>
          <h2>明确忌口</h2>
          <div><b>香菜</b><em>NO</em></div>
          <div><b>芹菜</b><em>NO</em></div>
          <p>点单前先确认，快乐吃饭不踩雷。</p>
        </article>
      </section>

      <section className="food-mood-section">
        <div className="subsection-heading"><span>FOOD MOOD</span><h2>今天想吃什么？</h2></div>
        <div className="food-mood-grid">
          <article><span>01</span><h3>发现新店</h3><p>看到有趣的菜单，就先收进想吃清单。</p></article>
          <article><span>02</span><h3>拍照记录</h3><p>好吃也好看的，当然值得留下一张照片。</p></article>
          <article><span>03</span><h3>下次再吃</h3><p>真正喜欢的味道，记下来方便再次点单。</p></article>
        </div>
      </section>

      <SharedContentBoard
        kind="food"
        eyebrow="MORE FOOD NOTES"
        title="新发现的好吃记录"
        description="从统一后台发布食物、店名、口味、好吃备注和真实照片。"
        emptyText="后台还没有添加新的好吃记录。"
        accent="#72d6a5"
      />

      <nav className="next-page-actions" aria-label="继续浏览">
        <a href="/drinks/"><span>BACK 02</span>← 返回奶茶地图</a>
        <a href="/album/"><span>NEXT 04</span>打开照片簿 →</a>
      </nav>
      <SiteFooter />
    </main>
  );
}
