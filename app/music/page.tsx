"use client"

import { useState } from "react"
import { MediaGrid } from "@/components/media-grid"
import { MediaFilters } from "@/components/media-filters"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"

export default function MusicPage() {
  const [filters, setFilters] = useState({
    searchQuery: "",
    selectedYear: "all",
    selectedVenue: "all",
  })

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Glazba</h1>
          <p className="text-muted-foreground">Poslušajte tradicionalne melodije i naše snimke</p>
        </div>

        <MediaFilters mediaType="music" onFiltersChange={setFilters} />
        <MediaGrid
          mediaType="music"
          searchQuery={filters.searchQuery}
          selectedYear={filters.selectedYear}
          selectedVenue={filters.selectedVenue}
        />
      </main>
      <Navigation />
    </div>
  )
}
