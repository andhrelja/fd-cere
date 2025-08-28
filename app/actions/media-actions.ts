"use server"

import { googleDriveServerService, type MediaItem } from "@/lib/google-drive-server"

export async function getMediaByType(type: "photos" | "music" | "videos"): Promise<MediaItem[]> {
  return await googleDriveServerService.getMediaByType(type)
}

export async function getAvailableYears(): Promise<string[]> {
  return await googleDriveServerService.getAvailableYears()
}

export async function getAvailableVenues(): Promise<string[]> {
  return await googleDriveServerService.getAvailableVenues()
}

export async function searchMedia(query: string, type?: "photos" | "music" | "videos"): Promise<MediaItem[]> {
  return await googleDriveServerService.searchMedia(query, type)
}

export async function getFilteredMedia(
  type: "photos" | "music" | "videos",
  searchQuery?: string,
  selectedYear?: string,
  selectedVenue?: string,
): Promise<MediaItem[]> {
  let items: MediaItem[] = []

  if (searchQuery) {
    items = await searchMedia(searchQuery, type)
  } else {
    items = await getMediaByType(type)
  }

  // Apply filters
  if (selectedYear && selectedYear !== "all") {
    items = items.filter((item) => item.year === selectedYear)
  }

  if (selectedVenue && selectedVenue !== "all") {
    items = items.filter((item) => item.venue === selectedVenue)
  }

  return items
}

export async function getFolderHierarchy(): Promise<{
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
}> {
  return await googleDriveServerService.getFolderHierarchy()
}
