import { PhotoCarousel } from "@/components/photo-carousel"
import { Navigation } from "@/components/navigation"
import { Header } from "@/components/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Folklorno društvo Cere</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dobrodošli u našu multimedijsku galeriju. Istražite bogatu tradiciju i kulturu kroz naše fotografije, glazbu
            i videozapise.
          </p>
        </div>

        <PhotoCarousel />

        <div className="mt-12 text-center">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">Istražite našu kolekciju</h2>
          <p className="text-muted-foreground mb-6">Pregledajte naše arhive organizirane po godinama i događajima</p>
        </div>
      </main>

      <Navigation />
    </div>
  )
}
