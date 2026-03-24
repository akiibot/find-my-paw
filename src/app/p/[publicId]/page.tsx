import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Phone, Mail, MessageCircle, PawPrint, ShieldCheck } from "lucide-react"
import { sendScanAlert } from "@/lib/email"

export default async function PublicPetPage({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params
  const pet = await prisma.pet.findUnique({
    where: { publicId }
  })

  // 404 if slug doesn't exist
  if (!pet) notFound()

  // ── Fire-and-forget scan side effects ──
  // Do NOT await — we never want this to block the page render.
  const reqHeaders = await headers()
  const userAgent = reqHeaders.get("user-agent")
  const ip = reqHeaders.get("x-forwarded-for") ?? reqHeaders.get("x-real-ip") ?? null

  void Promise.all([
    // 1. Log the scan event
    prisma.scanEvent.create({
      data: {
        petId: pet.id,
        userAgent: userAgent?.substring(0, 500) ?? null,
        ipHash: ip ? Buffer.from(ip).toString("base64") : null,
      }
    }).catch(() => { /* silently ignore */ }),

    // 2. Send email alert — only if Lost Mode is active and owner email is set
    ...(pet.lostMode && pet.ownerEmail
      ? [sendScanAlert({
          ownerEmail: pet.ownerEmail,
          petName: pet.name,
          publicId: pet.publicId,
          lastSeenArea: pet.lastSeenArea,
          rewardEnabled: pet.rewardEnabled,
          rewardText: pet.rewardText,
          userAgent,
        }).catch(() => { /* silently ignore */ })]
      : []
    ),
  ])

  const { lostMode, rewardEnabled, rewardText, ownerPhone, ownerEmail, whatsapp } = pet


  return (
    <div className={`min-h-screen relative pb-20 selection:bg-primary/30
      ${lostMode 
        ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-destructive/30 via-background to-background' 
        : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-success/20 via-background to-background'
      }`}
    >
      <main className="max-w-lg mx-auto p-4 sm:p-6 pt-8 sm:pt-12 space-y-6">
        
        {/* The Monolithic Digital ID Card */}
        <Card className={`overflow-hidden shadow-2xl rounded-[2.5rem] bg-card/60 backdrop-blur-3xl border-2 sm:border-4 transition-all duration-700
          ${lostMode ? 'shadow-[0_20px_60px_rgba(220,38,38,0.2)] border-destructive/50' : 'shadow-xl border-border'}`}
        >
           {/* Cinematic Photography Layer */}
           <div className="w-full aspect-[4/5] sm:aspect-square bg-muted relative flex items-center justify-center overflow-hidden">
              {pet.photoUrl ? (
                <img 
                  src={pet.photoUrl} 
                  alt={pet.name} 
                  loading="lazy"
                  className="w-full h-full object-cover" 
                />
              ) : (
                <PawPrint className="h-32 w-32 text-muted-foreground/10" />
              )}

              {/* Status Badge Tag Overlay (Top Left) */}
              <div className="absolute top-6 left-6 z-20">
                 {lostMode ? (
                    <div className="flex items-center gap-2 bg-destructive text-white px-5 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-xl border border-white/20 animate-pulse">
                      <AlertTriangle className="w-4 h-4" /> Missing
                    </div>
                 ) : (
                    <div className="flex items-center gap-2 bg-success text-white px-5 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-xl border border-white/20">
                      <ShieldCheck className="w-4 h-4" /> Secured
                    </div>
                 )}
              </div>

              {/* Bottom Gradient Fade & Title Overlay */}
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 text-white z-10">
                 <h1 className="text-6xl font-black tracking-tighter drop-shadow-2xl capitalize leading-none mb-2">
                   {pet.name}
                 </h1>
                 <p className="text-2xl font-bold text-white/90 drop-shadow-md flex items-center gap-2">
                   {pet.breed || "Mixed Breed"} 
                   {pet.color && <span className="opacity-50">•</span>} 
                   {pet.color && <span>{pet.color}</span>}
                 </p>
              </div>
           </div>

           {/* Emergency Intervention Block (Interlocks with image natively) */}
           {lostMode && (
             <div className="bg-destructive text-white p-6 md:p-8 flex flex-col gap-4 border-y border-red-500/30">
                <div>
                   <h2 className="text-3xl font-black uppercase tracking-wider flex items-center gap-3">
                     I am Lost!
                   </h2>
                   <p className="font-semibold text-white/90 text-lg mt-1">
                     Please help me get back to my family.
                   </p>
                </div>
                
                {pet.lastSeenArea && (
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <p className="text-sm font-bold uppercase tracking-widest text-white/70 mb-1">Last Seen</p>
                    <p className="text-xl font-bold">{pet.lastSeenArea}</p>
                  </div>
                )}

                {rewardEnabled && rewardText && (
                  <div className="bg-yellow-500 text-black p-4 rounded-2xl shadow-inner border border-yellow-300 font-black text-xl flex items-center gap-3">
                    <span className="text-3xl font-serif">৳</span> {rewardText}
                  </div>
                )}
             </div>
           )}

           <CardContent className="p-6 sm:p-8 space-y-8 bg-card/50">
             
             {/* Data Grids */}
             <div className="grid gap-6">
                {pet.notes && (
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                      <PawPrint className="w-4 h-4" /> About Me
                    </h3>
                    <p className="text-foreground text-xl font-medium leading-relaxed whitespace-pre-wrap">{pet.notes}</p>
                  </div>
                )}
                
                {pet.behaviorNotes && (
                  <div className="p-6 bg-destructive/10 rounded-[2rem] border-2 border-destructive/20 shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-destructive/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <h3 className="text-sm font-black text-destructive uppercase tracking-widest mb-3 flex items-center gap-2 relative z-10">
                      <AlertTriangle className="h-4 w-4" /> Behavior Warning
                    </h3>
                    <p className="text-foreground font-bold text-xl leading-relaxed relative z-10">{pet.behaviorNotes}</p>
                  </div>
                )}

                {pet.medicalNotes && (
                  <div className="p-6 bg-secondary/10 rounded-[2rem] border-2 border-secondary/20 shadow-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-secondary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-3 relative z-10">Medical Needs</h3>
                    <p className="text-foreground font-bold text-xl leading-relaxed relative z-10">{pet.medicalNotes}</p>
                  </div>
                )}
             </div>

             {/* Safe Mode Assurance */}
             {!lostMode && (
               <div className="text-center p-6 bg-success/10 rounded-[2rem] border-2 border-success/20 shadow-sm">
                  <p className="text-success font-bold text-lg leading-relaxed">
                    I am not currently marked as lost. My humans have registered this secure tag just in case. Have a great day!
                  </p>
               </div>
             )}

           </CardContent>
        </Card>

        {/* Floating Action Bar (Sticky on Mobile) */}
        {lostMode && (
          <div className="sticky bottom-6 z-50 w-full animate-in slide-in-from-bottom-10 fade-in duration-700">
            <div className="flex flex-col gap-3 p-4 bg-background/80 backdrop-blur-2xl rounded-[2.5rem] border border-border shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
               
               {ownerPhone && (
                 <a href={`tel:${ownerPhone}`} className="block w-full outline-none">
                   <button className="w-full flex items-center justify-center gap-4 h-20 bg-destructive hover:bg-destructive/90 text-white font-black text-2xl uppercase tracking-widest rounded-[2rem] shadow-[0_10px_30px_rgba(220,38,38,0.4)] transition-all hover:scale-[1.02] border border-red-400/50 active:scale-95 focus:ring-4 focus:ring-destructive/30">
                     <Phone className="w-8 h-8 animate-pulse" /> Call Owner
                   </button>
                 </a>
               )}
               
               <div className="grid grid-cols-2 gap-3">
                 {whatsapp && (
                   <a target="_blank" href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} className="block w-full outline-none" rel="noreferrer">
                     <button className="w-full flex items-center justify-center gap-2 h-16 bg-success/10 hover:bg-success/20 border-2 border-success/30 text-success font-extrabold text-sm sm:text-lg uppercase tracking-wider rounded-2xl transition-all hover:scale-[1.02] active:scale-95 focus:ring-4 focus:ring-success/20">
                       <MessageCircle className="w-5 h-5" /> WhatsApp
                     </button>
                   </a>
                 )}
                 {ownerEmail && (
                   <a href={`mailto:${ownerEmail}?subject=Found your pet: ${pet.name}`} className="block w-full outline-none">
                     <button className="w-full flex items-center justify-center gap-2 h-16 bg-muted/50 hover:bg-muted border-2 border-transparent text-foreground font-extrabold text-sm sm:text-lg uppercase tracking-wider rounded-2xl transition-all hover:scale-[1.02] active:scale-95 focus:ring-4 focus:ring-muted">
                       <Mail className="w-5 h-5" /> Email
                     </button>
                   </a>
                 )}
               </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Premium Footer */}
      <footer className="text-center py-10 opacity-60 hover:opacity-100 transition-opacity">
        <p className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
          Technology by <span className="text-foreground">Find My Paw</span>
        </p>
      </footer>
    </div>
  )
}
