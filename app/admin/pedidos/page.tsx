"use client"

import { useState, useEffect } from "react"
import { Package, Search, Filter, Clock, Edit, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Order } from "@/lib/orders"
import { Client } from "@/lib/clients"
import Link from "next/link"

// Helper function to format currency in Brazilian format
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export default function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [clientsData, setClientsData] = useState<Record<string, Client | undefined>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Carregar pedidos do banco de dados
  useEffect(() => {
    async function loadOrders() {
      try {
        setIsLoading(true)
        // Carregar pedidos
        const ordersResponse = await fetch('/api/orders')
        if (!ordersResponse.ok) {
          throw new Error('Falha ao carregar pedidos')
        }
        const ordersData = await ordersResponse.json()
        setOrders(ordersData)
        setFilteredOrders(ordersData)
        
        // Carregar dados dos clientes mencionados nos pedidos
        const clientIds = [...new Set(ordersData.map((order: Order) => order.client_id))]
        
        const clientsInfo: Record<string, Client | undefined> = {}
        await Promise.all(
          clientIds.map(async (clientId: any) => {
            try {
              const clientResponse = await fetch(`/api/clients/${clientId}`)
              if (clientResponse.ok) {
                const clientData = await clientResponse.json()
                clientsInfo[clientId] = clientData
              }
            } catch (err) {
              console.error(`Erro ao carregar cliente ${clientId}:`, err)
            }
          })
        )
        
        setClientsData(clientsInfo)
      } catch (err) {
        console.error('Erro ao carregar pedidos:', err)
        setError('Não foi possível carregar os pedidos. Tente novamente mais tarde.')
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [])

  // Filtrar pedidos quando o termo de busca mudar
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOrders(orders)
      return
    }
    
    const filtered = orders.filter(order => {
      const client = clientsData[order.client_id]
      const searchTermLower = searchTerm.toLowerCase()
      
      return (
        // Busca pelo ID do pedido
        order.id.toLowerCase().includes(searchTermLower) ||
        // Busca pelo nome do cliente
        (client && client.name.toLowerCase().includes(searchTermLower)) ||
        // Busca pelo status do pedido traduzido
        formatStatus(order.status).toLowerCase().includes(searchTermLower)
      )
    })
    
    setFilteredOrders(filtered)
  }, [searchTerm, orders, clientsData])

  function formatStatus(status: string) {
    switch (status) {
      case 'Pending': return 'Pendente'
      case 'Processing': return 'Processando'
      case 'Delivered': return 'Entregue'
      case 'Cancelled': return 'Cancelado'
      case 'In Transit': return 'Em Trânsito'
      default: return status
    }
  }
  
  function getStatusInEnglish(status: string) {
    switch (status) {
      case 'Pendente': return 'Pending'
      case 'Processando': return 'Processing'
      case 'Entregue': return 'Delivered'
      case 'Cancelado': return 'Cancelled'
      case 'Em Trânsito': return 'In Transit'
      default: return status
    }
  }
  
  function getStatusClass(status: string) {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Processing': return 'bg-blue-100 text-blue-800'
      case 'Delivered': return 'bg-green-100 text-green-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      case 'In Transit': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Iniciar a edição de um pedido
  function handleEditOrder(order: Order) {
    setEditingOrderId(order.id)
    setSelectedStatus(formatStatus(order.status))
  }
  
  // Cancelar a edição
  function handleCancelEdit() {
    setEditingOrderId(null)
    setSelectedStatus("")
  }
  
  // Salvar as alterações de status
  async function handleSaveStatus(orderId: string) {
    try {
      setIsUpdating(true)
      const englishStatus = getStatusInEnglish(selectedStatus)
      
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: englishStatus }),
      })
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar status')
      }
      
      // Atualizar a lista de pedidos local
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: englishStatus } : order
      )
      
      setOrders(updatedOrders)
      setFilteredOrders(updatedOrders)
      handleCancelEdit()
      
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      alert('Não foi possível atualizar o status do pedido.')
    } finally {
      setIsUpdating(false)
    }
  }

  // Contadores para o sumário
  const pendingCount = orders.filter(order => order.status === 'Pending').length
  const processingCount = orders.filter(order => order.status === 'Processing').length
  const deliveredCount = orders.filter(order => order.status === 'Delivered').length

  // Calculate total sales and total commissions
  const totalSales = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
  const totalCommissions = orders.reduce((sum, order) => {
    const orderCommissions = order.items?.reduce((itemSum, item) => {
      if (item.commission_type === 'percentage') {
        return itemSum + ((item.quantity * (item.sack_weight || 0) * item.unit_price) * (item.commission_value || 0) / 100)
      } else if (item.commission_type === 'fixed') {
        return itemSum + (item.commission_value || 0)
      }
      return itemSum
    }, 0) || 0
    return sum + orderCommissions
  }, 0)
  const avgCommissionPercent = totalSales > 0 ? ((totalCommissions / totalSales) * 100).toFixed(1) : '0.0'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-darkGreen">Pedidos</h1>
        <Button variant="outline" className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Histórico
        </Button>
      </div>
      
      {/* Stats Cards - Moved to top */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-darkGreen">Pedidos Pendentes</h3>
              <p className="text-2xl font-bold text-darkGreen">{pendingCount}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-800" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-darkGreen">Em Processamento</h3>
              <p className="text-2xl font-bold text-darkGreen">{processingCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-blue-800" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-darkGreen">Entregues</h3>
              <p className="text-2xl font-bold text-darkGreen">{deliveredCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-green-800" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-darkGreen">% Médio de Comissão</h3>
              <p className="text-2xl font-bold text-darkGreen">{avgCommissionPercent}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-green-800" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        {/* Header e filtros */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por cliente ou ID..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
        
        {/* Tabela de pedidos */}
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-100 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-100 rounded"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 p-3 bg-red-50 rounded-md">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            {filteredOrders.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-cream/70">
                    <th className="px-4 py-3 text-left text-sm font-medium text-darkGreen">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-darkGreen">Cliente</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-darkGreen">Data</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-darkGreen">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-darkGreen">Total</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-darkGreen">Comissão</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-darkGreen">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream">
                  {filteredOrders.map((order) => {
                    const client = clientsData[order.client_id]
                    const isEditing = editingOrderId === order.id
                    
                    return (
                      <tr key={order.id} className="hover:bg-cream/30">
                        <td className="px-4 py-3 text-sm text-gray-700">#{order.id.substring(0, 8).toUpperCase()}</td>
                        <td className="px-4 py-3 text-sm font-medium text-darkGreen">
                          {client ? (
                            <Link href={`/admin/vendas/cliente/${client.id}`} className="text-mediumGreen hover:underline">
                              {client.name}
                            </Link>
                          ) : (
                            <span className="text-gray-500">Cliente não encontrado</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{new Date(order.order_date).toLocaleDateString("pt-BR")}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          {isEditing ? (
                            <select
                              value={selectedStatus}
                              onChange={(e) => setSelectedStatus(e.target.value)}
                              className="text-xs rounded-md border border-gray-300 py-1 px-2 focus:outline-none focus:ring-2 focus:ring-mediumGreen"
                            >
                              <option value="Pendente">Pendente</option>
                              <option value="Processando">Processando</option>
                              <option value="Em Trânsito">Em Trânsito</option>
                              <option value="Entregue">Entregue</option>
                              <option value="Cancelado">Cancelado</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}
                            >
                              {formatStatus(order.status)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-right text-darkGreen">
                          {formatCurrency(Number(order.total_amount))}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-right text-darkGreen">
                          {order.items && order.items.length > 0
                            ? formatCurrency(order.items.reduce((sum, item) => {
                                const subtotal = item.quantity * (item.sack_weight || 0) * item.unit_price;
                                if (item.commission_type === 'percentage') {
                                  return sum + (subtotal * (item.commission_value || 0)) / 100;
                                } else if (item.commission_type === 'fixed') {
                                  return sum + (item.commission_value || 0);
                                }
                                return sum;
                              }, 0))
                            : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <div className="flex justify-end space-x-2 items-center">
                            {isEditing ? (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleSaveStatus(order.id)}
                                  disabled={isUpdating}
                                  className="h-8 p-1 text-green-600 hover:text-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={handleCancelEdit}
                                  className="h-8 p-1 text-red-600 hover:text-red-700"
                                  disabled={isUpdating}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleEditOrder(order)}
                                  className="h-8 text-mediumGreen hover:text-mediumGreen/80 p-1"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Link href={`/admin/vendas/pedido/${order.id}`}>
                                  <Button variant="link" className="text-mediumGreen h-8 p-1 text-sm">
                                    Detalhes
                                  </Button>
                                </Link>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 bg-cream/30 rounded-lg">
                <p className="text-gray-600">
                  {searchTerm ? "Nenhum pedido encontrado com os critérios de busca." : "Nenhum pedido registrado no sistema."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 