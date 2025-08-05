import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Users, ChefHat, Flame, Leaf, AlertTriangle, Star, Sparkles } from "lucide-react"
import { getDishesByCategory, supabase } from "@/lib/database"
import { notFound } from "next/navigation"

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const categoryId = Number.parseInt(params.category)

  if (isNaN(categoryId)) {
    notFound()
  }

  // Получаем информацию о категории
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", categoryId)
    .eq("is_active", true)
    .single()

  if (!category) {
    notFound()
  }

  // Получаем блюда категории
  const dishes = await getDishesByCategory(categoryId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Декоративные элементы */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-amber-400/10 to-yellow-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-amber-500/5 to-orange-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Элегантный хедер */}
      <header className="relative bg-black/40 backdrop-blur-xl border-b border-amber-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-amber-400/80 hover:text-amber-400 transition-colors p-3 rounded-full hover:bg-amber-500/10 border border-amber-500/20"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  {category.name}
                </h1>
                <p className="text-amber-200/60">Bella Vista</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Роскошный герой категории */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm border border-amber-500/30 text-amber-200 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Премиум коллекция
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">{category.name}</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">{category.description}</p>
        </div>
      </section>

      {/* Роскошные блюда */}
      <section className="relative py-8 px-6">
        <div className="container mx-auto max-w-6xl">
          {dishes.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">В данной категории пока нет доступных блюд</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {dishes.map((dish, index) => (
                <Card
                  key={dish.id}
                  className="group overflow-hidden bg-black/40 backdrop-blur-xl border border-amber-500/20 shadow-2xl shadow-black/50 hover:shadow-amber-500/20 transition-all duration-700 hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={dish.image_url || "/placeholder.svg"}
                      alt={dish.name}
                      className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Премиум бейджи */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {dish.is_popular && (
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg">
                          <Star className="w-3 h-3 mr-1" />
                          Популярное
                        </Badge>
                      )}
                      {dish.is_chef_special && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg">
                          <ChefHat className="w-3 h-3 mr-1" />
                          От шефа
                        </Badge>
                      )}
                    </div>

                    {/* Иконки особенностей */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      {dish.is_vegetarian && (
                        <div className="w-10 h-10 bg-green-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-green-400/30">
                          <Leaf className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {dish.is_spicy && (
                        <div className="w-10 h-10 bg-red-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-red-400/30">
                          <Flame className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Цена */}
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-2xl px-6 py-3 border border-amber-500/30">
                      <span className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                        {dish.price} ₽
                      </span>
                    </div>

                    {/* Номер блюда */}
                    <div className="absolute bottom-4 left-4">
                      <div className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-amber-500/30">
                        <span className="text-amber-400 font-bold text-sm">{index + 1}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-yellow-500 transition-all duration-300">
                        {dish.name}
                      </h3>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-6">{dish.description}</p>

                    {/* Ингредиенты */}
                    {dish.ingredients && dish.ingredients.length > 0 && (
                      <div className="mb-6">
                        <p className="text-xs font-medium text-amber-400 mb-3">Ингредиенты:</p>
                        <div className="flex flex-wrap gap-2">
                          {dish.ingredients.slice(0, 4).map((ingredient) => (
                            <Badge
                              key={ingredient.id}
                              variant="outline"
                              className={`text-xs border-amber-500/30 ${
                                ingredient.is_allergen
                                  ? "border-red-400/50 text-red-300 bg-red-500/10"
                                  : "text-amber-200/80 bg-amber-500/10"
                              }`}
                            >
                              {ingredient.is_allergen && <AlertTriangle className="w-3 h-3 mr-1" />}
                              {ingredient.name}
                            </Badge>
                          ))}
                          {dish.ingredients.length > 4 && (
                            <Badge
                              variant="outline"
                              className="text-xs border-amber-500/30 text-amber-200/80 bg-amber-500/10"
                            >
                              +{dish.ingredients.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-4">
                        {dish.cook_time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-amber-400" />
                            <span>{dish.cook_time}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-amber-400" />
                          <span>1-2 порции</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Премиум призыв к действию */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-xl rounded-3xl p-12 text-center text-white shadow-2xl border border-amber-500/30">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h3 className="text-4xl font-bold">Готовы сделать заказ?</h3>
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-xl mb-10 text-gray-300">Обратитесь к официанту или позвоните нам для бронирования</p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <div className="bg-black/40 backdrop-blur-sm border border-amber-500/30 rounded-full px-8 py-4 shadow-lg">
                <span className="font-bold text-amber-400">Стол №___</span>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-amber-500/30 rounded-full px-8 py-4 shadow-lg">
                <span className="font-bold text-amber-400">+7 (495) 123-45-67</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
