"use client"

import { Button } from "@/components/ui/button"
import { deleteCategory } from "@/app/admin/actions"
import { Trash2 } from "lucide-react"
import { useTransition } from "react"

interface DeleteCategoryButtonProps {
  categoryId: number
  categoryName: string
}

export function DeleteCategoryButton({ categoryId, categoryName }: DeleteCategoryButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (
      confirm(
        `Вы уверены, что хотите удалить категорию "${categoryName}"? Это также удалит все блюда в этой категории.`,
      )
    ) {
      startTransition(async () => {
        await deleteCategory(categoryId)
      })
    }
  }

  return (
    <Button size="sm" variant="destructive" onClick={handleDelete} disabled={isPending} title="Удалить категорию">
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
