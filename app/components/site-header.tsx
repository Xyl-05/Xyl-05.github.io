import { navItems } from "../content/site-content";

export function SiteHeader() {
  return (
    <nav className="nav" aria-label="网站主导航">
      <a className="logo" href="#top" aria-label="回到顶部">
        <span>妍</span> YAN&apos;S CLUB
      </a>
      <div className="nav-links">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>{item.label}</a>
        ))}
      </div>
      <span className="age-pill">20 YEARS COOL</span>
    </nav>
  );
}
