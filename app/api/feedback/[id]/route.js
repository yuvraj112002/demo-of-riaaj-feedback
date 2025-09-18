import { NextResponse } from "next/server"
import { getFeedbackById } from "../../../../lib/data-manager"

export async function GET(request, { params }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ message: "ID parameter is required" }, { status: 400 })
    }

    const item = getFeedbackById(id)

    if (!item) {
      return NextResponse.json({ message: "Feedback item not found" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("GET /api/feedback/[id] error:", error)
    return NextResponse.json({ message: "Failed to fetch feedback item" }, { status: 500 })
  }
}
