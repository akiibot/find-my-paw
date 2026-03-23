import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ petId: string }> }) {
  const { petId } = await params
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const pet = await prisma.pet.findUnique({
    where: { id: petId }
  })

  // Basic authorization: ensure user owns the pet
  if (!pet || pet.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 })
  }

  return NextResponse.json(pet)
}
