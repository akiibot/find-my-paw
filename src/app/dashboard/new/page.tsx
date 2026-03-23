import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createPet } from "@/app/actions/pet"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewPetPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Pet</h1>
          <p className="text-muted-foreground mt-1">Create a profile to generate a QR tag.</p>
        </div>
      </div>

      <Card>
        <form action={createPet}>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the core details about your pet. You can add medical info and more later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Pet Name *</Label>
              <Input id="name" name="name" required placeholder="e.g. Max" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="breed">Breed (Optional)</Label>
              <Input id="breed" name="breed" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo">Pet Photo (Optional)</Label>
              <Input id="photo" name="photo" type="file" accept="image/*" className="cursor-pointer" />
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-4">Emergency Contact Options</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This info will only be visible to a finder if you ever mark your pet as "Lost".
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerPhone">Phone Number</Label>
                  <Input id="ownerPhone" name="ownerPhone" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerEmail">Public Email</Label>
                  <Input id="ownerEmail" name="ownerEmail" type="email" placeholder="Leave blank to use your account email" />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-6 bg-slate-50">
            <Link href="/dashboard">
              <Button variant="ghost" type="button">Cancel</Button>
            </Link>
            <Button type="submit">Create Profile</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
