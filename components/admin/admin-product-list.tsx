"use client"

import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import type { Product, AnimalType, AnimalSubType } from "@/types"

interface AdminProductListProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
  onToggleAnimalNames: (product: Product, value: boolean) => void
}

export function AdminProductList({ products, onEdit, onDelete, onToggleAnimalNames }: AdminProductListProps) {
  const getAnimalTypeInPortuguese = (animalType: AnimalType | AnimalType[]): string => {
    // If animalType is an array, map each type to Portuguese and join them
    if (Array.isArray(animalType)) {
      return animalType.map(type => getSingleAnimalTypeInPortuguese(type)).join(", ");
    }
    
    // Otherwise, handle single type
    return getSingleAnimalTypeInPortuguese(animalType);
  }
  
  // Helper for single animal type conversion
  const getSingleAnimalTypeInPortuguese = (animalType: AnimalType): string => {
    switch (animalType) {
      case "cattle":
        return "Bovinos"
      case "poultry":
        return "Aves"
      case "swine":
        return "Suínos"
      case "sheep":
        return "Ovinos"
      case "rabbit":
        return "Coelhos"
      case "fish":
        return "Peixes"
      case "shrimp":
        return "Camarão"
      case "goat":
        return "Caprinos"
      case "horse":
        return "Equinos"
      default:
        return animalType
    }
  }

  const getSubTypeInPortuguese = (
    animalType: AnimalType | AnimalType[], 
    subType?: AnimalSubType | AnimalSubType[] | null
  ): string => {
    if (!subType) return "-"

    // Handle array of subtypes
    if (Array.isArray(subType)) {
      return subType.map(st => getSubTypeTranslation(st)).join(", ");
    }
    
    // Handle single subtype
    return getSubTypeTranslation(subType);
  }
  
  // Helper for subtype translation
  const getSubTypeTranslation = (subType: AnimalSubType): string => {
    const subTypes: Record<string, string> = {
      // Cattle
      dairy: "Leite",
      beef: "Corte",
      calf: "Bezerros",
      // Poultry
      layers: "Poedeiras",
      broilers: "Frangos de Corte",
      chicks: "Pintinhos",
      // Swine
      piglets: "Leitões",
      growing: "Crescimento",
      finishing: "Terminação",
      // Sheep
      lambs: "Cordeiros",
      ewes: "Ovelhas",
      // Rabbit
      meat_rabbit: "Coelhos para Carne",
      breeding_rabbit: "Coelhos Reprodutores",
      // Fish
      tilapia: "Tilápia",
      salmon: "Salmão",
      tambaqui: "Tambaqui",
      // Shrimp
      freshwater_shrimp: "Camarão de Água Doce",
      saltwater_shrimp: "Camarão de Água Salgada",
      // Goat
      meat_goat: "Caprinos de Corte",
      milk_goat: "Caprinos de Leite",
      kid_goat: "Cabritos",
      // Horse
      foal: "Potros",
      adult_horse: "Equinos Adultos",
      performance_horse: "Equinos de Desempenho"
    };

    return subTypes[subType] || subType;
  }

  return (
    <div className="bg-white rounded-lg shadow w-full max-h-[calc(100vh-200px)] overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow>
            <TableHead className="w-[80px]">Imagem</TableHead>
            <TableHead className="w-[180px]">Nome</TableHead>
            <TableHead className="w-[150px]">Tipo</TableHead>
            <TableHead className="w-[200px]">Subtipo</TableHead>
            <TableHead className="w-[100px]">Preço/kg</TableHead>
            <TableHead className="w-[120px]">Saca</TableHead>
            <TableHead className="w-[150px]">Mostrar Animal</TableHead>
            <TableHead className="w-[100px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                Nenhum produto encontrado. Adicione seu primeiro produto!
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative w-16 h-16 rounded overflow-hidden">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="truncate">{product.name}</div>
                </TableCell>
                <TableCell>
                  <div className="truncate">{getAnimalTypeInPortuguese(product.animalType)}</div>
                </TableCell>
                <TableCell>
                  <div className="truncate max-w-[180px]">{getSubTypeInPortuguese(product.animalType, product.subType ?? null)}</div>
                </TableCell>
                <TableCell>R${product.pricePerKg.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="whitespace-nowrap">{product.sackWeight}kg - R${product.pricePerSack.toFixed(2)}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={product.showAnimalNames === true}
                      onCheckedChange={(checked) => onToggleAnimalNames(product, checked)}
                    />
                    <span className="text-xs">
                      {product.showAnimalNames ? 
                        <Eye className="h-4 w-4 text-mediumGreen" /> : 
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      }
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => onEdit(product)} className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(product.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
