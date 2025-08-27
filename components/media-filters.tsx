"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Filter, Calendar, MapPin } from "lucide-react"
import { getAvailableYears, getAvailableVenues } from "@/app/actions/media-actions"

interface MediaFiltersProps {
  mediaType: "photos" | "music" | "videos"
  onFiltersChange: (filters: {
    searchQuery: string
    selectedYear: string
    selectedVenue: string
  }) => void
  initialFilters?: {
    searchQuery?: string
    selectedYear?: string
    selectedVenue?: string
  }
}

export function MediaFilters({ mediaType, onFiltersChange, initialFilters }: MediaFiltersProps) {
  const [searchQuery, setSearchQuery] = useState(initialFilters?.searchQuery || "")
  const [selectedYear, setSelectedYear] = useState<string>(initialFilters?.selectedYear || "all")
  const [selectedVenue, setSelectedVenue] = useState<string>(initialFilters?.selectedVenue || "all")
  const [years, setYears] = useState<string[]>([])
  const [venues, setVenues] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Update internal state when initialFilters change
  useEffect(() => {
    if (initialFilters) {
      setSearchQuery(initialFilters.searchQuery || "")
      setSelectedYear(initialFilters.selectedYear || "all")
      setSelectedVenue(initialFilters.selectedVenue || "all")
    }
  }, [initialFilters])

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true)
        const [availableYears, availableVenues] = await Promise.all([getAvailableYears(), getAvailableVenues()])
        setYears(availableYears)
        setVenues(availableVenues)
      } catch (error) {
        console.error("[v0] Error fetching filter options:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFilterOptions()
  }, [])

  useEffect(() => {
    onFiltersChange({
      searchQuery,
      selectedYear,
      selectedVenue,
    })
  }, [searchQuery, selectedYear, selectedVenue, onFiltersChange])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedYear("all")
    setSelectedVenue("all")
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <h2 className="font-semibold text-foreground">
          Filtriraj {mediaType === "photos" ? "fotografije" : mediaType === "music" ? "glazbu" : "videozapise"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pretraži..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Year filter */}
        <Select value={selectedYear} onValueChange={setSelectedYear} disabled={loading}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={loading ? "Učitavanje..." : "Godina"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Sve godine</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Venue filter */}
        <Select value={selectedVenue} onValueChange={setSelectedVenue} disabled={loading}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder={loading ? "Učitavanje..." : "Mjesto"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Sva mjesta</SelectItem>
            {venues.map((venue) => (
              <SelectItem key={venue} value={venue}>
                {venue}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear filters */}
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          Očisti filtere
        </Button>
      </div>
    </div>
  )
}
