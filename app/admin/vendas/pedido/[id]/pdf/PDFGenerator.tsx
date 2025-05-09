'use client';

import { useEffect, useState } from 'react';

// Interfaces para tipagem
interface OrderItem {
  id: string;
  product_name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  total_price?: number;
}

interface Order {
  id: string;
  client_id: string;
  order_date: string;
  status: string;
  total_amount: number;
  notes: string | null;
  items?: OrderItem[];
}

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

interface PDFGeneratorProps {
  order: Order;
  client: Client;
  router: any;
}

export default function PDFGenerator({ order, client, router }: PDFGeneratorProps) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const generatePDF = async () => {
      try {
        // Importar as bibliotecas de PDF aqui para garantir que estamos no navegador
        const jsPDFModule = await import('jspdf');
        await import('jspdf-autotable');
        const jsPDF = jsPDFModule.default;
        
        // Criar o documento PDF
        const doc = new jsPDF();
        
        // Adicionar cabeçalho da empresa
        doc.setFillColor(39, 174, 96); // Cor verde corporativa
        doc.rect(0, 0, 210, 30, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('NUTRISERRA', 14, 15);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Soluções Premium de Ração Animal', 75, 15);
        
        // Adicionar informações da empresa
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.text('CNPJ: 12.345.678/0001-90', 14, 35);
        doc.text('Tel: (11) 4321-5678 / (11) 98765-4321', 14, 40);
        doc.text('Email: contato@nutriserra.com.br', 14, 45);
        doc.text('Site: www.nutriserra.com.br', 14, 50);
        
        // Título do documento
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('ORDEM DE SERVIÇO - VENDA', 105, 40, { align: 'center' });
        
        // Número da OS
        doc.setFillColor(220, 220, 220);
        doc.rect(150, 45, 45, 10, 'F');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text('OS Nº:', 152, 51);
        doc.setFont('helvetica', 'bold');
        doc.text(order.id.substring(0, 8).toUpperCase(), 168, 51);
        
        // Dados do cliente (caixa)
        doc.setFillColor(240, 240, 240);
        doc.rect(14, 60, 180, 35, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('DADOS DO CLIENTE', 16, 67);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('Nome:', 16, 74);
        doc.text('Email:', 16, 80);
        doc.text('Telefone:', 16, 86);
        doc.text('Endereço:', 16, 92);
        
        doc.setFont('helvetica', 'bold');
        doc.text(client.name, 40, 74);
        doc.text(client.email || '-', 40, 80);
        doc.text(client.phone || '-', 40, 86);
        doc.text(client.address || '-', 40, 92);
        
        // Data e Status (caixa)
        doc.setFillColor(240, 240, 240);
        doc.rect(14, 100, 180, 20, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('INFORMAÇÕES DO PEDIDO', 16, 107);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('Data do Pedido:', 16, 114);
        doc.text('Status:', 100, 114);
        
        doc.setFont('helvetica', 'bold');
        doc.text(new Date(order.order_date).toLocaleDateString('pt-BR'), 60, 114);
        
        // Aplicar cor ao status baseado no valor
        if (order.status === 'Pending') {
          doc.setTextColor(243, 156, 18); // Amarelo para pendente
        } else if (order.status === 'Processing') {
          doc.setTextColor(52, 152, 219); // Azul para processando
        } else if (order.status === 'Delivered') {
          doc.setTextColor(46, 204, 113); // Verde para entregue
        } else if (order.status === 'Cancelled') {
          doc.setTextColor(231, 76, 60); // Vermelho para cancelado
        }
        
        doc.text(order.status, 125, 114);
        doc.setTextColor(0, 0, 0); // Resetar cor
        
        // Itens do Pedido
        if (order.items && order.items.length > 0) {
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.text('ITENS DO PEDIDO', 14, 130);
          
          const tableColumn = ['Item', 'Descrição', 'Qtde', 'Preço Unit. (R$)', 'Subtotal (R$)'];
          const tableRows = order.items.map((item, idx) => [
            (idx + 1).toString(),
            item.product_name + (item.description ? `\n${item.description}` : ''),
            item.quantity.toString(),
            item.unit_price.toFixed(2),
            (item.total_price || (item.quantity * item.unit_price)).toFixed(2)
          ]);
          
          // Usar autoTable diretamente do objeto doc, com cast para any para evitar erro de tipo
          (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 135,
            theme: 'grid',
            styles: { fontSize: 9, cellPadding: 3 },
            headStyles: { 
              fillColor: [39, 174, 96],
              textColor: [255, 255, 255],
              fontStyle: 'bold'
            },
            columnStyles: {
              0: { cellWidth: 15 }, // Item
              1: { cellWidth: 'auto' }, // Descrição
              2: { cellWidth: 20, halign: 'center' }, // Qtde
              3: { cellWidth: 30, halign: 'right' }, // Preço Unit
              4: { cellWidth: 30, halign: 'right' }  // Subtotal
            },
            alternateRowStyles: {
              fillColor: [240, 240, 240]
            },
            margin: { left: 14, right: 14 }
          });
          
          // Adicionar total após a tabela
          const finalY = (doc as any).lastAutoTable.finalY + 5;
          
          // Caixa para o total
          doc.setFillColor(39, 174, 96, 0.1);
          doc.rect(124, finalY, 70, 10, 'F');
          
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text('TOTAL:', 130, finalY + 7);
          doc.text('R$ ' + order.total_amount.toFixed(2), 180, finalY + 7, { align: 'right' });
          
          // Adicionar observações se existirem
          let observacoesY = finalY + 20;
          
          if (order.notes) {
            doc.setFillColor(240, 240, 240);
            doc.rect(14, observacoesY, 180, 25, 'F');
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.text('OBSERVAÇÕES', 16, observacoesY + 7);
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            
            // Quebrar observações em linhas se for muito longo
            const splitNotes = doc.splitTextToSize(order.notes, 170);
            doc.text(splitNotes, 16, observacoesY + 15);
            
            observacoesY += 30;
          }
          
          // Área de assinaturas
          observacoesY += 15;
          doc.line(30, observacoesY, 90, observacoesY); // Linha para assinatura
          doc.line(120, observacoesY, 180, observacoesY); // Linha para assinatura
          
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.text('Assinatura do Cliente', 60, observacoesY + 5, { align: 'center' });
          doc.text('Assinatura da Empresa', 150, observacoesY + 5, { align: 'center' });
          
          // Rodapé
          const pageCount = doc.getNumberOfPages();
          
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            // Linha divisória
            doc.setDrawColor(39, 174, 96);
            doc.setLineWidth(0.5);
            doc.line(14, doc.internal.pageSize.height - 25, 195, doc.internal.pageSize.height - 25);
            
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(
              'NutriSerra - Soluções Premium de Ração Animal | CNPJ: 12.345.678/0001-90',
              doc.internal.pageSize.width / 2,
              doc.internal.pageSize.height - 18,
              { align: 'center' }
            );
            doc.text(
              'Este documento não possui valor fiscal. Emitido em: ' + 
              new Date().toLocaleDateString('pt-BR') + ' às ' + 
              new Date().toLocaleTimeString('pt-BR'),
              doc.internal.pageSize.width / 2,
              doc.internal.pageSize.height - 14,
              { align: 'center' }
            );
            doc.text(
              `Página ${i} de ${pageCount}`,
              doc.internal.pageSize.width - 20,
              doc.internal.pageSize.height - 10,
              { align: 'right' }
            );
          }
          
          // Salvar o PDF
          doc.save(`OS_NutriSerra_${order.id.substring(0, 8)}.pdf`);
          
          // Definir sucesso
          setSuccess(true);
          
          // Redirecionar após 1 segundo
          setTimeout(() => {
            router.push(`/admin/vendas/pedido/${order.id}`);
          }, 1500);
        } else {
          throw new Error('Não há itens no pedido');
        }
      } catch (err) {
        console.error('Erro ao gerar PDF:', err);
        setError(`${(err as Error)?.message || 'Erro desconhecido'}`);
      }
    };

    generatePDF();
  }, [order, client, router]);

  if (error) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Erro ao Gerar PDF</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-600">Ordem de Serviço Gerada com Sucesso!</h1>
        <p>O download do seu PDF foi iniciado. Redirecionando de volta ao pedido...</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Gerando PDF da Ordem de Serviço...</h1>
      <p>Por favor, aguarde enquanto o documento é preparado.</p>
    </div>
  );
} 