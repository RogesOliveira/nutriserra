'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { fetchClientById } from '@/lib/clients';
import { createOrder } from '@/lib/orders';
import { ProductSelector } from '@/components/admin/product-selector';
import type { Product } from '@/types';

interface OrderItem {
  product_id?: string;
  product_name: string;
  description: string | null;
  quantity: number;
  sack_weight: number;
  unit_price: number;
  commission_type: 'percentage' | 'fixed';
  commission_value: number;
}

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <NewOrderPage />
    </Suspense>
  );
}

function NewOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get('cliente');

  const [client, setClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [orderDate, setOrderDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [items, setItems] = useState<OrderItem[]>([{
    product_id: '',
    product_name: '',
    description: '',
    quantity: 1,
    sack_weight: 50,
    unit_price: 0,
    commission_type: 'percentage',
    commission_value: 0
  }]);
  const [freight, setFreight] = useState<number>(0);
  
  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.sack_weight * item.unit_price), 0) + (freight || 0);

  useEffect(() => {
    const loadClient = async () => {
      if (clientId) {
        try {
          const clientData = await fetchClientById(clientId);
          if (clientData) {
            setClient(clientData);
          } else {
            setMessage('Cliente não encontrado');
            setTimeout(() => router.push('/admin/vendas'), 2000);
          }
        } catch (error) {
          console.error('Erro ao carregar cliente:', error);
          setMessage('Erro ao carregar informações do cliente');
        }
      } else {
        setMessage('ID do cliente não fornecido');
        setTimeout(() => router.push('/admin/vendas'), 2000);
      }
    };

    loadClient();
  }, [clientId, router]);

  const handleAddItem = () => {
    setItems([...items, {
      product_id: '',
      product_name: '',
      description: '',
      quantity: 1,
      sack_weight: 50,
      unit_price: 0,
      commission_type: 'percentage',
      commission_value: 0
    }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'quantity' || field === 'unit_price' || field === 'sack_weight' ? parseFloat(value) || 0 : value
    };
    setItems(newItems);
  };

  const handleProductSelect = (index: number, product: Product | null) => {
    if (product) {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        product_id: product.id,
        product_name: product.name,
        description: product.description,
        sack_weight: product.sackWeight || 50,
        unit_price: product.pricePerKg || 0
      };
      setItems(newItems);
    }
  };

  const calculateCommission = (item: OrderItem): number => {
    const itemTotal = item.quantity * item.sack_weight * item.unit_price;
    
    if (item.commission_type === 'percentage') {
      return (itemTotal * item.commission_value) / 100;
    } else {
      return item.commission_value;
    }
  };

  // Calculate the total commission
  const totalCommission = items.reduce((sum, item) => sum + calculateCommission(item), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId) {
      setMessage('ID do cliente não fornecido');
      return;
    }

    if (items.some(item => !item.product_name)) {
      setMessage('Todos os itens precisam ter um nome de produto');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Format items for API
      const orderItems = items.map(item => ({
        product_name: item.product_name,
        description: item.description,
        quantity: item.quantity,
        sack_weight: item.sack_weight,
        unit_price: item.unit_price,
        commission_type: item.commission_type,
        commission_value: item.commission_value
      }));

      const result = await createOrder({
        client_id: clientId,
        order_date: orderDate,
        status: 'Pending',
        origin: origin || null,
        destination: destination || null,
        notes: notes || null,
        freight: freight || 0
      }, orderItems);

      if (result) {
        setMessage('Pedido criado com sucesso!');
        setTimeout(() => {
          router.push(`/admin/vendas/cliente/${clientId}`);
        }, 1500);
      } else {
        setMessage('Erro ao criar pedido. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      setMessage('Erro ao criar pedido. Tente novamente.');
    }

    setIsLoading(false);
  };

  const toggleCommissionType = (index: number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      commission_type: newItems[index].commission_type === 'percentage' ? 'fixed' : 'percentage'
    };
    setItems(newItems);
  };

  if (!client && !message) {
    return <div className="container mx-auto py-10 px-4">Carregando...</div>;
  }

  if (message && !client) {
    return (
      <div className="container mx-auto py-10 px-4">
        <p className="text-red-500">{message}</p>
        <p>Redirecionando para a lista de clientes...</p>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Novo Pedido para {client?.name}</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="orderDate">
              Data do Pedido
            </label>
            <input
              type="date"
              id="orderDate"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled
            >
              <option value="Pending">Pendente</option>
            </select>
          </div>
        </div>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="origin">
              Local de Saída
            </label>
            <input
              type="text"
              id="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destination">
              Local de Entrega
            </label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="freight">
              Valor do Frete (R$)
            </label>
            <input
              type="number"
              id="freight"
              min="0"
              step="0.01"
              value={freight}
              onChange={e => setFreight(Number(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-w-xs"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
            Observações
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Itens do Pedido</h2>
          
          {items.map((item, index) => (
            <div key={index} className="mb-4 p-4 border rounded bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nome do Produto*
                  </label>
                  <ProductSelector
                    value={item.product_id || ''}
                    onChange={(value) => handleItemChange(index, 'product_id', value)}
                    onProductSelect={(product) => handleProductSelect(index, product)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Descrição
                  </label>
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-2">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Quantidade (Sacas)*
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Peso da Saca (Kg)*
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={item.sack_weight}
                    onChange={(e) => handleItemChange(index, 'sack_weight', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Peso Total (Kg)
                  </label>
                  <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100">
                    {(item.quantity * item.sack_weight).toLocaleString('pt-BR')} kg
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Preço por Kg (R$)*
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Subtotal
                  </label>
                  <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100">
                    {formatCurrency(item.quantity * item.sack_weight * item.unit_price)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Comissão {item.commission_type === 'percentage' ? '(%)' : '(R$)'}
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      min="0"
                      step={item.commission_type === 'percentage' ? '0.01' : '0.01'}
                      value={item.commission_value}
                      onChange={(e) => handleItemChange(index, 'commission_value', e.target.value)}
                      className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    <button
                      type="button"
                      onClick={() => toggleCommissionType(index)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded-r"
                    >
                      {item.commission_type === 'percentage' ? '%' : 'R$'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Valor da Comissão
                  </label>
                  <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100">
                    {formatCurrency(calculateCommission(item))}
                  </div>
                </div>
              </div>
              
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Remover item
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleAddItem}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            + Adicionar Item
          </button>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div>
            <div className="text-xl font-bold mb-2">
              Total do Pedido: {formatCurrency(totalAmount)}
            </div>
            <div className="text-md text-gray-600">
              Total de Comissão: {formatCurrency(totalCommission)}
            </div>
            <div className="text-md text-gray-600">
              Frete: {formatCurrency(freight || 0)}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
          >
            {isLoading ? 'Salvando...' : 'Salvar Pedido'}
          </button>
        </div>
        
        {message && (
          <div className={`mt-4 p-3 rounded ${message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
} 