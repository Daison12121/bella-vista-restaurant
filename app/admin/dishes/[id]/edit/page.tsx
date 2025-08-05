import { getAllCategories, getIngredients, supabase } from "@/lib/database"
import { DishForm } from "@/components/admin/dish-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

export default async function EditDishPage({ params }: { params: { id: string } }) {
  const dishId = Number.parseInt(params.id)

  if (isNaN(dishId)) {
    notFound()
  }

  // Получаем данные блюда
  const { data: dish } = await supabase
    .from("dishes")
    .select(`
      *,
      dish_ingredients(
        ingredient_id,
        ingredient:ingredients(*)
      )
    `)
    .eq("id", dishId)
    .single()

  if (!dish) {
    notFound()
  }

  const [categories, ingredients] = await Promise.all([getAllCategories(), getIngredients()])

  // Преобразуем данные для формы
  const dishData = {
    ...dish,
    ingredients: dish.dish_ingredients?.map((di: any) => di.ingredient) || [],
    selectedIngredients: dish.dish_ingredients?.map((di: any) => di.ingredient_id.toString()) || [],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Редактировать блюдо</h1>
              <p className="text-gray-600">{dish.name}</p>
            </div>
            <Link href="/admin/dishes">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад к блюдам
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <DishForm categories={categories} ingredients={ingredients} initialData={dishData} isEditing />
        </div>
      </div>
    </div>
  )
}
