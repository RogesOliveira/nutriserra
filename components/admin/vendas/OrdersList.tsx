import { fetchOrders, Order } from "@/lib/orders";
import { fetchClientById } from "@/lib/clients";
import Link from "next/link";

// Helper function to format currency in Brazilian format
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export default async function OrdersList() {
  // Buscar todos os pedidos do sistema
  const orders = await fetchOrders();
  
  // Objeto para armazenar os dados dos clientes
  const clientsCache: Record<string, any> = {};
  
  // Buscar dados dos clientes para cada pedido (otimizado para não repetir requisições)
  for (const order of orders) {
    if (!clientsCache[order.client_id]) {
      clientsCache[order.client_id] = await fetchClientById(order.client_id);
    }
  }

  return (
    <div className="border rounded-md shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Histórico de Pedidos</h3>
        <div>
          <Link 
            href="/admin/vendas/clientes-select"
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm"
          >
            Novo Pedido
          </Link>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => {
                const client = clientsCache[order.client_id];
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.order_date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {client ? (
                        <Link href={`/admin/vendas/cliente/${client.id}`} className="text-blue-600 hover:text-blue-800">
                          {client.name}
                        </Link>
                      ) : (
                        "Cliente não encontrado"
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'Pending' ? 'Pendente' :
                         order.status === 'Processing' ? 'Processando' :
                         order.status === 'Delivered' ? 'Entregue' :
                         order.status === 'Cancelled' ? 'Cancelado' :
                         order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/admin/vendas/pedido/${order.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Ver Detalhes
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">Nenhum pedido registrado no sistema.</p>
      )}
    </div>
  );
} 