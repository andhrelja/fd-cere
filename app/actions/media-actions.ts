"use server"

import { googleDriveServerService, type MediaItem } from "@/lib/google-drive-server"

export async function getMediaByType(type: "photos" | "music" | "videos"): Promise<MediaItem[]> {
  return await googleDriveServerService.getMediaByType(type)
}

export async function getRandomPhotos(count = 10): Promise<MediaItem[]> {
  return await googleDriveServerService.getRandomPhotos(count)
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
