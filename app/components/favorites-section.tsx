import { teaBrands } from "../content/site-content";

export function FavoritesSection() {
  const favoriteBrand = teaBrands.find((brand) => brand.favorite);

  return (
    <section className="likes" id="favorites">
      <div className="section-title">
        <span>02 / HER FAVORITES</span>
        <h2>妍的偏好清单</h2>
        <p>奶茶、好吃的和拍照习惯，各自放进专属卡片。</p>
      </div>

      <div className="like-grid">
        <article className="like-card tea-card" id="drinks">
          <div className="card-index">A</div>
          <div className="tea-photos">
            {teaBrands.map((brand) => (
              <figure className={brand.favorite ? "tea-photo-main" : undefined} key={brand.name}>
                <img src={brand.image} alt={brand.alt} />
                <figcaption>{brand.favorite ? `最喜欢 · ${brand.name}` : brand.name}</figcaption>
              </figure>
            ))}
          </div>
          <div className="card-copy">
            <span className="mini-label">MILK TEA MAP</span>
            <h3>奶茶雷达</h3>
            <div className="brand-list">
              {teaBrands.map((brand) => (
                <p key={brand.name}>
                  <span>{brand.favorite ? "TOP 1" : "ALSO"}</span>
                  <b>{brand.name}</b>
                  {brand.favorite && <i>♥ 最喜欢</i>}
                </p>
              ))}
            </div>
            <p className="sr-only">最喜欢的奶茶品牌是{favoriteBrand?.name}。</p>
          </div>
        </article>

        <article className="like-card food-card" id="food">
          <div className="card-index">B</div>
          <div className="food-face" aria-hidden="true">☺</div>
          <div className="card-copy">
            <span className="mini-label">FOOD RULES</span>
            <h3>好吃雷达</h3>
            <p className="big-copy">好多好吃的<br /><em>都喜欢！</em></p>
            <div className="no-list"><span>香菜 NO</span><span>芹菜 NO</span></div>
          </div>
        </article>

        <article className="like-card camera-card" id="camera">
          <div className="card-index">C</div>
          <div className="camera-icon" aria-hidden="true"><span /><i /></div>
          <div className="card-copy">
            <span className="mini-label">HOBBY MODE</span>
            <h3>随手拍</h3>
            <p>镜头打开，<br />普通日常也有主角光环。</p>
            <span className="click-sticker">CLICK! CLICK!</span>
          </div>
        </article>
      </div>
    </section>
  );
}
