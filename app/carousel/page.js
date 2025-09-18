"use client"

import { useState, useEffect } from "react"
import { Loader2, Play, Pause, SkipForward } from "lucide-react"
import { Button } from "../../components/ui/button"
import Carousel from "../../components/carousel"
import { useToast } from "../../hooks/use-toast"

export default function CarouselPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [autoPlay, setAutoPlay] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/feedback?limit=50")
        if (!response.ok) throw new Error("Failed to fetch items")

        const data = await response.json()
        setItems(data.items)
      } catch (error) {
        console.error("Error fetching items:", error)
        toast({
          title: "Error",
          description: "Failed to load carousel items. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [toast])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading carousel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Inspiration Carousel</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Sit back and enjoy an auto-scrolling showcase of the latest creative submissions. Hover over images to see
            details, or click to view the full story.
          </p>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={autoPlay ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoPlay(!autoPlay)}
              className="flex items-center gap-2"
            >
              {autoPlay ? (
                <>
                  <Pause size={16} />
                  Auto-playing
                </>
              ) : (
                <>
                  <Play size={16} />
                  Paused
                </>
              )}
            </Button>

            <div className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"}
            </div>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎠</div>
            <h3 className="text-xl font-semibold mb-2">No items to display</h3>
            <p className="text-muted-foreground mb-6">
              No items have been added yet. Add some inspiration to see them in the carousel!
            </p>
            <Button asChild>
              <a href="/">Add Your First Item</a>
            </Button>
          </div>
        ) : (
          <Carousel items={items} autoPlay={autoPlay} interval={4000} />
        )}
      </div>

      {/* Info Section */}
      {/* <div className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">How to Use the Carousel</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Play className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Auto-Play</h3>
              <p className="text-sm text-muted-foreground">
                Images automatically advance every 4 seconds. Pause anytime with the control button.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <SkipForward className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Navigate</h3>
              <p className="text-sm text-muted-foreground">
                Use arrow buttons, keyboard arrows, or swipe on mobile to navigate manually.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-primary rounded opacity-60" />
              </div>
              <h3 className="font-semibold mb-2">Interact</h3>
              <p className="text-sm text-muted-foreground">
                Hover to see details, click dots to jump to specific items, or click images for full view.
              </p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}
