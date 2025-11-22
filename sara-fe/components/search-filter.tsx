"use client"
import { useState } from "react"
import { Search, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchFilterProps {
  onSearch: (query: string) => void
  onFilter: (filters: FilterState) => void
  type: "sites" | "hotels" | "tours"
}

export interface FilterState {
  query: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  category?: string
  destination?: string
}

export default function SearchFilter({ onSearch, onFilter, type }: SearchFilterProps) {
  const [query, setQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({ query: "" })

  const handleSearch = (value: string) => {
    setQuery(value)
    const newFilters = { ...filters, query: value }
    setFilters(newFilters)
    onSearch(value)
    onFilter(newFilters)
  }

  const handleFilterChange = (newFilter: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilter };
    setFilters(updated)
    onFilter(updated)
  }

  const clearFilters = () => {
    setQuery("")
    setFilters({ query: "" })
    onSearch("")
    onFilter({ query: "" })
  }

  const hasActiveFilters = query || filters.minPrice || filters.maxPrice || filters.minRating || filters.category || filters.destination

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={`Search ${type}...`}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={() => handleSearch("")}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowFilters(!showFilters)}
        className="w-full justify-between"
      >
        <span>Filters {hasActiveFilters && `(${Object.values(filters).filter(Boolean).length})`}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
      </Button>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-muted/50 rounded-lg p-4 space-y-4 border border-border/50">
          {/* Price Range Filter */}
          {(type === "hotels" || type === "tours") && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Price Range</label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ""}
                  onChange={(e) => handleFilterChange({ minPrice: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="flex-1"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ""}
                  onChange={(e) => handleFilterChange({ maxPrice: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="flex-1"
                />
              </div>
            </div>
          )}

          {/* Rating Filter */}
          {(type === "hotels" || type === "sites") && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Minimum Rating</label>
              <select
                value={filters.minRating || ""}
                onChange={(e) => handleFilterChange({ minRating: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full px-3 py-2 rounded-md bg-background border border-input text-sm"
              >
                <option value="">Any</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
          )}

          {/* Category Filter */}
          {type === "sites" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                value={filters.category || ""}
                onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
                className="w-full px-3 py-2 rounded-md bg-background border border-input text-sm"
              >
                <option value="">All Categories</option>
                <option value="Monument">Monument</option>
                <option value="Museum">Museum</option>
                <option value="Natural">Natural</option>
                <option value="Historical">Historical</option>
                <option value="Cultural">Cultural</option>
              </select>
            </div>
          )}

          {/* Destination Filter */}
          {type === "tours" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Destination</label>
              <Input
                placeholder="Search destination..."
                value={filters.destination || ""}
                onChange={(e) => handleFilterChange({ destination: e.target.value || undefined })}
              />
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="w-full"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
