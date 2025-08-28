import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button> */}
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                {/* <span className="text-primary-foreground font-bold text-sm">C</span> */}
                <Image src="/fd-cere-transparent.png" alt="Folklorno društvo Cere" width={32} height={32} />
              </div>
              <span className="font-serif font-bold text-lg hidden sm:block">Folklorno društvo Cere</span>
            </div>
          </Link>
        </div>

        <Button variant="ghost" size="icon" className="hover:text-primary">
          <Search className="h-5 w-5 transition-colors" />
        </Button>
      </div>
    </header>
  )
}
