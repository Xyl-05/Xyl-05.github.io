import { navItems } from "../content/site-content";

type SubpageHeaderProps = {
  label: string;
  title: string;
  description: string;
};

export function SubpageHeader({ label, title, description }: SubpageHeaderProps) {
  return (
    <>
      <nav className="subpage-nav" aria-label="子页面导航">
        <a className="logo" href="/"><span>妍</span> YAN&apos;S CLUB</a>
        <div>
          {navItems.slice(1).map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </div>
        <a className="back-home" href="/">← 返回首页</a>
      </nav>
      <header className="subpage-header" id="top">
        <span>{label}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>
    </>
  );
}
