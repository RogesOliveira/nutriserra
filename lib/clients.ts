import { supabase, supabaseAdmin } from "@/lib/supabase"

export interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  created_at?: string
  updated_at?: string
}

export interface ClientInput {
  name: string
  email?: string | null
  phone?: string | null
  address?: string | null
}

// Verificar se a tabela clients existe
export async function checkClientsTable(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("clients").select("id").limit(1)
    // Se não houver erro, a tabela existe
    return !error
  } catch (error) {
    console.error("Erro ao verificar tabela clients:", error)
    return false
  }
}

// Buscar todos os clientes
export async function fetchClients(): Promise<Client[]> {
  try {
    // Verificar se a tabela existe
    const tableExists = await checkClientsTable()
    if (!tableExists) {
      console.warn("A tabela 'clients' não existe no banco de dados.")
      return []
    }

    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("name")

    if (error) {
      console.error("Erro ao buscar clientes:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar clientes:", error)
    return []
  }
}

// Buscar um cliente específico
export async function fetchClientById(id: string): Promise<Client | null> {
  try {
    // Verificar se a tabela existe
    const tableExists = await checkClientsTable()
    if (!tableExists) {
      return null
    }

    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Erro ao buscar cliente:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Erro ao buscar cliente:", error)
    return null
  }
}

// Criar um novo cliente
export async function createClient(client: ClientInput): Promise<Client | null> {
  try {
    // Verificar se a tabela existe
    const tableExists = await checkClientsTable()
    if (!tableExists) {
      throw new Error("A tabela 'clients' não existe no banco de dados")
    }

    const { data, error } = await supabaseAdmin
      .from("clients")
      .insert(client)
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar cliente:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Erro ao criar cliente:", error)
    return null
  }
}

// Atualizar um cliente existente
export async function updateClient(id: string, client: Partial<ClientInput>): Promise<Client | null> {
  try {
    // Verificar se a tabela existe
    const tableExists = await checkClientsTable()
    if (!tableExists) {
      throw new Error("A tabela 'clients' não existe no banco de dados")
    }

    const { data, error } = await supabaseAdmin
      .from("clients")
      .update(client)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar cliente:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error)
    return null
  }
}

// Excluir um cliente
export async function deleteClient(id: string): Promise<boolean> {
  try {
    // Verificar se a tabela existe
    const tableExists = await checkClientsTable()
    if (!tableExists) {
      throw new Error("A tabela 'clients' não existe no banco de dados")
    }

    const { error } = await supabaseAdmin
      .from("clients")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Erro ao excluir cliente:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao excluir cliente:", error)
    return false
  }
} 