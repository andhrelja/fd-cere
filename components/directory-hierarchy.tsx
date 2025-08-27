"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Folder, FolderOpen, FileImage, FileAudio, FileVideo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface Event {
  id: string
  name: string
  venue: string
  eventName: string
}

interface MediaType {
  type: "photos" | "music" | "videos"
  typeName: string
  events: Event[]
}

interface Year {
  year: string
  mediaTypes: MediaType[]
}

interface DirectoryHierarchyProps {
  years: Year[]
}

export function DirectoryHierarchy({ years }: DirectoryHierarchyProps) {
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set())
  const [expandedMediaTypes, setExpandedMediaTypes] = useState<Set<string>>(new Set())
  const router = useRouter()

  const toggleYear = (year: string) => {
    const newExpanded = new Set(expandedYears)
    if (newExpanded.has(year)) {
      newExpanded.delete(year)
    } else {
      newExpanded.add(year)
    }
    setExpandedYears(newExpanded)
  }

  const toggleMediaType = (year: string, mediaType: string) => {
    const key = `${year}-${mediaType}`
    const newExpanded = new Set(expandedMediaTypes)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedMediaTypes(newExpanded)
  }

  const handleEventClick = (mediaType: "photos" | "music" | "videos", venue: string, eventName: string) => {
    // Navigate to the appropriate media page with filters applied
    const searchParams = new URLSearchParams()
    if (venue && venue !== "Nepoznato mjesto") {
      searchParams.set("venue", venue)
    }
    if (eventName && eventName !== "Nepoznat događaj") {
      searchParams.set("search", eventName)
    }
    
    const queryString = searchParams.toString()
    const url = `/${mediaType}${queryString ? `?${queryString}` : ""}`
    router.push(url)
  }

  const getMediaTypeIcon = (type: "photos" | "music" | "videos") => {
    switch (type) {
      case "photos":
        return <FileImage className="h-4 w-4 text-blue-500" />
      case "music":
        return <FileAudio className="h-4 w-4 text-green-500" />
      case "videos":
        return <FileVideo className="h-4 w-4 text-purple-500" />
      default:
        return <Folder className="h-4 w-4 text-gray-500" />
    }
  }

  if (years.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>Nema dostupnih godina</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {years.map((year) => (
        <Card key={year.year} className="overflow-hidden">
          <CardContent className="p-0">
            <Button
              variant="ghost"
              className="w-full justify-start h-12 px-4 rounded-none border-b border-border/50"
              onClick={() => toggleYear(year.year)}
            >
              {expandedYears.has(year.year) ? (
                <ChevronDown className="h-4 w-4 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2" />
              )}
              <span className="font-semibold text-lg">{year.year}</span>
              <span className="ml-auto text-sm text-muted-foreground">
                {year.mediaTypes.reduce((total, mt) => total + mt.events.length, 0)} događaja
              </span>
            </Button>
            
            {expandedYears.has(year.year) && (
              <div className="bg-muted/30">
                {year.mediaTypes.map((mediaType) => (
                  <div key={`${year.year}-${mediaType.type}`}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-10 px-6 rounded-none border-b border-border/30"
                      onClick={() => toggleMediaType(year.year, mediaType.type)}
                    >
                      {expandedMediaTypes.has(`${year.year}-${mediaType.type}`) ? (
                        <ChevronDown className="h-4 w-4 mr-2" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mr-2" />
                      )}
                      {getMediaTypeIcon(mediaType.type)}
                      <span className="ml-2">{mediaType.typeName}</span>
                      <span className="ml-auto text-sm text-muted-foreground">
                        {mediaType.events.length} događaja
                      </span>
                    </Button>
                    
                    {expandedMediaTypes.has(`${year.year}-${mediaType.type}`) && (
                      <div className="bg-background">
                        {mediaType.events.map((event) => (
                          <Button
                            key={event.id}
                            variant="ghost"
                            className="w-full justify-start h-9 px-8 rounded-none hover:bg-accent"
                            onClick={() => handleEventClick(mediaType.type, event.venue, event.eventName)}
                          >
                            <span className="text-sm">
                              <span className="font-medium">{event.venue}</span>
                              {event.eventName && event.eventName !== "Nepoznat događaj" && (
                                <span className="text-muted-foreground ml-2">- {event.eventName}</span>
                              )}
                            </span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 