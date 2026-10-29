import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { SiteFooter } from "../components/site-footer";
import { SubpageHeader } from "../components/subpage-header";
import { teaBrands } from "../content/site-content";

export const metadata: Metadata = {
  title: "奶茶地图 | 妍的可爱宇宙",
  description: "喜茶、爷爷不泡茶和古茗组成的真实奶茶偏好地图。",
};

export default function DrinksPage() {
  const favorite = teaBrands.find((brand) => brand.favorite) ?? teaBrands[0];

  return (
    <main className="subpage drinks-page">
      <SubpageHeader
        label="02 / MILK TEA MAP"
        title="奶茶地图"
        description="这里记录的是实际喜欢喝的品牌和口味，不是配色，也不是虚构的奶茶名字。"
      />

      <section className="drink-favorite">
        <div className="drink-favorite-copy">
          <span>{favorite.rank} · ABSOLUTE FAVORITE</span>
          <h2>{favorite.name}</h2>
          <p>{favorite.note}</p>
          <div><b>♥ 最喜欢</b><small>{favorite.drink}</small></div>
        </div>
        <figure>
          <img src={favorite.image} alt={favorite.alt} />
          <figcaption>REAL BRAND · REAL PHOTO</figcaption>
        </figure>
      </section>

      <section className="drink-menu-section">
        <div className="subsection-heading"><span>DRINK PICKS</span><h2>今天想喝哪一杯？</h2></div>
        <div className="drink-menu-grid">
          {teaBrands.map((brand) => (
            <article key={brand.name} style={{ "--drink-accent": brand.color } as CSSProperties}>
              <div className="drink-card-photo"><img src={brand.image} alt={brand.alt} /><span>{brand.rank}</span></div>
              <div className="drink-card-copy">
                <small>{brand.favorite ? "TOP FAVORITE" : "ALSO LIKE"}</small>
                <h3>{brand.name}</h3>
                <b>{brand.drink}</b>
                <p>{brand.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="drink-note">
        <span>ORDER NOTE</span>
        <p>点单时先看茶底和清爽度，茉莉奶绿是明确喜欢的方向。</p>
      </aside>

      <nav className="next-page-actions" aria-label="继续浏览">
        <a href="/characters/"><span>BACK 01</span>← 返回玩偶图鉴</a>
        <a href="/album/"><span>NEXT 03</span>打开照片簿 →</a>
      </nav>
      <SiteFooter />
    </main>
  );
}
