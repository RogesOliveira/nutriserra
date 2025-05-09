import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Leaf, Mail, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-darkGreen text-cream p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-mediumGreen" />
            <span className="text-cream font-bold text-xl">Nutriserra</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-darkGreen mb-8">Entre em Contato</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-semibold text-darkGreen mb-4">Envie uma Mensagem</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <Input id="name" placeholder="Seu nome completo" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <Input id="email" type="email" placeholder="seu@email.com" required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <Input id="phone" placeholder="(00) 00000-0000" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Assunto
                </label>
                <Input id="subject" placeholder="Assunto da mensagem" required />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <Textarea id="message" placeholder="Sua mensagem" rows={5} required />
              </div>
              <Button type="submit" className="w-full bg-mediumGreen hover:bg-mediumGreen/90">
                Enviar Mensagem
              </Button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-darkGreen mb-4">Informações de Contato</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-lightGreen p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-darkGreen" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-darkGreen">Endereço</h3>
                    <p className="text-gray-600">Av. Nutriserra, 1234</p>
                    <p className="text-gray-600">Bairro Industrial - Cidade/UF</p>
                    <p className="text-gray-600">CEP: 00000-000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-lightGreen p-3 rounded-full">
                    <Phone className="h-6 w-6 text-darkGreen" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-darkGreen">Telefone</h3>
                    <p className="text-gray-600">(00) 1234-5678</p>
                    <p className="text-gray-600">(00) 98765-4321 (WhatsApp)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-lightGreen p-3 rounded-full">
                    <Mail className="h-6 w-6 text-darkGreen" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-darkGreen">E-mail</h3>
                    <p className="text-gray-600">contato@nutriserra.com.br</p>
                    <p className="text-gray-600">vendas@nutriserra.com.br</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-darkGreen mb-3">Horário de Atendimento</h3>
                <p className="text-gray-600">Segunda a Sexta: 8h às 18h</p>
                <p className="text-gray-600">Sábado: 8h às 12h</p>
                <p className="text-gray-600">Domingo e Feriados: Fechado</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-darkGreen text-cream py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Nutriserra</h3>
              <p className="text-sm">Soluções Premium de Ração Animal</p>
            </div>
            <div className="text-sm">
              <p>© {new Date().getFullYear()} Nutriserra. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
