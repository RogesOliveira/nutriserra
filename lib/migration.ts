import { supabaseAdmin } from "@/lib/supabase"
import { products as localProducts } from "@/data/products"
import { mapAppProductToDatabaseProduct } from "@/lib/products"

export async function migrateLocalProductsToSupabase(): Promise<{
  success: boolean
  message: string
  migratedCount: number
}> {
  try {
    // Verificar se já existem produtos no banco de dados
    const { count, error: countError } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Erro ao verificar produtos existentes:", countError)
      return {
        success: false,
        message: `Erro ao verificar produtos existentes: ${countError.message}`,
        migratedCount: 0,
      }
    }

    // Se já existem produtos, perguntar ao usuário se deseja continuar
    if (count && count > 0) {
      const shouldContinue = confirm(
        `Já existem ${count} produtos no banco de dados. Continuar com a migração pode causar duplicações. Deseja continuar?`,
      )
      if (!shouldContinue) {
        return {
          success: false,
          message: "Migração cancelada pelo usuário.",
          migratedCount: 0,
        }
      }
    }

    // Preparar os produtos para inserção
    const productsToInsert = localProducts.map((product) => {
      const dbProduct = mapAppProductToDatabaseProduct(product)
      return {
        ...dbProduct,
        created_at: new Date().toISOString(),
      }
    })

    // Inserir os produtos no banco de dados
    const { error } = await supabaseAdmin.from("products").insert(productsToInsert)

    if (error) {
      console.error("Erro ao migrar produtos:", error)
      return {
        success: false,
        message: `Erro ao migrar produtos: ${error.message}`,
        migratedCount: 0,
      }
    }

    return {
      success: true,
      message: `${localProducts.length} produtos migrados com sucesso!`,
      migratedCount: localProducts.length,
    }
  } catch (error: any) {
    console.error("Erro durante a migração:", error)
    return {
      success: false,
      message: `Erro durante a migração: ${error.message || "Erro desconhecido"}`,
      migratedCount: 0,
    }
  }
}
