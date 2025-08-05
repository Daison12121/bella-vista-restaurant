import { CategoryForm } from "@/components/admin/category-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NewCategoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Добавить новую категорию</h1>
              <p className="text-gray-600">Создайте новую категорию меню</p>
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
          <CategoryForm />
        </div>
      </div>
    </div>
  )
}
