"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ShoppingBag, Package, Settings, TrendingUp, Activity, AlertCircle, DollarSign } from "lucide-react"
import type { Product } from "@/types"
import type { Order } from "@/lib/orders"
import { fetchProducts } from "@/lib/products"

// Helper function to format currency in Brazilian format
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Animation component for counting up values
const CountUp = ({ end, isCurrency = false, duration = 1000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const startTime = useRef(null);
  const endValue = useRef(end);

  useEffect(() => {
    endValue.current = end;
    startTime.current = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      
      const value = Math.floor(progress * endValue.current);
      setCount(value);
      
      if (progress < 1) {
        countRef.current = requestAnimationFrame(animate);
      } else {
        setCount(endValue.current);
      }
    };
    
    countRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (countRef.current) {
        cancelAnimationFrame(countRef.current);
      }
    };
  }, [end, duration]);
  
  return <>{isCurrency ? formatCurrency(count) : count}</>;
};

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [productCount, setProductCount] = useState(0)
  const [orders, setOrders] = useState<Order[]>([])
  const [monthlySales, setMonthlySales] = useState(0)
  const [grossProfit, setGrossProfit] = useState(0)
  const [netTotal, setNetTotal] = useState(0)
  const [animationTrigger, setAnimationTrigger] = useState(false)

  // Simple authentication for demonstration
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple credentials for demonstration (in production, use proper authentication)
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true)
      // In production, would store a JWT token or similar
      localStorage.setItem("admin-auth", "true")
    } else {
      alert("Credenciais inválidas")
    }
  }

  useEffect(() => {
    // Check if already authenticated
    const isAuth = localStorage.getItem("admin-auth") === "true"
    setIsAuthenticated(isAuth)

    // Load product count and orders if authenticated
    if (isAuth) {
      loadProductCount()
      loadOrders()
    } else {
      setIsLoading(false)
    }
  }, [])

  const loadProductCount = async () => {
    setIsLoading(true)
    try {
      // Fetch products from Supabase
      const fetchedProducts = await fetchProducts()
      setProductCount(fetchedProducts.length)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      setProductCount(0)
    } finally {
      setIsLoading(false)
    }
  }

  const loadOrders = async () => {
    try {
      // Fetch orders from API
      const response = await fetch('/api/orders')
      if (!response.ok) {
        throw new Error('Falha ao carregar pedidos')
      }
      const ordersData = await response.json()
      setOrders(ordersData)
      
      // Calculate monthly sales (count of delivered orders)
      const deliveredOrders = ordersData.filter((order: Order) => order.status === 'Delivered')
      setMonthlySales(deliveredOrders.length)
      
      // Calculate gross profit (sum of all orders except canceled)
      const nonCanceledOrders = ordersData.filter((order: Order) => order.status !== 'Cancelled')
      const grossProfitValue = nonCanceledOrders.reduce(
        (sum: number, order: Order) => sum + order.total_amount, 
        0
      )
      setGrossProfit(grossProfitValue)
      
      // Calculate total commissions
      const totalCommissions = ordersData.reduce(
        (sum: number, order: Order) => {
          const orderCommissions = order.items?.reduce(
            (itemSum: number, item: any) => {
              if (item.commission_type === 'percentage') {
                return itemSum + ((item.quantity * (item.sack_weight || 0) * item.unit_price) * (item.commission_value || 0) / 100)
              } else if (item.commission_type === 'fixed') {
                return itemSum + (item.commission_value || 0)
              }
              return itemSum
            },
            0
          ) || 0
          return sum + orderCommissions
        },
        0
      )
      setNetTotal(totalCommissions)
      
      // Trigger animation after data is loaded
      setAnimationTrigger(true)
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error)
    }
  }

  // Login form for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream/40">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-darkGreen">Admin Nutriserra</h1>
            <p className="text-gray-600">Faça login para acessar o painel administrativo</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Usuário
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              
              <Button type="submit" className="w-full bg-darkGreen hover:bg-darkGreen/90">
                Entrar
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-darkGreen">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao painel administrativo da Nutriserra.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Produtos</p>
              <h3 className="text-2xl font-bold text-darkGreen mt-1">
                {isLoading ? "..." : animationTrigger ? <CountUp end={productCount} /> : 0}
              </h3>
            </div>
            <div className="bg-lightGreen/20 p-3 rounded-full">
              <Package className="h-6 w-6 text-mediumGreen" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Pedidos</p>
              <h3 className="text-2xl font-bold text-darkGreen mt-1">
                {isLoading ? "..." : animationTrigger ? <CountUp end={orders.length} /> : 0}
              </h3>
            </div>
            <div className="bg-lightGreen/20 p-3 rounded-full">
              <ShoppingBag className="h-6 w-6 text-mediumGreen" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Lucro Bruto</p>
              <h3 className="text-2xl font-bold text-darkGreen mt-1">
                {isLoading ? "..." : animationTrigger ? <CountUp end={grossProfit} isCurrency={true} /> : formatCurrency(0)}
              </h3>
            </div>
            <div className="bg-lightGreen/20 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-mediumGreen" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Líquido (Comissões)</p>
              <h3 className="text-2xl font-bold text-darkGreen mt-1">
                {isLoading ? "..." : animationTrigger ? <CountUp end={netTotal} isCurrency={true} /> : formatCurrency(0)}
              </h3>
            </div>
            <div className="bg-lightGreen/20 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-mediumGreen" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-darkGreen mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/vendas" passHref>
              <div className="p-4 bg-cream hover:bg-darkGreen hover:text-cream rounded-lg cursor-pointer transition-colors">
                <ShoppingBag className="h-8 w-8 mb-2" />
                <h3 className="font-medium">Vendas</h3>
                <p className="text-sm opacity-70">Gerenciar vendas</p>
              </div>
            </Link>
            
            <Link href="/admin/pedidos" passHref>
              <div className="p-4 bg-cream hover:bg-darkGreen hover:text-cream rounded-lg cursor-pointer transition-colors">
                <Package className="h-8 w-8 mb-2" />
                <h3 className="font-medium">Pedidos</h3>
                <p className="text-sm opacity-70">Visualizar pedidos</p>
              </div>
            </Link>
            
            <Link href="/admin/setup" passHref>
              <div className="p-4 bg-cream hover:bg-darkGreen hover:text-cream rounded-lg cursor-pointer transition-colors">
                <Settings className="h-8 w-8 mb-2" />
                <h3 className="font-medium">Produtos</h3>
                <p className="text-sm opacity-70">Gerenciar produtos</p>
              </div>
            </Link>
            
            <div onClick={() => router.push("/")} className="p-4 bg-cream hover:bg-darkGreen hover:text-cream rounded-lg cursor-pointer transition-colors">
              <Activity className="h-8 w-8 mb-2" />
              <h3 className="font-medium">Loja</h3>
              <p className="text-sm opacity-70">Ver marketplace</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-darkGreen mb-4">Sistema</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-cream rounded-lg">
              <AlertCircle className="h-5 w-5 text-mediumGreen mt-0.5" />
              <div>
                <h3 className="font-medium text-darkGreen">Versão de Desenvolvimento</h3>
                <p className="text-sm text-gray-600">Esta é uma versão de desenvolvimento do painel administrativo.</p>
              </div>
            </div>
            
            <div className="bg-gold/10 p-3 rounded-lg">
              <h3 className="font-medium text-darkGreen">Dicas Rápidas</h3>
              <ul className="mt-2 text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Use a barra lateral para navegar entre as seções.</li>
                <li>A seção de Produtos permite gerenciar o catálogo.</li>
                <li>A página de Vendas mostra o histórico de transações.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
