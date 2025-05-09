import { NextResponse } from "next/server";
import { fetchClientById } from "@/lib/clients";

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
    const client = await fetchClientById(id);
    
    if (!client) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error(`Erro ao buscar cliente ${id}:`, error);
    return NextResponse.json(
      { error: "Falha ao buscar cliente" },
      { status: 500 }
    );
  }
} 