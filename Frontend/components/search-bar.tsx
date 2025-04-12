"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockStockData } from "@/lib/mock-data"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function SearchBar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Ensure mockStockData is defined and has values
  const safeStockData = mockStockData && mockStockData.length > 0 ? mockStockData : []

  const handleSelect = (symbol: string) => {
    setOpen(false)
    router.push(`/stocks/${symbol.toLowerCase()}`)
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search stocks...</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for stocks..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Stocks">
            {safeStockData.map((stock) => (
              <CommandItem key={stock.symbol} onSelect={() => handleSelect(stock.symbol)}>
                <div className="flex items-center">
                  <span className="font-medium">{stock.symbol}</span>
                  <span className="ml-2 text-muted-foreground">{stock.name}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
