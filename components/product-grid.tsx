"use client"

import { useRef } from "react"
import Image from "next/image"
import type { Product, AnimalType, AnimalSubType } from "@/types"
import { ProductCard } from "@/components/product-card"

interface ProductGridProps {
  products: Product[]
  selectedAnimal: AnimalType | "all"
  setSelectedAnimal: (animal: AnimalType | "all") => void
  selectedSubType: AnimalSubType | null
  setSelectedSubType: (subType: AnimalSubType | null) => void
  isLoading?: boolean
  searchTerm: string
}

export function ProductGrid({
  products,
  selectedAnimal,
  setSelectedAnimal,
  selectedSubType,
  setSelectedSubType,
  isLoading = false,
  searchTerm,
}: ProductGridProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  
  // Helper function to parse animal types from a string or array
  const parseAnimalTypes = (animalType: any): AnimalType[] => {
    try {
      // Handle null or undefined
      if (!animalType) {
        return [];
      }

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
          console.error("Error parsing animalType string:", error);
          return [animalType as AnimalType];
        }
      }
      
      // Handle proper array
      if (Array.isArray(animalType)) {
        return animalType;
      }
      
      // Handle single value
      return [animalType];
    } catch (error) {
      console.error("Error in parseAnimalTypes:", error);
      return [];
    }
  }
  
  // Helper function to parse subtypes from a string or array
  const parseSubTypes = (subType: any): AnimalSubType[] => {
    try {
      // Handle null or undefined
      if (!subType) {
        return [];
      }

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
          console.error("Error parsing subType string:", error);
          return [subType as AnimalSubType];
        }
      }
      
      // Handle proper array
      if (Array.isArray(subType)) {
        return subType;
      }
      
      // Handle single value
      return [subType];
    } catch (error) {
      console.error("Error in parseSubTypes:", error);
      return [];
    }
  }
  
  // Aplicar filtro de pesquisa
  const filteredProducts = searchTerm 
    ? products.filter(product => {
        try {
          const searchTermLower = searchTerm.toLowerCase();
          
          // Search in name and description
          if (product.name?.toLowerCase().includes(searchTermLower) || 
              product.description?.toLowerCase().includes(searchTermLower)) {
            return true;
          }
          
          // Search in animal types (could be string or array)
          if (product.animalType) {
            const animalTypes = parseAnimalTypes(product.animalType);
            for (const type of animalTypes) {
              if (type) {
                const typeInPortuguese = getAnimalTypeInPortuguese(type);
                if (typeInPortuguese?.toLowerCase().includes(searchTermLower)) {
                  return true;
                }
              }
            }
          }
          
          // Search in subtypes (could be string, array or null)
          if (product.subType) {
            const subTypes = parseSubTypes(product.subType);
            for (const subType of subTypes) {
              if (subType) {
                const subTypeInPortuguese = getSubTypeInPortuguese(subType);
                if (subTypeInPortuguese?.toLowerCase().includes(searchTermLower)) {
                  return true;
                }
              }
            }
          }
          
          return false;
        } catch (error) {
          console.error("Error filtering product:", error);
          return false;
        }
      })
    : products

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

  const getSubTypeInPortuguese = (subType: AnimalSubType): string => {
    switch (subType) {
      // Bovinos
      case "dairy":
        return "Leite"
      case "beef":
        return "Corte"
      case "calf":
        return "Bezerros"
      // Aves
      case "layers":
        return "Poedeiras"
      case "broilers":
        return "Frangos de Corte"
      case "chicks":
        return "Pintinhos"
      // Suínos
      case "piglets":
        return "Leitões"
      case "growing":
        return "Crescimento"
      case "finishing":
        return "Terminação"
      // Ovinos
      case "lambs":
        return "Cordeiros"
      case "ewes":
        return "Ovelhas"
      // Coelhos
      case "meat_rabbit":
        return "Coelhos para Carne"
      case "breeding_rabbit":
        return "Coelhos Reprodutores"
      // Peixes
      case "tilapia":
        return "Tilápia"
      case "salmon":
        return "Salmão"
      case "tambaqui":
        return "Tambaqui"
      // Camarão
      case "freshwater_shrimp":
        return "Camarão de Água Doce"
      case "saltwater_shrimp":
        return "Camarão de Água Salgada"
      // Caprinos
      case "meat_goat":
        return "Caprinos de Corte"
      case "milk_goat":
        return "Caprinos de Leite"
      case "kid_goat":
        return "Cabritos"
      // Equinos
      case "foal":
        return "Potros"
      case "adult_horse":
        return "Equinos Adultos"
      case "performance_horse":
        return "Equinos de Desempenho"
      default:
        return subType
    }
  }

  const getCategoryTitle = () => {
    switch (selectedAnimal) {
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
        return "Nossos Produtos"
    }
  }

  const getCategoryImage = () => {
    switch (selectedAnimal) {
      case "cattle":
        return "/images/cattle-feed.jpg"
      case "poultry":
        return "/images/poultry-feed.jpg"
      case "swine":
        return "/images/swine-feed.jpg"
      case "sheep":
        return "/images/sheep-feed.jpg"
      case "rabbit":
        return "/images/rabbit-feed.jpg"
      case "fish":
        return "/images/fish-feed.jpg"
      case "shrimp":
        return "/images/shrimp-feed.jpg"
      case "goat":
        return "/images/goat-feed.jpg"
      case "horse":
        return "/images/horse-feed.jpg"
      default:
        return "/images/imgvaca.jpg"
    }
  }

  return (
    <section className="py-0 px-0 w-full">
      {/* Category Header with Background Image */}
      <div className="relative w-full mb-8" style={{ height: "300px" }}>
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image 
            src={getCategoryImage()} 
            alt={getCategoryTitle()} 
            fill 
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
        </div>
        
        {/* Overlay with Title */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              {getCategoryTitle()}
            </h2>
            {filteredProducts.length > 0 && (
              <p className="text-white text-lg mt-2 drop-shadow-md">
                ({filteredProducts.length} produtos)
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-8 w-8 text-mediumGreen"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-lg text-gray-600">Carregando produtos...</span>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              {searchTerm 
                ? `Nenhum produto encontrado para "${searchTerm}". Por favor, tente outra busca.`
                : "Nenhum produto encontrado. Por favor, tente um filtro diferente."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
