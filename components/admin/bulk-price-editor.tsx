"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import type { Product, AnimalType } from "@/types"

interface BulkPriceEditorProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
  onSave: (updatedProducts: Product[]) => Promise<void>
}

export function BulkPriceEditor({ isOpen, onClose, products, onSave }: BulkPriceEditorProps) {
  const [editedProducts, setEditedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "animalType" | "pricePerKg" | "sackWeight">("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Inicializar produtos editados quando os produtos mudam ou o modal é aberto
  useEffect(() => {
    if (isOpen) {
      setEditedProducts([...products])
    }
  }, [products, isOpen])

  const handlePriceChange = (id: string, newPricePerKg: number) => {
    setEditedProducts(
      editedProducts.map((product) => {
        if (product.id === id) {
          const pricePerKg = newPricePerKg
          const pricePerSack = +(pricePerKg * product.sackWeight).toFixed(2)
          return { ...product, pricePerKg, pricePerSack }
        }
        return product
      })
    )
  }

  const handleSackPriceChange = (id: string, newPricePerSack: number) => {
    setEditedProducts(
      editedProducts.map((product) => {
        if (product.id === id && product.sackWeight > 0) {
          const pricePerSack = newPricePerSack
          const pricePerKg = +(pricePerSack / product.sackWeight).toFixed(2)
          return { ...product, pricePerKg, pricePerSack }
        }
        return product
      })
    )
  }

  const handleSackWeightChange = (id: string, newSackWeight: number) => {
    setEditedProducts(
      editedProducts.map((product) => {
        if (product.id === id) {
          const sackWeight = newSackWeight
          // Recalcular o preço da saca com base no novo peso
          const pricePerSack = +(product.pricePerKg * sackWeight).toFixed(2)
          return { ...product, sackWeight, pricePerSack }
        }
        return product
      })
    )
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await onSave(editedProducts)
      onClose()
    } catch (error) {
      console.error("Erro ao salvar preços:", error)
      alert("Ocorreu um erro ao salvar os preços. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const toggleSort = (column: "name" | "animalType" | "pricePerKg" | "sackWeight") => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  // Ordenar produtos
  const sortedProducts = [...editedProducts].sort((a, b) => {
    let comparison = 0
    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name)
    } else if (sortBy === "animalType") {
      const typeA = getAnimalTypeDisplay(a.animalType)
      const typeB = getAnimalTypeDisplay(b.animalType)
      comparison = typeA.localeCompare(typeB)
    } else if (sortBy === "pricePerKg") {
      comparison = a.pricePerKg - b.pricePerKg
    } else if (sortBy === "sackWeight") {
      comparison = a.sackWeight - b.sackWeight
    }
    return sortDirection === "asc" ? comparison : -comparison
  })

  // Helper to get display string for animal type(s)
  const getAnimalTypeDisplay = (animalType: AnimalType | AnimalType[]): string => {
    if (Array.isArray(animalType)) {
      return animalType.map(type => getAnimalTypeInPortuguese(type)).join(", ");
    }
    return getAnimalTypeInPortuguese(animalType);
  }

  const getAnimalTypeInPortuguese = (animalType: AnimalType): string => {
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edição de Preços em Massa</DialogTitle>
          <DialogDescription>
            Edite os preços por kg, peso da saca ou preço por saca de todos os produtos. Todos os valores são recalculados automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto min-h-0">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead className="w-[220px] cursor-pointer" onClick={() => toggleSort("name")}>
                  Nome {sortBy === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="w-[150px] cursor-pointer" onClick={() => toggleSort("animalType")}>
                  Tipo {sortBy === "animalType" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="w-[150px] cursor-pointer" onClick={() => toggleSort("pricePerKg")}>
                  Preço/kg (R$) {sortBy === "pricePerKg" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="w-[150px] cursor-pointer" onClick={() => toggleSort("sackWeight")}>
                  Peso da Saca (kg) {sortBy === "sackWeight" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="w-[150px]">Preço da Saca (R$)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                sortedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="truncate max-w-[200px]">{product.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="truncate max-w-[130px]">{getAnimalTypeDisplay(product.animalType)}</div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={product.pricePerKg}
                        onChange={(e) => handlePriceChange(product.id, parseFloat(e.target.value) || 0)}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="1"
                        min="1"
                        value={product.sackWeight}
                        onChange={(e) => handleSackWeightChange(product.id, parseInt(e.target.value) || 0)}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={product.pricePerSack}
                        onChange={(e) => handleSackPriceChange(product.id, parseFloat(e.target.value) || 0)}
                        className="w-24"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Todos os Preços"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 