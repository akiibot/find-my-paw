"use client" // Error components must be Client Components

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-6 text-center">
      <div className="h-20 w-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
        <p className="text-muted-foreground max-w-sm mx-auto p-4 bg-slate-100 rounded text-sm text-left break-words border font-mono mt-4 text-red-600">
          {error.message || "Unknown Server Error"}
        </p>
      </div>
      <Button onClick={() => reset()} variant="default" size="lg">
        Try again
      </Button>
    </div>
  )
}
