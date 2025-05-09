import { supabase, supabaseAdmin } from "@/lib/supabase"
import type { Product } from "@/types"
import { v4 as uuidv4 } from "uuid"
import { products as localProducts } from "@/data/products"

// Função para converter o formato do banco de dados para o formato da aplicação
export function mapDatabaseProductToAppProduct(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    pricePerKg: dbProduct.price_per_kg,
    pricePerSack: dbProduct.price_per_sack || 0,
    sackWeight: dbProduct.sack_weight || 0,
    image: dbProduct.image,
    animalType: dbProduct.animal_type, // This can be a string or array in the database
    subType: dbProduct.sub_type || null, // This can be a string, array or null in the database
    benefits: dbProduct.benefits || [],
    showAnimalNames: dbProduct.show_animal_names === true || dbProduct.show_animal_names === 'true',
  }
}

// Função para converter o formato da aplicação para o formato do banco de dados
export function mapAppProductToDatabaseProduct(product: Product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price_per_kg: product.pricePerKg,
    price_per_sack: product.pricePerSack,
    sack_weight: product.sackWeight,
    image: product.image,
    animal_type: product.animalType, // Send as is (string or array)
    sub_type: product.subType, // Send as is (string, array or null)
    benefits: product.benefits,
    show_animal_names: product.showAnimalNames || false,
    updated_at: new Date().toISOString(),
  }
}

// Verificar se a tabela products existe
export async function checkProductsTable(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("produtossite").select("id").limit(1)

    // Se não houver erro, a tabela existe
    return !error
  } catch (error) {
    console.error("Erro ao verificar tabela produtossite:", error)
    return false
  }
}

// Buscar todos os produtos
export async function fetchProducts(): Promise<Product[]> {
  try {
    // Verificar se a tabela existe
    const tableExists = await checkProductsTable()
    if (!tableExists) {
      console.warn("A tabela 'produtossite' não existe no banco de dados. Usando produtos locais como fallback.")
      return localProducts
    }

    const { data, error } = await supabase.from("produtossite").select("*").order("name")

    if (error) {
      console.error("Erro ao buscar produtos:", error)
      return localProducts
    }

    // Se não houver produtos no banco de dados, usar os produtos locais
    if (!data || data.length === 0) {
      console.warn("Nenhum produto encontrado no banco de dados. Usando produtos locais como fallback.")
      return localProducts
    }

    return data.map(mapDatabaseProductToAppProduct)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return localProducts
  }
}

// Buscar um produto específico
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    // Verificar se a tabela existe
    const tableExists = await checkProductsTable()
    if (!tableExists) {
      // Buscar nos produtos locais
      const localProduct = localProducts.find((p) => p.id === id)
      return localProduct || null
    }

    const { data, error } = await supabase.from("produtossite").select("*").eq("id", id).single()

    if (error) {
      console.error("Erro ao buscar produto:", error)
      // Buscar nos produtos locais
      const localProduct = localProducts.find((p) => p.id === id)
      return localProduct || null
    }

    return mapDatabaseProductToAppProduct(data)
  } catch (error) {
    console.error("Erro ao buscar produto:", error)
    // Buscar nos produtos locais
    const localProduct = localProducts.find((p) => p.id === id)
    return localProduct || null
  }
}

// Criar um novo produto
export async function createProduct(product: Omit<Product, "id">): Promise<Product | null> {
  try {
    // Verificar se a tabela existe
    const tableExists = await checkProductsTable()
    if (!tableExists) {
      throw new Error("A tabela 'produtossite' não existe no banco de dados")
    }

    const newProduct = {
      ...mapAppProductToDatabaseProduct({ ...product, id: uuidv4() }),
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin.from("produtossite").insert(newProduct).select().single()

    if (error) {
      console.error("Erro ao criar produto:", error)
      return null
    }

    return mapDatabaseProductToAppProduct(data)
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return null
  }
}

// Atualizar um produto existente
export async function updateProduct(product: Product): Promise<Product | null> {
  try {
    // Verificar se a tabela existe
    const tableExists = await checkProductsTable()
    if (!tableExists) {
      throw new Error("A tabela 'produtossite' não existe no banco de dados")
    }

    const { data, error } = await supabaseAdmin
      .from("produtossite")
      .update(mapAppProductToDatabaseProduct(product))
      .eq("id", product.id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar produto:", error)
      return null
    }

    return mapDatabaseProductToAppProduct(data)
  } catch (error) {
    console.error("Erro ao atualizar produto:", error)
    return null
  }
}

// Excluir um produto
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    // Verificar se a tabela existe
    const tableExists = await checkProductsTable()
    if (!tableExists) {
      throw new Error("A tabela 'produtossite' não existe no banco de dados")
    }

    const { error } = await supabaseAdmin.from("produtossite").delete().eq("id", id)

    if (error) {
      console.error("Erro ao excluir produto:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao excluir produto:", error)
    return false
  }
}
