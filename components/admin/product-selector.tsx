"use client"

import { useState, useEffect, useCallback } from "react"
import { Combobox, ComboboxOption } from "@/components/ui/combobox"
import { fetchProducts } from "@/lib/products"
import type { Product } from "@/types"

interface ProductSelectorProps {
  value: string
  onChange: (value: string) => void
  onProductSelect: (product: Product | null) => void
  disabled?: boolean
}

export function ProductSelector({
  value,
  onChange,
  onProductSelect,
  disabled = false,
}: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [options, setOptions] = useState<ComboboxOption[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Load products from the database
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      try {
        const fetchedProducts = await fetchProducts()
        setProducts(fetchedProducts)
        
        // Create options for combobox
        const productOptions = fetchedProducts.map((product) => ({
          value: product.id,
          label: product.name,
        }))
        setOptions(productOptions)

        // If there's a selected value, notify the parent
        if (value) {
          const selectedProduct = fetchedProducts.find(product => product.id === value)
          if (selectedProduct) {
            onProductSelect(selectedProduct)
          }
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadProducts()
  }, [])

  // Filter options based on search term
  useEffect(() => {
    if (!searchTerm) {
      setOptions(
        products.map((product) => ({
          value: product.id,
          label: product.name,
        }))
      )
      return
    }
    
    const filtered = products
      .filter((product) => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((product) => ({
        value: product.id,
        label: product.name,
      }))
    
    setOptions(filtered)
  }, [searchTerm, products])

  // Handle value change and product selection
  const handleValueChange = useCallback((newValue: string) => {
    onChange(newValue)
    
    if (newValue) {
      const selectedProduct = products.find((product) => product.id === newValue)
      if (selectedProduct) {
        onProductSelect(selectedProduct)
      }
    } else {
      onProductSelect(null)
    }
  }, [onChange, onProductSelect, products])

  return (
    <Combobox
      options={options}
      value={value}
      onChange={handleValueChange}
      onInputChange={setSearchTerm}
      placeholder="Digite ou selecione um produto..."
      emptyMessage="Nenhum produto encontrado."
      loading={isLoading}
      disabled={disabled}
    />
  )
} 