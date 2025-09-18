import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }
}

export function validateFile(file) {
  if (!file) {
    return { valid: false, error: "No file provided" }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size exceeds 5MB limit" }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Invalid file type. Only JPG, PNG, and WebP are allowed" }
  }

  return { valid: true }
}

export async function saveUploadedFile(file) {
  const validation = validateFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  ensureUploadDir()

  const fileExtension = path.extname(file.name) || ".jpg"
  const fileName = `${uuidv4()}${fileExtension}`
  const filePath = path.join(UPLOAD_DIR, fileName)

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(filePath, buffer)

    return `/uploads/${fileName}`
  } catch (error) {
    console.error("Error saving file:", error)
    throw new Error("Failed to save file")
  }
}
