import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react" // Added import for Suspense
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import Toast from "../components/toast"
import "./globals.css"

export const metadata = {
  title: "Moodboard - Share Your Inspiration",
  description: "A Pinterest-style platform for sharing and discovering creative inspiration",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* Wrapped all components in Suspense boundary */}
        <Suspense fallback={null}>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toast />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
