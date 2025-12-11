"use client"

import { ComponentType, SVGProps, useState, useEffect } from "react"
import { getUltimakerIcon } from "@/lib/icon-mapper"

interface IconWrapperProps extends SVGProps<SVGSVGElement> {
  carbonIcon: ComponentType<SVGProps<SVGSVGElement>>
  carbonIconName: string
  size?: number | string
  className?: string
}

/**
 * SVG Icon component that loads SVG from public folder
 */
function SvgIcon({ src, size, className, ...props }: { src: string; size?: number | string; className?: string } & SVGProps<SVGSVGElement>) {
  const [svgContent, setSvgContent] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(src)
      .then((res) => res.text())
      .then((text) => setSvgContent(text))
      .catch(() => setError(true))
  }, [src])

  if (error || !svgContent) {
    return null
  }

  const sizeValue = typeof size === "number" ? size : parseInt(size || "16") || 16

  return (
    <span
      className={className}
      style={{ width: sizeValue, height: sizeValue, display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      {...(props as any)}
    />
  )
}

/**
 * Icon wrapper that tries Carbon icon first, falls back to Ultimaker SVG
 */
export function IconWrapper({
  carbonIcon: CarbonIcon,
  carbonIconName,
  size = 16,
  className = "",
  ...props
}: IconWrapperProps) {
  // Try to get Ultimaker icon mapping
  const ultimakerIcon = getUltimakerIcon(carbonIconName)
  
  // If Ultimaker icon exists, use it; otherwise use Carbon icon
  if (ultimakerIcon) {
    return (
      <SvgIcon
        src={`/icons/ultimaker/${ultimakerIcon}`}
        size={size}
        className={className}
        {...props}
      />
    )
  }
  
  // Fallback to Carbon icon
  return <CarbonIcon size={typeof size === "number" ? size : parseInt(size as string) || 16} className={className} {...props} />
}

