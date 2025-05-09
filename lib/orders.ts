import { supabase, supabaseAdmin } from "@/lib/supabase"

export interface OrderItem {
  id: string
  order_id: string
  product_name: string
  description: string | null
  quantity: number
  unit_price: number
  sack_weight?: number
  commission_type?: 'percentage' | 'fixed'
  commission_value?: number
  total_price?: number // Computed field
  created_at?: string
  updated_at?: string
}

export interface Order {
  id: string
  client_id: string
  order_date: string
  status: string
  total_amount: number
  notes: string | null
  origin: string | null
  destination: string | null
  created_at?: string
  updated_at?: string
  items?: OrderItem[]
}

export interface OrderInput {
  client_id: string
  order_date?: string
  status?: string
  total_amount?: number
  notes?: string | null
  origin?: string | null
  destination?: string | null
}

export interface OrderItemInput {
  order_id: string
  product_name: string
  description?: string | null
  quantity: number
  unit_price: number
  sack_weight?: number
  commission_type?: 'percentage' | 'fixed'
  commission_value?: number
}

// Verificar se a tabela orders existe
export async function checkOrdersTable(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from("orders").select("id").limit(1)
    // Se não houver erro, a tabela existe
    return !error
  } catch (error) {
    console.error("Erro ao verificar tabela orders:", error)
    return false
  }
}

// Buscar todos os pedidos
export async function fetchOrders(): Promise<Order[]> {
  try {
    // Verificar se a tabela existe
    const tableExists = await checkOrdersTable()
    if (!tableExists) {
      console.warn("A tabela 'orders' não existe no banco de dados.")
      return []
    }

    // Buscar pedidos junto com seus itens
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("order_date", { ascending: false })

    if (error) {
      console.error("Erro ao buscar pedidos:", error)
      return []
    }

    // Garantir que cada pedido tenha a propriedade items
    return (data || []).map((order: any) => ({
      ...order,
      items: order.order_items || []
    }))
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    return []
  }
}

// Buscar pedidos de um cliente específico
export async function fetchOrdersByClientId(clientId: string): Promise<Order[]> {
  try {
    // Verificar se a tabela existe
    const tableExists = await checkOrdersTable()
    if (!tableExists) {
      return []
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("client_id", clientId)
      .order("order_date", { ascending: false })

    if (error) {
      console.error("Erro ao buscar pedidos do cliente:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Erro ao buscar pedidos do cliente:", error)
    return []
  }
}

// Buscar um pedido específico com seus itens
export async function fetchOrderById(id: string): Promise<Order | null> {
  try {
    // Verificar se a tabela existe
    const tableExists = await checkOrdersTable()
    if (!tableExists) {
      return null
    }

    // Buscar o pedido
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single()

    if (orderError) {
      console.error("Erro ao buscar pedido:", orderError)
      return null
    }

    // Buscar os itens do pedido
    const { data: itemsData, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id)

    if (itemsError) {
      console.error("Erro ao buscar itens do pedido:", itemsError)
      // Retornar o pedido sem os itens
      return orderData
    }

    // Combinar os dados
    return {
      ...orderData,
      items: itemsData || []
    }
  } catch (error) {
    console.error("Erro ao buscar pedido:", error)
    return null
  }
}

// Criar um novo pedido com itens
export async function createOrder(order: OrderInput, items: Omit<OrderItemInput, "order_id">[]): Promise<Order | null> {
  try {
    // Verificar se a tabela existe
    const tableExists = await checkOrdersTable()
    if (!tableExists) {
      throw new Error("A tabela 'orders' não existe no banco de dados")
    }

    // Iniciar uma transação
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert(order)
      .select()
      .single()

    if (orderError) {
      console.error("Erro ao criar pedido:", orderError)
      return null
    }

    // Calcular o total do pedido baseado nos itens
    const total = items.reduce((sum, item) => {
      const quantity = item.quantity || 0;
      const sackWeight = item.sack_weight || 50;
      const unitPrice = item.unit_price || 0;
      return sum + (quantity * sackWeight * unitPrice);
    }, 0);

    // Adicionar o total ao pedido
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update({ total_amount: total })
      .eq("id", orderData.id)
      .select()
      .single()

    if (updateError) {
      console.error("Erro ao atualizar o total do pedido:", updateError)
    }

    // Criar os itens do pedido
    const itemsWithOrderId = items.map(item => ({
      ...item,
      order_id: orderData.id
    }))

    const { data: itemsData, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(itemsWithOrderId)
      .select()

    if (itemsError) {
      console.error("Erro ao criar itens do pedido:", itemsError)
      // Retornar o pedido sem os itens
      return updatedOrder || orderData
    }

    // Retornar o pedido com os itens
    return {
      ...(updatedOrder || orderData),
      items: itemsData || []
    }
  } catch (error) {
    console.error("Erro ao criar pedido:", error)
    return null
  }
}

// Atualizar o status de um pedido
export async function updateOrderStatus(id: string, status: string): Promise<Order | null> {
  try {
    // Verificar se a tabela existe
    const tableExists = await checkOrdersTable()
    if (!tableExists) {
      throw new Error("A tabela 'orders' não existe no banco de dados")
    }

    // Validar o status
    const validStatus = ['Pending', 'Processing', 'Delivered', 'Cancelled', 'In Transit']
    if (!validStatus.includes(status)) {
      throw new Error(`Status inválido: ${status}. Status válidos: ${validStatus.join(', ')}`)
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar status do pedido:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error)
    return null
  }
}

// Excluir um pedido e seus itens (cascade delete configurado no banco)
export async function deleteOrder(id: string): Promise<boolean> {
  try {
    // Verificar se a tabela existe
    const tableExists = await checkOrdersTable()
    if (!tableExists) {
      throw new Error("A tabela 'orders' não existe no banco de dados")
    }

    const { error } = await supabaseAdmin
      .from("orders")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Erro ao excluir pedido:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao excluir pedido:", error)
    return false
  }
} 