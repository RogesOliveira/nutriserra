import { NextResponse } from "next/server";
import { fetchClientById, deleteClient } from "@/lib/clients";

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

export async function DELETE(
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
    const deleted = await deleteClient(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Falha ao excluir cliente" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Erro ao excluir cliente ${id}:`, error);
    return NextResponse.json(
      { error: "Erro ao excluir cliente" },
      { status: 500 }
    );
  }
} 