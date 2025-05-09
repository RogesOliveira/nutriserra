// TODO: Implementar a busca de clientes do Supabase
// import { createClient } from '@/utils/supabase/server'; // Exemplo de importação

import { fetchClients, Client } from "@/lib/clients";
import Link from "next/link";

// Interface do cliente já definida na lib/clients, não é necessário redefinir aqui

export default async function ClientList() {
  // Buscar clientes do Supabase
  const clients = await fetchClients();
  
  return (
    <div className="p-4 border rounded-md shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Lista de Clientes</h3>
      {clients && clients.length > 0 ? (
        <ul className="space-y-2">
          {clients.map((client) => (
            <li key={client.id} className="p-3 border rounded-md hover:bg-gray-50">
              <p className="font-medium">{client.name}</p>
              {client.email && <p className="text-sm text-gray-600">Email: {client.email}</p>}
              {client.phone && <p className="text-sm text-gray-600">Telefone: {client.phone}</p>}
              {client.address && <p className="text-sm text-gray-600">Endereço: {client.address}</p>}
              <div className="mt-2 flex space-x-2">
                <Link
                  href={`/admin/vendas/cliente/${client.id}`}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                >
                  Ver Detalhes
                </Link>
                <Link
                  href={`/admin/vendas/pedido/novo?cliente=${client.id}`}
                  className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                >
                  Novo Pedido
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Nenhum cliente cadastrado.</p>
      )}
    </div>
  );
} 