import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://xyl-05.github.io"),
  title: "妍的可爱宇宙 | YAN'S CLUB",
  description: "关于妍、YUY、波点、拍照和奶茶偏好的个人 IP 收藏册。",
  icons: {
    icon: "/images/characters/yuy/yuy-main.png",
    shortcut: "/images/characters/yuy/yuy-main.png",
  },
  openGraph: {
    title: "妍的可爱宇宙",
    description: "YUY、波点、相册与快乐日常——欢迎来到妍的可爱宇宙。",
    type: "website",
    locale: "zh_CN",
    images: [{ url: "/images/social/og.png", width: 1200, height: 630, alt: "妍的可爱宇宙" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "妍的可爱宇宙",
    description: "YUY、波点、相册与快乐日常。",
    images: ["/images/social/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
