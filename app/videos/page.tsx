"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MediaGrid } from "@/components/media-grid"
import { MediaFilters } from "@/components/media-filters"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"

export default function VideosPage() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState({
    searchQuery: "",
    selectedYear: "all",
    selectedVenue: "all",
  })

  // Handle URL parameters for filtering
  useEffect(() => {
    const search = searchParams.get("search")
    const venue = searchParams.get("venue")
    
    if (search || venue) {
      setFilters(prev => ({
        ...prev,
        searchQuery: search || "",
        selectedVenue: venue || "all",
      }))
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Videozapisi</h1>
          <p className="text-muted-foreground">
            Pregledajte naše videozapise iz različitih nastupa i događaja
          </p>
        </div>

        <MediaFilters 
          mediaType="videos" 
          onFiltersChange={setFilters}
          initialFilters={{
            searchQuery: filters.searchQuery,
            selectedVenue: filters.selectedVenue
          }}
        />
        <MediaGrid
          mediaType="videos"
          searchQuery={filters.searchQuery}
          selectedYear={filters.selectedYear}
          selectedVenue={filters.selectedVenue}
        />
      </main>
      <Navigation />
    </div>
  )
}
