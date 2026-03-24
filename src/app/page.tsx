import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PawPrint, ShieldCheck, Smartphone, Phone, ArrowRight, Star } from "lucide-react"
import InteractiveTag from "@/components/InteractiveTag"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">

      {/* ─── Navigation ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 font-black tracking-tight text-xl">
            <div className="bg-primary p-2 rounded-xl text-white shadow-md shadow-primary/30">
              <PawPrint className="w-5 h-5" />
            </div>
            Find My Paw
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              Owner Portal
            </Link>
            <Link href="/login">
              <Button size="sm" className="rounded-full px-6 font-bold shadow-lg shadow-primary/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <main className="flex-1 pt-16">
        {/* Ambient glow */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/15 rounded-full blur-[120px]" />
          <div className="absolute top-48 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
        </div>

        <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 lg:py-32 grid lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          {/* Left column */}
          <div className="lg:col-span-6 space-y-8 relative z-10">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-5 py-2 text-sm font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block" />
              QR-Powered Pet Safety
            </div>

            <h1 className="text-6xl sm:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.9] text-foreground">
              The instant,<br />
              secure ID tag<br />
              <span className="text-primary">for the modern<br />pet.</span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-xl leading-relaxed font-medium">
              A simple scan is all it takes. No app needed — just instant contact with the owner.
            </p>

            {/* Social proof */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i * 7}&backgroundColor=e2e8f0`} alt="User" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm font-bold text-foreground">Trusted by pet owners nationwide</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="h-16 px-10 text-lg w-full rounded-full shadow-2xl shadow-primary/30 font-black tracking-wide hover:scale-105 active:scale-95 transition-all group">
                  Register Your Pet
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-16 px-10 text-lg w-full rounded-full border-2 border-border hover:border-primary hover:text-primary hover:bg-transparent text-muted-foreground font-bold active:scale-95 transition-all">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>

          {/* Right column: product preview */}
          <div className="lg:col-span-6 w-full flex items-center justify-center">
            <div className="relative">
              {/* Glow ring behind the tag */}
              <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-primary/20 blur-3xl" />
              <InteractiveTag />
            </div>
          </div>
        </section>

        {/* ─── Trust strip ─── */}
        <div className="border-y border-border/60 bg-muted/40 backdrop-blur-sm py-6">
          <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-muted-foreground font-bold text-sm uppercase tracking-widest">
            {["No App Required", "Works with Any Camera", "Instant Contact", "24/7 Active", "Waterproof Tag"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-success" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ─── How it Works ─── */}
        <section id="how-it-works" className="w-full py-28 px-6 md:px-10">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <p className="text-primary font-black uppercase tracking-widest text-sm mb-4">The process</p>
            <h2 className="text-4xl md:text-6xl font-black text-foreground text-center tracking-tight mb-6 leading-tight">
              Three steps to absolute{" "}
              <span className="text-success">peace of mind.</span>
            </h2>
            <p className="text-xl text-muted-foreground text-center max-w-2xl mb-20 font-medium leading-relaxed">
              Unlike microchips, anyone with a smartphone can scan a Find My Paw tag. No vet visit, no app download required.
            </p>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 w-full">
              {[
                {
                  step: "01",
                  icon: <PawPrint className="w-8 h-8" />,
                  color: "primary",
                  title: "Secure the Tag",
                  desc: "Attach the lightweight, laser-engraved QR tag securely to your pet's collar. It's waterproof and built to survive anything.",
                },
                {
                  step: "02",
                  icon: <Smartphone className="w-8 h-8" />,
                  color: "secondary",
                  title: "An Instant Scan",
                  desc: "If your pet escapes, any stranger with a smartphone camera can instantly scan the tag. No special app needed, ever.",
                },
                {
                  step: "03",
                  icon: <Phone className="w-8 h-8" />,
                  color: "success",
                  title: "Get Them Home",
                  desc: "You are instantly alerted, and the finder can text or call you with one tap from your pet's secure emergency profile.",
                },
              ].map(({ step, icon, color, title, desc }) => (
                <div
                  key={step}
                  className={`relative bg-card p-10 rounded-[2.5rem] border-2 border-border shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group overflow-hidden`}
                >
                  {/* Large step number watermark */}
                  <span className="absolute top-4 right-6 text-8xl font-black text-border/50 group-hover:scale-110 transition-transform duration-500 leading-none select-none">
                    {step}
                  </span>

                  <div className={`w-16 h-16 rounded-2xl bg-${color}/10 text-${color} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    {icon}
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-4 tracking-tight">{title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium text-lg">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA Section ─── */}
        <section className="w-full px-6 md:px-10 pb-28">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-[3rem] overflow-hidden bg-primary p-12 sm:p-20 text-center shadow-[0_40px_80px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
              {/* Inner glow */}
              <div className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.15),_transparent_60%)]" />
              
              <div className="relative z-10">
                <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
                  Give your pet the<br />protection they deserve.
                </h2>
                <p className="text-xl text-white/80 font-medium mb-10 max-w-xl mx-auto leading-relaxed">
                  Set up takes under 2 minutes. One tag. Lifetime protection.
                </p>
                <Link href="/login">
                  <button className="bg-white text-primary font-black text-xl px-12 py-5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all tracking-tight flex items-center gap-3 mx-auto">
                    Register Your Pet Free
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-medium">
          <div className="flex items-center gap-2 font-black text-foreground">
            <div className="bg-primary p-1.5 rounded-lg text-white shadow">
              <PawPrint className="w-4 h-4" />
            </div>
            Find My Paw
          </div>
          <p>© {new Date().getFullYear()} Find My Paw. Built with care for every pet.</p>
          <Link href="/login" className="hover:text-foreground transition-colors font-bold">Owner Portal →</Link>
        </div>
      </footer>
    </div>
  )
}
