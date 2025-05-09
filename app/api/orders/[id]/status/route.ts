import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/orders";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { error: "O status é obrigatório" },
        { status: 400 }
      );
    }

    const updatedOrder = await updateOrderStatus(id, status);

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Falha ao atualizar o status do pedido" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Erro ao atualizar status do pedido:", error);
    return NextResponse.json(
      { error: error.message || "Falha ao atualizar o status do pedido" },
      { status: 500 }
    );
  }
} 