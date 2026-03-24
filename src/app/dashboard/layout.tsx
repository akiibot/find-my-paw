import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PawPrint, LogOut, CircleUser } from "lucide-react"

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
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto flex h-20 items-center px-6 justify-between w-full">
          {/* Logo Lockup */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="bg-primary/10 p-2 rounded-xl border border-primary/20 group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
              <PawPrint className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-foreground">Find My Paw</span>
          </Link>

          {/* User Controls */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-muted/40 border border-border rounded-full py-1.5 px-4 shadow-sm">
              <CircleUser className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-foreground font-semibold max-w-[150px] truncate">
                {session.user.name || session.user.email}
              </div>
            </div>
            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/" })
              }}
            >
              <Button variant="ghost" size="icon" type="submit" title="Log out" className="rounded-full h-10 w-10 border border-transparent hover:border-destructive/30 hover:text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Log out</span>
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full mx-auto px-4 md:px-8 py-8 items-start">
        {children}
      </main>
    </div>
  )
}
