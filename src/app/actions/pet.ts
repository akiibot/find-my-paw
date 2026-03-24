"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"

const generateShortId = (length = 6) => {
  return Math.random().toString(36).substring(2, 2 + length);
}

export async function createPet(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const name = formData.get("name") as string
  if (!name) throw new Error("Name is required")

  const breed = formData.get("breed") as string | null
  
  // Create a URL-friendly public slug
  let baseSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-')
  if (!baseSlug) baseSlug = 'pet'
  const publicId = `${baseSlug}-${generateShortId(4)}`
  
  // The immutable short tag ID
  const nanoId = generateShortId(8)
  
  const ownerPhone = formData.get("ownerPhone") as string | null
  const ownerEmail = formData.get("ownerEmail") as string | null

  // Receive the direct-uploaded photo URL from the Client Component
  const photoUrl = (formData.get("photoUrl") as string) || undefined

  const pet = await prisma.pet.create({
    data: {
      ownerId: session.user.id,
      name,
      breed,
      publicId,
      nanoId,
      ownerPhone,
      photoUrl,
      ownerEmail: ownerEmail || session.user.email, // fallback to auth email
    }
  })

  revalidatePath("/dashboard")
  redirect(`/dashboard/pet/${pet.id}`)
}

export async function updatePet(petId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const existingPet = await prisma.pet.findUnique({ where: { id: petId } })
  if (!existingPet || existingPet.ownerId !== session.user.id) {
    throw new Error("Not Found or Unauthorized")
  }

  const name = formData.get("name") as string
  const breed = formData.get("breed") as string | null
  const notes = formData.get("notes") as string | null
  const medicalNotes = formData.get("medicalNotes") as string | null
  const behaviorNotes = formData.get("behaviorNotes") as string | null
  
  const ownerPhone = formData.get("ownerPhone") as string | null
  const whatsapp = formData.get("whatsapp") as string | null
  const ownerEmail = formData.get("ownerEmail") as string | null
  
  const lostMode = formData.get("lostMode") === "on"
  const rewardEnabled = formData.get("rewardEnabled") === "on"
  const rewardText = formData.get("rewardText") as string | null
  const lastSeenArea = formData.get("lastSeenArea") as string | null

  // Receive the direct-uploaded photo URL from the Client Component
  const photoUrl = (formData.get("photoUrl") as string) || undefined

  const updateData: any = {
    name, breed, notes, medicalNotes, behaviorNotes,
    ownerPhone, whatsapp, ownerEmail,
    lostMode, rewardEnabled, rewardText, lastSeenArea
  }
  if (photoUrl) updateData.photoUrl = photoUrl

  await prisma.pet.update({
    where: { id: petId },
    data: updateData
  })

  revalidatePath("/dashboard")
  revalidatePath(`/dashboard/pet/${petId}`)
  revalidatePath(`/p/${existingPet.publicId}`)
}

export async function deletePet(petId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const existingPet = await prisma.pet.findUnique({ where: { id: petId } })
  if (!existingPet || existingPet.ownerId !== session.user.id) {
    throw new Error("Not Found or Unauthorized")
  }

  await prisma.pet.delete({ where: { id: petId } })
  revalidatePath("/dashboard")
  redirect("/dashboard")
}
