"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "@carbon/icons-react"
import { useRouter } from "next/navigation"
import { getPrototype, getPrototypeVariantUrl } from "@/prototypes/registry"
import { cn } from "@/lib/utils"

export interface PrototypeLinkProps {
  prototypeId: string
  variationId?: string
  children?: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
}

/**
 * PrototypeLink Component
 * 
 * A reusable button component that links to prototype variants.
 * Can be used within prototypes to navigate to other prototype variations.
 * 
 * @example
 * // Link to a specific variant
 * <PrototypeLink prototypeId="right-panel" variationId="support.v2">
 *   View Support V2 Variant
 * </PrototypeLink>
 * 
 * @example
 * // Link to production variant (default)
 * <PrototypeLink prototypeId="right-panel">
 *   View Production
 * </PrototypeLink>
 */
export function PrototypeLink({
  prototypeId,
  variationId = "production",
  children,
  variant = "default",
  size = "default",
  className,
  showIcon = true,
}: PrototypeLinkProps) {
  const router = useRouter()
  const prototype = getPrototype(prototypeId)

  if (!prototype) {
    console.warn(`Prototype ${prototypeId} not found`)
    return null
  }

  // Generate the link URL with hash for variation
  const href = getPrototypeVariantUrl(prototypeId, variationId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(href)
  }

  // Generate display text if children not provided
  const displayText =
    children ||
    (variationId === "production"
      ? `View ${prototype.name} (Production)`
      : `View ${prototype.name} (${variationId})`)

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={handleClick}
    >
      {displayText}
      {showIcon && <ArrowRight size={16} className="ml-2" />}
    </Button>
  )
}

