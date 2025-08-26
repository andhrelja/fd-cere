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
}

class GoogleDriveService {
  private apiKey: string
  private folderId: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY || ""
    this.folderId = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID || ""

    if (!this.apiKey || !this.folderId) {
      console.warn("[v0] Google Drive API key or folder ID not configured")
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
    })

    if (!response.ok) {
      throw new Error(`Google Drive API error: ${response.statusText}`)
    }

    return response.json()
  }

  private parsePathInfo(path: string): { type: string; year: string; eventInfo: string } {
    // Parse path like: /Multimedia/Photos/2023/Pula-Ljetni_festival_folklora/image.jpg
    const parts = path.split("/")
    const type = parts[2]?.toLowerCase() || "unknown"
    const year = parts[3] || "unknown"
    const eventFolder = parts[4] || "unknown"

    // Extract venue and event from folder name like "Pula-Ljetni_festival_folklora"
    const [venue, ...eventParts] = eventFolder.split("-")
    const event = eventParts.join(" ").replace(/_/g, " ")

    return {
      type: type === "photos" ? "image" : type === "music" ? "audio" : "video",
      year,
      eventInfo: `${venue}|${event}`,
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
    for (const typeFolder of multimediaFolder) {
      if (typeFolder.mimeType === "application/vnd.google-apps.folder") {
        const yearFolders = await this.getFolderContents(typeFolder.id)

        // Process each year folder
        for (const yearFolder of yearFolders) {
          if (yearFolder.mimeType === "application/vnd.google-apps.folder") {
            const eventFolders = await this.getFolderContents(yearFolder.id)

            // Process each event folder
            for (const eventFolder of eventFolders) {
              if (eventFolder.mimeType === "application/vnd.google-apps.folder") {
                const mediaFiles = await this.getFolderContents(eventFolder.id)

                // Add path context to each file
                const filesWithPath = mediaFiles.map((file) => ({
                  ...file,
                  path: `/${typeFolder.name}/${yearFolder.name}/${eventFolder.name}/${file.name}`,
                }))

                allFiles.push(...filesWithPath)
              }
            }
          }
        }
      }
    }

    return allFiles
  }

  private convertToMediaItem(file: GoogleDriveFile & { path?: string }): MediaItem {
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
          return pathInfo.type === mediaType
        })
        .map((file) => this.convertToMediaItem(file))
        .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())
    } catch (error) {
      console.error("[v0] Error fetching media from Google Drive:", error)
      return []
    }
  }

  async getRandomPhotos(count = 10): Promise<MediaItem[]> {
    try {
      const photos = await this.getMediaByType("photos")
      const shuffled = [...photos].sort(() => 0.5 - Math.random())
      return shuffled.slice(0, count)
    } catch (error) {
      console.error("[v0] Error fetching random photos:", error)
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
      console.error("[v0] Error searching media:", error)
      return []
    }
  }
}

// Export singleton instance
export const googleDriveService = new GoogleDriveService()
export type { MediaItem }
