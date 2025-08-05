"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart"
import { CartDrawer } from "./cart-drawer"

export function CartButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { getTotalItems, getTotalPrice } = useCart()

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  if (totalItems === 0) return null

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold px-6 py-4 rounded-full shadow-2xl shadow-amber-500/25 border border-amber-400/30"
          size="lg"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          <span className="mr-2">{totalPrice} ₽</span>
          <Badge className="bg-black/20 text-amber-100 border-0">{totalItems}</Badge>
        </Button>
      </div>

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
