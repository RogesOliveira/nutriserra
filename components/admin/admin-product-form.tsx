"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import type { Product, AnimalType, AnimalSubType } from "@/types"

interface AdminProductFormProps {
  product: Product | null
  onSave: (product: Product) => void
  onCancel: () => void
  isSaving: boolean
}

export function AdminProductForm({ product, onSave, onCancel, isSaving }: AdminProductFormProps) {
  // Parse animal type from string to array if it's in string format from DB
  const parseAnimalType = (value: any): AnimalType[] => {
    if (!value) return ["cattle" as AnimalType];
    if (Array.isArray(value)) return value;
    // Handle JSON string from DB
    if (typeof value === 'string') {
      try {
        // Try to parse as JSON first
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
        return [parsed as AnimalType];
      } catch (e) {
        // If not valid JSON, treat as single value
        return [value as AnimalType];
      }
    }
    return [value as AnimalType];
  };

  // Parse subtype with same logic
  const parseSubType = (value: any): AnimalSubType[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
        return [parsed as AnimalSubType];
      } catch (e) {
        return [value as AnimalSubType];
      }
    }
    return [value as AnimalSubType];
  };
  
  const initialAnimalType = parseAnimalType(product?.animalType);
  const initialSubType = parseSubType(product?.subType);
  
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: product?.name || "",
    description: product?.description || "",
    pricePerKg: product?.pricePerKg || 0,
    pricePerSack: product?.pricePerSack || 0,
    sackWeight: product?.sackWeight || 0,
    image: product?.image || "/placeholder.svg",
    animalType: initialAnimalType,
    subType: initialSubType,
    benefits: product?.benefits || [""],
    showAnimalNames: product?.showAnimalNames || false,
  })

  // Update form data when product prop changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        pricePerKg: product.pricePerKg || 0,
        pricePerSack: product.pricePerSack || 0,
        sackWeight: product.sackWeight || 0,
        image: product.image || "/placeholder.svg",
        animalType: parseAnimalType(product.animalType),
        subType: parseSubType(product.subType),
        benefits: product.benefits || [""],
        showAnimalNames: product.showAnimalNames || false,
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number.parseFloat(value) || 0
    
    // Criar uma cópia do estado atual para modificação
    const updatedFormData = {
      ...formData,
      [name]: numValue,
    }
    
    // Se o campo alterado for pricePerKg ou sackWeight, recalcular o preço da saca
    if (name === "pricePerKg" || name === "sackWeight") {
      updatedFormData.pricePerSack = +(updatedFormData.pricePerKg * updatedFormData.sackWeight).toFixed(2)
    }
    
    setFormData(updatedFormData)
  }

  // Função auxiliar para recalcular o preço por kg quando o preço da saca é alterado diretamente
  const handleSackPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sackPrice = Number.parseFloat(e.target.value) || 0
    
    // Evitar divisão por zero
    if (formData.sackWeight > 0) {
      const pricePerKg = +(sackPrice / formData.sackWeight).toFixed(2)
      setFormData({
        ...formData,
        pricePerKg: pricePerKg,
        pricePerSack: sackPrice
      })
    } else {
      setFormData({
        ...formData,
        pricePerSack: sackPrice
      })
    }
  }

  const handleAnimalTypeChange = (type: AnimalType, isChecked: boolean) => {
    let newAnimalTypes: AnimalType[] = [...(Array.isArray(formData.animalType) ? formData.animalType : [formData.animalType])]
    
    if (isChecked) {
      // Add type if not already in the array
      if (!newAnimalTypes.includes(type)) {
        newAnimalTypes.push(type)
      }
    } else {
      // Remove type from array
      newAnimalTypes = newAnimalTypes.filter(t => t !== type)
      // Ensure at least one type is selected
      if (newAnimalTypes.length === 0) {
        newAnimalTypes = ["cattle"]
      }
    }
    
    setFormData({
      ...formData,
      animalType: newAnimalTypes,
    })
  }

  const handleSubTypeChange = (subType: AnimalSubType, isChecked: boolean) => {
    let newSubTypes: AnimalSubType[] = [...(Array.isArray(formData.subType) ? formData.subType : formData.subType ? [formData.subType] : [])]
    
    if (isChecked) {
      // Add subtype if not already in the array
      if (!newSubTypes.includes(subType)) {
        newSubTypes.push(subType)
      }
    } else {
      // Remove subtype from array
      newSubTypes = newSubTypes.filter(t => t !== subType)
    }
    
    setFormData({
      ...formData,
      subType: newSubTypes.length > 0 ? newSubTypes : null,
    })
  }

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.benefits]
    newBenefits[index] = value
    setFormData({
      ...formData,
      benefits: newBenefits,
    })
  }

  const addBenefit = () => {
    setFormData({
      ...formData,
      benefits: [...formData.benefits, ""],
    })
  }

  const removeBenefit = (index: number) => {
    const newBenefits = [...formData.benefits]
    newBenefits.splice(index, 1)
    setFormData({
      ...formData,
      benefits: newBenefits,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Remover benefícios vazios
    const cleanedBenefits = formData.benefits.filter((benefit) => benefit.trim() !== "")

    // Convert arrays to JSON strings for database storage
    const animalTypeForDB = Array.isArray(formData.animalType) && formData.animalType.length === 1 
      ? formData.animalType[0] 
      : JSON.stringify(formData.animalType);
    
    const subTypeForDB = Array.isArray(formData.subType) && formData.subType.length === 1
      ? formData.subType[0]
      : formData.subType ? JSON.stringify(formData.subType) : null;

    onSave({
      id: product?.id || "", // ID será gerado no componente pai se for um novo produto
      ...formData,
      animalType: animalTypeForDB,
      subType: subTypeForDB,
      benefits: cleanedBenefits.length > 0 ? cleanedBenefits : ["Benefício não especificado"],
    })
  }

  // Helper to check if a type is selected
  const isAnimalTypeSelected = (type: AnimalType) => {
    if (Array.isArray(formData.animalType)) {
      return formData.animalType.includes(type);
    }
    return formData.animalType === type;
  }

  // Helper to check if a subtype is selected
  const isSubTypeSelected = (subType: AnimalSubType) => {
    if (Array.isArray(formData.subType)) {
      return formData.subType.includes(subType);
    }
    return formData.subType === subType;
  }

  // Helper to get array of selected animal types
  const getSelectedAnimalTypes = (): AnimalType[] => {
    if (Array.isArray(formData.animalType)) {
      return formData.animalType;
    }
    return [formData.animalType];
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6 text-darkGreen">{product ? "Editar Produto" : "Adicionar Novo Produto"}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Produto
              </label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div>
              <label htmlFor="pricePerKg" className="block text-sm font-medium text-gray-700 mb-1">
                Preço por kg (R$)
              </label>
              <Input
                id="pricePerKg"
                name="pricePerKg"
                type="number"
                step="0.01"
                min="0"
                value={formData.pricePerKg}
                onChange={handleNumberChange}
                required
              />
            </div>

            <div>
              <label htmlFor="sackWeight" className="block text-sm font-medium text-gray-700 mb-1">
                Peso da Saca (kg)
              </label>
              <Input
                id="sackWeight"
                name="sackWeight"
                type="number"
                step="1"
                min="1"
                value={formData.sackWeight}
                onChange={handleNumberChange}
                required
              />
            </div>

            <div>
              <label htmlFor="pricePerSack" className="block text-sm font-medium text-gray-700 mb-1">
                Preço da Saca (R$) <span className="text-xs text-mediumGreen">(Calculado automaticamente)</span>
              </label>
              <Input
                id="pricePerSack"
                name="pricePerSack"
                type="number"
                step="0.01"
                min="0"
                value={formData.pricePerSack}
                onChange={handleSackPriceChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Valor calculado: Preço por kg × Peso da saca
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="showAnimalNames" 
                checked={formData.showAnimalNames}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    showAnimalNames: checked === true
                  });
                }}
              />
              <label htmlFor="showAnimalNames" className="text-sm font-medium text-gray-700">
                Mostrar nomes dos animais no card do produto
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Animal (selecione um ou mais)
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox 
                    id="animal-cattle" 
                    checked={isAnimalTypeSelected("cattle")}
                    onCheckedChange={(checked) => handleAnimalTypeChange("cattle", checked === true)}
                  />
                  <label htmlFor="animal-cattle" className="ml-2 text-sm">Bovinos</label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="animal-poultry" 
                    checked={isAnimalTypeSelected("poultry")}
                    onCheckedChange={(checked) => handleAnimalTypeChange("poultry", checked === true)}
                  />
                  <label htmlFor="animal-poultry" className="ml-2 text-sm">Aves</label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="animal-swine" 
                    checked={isAnimalTypeSelected("swine")}
                    onCheckedChange={(checked) => handleAnimalTypeChange("swine", checked === true)}
                  />
                  <label htmlFor="animal-swine" className="ml-2 text-sm">Suínos</label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="animal-sheep" 
                    checked={isAnimalTypeSelected("sheep")}
                    onCheckedChange={(checked) => handleAnimalTypeChange("sheep", checked === true)}
                  />
                  <label htmlFor="animal-sheep" className="ml-2 text-sm">Ovinos</label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="animal-rabbit" 
                    checked={isAnimalTypeSelected("rabbit")}
                    onCheckedChange={(checked) => handleAnimalTypeChange("rabbit", checked === true)}
                  />
                  <label htmlFor="animal-rabbit" className="ml-2 text-sm">Coelhos</label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="animal-fish" 
                    checked={isAnimalTypeSelected("fish")}
                    onCheckedChange={(checked) => handleAnimalTypeChange("fish", checked === true)}
                  />
                  <label htmlFor="animal-fish" className="ml-2 text-sm">Peixes</label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="animal-shrimp" 
                    checked={isAnimalTypeSelected("shrimp")}
                    onCheckedChange={(checked) => handleAnimalTypeChange("shrimp", checked === true)}
                  />
                  <label htmlFor="animal-shrimp" className="ml-2 text-sm">Camarão</label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="animal-goat" 
                    checked={isAnimalTypeSelected("goat")}
                    onCheckedChange={(checked) => handleAnimalTypeChange("goat", checked === true)}
                  />
                  <label htmlFor="animal-goat" className="ml-2 text-sm">Caprinos</label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="animal-horse" 
                    checked={isAnimalTypeSelected("horse")}
                    onCheckedChange={(checked) => handleAnimalTypeChange("horse", checked === true)}
                  />
                  <label htmlFor="animal-horse" className="ml-2 text-sm">Equinos</label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtipo (selecione um ou mais)
              </label>
              {getSelectedAnimalTypes().includes("cattle") && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">Bovinos</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-dairy" 
                        checked={isSubTypeSelected("dairy")}
                        onCheckedChange={(checked) => handleSubTypeChange("dairy", checked === true)}
                      />
                      <label htmlFor="subtype-dairy" className="ml-2 text-sm">Leite</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-beef" 
                        checked={isSubTypeSelected("beef")}
                        onCheckedChange={(checked) => handleSubTypeChange("beef", checked === true)}
                      />
                      <label htmlFor="subtype-beef" className="ml-2 text-sm">Corte</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-calf" 
                        checked={isSubTypeSelected("calf")}
                        onCheckedChange={(checked) => handleSubTypeChange("calf", checked === true)}
                      />
                      <label htmlFor="subtype-calf" className="ml-2 text-sm">Bezerros</label>
                    </div>
                  </div>
                </div>
              )}
              
              {getSelectedAnimalTypes().includes("poultry") && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">Aves</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-layers" 
                        checked={isSubTypeSelected("layers")}
                        onCheckedChange={(checked) => handleSubTypeChange("layers", checked === true)}
                      />
                      <label htmlFor="subtype-layers" className="ml-2 text-sm">Poedeiras</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-broilers" 
                        checked={isSubTypeSelected("broilers")}
                        onCheckedChange={(checked) => handleSubTypeChange("broilers", checked === true)}
                      />
                      <label htmlFor="subtype-broilers" className="ml-2 text-sm">Frangos de Corte</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-chicks" 
                        checked={isSubTypeSelected("chicks")}
                        onCheckedChange={(checked) => handleSubTypeChange("chicks", checked === true)}
                      />
                      <label htmlFor="subtype-chicks" className="ml-2 text-sm">Pintinhos</label>
                    </div>
                  </div>
                </div>
              )}
              
              {getSelectedAnimalTypes().includes("swine") && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">Suínos</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-piglets" 
                        checked={isSubTypeSelected("piglets")}
                        onCheckedChange={(checked) => handleSubTypeChange("piglets", checked === true)}
                      />
                      <label htmlFor="subtype-piglets" className="ml-2 text-sm">Leitões</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-growing" 
                        checked={isSubTypeSelected("growing")}
                        onCheckedChange={(checked) => handleSubTypeChange("growing", checked === true)}
                      />
                      <label htmlFor="subtype-growing" className="ml-2 text-sm">Crescimento</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-finishing" 
                        checked={isSubTypeSelected("finishing")}
                        onCheckedChange={(checked) => handleSubTypeChange("finishing", checked === true)}
                      />
                      <label htmlFor="subtype-finishing" className="ml-2 text-sm">Terminação</label>
                    </div>
                  </div>
                </div>
              )}
              
              {getSelectedAnimalTypes().includes("sheep") && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">Ovinos</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-lambs" 
                        checked={isSubTypeSelected("lambs")}
                        onCheckedChange={(checked) => handleSubTypeChange("lambs", checked === true)}
                      />
                      <label htmlFor="subtype-lambs" className="ml-2 text-sm">Cordeiros</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-ewes" 
                        checked={isSubTypeSelected("ewes")}
                        onCheckedChange={(checked) => handleSubTypeChange("ewes", checked === true)}
                      />
                      <label htmlFor="subtype-ewes" className="ml-2 text-sm">Ovelhas</label>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Novos subtipos para os novos animais */}
              {getSelectedAnimalTypes().includes("rabbit") && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">Coelhos</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-meat_rabbit" 
                        checked={isSubTypeSelected("meat_rabbit")}
                        onCheckedChange={(checked) => handleSubTypeChange("meat_rabbit", checked === true)}
                      />
                      <label htmlFor="subtype-meat_rabbit" className="ml-2 text-sm">Coelhos para Carne</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-breeding_rabbit" 
                        checked={isSubTypeSelected("breeding_rabbit")}
                        onCheckedChange={(checked) => handleSubTypeChange("breeding_rabbit", checked === true)}
                      />
                      <label htmlFor="subtype-breeding_rabbit" className="ml-2 text-sm">Coelhos Reprodutores</label>
                    </div>
                  </div>
                </div>
              )}
              
              {getSelectedAnimalTypes().includes("fish") && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">Peixes</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-tilapia" 
                        checked={isSubTypeSelected("tilapia")}
                        onCheckedChange={(checked) => handleSubTypeChange("tilapia", checked === true)}
                      />
                      <label htmlFor="subtype-tilapia" className="ml-2 text-sm">Tilápia</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-salmon" 
                        checked={isSubTypeSelected("salmon")}
                        onCheckedChange={(checked) => handleSubTypeChange("salmon", checked === true)}
                      />
                      <label htmlFor="subtype-salmon" className="ml-2 text-sm">Salmão</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-tambaqui" 
                        checked={isSubTypeSelected("tambaqui")}
                        onCheckedChange={(checked) => handleSubTypeChange("tambaqui", checked === true)}
                      />
                      <label htmlFor="subtype-tambaqui" className="ml-2 text-sm">Tambaqui</label>
                    </div>
                  </div>
                </div>
              )}
              
              {getSelectedAnimalTypes().includes("shrimp") && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">Camarão</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-freshwater_shrimp" 
                        checked={isSubTypeSelected("freshwater_shrimp")}
                        onCheckedChange={(checked) => handleSubTypeChange("freshwater_shrimp", checked === true)}
                      />
                      <label htmlFor="subtype-freshwater_shrimp" className="ml-2 text-sm">Água Doce</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-saltwater_shrimp" 
                        checked={isSubTypeSelected("saltwater_shrimp")}
                        onCheckedChange={(checked) => handleSubTypeChange("saltwater_shrimp", checked === true)}
                      />
                      <label htmlFor="subtype-saltwater_shrimp" className="ml-2 text-sm">Água Salgada</label>
                    </div>
                  </div>
                </div>
              )}
              
              {getSelectedAnimalTypes().includes("goat") && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">Caprinos</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-meat_goat" 
                        checked={isSubTypeSelected("meat_goat")}
                        onCheckedChange={(checked) => handleSubTypeChange("meat_goat", checked === true)}
                      />
                      <label htmlFor="subtype-meat_goat" className="ml-2 text-sm">Corte</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-milk_goat" 
                        checked={isSubTypeSelected("milk_goat")}
                        onCheckedChange={(checked) => handleSubTypeChange("milk_goat", checked === true)}
                      />
                      <label htmlFor="subtype-milk_goat" className="ml-2 text-sm">Leite</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-kid_goat" 
                        checked={isSubTypeSelected("kid_goat")}
                        onCheckedChange={(checked) => handleSubTypeChange("kid_goat", checked === true)}
                      />
                      <label htmlFor="subtype-kid_goat" className="ml-2 text-sm">Cabritos</label>
                    </div>
                  </div>
                </div>
              )}
              
              {getSelectedAnimalTypes().includes("horse") && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">Equinos</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-foal" 
                        checked={isSubTypeSelected("foal")}
                        onCheckedChange={(checked) => handleSubTypeChange("foal", checked === true)}
                      />
                      <label htmlFor="subtype-foal" className="ml-2 text-sm">Potros</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-adult_horse" 
                        checked={isSubTypeSelected("adult_horse")}
                        onCheckedChange={(checked) => handleSubTypeChange("adult_horse", checked === true)}
                      />
                      <label htmlFor="subtype-adult_horse" className="ml-2 text-sm">Adultos</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="subtype-performance_horse" 
                        checked={isSubTypeSelected("performance_horse")}
                        onCheckedChange={(checked) => handleSubTypeChange("performance_horse", checked === true)}
                      />
                      <label htmlFor="subtype-performance_horse" className="ml-2 text-sm">Desempenho</label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="min-h-[120px]" required />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem
              </label>
              <Input id="image" name="image" value={formData.image} onChange={handleChange} required />
              {formData.image && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Pré-visualização:</p>
                  <img src={formData.image} alt="Pré-visualização" className="max-h-24 rounded-md" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Benefícios
              </label>
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center mt-2">
                  <Input
                    value={benefit}
                    onChange={(e) => handleBenefitChange(index, e.target.value)}
                    placeholder={`Benefício ${index + 1}`}
                  />
                  {formData.benefits.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => removeBenefit(index)}
                    >
                      &times;
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={addBenefit}
              >
                + Adicionar Benefício
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Produto"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
