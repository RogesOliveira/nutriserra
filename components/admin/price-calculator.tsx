"use client"

import { useState, useEffect } from "react"
import { Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fetchProducts } from "@/lib/products"
import type { Product } from "@/types"

interface CalculatorItem {
  product: Product
  weight: number
  sacks: number
  totalPrice: number
}

export function PriceCalculator() {
  const [isOpen, setIsOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [weight, setWeight] = useState<string>("")
  const [freight, setFreight] = useState<string>("")
  const [items, setItems] = useState<CalculatorItem[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const loadProducts = async () => {
      const products = await fetchProducts()
      setProducts(products)
    }
    loadProducts()
  }, [])

  useEffect(() => {
    const freightNum = parseFloat(freight) || 0
    const itemsTotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
    setTotal(itemsTotal + freightNum)
  }, [items, freight])

  const handleAddItem = () => {
    if (!selectedProduct || !weight) return
    const weightNum = parseFloat(weight)
    if (isNaN(weightNum) || weightNum <= 0) return
    const sacks = Math.ceil(weightNum / selectedProduct.sackWeight)
    const totalPrice = sacks * selectedProduct.pricePerSack
    setItems([...items, {
      product: selectedProduct,
      weight: weightNum,
      sacks,
      totalPrice
    }])
    setSelectedProduct(null)
    setWeight("")
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start !text-cream bg-transparent hover:bg-darkGreen2 focus:bg-darkGreen2 active:bg-darkGreen2 hover:!text-cream !fill-cream"
        >
          <Calculator size={20} className="mr-2 !text-cream" />
          Calculadora
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Calculadora de Preços</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form
            onSubmit={e => {
              e.preventDefault()
              handleAddItem()
            }}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="product">Produto</Label>
              <Select
                value={selectedProduct?.id}
                onValueChange={(value) => {
                  const product = products.find(p => p.id === value)
                  setSelectedProduct(product || null)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Digite o peso em kg"
                min={1}
              />
            </div>
            <Button
              type="submit"
              variant="outline"
              className="w-full"
              disabled={!selectedProduct || !weight || parseFloat(weight) <= 0}
            >
              Adicionar Produto
            </Button>
          </form>

          {items.length > 0 && (
            <div className="max-h-56 overflow-y-auto flex flex-col gap-4">
              {items.map((item, index) => (
                <div key={index} className="grid gap-2 p-4 border rounded-lg bg-white/90 text-darkGreen">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                    >
                      Remover
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Peso (kg)</Label>
                      <p>{item.weight} kg</p>
                    </div>
                    <div>
                      <Label>Sacas</Label>
                      <p>{item.sacks} sacas</p>
                    </div>
                    <div>
                      <Label>Preço por Saco</Label>
                      <p>R$ {item.product.pricePerSack.toFixed(2)}</p>
                    </div>
                    <div>
                      <Label>Total</Label>
                      <p>R$ {item.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-2 mt-2">
            <Label htmlFor="freight">Frete (R$)</Label>
            <Input
              id="freight"
              type="number"
              value={freight}
              onChange={(e) => setFreight(e.target.value)}
              placeholder="Digite o valor do frete"
            />
          </div>

          <div className="border-t pt-4 sticky bottom-0 bg-white/95 z-10">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-lg font-bold">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 