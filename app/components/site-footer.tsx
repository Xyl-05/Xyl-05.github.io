import { assetPaths } from "../content/site-content";

export function SiteFooter() {
  return (
    <footer>
      <div>
        <img className="footer-yuy" src={assetPaths.yuyMain} alt="小玉 YUY 卡通形象" />
        <span>妍的可爱宇宙<br /><b>YUY APPROVED ✓</b></span>
      </div>
      <p>爱拍照 · 波点收藏家 · YUY 爱好者</p>
      <a href="#top">回到顶部 ↑</a>
    </footer>
  );
}
