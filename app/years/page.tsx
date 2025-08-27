"use client"

import { useState, useEffect } from "react"
import { DirectoryHierarchy } from "@/components/directory-hierarchy"
import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { getFolderHierarchy } from "@/app/actions/media-actions"

export default function YearsPage() {
  const [hierarchy, setHierarchy] = useState<{
    years: Array<{
      year: string
      mediaTypes: Array<{
        type: "photos" | "music" | "videos"
        typeName: string
        events: Array<{
          id: string
          name: string
          venue: string
          eventName: string
        }>
      }>
    }>
  }>({ years: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        setLoading(true)
        const data = await getFolderHierarchy()
        setHierarchy(data)
      } catch (error) {
        console.error("Error fetching folder hierarchy:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHierarchy()
  }, [])

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Godine</h1>
          <p className="text-muted-foreground">
            Pregledajte našu kolekciju po godinama i kategorijama
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Učitavanje strukture mape...</p>
            </div>
          </div>
        ) : (
          <DirectoryHierarchy years={hierarchy.years} />
        )}
      </main>
      <Navigation />
    </div>
  )
}
