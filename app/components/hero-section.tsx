import { assetPaths } from "../content/site-content";

export function HeroSection() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <span className="eyebrow">PERSONAL IP · YUY FIRST</span>
        <h1><span>妍</span>的<br />可爱宇宙</h1>
        <p className="intro">爱拍照、爱波点，也爱收集生活里那些<br className="desktop" />不经意的小惊喜。</p>
        <a className="hero-button" href="#categories">进入她的宇宙 <b>↘</b></a>
      </div>

      <div className="hero-art">
        <div className="sunburst" />
        <div className="poster-card">
          <span className="tape" />
          <img className="yuy-hero-photo" src={assetPaths.yuyMain} alt="小玉 YUY 原作卡通形象" />
          <div className="poster-caption"><b>YUY</b><span>NO.1 FAVORITE DOLL</span></div>
        </div>
        <span className="scribble">so cute!</span>
        <span className="flower flower-one">✿</span>
        <span className="flower flower-two">✿</span>
        <span className="sticker-camera">▣<small>CLICK!</small></span>
      </div>

      <div className="marquee">
        <div>YUY DOLL · POLKA DOTS · PHOTO DAYS · MILK TEA · GOOD FOOD · <span>YUY DOLL · POLKA DOTS · PHOTO DAYS · MILK TEA · GOOD FOOD ·</span></div>
      </div>
    </section>
  );
}
