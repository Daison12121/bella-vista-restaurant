"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createCategory, updateCategory } from "@/app/admin/actions"
import { ImageUpload } from "@/components/admin/image-upload"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import type { Category } from "@/lib/database"

interface CategoryFormProps {
  initialData?: Partial<Category>
  isEditing?: boolean
}

const colorGradients = [
  { name: "Оранжевый", value: "from-amber-400 to-orange-500" },
  { name: "Красный", value: "from-red-400 to-pink-500" },
  { name: "Фиолетовый", value: "from-purple-400 to-indigo-500" },
  { name: "Зеленый", value: "from-emerald-400 to-teal-500" },
  { name: "Синий", value: "from-blue-400 to-cyan-500" },
  { name: "Розовый", value: "from-pink-400 to-rose-500" },
]

export function CategoryForm({ initialData, isEditing = false }: CategoryFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "")
  const [error, setError] = useState("")

  const handleSubmit = async (formData: FormData) => {
    setError("")

    // Добавляем URL изображения
    formData.set("imageUrl", imageUrl)

    startTransition(async () => {
      try {
        let result
        if (isEditing && initialData?.id) {
          result = await updateCategory(initialData.id, formData)
        } else {
          result = await createCategory(formData)
        }

        if (result.success) {
          router.push("/admin/categories")
        } else {
          setError(result.error || "Произошла ошибка")
        }
      } catch (err) {
        setError("Произошла ошибка при сохранении")
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Информация о категории</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Название категории *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={initialData?.name}
              placeholder="Например: Основные блюда"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initialData?.description || ""}
              placeholder="Краткое описание категории"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="colorGradient">Цветовая схема</Label>
            <Select name="colorGradient" defaultValue={initialData?.color_gradient || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите цветовую схему" />
              </SelectTrigger>
              <SelectContent>
                {colorGradients.map((gradient) => (
                  <SelectItem key={gradient.value} value={gradient.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded bg-gradient-to-r ${gradient.value}`}></div>
                      {gradient.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isEditing && (
            <div className="flex items-center space-x-2">
              <Checkbox id="isActive" name="isActive" defaultChecked={initialData?.is_active} />
              <Label htmlFor="isActive">Категория активна</Label>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Изображение категории</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload value={imageUrl} onChange={setImageUrl} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Сохранение..." : isEditing ? "Обновить категорию" : "Создать категорию"}
            </Button>

            <Button type="button" variant="outline" onClick={() => router.back()}>
              Отмена
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
