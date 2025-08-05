"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createDish, updateDish } from "@/app/admin/actions"
import { ImageUpload } from "@/components/admin/image-upload"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Category, Ingredient, Dish } from "@/lib/database"

interface DishFormProps {
  categories: Category[]
  ingredients: Ingredient[]
  initialData?: Partial<Dish & { selectedIngredients: string[] }>
  isEditing?: boolean
}

export function DishForm({ categories, ingredients, initialData, isEditing = false }: DishFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(initialData?.selectedIngredients || [])
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "")
  const [error, setError] = useState("")

  const handleSubmit = async (formData: FormData) => {
    setError("")

    // Добавляем URL изображения
    formData.set("imageUrl", imageUrl)

    // Добавляем выбранные ингредиенты
    selectedIngredients.forEach((ingredientId) => {
      formData.append("ingredients", ingredientId)
    })

    startTransition(async () => {
      try {
        let result
        if (isEditing && initialData?.id) {
          result = await updateDish(initialData.id, formData)
        } else {
          result = await createDish(formData)
        }

        if (result.success) {
          router.push("/admin/dishes")
        } else {
          setError(result.error || "Произошла ошибка")
        }
      } catch (err) {
        setError("Произошла ошибка при сохранении")
      }
    })
  }

  const toggleIngredient = (ingredientId: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientId) ? prev.filter((id) => id !== ingredientId) : [...prev, ingredientId],
    )
  }

  const activeCategories = categories.filter((c) => c.is_active)

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Название блюда *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={initialData?.name}
                  placeholder="Например: Паста Карбонара"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={initialData?.description || ""}
                  placeholder="Подробное описание блюда, ингредиентов и способа приготовления"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Цена (₽) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={initialData?.price}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cookTime">Время приготовления</Label>
                  <Input
                    id="cookTime"
                    name="cookTime"
                    defaultValue={initialData?.cook_time || ""}
                    placeholder="Например: 15 мин"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="categoryId">Категория *</Label>
                <Select name="categoryId" defaultValue={initialData?.category_id?.toString()} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Ингредиенты */}
          <Card>
            <CardHeader>
              <CardTitle>Ингредиенты</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                  {ingredients.map((ingredient) => (
                    <div
                      key={ingredient.id}
                      className={`p-2 border rounded-lg cursor-pointer transition-colors ${
                        selectedIngredients.includes(ingredient.id.toString())
                          ? "bg-orange-50 border-orange-300"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => toggleIngredient(ingredient.id.toString())}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedIngredients.includes(ingredient.id.toString())}
                          onChange={() => {}}
                        />
                        <span className="text-sm">{ingredient.name}</span>
                        {ingredient.is_allergen && <span className="text-red-500 text-xs">⚠️</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedIngredients.length > 0 && (
                  <div>
                    <Label>Выбранные ингредиенты:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedIngredients.map((ingredientId) => {
                        const ingredient = ingredients.find((i) => i.id.toString() === ingredientId)
                        return (
                          <Badge key={ingredientId} variant="secondary" className="flex items-center gap-1">
                            {ingredient?.name}
                            {ingredient?.is_allergen && <span className="text-red-500">⚠️</span>}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => toggleIngredient(ingredientId)} />
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Боковая панель */}
        <div className="space-y-6">
          {/* Изображение */}
          <Card>
            <CardHeader>
              <CardTitle>Изображение блюда</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </CardContent>
          </Card>

          {/* Характеристики */}
          <Card>
            <CardHeader>
              <CardTitle>Характеристики</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="isPopular" name="isPopular" defaultChecked={initialData?.is_popular} />
                <Label htmlFor="isPopular">Популярное блюдо</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="isChefSpecial" name="isChefSpecial" defaultChecked={initialData?.is_chef_special} />
                <Label htmlFor="isChefSpecial">Блюдо от шефа</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="isVegetarian" name="isVegetarian" defaultChecked={initialData?.is_vegetarian} />
                <Label htmlFor="isVegetarian">Вегетарианское</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="isSpicy" name="isSpicy" defaultChecked={initialData?.is_spicy} />
                <Label htmlFor="isSpicy">Острое</Label>
              </div>

              {isEditing && (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="isAvailable" name="isAvailable" defaultChecked={initialData?.is_available} />
                    <Label htmlFor="isAvailable">Доступно для заказа</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="isStopped" name="isStopped" defaultChecked={initialData?.is_stopped} />
                    <Label htmlFor="isStopped">Поставить на стоп</Label>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Действия */}
          <Card>
            <CardContent className="pt-6">
              {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Сохранение..." : isEditing ? "Обновить блюдо" : "Создать блюдо"}
                </Button>

                <Button type="button" variant="outline" className="w-full bg-transparent" onClick={() => router.back()}>
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
