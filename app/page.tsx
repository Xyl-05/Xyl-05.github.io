"use client";

import { useEffect, useState } from "react";

const pages = [
  {
    number: "01",
    title: "镜头里的小世界",
    note: "把普通的日子，拍成闪闪发光的碎片。",
    image: "/photo-1.jpg",
    color: "#ff8fb1",
  },
  {
    number: "02",
    title: "今日份可爱",
    note: "波点出现的时候，心情也会自动变好。",
    image: "/photo-2.jpg",
    color: "#7857ff",
  },
  {
    number: "03",
    title: "甜甜补给站",
    note: "茉莉奶绿在线，今天也是快乐满格。",
    image: "/photo-3.jpg",
    color: "#39b982",
  },
  {
    number: "04",
    title: "下次见面再拍",
    note: "相册未完待续，新的照片正在路上。",
    image: "/photo-4.jpg",
    color: "#ff725e",
  },
];

export default function Home() {
  const [page, setPage] = useState(0);
  const [turning, setTurning] = useState(false);

  const turn = (direction: number) => {
    if (turning) return;
    setTurning(true);
    window.setTimeout(() => {
      setPage((current) => (current + direction + pages.length) % pages.length);
      setTurning(false);
    }, 220);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") turn(1);
      if (event.key === "ArrowLeft") turn(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const current = pages[page];

  return (
    <main>
      <nav className="nav">
        <a className="logo" href="#top" aria-label="回到顶部"><span>妍</span> YAN&apos;S CLUB</a>
        <div className="nav-links">
          <a href="#toys">玩偶收藏</a>
          <a href="#likes">偏好清单</a>
          <a href="#album">翻页相册</a>
        </div>
        <span className="age-pill">20 YEARS COOL</span>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="eyebrow">MEET THE GIRL · VOL. 20</span>
          <h1><span>妍</span>的<br />可爱宇宙</h1>
          <p className="intro">爱拍照、爱波点，也爱收集生活里那些<br className="desktop" />不经意的小惊喜。</p>
          <a className="hero-button" href="#album">打开她的相册 <b>↘</b></a>
        </div>

        <div className="hero-art">
          <div className="sunburst" />
          <div className="poster-card">
            <span className="tape" />
            <img className="yuy-hero-photo" src="/yuy-art-main.png" alt="小玉 YUY 原作卡通形象" />
            <div className="poster-caption"><b>YUY</b><span>NO.1 FAVORITE DOLL</span></div>
          </div>
          <span className="scribble">so cute!</span>
          <span className="flower flower-one">✿</span>
          <span className="flower flower-two">✿</span>
          <span className="sticker-camera">▣<small>CLICK!</small></span>
        </div>
        <div className="marquee"><div>YUY DOLL · POLKA DOTS · PHOTO DAYS · MILK TEA · GOOD FOOD · <span>YUY DOLL · POLKA DOTS · PHOTO DAYS · MILK TEA · GOOD FOOD ·</span></div></div>
      </section>

      <section className="toy-section" id="toys">
        <div className="toy-heading">
          <span>01 / DOLL COLLECTION</span>
          <div><h2>YUY 是主角</h2><p>最喜欢的放在最中间，其他可爱朋友排排坐。</p></div>
        </div>
        <div className="toy-stage">
          <article className="toy-main">
            <img src="/yuy-art-flower.jpg" alt="小玉 YUY 花朵主题原作插画" />
            <div><span>ABSOLUTE FAVORITE</span><h3>小玉 YUY</h3><p>收藏架的中心位，当然要留给它。</p></div>
            <b>★ NO.1</b>
          </article>
          <div className="toy-friends" aria-label="其他喜欢的卡通玩偶">
            <figure><img src="/rilakkuma-art.png" alt="轻松熊卡通形象" /><figcaption>轻松熊</figcaption></figure>
            <figure><img src="/monchhichi-art.jpg" alt="萌趣趣卡通形象" /><figcaption>萌趣趣</figcaption></figure>
            <figure><img src="/hello-kitty-art.png" alt="Hello Kitty 卡通形象" /><figcaption>Hello Kitty</figcaption></figure>
            <figure><img src="/cinnamoroll-art.png" alt="玉桂狗卡通形象" /><figcaption>玉桂狗</figcaption></figure>
          </div>
        </div>
      </section>

      <section className="likes" id="likes">
        <div className="section-title">
          <span>02 / HER FAVORITES</span>
          <h2>妍的偏好清单</h2>
          <p>记住这些，就不会在点单时踩雷。</p>
        </div>

        <div className="like-grid">
          <article className="like-card tea-card">
            <div className="card-index">A</div>
            <div className="tea-photos">
              <figure className="tea-photo-main"><img src="/heytea.jpg" alt="喜茶饮品实拍" /><figcaption>最喜欢 · 喜茶</figcaption></figure>
              <figure><img src="/yeye-tea.png" alt="爷爷不泡茶官方饮品图" /><figcaption>爷爷不泡茶</figcaption></figure>
              <figure><img src="/guming.jpg" alt="古茗饮品实拍" /><figcaption>古茗</figcaption></figure>
            </div>
            <div className="card-copy">
              <span className="mini-label">MILK TEA MAP</span>
              <h3>奶茶雷达</h3>
              <div className="brand-list">
                <p><span>TOP 1</span><b>喜茶</b><i>♥ 最喜欢</i></p>
                <p><span>ALSO</span><b>爷爷不泡茶</b></p>
                <p><span>ALSO</span><b>古茗</b></p>
              </div>
            </div>
          </article>

          <article className="like-card food-card">
            <div className="card-index">B</div>
            <div className="food-face" aria-hidden="true">☺</div>
            <div className="card-copy">
              <span className="mini-label">FOOD RULES</span>
              <h3>好吃雷达</h3>
              <p className="big-copy">好多好吃的<br /><em>都喜欢！</em></p>
              <div className="no-list"><span>香菜 NO</span><span>芹菜 NO</span></div>
            </div>
          </article>

          <article className="like-card camera-card">
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
              <div className="photo-frame" style={{ "--accent": current.color } as React.CSSProperties}>
                <img src={current.image} alt={`${current.title}相册示意照片`} />
                <span>{current.number}</span>
              </div>
              <span className="photo-tape" />
            </div>
            <div className="note-side">
              <span className="page-count">PAGE {page + 1} / {pages.length}</span>
              <span className="tiny-yuy"><img src="/yuy-art-main.png" alt="小玉 YUY 卡通形象" /></span>
              <h3>{current.title}</h3>
              <p>{current.note}</p>
              <div className="doodle-line">✦ · ✿ · ✦ · ✿ · ✦</div>
            </div>
          </div>
          <div className="album-controls">
            <button onClick={() => turn(-1)} aria-label="上一张照片">←</button>
            <div>{pages.map((item, index) => <button key={item.number} onClick={() => setPage(index)} className={index === page ? "active" : ""} aria-label={`查看第 ${index + 1} 页`} />)}</div>
            <button onClick={() => turn(1)} aria-label="下一张照片">→</button>
          </div>
        </div>
      </section>

      <footer>
        <div><img className="footer-yuy" src="/yuy-art-main.png" alt="小玉 YUY 卡通形象" /><span>妍的可爱宇宙<br /><b>YUY APPROVED ✓</b></span></div>
        <p>20 岁 · 爱拍照 · 波点收藏家</p>
        <a href="#top">回到顶部 ↑</a>
      </footer>
    </main>
  );
}
