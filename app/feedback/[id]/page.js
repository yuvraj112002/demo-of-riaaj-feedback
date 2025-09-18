"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Share2, Download, Calendar, Loader2, ExternalLink } from "lucide-react"
import { Button } from "../../../components/ui/button"
import StarRating from "../../../components/star-rating"
import ImageCard from "../../../components/image-card"
import { useToast } from "../../../hooks/use-toast"

export default function FeedbackDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [item, setItem] = useState(null)
  const [relatedItems, setRelatedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/feedback/${params.id}`)
        if (!response.ok) {
          if (response.status === 404) {
            router.push("/moodboard")
            return
          }
          throw new Error("Failed to fetch item")
        }

        const data = await response.json()
        setItem(data)

        // Fetch related items (excluding current item)
        const relatedResponse = await fetch("/api/feedback?limit=6")
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json()
          const filtered = relatedData.items.filter((relatedItem) => relatedItem.id !== data.id)
          setRelatedItems(filtered.slice(0, 6))
        }
      } catch (error) {
        console.error("Error fetching item:", error)
        toast({
          title: "Error",
          description: "Failed to load item details.",
          variant: "destructive",
        })
        router.push("/moodboard")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchItem()
    }
  }, [params.id, router, toast])

  const handleShare = async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.message,
          url: url,
        })
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(url)
      }
    } else {
      copyToClipboard(url)
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Link copied!",
        description: "The share link has been copied to your clipboard.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    if (!item?.imageUrl) return

    const link = document.createElement("a")
    link.href = item.imageUrl
    link.download = `${item.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading details...</p>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Item not found</h2>
          <p className="text-muted-foreground mb-6">The item you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/moodboard">Browse Moodboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2 sm:size-default"
            >
              <ArrowLeft size={16} className="sm:hidden" />
              <ArrowLeft size={18} className="hidden sm:block" />
              <span className="text-sm sm:text-base">Back</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-1 sm:gap-2 bg-transparent"
              >
                <Share2 size={14} className="sm:hidden" />
                <Share2 size={16} className="hidden sm:block" />
                <span className="text-xs sm:text-sm">Share</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-1 sm:gap-2 bg-transparent"
              >
                <Download size={14} className="sm:hidden" />
                <Download size={16} className="hidden sm:block" />
                <span className="text-xs sm:text-sm hidden sm:inline">Download</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative aspect-auto rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
              {!imageError ? (
                <Image
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  width={800}
                  height={1200}
                  className="w-full h-auto object-cover"
                  onError={() => setImageError(true)}
                  priority
                />
              ) : (
                <div className="w-full h-64 sm:h-96 bg-muted flex items-center justify-center">
                  <span className="text-sm sm:text-base text-muted-foreground">Image not available</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4 text-balance">{item.title}</h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <StarRating value={item.rating} readOnly size={18} className="sm:hidden" />
                  <StarRating value={item.rating} readOnly size={20} className="hidden sm:flex" />
                  <span className="text-sm text-muted-foreground">{item.rating}/5</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={14} className="sm:hidden" />
                  <Calendar size={16} className="hidden sm:block" />
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">{item.message}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button onClick={handleShare} className="flex items-center gap-2 text-sm sm:text-base" size="sm">
                <Share2 size={16} className="sm:hidden" />
                <Share2 size={18} className="hidden sm:block" />
                Share This
              </Button>

              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex items-center gap-2 text-sm sm:text-base bg-transparent"
                size="sm"
              >
                <Download size={16} className="sm:hidden" />
                <Download size={18} className="hidden sm:block" />
                Download Image
              </Button>

              <Button
                variant="outline"
                asChild
                className="flex items-center gap-2 text-sm sm:text-base bg-transparent"
                size="sm"
              >
                <Link href="/moodboard">
                  <ExternalLink size={16} className="sm:hidden" />
                  <ExternalLink size={18} className="hidden sm:block" />
                  View All
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">More Like This</h2>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="sm:size-default self-start sm:self-auto bg-transparent"
              >
                <Link href="/moodboard">View All</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedItems.map((relatedItem) => (
                <ImageCard key={relatedItem.id} item={relatedItem} className="h-fit" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
