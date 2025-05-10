"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProductGrid } from "@/components/product-grid"
import { Sidebar } from "@/components/sidebar"
import { ClientsSection } from "@/components/clients-section"
import type { Product, AnimalType, AnimalSubType } from "@/types"
import { products as localProducts } from "@/data/products"
import { fetchProducts } from "@/lib/products"

export function Marketplace() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [allProducts, setAllProducts] = useState<Product[]>(localProducts) // Inicializar com produtos locais
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalType | "all">("all")
  const [selectedSubType, setSelectedSubType] = useState<AnimalSubType | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarExpanded, setSidebarExpanded] = useState(true) // Iniciar como true para evitar transições durante hidratação
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false) // Estado para controlar hidratação

  const productsRef = useRef<HTMLDivElement>(null)

  // Helper to parse animal types from string or array
  const parseAnimalTypes = (animalType: any): AnimalType[] => {
    // Handle string representation of JSON array from Supabase
    if (typeof animalType === 'string') {
      try {
        // Check if it looks like a JSON string array
        if (animalType.startsWith('[') && animalType.endsWith(']')) {
          const parsed = JSON.parse(animalType);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
        // If it's a single string value but not array-like
        return [animalType as AnimalType];
      } catch (error) {
        console.error("Error parsing animalType:", error);
        return [animalType as AnimalType];
      }
    }
    
    // Handle proper array
    if (Array.isArray(animalType)) {
      return animalType;
    }
    
    // Handle single value
    return [animalType];
  }

  // Helper to parse subtypes from string or array
  const parseSubTypes = (subType: any): AnimalSubType[] => {
    if (!subType) return [];
    
    // Handle string representation of JSON array from Supabase
    if (typeof subType === 'string') {
      try {
        // Check if it looks like a JSON string array
        if (subType.startsWith('[') && subType.endsWith(']')) {
          const parsed = JSON.parse(subType);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
        // If it's a single string value but not array-like
        return [subType as AnimalSubType];
      } catch (error) {
        console.error("Error parsing subType:", error);
        return [subType as AnimalSubType];
      }
    }
    
    // Handle proper array
    if (Array.isArray(subType)) {
      return subType;
    }
    
    // Handle single value
    return [subType];
  }

  // Marcar quando o componente for montado para prevenir problemas de hidratação
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Detectar quando a página é rolada para ajustar a posição da sidebar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Expandir a sidebar quando um animal for selecionado
  useEffect(() => {
    if (selectedAnimal !== "all") {
      setSidebarExpanded(true)
    }
  }, [selectedAnimal])

  // Carregar produtos do Supabase ou usar locais como fallback
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      try {
        const products = await fetchProducts()
        setAllProducts(products)
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
        // Já inicializamos com produtos locais, então não precisamos fazer nada aqui
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Filtrar produtos com base nas seleções do usuário
  useEffect(() => {
    if (selectedAnimal === "all") {
      setFilteredProducts(allProducts)
      setSelectedSubType(null)
    } else {
      // Filter products that contain the selected animal type
      const filtered = allProducts.filter((product) => {
        const animalTypes = parseAnimalTypes(product.animalType);
        return animalTypes.includes(selectedAnimal);
      });

      if (selectedSubType) {
        // Filter products that contain the selected subtype
        setFilteredProducts(filtered.filter((product) => {
          if (product.subType) {
            const subTypes = parseSubTypes(product.subType);
            return subTypes.includes(selectedSubType);
          }
          return false;
        }));
      } else {
        setFilteredProducts(filtered)
      }
    }
  }, [selectedAnimal, selectedSubType, allProducts])

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header 
        selectedAnimal={selectedAnimal} 
        setSelectedAnimal={setSelectedAnimal} 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        products={allProducts}
      />

      {/* Hero em largura total, sem grid */}
      <Hero />
      
      {/* Apenas a seção de produtos usa o grid com a sidebar */}
      <div ref={productsRef} className="w-full">
        <div className="grid lg:grid-cols-[16rem_1fr] w-full relative">
          {/* Sidebar fixa apenas na seção de produtos */}
          <div className={`hidden lg:block sticky z-40 transition-all duration-300 ${
            isScrolled ? "top-[56px]" : "top-[72px]"
          } h-[calc(100vh-52px)]`}>
            <Sidebar
              selectedAnimal={selectedAnimal}
              setSelectedAnimal={setSelectedAnimal}
              selectedSubType={selectedSubType}
              setSelectedSubType={setSelectedSubType}
              isExpanded={sidebarExpanded}
              setIsExpanded={setSidebarExpanded}
            />
          </div>

          {/* Conteúdo de produtos */}
          <div className="lg:col-start-2 w-full">
            <div className="flex-1">
              <ProductGrid
                products={filteredProducts}
                selectedAnimal={selectedAnimal}
                setSelectedAnimal={setSelectedAnimal}
                selectedSubType={selectedSubType}
                setSelectedSubType={setSelectedSubType}
                isLoading={isLoading}
                searchTerm={searchTerm}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Clients Section em largura total, sem grid */}
      <ClientsSection />

      <footer className="bg-darkGreen text-cream py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Nutriserra</h3>
              <p className="text-sm">Soluções Premium de Ração Animal</p>
            </div>
            <div className="text-sm">
              <p>© {new Date().getFullYear()} Nutriserra. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
