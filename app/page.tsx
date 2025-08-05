import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, MapPin, Phone, Star, Award, Utensils, Sparkles } from "lucide-react"
import { supabase } from "@/lib/database"
import { CartButton } from "@/components/cart/cart-button"
import { SearchSection } from "@/components/search/search-section"

export default async function HomePage() {
  // Получаем категории с подсчетом блюд
  const { data: categories } = await supabase
    .from("categories")
    .select(`
      *,
      dishes!inner(count)
    `)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  // Подсчитываем количество доступных блюд для каждой категории
  const categoriesWithCounts = await Promise.all(
    (categories || []).map(async (category) => {
      const { count } = await supabase
        .from("dishes")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id)
        .eq("is_available", true)
        .eq("is_stopped", false)

      return {
        ...category,
        dishCount: count || 0,
      }
    }),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Декоративные элементы */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-amber-400/10 to-yellow-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-amber-500/5 to-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-amber-400/5 to-yellow-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Элегантный хедер */}
      <header className="relative bg-black/40 backdrop-blur-xl border-b border-amber-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Utensils className="w-6 h-6 text-black" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                  Bella Vista
                </h1>
              </div>
              <p className="text-amber-200/80 font-medium tracking-wide">Итальянский ресторан премиум-класса</p>
              <div className="flex items-center justify-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm text-amber-200/60 ml-2">4.9 • 1,247 отзывов</span>
              </div>
            </div>
            <Link href="/admin" className="text-amber-400/60 hover:text-amber-400 text-sm transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Роскошный герой */}
      <section className="relative py-24 px-6">
        <div className="container mx-auto text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm border border-amber-500/30 text-amber-200 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg">
            <Award className="w-4 h-4" />
            Лучший итальянский ресторан 2024
            <Sparkles className="w-4 h-4" />
          </div>

          <h2 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
            Добро пожаловать в
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600">
              Bella Vista
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed">
            Откройте для себя подлинные итальянские вкусы в атмосфере роскоши и изысканности
          </p>

          {/* Премиум информационные карточки */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-4xl mx-auto">
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/20 shadow-2xl shadow-black/50 hover:shadow-amber-500/10 transition-all duration-500">
              <Clock className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-3 text-lg">Время работы</h3>
              <p className="text-amber-200/80">Пн-Вс: 11:00 - 23:00</p>
            </div>
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/20 shadow-2xl shadow-black/50 hover:shadow-amber-500/10 transition-all duration-500">
              <MapPin className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-3 text-lg">Адрес</h3>
              <p className="text-amber-200/80">
                ул. Пушкина, 15
                <br />
                Центр города
              </p>
            </div>
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/20 shadow-2xl shadow-black/50 hover:shadow-amber-500/10 transition-all duration-500">
              <Phone className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <h3 className="font-bold text-white mb-3 text-lg">Бронирование</h3>
              <p className="text-amber-200/80">+7 (495) 123-45-67</p>
            </div>
          </div>
        </div>
      </section>

      {/* Поиск и фильтры */}
      <SearchSection categories={categoriesWithCounts} />

      {/* Роскошные категории меню */}
      <section className="relative py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-5xl md:text-6xl font-bold text-white mb-6">Наше меню</h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Каждое блюдо - это произведение искусства, созданное с любовью и вниманием к деталям
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoriesWithCounts.map((category, index) => (
              <Link key={category.id} href={`/menu/${category.id}`}>
                <Card className="group hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-700 hover:-translate-y-4 cursor-pointer overflow-hidden bg-black/40 backdrop-blur-xl border border-amber-500/20">
                  <div className="relative overflow-hidden">
                    <img
                      src={category.image_url || "/placeholder.svg?height=400&width=600&text=Категория"}
                      alt={category.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {category.dishCount} блюд
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-500"></div>

                    {/* Номер категории */}
                    <div className="absolute top-4 left-4">
                      <div className="w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-amber-500/30">
                        <span className="text-amber-400 font-bold text-sm">{index + 1}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <h4 className="text-2xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-yellow-500 transition-all duration-300">
                      {category.name}
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">{category.description}</p>
                    <div className="flex items-center text-amber-400 text-sm font-medium">
                      <span>Смотреть меню</span>
                      <svg
                        className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {categoriesWithCounts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-6">Меню временно недоступно</p>
              <Link href="/admin" className="text-amber-400 hover:text-amber-300 transition-colors">
                Перейти в админ-панель для настройки меню
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Премиум особенности */}
      <section className="relative py-24 px-6 bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="text-white">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/25">
                <Award className="w-10 h-10 text-black" />
              </div>
              <h4 className="text-2xl font-bold mb-4">Премиум качество</h4>
              <p className="text-gray-300 leading-relaxed">Только лучшие ингредиенты из Италии и авторские рецепты</p>
            </div>
            <div className="text-white">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/25">
                <Utensils className="w-10 h-10 text-black" />
              </div>
              <h4 className="text-2xl font-bold mb-4">Авторская кухня</h4>
              <p className="text-gray-300 leading-relaxed">Уникальные рецепты от шеф-повара с мишленовским опытом</p>
            </div>
            <div className="text-white">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/25">
                <Star className="w-10 h-10 text-black" />
              </div>
              <h4 className="text-2xl font-bold mb-4">5 звезд</h4>
              <p className="text-gray-300 leading-relaxed">Высочайший рейтинг и признание гурманов со всего мира</p>
            </div>
          </div>
        </div>
      </section>

      {/* Роскошный футер */}
      <footer className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white py-20 border-t border-amber-500/20">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/25">
              <Utensils className="w-8 h-8 text-black" />
            </div>
            <h4 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Bella Vista
            </h4>
          </div>
          <p className="text-gray-300 mb-10 text-xl">Аутентичная итальянская кухня с 1985 года</p>

          <div className="flex items-center justify-center gap-1 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-amber-200/60 ml-3">4.9 • 1,247 отзывов</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-300 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <Clock className="w-6 h-6 mb-2 text-amber-400" />
              <p className="font-medium">Пн-Вс: 11:00 - 23:00</p>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="w-6 h-6 mb-2 text-amber-400" />
              <p className="font-medium">+7 (495) 123-45-67</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="w-6 h-6 mb-2 text-amber-400" />
              <p className="font-medium">ул. Пушкина, 15</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Корзина */}
      <CartButton />
    </div>
  )
}
