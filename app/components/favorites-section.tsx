import { teaBrands } from "../content/site-content";

export function FavoritesSection() {
  const favoriteBrand = teaBrands.find((brand) => brand.favorite) ?? teaBrands[0];
  const otherBrands = teaBrands.filter((brand) => !brand.favorite);

  return (
    <section className="likes" id="favorites">
      <div className="section-title">
        <span>02 / HER FAVORITES</span>
        <h2>妍的偏好清单</h2>
        <p>奶茶、好吃的和拍照习惯，各自放进专属区域。</p>
      </div>

      <article className="tea-showcase" id="drinks">
        <div className="tea-showcase-copy">
          <span className="tea-kicker">MILK TEA MAP · TOP PICK</span>
          <h3>奶茶不只是<br />一张品牌清单</h3>
          <p><b>{favoriteBrand.name}</b>排在第一位。喜欢的不是“奶茶色”，而是真正会去喝的奶茶品牌和单品。</p>
          <div className="tea-brand-chips">
            {teaBrands.map((brand) => <span key={brand.name}>{brand.name}</span>)}
          </div>
          <a className="section-button" href="/drinks/">打开完整奶茶地图 <b>→</b></a>
        </div>

        <div className="tea-showcase-visual">
          <figure className="tea-feature-card">
            <img src={favoriteBrand.image} alt={favoriteBrand.alt} />
            <figcaption><span>{favoriteBrand.rank}</span><b>{favoriteBrand.name}</b><small>最喜欢</small></figcaption>
          </figure>
          <div className="tea-mini-stack">
            {otherBrands.map((brand) => (
              <figure key={brand.name}>
                <img src={brand.image} alt={brand.alt} />
                <figcaption><span>{brand.rank}</span><b>{brand.name}</b></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </article>

      <div className="secondary-like-grid">
        <article className="like-card food-card" id="food">
          <div className="card-index">B</div>
          <div className="food-face" aria-hidden="true">☺</div>
          <div className="card-copy">
            <span className="mini-label">FOOD RULES</span>
            <h3>好吃雷达</h3>
            <p className="big-copy">好多好吃的<br /><em>都喜欢！</em></p>
            <div className="no-list"><span>香菜 NO</span><span>芹菜 NO</span></div>
            <a className="mini-action" href="/food/">打开好吃清单 →</a>
          </div>
        </article>

        <article className="like-card camera-card" id="camera">
          <div className="card-index">C</div>
          <div className="camera-icon" aria-hidden="true"><span /><i /></div>
          <div className="card-copy">
            <span className="mini-label">HOBBY MODE</span>
            <h3>随手拍</h3>
            <p>镜头打开，<br />普通日常也有主角光环。</p>
            <a className="mini-action" href="/album/">去照片簿 →</a>
          </div>
        </article>
      </div>
    </section>
  );
}
