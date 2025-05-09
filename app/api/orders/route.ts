import { NextResponse } from "next/server";
import { fetchOrders } from "@/lib/orders";

export async function GET() {
  try {
    const orders = await fetchOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json(
      { error: "Falha ao buscar pedidos" },
      { status: 500 }
    );
  }
} 