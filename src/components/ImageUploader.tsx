"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

// Initialize Supabase Client strictly for the browser
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface ImageUploaderProps {
  userId: string
  currentPhotoUrl?: string | null
}

export default function ImageUploader({ userId, currentPhotoUrl }: ImageUploaderProps) {
  const [photoUrl, setPhotoUrl] = useState<string>(currentPhotoUrl || "")
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Generate unique path
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    // Direct browser-to-Supabase upload (Bypasses Vercel 4.5MB limits!)
    const { error } = await supabase.storage.from('pet-photos').upload(fileName, file, {
      upsert: true
    })

    if (error) {
      alert(`Upload failed: ${error.message}`)
      setIsUploading(false)
      return
    }

    // Get public URL
    const { data } = supabase.storage.from('pet-photos').getPublicUrl(fileName)
    setPhotoUrl(data.publicUrl)
    setIsUploading(false)
  }

  return (
    <div className="space-y-4">
      {/* Hidden input to pass the final URL string securely to the Server Action */}
      <input type="hidden" name="photoUrl" value={photoUrl} />
      
      <Label>Pet Photo</Label>
      
      {photoUrl ? (
        <div className="mt-2 mb-4 relative w-24 h-24">
          <img src={photoUrl} alt="Pet photo" className="w-24 h-24 object-cover rounded-full shadow border-2" />
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground italic mb-4 mt-2">
          {isUploading ? "Uploading direct to cloud..." : "No photo uploaded yet."}
        </div>
      )}

      <Label htmlFor="photoFile" className={`${isUploading ? 'opacity-50' : ''}`}>
        {photoUrl ? "Upload New Photo" : "Select Pet Photo (Optional)"}
      </Label>
      <Input 
        id="photoFile" 
        type="file" 
        accept="image/*" 
        className="cursor-pointer" 
        onChange={handleUpload}
        disabled={isUploading}
      />
    </div>
  )
}
