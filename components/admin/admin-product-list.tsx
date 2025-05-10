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
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow>
            <TableHead className="w-[60px] text-sm">Imagem</TableHead>
            <TableHead className="max-w-[140px] text-sm">Nome</TableHead>
            <TableHead className="max-w-[110px] text-sm">Tipo</TableHead>
            <TableHead className="max-w-[140px] text-sm">Subtipo</TableHead>
            <TableHead className="w-[90px] text-sm">Preço/kg</TableHead>
            <TableHead className="w-[100px] text-sm">Saca</TableHead>
            <TableHead className="w-[90px] text-sm">Mostrar Animal</TableHead>
            <TableHead className="w-[80px] text-sm text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500 text-sm">
                Nenhum produto encontrado. Adicione seu primeiro produto!
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className="text-sm">
                <TableCell>
                  <div className="relative w-20 h-20 rounded overflow-hidden">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-sm max-w-[140px] truncate" title={product.name}>
                  {product.name.length > 20 ? product.name.slice(0, 20) + '...' : product.name}
                </TableCell>
                <TableCell className="text-sm max-w-[110px] truncate" title={getAnimalTypeInPortuguese(product.animalType)}>
                  {getAnimalTypeInPortuguese(product.animalType).length > 20 ? getAnimalTypeInPortuguese(product.animalType).slice(0, 20) + '...' : getAnimalTypeInPortuguese(product.animalType)}
                </TableCell>
                <TableCell className="text-sm max-w-[140px] truncate" title={getSubTypeInPortuguese(product.animalType, product.subType ?? null)}>
                  {getSubTypeInPortuguese(product.animalType, product.subType ?? null).length > 20 ? getSubTypeInPortuguese(product.animalType, product.subType ?? null).slice(0, 20) + '...' : getSubTypeInPortuguese(product.animalType, product.subType ?? null)}
                </TableCell>
                <TableCell className="text-sm">R${product.pricePerKg.toFixed(2)}</TableCell>
                <TableCell className="text-sm">
                  <div className="whitespace-nowrap">{product.sackWeight}kg - R${product.pricePerSack.toFixed(2)}</div>
                </TableCell>
                <TableCell className="text-sm">
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
                <TableCell className="text-right text-sm">
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
