import { navItems } from "../content/site-content";

export function SiteHeader() {
  return (
    <nav className="nav" aria-label="网站主导航">
      <a className="logo" href="/" aria-label="回到首页">
        <span>妍</span> YAN&apos;S CLUB
      </a>
      <div className="nav-links">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>{item.label}</a>
        ))}
        <a href="/admin/">编辑后台</a>
      </div>
      <span className="age-pill">YUY FIRST</span>
    </nav>
  );
}
