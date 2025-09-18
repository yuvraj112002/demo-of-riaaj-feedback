"use client"

import { useState } from "react"
import { Star } from "lucide-react"

export default function StarRating({ value = 0, onChange, readOnly = false, size = 20, className = "" }) {
  const [hoverValue, setHoverValue] = useState(0)

  const handleClick = (rating) => {
    if (readOnly || !onChange) return
    onChange(rating)
  }

  const handleKeyDown = (e, rating) => {
    if (readOnly || !onChange) return

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onChange(rating)
    } else if (e.key === "ArrowLeft" && rating > 1) {
      e.preventDefault()
      onChange(rating - 1)
    } else if (e.key === "ArrowRight" && rating < 5) {
      e.preventDefault()
      onChange(rating + 1)
    }
  }

  const displayValue = readOnly ? value : hoverValue || value

  return (
    <div className={`flex items-center space-x-1 ${className}`} role="radiogroup" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded ${
            readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
          }`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readOnly && setHoverValue(star)}
          onMouseLeave={() => !readOnly && setHoverValue(0)}
          onKeyDown={(e) => handleKeyDown(e, star)}
          disabled={readOnly}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          aria-checked={star <= displayValue}
          role="radio"
          tabIndex={readOnly ? -1 : 0}
        >
          <Star
            size={size}
            className={`transition-colors ${
              star <= displayValue ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  )
}
