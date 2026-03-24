"use client"

import { useRef, useState, useCallback } from "react"
import { QrCode } from "lucide-react"

export default function InteractiveTag() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // 3D Tilt State
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    
    // Mouse position relative to the element (0 to 1)
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    // Calculate rotation (-15deg to 15deg)
    // If mouse is on left (x=0), rotateY = -15.
    const rotateY = (x - 0.5) * 30 
    const rotateX = (0.5 - y) * 30

    setRotation({ x: rotateX, y: rotateY })
    setGlarePosition({ x: x * 100, y: y * 100 })
  }, [])

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    // Smoothly return to center
    setRotation({ x: 0, y: 0 })
    setGlarePosition({ x: 50, y: 50 })
  }

  return (
    <div 
      className="relative w-full aspect-square max-w-md mx-auto perspective-1000 z-20 group"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1000px' }}
    >
      {/* Background ambient glow that shifts with the mouse */}
      <div 
        className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] transition-transform duration-300 ease-out -z-10"
        style={{
          transform: `translate(${rotation.y * -2}px, ${rotation.x * 2}px) scale(${isHovered ? 1.2 : 1})`
        }}
      />

      {/* The 3D rotating container */}
      <div 
        className="w-full h-full rounded-[3rem] bg-muted border-[10px] border-card shadow-2xl relative transition-all duration-200 ease-out preserve-3d flex items-center justify-center p-8 lg:p-12 cursor-crosshair overflow-hidden"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${isHovered ? 1.05 : 1}, ${isHovered ? 1.05 : 1}, 1)`,
          transformStyle: 'preserve-3d',
          boxShadow: isHovered 
            ? `${rotation.y * -1}px ${rotation.x * 1}px 40px rgba(0,0,0,0.15)` 
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Dynamic Glare Effect mapping to mouse position */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-50 rounded-[2.5rem]"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`,
            opacity: isHovered ? 0.6 : 0,
            mixBlendMode: 'overlay'
          }}
        />

        {/* The "Physical" inner QR Tag raised in 3D space */}
        <div 
          className="relative text-center p-8 bg-card rounded-[2rem] shadow-xl flex flex-col items-center w-full border border-border transition-transform duration-200 ease-out will-change-transform"
          style={{
            transform: 'translateZ(60px)', // Pushes the inner card out towards the viewer
          }}
        >
          {/* Collar Ring Hook Hole illusion */}
          <div className="w-6 h-6 rounded-full bg-muted shadow-inner absolute -top-12 border-4 border-border" />
          <div className="w-2 h-16 bg-border absolute -top-16 rounded-t-full shadow-inner" />
          
          <div className="w-full aspect-square bg-secondary mb-6 rounded-3xl flex items-center justify-center shadow-[inset_0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden ring-4 ring-secondary/5">
            <QrCode className="w-2/3 h-2/3 text-secondary-foreground" />
            
            {/* The Cinematic Laser Scanner */}
            <div 
              className="absolute left-0 w-full h-[3px] bg-primary blur-[1px] shadow-[0_0_20px_4px_var(--color-primary)] z-10"
              style={{
                animation: 'scanner 3s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                opacity: 0.9
              }}
            />
            
            {/* Holographic grid overlay on the QR area */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]" />
          </div>
          
          <div className="space-y-1 relative z-10 flex flex-col items-center">
            {/* Dog Photo overlapping the QR code */}
            <div className="w-16 h-16 rounded-full border-4 border-card shadow-lg overflow-hidden -mt-10 mb-1 bg-slate-100 z-20 group-hover:-translate-y-2 transition-transform duration-500 delay-75">
              <img src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=200&auto=format&fit=crop" alt="Priyo the Cat" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-extrabold text-2xl text-foreground tracking-tight">Priyo's Tag</h3>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="font-mono text-[10px] tracking-[0.25em] text-green-600 font-bold uppercase">Active Tracking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
