"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, Leaf, Flame, Star, DollarSign } from "lucide-react"
import { searchDishes } from "@/lib/database"
import type { Dish, Category } from "@/lib/database"

interface SearchBarProps {
  categories: Category[]
  onResults: (dishes: Dish[]) => void
  onClear: () => void
}

export function SearchBar({ categories, onResults, onClear }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    vegetarian: false,
    spicy: false,
    popular: false,
    categoryId: undefined as number | undefined,
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
  })
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!query.trim() && !hasActiveFilters()) {
      onClear()
      return
    }

    setIsSearching(true)
    try {
      const results = await searchDishes(query, filters)
      onResults(results)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const hasActiveFilters = () => {
    return (
      filters.vegetarian ||
      filters.spicy ||
      filters.popular ||
      filters.categoryId ||
      filters.minPrice ||
      filters.maxPrice
    )
  }

  const clearFilters = () => {
    setFilters({
      vegetarian: false,
      spicy: false,
      popular: false,
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    })
    setQuery("")
    onClear()
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim() || hasActiveFilters()) {
        handleSearch()
      } else {
        onClear()
      }
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [query, filters])

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 w-5 h-5" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск блюд..."
          className="pl-10 pr-20 bg-black/40 border-amber-500/30 text-white placeholder:text-gray-400"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`text-amber-400 hover:text-amber-300 ${hasActiveFilters() ? "bg-amber-500/20" : ""}`}
          >
            <Filter className="w-4 h-4" />
          </Button>
          {(query || hasActiveFilters()) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-amber-500/20 space-y-4">
          <h3 className="text-white font-medium">Фильтры</h3>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.vegetarian ? "default" : "outline"}
              size="sm"
              onClick={() => setFilters((prev) => ({ ...prev, vegetarian: !prev.vegetarian }))}
              className={filters.vegetarian ? "bg-green-500 text-white" : "border-green-500/30 text-green-400"}
            >
              <Leaf className="w-4 h-4 mr-1" />
              Вегетарианское
            </Button>

            <Button
              variant={filters.spicy ? "default" : "outline"}
              size="sm"
              onClick={() => setFilters((prev) => ({ ...prev, spicy: !prev.spicy }))}
              className={filters.spicy ? "bg-red-500 text-white" : "border-red-500/30 text-red-400"}
            >
              <Flame className="w-4 h-4 mr-1" />
              Острое
            </Button>

            <Button
              variant={filters.popular ? "default" : "outline"}
              size="sm"
              onClick={() => setFilters((prev) => ({ ...prev, popular: !prev.popular }))}
              className={filters.popular ? "bg-amber-500 text-black" : "border-amber-500/30 text-amber-400"}
            >
              <Star className="w-4 h-4 mr-1" />
              Популярное
            </Button>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-amber-200 text-sm font-medium mb-2 block">Категория</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!filters.categoryId ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, categoryId: undefined }))}
                className={!filters.categoryId ? "bg-amber-500 text-black" : "border-amber-500/30 text-amber-400"}
              >
                Все
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={filters.categoryId === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      categoryId: prev.categoryId === category.id ? undefined : category.id,
                    }))
                  }
                  className={
                    filters.categoryId === category.id
                      ? "bg-amber-500 text-black"
                      : "border-amber-500/30 text-amber-400"
                  }
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-amber-200 text-sm font-medium mb-2 block">Цена от</label>
              <Input
                type="number"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                placeholder="0"
                className="bg-black/40 border-amber-500/30 text-white"
              />
            </div>
            <div>
              <label className="text-amber-200 text-sm font-medium mb-2 block">Цена до</label>
              <Input
                type="number"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  }))
                }
                placeholder="∞"
                className="bg-black/40 border-amber-500/30 text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2">
          {filters.vegetarian && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Leaf className="w-3 h-3 mr-1" />
              Вегетарианское
            </Badge>
          )}
          {filters.spicy && (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              <Flame className="w-3 h-3 mr-1" />
              Острое
            </Badge>
          )}
          {filters.popular && (
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              <Star className="w-3 h-3 mr-1" />
              Популярное
            </Badge>
          )}
          {filters.categoryId && (
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              {categories.find((c) => c.id === filters.categoryId)?.name}
            </Badge>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              <DollarSign className="w-3 h-3 mr-1" />
              {filters.minPrice || 0} - {filters.maxPrice || "∞"} ₽
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
