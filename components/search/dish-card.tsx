"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Leaf, Flame, ChefHat, Plus, AlertTriangle } from "lucide-react"
import { useCart } from "@/lib/cart"
import type { Dish } from "@/lib/database"

interface DishCardProps {
  dish: Dish
}

export function DishCard({ dish }: DishCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image_url: dish.image_url,
    })
  }

  return (
    <Card className="group overflow-hidden bg-black/40 backdrop-blur-xl border border-amber-500/20 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <img
          src={dish.image_url || "/placeholder.svg"}
          alt={dish.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {dish.is_popular && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg text-xs">
              <Star className="w-3 h-3 mr-1" />
              Популярное
            </Badge>
          )}
          {dish.is_chef_special && (
            <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg text-xs">
              <ChefHat className="w-3 h-3 mr-1" />
              От шефа
            </Badge>
          )}
        </div>

        {/* Icons */}
        <div className="absolute top-3 right-3 flex gap-1">
          {dish.is_vegetarian && (
            <div className="w-8 h-8 bg-green-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <Leaf className="w-4 h-4 text-white" />
            </div>
          )}
          {dish.is_spicy && (
            <div className="w-8 h-8 bg-red-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <Flame className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Price */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2">
          <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            {dish.price} ₽
          </span>
        </div>

        {/* Rating */}
        {dish.average_rating && dish.average_rating > 0 && (
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-xl px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-amber-400 text-xs font-medium">{dish.average_rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-white text-lg mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-400 group-hover:to-yellow-500 transition-all duration-300">
            {dish.name}
          </h3>
          <p className="text-gray-300 text-sm line-clamp-2">{dish.description}</p>
        </div>

        {/* Ingredients */}
        {dish.ingredients && dish.ingredients.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {dish.ingredients.slice(0, 3).map((ingredient) => (
                <Badge
                  key={ingredient.id}
                  variant="outline"
                  className={`text-xs ${
                    ingredient.is_allergen
                      ? "border-red-400/50 text-red-300 bg-red-500/10"
                      : "border-amber-500/30 text-amber-200/80 bg-amber-500/10"
                  }`}
                >
                  {ingredient.is_allergen && <AlertTriangle className="w-2 h-2 mr-1" />}
                  {ingredient.name}
                </Badge>
              ))}
              {dish.ingredients.length > 3 && (
                <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-200/80 bg-amber-500/10">
                  +{dish.ingredients.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {dish.cook_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{dish.cook_time}</span>
              </div>
            )}
            <div className="text-amber-400 font-medium">{dish.category?.name}</div>
          </div>

          <Button
            onClick={handleAddToCart}
            size="sm"
            className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-medium"
          >
            <Plus className="w-4 h-4 mr-1" />В корзину
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
