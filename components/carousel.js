"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import ImageCard from "./image-card"
import { Button } from "./ui/button"

export default function Carousel({ items = [], autoPlay = true, interval = 4000 }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isDragging, setIsDragging] = useState(false)
  const intervalRef = useRef(null)
  const startXRef = useRef(0)
  const currentXRef = useRef(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && items.length > 1) {
      intervalRef.current = setInterval(nextSlide, interval)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isPlaying, items.length, interval])

  // Pause on hover
  const handleMouseEnter = () => {
    if (autoPlay) setIsPlaying(false)
  }

  const handleMouseLeave = () => {
    if (autoPlay) setIsPlaying(true)
  }

  // Touch/drag handlers
  const handleStart = (clientX) => {
    setIsDragging(true)
    startXRef.current = clientX
    currentXRef.current = clientX
  }

  const handleMove = (clientX) => {
    if (!isDragging) return
    currentXRef.current = clientX
  }

  const handleEnd = () => {
    if (!isDragging) return

    const diff = startXRef.current - currentXRef.current
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }

    setIsDragging(false)
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-xl font-semibold mb-2">No items to display</h3>
        <p className="text-muted-foreground">Add some items to see them in the carousel!</p>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Main carousel */}
      <div
        className="relative overflow-hidden rounded-2xl shadow-2xl"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item) => (
            <div key={item.id} className="w-full flex-shrink-0">
              <ImageCard
                item={item}
                className="rounded-none shadow-none"
                priority={items.indexOf(item) === currentIndex}
              />
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {items.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-0"
              onClick={prevSlide}
            >
              <ChevronLeft size={24} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-0"
              onClick={nextSlide}
            >
              <ChevronRight size={24} />
            </Button>
          </>
        )}

        {/* Play/Pause button */}
        {autoPlay && items.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white border-0"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
        )}
      </div>

      {/* Dots indicator */}
      {items.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
