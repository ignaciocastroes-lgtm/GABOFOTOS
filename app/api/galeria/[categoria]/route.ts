import { NextResponse } from "next/server"
import { galleryCategories } from "@/lib/gallery"
import { loadCategoryGallery } from "@/lib/gallery-data"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ categoria: string }> },
) {
  const { categoria } = await params

  const category = galleryCategories.find((entry) => entry.id === categoria)
  if (!category) {
    return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
  }

  const body = await loadCategoryGallery(category)

  return NextResponse.json(body, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  })
}
