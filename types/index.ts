export type AnimalType = "cattle" | "poultry" | "swine" | "sheep" | "rabbit" | "fish" | "shrimp" | "goat" | "horse"

export type AnimalSubType =
  // Bovinos
  | "dairy"
  | "beef"
  | "calf"
  // Aves
  | "layers"
  | "broilers"
  | "chicks"
  // Suínos
  | "piglets"
  | "growing"
  | "finishing"
  // Ovinos
  | "lambs"
  | "ewes"
  // Coelhos
  | "meat_rabbit"
  | "breeding_rabbit"
  // Peixes
  | "tilapia"
  | "salmon"
  | "tambaqui"
  // Camarão
  | "freshwater_shrimp"
  | "saltwater_shrimp"
  // Caprinos
  | "meat_goat"
  | "milk_goat"
  | "kid_goat"
  // Equinos
  | "foal"
  | "adult_horse"
  | "performance_horse"

export interface Product {
  id: string
  name: string
  description: string
  pricePerKg: number
  pricePerSack: number
  sackWeight: number
  image: string
  animalType: AnimalType | AnimalType[]
  subType?: AnimalSubType | AnimalSubType[] | null
  benefits: string[]
  showAnimalNames?: boolean
}
