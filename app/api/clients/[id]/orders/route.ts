import { NextResponse } from "next/server";
import { fetchOrdersByClientId } from "@/lib/orders";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "ID do cliente não fornecido" },
      { status: 400 }
    );
  }

  try {
    const orders = await fetchOrdersByClientId(id);
    return NextResponse.json(orders);
  } catch (error) {
    console.error(`Erro ao buscar pedidos do cliente ${id}:`, error);
    return NextResponse.json(
      { error: "Falha ao buscar pedidos do cliente" },
      { status: 500 }
    );
  }
} 