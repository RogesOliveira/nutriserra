"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AnimalType, AnimalSubType } from "@/types"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface SidebarProps {
  selectedAnimal: AnimalType | "all"
  setSelectedAnimal: (animal: AnimalType | "all") => void
  selectedSubType: AnimalSubType | null
  setSelectedSubType: (subType: AnimalSubType | null) => void
  isExpanded: boolean
  setIsExpanded: (value: boolean) => void
}

export function Sidebar({
  selectedAnimal,
  setSelectedAnimal,
  selectedSubType,
  setSelectedSubType,
  isExpanded,
  setIsExpanded,
}: SidebarProps) {
  // Estado para controlar quando a rolagem deve ocorrer
  const [shouldScroll, setShouldScroll] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Indicar quando estamos no cliente para evitar problemas de hidratação
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Ensure sidebar is always expanded, but only on client-side
  useEffect(() => {
    if (isClient && !isExpanded) {
      // Use setTimeout para garantir que isso ocorra após a hidratação completa
      setTimeout(() => {
        setIsExpanded(true);
      }, 10);
    }
  }, [isClient, isExpanded, setIsExpanded]);
  
  // Função para rolagem suave
  const scrollToContent = () => {
    window.scrollTo({
      top: 575,
      behavior: 'smooth'
    });
  };

  // Efeito para lidar com a rolagem após as mudanças de estado
  useEffect(() => {
    if (shouldScroll && isClient) {
      // Espera um pouco para permitir que a renderização aconteça
      setTimeout(() => {
        scrollToContent();
        setShouldScroll(false);
      }, 50);
    }
  }, [shouldScroll, isClient]);

  const handleAnimalClick = (animal: AnimalType | "all") => {
    if (selectedAnimal === animal) {
      if (animal !== "all") {
        // Se clicar no mesmo animal, apenas limpar o subtipo
        setSelectedSubType(null)
      }
    } else {
      setSelectedAnimal(animal)
      setSelectedSubType(null)
    }
    
    // Acionar rolagem após mudança de estado
    setShouldScroll(true);
  }

  const handleSubTypeClick = (subType: AnimalSubType) => {
    if (selectedSubType === subType) {
      setSelectedSubType(null)
    } else {
      setSelectedSubType(subType)
    }
    
    // Acionar rolagem após mudança de estado
    setShouldScroll(true);
  }

  const renderSubTypes = (animal: AnimalType) => {
    if (selectedAnimal !== animal) return null;
    
    switch (animal) {
      case "cattle":
        return (
          <div className="ml-9 mt-1 flex flex-col space-y-1">
            <Button
              variant={selectedSubType === "dairy" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "dairy" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("dairy")}
            >
              Leite
            </Button>
            <Button
              variant={selectedSubType === "beef" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "beef" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("beef")}
            >
              Corte
            </Button>
            <Button
              variant={selectedSubType === "calf" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "calf" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("calf")}
            >
              Bezerros
            </Button>
          </div>
        );
      case "poultry":
        return (
          <div className="ml-9 mt-1 flex flex-col space-y-1">
            <Button
              variant={selectedSubType === "layers" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "layers" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("layers")}
            >
              Poedeiras
            </Button>
            <Button
              variant={selectedSubType === "broilers" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "broilers" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("broilers")}
            >
              Frangos de Corte
            </Button>
            <Button
              variant={selectedSubType === "chicks" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "chicks" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("chicks")}
            >
              Pintinhos
            </Button>
          </div>
        );
      case "swine":
        return (
          <div className="ml-9 mt-1 flex flex-col space-y-1">
            <Button
              variant={selectedSubType === "piglets" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "piglets" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("piglets")}
            >
              Leitões
            </Button>
            <Button
              variant={selectedSubType === "growing" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "growing" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("growing")}
            >
              Crescimento
            </Button>
            <Button
              variant={selectedSubType === "finishing" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "finishing" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("finishing")}
            >
              Terminação
            </Button>
          </div>
        );
      case "sheep":
        return (
          <div className="ml-9 mt-1 flex flex-col space-y-1">
            <Button
              variant={selectedSubType === "lambs" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "lambs" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("lambs")}
            >
              Cordeiros
            </Button>
            <Button
              variant={selectedSubType === "ewes" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "ewes" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("ewes")}
            >
              Ovelhas
            </Button>
          </div>
        );
      case "rabbit":
        return (
          <div className="ml-9 mt-1 flex flex-col space-y-1">
            <Button
              variant={selectedSubType === "meat_rabbit" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "meat_rabbit" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("meat_rabbit")}
            >
              Coelhos para Carne
            </Button>
            <Button
              variant={selectedSubType === "breeding_rabbit" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "breeding_rabbit" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("breeding_rabbit")}
            >
              Coelhos Reprodutores
            </Button>
          </div>
        );
      case "fish":
        return (
          <div className="ml-9 mt-1 flex flex-col space-y-1">
            <Button
              variant={selectedSubType === "tilapia" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "tilapia" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("tilapia")}
            >
              Tilápia
            </Button>
            <Button
              variant={selectedSubType === "salmon" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "salmon" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("salmon")}
            >
              Salmão
            </Button>
            <Button
              variant={selectedSubType === "tambaqui" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "tambaqui" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("tambaqui")}
            >
              Tambaqui
            </Button>
          </div>
        );
      case "shrimp":
        return (
          <div className="ml-9 mt-1 flex flex-col space-y-1">
            <Button
              variant={selectedSubType === "freshwater_shrimp" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "freshwater_shrimp" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("freshwater_shrimp")}
            >
              Água Doce
            </Button>
            <Button
              variant={selectedSubType === "saltwater_shrimp" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "saltwater_shrimp" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("saltwater_shrimp")}
            >
              Água Salgada
            </Button>
          </div>
        );
      case "goat":
        return (
          <div className="ml-9 mt-1 flex flex-col space-y-1">
            <Button
              variant={selectedSubType === "meat_goat" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "meat_goat" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("meat_goat")}
            >
              Corte
            </Button>
            <Button
              variant={selectedSubType === "milk_goat" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "milk_goat" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("milk_goat")}
            >
              Leite
            </Button>
            <Button
              variant={selectedSubType === "kid_goat" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "kid_goat" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("kid_goat")}
            >
              Cabritos
            </Button>
          </div>
        );
      case "horse":
        return (
          <div className="ml-9 mt-1 flex flex-col space-y-1">
            <Button
              variant={selectedSubType === "foal" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "foal" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("foal")}
            >
              Potros
            </Button>
            <Button
              variant={selectedSubType === "adult_horse" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "adult_horse" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("adult_horse")}
            >
              Adultos
            </Button>
            <Button
              variant={selectedSubType === "performance_horse" ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 text-xs rounded-full w-full justify-start",
                selectedSubType === "performance_horse" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "bg-darkGreen2 border-mediumGreen text-white"
              )}
              onClick={() => handleSubTypeClick("performance_horse")}
            >
              Desempenho
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-darkGreen2 transition-all duration-300 pb-5 w-full overflow-hidden">
      <div className="p-2 pt-6">
        <div className="space-y-3">
          <div>
            <Button
              variant={selectedAnimal === "all" ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-2 transition-all w-full justify-start",
                selectedAnimal === "all" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "text-white hover:text-white hover:bg-darkGreen"
              )}
              onClick={() => handleAnimalClick("all")}
            >
              <Image 
                src="/icones/iconehome.png" 
                alt="Todos os Produtos" 
                width={20} 
                height={20} 
                className="h-5 w-5 min-w-5 brightness-0 invert drop-shadow-[0_0_1px_rgba(255,255,255,0.9)]"
              />
              <span className="truncate">Todos os Produtos</span>
            </Button>
          </div>
          
          <div className="space-y-1">
            <Button
              variant={selectedAnimal === "cattle" ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-2 transition-all w-full justify-start",
                selectedAnimal === "cattle" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "text-white hover:text-white hover:bg-darkGreen"
              )}
              onClick={() => handleAnimalClick("cattle")}
            >
              <Image 
                src="/icones/iconevaca.png" 
                alt="Bovinos" 
                width={20} 
                height={20} 
                className="h-5 w-5 min-w-5 brightness-0 invert drop-shadow-[0_0_1px_rgba(255,255,255,0.9)]" 
              />
              <span className="truncate">Bovinos</span>
            </Button>
            {renderSubTypes("cattle")}
          </div>

          <div className="space-y-1">
            <Button
              variant={selectedAnimal === "poultry" ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-2 transition-all w-full justify-start",
                selectedAnimal === "poultry" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "text-white hover:text-white hover:bg-darkGreen"
              )}
              onClick={() => handleAnimalClick("poultry")}
            >
              <Image 
                src="/icones/iconegalinha.png" 
                alt="Aves" 
                width={20} 
                height={20} 
                className="h-5 w-5 min-w-5 brightness-0 invert drop-shadow-[0_0_1px_rgba(255,255,255,0.9)]" 
              />
              <span className="truncate">Aves</span>
            </Button>
            {renderSubTypes("poultry")}
          </div>

          <div className="space-y-1">
            <Button
              variant={selectedAnimal === "swine" ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-2 transition-all w-full justify-start",
                selectedAnimal === "swine" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "text-white hover:text-white hover:bg-darkGreen"
              )}
              onClick={() => handleAnimalClick("swine")}
            >
              <Image 
                src="/icones/iconeporco.png" 
                alt="Suínos" 
                width={20} 
                height={20} 
                className="h-5 w-5 min-w-5 brightness-0 invert drop-shadow-[0_0_1px_rgba(255,255,255,0.9)]" 
              />
              <span className="truncate">Suínos</span>
            </Button>
            {renderSubTypes("swine")}
          </div>

          <div className="space-y-1">
            <Button
              variant={selectedAnimal === "sheep" ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-2 transition-all w-full justify-start",
                selectedAnimal === "sheep" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "text-white hover:text-white hover:bg-darkGreen"
              )}
              onClick={() => handleAnimalClick("sheep")}
            >
              <Image 
                src="/icones/iconeovelha.png" 
                alt="Ovinos" 
                width={20} 
                height={20} 
                className="h-5 w-5 min-w-5 brightness-0 invert drop-shadow-[0_0_1px_rgba(255,255,255,0.9)]" 
              />
              <span className="truncate">Ovinos</span>
            </Button>
            {renderSubTypes("sheep")}
          </div>
          
          {/* Novos tipos de animais */}
          <div className="space-y-1">
            <Button
              variant={selectedAnimal === "rabbit" ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-2 w-full justify-start",
                selectedAnimal === "rabbit" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "text-white hover:text-white hover:bg-darkGreen"
              )}
              onClick={() => handleAnimalClick("rabbit")}
            >
              <Image 
                src="/icones/iconecoelho.png" 
                alt="Coelhos" 
                width={20} 
                height={20} 
                className="h-5 w-5 min-w-5 brightness-0 invert drop-shadow-[0_0_1px_rgba(255,255,255,0.9)]" 
              />
              <span className="truncate">Coelhos</span>
            </Button>
            {renderSubTypes("rabbit")}
          </div>
          
          <div className="space-y-1">
            <Button
              variant={selectedAnimal === "fish" ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-2 w-full justify-start",
                selectedAnimal === "fish" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "text-white hover:text-white hover:bg-darkGreen"
              )}
              onClick={() => handleAnimalClick("fish")}
            >
              <Image 
                src="/icones/iconepeixe.png" 
                alt="Peixes" 
                width={20} 
                height={20} 
                className="h-5 w-5 min-w-5 brightness-0 invert drop-shadow-[0_0_1px_rgba(255,255,255,0.9)]" 
              />
              <span className="truncate">Peixes</span>
            </Button>
            {renderSubTypes("fish")}
          </div>
          
          <div className="space-y-1">
            <Button
              variant={selectedAnimal === "shrimp" ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-2 w-full justify-start",
                selectedAnimal === "shrimp" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "text-white hover:text-white hover:bg-darkGreen"
              )}
              onClick={() => handleAnimalClick("shrimp")}
            >
              <Image 
                src="/icones/iconecamarao.png" 
                alt="Camarão" 
                width={20} 
                height={20} 
                className="h-5 w-5 min-w-5 brightness-0 invert drop-shadow-[0_0_1px_rgba(255,255,255,0.9)]" 
              />
              <span className="truncate">Camarão</span>
            </Button>
            {renderSubTypes("shrimp")}
          </div>
          
          <div className="space-y-1">
            <Button
              variant={selectedAnimal === "goat" ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-2 w-full justify-start",
                selectedAnimal === "goat" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "text-white hover:text-white hover:bg-darkGreen"
              )}
              onClick={() => handleAnimalClick("goat")}
            >
              <Image 
                src="/icones/iconecaprino.png" 
                alt="Caprinos" 
                width={20} 
                height={20} 
                className="h-5 w-5 min-w-5 brightness-0 invert drop-shadow-[0_0_1px_rgba(255,255,255,0.9)]" 
              />
              <span className="truncate">Caprinos</span>
            </Button>
            {renderSubTypes("goat")}
          </div>
          
          <div className="space-y-1">
            <Button
              variant={selectedAnimal === "horse" ? "default" : "ghost"}
              className={cn(
                "flex items-center gap-2 w-full justify-start",
                selectedAnimal === "horse" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "text-white hover:text-white hover:bg-darkGreen"
              )}
              onClick={() => handleAnimalClick("horse")}
            >
              <Image 
                src="/icones/iconecavalo.png" 
                alt="Equinos" 
                width={20} 
                height={20} 
                className="h-5 w-5 min-w-5 brightness-0 invert drop-shadow-[0_0_1px_rgba(255,255,255,0.9)]" 
              />
              <span className="truncate">Equinos</span>
            </Button>
            {renderSubTypes("horse")}
          </div>
        </div>
      </div>
    </div>
  );
} 