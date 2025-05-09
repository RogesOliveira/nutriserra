import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

const conneqt = localFont({
  src: [
    {
      path: "../public/fonts/Conneqt Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Conneqt Bold.ttf", 
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Conneqt Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-conneqt",
})

export const metadata: Metadata = {
  title: "Nutriserra - Soluções Premium de Ração Animal",
  description: "Marketplace B2B para produtos de ração animal de alta qualidade para diversos tipos de rebanho",
  generator: 'v0.dev',
  viewport: {
    width: 'device-width',
    initialScale: 0.4,
    maximumScale: 1,
    userScalable: true
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} ${conneqt.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'