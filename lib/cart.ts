"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  id: number
  name: string
  price: number
  image_url: string | null
  quantity: number
  notes?: string
}

interface CartStore {
  items: CartItem[]
  tableNumber: string | null
  customerInfo: {
    name: string
    phone: string
  }
  addItem: (dish: Omit<CartItem, "quantity">) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  updateNotes: (id: number, notes: string) => void
  setTableNumber: (tableNumber: string) => void
  setCustomerInfo: (info: { name: string; phone: string }) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      tableNumber: null,
      customerInfo: { name: "", phone: "" },

      addItem: (dish) => {
        const items = get().items
        const existingItem = items.find((item) => item.id === dish.id)

        if (existingItem) {
          set({
            items: items.map((item) => (item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item)),
          })
        } else {
          set({
            items: [...items, { ...dish, quantity: 1 }],
          })
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        set({
          items: get().items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })
      },

      updateNotes: (id, notes) => {
        set({
          items: get().items.map((item) => (item.id === id ? { ...item, notes } : item)),
        })
      },

      setTableNumber: (tableNumber) => {
        set({ tableNumber })
      },

      setCustomerInfo: (customerInfo) => {
        set({ customerInfo })
      },

      clearCart: () => {
        set({
          items: [],
          tableNumber: null,
          customerInfo: { name: "", phone: "" },
        })
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: "restaurant-cart",
    },
  ),
)
