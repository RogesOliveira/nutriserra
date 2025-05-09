"use client"

import { useState, useEffect, useRef } from "react"
import { Leaf, Phone, Search, X } from "lucide-react"
import type { AnimalType } from "@/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface HeaderProps {
  selectedAnimal: AnimalType | "all"
  setSelectedAnimal: (animal: AnimalType | "all") => void
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export function Header({ selectedAnimal, setSelectedAnimal, searchTerm, setSearchTerm }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Verificar se está em dispositivo móvel
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px é o breakpoint md no Tailwind
    }
    
    // Verificar no carregamento inicial
    checkMobile()
    
    // Adicionar event listener para redimensionamento
    window.addEventListener('resize', checkMobile)
    
    // Limpar event listener
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Quando montado, focar no input
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  const handleSearchClear = () => {
    setSearchTerm("")
    if (searchInputRef.current) {
      searchInputRef.current.focus() // Manter o foco após limpar
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-darkGreen shadow-md py-1 md:py-2" : "bg-darkGreen2 py-2 md:py-4"
      }`}
    >
      <div className="w-full px-2 md:px-4">
        <div className="flex items-center w-full justify-between">
          <div>
            <Image 
              src={isMobile ? "/images/nutriserralogofonte.png" : "/images/nutriserralogodupla.png"}
              alt="Nutriserra Logo" 
              width={162} 
              height={36} 
              className={isMobile ? "h-6 w-auto" : "h-9 w-auto"}
            />
          </div>

          <div className="mx-2 md:mx-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 pr-7 md:pl-10 md:pr-10 py-0.5 md:py-2 h-7 md:h-10 text-xs md:text-base bg-darkGreen border-mediumGreen text-cream placeholder:text-cream/60 focus-visible:ring-mediumGreen"
              />
              <Search className="absolute left-1.5 md:left-3 top-1/2 -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-cream" />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 md:h-6 md:w-6 p-0.5 text-cream hover:text-cream hover:bg-darkGreen/60"
                  onClick={handleSearchClear}
                >
                  <X className="h-2.5 w-2.5 md:h-4 md:w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex-none">
            <Link href="/contato">
              <Button className="bg-mediumGreen border-none text-white hover:bg-mediumGreen/90 h-8 md:h-10 px-2 md:px-4 text-[10px] md:text-base flex flex-row items-center">
                <Phone className="h-2.5 w-2.5 md:h-4 md:w-4 mr-1 md:mr-1.5" />
                <span className="inline">Contato</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
