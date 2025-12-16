"use client"

import { useRouter } from "next/navigation"
import { getPrototype, getPrototypeVariantUrl, hasVariation } from "@/prototypes/registry"
import { cn } from "@/lib/utils"
import { Link } from "@carbon/icons-react"

export interface PrototypeMentionProps {
  prototypeId: string
  variationId?: string
  className?: string
  showIcon?: boolean
}

/**
 * PrototypeMention Component
 * 
 * An inline link component for prototype mentions.
 * Used within text to create clickable links to prototype variants.
 * 
 * @example
 * // In MentionText component
 * <PrototypeMention prototypeId="right-panel" variationId="support.v2" />
 */
export function PrototypeMention({
  prototypeId,
  variationId = "production",
  className,
  showIcon = true,
}: PrototypeMentionProps) {
  const router = useRouter()
  const prototype = getPrototype(prototypeId)

  if (!prototype) {
    // If prototype doesn't exist, render as plain text
    return (
      <span className={cn("text-muted-foreground", className)}>
        @{prototypeId}{variationId !== "production" ? `.${variationId}` : ""}
      </span>
    )
  }

  // Check if variation exists
  const variationExists = hasVariation(prototypeId, variationId)
  if (!variationExists) {
    // If variation doesn't exist, render as plain text with warning style
    return (
      <span className={cn("text-muted-foreground line-through", className)}>
        @{prototypeId}{variationId !== "production" ? `.${variationId}` : ""}
      </span>
    )
  }

  const href = getPrototypeVariantUrl(prototypeId, variationId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(href)
  }

  // Generate display text
  const displayText =
    variationId === "production"
      ? `@${prototypeId}`
      : `@${prototypeId}.${variationId}`

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1 text-primary hover:text-primary/80 underline underline-offset-2 cursor-pointer transition-colors",
        className
      )}
      title={`View ${prototype.name}${variationId !== "production" ? ` (${variationId})` : " (Production)"}`}
    >
      {displayText}
      {showIcon && <Link size={12} className="opacity-60" />}
    </a>
  )
}

