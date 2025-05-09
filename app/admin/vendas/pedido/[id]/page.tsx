"use client"

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { fetchOrderById, Order } from "@/lib/orders";
import { fetchClientById } from "@/lib/clients";
import type { Client } from "@/lib/clients";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2pdf from 'html2pdf.js';
import Image from 'next/image';

interface OrderPageProps {
  params: {
    id: string;
  };
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

export default function OrderPage({ params }: OrderPageProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const orderData = await fetchOrderById(params.id);
      setOrder(orderData);
      if (orderData) {
        const clientData = await fetchClientById(orderData.client_id);
        setClient(clientData);
      }
    }
    loadData();
  }, [params.id]);

  async function handleDelete() {
    if (order && confirm("Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.")) {
      const res = await fetch(`/api/orders/${order.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/vendas");
      } else {
        alert("Erro ao excluir pedido.");
      }
    }
  }

  async function handleDownloadPDF() {
    if (!order || !client) return;
    setPdfLoading(true);
    try {
      if (printRef.current) {
        await html2pdf().set({
          margin: 0,
          filename: `OS_NutriSerra_${order.id.substring(0, 8)}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all'] }
        }).from(printRef.current).save();
      }
    } catch (err) {
      alert('Erro ao gerar PDF: ' + (err as Error)?.message);
    }
    setPdfLoading(false);
  }

  if (!order) {
    return <div className="p-8 text-center text-gray-500">Carregando pedido...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Detalhes do Pedido</h1>
        <div className="space-x-2 flex items-center">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={pdfLoading}
          >
            Gerar PDF
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded flex items-center"
            title="Excluir Pedido"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Modal de Preview do Orçamento */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 8, maxWidth: '800px', width: '100%', maxHeight: '95vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', position: 'relative', padding: 24 }}>
            <button
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: 12, right: 16, background: 'transparent', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}
              aria-label="Fechar"
            >
              ×
            </button>
            <div ref={printRef} style={{ background: 'white', color: 'black', width: '210mm', padding: 24, margin: '0 auto', boxSizing: 'border-box' }}>
              <div style={{ borderBottom: '2px solid #27ae60', marginBottom: 16, paddingBottom: 8, position: 'relative', minHeight: 56 }}>
                {/* Barra verde atrás da logo */}
                <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 48, background: '#18311E', zIndex: 1, borderRadius: 4 }} />
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0, paddingTop: 4 }}>
                  <Image src="/images/nutriserralogodupla.png" alt="Nutriserra Logo" width={162} height={36} style={{ height: 36, width: 'auto', marginLeft: 10 }} />
                  <div style={{ textAlign: 'left', marginTop: 4 }}>
                    <div style={{ fontSize: 14 }}>Soluções Premium de Ração Animal</div>
                    <div style={{ fontSize: 12, marginTop: 2 }}>CNPJ: 12.345.678/0001-90 | Tel: (11) 4321-5678 / (11) 98765-4321 | Email: contato@nutriserra.com.br</div>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Ordem de Serviço - Venda</h3>
                <div style={{ fontSize: 13 }}><b>OS Nº:</b> {order?.id?.substring(0, 8).toUpperCase()}</div>
                <div style={{ fontSize: 13 }}><b>Data:</b> {order && new Date(order.order_date).toLocaleDateString('pt-BR')}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Dados do Cliente</h4>
                <div style={{ fontSize: 13 }}><b>Nome:</b> {client?.name}</div>
                <div style={{ fontSize: 13 }}><b>Telefone:</b> {client?.phone || '-'}</div>
                <div style={{ fontSize: 13 }}><b>Endereço:</b> {client?.address || '-'}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Informações do Pedido</h4>
                <div style={{ fontSize: 13 }}><b>Local de Saída:</b> {order?.origin || '-'}</div>
                <div style={{ fontSize: 13 }}><b>Local de Entrega:</b> {order?.destination || '-'}</div>
                <div style={{ fontSize: 13 }}><b>Observações:</b> {order?.notes || '-'}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Itens do Pedido</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#27ae60', color: 'white' }}>
                      <th style={{ padding: 6, border: '1px solid #ddd' }}>#</th>
                      <th style={{ padding: 6, border: '1px solid #ddd' }}>Produto</th>
                      <th style={{ padding: 6, border: '1px solid #ddd' }}>Descrição</th>
                      <th style={{ padding: 6, border: '1px solid #ddd' }}>Qtde</th>
                      <th style={{ padding: 6, border: '1px solid #ddd' }}>Peso Saca (Kg)</th>
                      <th style={{ padding: 6, border: '1px solid #ddd' }}>Preço por Kg</th>
                      <th style={{ padding: 6, border: '1px solid #ddd' }}>Preço Unit. (R$)</th>
                      <th style={{ padding: 6, border: '1px solid #ddd' }}>Subtotal (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order?.items?.map((item, idx) => (
                      <tr key={item.id}>
                        <td style={{ padding: 6, border: '1px solid #ddd', textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ padding: 6, border: '1px solid #ddd' }}>{item.product_name}</td>
                        <td style={{ padding: 6, border: '1px solid #ddd' }}>{item.description || '-'}</td>
                        <td style={{ padding: 6, border: '1px solid #ddd', textAlign: 'center' }}>{item.quantity}</td>
                        <td style={{ padding: 6, border: '1px solid #ddd', textAlign: 'center' }}>{item.sack_weight || '-'}</td>
                        <td style={{ padding: 6, border: '1px solid #ddd', textAlign: 'right' }}>{item.unit_price ? (item.unit_price / (item.sack_weight || 1)).toFixed(2) : '-'}</td>
                        <td style={{ padding: 6, border: '1px solid #ddd', textAlign: 'right' }}>{item.unit_price.toFixed(2)}</td>
                        <td style={{ padding: 6, border: '1px solid #ddd', textAlign: 'right' }}>{((item.quantity * (item.sack_weight || 0) * item.unit_price)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#f4f4f4' }}>
                      <td colSpan={7} style={{ padding: 6, border: '1px solid #ddd', textAlign: 'right', fontSize: 11, color: '#444' }}>Valor do Frete</td>
                      <td style={{ padding: 6, border: '1px solid #ddd', textAlign: 'right', fontSize: 11, color: '#444' }}>{order && (order as any).freight ? (order as any).freight.toFixed(2) : '0.00'}</td>
                    </tr>
                    <tr style={{ background: '#f4f4f4', fontWeight: 700 }}>
                      <td colSpan={7} style={{ padding: 6, border: '1px solid #ddd', textAlign: 'right' }}>Total</td>
                      <td style={{ padding: 6, border: '1px solid #ddd', textAlign: 'right' }}>{order && order.total_amount ? order.total_amount.toFixed(2) : '0.00'}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ borderTop: '1px solid #aaa', width: 180, textAlign: 'center', paddingTop: 8, fontSize: 12 }}>Assinatura do Cliente</div>
                <div style={{ borderTop: '1px solid #aaa', width: 180, textAlign: 'center', paddingTop: 8, fontSize: 12 }}>Assinatura da Empresa</div>
              </div>
              <div style={{ marginTop: 32, textAlign: 'center', fontSize: 10, color: '#888' }}>
                NutriSerra - Soluções Premium de Ração Animal | CNPJ: 12.345.678/0001-90<br />
                Este orçamento é válido por 2 dias úteis.<br />
                Emitido em: {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                disabled={pdfLoading}
              >
                {pdfLoading ? 'Baixando...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Informações do Pedido</h2>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">ID do Pedido</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.id}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Data</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(order.order_date).toLocaleDateString('pt-BR')}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Total</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-bold">
                  {formatCurrency(order.total_amount)}
                </dd>
              </div>
              {order.notes && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Observações</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.notes}</dd>
                </div>
              )}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Local de Saída</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.origin || '-'}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Local de Entrega</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{order.destination || '-'}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Informações do Cliente</h2>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              {client && (
                <>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Nome</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{client.name}</dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{client.phone || "-"}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Endereço</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{client.address || "-"}</dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Itens do Pedido</h2>
        </div>
        <div className="border-t border-gray-200">
          {order.items && order.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peso Saca (Kg)
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço por Kg
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço Unit. (R$)
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % Comissão
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comissão
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => {
                    const subtotal = item.quantity * (item.sack_weight || 0) * item.unit_price;
                    let commission = 0;
                    if (item.commission_type === 'percentage') {
                      commission = (subtotal * (item.commission_value || 0)) / 100;
                    } else if (item.commission_type === 'fixed') {
                      commission = item.commission_value || 0;
                    }
                    return (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.product_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {item.description || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {item.sack_weight || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {item.unit_price ? (item.unit_price / (item.sack_weight || 1)).toFixed(2) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {formatCurrency(item.unit_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          {formatCurrency(subtotal)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {item.commission_type === 'percentage' ? `${item.commission_value || 0}%` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {formatCurrency(commission)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <th colSpan={8} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      Total
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </th>
                  </tr>
                  <tr className="bg-gray-50">
                    <th colSpan={8} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      Total de Comissão
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      {formatCurrency(order.items && order.items.length > 0 ? order.items.reduce((sum, item) => {
                        const subtotal = item.quantity * (item.sack_weight || 0) * item.unit_price;
                        if (item.commission_type === 'percentage') {
                          return sum + (subtotal * (item.commission_value || 0)) / 100;
                        } else if (item.commission_type === 'fixed') {
                          return sum + (item.commission_value || 0);
                        }
                        return sum;
                      }, 0) : 0)}
                    </th>
                  </tr>
                  <tr className="bg-gray-50">
                    <th colSpan={8} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      Valor do Frete
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      {formatCurrency((order as any).freight || 0)}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">
              Nenhum item encontrado para este pedido.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 