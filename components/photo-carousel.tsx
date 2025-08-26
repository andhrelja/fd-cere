"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react"
import { getRandomPhotos } from "@/app/actions/media-actions"
import type { MediaItem } from "@/lib/google-drive-server"

export function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [randomPhotos, setRandomPhotos] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRandomPhotos = async () => {
      try {
        setLoading(true)
        setError(null)
        const photos = await getRandomPhotos(10)
        setRandomPhotos(photos)
      } catch (err) {
        console.error("[v0] Error loading photos:", err)
        setError("Greška pri učitavanju fotografija")
      } finally {
        setLoading(false)
      }
    }

    fetchRandomPhotos()
  }, [])

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % randomPhotos.length)
  }

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + randomPhotos.length) % randomPhotos.length)
  }

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Učitavanje fotografija...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || randomPhotos.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              {error || "Nema dostupnih fotografija. Provjerite konfiguraciju Google Drive API-ja."}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentPhoto = randomPhotos[currentIndex]

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <img
              src={currentPhoto.thumbnail || currentPhoto.url || "/placeholder.svg"}
              alt={currentPhoto.title}
              className="w-full h-[400px] md:h-[500px] object-cover"
            />

            {/* Navigation buttons */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
              onClick={prevPhoto}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
              onClick={nextPhoto}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Photo info overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <h3 className="text-white font-serif text-xl font-bold mb-1">{currentPhoto.title}</h3>
              <p className="text-white/80 text-sm mb-2">
                {currentPhoto.event} • {currentPhoto.year}
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Sviđa mi se
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Podijeli
                </Button>
              </div>
            </div>
          </div>

          {/* Photo indicators */}
          <div className="flex justify-center gap-2 p-4 bg-muted/30">
            {randomPhotos.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-4 text-sm text-muted-foreground">
        {currentIndex + 1} od {randomPhotos.length} fotografija
      </div>
    </div>
  )
}
