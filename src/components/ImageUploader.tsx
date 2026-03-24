"use client"

import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Camera, UploadCloud } from "lucide-react"

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
    <div className="flex flex-col items-center justify-center space-y-4 py-4 w-full">
      {/* Hidden input to pass the final URL string securely to the Server Action */}
      <input type="hidden" name="photoUrl" value={photoUrl} />
      
      <div className="relative group cursor-pointer w-40 h-40 sm:w-48 sm:h-48 shrink-0">
        <label htmlFor="photoFile" className={`cursor-pointer w-full h-full block rounded-full overflow-hidden transition-all duration-300 shadow-sm relative ${!photoUrl ? 'border-4 border-dashed border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50' : 'border-4 border-border shadow-md align-middle'}`}>
          {/* State 1: Image exists */}
          {photoUrl && (
            <>
              <img src={photoUrl} alt="Pet photo" className="w-full h-full object-cover rounded-full" />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm rounded-full">
                <Camera className="h-8 w-8 mb-2" />
                <span className="font-bold text-sm tracking-wider uppercase">Change Photo</span>
              </div>
            </>
          )}

          {/* State 2: No Image */}
          {!photoUrl && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
              <div className="bg-background rounded-full p-4 mb-3 shadow-sm border border-border group-hover:scale-110 transition-transform">
                <UploadCloud className="h-8 w-8" />
              </div>
              <span className="font-bold text-sm">Upload Photo</span>
            </div>
          )}

          {/* Loading Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-full">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
              <span className="text-primary font-bold text-sm animate-pulse cursor-wait">Uploading...</span>
            </div>
          )}
        </label>
        
        {/* The actual Native Input is hidden */}
        <input 
          id="photoFile" 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleUpload}
          disabled={isUploading}
        />
      </div>
      
      <div className="text-center">
        <Label className="text-muted-foreground font-medium">Profile Picture</Label>
        <p className="text-xs text-muted-foreground/70 mt-1">Accepts JPG, PNG up to 5MB</p>
      </div>
    </div>
  )
}
