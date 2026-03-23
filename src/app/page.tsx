import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PawPrint } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="text-center space-y-6 max-w-2xl px-4 py-16 bg-white rounded-3xl shadow-xl border">
        <div className="flex justify-center mb-8">
          <div className="h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center ring-8 ring-indigo-50">
            <PawPrint className="h-10 w-10 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
          Find My Paw
        </h1>
        <p className="text-xl text-slate-600 max-w-xl mx-auto leading-relaxed">
          The fastest way to bring your lost pet home. Secure, privacy-first QR tags for your best friend's collar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
              Get Started
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base bg-transparent hover:bg-slate-100 border-slate-200">
              Owner Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
