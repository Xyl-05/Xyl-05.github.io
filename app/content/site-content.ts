export const assetPaths = {
  yuyMain: "/images/characters/yuy/yuy-main.png",
  yuyFlower: "/images/characters/yuy/yuy-flower.jpg",
  socialCard: "/images/social/og.png",
} as const;

export const navItems = [
  { label: "分类目录", href: "#categories" },
  { label: "玩偶收藏", href: "#toys" },
  { label: "奶茶地图", href: "#drinks" },
  { label: "翻页相册", href: "#album" },
] as const;

export const categories = [
  {
    number: "01",
    label: "CHARACTERS",
    title: "玩偶图鉴",
    description: "YUY 是绝对主角，轻松熊、萌趣趣、Hello Kitty 和玉桂狗是可爱朋友。",
    href: "#toys",
    className: "category-pink",
  },
  {
    number: "02",
    label: "MILK TEA",
    title: "奶茶地图",
    description: "喜茶排在第一位，也喜欢爷爷不泡茶和古茗。",
    href: "#drinks",
    className: "category-purple",
  },
  {
    number: "03",
    label: "FOOD NOTES",
    title: "好吃清单",
    description: "喜欢探索好多好吃的，但香菜和芹菜要坚定地说 NO。",
    href: "#food",
    className: "category-green",
  },
  {
    number: "04",
    label: "PHOTO DAYS",
    title: "拍照相册",
    description: "用翻页相册收集普通日子里闪闪发光的照片。",
    href: "#album",
    className: "category-yellow",
  },
] as const;

export const toyFriends = [
  {
    name: "轻松熊",
    image: "/images/characters/friends/rilakkuma-art.png",
    alt: "轻松熊卡通形象",
  },
  {
    name: "萌趣趣",
    image: "/images/characters/friends/monchhichi-art.jpg",
    alt: "萌趣趣卡通形象",
  },
  {
    name: "Hello Kitty",
    image: "/images/characters/friends/hello-kitty-art.png",
    alt: "Hello Kitty 卡通形象",
  },
  {
    name: "玉桂狗",
    image: "/images/characters/friends/cinnamoroll-art.png",
    alt: "玉桂狗卡通形象",
  },
] as const;

export const teaBrands = [
  {
    name: "喜茶",
    image: "/images/brands/heytea.jpg",
    alt: "喜茶饮品实拍",
    favorite: true,
  },
  {
    name: "爷爷不泡茶",
    image: "/images/brands/yeye-tea.png",
    alt: "爷爷不泡茶官方饮品图",
    favorite: false,
  },
  {
    name: "古茗",
    image: "/images/brands/guming.jpg",
    alt: "古茗饮品实拍",
    favorite: false,
  },
] as const;

export const albumPages = [
  {
    number: "01",
    title: "镜头里的小世界",
    note: "把普通的日子，拍成闪闪发光的碎片。",
    image: "/images/album/photo-1.jpg",
    color: "#ff8fb1",
  },
  {
    number: "02",
    title: "今日份可爱",
    note: "波点出现的时候，心情也会自动变好。",
    image: "/images/album/photo-2.jpg",
    color: "#7857ff",
  },
  {
    number: "03",
    title: "甜甜补给站",
    note: "茉莉奶绿在线，今天也是快乐满格。",
    image: "/images/album/photo-3.jpg",
    color: "#39b982",
  },
  {
    number: "04",
    title: "下次见面再拍",
    note: "相册未完待续，新的照片正在路上。",
    image: "/images/album/photo-4.jpg",
    color: "#ff725e",
  },
] as const;
