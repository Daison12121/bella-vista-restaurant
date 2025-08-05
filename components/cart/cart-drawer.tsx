"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus, Minus, ShoppingCart, User } from "lucide-react"
import { useCart } from "@/lib/cart"
import { createOrder } from "@/app/actions/orders"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, customerInfo, tableNumber, updateQuantity, removeItem, setCustomerInfo, clearCart, getTotalPrice } =
    useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderNotes, setOrderNotes] = useState("")

  const handleSubmitOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      alert("Пожалуйста, заполните имя и телефон")
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createOrder({
        tableNumber: tableNumber || "Без стола",
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        items: items.map((item) => ({
          dishId: item.id,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes || "",
        })),
        notes: orderNotes,
      })

      if (result.success) {
        clearCart()
        onClose()
        alert(`Заказ #${result.orderId} успешно оформлен! Ожидайте подтверждения.`)
      } else {
        alert("Ошибка при оформлении заказа: " + result.error)
      }
    } catch (error) {
      alert("Произошла ошибка при оформлении заказа")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-gray-900 to-black border-l border-amber-500/20 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-amber-500/20">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Корзина</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Корзина пуста</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-amber-500/20"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-white text-sm">{item.name}</h3>
                          <p className="text-amber-400 font-bold">{item.price} ₽</p>

                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 p-0 border-amber-500/30 text-amber-400"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0 border-amber-500/30 text-amber-400"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="ml-auto text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-400" />
                    Контактная информация
                  </h3>

                  <div>
                    <Label htmlFor="customerName" className="text-amber-200">
                      Имя *
                    </Label>
                    <Input
                      id="customerName"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder="Ваше имя"
                      className="bg-black/40 border-amber-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="customerPhone" className="text-amber-200">
                      Телефон *
                    </Label>
                    <Input
                      id="customerPhone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      placeholder="+7 (999) 123-45-67"
                      className="bg-black/40 border-amber-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="orderNotes" className="text-amber-200">
                      Комментарий к заказу
                    </Label>
                    <Textarea
                      id="orderNotes"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Особые пожелания..."
                      className="bg-black/40 border-amber-500/30 text-white"
                      rows={3}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-amber-500/20 bg-black/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-white">Итого:</span>
                <span className="text-2xl font-bold text-amber-400">{getTotalPrice()} ₽</span>
              </div>

              <Button
                onClick={handleSubmitOrder}
                disabled={isSubmitting || !customerInfo.name || !customerInfo.phone}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold py-3"
              >
                {isSubmitting ? "Оформляем заказ..." : "Оформить заказ"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
