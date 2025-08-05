"use server"

import { supabase } from "@/lib/database"
import { revalidatePath } from "next/cache"

// Функция для удаления изображения из Blob
async function deleteImageFromBlob(imageUrl: string) {
  if (!imageUrl || !imageUrl.includes("blob.vercel-storage.com")) {
    return // Не Blob изображение, удаление не требуется
  }

  try {
    await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/delete-image?url=${encodeURIComponent(imageUrl)}`,
      {
        method: "DELETE",
      },
    )
  } catch (error) {
    console.error("Ошибка удаления изображения:", error)
  }
}

// Действия для категорий
export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const colorGradient = formData.get("colorGradient") as string
  const imageUrl = formData.get("imageUrl") as string

  const { data, error } = await supabase
    .from("categories")
    .insert({
      name,
      description,
      color_gradient: colorGradient,
      image_url: imageUrl,
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/categories")
  revalidatePath("/")
  return { success: true, data }
}

export async function updateCategory(id: number, formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const colorGradient = formData.get("colorGradient") as string
  const imageUrl = formData.get("imageUrl") as string
  const isActive = formData.get("isActive") === "on"

  // Получаем старое изображение для удаления
  const { data: oldCategory } = await supabase.from("categories").select("image_url").eq("id", id).single()

  const { data, error } = await supabase
    .from("categories")
    .update({
      name,
      description,
      color_gradient: colorGradient,
      image_url: imageUrl,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  // Удаляем старое изображение, если оно изменилось
  if (oldCategory?.image_url && oldCategory.image_url !== imageUrl) {
    await deleteImageFromBlob(oldCategory.image_url)
  }

  revalidatePath("/admin/categories")
  revalidatePath("/")
  return { success: true, data }
}

export async function deleteCategory(id: number) {
  // Получаем изображение для удаления
  const { data: category } = await supabase.from("categories").select("image_url").eq("id", id).single()

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  // Удаляем изображение из Blob
  if (category?.image_url) {
    await deleteImageFromBlob(category.image_url)
  }

  revalidatePath("/admin/categories")
  revalidatePath("/")
  return { success: true }
}

export async function toggleCategoryStatus(id: number) {
  // Получаем текущее состояние
  const { data: currentCategory } = await supabase.from("categories").select("is_active").eq("id", id).single()

  if (!currentCategory) {
    return { success: false, error: "Категория не найдена" }
  }

  const { data, error } = await supabase
    .from("categories")
    .update({
      is_active: !currentCategory.is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/categories")
  revalidatePath("/")
  return { success: true, data }
}

// Действия для блюд
export async function createDish(formData: FormData) {
  const categoryId = Number.parseInt(formData.get("categoryId") as string)
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const cookTime = formData.get("cookTime") as string
  const imageUrl = formData.get("imageUrl") as string
  const isPopular = formData.get("isPopular") === "on"
  const isVegetarian = formData.get("isVegetarian") === "on"
  const isSpicy = formData.get("isSpicy") === "on"
  const isChefSpecial = formData.get("isChefSpecial") === "on"

  const { data, error } = await supabase
    .from("dishes")
    .insert({
      category_id: categoryId,
      name,
      description,
      price,
      cook_time: cookTime,
      image_url: imageUrl,
      is_popular: isPopular,
      is_vegetarian: isVegetarian,
      is_spicy: isSpicy,
      is_chef_special: isChefSpecial,
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  // Добавляем ингредиенты
  const ingredients = formData.getAll("ingredients") as string[]
  if (ingredients.length > 0) {
    const ingredientInserts = ingredients.map((ingredientId) => ({
      dish_id: data.id,
      ingredient_id: Number.parseInt(ingredientId),
    }))

    await supabase.from("dish_ingredients").insert(ingredientInserts)
  }

  revalidatePath("/admin/dishes")
  revalidatePath("/")
  return { success: true, data }
}

export async function updateDish(id: number, formData: FormData) {
  const categoryId = Number.parseInt(formData.get("categoryId") as string)
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const cookTime = formData.get("cookTime") as string
  const imageUrl = formData.get("imageUrl") as string
  const isPopular = formData.get("isPopular") === "on"
  const isVegetarian = formData.get("isVegetarian") === "on"
  const isSpicy = formData.get("isSpicy") === "on"
  const isChefSpecial = formData.get("isChefSpecial") === "on"
  const isAvailable = formData.get("isAvailable") === "on"
  const isStopped = formData.get("isStopped") === "on"

  // Получаем старое изображение для удаления
  const { data: oldDish } = await supabase.from("dishes").select("image_url").eq("id", id).single()

  const { data, error } = await supabase
    .from("dishes")
    .update({
      category_id: categoryId,
      name,
      description,
      price,
      cook_time: cookTime,
      image_url: imageUrl,
      is_popular: isPopular,
      is_vegetarian: isVegetarian,
      is_spicy: isSpicy,
      is_chef_special: isChefSpecial,
      is_available: isAvailable,
      is_stopped: isStopped,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  // Удаляем старое изображение, если оно изменилось
  if (oldDish?.image_url && oldDish.image_url !== imageUrl) {
    await deleteImageFromBlob(oldDish.image_url)
  }

  // Обновляем ингредиенты
  await supabase.from("dish_ingredients").delete().eq("dish_id", id)

  const ingredients = formData.getAll("ingredients") as string[]
  if (ingredients.length > 0) {
    const ingredientInserts = ingredients.map((ingredientId) => ({
      dish_id: id,
      ingredient_id: Number.parseInt(ingredientId),
    }))

    await supabase.from("dish_ingredients").insert(ingredientInserts)
  }

  revalidatePath("/admin/dishes")
  revalidatePath("/")
  return { success: true, data }
}

export async function toggleDishStatus(id: number, field: "is_stopped" | "is_available") {
  // Получаем текущее состояние
  const { data: currentDish } = await supabase.from("dishes").select(field).eq("id", id).single()

  if (!currentDish) {
    return { success: false, error: "Блюдо не найдено" }
  }

  const { data, error } = await supabase
    .from("dishes")
    .update({
      [field]: !currentDish[field],
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/dishes")
  revalidatePath("/")
  return { success: true, data }
}

export async function deleteDish(id: number) {
  // Получаем изображение для удаления
  const { data: dish } = await supabase.from("dishes").select("image_url").eq("id", id).single()

  const { error } = await supabase.from("dishes").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  // Удаляем изображение из Blob
  if (dish?.image_url) {
    await deleteImageFromBlob(dish.image_url)
  }

  revalidatePath("/admin/dishes")
  revalidatePath("/")
  return { success: true }
}

// Действия для ингредиентов
export async function createIngredient(formData: FormData) {
  const name = formData.get("name") as string
  const isAllergen = formData.get("isAllergen") === "on"

  const { data, error } = await supabase
    .from("ingredients")
    .insert({
      name,
      is_allergen: isAllergen,
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/ingredients")
  return { success: true, data }
}

export async function deleteIngredient(id: number) {
  const { error } = await supabase.from("ingredients").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/ingredients")
  return { success: true }
}
