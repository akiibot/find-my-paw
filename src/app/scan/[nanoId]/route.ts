import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function GET(request: Request, { params }: { params: Promise<{ nanoId: string }> }) {
  const { nanoId } = await params
  
  const pet = await prisma.pet.findUnique({
    where: { nanoId }
  })

  if (!pet) {
    redirect("/") // Pet tag disabled or not found
  }

  try {
    const userAgent = request.headers.get("user-agent") || undefined
    const ip = request.headers.get("x-forwarded-for") || undefined
    let ipHash = undefined
    
    if (ip) {
      const crypto = await import("crypto")
      ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16)
    }

    // Fire and forget, don't block the redirect
    await prisma.scanEvent.create({
      data: {
        petId: pet.id,
        userAgent,
        ipHash
      }
    })
  } catch (error) {
    console.error("Failed to log scan:", error)
  }

  redirect(`/p/${pet.publicId}`)
}
