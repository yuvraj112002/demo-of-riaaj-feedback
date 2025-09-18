"use client"

import { useToast } from "../hooks/use-toast"
import { X } from "lucide-react"
import { Button } from "./ui/button"

export default function Toast() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`max-w-sm p-4 rounded-lg shadow-lg border ${
            toast.variant === "destructive"
              ? "bg-destructive text-destructive-foreground border-destructive"
              : "bg-card text-card-foreground border-border"
          } animate-in slide-in-from-right-full`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {toast.title && <div className="font-semibold mb-1">{toast.title}</div>}
              {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={() => dismiss(toast.id)}>
              <X size={14} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
