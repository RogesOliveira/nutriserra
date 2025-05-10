"use client"

import { useState, useEffect, useRef } from "react"
import { Leaf, Phone, Search, ShoppingCart, Tag, X } from "lucide-react"
import type { AnimalType, Product } from "@/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface HeaderProps {
  selectedAnimal: AnimalType | "all"
  setSelectedAnimal: (animal: AnimalType | "all") => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  products?: Product[]
}

export function Header({ selectedAnimal, setSelectedAnimal, searchTerm, setSearchTerm, products = [] }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Verificar se está em dispositivo móvel
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px é o breakpoint md no Tailwind
    }
    
    // Verificar no carregamento inicial
    checkMobile()
    
    // Adicionar event listener para redimensionamento
    window.addEventListener('resize', checkMobile)
    
    // Limpar event listener
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Quando montado, focar no input
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    // Filtrar produtos com base no termo de pesquisa
    if (searchTerm.trim() && products.length > 0) {
      const filtered = products
        .filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 3); // Limitar a 3 resultados
      
      setSearchResults(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm, products]);

  useEffect(() => {
    // Fechar dropdown quando clicar fora dele
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchClear = () => {
    setSearchTerm("")
    setShowDropdown(false)
    if (searchInputRef.current) {
      searchInputRef.current.focus() // Manter o foco após limpar
    }
  }

  const handleProductClick = (productId: string) => {
    // Fechar o dropdown
    setShowDropdown(false);
    
    // Rolagem até o produto
    const productElement = document.getElementById(`product-${productId}`);
    if (productElement) {
      productElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
      
      // Destacar temporariamente o produto
      productElement.classList.add('highlight-product');
      setTimeout(() => {
        productElement.classList.remove('highlight-product');
      }, 2000);
    }
  };

  const handleWhatsAppClick = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o clique também acione o handleProductClick
    const whatsappNumber = "5551999559189";
    const message = `Olá, tenho interesse em "${product.name}" - preço R$${(product.pricePerSack / product.sackWeight).toFixed(2)}/kg e saca de R$${product.pricePerSack.toFixed(2)}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  // Helper para obter array de tipos de animais
  const getAnimalTypes = (product: Product): AnimalType[] => {
    // Handle string representation of JSON array from Supabase
    if (typeof product.animalType === 'string') {
      try {
        // Check if it looks like a JSON string array
        if (product.animalType.startsWith('[') && product.animalType.endsWith(']')) {
          const parsed = JSON.parse(product.animalType);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
        // If it's a single string value but not array-like
        return [product.animalType as AnimalType];
      } catch (error) {
        console.error("Error parsing animalType:", error);
        return [product.animalType as AnimalType];
      }
    }
    
    // Handle proper array
    if (Array.isArray(product.animalType)) {
      return product.animalType;
    }
    
    // Handle single value
    return [product.animalType];
  }

  // Helper para obter nome do animal em português
  const getAnimalTypeInPortuguese = (animalType: string): string => {
    switch (animalType) {
      case "cattle": return "Bovinos"
      case "poultry": return "Aves"
      case "swine": return "Suínos"
      case "sheep": return "Ovinos"
      case "rabbit": return "Coelhos"
      case "fish": return "Peixes"
      case "shrimp": return "Camarão"
      case "goat": return "Caprinos"
      case "horse": return "Equinos"
      default: return animalType
    }
  }

  // Helper para obter caminho da imagem do animal
  const getAnimalTypeImagePath = (animalType: string): string => {
    switch (animalType) {
      case "cattle": return "/images/vaca.jpg"
      case "poultry": return "/images/aves.jpg"
      case "swine": return "/images/suinos.jpg"
      case "sheep": return "/images/ovinos.jpg"
      case "rabbit": return "/images/coelho.jpg"
      case "fish": return "/images/peixe.jpg"
      case "shrimp": return "/images/camarao.jpg"
      case "goat": return "/images/caprino.jpg"
      case "horse": return "/images/equino.jpg"
      default: return "/images/hero-background.jpg"
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-darkGreen shadow-md py-1 md:py-2" : "bg-darkGreen2 py-2 md:py-4"
      }`}
    >
      <div className="w-full px-2 md:px-4">
        <div className="flex items-center w-full justify-between">
          <div>
            <Image 
              src={isMobile ? "/images/nutriserralogofonte.png" : "/images/nutriserralogodupla.png"}
              alt="Nutriserra Logo" 
              width={162} 
              height={36} 
              className={isMobile ? "h-6 w-auto" : "h-9 w-auto"}
            />
          </div>

          <div className="mx-2 md:mx-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 pr-7 md:pl-10 md:pr-10 py-0.5 md:py-2 h-7 md:h-10 text-xs md:text-base bg-darkGreen border-mediumGreen text-cream placeholder:text-cream/60 focus-visible:ring-mediumGreen"
              />
              <Search className="absolute left-1.5 md:left-3 top-1/2 -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-cream" />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 md:h-6 md:w-6 p-0.5 text-cream hover:text-cream hover:bg-darkGreen/60"
                  onClick={handleSearchClear}
                >
                  <X className="h-2.5 w-2.5 md:h-4 md:w-4" />
                </Button>
              )}
              
              {/* Dropdown para resultados da pesquisa */}
              {showDropdown && (
                <div 
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 mt-3 bg-white rounded-xl shadow-lg overflow-hidden z-50 w-[130%] -ml-[15%]"
                >
                  <div className="divide-y-0">
                    {searchResults.map((product, index) => (
                      <div 
                        key={product.id}
                        className={`flex items-stretch hover:bg-gray-100 cursor-pointer min-h-[80px] group relative ${
                          index === 0 ? 'rounded-t-xl' : ''
                        } ${
                          index === searchResults.length - 1 ? 'rounded-b-xl' : ''
                        }`}
                        onClick={() => handleProductClick(product.id)}
                      >
                        <div className="w-[80px] min-w-[80px] h-auto relative overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover h-full"
                          />
                        </div>
                        
                        {/* Botão de comprar que aparece ao passar o mouse */}
                        <div 
                          className="absolute left-0 w-[80px] h-full bg-mediumGreen flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                          onClick={(e) => handleWhatsAppClick(product, e)}
                        >
                          <div className="flex flex-col items-center justify-center text-white text-xs font-medium">
                            <ShoppingCart className="h-5 w-5 mb-1" />
                            <span>Comprar</span>
                          </div>
                        </div>
                        
                        <div className="flex-1 p-3 flex flex-col justify-center">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                            
                            {/* Ícones dos animais */}
                            <div className="flex -space-x-1">
                              {getAnimalTypes(product).map((type, index) => (
                                <div 
                                  key={index} 
                                  className={`relative w-5 h-5 rounded-full overflow-hidden border border-white ${
                                    index > 0 ? 'ml-[-4px]' : ''
                                  }`}
                                  style={{
                                    zIndex: getAnimalTypes(product).length - index,
                                    position: 'relative'
                                  }}
                                >
                                  <Image 
                                    src={getAnimalTypeImagePath(type)} 
                                    alt={getAnimalTypeInPortuguese(type)} 
                                    fill 
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                        </div>
                        
                        <div className="min-w-[100px] p-2 flex flex-col items-end justify-center">
                          <div className="flex items-center mb-1">
                            <Tag className="h-3 w-3 mr-1 text-mediumGreen" />
                            <span className="text-sm font-bold text-gray-900">R${product.pricePerSack.toFixed(2)}</span>
                          </div>
                          <span className="text-xs text-gray-500">Saca de {product.sackWeight}kg</span>
                          <span className="text-xs font-medium text-mediumGreen mt-1">
                            R${(product.pricePerSack / product.sackWeight).toFixed(2)}/kg
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-none">
            <Link href="/contato">
              <Button className="bg-mediumGreen border-none text-white hover:bg-mediumGreen/90 h-8 md:h-10 px-2 md:px-4 text-[10px] md:text-base flex flex-row items-center">
                <Phone className="h-2.5 w-2.5 md:h-4 md:w-4 mr-1 md:mr-1.5" />
                <span className="inline">Contato</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
