"use client"

import { Button } from "@/components/ui/button"
import { toggleDishStatus } from "@/app/admin/actions"
import type { LucideIcon } from "lucide-react"
import { useTransition } from "react"

interface DishStatusToggleProps {
  dishId: number
  field: "is_stopped" | "is_available"
  currentValue: boolean
  icon: LucideIcon
  title: string
  variant?: "default" | "destructive" | "outline"
}

export function DishStatusToggle({
  dishId,
  field,
  currentValue,
  icon: Icon,
  title,
  variant = "outline",
}: DishStatusToggleProps) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      await toggleDishStatus(dishId, field)
    })
  }

  return (
    <Button size="sm" variant={variant} onClick={handleToggle} disabled={isPending} title={title}>
      <Icon className="w-4 h-4" />
    </Button>
  )
}
