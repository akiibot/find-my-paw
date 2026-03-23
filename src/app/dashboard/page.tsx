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
    <div className="space-y-6">
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
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-white">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <PawPrint className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold">No pets found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            You haven't added any pets yet. Create a profile to generate their first QR tag.
          </p>
          <Link href="/dashboard/new" className="mt-6">
            <Button>Add your first pet</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <Card key={pet.id} className="overflow-hidden flex flex-col items-start transition-all hover:shadow-md bg-white">
              <div className="w-full h-32 bg-slate-100 flex items-center justify-center border-b object-cover">
                {pet.photoUrl ? (
                  <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-400 text-sm">No photo</span>
                )}
              </div>
              <CardHeader className="pb-2 w-full">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{pet.name}</CardTitle>
                  {pet.lostMode && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      Lost
                    </span>
                  )}
                </div>
                <CardDescription>{pet.breed || "Mixed Breed"}</CardDescription>
              </CardHeader>
              <CardContent className="w-full mt-auto pt-4 flex gap-2">
                 <Link href={`/dashboard/pet/${pet.id}`} className="flex-1">
                   <Button variant="outline" className="w-full">Edit Profile</Button>
                 </Link>
                 <Link href={`/dashboard/pet/${pet.id}/qr`}>
                   <Button variant="secondary" size="icon" title="View QR">
                     <QrCode className="h-4 w-4" />
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
