import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Phone, Mail, MessageCircle, PawPrint } from "lucide-react"

export default async function PublicPetPage({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params
  const pet = await prisma.pet.findUnique({
    where: { publicId }
  })

  // 404 if slug doesn't exist
  if (!pet) notFound()

  const { lostMode, rewardEnabled, rewardText, ownerPhone, ownerEmail, whatsapp } = pet

  return (
    <div className="min-h-screen bg-slate-50 relative pb-20">
      
      {/* Dynamic Header */}
      <div className={`w-full py-4 text-center text-white px-4 font-bold tracking-widest uppercase ${lostMode ? 'bg-red-600 shadow-md block' : 'bg-emerald-600'}`}>
        {lostMode ? (
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-5 w-5" /> 
            <span>Missing Pet Alert</span>
          </div>
        ) : (
          <span>Safe & Registered</span>
        )}
      </div>

      <main className="max-w-xl mx-auto p-4 space-y-6 mt-4">
        
        {/* Urgent Action Section (Lost Mode Only) */}
        {lostMode && (
          <Card className="border-2 border-red-500 shadow-xl overflow-hidden bg-white">
            <div className="bg-red-50 p-6 text-center border-b border-red-100">
               <h2 className="text-2xl font-black text-red-700 uppercase tracking-tight">I am Lost!</h2>
               <p className="text-red-600 mt-1 font-medium text-lg">Please help me get back to my family.</p>
               {pet.lastSeenArea && (
                 <p className="text-sm text-red-800/80 mt-2 font-medium">Last seen near: {pet.lastSeenArea}</p>
               )}
            </div>
            
            {rewardEnabled && rewardText && (
               <div className="bg-amber-100 text-amber-900 border-b border-amber-200 p-4 text-center font-bold text-lg">
                 💰 {rewardText}
               </div>
            )}

            <CardContent className="p-6 space-y-4">
               {ownerPhone && (
                 <a href={`tel:${ownerPhone}`} className="block w-full">
                   <Button size="lg" className="w-full h-14 text-lg bg-red-600 hover:bg-red-700">
                     <Phone className="mr-3 h-5 w-5" /> Call Owner
                   </Button>
                 </a>
               )}
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {whatsapp && (
                   <a target="_blank" href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} className="block w-full" rel="noreferrer">
                     <Button size="lg" variant="outline" className="w-full h-14 border-emerald-500 text-emerald-700 hover:bg-emerald-50">
                       <MessageCircle className="mr-2 h-5 w-5 text-emerald-500" /> WhatsApp
                     </Button>
                   </a>
                 )}
                 {ownerEmail && (
                   <a href={`mailto:${ownerEmail}?subject=Found your pet: ${pet.name}`} className="block w-full">
                     <Button size="lg" variant="outline" className="w-full h-14">
                       <Mail className="mr-2 h-5 w-5" /> Email
                     </Button>
                   </a>
                 )}
               </div>
            </CardContent>
          </Card>
        )}

        {/* Pet Information Profile */}
        <Card className="overflow-hidden shadow-lg border-0">
           <div className="w-full h-64 bg-slate-200 flex items-center justify-center relative">
              {pet.photoUrl ? (
                <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
              ) : (
                <PawPrint className="h-20 w-20 text-slate-300" />
              )}
           </div>
           <CardHeader className="bg-white pb-4 border-b">
             <div className="flex items-baseline justify-between">
                <CardTitle className="text-4xl font-extrabold tracking-tight">{pet.name}</CardTitle>
             </div>
             <CardDescription className="text-lg font-medium text-slate-600">
                {pet.breed || "Mixed Breed"} {pet.color ? `• ${pet.color}` : ''} {pet.age ? `• ${pet.age}` : ''}
             </CardDescription>
           </CardHeader>

           <CardContent className="p-6 space-y-6 bg-white">
             {pet.notes && (
               <div>
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">About Me</h3>
                 <p className="text-slate-800 text-lg leading-relaxed whitespace-pre-wrap">{pet.notes}</p>
               </div>
             )}
             
             {pet.behaviorNotes && (
               <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                 <h3 className="text-sm font-bold text-orange-800 uppercase tracking-wider mb-2">Behavior Warning</h3>
                 <p className="text-orange-900 font-medium leading-relaxed">{pet.behaviorNotes}</p>
               </div>
             )}

             {pet.medicalNotes && (
               <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                 <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">Medical Needs</h3>
                 <p className="text-blue-900 font-medium leading-relaxed">{pet.medicalNotes}</p>
               </div>
             )}
           </CardContent>
        </Card>

        {/* Safe Mode Assurance (When NO Lost Mode) */}
        {!lostMode && (
          <div className="text-center p-6 bg-emerald-50 rounded-xl border border-emerald-100 mt-8 shadow-sm">
             <h3 className="text-emerald-800 font-bold mb-2 text-lg">Hi there!</h3>
             <p className="text-emerald-700/90 font-medium">
               I am not currently marked as lost. My humans have registered this secure tag just in case. Have a great day!
             </p>
          </div>
        )}

      </main>
      
      <footer className="text-center py-8 text-slate-400 text-sm font-medium">
        Powered by <span className="font-bold text-slate-500">Find My Paw</span>
      </footer>
    </div>
  )
}
