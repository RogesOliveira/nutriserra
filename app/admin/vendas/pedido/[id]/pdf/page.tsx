'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchOrderById } from '@/lib/orders';
import { fetchClientById } from '@/lib/clients';
import dynamic from 'next/dynamic';

// Usando dynamic import para bibliotecas de PDF para evitar problemas com SSR
const PDFGenerator = dynamic(() => import('./PDFGenerator'), { 
  ssr: false,
  loading: () => (
    <div className="container mx-auto py-10 px-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Carregando bibliotecas PDF...</h1>
      <p>Por favor, aguarde enquanto preparamos as ferramentas de PDF.</p>
    </div>
  )
});

export default function OrderPdfPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const orderId = params.id as string;
        
        // Buscar dados do pedido e cliente
        const orderData = await fetchOrderById(orderId);
        if (!orderData) {
          setError('Pedido não encontrado');
          setIsLoading(false);
          return;
        }

        const clientData = await fetchClientById(orderData.client_id);
        if (!clientData) {
          setError('Cliente não encontrado');
          setIsLoading(false);
          return;
        }

        setOrder(orderData);
        setClient(clientData);
        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError(`Erro ao carregar dados: ${(err as Error)?.message || 'Erro desconhecido'}`);
        setIsLoading(false);
      }
    };

    loadData();
  }, [params.id]);

  // Redirecionamento para a página do pedido
  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Carregando Dados para PDF...</h1>
        <p>Por favor, aguarde enquanto preparamos o documento.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Erro ao Gerar PDF</h1>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={handleBack} 
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Voltar
        </button>
      </div>
    );
  }

  // Renderiza o componente de geração de PDF com os dados carregados
  return <PDFGenerator order={order} client={client} router={router} />;
} 