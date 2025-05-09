"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Phone, Mail, MapPin, ShoppingBag, FileText, Edit } from "lucide-react"
import Link from "next/link"
import { Client } from "@/lib/clients"
import { Order } from "@/lib/orders"

interface ClientPageProps {
  params: {
    id: string
  }
}

// Helper function to format currency in Brazilian format
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export default function ClientPage({ params }: ClientPageProps) {
  const { id } = params
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadClientData() {
      try {
        // Carregar dados do cliente
        const clientResponse = await fetch(`/api/clients/${id}`)
        if (!clientResponse.ok) {
          if (clientResponse.status === 404) {
            throw new Error("Cliente não encontrado")
          }
          throw new Error("Falha ao carregar dados do cliente")
        }
        const clientData = await clientResponse.json()
        setClient(clientData)

        // Carregar pedidos do cliente
        const ordersResponse = await fetch(`/api/clients/${id}/orders`)
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          setOrders(ordersData)
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err)
        setError(err instanceof Error ? err.message : "Erro ao carregar dados do cliente")
      } finally {
        setIsLoading(false)
      }
    }

    loadClientData()
  }, [id])

  function formatStatus(status: string) {
    switch (status) {
      case 'Pending': return 'Pendente';
      case 'Processing': return 'Processando';
      case 'Delivered': return 'Entregue';
      case 'Cancelled': return 'Cancelado';
      default: return status;
    }
  }
  
  function getStatusClass(status: string) {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse flex items-center justify-between">
          <div className="h-8 bg-gray-100 rounded w-1/4"></div>
          <div className="h-8 bg-gray-100 rounded w-20"></div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-gray-100 rounded"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-darkGreen">Erro</h1>
        </div>
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <p className="text-red-700">{error}</p>
          <Button 
            className="mt-4" 
            variant="outline"
            onClick={() => router.push("/admin/vendas")}
          >
            Voltar para Lista de Clientes
          </Button>
        </div>
      </div>
    )
  }

  if (!client) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-darkGreen">Detalhes do Cliente</h1>
        </div>
        <div className="flex space-x-2">
          <Link href={`/admin/vendas/cliente/${id}/editar`} passHref>
            <Button variant="outline" className="flex items-center">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Link href={`/admin/vendas/pedido/novo?cliente=${id}`} passHref>
            <Button className="bg-mediumGreen hover:bg-mediumGreen/90 flex items-center">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Novo Pedido
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Detalhes do cliente */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start">
          <div className="mr-6 bg-cream p-4 rounded-full">
            <User className="h-10 w-10 text-darkGreen" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-darkGreen mb-2">{client.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {client.email && (
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{client.email}</span>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{client.phone}</span>
                </div>
              )}
              {client.address && (
                <div className="flex items-start text-gray-600 col-span-2">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-1" />
                  <span>{client.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Histórico de pedidos */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-darkGreen">Histórico de Pedidos</h2>
          <Link href={`/admin/vendas/pedido/novo?cliente=${id}`} passHref>
            <Button size="sm" className="bg-mediumGreen hover:bg-mediumGreen/90">
              Novo Pedido
            </Button>
          </Link>
        </div>

        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="bg-cream/70">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-darkGreen">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-darkGreen">Data</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-darkGreen">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-darkGreen">Total</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-darkGreen">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-cream">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream/30">
                    <td className="px-4 py-3 text-sm font-medium text-darkGreen">
                      #{order.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(order.order_date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-right text-darkGreen">
                      {formatCurrency(Number(order.total_amount))}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex space-x-2 justify-end">
                        <Link href={`/admin/vendas/pedido/${order.id}`} passHref>
                          <Button variant="link" className="text-mediumGreen h-auto p-0 text-sm">
                            Detalhes
                          </Button>
                        </Link>
                        <Link href={`/admin/vendas/pedido/${order.id}/print`} passHref>
                          <Button variant="link" className="text-gray-600 h-auto p-0 text-sm flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            PDF
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-cream/30 rounded-lg">
            <p className="text-gray-600 mb-3">Este cliente ainda não possui pedidos.</p>
            <Link href={`/admin/vendas/pedido/novo?cliente=${id}`} passHref>
              <Button className="bg-mediumGreen hover:bg-mediumGreen/90">
                Criar Primeiro Pedido
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 