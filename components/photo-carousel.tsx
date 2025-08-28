"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react"
import type { MediaItem } from "@/lib/google-drive-server"
import Image from "next/image"

export function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [homePhotos, setHomePhotos] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHomePhotos = async () => {
      try {
        setLoading(true)
        setError(null)
        const photos = [
          {
            id: "1IRSnCzUj70-2KB1xR3Z7wtdJR9BzGfks",
            title: "Sveti Lovreč",
            event: "10. Smotra narodne muzike i plesa",
            venue: "Sveti Lovreč",
            year: "1980e",
            thumbnail: "https://lh3.googleusercontent.com/drive-storage/AJQWtBPk99AJDE0lRdc-HOX1vS26ZSQKQagvX3lxjcJXayV135C-wfreC2l2Cn4CTxjLKjVPTC9RPYxWRMjbzM6AEXQG1zqq8B8WhWmO=s220",
            url: "/home-photos/Sveti Lovreč.jpg",
            type: "image" as const,
            mimeType: "image/jpeg",
            size: 2818750,
            createdTime: "2024-05-30T08:03:24.515Z",
          },
          {
            id: "1gAgchQcOZn4N0cSDN5TFGu1kiamw_Oz5",
            title: "Zagreb_1980_2",
            event: " 15. Međunarodna smotra Folklora",
            venue: "Zagreb ",
            year: "1980e",
            thumbnail: "https://lh3.googleusercontent.com/drive-storage/AJQWtBNqZiLelcI1eHoS0blMnILZehAmN0BZj--Nm86Q2d_FPjuf2iq6sSPSbivB-605MvS4Ff1myceIQqU3EF_m6oYZKtGquun8WitW=s220",
            url: "/home-photos/Zagreb_1980_2.jpg",
            type: "image" as const,
            mimeType: "image/jpeg",
            size: 18320901,
            createdTime: "2024-05-30T08:04:16.761Z",
          },
          {
            id: "1Vc0VtE_0xL15jKrejyoYGQ3PSk4__0Pw",
            title: "Zagreb_1974_2",
            event: " 9. Međunarodna smotra Folklora",
            venue: "Zagreb ",
            year: "1970e",
            thumbnail: "https://lh3.googleusercontent.com/drive-storage/AJQWtBMnGD_Em1Hjx_hJL7qeDOCuPg7RueWZ9JcasfnHB-6lIX9CsLikjdm4g9daPsKeeMAw9QDDqfs5uH8gewbIz0m3DRbgsa-4NLiQ=s220",
            url: "/home-photos/Zagreb_1974_2.jpg",
            type: "image" as const,
            mimeType: "image/jpeg",
            size: 11606407,
            createdTime: "2024-05-30T08:04:33.951Z",
          },
          {
            id: "1NlaPf71UyEdAzs1MaiQBYyo9TyBh-dPH",
            title: "Zagreb_1978_2",
            event: " 13. Međunarodna smotra Folklora",
            venue: "Zagreb ",
            year: "1970e",
            thumbnail: "https://lh3.googleusercontent.com/drive-storage/AJQWtBOGAvTyc4-k7M2VaNnjngVOgT6_3AhVuypMsr-QxthOWuyTuXs7woLLlsQQqxekhsB7fFTT0FxRO6rgHOGt6EaUWtWblB8rMwII=s220",
            url: "/home-photos/Zagreb_1978_2.jpg",
            type: "image" as const,
            mimeType: "image/jpeg",
            size: 10353925,
            createdTime: "2024-05-30T08:04:51.961Z",
          },
          {
            id: "1-pyj7ZVfgsItOhs92D2frV4tQlSobWPQ",
            title: "Salzburg_6",
            event: " (*) Festival",
            venue: "Salzburg ",
            year: "1980e",
            thumbnail: "https://lh3.googleusercontent.com/drive-storage/AJQWtBNbPJmMJHNXxQ9QiXaau4Ek-TFwgvp14ZF2-7ia6I5tnttNoz06tNvKTqbs6_fZ8uZGda8KvA1sUpNXL89Lzn-3xFVE9wClDb4dgw=s220",
            url: "/home-photos/Salzburg_6.jpg",
            type: "image" as const,
            mimeType: "image/jpeg",
            size: 8755563,
            createdTime: "2024-05-30T07:44:10.768Z",
          },
          {
            id: "1IIyKw0dLp8oGbL5cwQwrKl6Oc-yXUGwU",
            title: "Savičenta_2",
            event: " Dan istarske svirke, kante, plesa i mladoga vina",
            venue: "Savičenta ",
            year: "1950e",
            thumbnail: "https://lh3.googleusercontent.com/drive-storage/AJQWtBMzSeWuPnGZsgmHe7lCe7t-UAynvN1eCPwlDz33QrSeZoe-4TfBmoE5cdyQ8RG3hZGwEpX-pc8E0xvFBmNCYKh81zJGPqVcVyzSMw=s220",
            url: "/home-photos/Savičenta_2.jpg",
            type: "image" as const,
            mimeType: "image/jpeg",
            size: 15340200,
            createdTime: "2024-05-30T08:03:00.369Z",
          },
          {
            id: "1kuQOAU8seu_8MkhUipmXDNu-sIPjCS4e",
            title: "Cere_8",
            event: "(*) Obljetnica",
            venue: "Cere ",
            year: "1970e",
            thumbnail: "https://lh3.googleusercontent.com/drive-storage/AJQWtBNEDg9SKUSajtTGwyzSGUrjvDJHo_-E0sm_HHk_YdlJNCVIeUR6SkkLaOImo79_CHcBhKisP6Qmp36rT60z7bwe-veK3YEP8Dsr0g=s220",
            url: "/home-photos/Cere_8.jpg",
            type: "image" as const,
            mimeType: "image/jpeg",
            size: 4155247,
            createdTime: "2024-05-30T07:41:24.651Z",
          },
          {
            id: "1F9df-htryncUY6MU-rf8cdzFYbfRfnjN/",
            title: "Savičenta dani mladog vina 1968",
            event: "Dan istarske svirke, kante, plesa i mladoga vina",
            venue: "Svetvinčenat",
            year: "1968",
            thumbnail: "https://lh3.googleusercontent.com/drive-storage/AJQWtBNEDg9SKUSajtTGwyzSGUrjvDJHo_-E0sm_HHk_YdlJNCVIeUR6SkkLaOImo79_CHcBhKisP6Qmp36rT60z7bwe-veK3YEP8Dsr0g=s220",
            url: "/home-photos/Savičenta dani mladog vina 1968.jpg",
            type: "image" as const,
            mimeType: "image/jpeg",
            size: 4155247,
            createdTime: "2024-05-30T07:41:24.651Z",
          },
        ]
        setHomePhotos(photos)
      } catch (err) {
        console.error("[v0] Error loading photos:", err)
        setError("Greška pri učitavanju fotografija")
      } finally {
        setLoading(false)
      }
    }

    fetchHomePhotos()
  }, [])

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % homePhotos.length)
  }

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + homePhotos.length) % homePhotos.length)
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

  if (error || homePhotos.length === 0) {
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

  const currentPhoto = homePhotos[currentIndex]

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-[400px] md:h-[500px]">
            <Image
              src={currentPhoto.url || '/placeholder.svg'}
              alt={currentPhoto.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
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
              <h3 className="text-white font-serif text-xl font-bold mb-1">{currentPhoto.event}</h3>
              <p className="text-white/80 text-sm mb-2">
                {currentPhoto.venue} • {currentPhoto.year}
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
            {homePhotos.map((_, index) => (
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
        {currentIndex + 1} od {homePhotos.length} fotografija
      </div>
    </div>
  )
}
