"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  ChevronDown,
  ChevronRight,
  Home,
  ShoppingBag,
  Package,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PriceCalculator } from "@/components/admin/price-calculator"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("admin-auth") === "true"
    setIsAuthenticated(isAuth)

    // Check if mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("admin-auth")
    router.push("/admin")
  }

  if (!isAuthenticated) {
    return children
  }

  return (
    <div className="flex h-screen bg-cream">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="bg-darkGreen text-cream border-cream"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isMobile 
            ? mobileMenuOpen 
              ? "fixed inset-0 z-40 bg-darkGreen/95" 
              : "hidden" 
            : sidebarOpen 
              ? "w-64" 
              : "w-20"
        } bg-darkGreen text-cream transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-darkGreen2">
          <div className={`${sidebarOpen || isMobile ? "block" : "hidden"}`}>
            <h1 className="font-bold text-xl">Nutriserra</h1>
            <p className="text-xs text-cream/70">Painel Administrativo</p>
          </div>
          
          {!isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-cream hover:text-cream hover:bg-darkGreen2"
            >
              {sidebarOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </Button>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            <li>
              <Link href="/admin" passHref>
                <span 
                  className={`flex items-center p-3 rounded-lg ${
                    pathname === "/admin" 
                      ? "bg-mediumGreen text-darkGreen font-medium" 
                      : "text-cream hover:bg-darkGreen2"
                  } cursor-pointer`}
                >
                  <Home size={20} className="flex-shrink-0" />
                  {(sidebarOpen || isMobile) && <span className="ml-3">Dashboard</span>}
                </span>
              </Link>
            </li>
            <li>
              <Link href="/admin/vendas" passHref>
                <span 
                  className={`flex items-center p-3 rounded-lg ${
                    pathname.includes("/admin/vendas") 
                      ? "bg-mediumGreen text-darkGreen font-medium" 
                      : "text-cream hover:bg-darkGreen2"
                  } cursor-pointer`}
                >
                  <ShoppingBag size={20} className="flex-shrink-0" />
                  {(sidebarOpen || isMobile) && <span className="ml-3">Vendas</span>}
                </span>
              </Link>
            </li>
            <li>
              <Link href="/admin/pedidos" passHref>
                <span 
                  className={`flex items-center p-3 rounded-lg ${
                    pathname.includes("/admin/pedidos") 
                      ? "bg-mediumGreen text-darkGreen font-medium" 
                      : "text-cream hover:bg-darkGreen2"
                  } cursor-pointer`}
                >
                  <Package size={20} className="flex-shrink-0" />
                  {(sidebarOpen || isMobile) && <span className="ml-3">Pedidos</span>}
                </span>
              </Link>
            </li>
            <li>
              <div 
                className={`flex items-center justify-between p-3 rounded-lg text-cream hover:bg-darkGreen2 cursor-pointer`}
                onClick={() => setSettingsOpen(!settingsOpen)}
              >
                <div className="flex items-center">
                  <Settings size={20} className="flex-shrink-0" />
                  {(sidebarOpen || isMobile) && <span className="ml-3">Configurações</span>}
                </div>
                {(sidebarOpen || isMobile) && (
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${settingsOpen ? "rotate-180" : ""}`} 
                  />
                )}
              </div>
              {settingsOpen && (sidebarOpen || isMobile) && (
                <ul className="mt-1 ml-7 space-y-1 border-l border-darkGreen2 pl-3">
                  <li>
                    <Link href="/admin/setup" passHref>
                      <span 
                        className={`block py-2 px-3 rounded-lg ${
                          pathname.includes("/admin/setup") 
                            ? "text-mediumGreen font-medium" 
                            : "text-cream/80 hover:text-cream"
                        } cursor-pointer`}
                      >
                        Produtos
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-darkGreen2">
          <PriceCalculator />
          <Button 
            variant="ghost" 
            className="w-full justify-start text-cream hover:bg-darkGreen2 mt-2"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-2" />
            {(sidebarOpen || isMobile) && "Sair"}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>

        <footer className="bg-darkGreen text-cream py-4 px-6 text-center text-sm">
          <p>© {new Date().getFullYear()} Nutriserra. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  )
} 