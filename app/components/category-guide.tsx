import { categories } from "../content/site-content";

export function CategoryGuide() {
  return (
    <section className="category-section" id="categories">
      <div className="category-heading">
        <div>
          <span>00 / UNIVERSE MAP</span>
          <h2>先选一个<br />可爱频道</h2>
        </div>
        <p>整个网站已经按她喜欢的事物分成四个区域。以后增加新玩偶、新奶茶或新照片，都可以直接放进对应分类。</p>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <a className={`category-card ${category.className}`} href={category.href} key={category.number}>
            <span className="category-number">{category.number}</span>
            <small>{category.label}</small>
            <h3>{category.title}</h3>
            <p>{category.description}</p>
            <b>打开分类 →</b>
          </a>
        ))}
      </div>
    </section>
  );
}
