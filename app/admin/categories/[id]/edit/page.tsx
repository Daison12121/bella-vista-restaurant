import { supabase } from "@/lib/database"
import { CategoryForm } from "@/components/admin/category-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const categoryId = Number.parseInt(params.id)

  if (isNaN(categoryId)) {
    notFound()
  }

  // Получаем данные категории
  const { data: category } = await supabase.from("categories").select("*").eq("id", categoryId).single()

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Редактировать категорию</h1>
              <p className="text-gray-600">{category.name}</p>
            </div>
            <Link href="/admin/categories">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад к категориям
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <CategoryForm initialData={category} isEditing />
        </div>
      </div>
    </div>
  )
}
