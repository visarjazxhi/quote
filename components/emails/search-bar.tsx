"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

export function SearchBar() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "")

  const handleSearch = (term: string) => {
    setSearchTerm(term)

    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("query", term)
    } else {
      params.delete("query")
    }

    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search templates..."
        className="pl-10"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}

