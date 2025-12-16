"use client"

import { createContext, useContext, ReactNode } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

export type PrototypeMode = "production" | "experiments"

interface PrototypeModeContextValue {
  mode: PrototypeMode
  setMode: (mode: PrototypeMode) => void
  isProduction: boolean
  isExperiments: boolean
}

const PrototypeModeContext = createContext<PrototypeModeContextValue | undefined>(undefined)

export function PrototypeModeProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  // Get mode from URL, default to production
  const mode: PrototypeMode = (searchParams.get("mode") as PrototypeMode) || "production"
  
  const setMode = (newMode: PrototypeMode) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newMode === "production") {
      // Remove mode param for production (default)
      params.delete("mode")
    } else {
      params.set("mode", newMode)
    }
    
    const search = params.toString()
    const url = search ? `${pathname}?${search}` : pathname
    router.push(url)
  }
  
  return (
    <PrototypeModeContext.Provider
      value={{
        mode,
        setMode,
        isProduction: mode === "production",
        isExperiments: mode === "experiments",
      }}
    >
      {children}
    </PrototypeModeContext.Provider>
  )
}

export function usePrototypeMode() {
  const context = useContext(PrototypeModeContext)
  if (context === undefined) {
    throw new Error("usePrototypeMode must be used within a PrototypeModeProvider")
  }
  return context
}

