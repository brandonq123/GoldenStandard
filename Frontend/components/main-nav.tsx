"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Home, TrendingUp } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex items-center">
      <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
        <BarChart3 className="h-6 w-6 text-primary" />
        <span className="hidden font-bold sm:inline-block">StockSentiment</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2 transition-colors hover:text-foreground/80",
            pathname === "/dashboard" ? "text-foreground" : "text-foreground/60",
          )}
        >
          <Home className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/trending"
          className={cn(
            "flex items-center gap-2 transition-colors hover:text-foreground/80",
            pathname?.startsWith("/trending") ? "text-foreground" : "text-foreground/60",
          )}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Trending</span>
        </Link>
      </nav>
    </div>
  )
}
