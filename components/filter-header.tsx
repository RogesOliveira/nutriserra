"use client"

import { MilkIcon as Cow, Bird, Rat, WheatIcon as Sheep, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AnimalType, AnimalSubType } from "@/types"

interface FilterHeaderProps {
  selectedAnimal: AnimalType | "all"
  setSelectedAnimal: (animal: AnimalType | "all") => void
  selectedSubType: AnimalSubType | null
  setSelectedSubType: (subType: AnimalSubType | null) => void
}

export function FilterHeader({
  selectedAnimal,
  setSelectedAnimal,
  selectedSubType,
  setSelectedSubType,
}: FilterHeaderProps) {
  const handleAnimalClick = (animal: AnimalType) => {
    if (selectedAnimal === animal) {
      setSelectedAnimal("all")
      setSelectedSubType(null)
    } else {
      setSelectedAnimal(animal)
      setSelectedSubType(null)
    }
  }

  const handleSubTypeClick = (subType: AnimalSubType) => {
    if (selectedSubType === subType) {
      setSelectedSubType(null)
    } else {
      setSelectedSubType(subType)
    }
  }

  const clearFilters = () => {
    setSelectedAnimal("all")
    setSelectedSubType(null)
  }

  return (
    <div className="sticky top-[56px] z-40 w-full bg-lightGreen shadow-md transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-darkGreen">Filtrar por:</h3>
            {(selectedAnimal !== "all" || selectedSubType) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs flex items-center gap-1 text-darkGreen hover:text-darkGreen hover:bg-lightGreen/80"
              >
                <X className="h-3 w-3" />
                Limpar filtros
              </Button>
            )}
          </div>

          <div className="flex justify-between items-center overflow-x-auto gap-2">
            <Button
              variant={selectedAnimal === "cattle" ? "default" : "outline"}
              size="sm"
              className={`flex items-center gap-2 rounded-full ${
                selectedAnimal === "cattle"
                  ? "bg-mediumGreen hover:bg-mediumGreen/90"
                  : "border-darkGreen text-darkGreen hover:bg-lightGreen/80"
              }`}
              onClick={() => handleAnimalClick("cattle")}
            >
              <Cow className="h-4 w-4" />
              <span>Bovinos</span>
            </Button>

            <Button
              variant={selectedAnimal === "poultry" ? "default" : "outline"}
              size="sm"
              className={`flex items-center gap-2 rounded-full ${
                selectedAnimal === "poultry"
                  ? "bg-mediumGreen hover:bg-mediumGreen/90"
                  : "border-darkGreen text-darkGreen hover:bg-lightGreen/80"
              }`}
              onClick={() => handleAnimalClick("poultry")}
            >
              <Bird className="h-4 w-4" />
              <span>Aves</span>
            </Button>

            <Button
              variant={selectedAnimal === "swine" ? "default" : "outline"}
              size="sm"
              className={`flex items-center gap-2 rounded-full ${
                selectedAnimal === "swine"
                  ? "bg-mediumGreen hover:bg-mediumGreen/90"
                  : "border-darkGreen text-darkGreen hover:bg-lightGreen/80"
              }`}
              onClick={() => handleAnimalClick("swine")}
            >
              <Rat className="h-4 w-4" />
              <span>Suínos</span>
            </Button>

            <Button
              variant={selectedAnimal === "sheep" ? "default" : "outline"}
              size="sm"
              className={`flex items-center gap-2 rounded-full ${
                selectedAnimal === "sheep"
                  ? "bg-mediumGreen hover:bg-mediumGreen/90"
                  : "border-darkGreen text-darkGreen hover:bg-lightGreen/80"
              }`}
              onClick={() => handleAnimalClick("sheep")}
            >
              <Sheep className="h-4 w-4" />
              <span>Ovinos</span>
            </Button>
          </div>

          {selectedAnimal === "cattle" && (
            <div className="flex overflow-x-auto gap-2 pb-1">
              <Button
                variant={selectedSubType === "dairy" ? "default" : "outline"}
                size="sm"
                className={`text-xs rounded-full ${selectedSubType === "dairy" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "border-darkGreen text-darkGreen hover:bg-lightGreen/80"}`}
                onClick={() => handleSubTypeClick("dairy")}
              >
                Leite
              </Button>
              <Button
                variant={selectedSubType === "beef" ? "default" : "outline"}
                size="sm"
                className={`text-xs rounded-full ${selectedSubType === "beef" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "border-darkGreen text-darkGreen hover:bg-lightGreen/80"}`}
                onClick={() => handleSubTypeClick("beef")}
              >
                Corte
              </Button>
              <Button
                variant={selectedSubType === "calf" ? "default" : "outline"}
                size="sm"
                className={`text-xs rounded-full ${selectedSubType === "calf" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "border-darkGreen text-darkGreen hover:bg-lightGreen/80"}`}
                onClick={() => handleSubTypeClick("calf")}
              >
                Bezerros
              </Button>
            </div>
          )}

          {selectedAnimal === "poultry" && (
            <div className="flex overflow-x-auto gap-2 pb-1">
              <Button
                variant={selectedSubType === "layers" ? "default" : "outline"}
                size="sm"
                className={`text-xs rounded-full ${selectedSubType === "layers" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "border-darkGreen text-darkGreen hover:bg-lightGreen/80"}`}
                onClick={() => handleSubTypeClick("layers")}
              >
                Poedeiras
              </Button>
              <Button
                variant={selectedSubType === "broilers" ? "default" : "outline"}
                size="sm"
                className={`text-xs rounded-full ${selectedSubType === "broilers" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "border-darkGreen text-darkGreen hover:bg-lightGreen/80"}`}
                onClick={() => handleSubTypeClick("broilers")}
              >
                Frangos de Corte
              </Button>
              <Button
                variant={selectedSubType === "chicks" ? "default" : "outline"}
                size="sm"
                className={`text-xs rounded-full ${selectedSubType === "chicks" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "border-darkGreen text-darkGreen hover:bg-lightGreen/80"}`}
                onClick={() => handleSubTypeClick("chicks")}
              >
                Pintinhos
              </Button>
            </div>
          )}

          {selectedAnimal === "swine" && (
            <div className="flex overflow-x-auto gap-2 pb-1">
              <Button
                variant={selectedSubType === "piglets" ? "default" : "outline"}
                size="sm"
                className={`text-xs rounded-full ${selectedSubType === "piglets" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "border-darkGreen text-darkGreen hover:bg-lightGreen/80"}`}
                onClick={() => handleSubTypeClick("piglets")}
              >
                Leitões
              </Button>
              <Button
                variant={selectedSubType === "growing" ? "default" : "outline"}
                size="sm"
                className={`text-xs rounded-full ${selectedSubType === "growing" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "border-darkGreen text-darkGreen hover:bg-lightGreen/80"}`}
                onClick={() => handleSubTypeClick("growing")}
              >
                Crescimento
              </Button>
              <Button
                variant={selectedSubType === "finishing" ? "default" : "outline"}
                size="sm"
                className={`text-xs rounded-full ${selectedSubType === "finishing" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "border-darkGreen text-darkGreen hover:bg-lightGreen/80"}`}
                onClick={() => handleSubTypeClick("finishing")}
              >
                Terminação
              </Button>
            </div>
          )}

          {selectedAnimal === "sheep" && (
            <div className="flex overflow-x-auto gap-2 pb-1">
              <Button
                variant={selectedSubType === "lambs" ? "default" : "outline"}
                size="sm"
                className={`text-xs rounded-full ${selectedSubType === "lambs" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "border-darkGreen text-darkGreen hover:bg-lightGreen/80"}`}
                onClick={() => handleSubTypeClick("lambs")}
              >
                Cordeiros
              </Button>
              <Button
                variant={selectedSubType === "ewes" ? "default" : "outline"}
                size="sm"
                className={`text-xs rounded-full ${selectedSubType === "ewes" ? "bg-mediumGreen hover:bg-mediumGreen/90" : "border-darkGreen text-darkGreen hover:bg-lightGreen/80"}`}
                onClick={() => handleSubTypeClick("ewes")}
              >
                Ovelhas
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
