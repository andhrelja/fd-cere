import "server-only"

interface MediaItem {
  id: string
  title: string
  event: string
  venue?: string
  year: string
  thumbnail?: string
  url?: string
  duration?: string
  type: "image" | "audio" | "video"
  mimeType: string
  size: number
  createdTime: string
}

interface GoogleDriveFile {
  id: string
  name: string
  mimeType: string
  size: string
  createdTime: string
  parents: string[]
  webViewLink: string
  webContentLink: string
  thumbnailLink?: string
  path?: string
}

class GoogleDriveServerService {
  private apiKey: string
  private folderId: string

  constructor() {
    this.apiKey = process.env.GOOGLE_DRIVE_API_KEY || ""
    this.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || ""

    if (!this.apiKey || !this.folderId) {
      console.warn("[v0] Google Drive API key or folder ID not configured on server")
    }
  }

  private async fetchFromDrive(endpoint: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error("Google Drive API key not configured")
    }

    const response = await fetch(`https://www.googleapis.com/drive/v3/${endpoint}&key=${this.apiKey}`, {
      headers: {
        Accept: "application/json",
      },
      // Add caching for better performance
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`Google Drive API error: ${response.statusText}`)
    }

    return response.json()
  }

  private parsePathInfo(path: string): { type: string; year: string; eventInfo: string } {
    // Parse path like: /Multimedia/Photos/2023/Pula-Ljetni_festival_folklora/image.jpg
    const parts = path.split("/")
    const type = parts[1]?.toLowerCase() == "slike" ? "image" : parts[1]?.toLowerCase() == "muzika" ? "audio" : "video"
    const year = parts[2].trim() || "unknown"
    const venue = parts[3].trim() || "unknown"
    const event = parts[4].trim() || "unknown"

    return {
      type,
      year,
      eventInfo: `${venue} | ${event}`,
    }
  }

  private async getFolderContents(folderId: string): Promise<GoogleDriveFile[]> {
    const data = await this.fetchFromDrive(
      `files?q='${folderId}'+in+parents&fields=files(id,name,mimeType,size,createdTime,parents,webViewLink,webContentLink,thumbnailLink)`,
    )
    return data.files || []
  }

  private async getAllMediaFiles(): Promise<GoogleDriveFile[]> {
    const allFiles: GoogleDriveFile[] = []

    // Get multimedia folder contents
    const multimediaFolder = await this.getFolderContents(this.folderId)

    // Process each type folder (Photos, Music, Videos)
    for (const typeFolder of multimediaFolder.filter(folder => Array.from(["Slike", "Muzika", "Video i Film"]).includes(folder.name))) {
      if (typeFolder.mimeType === "application/vnd.google-apps.folder") {
        const yearFolders = await this.getFolderContents(typeFolder.id)
        // Process each year folder
        for (const yearFolder of yearFolders) {
          if (yearFolder.mimeType === "application/vnd.google-apps.folder") {
            const venueFolders = await this.getFolderContents(yearFolder.id)

            for (const venueFolder of venueFolders) {
              if (venueFolder.mimeType === "application/vnd.google-apps.folder") {
                const eventFolders = await this.getFolderContents(venueFolder.id)
                // Process each event folder
                for (const eventFolder of eventFolders) {
                  if (eventFolder.mimeType === "application/vnd.google-apps.folder") {
                    const mediaFiles = await this.getFolderContents(eventFolder.id)
                    // console.log(mediaFiles)
                    // Add path context to each file
                    const filesWithPath = mediaFiles.filter(mediaFile => mediaFile.mimeType !== "application/vnd.google-apps.folder" || mediaFile.name.endsWith(".jpeg") || mediaFile.name.endsWith(".png") || mediaFile.name.endsWith(".mp4") || mediaFile.name.endsWith(".mp3") || mediaFile.name.endsWith(".jpg")).map((file) => ({
                      ...file,
                      path: `/${typeFolder.name}/${yearFolder.name}/${venueFolder.name}/${eventFolder.name}/${file.name}`,
                    }))
    
                    allFiles.push(...filesWithPath)
                  }
                }
              }
            }
          }
        }
      }
    }

    return allFiles
  }

  private convertToMediaItem(file: GoogleDriveFile): MediaItem {
    const pathInfo = file.path
      ? this.parsePathInfo(file.path)
      : { type: "image", year: "unknown", eventInfo: "unknown|unknown" }
    const [venue, event] = pathInfo.eventInfo.split("|")

    return {
      id: file.id,
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      event: event || "Nepoznat događaj",
      venue: venue || "Nepoznato mjesto",
      year: pathInfo.year,
      thumbnail: file.thumbnailLink,
      url: file.webContentLink,
      type: pathInfo.type as "image" | "audio" | "video",
      mimeType: file.mimeType,
      size: Number.parseInt(file.size) || 0,
      createdTime: file.createdTime,
    }
  }

  async getMediaByType(type: "photos" | "music" | "videos"): Promise<MediaItem[]> {
    try {
      const allFiles = await this.getAllMediaFiles()
      const mediaType = type === "photos" ? "image" : type === "music" ? "audio" : "video"

      return allFiles
        .filter((file) => {
          const pathInfo = file.path ? this.parsePathInfo(file.path) : { type: "unknown" }
          // console.log(pathInfo)
          return pathInfo.type === mediaType
        })
        .map((file) => this.convertToMediaItem(file))
        .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())
    } catch (error) {
      console.error("[v0] Error fetching media from Google Drive:", error)
      return []
    }
  }

  async getAvailableYears(): Promise<string[]> {
    try {
      const allFiles = await this.getAllMediaFiles()
      const years = new Set<string>()

      allFiles.forEach((file) => {
        if (file.path) {
          const pathInfo = this.parsePathInfo(file.path)
          years.add(pathInfo.year)
        }
      })

      return Array.from(years).sort().reverse()
    } catch (error) {
      console.error("[v0] Error fetching available years:", error)
      return []
    }
  }

  async getAvailableVenues(): Promise<string[]> {
    try {
      const allFiles = await this.getAllMediaFiles()
      const venues = new Set<string>()

      allFiles.forEach((file) => {
        if (file.path) {
          const pathInfo = this.parsePathInfo(file.path)
          const [venue] = pathInfo.eventInfo.split("|")
          if (venue && venue !== "unknown") {
            venues.add(venue)
          }
        }
      })

      return Array.from(venues).sort()
    } catch (error) {
      console.error("[v0] Error fetching available venues:", error)
      return []
    }
  }

  async searchMedia(query: string, type?: "photos" | "music" | "videos"): Promise<MediaItem[]> {
    try {
      const allFiles = await this.getAllMediaFiles()
      const searchTerm = query.toLowerCase()

      return allFiles
        .filter((file) => {
          if (type) {
            const pathInfo = file.path ? this.parsePathInfo(file.path) : { type: "unknown" }
            const mediaType = type === "photos" ? "image" : type === "music" ? "audio" : "video"
            if (pathInfo.type !== mediaType) return false
          }

          return (
            file.name.toLowerCase().includes(searchTerm) || (file.path && file.path.toLowerCase().includes(searchTerm))
          )
        })
        .map((file) => this.convertToMediaItem(file))
        .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())
    } catch (error) {
      console.error("[v0] Error searching media from Google Drive:", error)
      return []
    }
  }

  async getFolderHierarchy(): Promise<{
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
    try {
      const multimediaFolder = await this.getFolderContents(this.folderId)
      const years: Array<{
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
      }> = []

      // Process each type folder (Photos, Music, Videos)
      for (const typeFolder of multimediaFolder) {
        if (typeFolder.mimeType === "application/vnd.google-apps.folder") {
          const yearFolders = await this.getFolderContents(typeFolder.id)

          // Process each year folder
          for (const yearFolder of yearFolders) {
            if (yearFolder.mimeType === "application/vnd.google-apps.folder") {
              const eventFolders = await this.getFolderContents(yearFolder.id)

              // Find or create year entry
              let yearEntry = years.find(y => y.year === yearFolder.name)
              if (!yearEntry) {
                yearEntry = {
                  year: yearFolder.name,
                  mediaTypes: []
                }
                years.push(yearEntry)
              }

              // Find or create media type entry
              const mediaType = this.getMediaTypeFromFolderName(typeFolder.name)
              let mediaTypeEntry = yearEntry.mediaTypes.find(mt => mt.type === mediaType)
              if (!mediaTypeEntry) {
                mediaTypeEntry = {
                  type: mediaType,
                  typeName: this.getMediaTypeDisplayName(mediaType),
                  events: []
                }
                yearEntry.mediaTypes.push(mediaTypeEntry)
              }

              // Add events
              for (const eventFolder of eventFolders) {
                if (eventFolder.mimeType === "application/vnd.google-apps.folder") {
                  const [venue, ...eventParts] = eventFolder.name.split("-")
                  const eventName = eventParts.join(" ").replace(/_/g, " ")
                  
                  mediaTypeEntry.events.push({
                    id: eventFolder.id,
                    name: eventFolder.name,
                    venue: venue || "Nepoznato mjesto",
                    eventName: eventName || "Nepoznat događaj"
                  })
                }
              }
            }
          }
        }
      }

      // Sort years descending, media types, and events alphabetically
      years.sort((a, b) => b.year.localeCompare(a.year))
      years.forEach(year => {
        year.mediaTypes.sort((a, b) => a.typeName.localeCompare(b.typeName))
        year.mediaTypes.forEach(mediaType => {
          mediaType.events.sort((a, b) => a.venue.localeCompare(b.venue))
        })
      })

      return { years }
    } catch (error) {
      console.error("[v0] Error fetching folder hierarchy:", error)
      return { years: [] }
    }
  }

  private getMediaTypeFromFolderName(folderName: string): "photos" | "music" | "videos" {
    const name = folderName.toLowerCase()
    if (name.includes("slike") || name.includes("photos") || name.includes("foto")) {
      return "photos"
    } else if (name.includes("muzika") || name.includes("music") || name.includes("glazba")) {
      return "music"
    } else {
      return "videos"
    }
  }

  private getMediaTypeDisplayName(type: "photos" | "music" | "videos"): string {
    switch (type) {
      case "photos":
        return "Fotografije"
      case "music":
        return "Glazba"
      case "videos":
        return "Videozapisi"
      default:
        return "Nepoznato"
    }
  }
}

// Export singleton instance
export const googleDriveServerService = new GoogleDriveServerService()
export type { MediaItem }
