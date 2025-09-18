"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import MasonryGrid from "../../components/masonry-grid"
import { useToast } from "../../hooks/use-toast"

export default function MoodboardPage() {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const { toast } = useToast()

  const fetchItems = useCallback(
    async (pageNum = 1, query = "") => {
      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "20",
          ...(query && { search: query }),
        })

        const response = await fetch(`/api/feedback?${params}`)
        if (!response.ok) throw new Error("Failed to fetch items")

        const data = await response.json()

        if (pageNum === 1) {
          setItems(data.items)
          setFilteredItems(data.items)
        } else {
          setItems((prev) => [...prev, ...data.items])
          setFilteredItems((prev) => [...prev, ...data.items])
        }

        setHasMore(data.page < data.totalPages)
        setPage(pageNum)
      } catch (error) {
        console.error("Error fetching items:", error)
        toast({
          title: "Error",
          description: "Failed to load items. Please try again.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      await fetchItems(1, searchQuery)
      setLoading(false)
    }

    loadInitialData()
  }, [fetchItems, searchQuery])

  // Search functionality
  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim() === "") {
      setFilteredItems(items)
    } else {
      const filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.message.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredItems(filtered)
    }
  }

  // Infinite scroll
  const loadMore = async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    await fetchItems(page + 1, searchQuery)
    setLoadingMore(false)
  }

  // Scroll event listener for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMore()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [page, hasMore, searchQuery]) // Updated dependencies

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading inspiration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Moodboard</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-80 md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search inspiration..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 w-full text-sm sm:text-base"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {filteredItems.length === 0 && !loading ? (
          <div className="text-center py-16 sm:py-20">
            <div className="text-4xl sm:text-6xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No items found</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-4 sm:px-0">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term.`
                : "No items have been added yet. Be the first to share your inspiration!"}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                className="sm:size-default bg-transparent"
                onClick={() => {
                  setSearchQuery("")
                  setFilteredItems(items)
                }}
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <>
            <MasonryGrid items={filteredItems} />

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-8 sm:mt-12">
                {loadingMore ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin mr-2" />
                    <span className="text-sm sm:text-base text-muted-foreground">Loading more...</span>
                  </div>
                ) : (
                  <Button onClick={loadMore} variant="outline" size="sm" className="sm:size-lg bg-transparent">
                    Load More
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
