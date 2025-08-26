"use client"

import { Button } from "@/components/ui/button"
import { Camera, Music, Video, Calendar, Folder } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/photos", icon: Camera, label: "Fotografije" },
    { href: "/music", icon: Music, label: "Glazba" },
    { href: "/videos", icon: Video, label: "Videozapisi" },
    { href: "/years", icon: Calendar, label: "Godine" },
    { href: "/events", icon: Folder, label: "Događaji" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href
            return (
              <Link key={href} href={href}>
                <Button variant={isActive ? "default" : "ghost"} size="sm" className="flex flex-col gap-1 h-auto py-2">
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{label}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
