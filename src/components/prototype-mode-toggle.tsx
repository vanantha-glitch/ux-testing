"use client"

import { usePrototypeMode } from "@/contexts/prototype-mode-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PrototypeModeToggle() {
  const { mode, setMode, isProduction, isExperiments } = usePrototypeMode()

  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-background p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMode("production")}
        className={cn(
          "px-4 py-1.5 text-sm font-medium transition-colors",
          isProduction
            ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            : "hover:bg-muted"
        )}
      >
        Production
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMode("experiments")}
        className={cn(
          "px-4 py-1.5 text-sm font-medium transition-colors",
          isExperiments
            ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            : "hover:bg-muted"
        )}
      >
        Experiments
      </Button>
    </div>
  )
}

