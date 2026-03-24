import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { updatePet, deletePet } from "@/app/actions/pet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, ExternalLink, QrCode, AlertTriangle } from "lucide-react"
import ImageUploader from "@/components/ImageUploader"
import SavePetForm from "@/components/SavePetForm"

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

  // Update server action wrappers to pass petId
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
            <Button variant="secondary" className="rounded-full shadow-sm hover:shadow-md transition-shadow">
              <QrCode className="mr-2 h-4 w-4" />
              Get QR Code
            </Button>
          </Link>
        </div>
      </div>

      <SavePetForm action={updatePetAction}>
        
        {/* LOST MODE STATUS - CRITICAL COMMAND CENTER */}
        <Card className={`border-2 overflow-hidden shadow-lg transition-colors duration-500 rounded-3xl ${pet.lostMode ? 'border-destructive bg-destructive/5 shadow-destructive/20' : 'border-border bg-card'}`}>
          <div className={`h-2 w-full ${pet.lostMode ? 'bg-destructive animate-pulse' : 'bg-muted'}`} />
          <CardHeader className="pb-6 pt-8 px-8">
             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <CardTitle className={`text-2xl font-black flex items-center gap-3 tracking-tight ${pet.lostMode ? 'text-destructive' : 'text-foreground'}`}>
                    {pet.lostMode ? (
                      <span className="flex h-4 w-4 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive"></span>
                      </span>
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-muted-foreground" />
                    )}
                    LOST MODE {pet.lostMode ? "ACTIVE" : "STANDBY"}
                  </CardTitle>
                  <CardDescription className="mt-2 text-base font-medium">
                    Activate immediately if your pet goes missing. This fires an emergency broadcast to their public profile and alerts scanners to call you instantly.
                  </CardDescription>
                </div>
                  <label htmlFor="lostMode" className="cursor-pointer relative shrink-0 group">
                     {/* The native checkbox that powers the form submission */}
                     <input type="checkbox" id="lostMode" name="lostMode" defaultChecked={pet.lostMode} className="sr-only peer" />
                     
                     {/* Standby State (Shown when not checked) */}
                     <div className="peer-checked:hidden flex items-center justify-center min-w-[200px] h-16 rounded-3xl border-4 border-border bg-card transition-all duration-300 hover:border-destructive/30 hover:bg-destructive/5 active:scale-95">
                       <span className="font-black text-xl tracking-widest uppercase select-none text-foreground">
                         Standby
                       </span>
                     </div>
  
                     {/* Engaged State (Shown when checked) */}
                     <div className="hidden peer-checked:flex items-center justify-center min-w-[200px] h-16 rounded-3xl border-4 transition-all duration-300 border-destructive bg-destructive text-white shadow-[0_0_40px_rgba(220,38,38,0.5)] scale-105 active:scale-95">
                       <span className="font-black text-xl tracking-widest uppercase select-none text-white">
                         Engaged
                       </span>
                     </div>
                  </label>
             </div>
          </CardHeader>

           {/* Notification Alert Status */}
           <div className="px-8 pb-6 flex flex-wrap gap-3 items-center">
             <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-1">Scan Alerts:</span>
             {pet.ownerEmail ? (
               <span className="inline-flex items-center gap-1.5 bg-success/10 border border-success/30 text-success text-xs font-bold px-3 py-1.5 rounded-full">
                 <span className="w-1.5 h-1.5 rounded-full bg-success inline-block animate-pulse" />
                 Email Active — {pet.ownerEmail}
               </span>
             ) : (
               <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-full">
                 ⚠ Add a contact email below to enable alerts
               </span>
             )}
             <span className="inline-flex items-center gap-1.5 bg-muted/50 border border-border text-muted-foreground text-xs font-bold px-3 py-1.5 rounded-full opacity-60 cursor-not-allowed select-none">
               📱 SMS — Coming Soon
             </span>
           </div>

          <CardContent className="space-y-6 pt-6 border-t border-border/50 px-8 pb-8 bg-black/5 dark:bg-black/20">
            <div className="space-y-3">
              <Label htmlFor="lastSeenArea" className="text-base font-bold">Last Known Location</Label>
              <Input id="lastSeenArea" name="lastSeenArea" defaultValue={pet.lastSeenArea || ""} placeholder="e.g. Near Central Park, corner of 5th and 82nd" className="h-14 bg-background border-border text-lg" />
            </div>
            
            <div className="flex items-start gap-4 p-6 bg-background rounded-2xl border border-border shadow-sm">
               <div className="pt-1">
                 <input type="checkbox" id="rewardEnabled" name="rewardEnabled" defaultChecked={pet.rewardEnabled} className="w-5 h-5 rounded text-primary focus:ring-primary cursor-pointer" />
               </div>
               <div className="flex-1 space-y-3">
                 <Label htmlFor="rewardEnabled" className="text-lg font-bold cursor-pointer text-foreground">Offer a Finder's Reward</Label>
                 <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-muted-foreground text-lg pointer-events-none">৳</span>
                   <Input id="rewardText" name="rewardText" defaultValue={pet.rewardText || ""} placeholder="5000 - No questions asked" className="h-12 bg-muted/50 border-border pl-10" />
                 </div>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* PET DETAILS */}
        <Card className="rounded-3xl border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 pb-6 border-b border-border">
             <CardTitle className="text-2xl font-black tracking-tight">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-8">
            
            <ImageUploader userId={session.user.id} currentPhotoUrl={pet.photoUrl} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="font-bold">Pet's Name</Label>
                <Input id="name" name="name" defaultValue={pet.name} required className="h-12 bg-muted/50" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="breed" className="font-bold">Breed</Label>
                <Input id="breed" name="breed" defaultValue={pet.breed || ""} className="h-12 bg-muted/50" />
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="notes" className="font-bold">General Notes (Public)</Label>
              <Input id="notes" name="notes" defaultValue={pet.notes || ""} placeholder="Friendly, scared of loud noises, loves belly rubs" className="h-12 bg-muted/50" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="medicalNotes" className="font-bold">Medical Information (Public)</Label>
              <Input id="medicalNotes" name="medicalNotes" defaultValue={pet.medicalNotes || ""} placeholder="Needs insulin at 5pm, allergies to grain, etc." className="h-12 bg-muted/50" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="behaviorNotes" className="font-bold">Behavior Notes (Public)</Label>
              <Input id="behaviorNotes" name="behaviorNotes" defaultValue={pet.behaviorNotes || ""} placeholder="Do not chase, gently approach with treats" className="h-12 bg-muted/50" />
            </div>
          </CardContent>
        </Card>

        {/* EMERGENCY CONTACTS */}
        <Card className="rounded-3xl border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 pb-6 border-b border-border">
             <CardTitle className="text-xl font-black tracking-tight">Emergency Contacts</CardTitle>
             <CardDescription className="text-base font-medium">This is only visible to the public when Lost Mode is active.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="ownerPhone" className="font-bold">Primary Phone</Label>
                <Input id="ownerPhone" name="ownerPhone" defaultValue={pet.ownerPhone || ""} className="h-12 bg-muted/50" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="whatsapp" className="font-bold">WhatsApp Number</Label>
                <Input id="whatsapp" name="whatsapp" defaultValue={pet.whatsapp || ""} placeholder="Include country code (+1...)" className="h-12 bg-muted/50" />
              </div>
              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="ownerEmail" className="font-bold">Contact Email</Label>
                <Input id="ownerEmail" name="ownerEmail" defaultValue={pet.ownerEmail || ""} type="email" className="h-12 bg-muted/50" />
              </div>
            </div>
          </CardContent>
        </Card>
      </SavePetForm>
      
      {/* DANGER ZONE */}
      <div className="border border-destructive/30 bg-destructive/10 p-8 rounded-3xl mt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
         <div>
           <h3 className="text-destructive font-black text-xl tracking-tight">Danger Zone</h3>
           <p className="text-destructive/80 font-medium text-base mt-2 max-w-lg">
             Permanently terminate this pet's profile. The associated QR tag will instantly trigger a 404 error if scanned. Cannot be undone.
           </p>
         </div>
         <form action={deletePetAction} className="shrink-0 w-full md:w-auto">
           <Button variant="destructive" type="submit" size="lg" className="w-full md:w-auto h-12 font-bold px-8 shadow-sm">
             Delete Pet Profile
           </Button>
         </form>
      </div>
    </div>
  )
}
