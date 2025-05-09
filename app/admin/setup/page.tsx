"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, DollarSign, Info, Database } from "lucide-react"
import { AdminProductList } from "@/components/admin/admin-product-list"
import { AdminProductForm } from "@/components/admin/admin-product-form"
import { BulkPriceEditor } from "@/components/admin/bulk-price-editor"
import type { Product } from "@/types"
import { products as localProducts } from "@/data/products"
import { fetchProducts, updateProduct, createProduct, deleteProduct } from "@/lib/products"

export default function SetupPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"products" | "database">("products")
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isBulkPriceEditorOpen, setIsBulkPriceEditorOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const sqlScript = `-- Criar a tabela de produtos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_per_kg DECIMAL(10, 2) NOT NULL,
  price_per_sack DECIMAL(10, 2) NOT NULL,
  sack_weight INTEGER NOT NULL,
  image TEXT NOT NULL,
  animal_type TEXT NOT NULL,
  sub_type TEXT,
  benefits TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar índices para melhorar a performance
CREATE INDEX IF NOT EXISTS idx_products_animal_type ON public.products(animal_type);
CREATE INDEX IF NOT EXISTS idx_products_sub_type ON public.products(sub_type);`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    // Verificar se já está autenticado
    const isAuth = localStorage.getItem("admin-auth") === "true"
    if (!isAuth) {
      router.push("/admin")
      return
    }

    // Carregar produtos
    loadProducts()
  }, [router])

  const loadProducts = async () => {
    setIsLoading(true)
    try {
      // Fetch products from Supabase
      const fetchedProducts = await fetchProducts()
      setProducts(fetchedProducts)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      // Usar produtos locais como fallback
      setProducts(localProducts)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsFormOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsFormOpen(true)
  }

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        // Delete from Supabase
        const success = await deleteProduct(productId)
        if (success) {
          setProducts(products.filter((p) => p.id !== productId))
          alert("Produto excluído com sucesso!")
        } else {
          throw new Error("Falha ao excluir produto")
        }
      } catch (error) {
        console.error("Erro ao excluir produto:", error)
        alert("Erro ao excluir produto. Verifique o console para mais detalhes.")
      }
    }
  }

  const handleToggleAnimalNames = async (product: Product, showAnimalNames: boolean) => {
    try {
      const updatedProduct = await updateProduct({
        ...product,
        showAnimalNames
      });
      
      if (updatedProduct) {
        setProducts(products.map(p => p.id === product.id ? { ...p, showAnimalNames } : p));
      } else {
        throw new Error("Falha ao atualizar visibilidade do nome do animal");
      }
    } catch (error) {
      console.error("Erro ao atualizar visibilidade do nome do animal:", error);
      alert("Erro ao atualizar. Verifique o console para mais detalhes.");
    }
  };

  const handleSaveProduct = async (product: Product) => {
    setIsSaving(true)
    try {
      if (selectedProduct) {
        // Update product in Supabase
        const updatedProduct = await updateProduct(product)
        if (updatedProduct) {
          setProducts(products.map((p) => (p.id === product.id ? updatedProduct : p)))
          alert("Produto atualizado com sucesso!")
          setIsFormOpen(false)
        } else {
          throw new Error("Falha ao atualizar produto")
        }
      } else {
        // Create new product in Supabase
        const newProduct = await createProduct(product)
        if (newProduct) {
          setProducts([...products, newProduct])
          alert("Produto adicionado com sucesso!")
          setIsFormOpen(false)
        } else {
          throw new Error("Falha ao adicionar produto")
        }
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
      alert("Erro ao salvar produto. Verifique o console para mais detalhes.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelForm = () => {
    setIsFormOpen(false)
  }

  const handleSaveBulkPrices = async (updatedProducts: Product[]) => {
    setIsSaving(true)
    try {
      // Criar um array de promessas para atualizar todos os produtos modificados
      const updatePromises = updatedProducts.map(async (product) => {
        const existingProduct = products.find((p) => p.id === product.id)
        
        // Se o produto foi modificado, atualizar no banco de dados
        if (existingProduct && 
            (existingProduct.pricePerKg !== product.pricePerKg || 
             existingProduct.pricePerSack !== product.pricePerSack ||
             existingProduct.sackWeight !== product.sackWeight)) {
          const updated = await updateProduct(product)
          return updated
        }
        return existingProduct
      })
      
      // Aguardar todas as atualizações
      const results = await Promise.all(updatePromises)
      
      // Filtrar resultados para remover valores nulos
      const validResults = results.filter((p): p is Product => p !== null)
      
      // Atualizar o estado com os produtos atualizados
      setProducts(validResults)
      
      alert("Produtos atualizados com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar produtos em massa:", error)
      alert("Ocorreu um erro ao atualizar os produtos. Por favor, tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-darkGreen">Configurações</h1>
        <div className="flex space-x-2 bg-cream rounded-lg p-1">
          <Button 
            variant={activeTab === "products" ? "default" : "ghost"} 
            onClick={() => setActiveTab("products")}
            className={activeTab === "products" ? "bg-darkGreen text-cream" : "text-darkGreen"}
          >
            Produtos
          </Button>
          <Button 
            variant={activeTab === "database" ? "default" : "ghost"} 
            onClick={() => setActiveTab("database")}
            className={activeTab === "database" ? "bg-darkGreen text-cream" : "text-darkGreen"}
          >
            Banco de Dados
          </Button>
        </div>
      </div>

      {activeTab === "products" ? (
        <div className="bg-white rounded-lg shadow p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-mediumGreen" />
              <span className="ml-2 text-darkGreen">Carregando...</span>
            </div>
          ) : isFormOpen ? (
            <AdminProductForm
              product={selectedProduct}
              onSave={handleSaveProduct}
              onCancel={handleCancelForm}
              isSaving={isSaving}
            />
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-darkGreen">Gerenciar Produtos</h2>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => setIsBulkPriceEditorOpen(true)} 
                    className="bg-amber-600 hover:bg-amber-700 flex items-center"
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Editar Preços em Massa
                  </Button>
                  <Button onClick={handleAddProduct} className="bg-mediumGreen hover:bg-mediumGreen/90">
                    Adicionar Produto
                  </Button>
                </div>
              </div>

              <div className="flex-1 min-h-0">
                <AdminProductList 
                  products={products} 
                  onEdit={handleEditProduct} 
                  onDelete={handleDeleteProduct}
                  onToggleAnimalNames={handleToggleAnimalNames}
                />
              </div>
              
              <BulkPriceEditor
                isOpen={isBulkPriceEditorOpen}
                onClose={() => setIsBulkPriceEditorOpen(false)}
                products={products}
                onSave={handleSaveBulkPrices}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="h-6 w-6 text-mediumGreen" />
            <h2 className="text-xl font-bold text-darkGreen">Configuração do Banco de Dados</h2>
          </div>

          <div className="bg-cream/50 p-4 rounded-lg mb-6 flex items-start">
            <Info className="h-5 w-5 text-mediumGreen mt-0.5 flex-shrink-0" />
            <p className="ml-2 text-gray-700 text-sm">
              Se você estiver enfrentando problemas com o banco de dados, utilize o script SQL abaixo para
              criar as tabelas necessárias no seu projeto Supabase.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-darkGreen mb-2">Como configurar o banco de dados:</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700 text-sm">
                <li>
                  <p>
                    Acesse o painel de controle do Supabase em{" "}
                    <a
                      href="https://app.supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-mediumGreen hover:underline"
                    >
                      app.supabase.com
                    </a>
                  </p>
                </li>
                <li>
                  <p>Selecione seu projeto</p>
                </li>
                <li>
                  <p>
                    Vá para a seção <strong>SQL Editor</strong> no menu lateral
                  </p>
                </li>
                <li>
                  <p>Clique em "New Query"</p>
                </li>
                <li>
                  <p>Cole o seguinte script SQL:</p>
                </li>
              </ol>
            </div>

            <div className="relative">
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">{sqlScript}</pre>
              <Button
                className="absolute top-2 right-2 bg-mediumGreen hover:bg-mediumGreen/90"
                size="sm"
                onClick={copyToClipboard}
              >
                {copied ? "Copiado!" : "Copiar"}
              </Button>
            </div>

            <p className="text-sm text-gray-600">
              Após executar o script, você deve poder usar todas as funcionalidades de gerenciamento de produtos.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
