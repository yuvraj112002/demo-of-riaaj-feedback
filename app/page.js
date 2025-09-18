"use client"
import { useRouter } from "next/navigation"
import FeedbackForm from "../components/feedback-form"

export default function HomePage() {
  const router = useRouter()

  const handleFormSuccess = (result) => {
    // Redirect to the newly created item's detail page
    router.push(`/feedback/${result.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 text-balance">
            Share Your Creative
            <span className="text-primary"> Inspiration</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto text-pretty px-4 sm:px-0">
            Discover, collect, and share visual inspiration with our Pinterest-style moodboard. Upload your favorite
            images and let others discover your creative vision.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-12 sm:mb-16">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">∞</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Endless Inspiration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">⚡</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Instant Sharing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">🎨</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Creative Community</div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Add Your Inspiration</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Upload an image that inspires you, rate it, and share your thoughts with the community.
            </p>
          </div>

          <FeedbackForm onSuccess={handleFormSuccess} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Explore & Discover</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Multiple ways to browse and discover amazing content from our creative community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-card rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🖼️</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Moodboard Grid</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                Browse all submissions in a beautiful Pinterest-style masonry grid with infinite scroll.
              </p>
              <a href="/moodboard" className="text-sm sm:text-base text-primary hover:text-primary/80 font-medium">
                Explore Moodboard →
              </a>
            </div>

            <div className="bg-card rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎠</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Auto Carousel</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                Sit back and enjoy an auto-scrolling carousel of the latest submissions.
              </p>
              <a href="/carousel" className="text-sm sm:text-base text-primary hover:text-primary/80 font-medium">
                View Carousel →
              </a>
            </div>

            <div className="bg-card rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔍</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Search & Filter</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                Find specific content by searching titles and descriptions across all submissions.
              </p>
              <a href="/moodboard" className="text-sm sm:text-base text-primary hover:text-primary/80 font-medium">
                Start Searching →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
