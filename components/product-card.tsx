import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Tag } from "lucide-react"
import type { Product, AnimalType } from "@/types"
import { useRef, useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    
    // Calculate mouse position relative to the card's center
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    // Calculate tilt angles (smaller values for more subtle effect)
    const tiltX = -(y / rect.height) * 20 // 20 degrees max tilt (doubled from 10)
    const tiltY = (x / rect.width) * 20 // 20 degrees max tilt (doubled from 10)
    
    setTilt({ x: tiltX, y: tiltY })
  }
  
  const handleMouseEnter = () => {
    setIsHovering(true)
  }
  
  const handleMouseLeave = () => {
    setIsHovering(false)
    setTilt({ x: 0, y: 0 })
  }

  const getAnimalTypeInPortuguese = (animalType: string): string => {
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

  const getAnimalTypeImagePath = (animalType: string): string => {
    switch (animalType) {
      case "cattle":
        return "/images/vaca.jpg"
      case "poultry":
        return "/images/aves.jpg"
      case "swine":
        return "/images/suinos.jpg"
      case "sheep":
        return "/images/ovinos.jpg"
      case "rabbit":
        return "/images/coelho.jpg"
      case "fish":
        return "/images/peixe.jpg"
      case "shrimp":
        return "/images/camarao.jpg"
      case "goat":
        return "/images/caprino.jpg"
      case "horse":
        return "/images/equino.jpg"
      default:
        return "/images/hero-background.jpg"
    }
  }

  // Get array of animal types
  const getAnimalTypes = (): AnimalType[] => {
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

  // Get benefits as array
  const getBenefits = (): string[] => {
    if (!product.benefits) return [];
    
    // Handle string representation of JSON array from Supabase
    if (typeof product.benefits === 'string') {
      try {
        // Check if it looks like a JSON string array
        if (product.benefits.startsWith('[') && product.benefits.endsWith(']')) {
          const parsed = JSON.parse(product.benefits);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
        // If it's a single string value but not array-like
        return [product.benefits];
      } catch (error) {
        console.error("Error parsing benefits:", error);
        return [product.benefits];
      }
    }
    
    // Handle proper array
    if (Array.isArray(product.benefits)) {
      return product.benefits;
    }
    
    return [];
  }

  // Generate formatted text for animal types (e.g., "Bovinos - Aves")
  const getAnimalTypesText = (): string => {
    const types = getAnimalTypes();
    return types.map(type => getAnimalTypeInPortuguese(type)).join(" - ");
  }

  const handleWhatsAppClick = () => {
    const whatsappNumber = "5551999559189";
    const message = `Olá, tenho interesse em "${product.name}" - preço R$${(product.pricePerSack / product.sackWeight).toFixed(2)}/kg e saca de R$${product.pricePerSack.toFixed(2)}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div 
      ref={cardRef}
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col rounded-xl perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovering 
          ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.04, 1.04, 1.04)` 
          : 'none',
        transition: isHovering ? 'transform 0.1s ease' : 'transform 0.3s ease',
        transformStyle: 'preserve-3d',
        boxShadow: isHovering 
          ? `0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23), 
             ${-tilt.y / 2.5}px ${-tilt.x / 2.5}px 6px rgba(255,255,255,0.3) inset, 
             ${tilt.y / 2.5}px ${tilt.x / 2.5}px 6px rgba(0,0,0,0.2) inset` 
          : 'none'
      }}
    >
      {/* Main product image - extending 1rem below to overlap with content */}
      <div 
        className="relative h-64 w-full rounded-t-xl overflow-hidden" 
        style={{ 
          transform: 'none',
          transition: 'transform 0.3s ease',
          marginBottom: '-1rem' // Creates overlap with the content section
        }}
      >
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          className="object-cover" 
        />
        
        {/* Benefícios em formato de pílulas */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {/* Estas pílulas devem ser dinâmicas baseadas nos benefícios do produto no banco de dados */}
          {getBenefits().length > 0 ? (
            getBenefits().map((benefit, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="text-[10px] py-0 px-2 w-fit bg-white/90 text-mediumGreen border-mediumGreen/20"
              >
                {benefit}
              </Badge>
            ))
          ) : (
            <>
              <Badge variant="outline" className="text-[10px] py-0 px-2 w-fit bg-white/90 text-mediumGreen border-mediumGreen/20">Orgânico</Badge>
              <Badge variant="outline" className="text-[10px] py-0 px-2 w-fit bg-white/90 text-mediumGreen border-mediumGreen/20">Sem Transgênicos</Badge>
            </>
          )}
        </div>
      </div>
      
      {/* Card content - with padding top to account for the overlap */}
      <div 
        className="p-3 pt-4 flex-1 bg-white shadow-md flex flex-col rounded-xl"
        style={{ 
          transform: 'none',
          transition: 'transform 0.3s ease',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* User/Animal row */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {/* Display icons for all animal types */}
            <div className="flex -space-x-1 mr-2">
              {getAnimalTypes().map((type, index) => (
                <div 
                  key={index} 
                  className={`relative w-7 h-7 rounded-full overflow-hidden border border-white ${
                    index > 0 ? 'ml-[-8px]' : ''
                  }`}
                  style={{
                    zIndex: getAnimalTypes().length - index,
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
            {product.showAnimalNames !== false && (
              <span className="text-xs font-medium text-gray-700">{getAnimalTypesText()}</span>
            )}
          </div>
          <span className="ml-auto text-xs text-mediumGreen font-medium">R${(product.pricePerSack / product.sackWeight).toFixed(2)}/kg</span>
        </div>
        
        <div className="flex mb-3 justify-between">
          {/* Product title */}
          <div className="flex-1 mr-2">
            {/* Product title */}
            <h3 className="font-bold text-sm text-gray-800 line-clamp-2 mb-1">{product.name}</h3>
          </div>
          
          {/* Price section */}
          <div className="flex flex-col items-end">
            <div className="flex items-center mb-0.5">
              <Tag className="h-3 w-3 mr-1 text-mediumGreen" />
              <span className="text-base font-bold text-gray-900">R${product.pricePerSack.toFixed(2)}</span>
            </div>
            <span className="text-xs text-gray-500">Saca de {product.sackWeight}kg</span>
          </div>
        </div>
        
        {/* Buy button - now with mt-auto to push it to the bottom */}
        <div className="mt-auto">
          <Button 
            size="sm" 
            className="w-full bg-mediumGreen hover:bg-mediumGreen/90 py-1 h-8 rounded-md text-xs"
            onClick={handleWhatsAppClick}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            <span>Comprar Agora</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
