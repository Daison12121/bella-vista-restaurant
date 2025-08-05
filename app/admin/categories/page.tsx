import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAllCategories } from "@/lib/database"
import { Plus, Edit, Eye, EyeOff } from "lucide-react"
import { CategoryStatusToggle } from "@/components/admin/category-status-toggle"
import { DeleteCategoryButton } from "@/components/admin/delete-category-button"

export default async function CategoriesPage() {
  const categories = await getAllCategories()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Управление категориями</h1>
              <p className="text-gray-600">Всего категорий: {categories.length}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin">
                <Button variant="outline">← Назад</Button>
              </Link>
              <Link href="/admin/categories/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить категорию
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={category.image_url || "/placeholder.svg?height=200&width=400&text=Категория"}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  {!category.is_active && <Badge variant="destructive">Неактивна</Badge>}
                </div>
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color_gradient || "from-orange-400 to-red-500"}`}
                ></div>
              </div>

              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-600 font-normal">Порядок: {category.sort_order}</p>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>

                <div className="flex items-center justify-between">
                  <CategoryStatusToggle
                    categoryId={category.id}
                    currentValue={category.is_active}
                    icon={category.is_active ? Eye : EyeOff}
                    title={category.is_active ? "Скрыть категорию" : "Показать категорию"}
                    variant={category.is_active ? "outline" : "default"}
                  />

                  <div className="flex gap-1">
                    <Link href={`/admin/categories/${category.id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <DeleteCategoryButton categoryId={category.id} categoryName={category.name} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Категории не найдены</p>
            <Link href="/admin/categories/new">
              <Button>Добавить первую категорию</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
