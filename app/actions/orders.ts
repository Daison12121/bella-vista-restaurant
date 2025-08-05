"use server"

import { supabase } from "@/lib/database"
import { revalidatePath } from "next/cache"

export async function createOrder(orderData: {
  tableNumber: string
  customerName: string
  customerPhone: string
  items: Array<{
    dishId: number
    quantity: number
    price: number
    notes: string
  }>
  notes?: string
}) {
  try {
    // Найдем стол по номеру
    const { data: table } = await supabase.from("tables").select("id").eq("number", orderData.tableNumber).single()

    // Рассчитываем общую сумму
    const totalAmount = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Создаем заказ
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        table_id: table?.id || null,
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        total_amount: totalAmount,
        notes: orderData.notes,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Добавляем позиции заказа
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      dish_id: item.dishId,
      quantity: item.quantity,
      price: item.price,
      notes: item.notes,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) throw itemsError

    revalidatePath("/admin/orders")

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error("Error creating order:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateOrderStatus(orderId: number, status: string) {
  try {
    const { error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (error) throw error

    revalidatePath("/admin/orders")
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
