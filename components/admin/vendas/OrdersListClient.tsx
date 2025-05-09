'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order } from '@/lib/orders';
import { Client } from '@/lib/clients';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Edit, Check, X } from 'lucide-react';

// Helper function to format currency in Brazilian format
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

interface OrdersListClientProps {
  className?: string;
}

type ClientsCache = Record<string, Client | undefined>;

export default function OrdersListClient({ className }: OrdersListClientProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientsData, setClientsData] = useState<ClientsCache>({});
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      try {
        // Carregar pedidos
        const ordersResponse = await fetch('/api/orders');
        if (!ordersResponse.ok) {
          throw new Error('Falha ao carregar pedidos');
        }
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);

        // Carregar dados dos clientes mencionados nos pedidos
        const clientIds = [...new Set(ordersData.map((order: Order) => order.client_id))];
        
        const clientsInfo: ClientsCache = {};
        await Promise.all(
          clientIds.map(async (clientId: any) => {
            try {
              const clientResponse = await fetch(`/api/clients/${clientId}`);
              if (clientResponse.ok) {
                const clientData = await clientResponse.json();
                clientsInfo[clientId] = clientData;
              }
            } catch (err) {
              console.error(`Erro ao carregar cliente ${clientId}:`, err);
            }
          })
        );
        
        setClientsData(clientsInfo);
      } catch (err) {
        console.error('Erro ao carregar pedidos:', err);
        setError('Não foi possível carregar os pedidos. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, []);

  function formatStatus(status: string) {
    switch (status) {
      case 'Pending': return 'Pendente';
      case 'Processing': return 'Processando';
      case 'Delivered': return 'Entregue';
      case 'Cancelled': return 'Cancelado';
      case 'In Transit': return 'Em Trânsito';
      default: return status;
    }
  }
  
  function getStatusInEnglish(status: string) {
    switch (status) {
      case 'Pendente': return 'Pending';
      case 'Processando': return 'Processing';
      case 'Entregue': return 'Delivered';
      case 'Cancelado': return 'Cancelled';
      case 'Em Trânsito': return 'In Transit';
      default: return status;
    }
  }
  
  function getStatusClass(status: string) {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'In Transit': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Iniciar a edição de um pedido
  function handleEditOrder(order: Order) {
    setEditingOrderId(order.id);
    setSelectedStatus(formatStatus(order.status));
  }
  
  // Cancelar a edição
  function handleCancelEdit() {
    setEditingOrderId(null);
    setSelectedStatus('');
  }
  
  // Salvar as alterações de status
  async function handleSaveStatus(orderId: string) {
    try {
      setIsUpdating(true);
      const englishStatus = getStatusInEnglish(selectedStatus);
      
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: englishStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar status');
      }
      
      // Atualizar a lista de pedidos local
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: englishStatus } : order
      );
      
      setOrders(updatedOrders);
      handleCancelEdit();
      
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      alert('Não foi possível atualizar o status do pedido.');
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-100 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-gray-100 rounded"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-3 bg-red-50 rounded-md">{error}</div>;
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-darkGreen">Histórico de Pedidos</h2>
      </div>

      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-cream/70">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-darkGreen">Código</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-darkGreen">Data</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-darkGreen">Cliente</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-darkGreen">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-darkGreen">Total</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-darkGreen">Comissão</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-darkGreen">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-cream">
              {orders.map((order) => {
                const client = clientsData[order.client_id];
                const isEditing = editingOrderId === order.id;
                
                return (
                  <tr key={order.id} className="hover:bg-cream/30">
                    <td className="px-4 py-3 text-sm font-medium text-darkGreen">
                      #{order.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(order.order_date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {client ? (
                        <Link href={`/admin/vendas/cliente/${client.id}`} className="text-mediumGreen hover:underline">
                          {client.name}
                        </Link>
                      ) : (
                        <span className="text-gray-500">Cliente não encontrado</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
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
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
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
                      <div className="flex space-x-2 justify-end">
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
                            <Link href={`/admin/vendas/pedido/${order.id}`} passHref>
                              <Button variant="link" className="text-mediumGreen h-8 p-1 text-sm">
                                Detalhes
                              </Button>
                            </Link>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-cream/30 rounded-lg">
          <p className="text-gray-600 mb-4">Nenhum pedido registrado no sistema.</p>
          <Link href="/admin/vendas/clientes-select" passHref>
            <Button className="bg-mediumGreen hover:bg-mediumGreen/90">
              Cadastrar Primeiro Pedido
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
} 