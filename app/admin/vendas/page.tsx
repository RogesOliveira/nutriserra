"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search, FileText, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import ClientListClient from "@/components/admin/vendas/ClientListClient"
import AddClientForm from "@/components/admin/vendas/AddClientForm"
import OrdersListClient from "@/components/admin/vendas/OrdersListClient"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { fetchOrders } from "@/lib/orders"
import { fetchProducts } from "@/lib/products"
import type { Order } from "@/lib/orders"
import type { Product } from "@/types"
import { fetchClients } from "@/lib/clients"
import { ChartContainer } from "@/components/ui/chart"
import type { Client } from "@/lib/clients"

export default function VendasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [open, setOpen] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [filter, setFilter] = useState({ start: "", end: "" })
  const [showChart, setShowChart] = useState(false)

  useEffect(() => {
    if (open) {
      fetchOrders().then(setOrders)
      fetchProducts().then(setProducts)
      fetchClients().then(setClients)
      setShowChart(false)
      setTimeout(() => setShowChart(true), 150)
    } else {
      setShowChart(false)
    }
  }, [open])

  // Filtragem de pedidos por data
  const filteredOrders = orders.filter(order => {
    if (!filter.start && !filter.end) return true
    const orderDate = new Date(order.order_date)
    const start = filter.start ? new Date(filter.start) : null
    const end = filter.end ? new Date(filter.end) : null
    if (start && orderDate < start) return false
    if (end && orderDate > end) return false
    return true
  })

  // Cálculo de lucro bruto, líquido e % comissão
  const grossProfit = filteredOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
  const netProfit = filteredOrders.reduce((sum, order) => {
    if (!order.items) return sum
    return sum + order.items.reduce((itemSum, item) => {
      const subtotal = item.quantity * (item.sack_weight || 0) * item.unit_price
      if (item.commission_type === 'percentage') {
        return itemSum + (subtotal * (item.commission_value || 0)) / 100
      } else if (item.commission_type === 'fixed') {
        return itemSum + (item.commission_value || 0)
      }
      return itemSum
    }, 0)
  }, 0)
  const commissionPercent = grossProfit > 0 ? ((netProfit / grossProfit) * 100).toFixed(1) : '0.0'

  // Preparar dados para o gráfico
  const dateMap: Record<string, { bruto: number, liquido: number }> = {}
  filteredOrders.forEach(order => {
    const date = new Date(order.order_date).toLocaleDateString('pt-BR')
    if (!dateMap[date]) dateMap[date] = { bruto: 0, liquido: 0 }
    dateMap[date].bruto += order.total_amount || 0
    if (order.items) {
      dateMap[date].liquido += order.items.reduce((itemSum, item) => {
        const subtotal = item.quantity * (item.sack_weight || 0) * item.unit_price
        if (item.commission_type === 'percentage') {
          return itemSum + (subtotal * (item.commission_value || 0)) / 100
        } else if (item.commission_type === 'fixed') {
          return itemSum + (item.commission_value || 0)
        }
        return itemSum
      }, 0)
    }
  })
  const chartData = Object.entries(dateMap).map(([date, values]) => ({ date, bruto: values.bruto, liquido: values.liquido }))

  console.log('chartData', chartData)

  // Pedidos por cliente
  const ordersByClient: Record<string, Order[]> = {}
  filteredOrders.forEach(order => {
    if (!ordersByClient[order.client_id]) ordersByClient[order.client_id] = []
    ordersByClient[order.client_id].push(order)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-darkGreen">Gestão de Vendas</h1>
        <div className="flex gap-2">
          <Link href="/admin/vendas/clientes-select" passHref>
            <Button className="bg-mediumGreen hover:bg-mediumGreen/90 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Novo Pedido
            </Button>
          </Link>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Relatórios
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full">
              <div className="max-h-[80vh] overflow-y-auto p-1">
                <DialogHeader>
                  <DialogTitle>Relatórios de Vendas</DialogTitle>
                </DialogHeader>
                {/* Filtros */}
                <div className="flex gap-4 mb-4 flex-wrap">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Data Inicial</label>
                    <input type="date" className="border rounded p-2" value={filter.start} onChange={e => setFilter(f => ({ ...f, start: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Data Final</label>
                    <input type="date" className="border rounded p-2" value={filter.end} onChange={e => setFilter(f => ({ ...f, end: e.target.value }))} />
                  </div>
                </div>
                {/* Resumo */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-2">Resumo de Vendas</h3>
                  <div className="flex gap-8 flex-wrap">
                    <div>
                      <div className="text-2xl font-bold text-darkGreen">{filteredOrders.length}</div>
                      <div>Total de Pedidos</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-darkGreen">R$ {grossProfit.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
                      <div>Valor Total</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-darkGreen">R$ {netProfit.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
                      <div>Lucro Líquido (Comissões)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-darkGreen">{commissionPercent}%</div>
                      <div>% Comissão</div>
                    </div>
                  </div>
                </div>
                {/* Gráfico */}
                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-2">Histórico de Lucro Bruto e Líquido</h3>
                  {chartData.length === 0 ? (
                    <div className="text-gray-500 text-sm py-8 text-center">Nenhum dado para exibir no gráfico neste período.</div>
                  ) : showChart ? (
                    <div className="w-full flex">
                      <ChartContainer config={{ bruto: { label: 'Bruto', color: '#27ae60' }, liquido: { label: 'Líquido', color: '#f1c40f' } }} style={{ width: '100%', minHeight: 350, height: 350, maxWidth: '100%' }}>
                        {(({
                          LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid
                        }: any) => (
                          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="bruto" stroke="#27ae60" name="Bruto" />
                            <Line type="monotone" dataKey="liquido" stroke="#f1c40f" name="Líquido" />
                          </LineChart>
                        )) as any}
                      </ChartContainer>
                    </div>
                  ) : null}
                </div>
                {/* Lista de clientes e pedidos */}
                <div className="mb-8">
                  <h3 className="font-bold text-lg mb-2">Clientes e Pedidos</h3>
                  <div className="space-y-4">
                    {clients.map(client => (
                      <div key={client.id} className="border rounded p-3 bg-cream/30">
                        <div className="font-semibold text-darkGreen">{client.name}</div>
                        <div className="text-xs text-gray-600">{client.email} {client.phone ? `| ${client.phone}` : ''}</div>
                        <div className="mt-2 ml-2">
                          {ordersByClient[client.id] && ordersByClient[client.id].length > 0 ? (
                            <ul className="list-disc ml-4">
                              {ordersByClient[client.id].map(order => (
                                <li key={order.id} className="mb-1">
                                  <span className="font-mono text-xs">#{order.id.substring(0,8).toUpperCase()}</span> - {new Date(order.order_date).toLocaleDateString('pt-BR')} - <span className="text-darkGreen font-semibold">R$ {order.total_amount.toLocaleString('pt-BR', {minimumFractionDigits:2})}</span> - <span className="text-xs">{order.status}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-xs text-gray-400">Nenhum pedido no período.</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Lista de produtos cadastrados */}
                <div>
                  <h3 className="font-bold text-lg mb-2">Itens Cadastrados</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(product => (
                      <div key={product.id} className="flex items-center gap-4 border rounded p-2 bg-cream/40">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                        <div>
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-sm text-gray-600">{product.description}</div>
                          <div className="text-sm text-darkGreen font-bold">R$ {product.pricePerKg?.toLocaleString('pt-BR', {minimumFractionDigits:2})} / kg</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Lista de Clientes (2/3 da largura em desktop) */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar cliente..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <ClientListClient searchTerm={searchTerm} />
        </div>
        
        {/* Formulário de adicionar cliente (1/3 da largura em desktop) */}
        <div className="bg-white rounded-lg shadow p-6">
          <AddClientForm />
        </div>
      </div>
      
      {/* Seção de Pedidos */}
      <div className="bg-white rounded-lg shadow p-6">
        <OrdersListClient />
      </div>
    </div>
  )
} 