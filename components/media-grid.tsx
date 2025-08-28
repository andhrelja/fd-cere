"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Download, Heart, Share2, Music, Video, ImageIcon } from "lucide-react"
import { getFilteredMedia } from "@/app/actions/media-actions"
import type { MediaItem } from "@/lib/google-drive-server"
import Image from "next/image"

interface MediaGridProps {
  mediaType: "photos" | "music" | "videos"
  searchQuery?: string
  selectedYear?: string
  selectedVenue?: string
}

export function MediaGrid({ mediaType, searchQuery, selectedYear, selectedVenue }: MediaGridProps) {
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        setLoading(true)
        setError(null)

        const items = await getFilteredMedia(mediaType, searchQuery, selectedYear, selectedVenue)
        setMediaItems(items)
      } catch (err) {
        console.error("[v0] Error loading media items:", err)
        setError("Greška pri učitavanju medijskih datoteka")
      } finally {
        setLoading(false)
      }
    }

    fetchMediaItems()
  }, [mediaType, searchQuery, selectedYear, selectedVenue])

  const toggleLike = (id: string) => {
    const newLiked = new Set(likedItems)
    if (newLiked.has(id)) {
      newLiked.delete(id)
    } else {
      newLiked.add(id)
    }
    setLikedItems(newLiked)
  }

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      default:
        return <ImageIcon className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">{getMediaIcon(mediaType)}</div>
        <h3 className="font-semibold text-foreground mb-2">Učitavanje...</h3>
        <p className="text-muted-foreground">Dohvaćanje medijskih datoteka iz Google Drive-a.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">{getMediaIcon(mediaType)}</div>
        <h3 className="font-semibold text-foreground mb-2">Greška</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (mediaItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">{getMediaIcon(mediaType)}</div>
        <h3 className="font-semibold text-foreground mb-2">
          Nema dostupnih{" "}
          {mediaType === "photos" ? "fotografija" : mediaType === "music" ? "glazbenih snimaka" : "videozapisa"}
        </h3>
        <p className="text-muted-foreground">
          Pokušajte s drugim filterima ili provjerite konfiguraciju Google Drive API-ja.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {mediaItems.map((item) => (
        <Card key={item.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
          <CardContent className="p-0">
            {/* Media preview */}
            <div className="relative aspect-square bg-muted">
              {item.type === "image" && (
                <Image
                  src={`/api/proxy-image?url=${encodeURIComponent(item.thumbnail || item.url || "/placeholder.svg")}`}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                />
              )}

              {item.type === "video" && (
                <>
                  <Image
                    src={`/api/proxy-image?url=${encodeURIComponent(item.thumbnail || "/placeholder.svg")}`}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Button size="icon" className="bg-white/90 hover:bg-white text-black">
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  {item.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {item.duration}
                    </div>
                  )}
                </>
              )}

              {item.type === "audio" && (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center">
                    <Music className="h-12 w-12 text-primary mx-auto mb-2" />
                    {item.duration && <div className="text-sm font-medium text-foreground">{item.duration}</div>}
                    <div className="text-xs text-muted-foreground mt-1">{formatFileSize(item.size)}</div>
                  </div>
                </div>
              )}

              {/* Action buttons overlay */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-white/90 hover:bg-white"
                    onClick={() => toggleLike(item.id)}
                  >
                    <Heart className={`h-4 w-4 ${likedItems.has(item.id) ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Media info */}
            {item.type === "image" && (
              <div className="p-4">
              <div className="flex items-start gap-2 mb-2">
                {getMediaIcon(item.type)}
                <h3 className="font-semibold text-sm text-foreground line-clamp-2 flex-1">{item.event}</h3>
              </div>

              {/* <p className="text-xs text-muted-foreground mb-1">{item.venue}</p> */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.venue}</span>
                <span>{item.year}</span>
              </div>

              <div className="flex gap-2 mt-3">
                <Button size="sm" className="flex-1" onClick={() => window.open(item.url, "_blank")}>
                  Otvori
                </Button>
                <Button size="sm" variant="outline" onClick={() => window.open(item.url, "_blank")}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            )}

            {item.type === "video" && (
              <div className="p-4">
              <div className="flex items-start gap-2 mb-2">
                {getMediaIcon(item.type)}
                <h3 className="font-semibold text-sm text-foreground line-clamp-2 flex-1">{item.title}</h3>
              </div>

              {/* <p className="text-xs text-muted-foreground mb-1">{item.venue}</p> */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.venue}</span>
                <span>{item.year}</span>
              </div>

              <div className="flex gap-2 mt-3">
                <Button size="sm" className="flex-1" onClick={() => window.open(item.url, "_blank")}>
                  Pogledaj
                </Button>
                <Button size="sm" variant="outline" onClick={() => window.open(item.url, "_blank")}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            )}

            {item.type === "audio" && (
              <div className="p-4">
              <div className="flex items-start gap-2 mb-2">
                {getMediaIcon(item.type)}
                <h3 className="font-semibold text-sm text-foreground line-clamp-2 flex-1">{item.title}</h3>
              </div>

              <p className="text-xs text-muted-foreground mb-1">{item.venue}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{item.event}</span>
                <span>{item.year}</span>
              </div>

              <div className="flex gap-2 mt-3">
                <Button size="sm" className="flex-1" onClick={() => window.open(item.url, "_blank")}>
                  Reproduciraj
                </Button>
                <Button size="sm" variant="outline" onClick={() => window.open(item.url, "_blank")}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
