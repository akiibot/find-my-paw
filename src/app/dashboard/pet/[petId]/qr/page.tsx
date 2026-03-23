"use client"

import { QRCodeSVG } from "qrcode.react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Download, ExternalLink, Printer } from "lucide-react"
import { use, useEffect, useState } from "react"

export default function QRCodePage({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = use(params)
  const [pet, setPet] = useState<any>(null)
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
    fetch(`/api/pets/${petId}`)
      .then(res => res.json())
      .then(data => setPet(data))
  }, [petId])

  if (!pet) return <div className="p-12 text-center text-muted-foreground">Loading QR mapping...</div>
  
  // The actual URL the QR code resolves to
  const scanUrl = `${origin}/scan/${pet.nanoId}`

  const downloadQR = () => {
    const svg = document.getElementById("qr-code-svg")
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = `FindMyPaw-${pet.name}-QR.png`
      downloadLink.href = `${pngFile}`
      downloadLink.click()
    }
    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/pet/${pet.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{pet.name}'s QR Code</h1>
        </div>
      </div>

      <Card className="text-center overflow-hidden">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle>Unique Collar Tag</CardTitle>
          <CardDescription>
            Attach this QR code to {pet.name}'s physical collar. Any smartphone can scan it.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8 ring-4 ring-indigo-50">
            <QRCodeSVG 
              id="qr-code-svg"
              value={scanUrl} 
              size={256} 
              level="H"
              includeMargin={false}
            />
          </div>
          <p className="text-sm font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded">
            {scanUrl}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center border-t bg-slate-50 pt-6">
          <Link href={`/p/${pet.publicId}`} target="_blank" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              Preview Public Page
            </Button>
          </Link>
          <Button onClick={downloadQR} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download PNG
          </Button>
        </CardFooter>
      </Card>
      
      <div className="text-center text-sm text-slate-500 mt-4 px-4">
        <p>This QR code uses a stateless tag architecture. It points to a permanent scanner link, meaning you can update your pet's public profile URL anytime without needing to re-print this physical tag.</p>
      </div>
    </div>
  )
}
