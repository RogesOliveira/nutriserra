"use client"

import { MilkIcon as Cow, Bird, Rat, WheatIcon as Sheep } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AnimalType, AnimalSubType } from "@/types"

interface AnimalFilterProps {
  selectedAnimal: AnimalType | "all"
  setSelectedAnimal: (animal: AnimalType | "all") => void
  selectedSubType: AnimalSubType | null
  setSelectedSubType: (subType: AnimalSubType | null) => void
  className?: string
}

export function AnimalFilter({
  selectedAnimal,
  setSelectedAnimal,
  selectedSubType,
  setSelectedSubType,
  className = "",
}: AnimalFilterProps) {
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

  return (
    <div className={`${className}`}>
      <div className="bg-lightGreen rounded-lg p-4">
        <h3 className="font-semibold mb-3 text-darkGreen">Filtrar por Tipo de Animal</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button
            variant={selectedAnimal === "cattle" ? "default" : "outline"}
            className={`flex items-center justify-start gap-2 ${
              selectedAnimal === "cattle" ? "bg-mediumGreen hover:bg-mediumGreen/90" : ""
            }`}
            onClick={() => handleAnimalClick("cattle")}
          >
            <Cow className="h-4 w-4" />
            <span>Bovinos</span>
          </Button>

          <Button
            variant={selectedAnimal === "poultry" ? "default" : "outline"}
            className={`flex items-center justify-start gap-2 ${
              selectedAnimal === "poultry" ? "bg-mediumGreen hover:bg-mediumGreen/90" : ""
            }`}
            onClick={() => handleAnimalClick("poultry")}
          >
            <Bird className="h-4 w-4" />
            <span>Aves</span>
          </Button>

          <Button
            variant={selectedAnimal === "swine" ? "default" : "outline"}
            className={`flex items-center justify-start gap-2 ${
              selectedAnimal === "swine" ? "bg-mediumGreen hover:bg-mediumGreen/90" : ""
            }`}
            onClick={() => handleAnimalClick("swine")}
          >
            <Rat className="h-4 w-4" />
            <span>Suínos</span>
          </Button>

          <Button
            variant={selectedAnimal === "sheep" ? "default" : "outline"}
            className={`flex items-center justify-start gap-2 ${
              selectedAnimal === "sheep" ? "bg-mediumGreen hover:bg-mediumGreen/90" : ""
            }`}
            onClick={() => handleAnimalClick("sheep")}
          >
            <Sheep className="h-4 w-4" />
            <span>Ovinos</span>
          </Button>
        </div>

        {selectedAnimal === "cattle" && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-darkGreen">Tipo de Bovino</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedSubType === "dairy" ? "default" : "outline"}
                size="sm"
                className={`text-xs ${selectedSubType === "dairy" ? "bg-mediumGreen hover:bg-mediumGreen/90" : ""}`}
                onClick={() => handleSubTypeClick("dairy")}
              >
                Leite
              </Button>
              <Button
                variant={selectedSubType === "beef" ? "default" : "outline"}
                size="sm"
                className={`text-xs ${selectedSubType === "beef" ? "bg-mediumGreen hover:bg-mediumGreen/90" : ""}`}
                onClick={() => handleSubTypeClick("beef")}
              >
                Corte
              </Button>
              <Button
                variant={selectedSubType === "calf" ? "default" : "outline"}
                size="sm"
                className={`text-xs ${selectedSubType === "calf" ? "bg-mediumGreen hover:bg-mediumGreen/90" : ""}`}
                onClick={() => handleSubTypeClick("calf")}
              >
                Bezerros
              </Button>
            </div>
          </div>
        )}

        {selectedAnimal === "poultry" && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-darkGreen">Tipo de Ave</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedSubType === "layers" ? "default" : "outline"}
                size="sm"
                className={`text-xs ${selectedSubType === "layers" ? "bg-mediumGreen hover:bg-mediumGreen/90" : ""}`}
                onClick={() => handleSubTypeClick("layers")}
              >
                Poedeiras
              </Button>
              <Button
                variant={selectedSubType === "broilers" ? "default" : "outline"}
                size="sm"
                className={`text-xs ${selectedSubType === "broilers" ? "bg-mediumGreen hover:bg-mediumGreen/90" : ""}`}
                onClick={() => handleSubTypeClick("broilers")}
              >
                Frangos de Corte
              </Button>
              <Button
                variant={selectedSubType === "chicks" ? "default" : "outline"}
                size="sm"
                className={`text-xs ${selectedSubType === "chicks" ? "bg-mediumGreen hover:bg-mediumGreen/90" : ""}`}
                onClick={() => handleSubTypeClick("chicks")}
              >
                Pintinhos
              </Button>
            </div>
          </div>
        )}

        {selectedAnimal === "swine" && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-darkGreen">Tipo de Suíno</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedSubType === "piglets" ? "default" : "outline"}
                size="sm"
                className={`text-xs ${selectedSubType === "piglets" ? "bg-mediumGreen hover:bg-mediumGreen/90" : ""}`}
                onClick={() => handleSubTypeClick("piglets")}
              >
                Leitões
              </Button>
              <Button
                variant={selectedSubType === "growing" ? "default" : "outline"}
                size="sm"
                className={`text-xs ${selectedSubType === "growing" ? "bg-mediumGreen hover:bg-mediumGreen/90" : ""}`}
                onClick={() => handleSubTypeClick("growing")}
              >
                Crescimento
              </Button>
              <Button
                variant={selectedSubType === "finishing" ? "default" : "outline"}
                size="sm"
                className={`text-xs ${selectedSubType === "finishing" ? "bg-mediumGreen hover:bg-mediumGreen/90" : ""}`}
                onClick={() => handleSubTypeClick("finishing")}
              >
                Terminação
              </Button>
            </div>
          </div>
        )}

        {selectedAnimal === "sheep" && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-darkGreen">Tipo de Ovino</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedSubType === "lambs" ? "default" : "outline"}
                size="sm"
                className={`text-xs ${selectedSubType === "lambs" ? "bg-mediumGreen hover:bg-mediumGreen/90" : ""}`}
                onClick={() => handleSubTypeClick("lambs")}
              >
                Cordeiros
              </Button>
              <Button
                variant={selectedSubType === "ewes" ? "default" : "outline"}
                size="sm"
                className={`text-xs ${selectedSubType === "ewes" ? "bg-mediumGreen hover:bg-mediumGreen/90" : ""}`}
                onClick={() => handleSubTypeClick("ewes")}
              >
                Ovelhas
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
