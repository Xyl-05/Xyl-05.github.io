import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub 网站管理 | 妍的可爱宇宙",
  robots: { index: false, follow: false },
};

const actions = [
  {
    number: "01",
    title: "修改文字和清单",
    description: "编辑玩偶、奶茶、好吃清单和相册标题。保存提交后，GitHub 会自动重新发布网站。",
    href: "https://github.com/Xyl-05/Xyl-05.github.io/edit/codex/github-pages/app/content/site-content.ts",
    label: "打开内容编辑器",
  },
  {
    number: "02",
    title: "上传相册照片",
    description: "把真实照片上传到相册文件夹，再到内容编辑器中添加对应的图片路径。",
    href: "https://github.com/Xyl-05/Xyl-05.github.io/upload/codex/github-pages/public/images/album",
    label: "上传相册照片",
  },
  {
    number: "03",
    title: "上传玩偶和品牌图",
    description: "新增 YUY、卡通角色或奶茶品牌图片，上传后即可在页面内容中引用。",
    href: "https://github.com/Xyl-05/Xyl-05.github.io/tree/codex/github-pages/public/images",
    label: "管理网站图片",
  },
  {
    number: "04",
    title: "授权朋友编辑",
    description: "在仓库协作者设置中邀请朋友。对方接受后，就能使用自己的 GitHub 账号修改网站。",
    href: "https://github.com/Xyl-05/Xyl-05.github.io/settings/access",
    label: "管理协作者",
  },
] as const;

export default function AdminPage() {
  return (
    <main className="github-admin">
      <header className="github-admin-nav">
        <a className="logo" href="/"><span>妍</span> YAN&apos;S CLUB</a>
        <a className="back-home" href="/">返回网站</a>
      </header>

      <section className="github-admin-hero">
        <span>GITHUB EDITOR</span>
        <h1>网站管理入口</h1>
        <p>登录 GitHub 后管理公开内容。只有仓库主人和已授权协作者可以保存修改。</p>
      </section>

      <section className="github-admin-actions">
        {actions.map((action) => (
          <article key={action.number}>
            <span>{action.number}</span>
            <h2>{action.title}</h2>
            <p>{action.description}</p>
            <a href={action.href} target="_blank" rel="noreferrer">{action.label} →</a>
          </article>
        ))}
      </section>

      <section className="github-admin-note">
        <b>发布说明</b>
        <p>每次保存修改后，通常需要等待几分钟。可以在 GitHub Actions 页面查看发布进度。</p>
        <a href="https://github.com/Xyl-05/Xyl-05.github.io/actions/workflows/deploy-pages.yml" target="_blank" rel="noreferrer">查看发布进度 →</a>
      </section>
    </main>
  );
}
