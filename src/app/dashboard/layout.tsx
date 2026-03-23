import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PawPrint } from "lucide-react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto flex h-16 items-center px-4 justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <PawPrint className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-lg tracking-tight">Find My Paw</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600 font-medium max-w-[150px] truncate hidden sm:block">
              {session.user.name || session.user.email}
            </div>
            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/" })
              }}
            >
              <Button variant="ghost" size="sm" type="submit">Log out</Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  )
}
