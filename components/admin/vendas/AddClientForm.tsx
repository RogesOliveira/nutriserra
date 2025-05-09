'use client';

import { useState, FormEvent } from 'react';
import { createClient } from "@/lib/clients";
import { useRouter } from 'next/navigation';

// TODO: Integrar com Supabase para salvar o cliente
// import { createClient } from '@/utils/supabase/client'; // Exemplo

export default function AddClientForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validação básica
    if (!name) {
      setMessage('O nome do cliente é obrigatório.');
      setIsLoading(false);
      return;
    }

    try {
      // Chamar a função createClient da lib/clients
      const result = await createClient({
        name,
        email: email || null,
        phone: phone || null,
        address: address || null
      });

      if (result) {
        setMessage('Cliente adicionado com sucesso!');
        // Limpar formulário
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
        // Forçar um recarregamento da página para atualizar a lista de clientes
        router.refresh();
      } else {
        setMessage('Erro ao adicionar cliente. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      setMessage('Erro ao adicionar cliente. Tente novamente.');
    }

    setIsLoading(false);
  };

  return (
    <div className="p-4 border rounded-md shadow-sm mt-6">
      <h3 className="text-xl font-semibold mb-3">Adicionar Novo Cliente</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
            Nome Completo*
          </label>
          <input
            type="text"
            id="clientName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="clientEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <input
            type="tel"
            id="clientPhone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-700">
            Endereço
          </label>
          <textarea
            id="clientAddress"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mediumGreen hover:bg-mediumGreen/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mediumGreen disabled:bg-gray-400"
          >
            {isLoading ? 'Adicionando...' : 'Adicionar Cliente'}
          </button>
        </div>
        {message && (
          <p className={`text-sm ${message.startsWith('Erro') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
} 