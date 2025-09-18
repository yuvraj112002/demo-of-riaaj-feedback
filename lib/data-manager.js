import fs from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "feedback.json")

// In-memory cache
let cache = null
let cacheTime = 0
const CACHE_DURATION = 10000 // 10 seconds

export function readFeedbackData() {
  const now = Date.now()

  // Return cached data if still valid
  if (cache && now - cacheTime < CACHE_DURATION) {
    return cache
  }

  try {
    // Ensure data directory exists
    const dataDir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Read data file
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf8")
      cache = JSON.parse(data)
    } else {
      cache = []
    }

    cacheTime = now
    return cache
  } catch (error) {
    console.error("Error reading feedback data:", error)
    return []
  }
}

export function writeFeedbackData(data) {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))

    // Update cache
    cache = data
    cacheTime = Date.now()

    return true
  } catch (error) {
    console.error("Error writing feedback data:", error)
    return false
  }
}

export function addFeedbackItem(item) {
  const data = readFeedbackData()
  data.unshift(item) // Add to beginning for newest first
  return writeFeedbackData(data)
}

export function getFeedbackById(id) {
  const data = readFeedbackData()
  return data.find((item) => item.id === id)
}

export function searchFeedback(query, page = 1, limit = 20) {
  const data = readFeedbackData()

  let filtered = data

  if (query) {
    const searchTerm = query.toLowerCase()
    filtered = data.filter(
      (item) => item.title.toLowerCase().includes(searchTerm) || item.message.toLowerCase().includes(searchTerm),
    )
  }

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  return {
    items: filtered.slice(startIndex, endIndex),
    total: filtered.length,
    page,
    totalPages: Math.ceil(filtered.length / limit),
  }
}
