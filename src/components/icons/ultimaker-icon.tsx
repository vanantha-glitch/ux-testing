"use client"

import { SvgIcon } from "./svg-icon"
import { getUltimakerIconByName } from "@/lib/icon-mapper"

interface UltimakerIconProps {
  name: string
  size?: number | string
  className?: string
  style?: React.CSSProperties
}

/**
 * Component that renders Ultimaker icons by name (matching Figma component names)
 * Usage: <UltimakerIcon name="UltiMaker_PrintQuality" size={16} />
 */
export function UltimakerIcon({ name, size = 16, className = "", style }: UltimakerIconProps) {
  const iconFile = getUltimakerIconByName(name)
  
  if (!iconFile) {
    console.warn(`Ultimaker icon not found: ${name}`)
    return null
  }
  
  return (
    <SvgIcon
      src={`/icons/ultimaker/${iconFile}`}
      size={size}
      className={className}
      style={style}
    />
  )
}

