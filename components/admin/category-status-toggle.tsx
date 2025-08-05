"use client"

import { Button } from "@/components/ui/button"
import { toggleCategoryStatus } from "@/app/admin/actions"
import type { LucideIcon } from "lucide-react"
import { useTransition } from "react"

interface CategoryStatusToggleProps {
  categoryId: number
  currentValue: boolean
  icon: LucideIcon
  title: string
  variant?: "default" | "destructive" | "outline"
}

export function CategoryStatusToggle({
  categoryId,
  currentValue,
  icon: Icon,
  title,
  variant = "outline",
}: CategoryStatusToggleProps) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      await toggleCategoryStatus(categoryId)
    })
  }

  return (
    <Button size="sm" variant={variant} onClick={handleToggle} disabled={isPending} title={title}>
      <Icon className="w-4 h-4" />
    </Button>
  )
}
