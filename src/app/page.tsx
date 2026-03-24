import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PawPrint, QrCode } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-950 selection:bg-indigo-100 flex flex-col">
      {/* Top Nav */}
      <nav className="p-6 md:p-10 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3 font-extrabold tracking-tight text-xl">
           <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-sm">
             <PawPrint className="w-5 h-5" />
           </div>
           Find My Paw
        </div>
        <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
          Owner Portal
        </Link>
      </nav>

      {/* Asymmetric Hero Domain */}
      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-10 py-12 lg:py-24 grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">
        
        {/* Left Column: Bold Typography & Action */}
        <div className="lg:col-span-7 space-y-10 relative z-10">
           <h1 className="text-6xl sm:text-7xl xl:text-[6rem] font-black tracking-tighter leading-[0.95] text-slate-900">
             The instant, <br className="hidden sm:block" />
             secure ID tag <br className="hidden sm:block" />
             <span className="text-indigo-600 block mt-2">for the modern pet.</span>
           </h1>
           
           <p className="text-xl sm:text-2xl text-slate-500 max-w-xl leading-relaxed font-medium">
             Engineered for the worst-case scenario. Stateless QR collar tags that reunite you with your best friend faster than a microchip.
           </p>
           
           <div className="flex flex-col sm:flex-row gap-4 pt-4">
             <Link href="/login" className="w-full sm:w-auto">
               <Button size="lg" className="h-16 px-10 text-lg w-full bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg shadow-slate-900/20 active:scale-95 transition-all">
                 Register Your Pet
               </Button>
             </Link>
             <Link href="/dashboard" className="w-full sm:w-auto">
               <Button size="lg" variant="outline" className="h-16 px-10 text-lg w-full rounded-full border-2 border-slate-200 hover:border-slate-900 hover:bg-transparent text-slate-600 font-bold active:scale-95 transition-all">
                 Open Dashboard
               </Button>
             </Link>
           </div>
        </div>

        {/* Right Column: Physical Product Representation */}
        <div className="lg:col-span-5 relative w-full aspect-square max-w-md mx-auto lg:mx-0">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-indigo-600/5 rounded-full blur-3xl transform scale-150 -z-10" />
          
          <div className="w-full h-full rounded-[3rem] bg-slate-50 border-[12px] border-white shadow-2xl overflow-hidden relative rotate-3 hover:rotate-6 transition-transform duration-700 ease-out flex items-center justify-center p-8 group">
             
             {/* The "Physical" QR Tag */}
             <div className="relative text-center p-8 sm:p-10 bg-white rounded-[2rem] shadow-xl flex flex-col items-center w-full border border-slate-100 group-hover:shadow-2xl transition-all duration-700">
               
               {/* Collar Ring Hook Hole illusion */}
               <div className="w-6 h-6 rounded-full bg-slate-100 shadow-inner absolute -top-12 border-4 border-slate-200" />
               <div className="w-2 h-16 bg-slate-200 absolute -top-16 rounded-t-full shadow-inner" />
               
               <div className="w-full aspect-square bg-slate-900 mb-6 rounded-3xl flex items-center justify-center shadow-inner relative overflow-hidden group-hover:-translate-y-1 transition-transform duration-500">
                 <QrCode className="w-2/3 h-2/3 text-white" />
                 {/* Scanning laser line animation */}
                 <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/50 blur-[2px] shadow-[0_0_15px_rgba(99,102,241,1)] animate-[pulse_2s_ease-in-out_infinite]" />
               </div>
               
               <div className="space-y-1">
                 <h3 className="font-extrabold text-xl text-slate-800 tracking-tight">Max's Tag</h3>
                 <p className="font-mono text-[10px] tracking-[0.2em] text-indigo-600 uppercase font-bold">Scan to locate</p>
               </div>
             </div>
             
          </div>
        </div>
        
      </main>
    </div>
  )
}
