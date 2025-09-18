"use client"

import { useState, useEffect } from "react"
import ImageCard from "./image-card"

export default function MasonryGrid({ items = [], className = "" }) {
  const [columns, setColumns] = useState(1)

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width >= 1536)
        setColumns(5) // 2xl - more columns on very large screens
      else if (width >= 1280)
        setColumns(4) // xl
      else if (width >= 1024)
        setColumns(3) // lg
      else if (width >= 640)
        setColumns(2) // sm - changed from md to sm for better mobile
      else setColumns(1) // xs
    }

    updateColumns()
    window.addEventListener("resize", updateColumns)
    return () => window.removeEventListener("resize", updateColumns)
  }, [])

  // Distribute items across columns
  const columnItems = Array.from({ length: columns }, () => [])
  items.forEach((item, index) => {
    columnItems[index % columns].push(item)
  })

  if (items.length === 0) {
    return (
      <div className="text-center py-12 sm:py-20">
        <div className="text-4xl sm:text-6xl mb-4">🎨</div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2">No items yet</h3>
        <p className="text-sm sm:text-base text-muted-foreground px-4">Start by adding your first mood board item!</p>
      </div>
    )
  }

  return (
    <div className={`grid gap-2 sm:gap-4 ${className}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {columnItems.map((columnItems, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-2 sm:gap-4">
          {columnItems.map((item, itemIndex) => (
            <ImageCard key={item.id} item={item} priority={columnIndex === 0 && itemIndex < 2} />
          ))}
        </div>
      ))}
    </div>
  )
}
