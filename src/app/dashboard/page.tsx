import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, QrCode, PawPrint } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  // Fetch user's pets array
  const pets = await prisma.pet.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Pets</h1>
          <p className="text-muted-foreground mt-1">Manage your pet profiles and QR tags.</p>
        </div>
        <Link href="/dashboard/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Pet
          </Button>
        </Link>
      </div>

      {pets.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border border-border bg-card shadow-sm rounded-3xl">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-inner border border-primary/20">
            <PawPrint className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-2xl font-black text-foreground tracking-tight">Your pack is empty!</h3>
          <p className="text-muted-foreground mt-2 max-w-md text-lg leading-relaxed">
            Create a profile for your best friend to generate their first indestructible QR tag.
          </p>
          <Link href="/dashboard/new" className="mt-8">
            <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-8 text-lg font-bold">
              Add Your First Pet
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pets.map((pet: any) => (
            <Card key={pet.id} className="overflow-hidden flex flex-col items-start transition-all hover:shadow-xl hover:-translate-y-1 duration-300 bg-card border-border rounded-3xl shadow-sm">
              <div className="w-full aspect-square md:aspect-[4/3] bg-muted relative overflow-hidden group border-b border-border">
                {pet.photoUrl ? (
                  <img src={pet.photoUrl} alt={pet.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-50">
                    <PawPrint className="h-8 w-8 text-muted-foreground" />
                    <span className="text-muted-foreground font-semibold tracking-widest uppercase text-[10px]">No Photo</span>
                  </div>
                )}
                {/* Embedded Status Badge */}
                {pet.lostMode && (
                  <div className="absolute top-4 right-4 bg-destructive text-white animate-pulse px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-lg border-2 border-white/50 z-20">
                    LOST
                  </div>
                )}
              </div>
              <CardHeader className="pb-4 w-full pt-6">
                <div className="flex flex-col items-start">
                  <CardTitle className="text-2xl font-black text-foreground tracking-tight">{pet.name}</CardTitle>
                  <CardDescription className="text-base font-medium mt-1 text-muted-foreground">
                    {pet.breed || "Mixed Breed"}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="w-full mt-auto pt-2 pb-6 flex gap-3">
                 <Link href={`/dashboard/pet/${pet.id}`} className="flex-1">
                   <Button variant="secondary" className="w-full rounded-2xl h-12 font-bold text-secondary-foreground hover:bg-secondary/80">Edit Profile</Button>
                 </Link>
                 <Link href={`/dashboard/pet/${pet.id}/qr`}>
                   <Button variant="outline" size="icon" title="View QR" className="h-12 w-12 rounded-2xl border-2 hover:border-primary hover:text-primary">
                     <QrCode className="h-5 w-5" />
                   </Button>
                 </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
