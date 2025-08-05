import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Category = {
  id: number
  name: string
  description: string | null
  image_url: string | null
  color_gradient: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Dish = {
  id: number
  category_id: number
  name: string
  description: string | null
  price: number
  image_url: string | null
  cook_time: string | null
  is_popular: boolean
  is_vegetarian: boolean
  is_spicy: boolean
  is_chef_special: boolean
  is_available: boolean
  is_stopped: boolean
  sort_order: number
  created_at: string
  updated_at: string
  category?: Category
  ingredients?: Ingredient[]
  reviews?: Review[]
  average_rating?: number
}

export type Ingredient = {
  id: number
  name: string
  is_allergen: boolean
  created_at: string
}

export type Table = {
  id: number
  number: string
  qr_code: string | null
  seats: number
  is_active: boolean
  created_at: string
}

export type Order = {
  id: number
  table_id: number | null
  customer_name: string | null
  customer_phone: string | null
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
  total_amount: number
  notes: string | null
  created_at: string
  updated_at: string
  table?: Table
  items?: OrderItem[]
}

export type OrderItem = {
  id: number
  order_id: number
  dish_id: number
  quantity: number
  price: number
  notes: string | null
  created_at: string
  dish?: Dish
}

export type User = {
  id: number
  email: string
  role: "admin" | "manager" | "waiter"
  name: string
  is_active: boolean
  created_at: string
}

export type Review = {
  id: number
  dish_id: number
  customer_name: string | null
  rating: number
  comment: string | null
  is_approved: boolean
  created_at: string
}

export type ActivityLog = {
  id: number
  user_id: number | null
  action: string
  entity_type: string | null
  entity_id: number | null
  details: any
  created_at: string
}

// Функции для категорий
export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error) throw error
  return data as Category[]
}

export async function getAllCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("sort_order", { ascending: true })

  if (error) throw error
  return data as Category[]
}

// Функции для блюд
export async function getDishesByCategory(categoryId: number) {
  const { data, error } = await supabase
    .from("dishes")
    .select(`
      *,
      category:categories(*),
      dish_ingredients(
        ingredient:ingredients(*)
      ),
      reviews!inner(rating)
    `)
    .eq("category_id", categoryId)
    .eq("is_available", true)
    .eq("is_stopped", false)
    .order("sort_order", { ascending: true })

  if (error) throw error

  return data?.map((dish) => ({
    ...dish,
    ingredients: dish.dish_ingredients?.map((di: any) => di.ingredient) || [],
    reviews: dish.reviews || [],
    average_rating:
      dish.reviews?.length > 0
        ? dish.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / dish.reviews.length
        : 0,
  })) as Dish[]
}

export async function getAllDishes() {
  const { data, error } = await supabase
    .from("dishes")
    .select(`
      *,
      category:categories(*),
      dish_ingredients(
        ingredient:ingredients(*)
      ),
      reviews(rating)
    `)
    .order("category_id", { ascending: true })
    .order("sort_order", { ascending: true })

  if (error) throw error

  return data?.map((dish) => ({
    ...dish,
    ingredients: dish.dish_ingredients?.map((di: any) => di.ingredient) || [],
    reviews: dish.reviews || [],
    average_rating:
      dish.reviews?.length > 0
        ? dish.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / dish.reviews.length
        : 0,
  })) as Dish[]
}

export async function searchDishes(
  query: string,
  filters?: {
    vegetarian?: boolean
    spicy?: boolean
    popular?: boolean
    categoryId?: number
    minPrice?: number
    maxPrice?: number
  },
) {
  let queryBuilder = supabase
    .from("dishes")
    .select(`
      *,
      category:categories(*),
      dish_ingredients(
        ingredient:ingredients(*)
      ),
      reviews(rating)
    `)
    .eq("is_available", true)
    .eq("is_stopped", false)

  if (query) {
    queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
  }

  if (filters?.vegetarian) queryBuilder = queryBuilder.eq("is_vegetarian", true)
  if (filters?.spicy) queryBuilder = queryBuilder.eq("is_spicy", true)
  if (filters?.popular) queryBuilder = queryBuilder.eq("is_popular", true)
  if (filters?.categoryId) queryBuilder = queryBuilder.eq("category_id", filters.categoryId)
  if (filters?.minPrice) queryBuilder = queryBuilder.gte("price", filters.minPrice)
  if (filters?.maxPrice) queryBuilder = queryBuilder.lte("price", filters.maxPrice)

  const { data, error } = await queryBuilder.order("name", { ascending: true })

  if (error) throw error

  return data?.map((dish) => ({
    ...dish,
    ingredients: dish.dish_ingredients?.map((di: any) => di.ingredient) || [],
    reviews: dish.reviews || [],
    average_rating:
      dish.reviews?.length > 0
        ? dish.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / dish.reviews.length
        : 0,
  })) as Dish[]
}

// Функции для ингредиентов
export async function getIngredients() {
  const { data, error } = await supabase.from("ingredients").select("*").order("name", { ascending: true })

  if (error) throw error
  return data as Ingredient[]
}

// Функции для столов
export async function getTables() {
  const { data, error } = await supabase.from("tables").select("*").order("number", { ascending: true })

  if (error) throw error
  return data as Table[]
}

// Функции для заказов
export async function getOrders(status?: string) {
  let query = supabase.from("orders").select(`
      *,
      table:tables(*),
      items:order_items(
        *,
        dish:dishes(*)
      )
    `)

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) throw error
  return data as Order[]
}

// Функции для отзывов
export async function getReviews(dishId?: number, approved?: boolean) {
  let query = supabase.from("reviews").select("*")

  if (dishId) query = query.eq("dish_id", dishId)
  if (approved !== undefined) query = query.eq("is_approved", approved)

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) throw error
  return data as Review[]
}

// Аналитика
export async function getAnalytics() {
  const today = new Date().toISOString().split("T")[0]
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  // Заказы за сегодня
  const { data: todayOrders } = await supabase
    .from("orders")
    .select("total_amount")
    .gte("created_at", today)
    .eq("status", "completed")

  // Заказы за неделю
  const { data: weekOrders } = await supabase
    .from("orders")
    .select("total_amount")
    .gte("created_at", weekAgo)
    .eq("status", "completed")

  // Популярные блюда
  const { data: popularDishes } = await supabase
    .from("order_items")
    .select(`
      dish_id,
      quantity,
      dish:dishes(name)
    `)
    .gte("created_at", weekAgo)

  const todayRevenue = todayOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0
  const weekRevenue = weekOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0

  return {
    todayRevenue,
    weekRevenue,
    todayOrders: todayOrders?.length || 0,
    weekOrders: weekOrders?.length || 0,
    popularDishes: popularDishes || [],
  }
}
