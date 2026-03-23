import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { updatePet, deletePet } from "@/app/actions/pet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, ExternalLink, QrCode, AlertTriangle } from "lucide-react"

export default async function EditPetPage({ params }: { params: Promise<{ petId: string }> | { petId: string } }) {
  // Deep unwrap params safely across Next.js versions
  const unwrappedParams = await params
  const petId = unwrappedParams?.petId

  if (!petId) {
    console.error("Missing petId in dynamic route params!", unwrappedParams);
    redirect("/dashboard")
  }

  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const pet = await prisma.pet.findUnique({
    where: { id: petId }
  })

  // Ensure owner matches
  if (!pet || pet.ownerId !== session.user.id) {
    redirect("/dashboard")
  }

  // Update server action wrapper to pass petId
  const updatePetAction = updatePet.bind(null, pet.id)
  const deletePetAction = deletePet.bind(null, pet.id)

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{pet.name}'s Profile</h1>
          </div>
        </div>
        <div className="flex gap-2">
           <Link href={`/p/${pet.publicId}`} target="_blank">
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Public Page
            </Button>
          </Link>
          <Link href={`/dashboard/pet/${pet.id}/qr`}>
            <Button variant="secondary">
              <QrCode className="mr-2 h-4 w-4" />
              QR Code
            </Button>
          </Link>
        </div>
      </div>

      <form key={pet.updatedAt?.toString()} action={updatePetAction} className="space-y-6">
        
        {/* LOST MODE STATUS */}
        <Card className={`border-2 ${pet.lostMode ? 'border-red-500 bg-red-50/50' : ''}`}>
          <CardHeader className="pb-4">
             <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {pet.lostMode && <AlertTriangle className="h-5 w-5 text-red-500" />}
                    Lost Mode {pet.lostMode ? "Active" : "Disabled"}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Turn this on immediately if your pet goes missing. It activates emergency contacts on the public page.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                   <input type="checkbox" id="lostMode" name="lostMode" defaultChecked={pet.lostMode} className="w-6 h-6 text-red-600 rounded focus:ring-red-500" />
                   <Label htmlFor="lostMode" className="font-semibold text-lg">Mark as Lost</Label>
                </div>
             </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="lastSeenArea">Last Seen Area / Intersection</Label>
              <Input id="lastSeenArea" name="lastSeenArea" defaultValue={pet.lastSeenArea || ""} placeholder="e.g. Near Central Park, corner of 5th and 82nd" />
            </div>
            
            <div className="flex items-start gap-4 mt-4 p-4 bg-white rounded-lg border border-slate-200">
               <div className="pt-1">
                 <input type="checkbox" id="rewardEnabled" name="rewardEnabled" defaultChecked={pet.rewardEnabled} className="w-4 h-4 rounded text-indigo-600" />
               </div>
               <div className="flex-1 space-y-2">
                 <Label htmlFor="rewardEnabled" className="text-base cursor-pointer">Offer a Reward</Label>
                 <Input id="rewardText" name="rewardText" defaultValue={pet.rewardText || ""} placeholder="e.g. $500 Reward - No questions asked" />
               </div>
            </div>
          </CardContent>
        </Card>

        {/* PET DETAILS */}
        <Card>
          <CardHeader>
             <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 pb-2">
              <Label>Current Photo</Label>
              {pet.photoUrl ? (
                <div className="mt-2 mb-4">
                  <img src={pet.photoUrl} alt="Pet photo" className="w-24 h-24 object-cover rounded-full shadow border-2" />
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic mb-4 mt-2">No photo uploaded yet.</div>
              )}
              <Label htmlFor="photo">Upload New Photo (Optional)</Label>
              <Input id="photo" name="photo" type="file" accept="image/*" className="cursor-pointer" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={pet.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Input id="breed" name="breed" defaultValue={pet.breed || ""} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">General Notes (Public)</Label>
              <Input id="notes" name="notes" defaultValue={pet.notes || ""} placeholder="Friendly, scared of loud noises, etc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicalNotes">Medical Information (Public)</Label>
              <Input id="medicalNotes" name="medicalNotes" defaultValue={pet.medicalNotes || ""} placeholder="Needs insulin at 5pm, allergies, etc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="behaviorNotes">Behavior Notes (Public)</Label>
              <Input id="behaviorNotes" name="behaviorNotes" defaultValue={pet.behaviorNotes || ""} placeholder="Do not chase, gently approach with treats" />
            </div>
          </CardContent>
        </Card>

        {/* EMERGENCY CONTACTS */}
        <Card>
          <CardHeader>
             <CardTitle>Emergency Contacts</CardTitle>
             <CardDescription>Visible on public page only when Lost Mode is active.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ownerPhone">Phone Number</Label>
                <Input id="ownerPhone" name="ownerPhone" defaultValue={pet.ownerPhone || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number (Optional)</Label>
                <Input id="whatsapp" name="whatsapp" defaultValue={pet.whatsapp || ""} placeholder="Include country code e.g. 15551234567" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="ownerEmail">Public Email</Label>
                <Input id="ownerEmail" name="ownerEmail" defaultValue={pet.ownerEmail || ""} type="email" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-6 bg-slate-50 border-t">
             <Button type="submit" size="lg">Save All Changes</Button>
          </CardFooter>
        </Card>
      </form>
      
      {/* DANGER ZONE */}
      <div className="border border-red-200 bg-red-50 p-6 rounded-lg mt-12 flex items-center justify-between">
         <div>
           <h3 className="text-red-800 font-bold">Danger Zone</h3>
           <p className="text-red-600/80 text-sm mt-1">Permanently delete this pet and their QR tag functionality.</p>
         </div>
         <form action={deletePetAction}>
           <Button variant="destructive" type="submit">
             Delete Pet Profile
           </Button>
         </form>
      </div>
    </div>
  )
}
