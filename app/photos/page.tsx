"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { MediaGrid } from "@/components/media-grid"
import { MediaFilters } from "@/components/media-filters"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"

function PhotosPageContent() {
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
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Fotografije</h1>
          <p className="text-muted-foreground">
            Pregledajte našu kolekciju fotografija iz različitih nastupa i događaja
          </p>
        </div>

        <MediaFilters 
          mediaType="photos" 
          onFiltersChange={setFilters}
          initialFilters={{
            searchQuery: filters.searchQuery,
            selectedVenue: filters.selectedVenue
          }}
        />
        <MediaGrid
          mediaType="photos"
          searchQuery={filters.searchQuery}
          selectedYear={filters.selectedYear}
          selectedVenue={filters.selectedVenue}
        />
      </main>
      <Navigation />
    </div>
  )
}

export default function PhotosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Učitavanje...</p>
            </div>
          </div>
        </main>
        <Navigation />
      </div>
    }>
      <PhotosPageContent />
    </Suspense>
  )
}
