'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Client } from '@/lib/clients';
import { Trash2 } from 'lucide-react';

interface ClientListClientProps {
  className?: string;
  searchTerm?: string;
}

export default function ClientListClient({ className, searchTerm = '' }: ClientListClientProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClients() {
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) {
          throw new Error('Falha ao carregar clientes');
        }
        const data = await response.json();
        setClients(data);
      } catch (err) {
        console.error('Erro ao carregar clientes:', err);
        setError('Não foi possível carregar a lista de clientes. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    }

    loadClients();
  }, []);

  const handleDelete = async (clientId: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        const response = await fetch(`/api/clients/${clientId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao excluir cliente');
        setClients((prev) => prev.filter((c) => c.id !== clientId));
      } catch (err) {
        alert('Erro ao excluir cliente.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-md"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-3 bg-red-50 rounded-md">{error}</div>;
  }

  return (
    <div className={className}>
      <h3 className="text-xl font-semibold mb-4 text-darkGreen">Lista de Clientes</h3>
      {clients && clients.length > 0 ? (
        <ul className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {clients
            .filter(client => client.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((client) => (
              <li key={client.id} className="p-3 border rounded-md hover:bg-cream/30 border-gray-200 relative">
                <button
                  className="absolute top-2 right-2 p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                  title="Excluir cliente"
                  onClick={() => handleDelete(client.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <p className="font-medium text-darkGreen">{client.name}</p>
                {client.email && <p className="text-sm text-gray-600">Email: {client.email}</p>}
                {client.phone && <p className="text-sm text-gray-600">Telefone: {client.phone}</p>}
                {client.address && <p className="text-sm text-gray-600">Endereço: {client.address}</p>}
                <div className="mt-2 flex space-x-2">
                  <Link
                    href={`/admin/vendas/cliente/${client.id}`}
                    className="px-2 py-1 bg-mediumGreen text-white rounded text-xs hover:bg-mediumGreen/90"
                  >
                    Ver Detalhes
                  </Link>
                  <Link
                    href={`/admin/vendas/pedido/novo?cliente=${client.id}`}
                    className="px-2 py-1 bg-gold text-white rounded text-xs hover:bg-gold/90"
                  >
                    Novo Pedido
                  </Link>
                </div>
              </li>
            ))}
        </ul>
      ) : (
        <p className="text-gray-500 py-3">Nenhum cliente cadastrado.</p>
      )}
    </div>
  );
} 