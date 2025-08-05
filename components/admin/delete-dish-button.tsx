"use client"

import { Button } from "@/components/ui/button"
import { deleteDish } from "@/app/admin/actions"
import { Trash2 } from "lucide-react"
import { useTransition } from "react"

interface DeleteDishButtonProps {
  dishId: number
  dishName: string
}

export function DeleteDishButton({ dishId, dishName }: DeleteDishButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm(`Вы уверены, что хотите удалить блюдо "${dishName}"?`)) {
      startTransition(async () => {
        await deleteDish(dishId)
      })
    }
  }

  return (
    <Button size="sm" variant="destructive" onClick={handleDelete} disabled={isPending} title="Удалить блюдо">
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
