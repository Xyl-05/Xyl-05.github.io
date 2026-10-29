import { CategoryGuide } from "./components/category-guide";
import { FavoritesSection } from "./components/favorites-section";
import { HeroSection } from "./components/hero-section";
import { PhotoAlbum } from "./components/photo-album";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { ToyCollection } from "./components/toy-collection";

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <HeroSection />
      <CategoryGuide />
      <ToyCollection />
      <FavoritesSection />
      <PhotoAlbum />
      <SiteFooter />
    </main>
  );
}
