import { db, requireUserId } from "./client"
import { apiClient, centsToBrl, brlToCents } from "@/lib/api/client"
import { MOCK_ENABLED, mock } from "@/lib/mock/store"
import type { Product } from "./types"

type KoraProduct = {
  id: string
  name: string
  description?: string
  category?: string
  priceCents: number
  imageUrl?: string
  isNft?: boolean
  nftLabel?: string
}

function mapKoraProduct(p: KoraProduct): Product {
  return {
    id: p.id,
    brand: null,
    name: p.name,
    price: centsToBrl(p.priceCents),
    old_price: null,
    discount: null,
    category: p.category || "tudo",
  }
}

export async function listProducts(): Promise<Product[]> {
  if (MOCK_ENABLED) return mock.listProducts()
  async function fallback(): Promise<Product[]> {
    const userId = await requireUserId()
    const { data } = await db()
      .from("products")
      .select("id, brand, name, price, old_price, discount, category")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
    return (data ?? []).map((p) => ({
      ...p,
      price: Number(p.price),
      old_price: p.old_price === null ? null : Number(p.old_price),
    })) as Product[]
  }

  try {
    const products = await apiClient.get<KoraProduct[]>("/merchant/products")
    if (!products || products.length === 0) return await fallback()
    return products.map(mapKoraProduct)
  } catch {
    return await fallback()
  }
}

export async function addProduct(input: {
  brand?: string | null
  name: string
  price: number
  old_price?: number | null
  discount?: string | null
  category?: string
}): Promise<Product> {
  if (MOCK_ENABLED) return mock.addProduct(input)
  async function fallback(): Promise<Product> {
    const userId = await requireUserId()
    const { data, error } = await db()
      .from("products")
      .insert({
        user_id: userId,
        brand: input.brand ?? null,
        name: input.name,
        price: input.price,
        old_price: input.old_price ?? null,
        discount: input.discount ?? null,
        category: input.category ?? "tudo",
      })
      .select("id, brand, name, price, old_price, discount, category")
      .single()
    if (error) throw new Error(error.message)
    return { ...data, price: Number(data.price), old_price: data.old_price === null ? null : Number(data.old_price) } as Product
  }

  try {
    const product = await apiClient.post<KoraProduct>("/merchant/products", {
      name: input.name,
      priceCents: brlToCents(input.price),
      category: input.category ?? "tudo",
      description: undefined,
    })
    return mapKoraProduct(product)
  } catch {
    return await fallback()
  }
}
