"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Plus, User } from "lucide-react"
import Link from "next/link"
import { Client } from "@/lib/clients"

export default function ClientesSelectPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadClients() {
      try {
        const response = await fetch('/api/clients')
        if (!response.ok) {
          throw new Error("Falha ao carregar clientes")
        }
        const data = await response.json()
        setClients(data)
        setFilteredClients(data)
      } catch (err) {
        console.error("Erro ao carregar clientes:", err)
        setError("Não foi possível carregar a lista de clientes. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    loadClients()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.phone && client.phone.includes(searchTerm))
      )
      setFilteredClients(filtered)
    } else {
      setFilteredClients(clients)
    }
  }, [searchTerm, clients])

  const handleSelectClient = (clientId: string) => {
    router.push(`/admin/vendas/pedido/novo?cliente=${clientId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-darkGreen">Selecionar Cliente</h1>
        </div>
        <Link href="/admin/vendas" passHref>
          <Button variant="outline">
            Cancelar
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link href="/admin/vendas/pedido/novo" passHref>
              <Button className="bg-mediumGreen hover:bg-mediumGreen/90 flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Cliente Avulso
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-600">
            Selecione um cliente para criar um novo pedido ou cadastre um cliente avulso.
          </p>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-md"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 p-3 bg-red-50 rounded-md">{error}</div>
        ) : filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClients.map(client => (
              <div 
                key={client.id} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-cream/30 cursor-pointer transition-colors"
                onClick={() => handleSelectClient(client.id)}
              >
                <div className="flex items-start">
                  <div className="bg-cream p-3 rounded-full mr-3">
                    <User className="h-5 w-5 text-darkGreen" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-darkGreen">{client.name}</h3>
                    {client.email && <p className="text-sm text-gray-600">Email: {client.email}</p>}
                    {client.phone && <p className="text-sm text-gray-600">Telefone: {client.phone}</p>}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-mediumGreen hover:text-mediumGreen/80 hover:bg-cream"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectClient(client.id);
                    }}
                  >
                    Selecionar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-cream/30 rounded-lg">
            <p className="text-gray-600 mb-2">
              {searchTerm 
                ? "Nenhum cliente encontrado com os critérios de busca." 
                : "Nenhum cliente cadastrado."}
            </p>
            <Link href="/admin/vendas" passHref>
              <Button variant="outline" className="mt-2">
                Voltar e Cadastrar Cliente
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 