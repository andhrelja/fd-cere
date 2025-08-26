import { Button } from "@/components/ui/button"
import { Menu, Search } from "lucide-react"

export function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <span className="font-serif font-bold text-lg hidden sm:block">Cere</span>
          </div>
        </div>

        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
