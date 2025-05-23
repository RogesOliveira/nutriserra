import type { Product } from "@/types"

export const products: Product[] = [
  {
    id: "1",
    name: "Ração Premium para Bovinos",
    description:
      "Ração de alta energia formulada para gado leiteiro e de corte para maximizar a produção de leite e o ganho de peso.",
    pricePerKg: 2.3,
    pricePerSack: 575.0,
    sackWeight: 250,
    image: "/images/cattle-feed.jpg",
    animalType: "cattle",
    subType: "dairy",
    benefits: ["Melhora produção de leite", "Aumenta ganho de peso", "Rico em nutrientes"],
  },
  {
    id: "2",
    name: "Ração para Aves Poedeiras",
    description: "Ração especialmente formulada para galinhas poedeiras para otimizar a produção e qualidade dos ovos.",
    pricePerKg: 1.95,
    pricePerSack: 97.5,
    sackWeight: 50,
    image: "/images/poultry-feed.jpg",
    animalType: "poultry",
    subType: "layers",
    benefits: ["Aumenta produção de ovos", "Melhora qualidade da casca", "Nutrição balanceada"],
  },
  {
    id: "3",
    name: "Fórmula de Crescimento para Suínos",
    description: "Ração completa para suínos em crescimento, projetada para apoiar o ganho de peso rápido e eficiente.",
    pricePerKg: 1.55,
    pricePerSack: 387.5,
    sackWeight: 250,
    image: "/images/swine-feed.jpg",
    animalType: "swine",
    subType: "growing",
    benefits: ["Acelera crescimento", "Melhora eficiência alimentar", "Apoia desenvolvimento muscular"],
  },
  {
    id: "4",
    name: "Mistura Nutricional para Ovinos",
    description: "Ração balanceada para ovinos que apoia a qualidade da lã, reprodução e saúde geral.",
    pricePerKg: 1.45,
    pricePerSack: 362.5,
    sackWeight: 250,
    image: "/images/sheep-feed.jpg",
    animalType: "sheep",
    subType: "ewes",
    benefits: ["Melhora qualidade da lã", "Apoia reprodução", "Nutrição completa"],
  },
  {
    id: "5",
    name: "Suplemento Mineral para Bovinos",
    description: "Suplemento mineral essencial para bovinos para prevenir deficiências e apoiar a saúde ideal.",
    pricePerKg: 3.0,
    pricePerSack: 150.0,
    sackWeight: 50,
    image: "/images/cattle-supplement.jpg",
    animalType: "cattle",
    subType: "beef",
    benefits: ["Previne deficiências", "Apoia função imunológica", "Melhora fertilidade"],
  },
  {
    id: "6",
    name: "Ração Inicial para Aves",
    description:
      "Ração inicial rica em nutrientes para pintinhos para apoiar o crescimento e desenvolvimento saudáveis.",
    pricePerKg: 2.2,
    pricePerSack: 55.0,
    sackWeight: 25,
    image: "/images/poultry-starter.jpg",
    animalType: "poultry",
    subType: "chicks",
    benefits: ["Apoia crescimento inicial", "Fortalece sistema imunológico", "Fácil digestão"],
  },
  {
    id: "7",
    name: "Ração de Terminação para Suínos",
    description:
      "Ração especializada para suínos em terminação para maximizar o ganho de peso final e a qualidade da carne.",
    pricePerKg: 1.72,
    pricePerSack: 430.0,
    sackWeight: 250,
    image: "/images/swine-finishing.jpg",
    animalType: "swine",
    subType: "finishing",
    benefits: ["Maximiza peso final", "Melhora qualidade da carne", "Conversão eficiente"],
  },
  {
    id: "8",
    name: "Ração para Cordeiros",
    description: "Ração palatável projetada para cordeiros jovens para complementar o leite e acelerar o crescimento.",
    pricePerKg: 1.35,
    pricePerSack: 67.5,
    sackWeight: 50,
    image: "/images/lamb-feed.jpg",
    animalType: "sheep",
    subType: "lambs",
    benefits: ["Complementa o leite", "Acelera crescimento", "Transição fácil"],
  },
  {
    id: "9",
    name: "Ração para Bezerros",
    description: "Formulação especial para bezerros em fase de crescimento, rica em proteínas e nutrientes essenciais.",
    pricePerKg: 1.58,
    pricePerSack: 79.0,
    sackWeight: 50,
    image: "/images/cattle-feed.jpg",
    animalType: "cattle",
    subType: "calf",
    benefits: ["Desenvolvimento saudável", "Fortalece imunidade", "Crescimento acelerado"],
  },
  {
    id: "10",
    name: "Ração para Frangos de Corte",
    description: "Ração de alta performance para frangos de corte, otimizada para ganho de peso rápido e eficiente.",
    pricePerKg: 1.4,
    pricePerSack: 70.0,
    sackWeight: 50,
    image: "/images/poultry-feed.jpg",
    animalType: "poultry",
    subType: "broilers",
    benefits: ["Crescimento rápido", "Conversão alimentar eficiente", "Qualidade da carne"],
  },
  {
    id: "11",
    name: "Ração para Leitões",
    description: "Ração especial para leitões recém-desmamados, formulada para facilitar a transição alimentar.",
    pricePerKg: 1.65,
    pricePerSack: 82.5,
    sackWeight: 50,
    image: "/images/swine-feed.jpg",
    animalType: "swine",
    subType: "piglets",
    benefits: ["Transição suave", "Digestibilidade elevada", "Crescimento inicial"],
  },
  {
    id: "12",
    name: "Suplemento para Vacas Leiteiras",
    description: "Suplemento nutricional avançado para vacas leiteiras, com foco na produção e qualidade do leite.",
    pricePerKg: 1.95,
    pricePerSack: 487.5,
    sackWeight: 250,
    image: "/images/cattle-supplement.jpg",
    animalType: "cattle",
    subType: "dairy",
    benefits: ["Aumenta produção de leite", "Melhora teor de gordura", "Saúde do úbere"],
  },
]
