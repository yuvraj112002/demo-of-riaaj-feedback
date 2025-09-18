"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import StarRating from "./star-rating"

export default function ImageCard({ item, className = "", showOverlay = true, priority = false }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (!item) return null

  return (
    <div
      className={`group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <Link href={`/feedback/${item.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-auto">
          {!imageError ? (
            <Image
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.title}
              width={400}
              height={600}
              className={`w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              priority={priority}
            />
          ) : (
            <div className="w-full h-48 sm:h-64 bg-muted flex items-center justify-center">
              <span className="text-xs sm:text-sm text-muted-foreground">Image not found</span>
            </div>
          )}

          {/* Loading skeleton */}
          {!imageLoaded && !imageError && <div className="absolute inset-0 bg-muted animate-pulse" />}
        </div>

        {/* Overlay - Improved mobile overlay with better touch targets */}
        {showOverlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:group-hover:opacity-100 group-active:opacity-100">
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
              <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-gray-200 mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3">
                {item.message}
              </p>
              <div className="flex items-center justify-between">
                <StarRating value={item.rating} readOnly size={14} className="sm:hidden" />
                <StarRating value={item.rating} readOnly size={16} className="hidden sm:flex" />
                <span className="text-xs text-gray-300">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </Link>
    </div>
  )
}
