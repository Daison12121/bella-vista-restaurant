import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAllCategories, getAllDishes, getIngredients } from "@/lib/database"
import { Settings, ChefHat, Tags, Utensils } from "lucide-react"
import { DeploymentStatus } from "@/components/deployment-status"

export default async function AdminDashboard() {
  const [categories, dishes, ingredients] = await Promise.all([getAllCategories(), getAllDishes(), getIngredients()])

  const activeCategories = categories.filter((c) => c.is_active).length
  const availableDishes = dishes.filter((d) => d.is_available && !d.is_stopped).length
  const stoppedDishes = dishes.filter((d) => d.is_stopped).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
              <p className="text-gray-600">Управление меню ресторана Bella Vista</p>
            </div>
            <Link href="/" className="text-orange-500 hover:text-orange-600">
              ← Вернуться к меню
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Deployment Status */}
        <DeploymentStatus showInAdmin />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активные категории</CardTitle>
              <Tags className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCategories}</div>
              <p className="text-xs text-muted-foreground">из {categories.length} всего</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Доступные блюда</CardTitle>
              <ChefHat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{availableDishes}</div>
              <p className="text-xs text-muted-foreground">из {dishes.length} всего</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Блюда на стопе</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stoppedDishes}</div>
              <p className="text-xs text-muted-foreground">временно недоступны</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ингредиенты</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ingredients.length}</div>
              <p className="text-xs text-muted-foreground">в базе данных</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tags className="w-5 h-5 text-orange-500" />
                Категории меню
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Управление категориями блюд, их порядком и отображением</p>
              <div className="space-y-2">
                <Link href="/admin/categories">
                  <Button className="w-full">Управлять категориями</Button>
                </Link>
                <Link href="/admin/categories/new">
                  <Button variant="outline" className="w-full bg-transparent">
                    Добавить категорию
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-orange-500" />
                Блюда
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Добавление, редактирование блюд, управление стопами</p>
              <div className="space-y-2">
                <Link href="/admin/dishes">
                  <Button className="w-full">Управлять блюдами</Button>
                </Link>
                <Link href="/admin/dishes/new">
                  <Button variant="outline" className="w-full bg-transparent">
                    Добавить блюдо
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-orange-500" />
                Ингредиенты
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Управление списком ингредиентов и аллергенов</p>
              <div className="space-y-2">
                <Link href="/admin/ingredients">
                  <Button className="w-full">Управлять ингредиентами</Button>
                </Link>
                <Link href="/admin/ingredients/new">
                  <Button variant="outline" className="w-full bg-transparent">
                    Добавить ингредиент
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
