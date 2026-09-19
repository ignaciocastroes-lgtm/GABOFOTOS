import { galleryCategories } from "@/lib/gallery"
import { loadCategoryGallery } from "@/lib/gallery-data"
import { interleave } from "@/lib/flickr"
import { FeaturedCarousel } from "./featured-carousel"

const PER_CATEGORY = 8
const MAX_FEATURED = 24

// Carrusel del inicio: mezcla fotos de todas las categorías (Flickr o respaldo local).
export async function FeaturedStrip() {
  const galleries = await Promise.all(galleryCategories.map((category) => loadCategoryGallery(category)))
  const photos = interleave(
    galleries.map((gallery) => gallery.photos.slice(0, PER_CATEGORY)),
    MAX_FEATURED,
  )

  if (photos.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-6 pb-8">
      <p className="mb-5 text-xs tracking-[0.3em] text-yellow-700 dark:text-yellow-400">TRABAJOS</p>
      <FeaturedCarousel photos={photos} />
    </section>
  )
}
