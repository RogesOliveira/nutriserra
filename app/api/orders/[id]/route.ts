import { NextResponse } from "next/server";
import { deleteOrder } from "@/lib/orders";

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const ok = await deleteOrder(id);
    if (ok) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Erro ao excluir pedido" }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir pedido" }, { status: 500 });
  }
} 