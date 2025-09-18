import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { addFeedbackItem, searchFeedback } from "../../../lib/data-manager"
import { saveUploadedFile } from "../../../lib/file-upload"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""

    const result = searchFeedback(search, page, limit)

    return NextResponse.json(result)
  } catch (error) {
    console.error("GET /api/feedback error:", error)
    return NextResponse.json({ message: "Failed to fetch feedback" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData()

    const title = formData.get("title")
    const message = formData.get("message")
    const rating = Number.parseInt(formData.get("rating"))
    const image = formData.get("image")

    // Validation
    if (!title || title.length > 80) {
      return NextResponse.json({ message: "Title is required and must be 80 characters or less" }, { status: 400 })
    }

    if (!message || message.length > 600) {
      return NextResponse.json({ message: "Message is required and must be 600 characters or less" }, { status: 400 })
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Rating must be between 1 and 5" }, { status: 400 })
    }

    if (!image) {
      return NextResponse.json({ message: "Image is required" }, { status: 400 })
    }

    // Save uploaded file
    const imageUrl = await saveUploadedFile(image)

    // Create feedback item
    const feedbackItem = {
      id: uuidv4(),
      title: title.toString().trim(),
      message: message.toString().trim(),
      rating,
      imageUrl,
      createdAt: new Date().toISOString(),
    }

    // Save to data file
    const success = addFeedbackItem(feedbackItem)

    if (!success) {
      return NextResponse.json({ message: "Failed to save feedback" }, { status: 500 })
    }

    return NextResponse.json(feedbackItem, { status: 201 })
  } catch (error) {
    console.error("POST /api/feedback error:", error)
    return NextResponse.json({ message: error.message || "Failed to create feedback" }, { status: 500 })
  }
}
