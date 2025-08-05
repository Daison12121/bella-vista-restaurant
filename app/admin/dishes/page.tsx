import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAllDishes } from "@/lib/database"
import { Plus, Edit, StopCircle, PlayCircle, Eye, EyeOff } from "lucide-react"
import { DishStatusToggle } from "@/components/admin/dish-status-toggle"
import { DeleteDishButton } from "@/components/admin/delete-dish-button"

export default async function DishesPage() {
  const dishes = await getAllDishes()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Управление блюдами</h1>
              <p className="text-gray-600">Всего блюд: {dishes.length}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin">
                <Button variant="outline">← Назад</Button>
              </Link>
              <Link href="/admin/dishes/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить блюдо
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {dishes.map((dish) => (
            <Card key={dish.id} className="overflow-hidden">
              <div className="relative">
                <img src={dish.image_url || "/placeholder.svg"} alt={dish.name} className="w-full h-48 object-cover" />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {dish.is_popular && <Badge className="bg-red-500">Популярное</Badge>}
                  {dish.is_chef_special && <Badge className="bg-purple-500">От шефа</Badge>}
                  {dish.is_vegetarian && <Badge className="bg-green-500">Вегетарианское</Badge>}
                  {dish.is_spicy && <Badge className="bg-orange-500">Острое</Badge>}
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {!dish.is_available && <Badge variant="destructive">Недоступно</Badge>}
                  {dish.is_stopped && <Badge className="bg-red-600">СТОП</Badge>}
                </div>
              </div>

              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{dish.name}</h3>
                    <p className="text-sm text-gray-600">{dish.category?.name}</p>
                  </div>
                  <span className="text-xl font-bold text-orange-500">{dish.price} ₽</span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{dish.description}</p>

                {dish.ingredients && dish.ingredients.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-1">Ингредиенты:</p>
                    <div className="flex flex-wrap gap-1">
                      {dish.ingredients.slice(0, 3).map((ingredient) => (
                        <Badge key={ingredient.id} variant="outline" className="text-xs">
                          {ingredient.name}
                        </Badge>
                      ))}
                      {dish.ingredients.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{dish.ingredients.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <DishStatusToggle
                      dishId={dish.id}
                      field="is_available"
                      currentValue={dish.is_available}
                      icon={dish.is_available ? Eye : EyeOff}
                      title={dish.is_available ? "Скрыть" : "Показать"}
                    />
                    <DishStatusToggle
                      dishId={dish.id}
                      field="is_stopped"
                      currentValue={dish.is_stopped}
                      icon={dish.is_stopped ? PlayCircle : StopCircle}
                      title={dish.is_stopped ? "Убрать стоп" : "Поставить стоп"}
                      variant={dish.is_stopped ? "default" : "destructive"}
                    />
                  </div>

                  <div className="flex gap-1">
                    <Link href={`/admin/dishes/${dish.id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <DeleteDishButton dishId={dish.id} dishName={dish.name} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {dishes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Блюда не найдены</p>
            <Link href="/admin/dishes/new">
              <Button>Добавить первое блюдо</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
