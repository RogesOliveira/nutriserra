"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"

// Array of partner logos
const partnerLogos = [
  "/parceiros/parceiroaurora.png",
  "/parceiros/parceirobrf.png",
  "/parceiros/parceirojbs.png",
  "/parceiros/parceiropetfood.png", 
  "/parceiros/parceirocotriel.png",
  "/parceiros/parceiropinheiros.png",
  "/parceiros/parceiroagrosul.png",
  "/parceiros/parceirodalia.jpg"
]

export function ClientsSection() {
  const logoContainerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const translateXRef = useRef(0)
  const animationRef = useRef<number | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [logoSetWidth, setLogoSetWidth] = useState(0)
  
  // Set up measurements for animation
  useEffect(() => {
    if (!logoContainerRef.current) return
    
    const calculateWidths = () => {
      if (!logoContainerRef.current) return
      
      const container = logoContainerRef.current
      // Container is the visible part
      const containerRect = container.getBoundingClientRect()
      setContainerWidth(containerRect.width)
      
      // Logo set is one complete set of logos
      const logoSet = container.querySelector(".logo-set")
      if (logoSet) {
        const logoSetRect = logoSet.getBoundingClientRect()
        setLogoSetWidth(logoSetRect.width)
      }
    }
    
    // Calculate initial dimensions
    calculateWidths()
    
    // Recalculate on window resize
    const handleResize = () => calculateWidths()
    window.addEventListener("resize", handleResize)
    
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  
  // Animation effect using CSS transforms
  useEffect(() => {
    if (!logoContainerRef.current || logoSetWidth === 0) return
    
    const slider = logoContainerRef.current.querySelector(".logo-slider") as HTMLElement
    if (!slider) return
    
    // Only reset position on initial render, not on isPaused changes
    if (translateXRef.current === 0) {
      slider.style.transform = `translateX(0px)`
    }
    
    // Animation speed - higher value = faster animation
    const speed = 1.0
    
    const animate = () => {
      if (!isPaused) {
        // Move the slider using transform
        translateXRef.current -= speed
        
        // Reset when we've gone through the first set completely
        if (Math.abs(translateXRef.current) >= logoSetWidth) {
          translateXRef.current = 0
        }
        
        // Apply transform
        slider.style.transform = `translateX(${translateXRef.current}px)`
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPaused, logoSetWidth])
  
  return (
    <section className="bg-cream pt-8 pb-8 overflow-hidden relative">
      {/* Green line at the top */}
      <div className="absolute top-0 left-0 w-full h-[15px] bg-darkGreen2"></div>
      
      {/* Title */}
      <div className="container mx-auto mb-4 mt-6">
        <h2 className="text-3xl font-conneqt text-center text-darkGreen"
            style={{ WebkitTextStroke: '1px #0a3d2b' }}>
          Clientes
        </h2>
        <p className="text-center text-darkGreen/70 mt-2 mb-4 max-w-2xl mx-auto text-sm">
          Empresas que confiam na qualidade e excelência das nossas soluções
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto relative">
        {/* Gradient overlay for the left edge */}
        <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-cream to-transparent z-10"></div>
        
        {/* Gradient overlay for the right edge */}
        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-cream to-transparent z-10"></div>
        
        {/* Visible container */}
        <div 
          ref={logoContainerRef}
          className="overflow-hidden py-3"
        >
          {/* Moving slider - this is what we'll transform */}
          <div className="logo-slider flex whitespace-nowrap will-change-transform">
            {/* First set of logos */}
            <div className="logo-set flex">
              {partnerLogos.map((logo, index) => (
                <div 
                  key={`logo-1-${index}`}
                  className="inline-block mx-5 relative"
                  onMouseEnter={() => {
                    setHoverIndex(index);
                    setIsPaused(true);
                  }}
                  onMouseLeave={() => {
                    setHoverIndex(null);
                    setIsPaused(false);
                  }}
                >
                  <div className="w-24 h-16 relative flex items-center justify-center">
                    <Image
                      src={logo}
                      alt={`Partner logo ${index + 1}`}
                      width={75}
                      height={50}
                      className={`transition-all duration-300 object-contain ${hoverIndex === index ? 'filter-none scale-110' : 'grayscale opacity-70'}`}
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Second set of logos (duplicate) for seamless looping */}
            <div className="logo-set flex">
              {partnerLogos.map((logo, index) => (
                <div 
                  key={`logo-2-${index}`}
                  className="inline-block mx-5 relative"
                  onMouseEnter={() => {
                    setHoverIndex(index + partnerLogos.length);
                    setIsPaused(true);
                  }}
                  onMouseLeave={() => {
                    setHoverIndex(null);
                    setIsPaused(false);
                  }}
                >
                  <div className="w-24 h-16 relative flex items-center justify-center">
                    <Image
                      src={logo}
                      alt={`Partner logo ${index + 1}`}
                      width={75}
                      height={50}
                      className={`transition-all duration-300 object-contain ${hoverIndex === index + partnerLogos.length ? 'filter-none scale-110' : 'grayscale opacity-70'}`}
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 