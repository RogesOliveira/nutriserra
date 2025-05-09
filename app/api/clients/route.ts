import { NextResponse } from "next/server";
import { fetchClients } from "@/lib/clients";

export async function GET() {
  try {
    const clients = await fetchClients();
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { error: "Falha ao buscar clientes" },
      { status: 500 }
    );
  }
} 