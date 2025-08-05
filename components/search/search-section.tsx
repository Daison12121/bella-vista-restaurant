"use client"

import { useState } from "react"
import { SearchBar } from "./search-bar"
import { DishCard } from "./dish-card"
import type { Dish, Category } from "@/lib/database"

interface SearchSectionProps {
  categories: Category[]
}

export function SearchSection({ categories }: SearchSectionProps) {
  const [searchResults, setSearchResults] = useState<Dish[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearchResults = (dishes: Dish[]) => {
    setSearchResults(dishes)
    setIsSearching(true)
  }

  const handleClearSearch = () => {
    setSearchResults([])
    setIsSearching(false)
  }

  return (
    <section className="relative py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">Найдите идеальное блюдо</h3>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Используйте поиск и фильтры, чтобы найти именно то, что вам хочется
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar categories={categories} onResults={handleSearchResults} onClear={handleClearSearch} />
        </div>

        {isSearching && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-2xl font-bold text-white">Результаты поиска ({searchResults.length})</h4>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">По вашему запросу ничего не найдено</p>
                <p className="text-gray-500 mt-2">Попробуйте изменить параметры поиска</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((dish) => (
                  <DishCard key={dish.id} dish={dish} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
