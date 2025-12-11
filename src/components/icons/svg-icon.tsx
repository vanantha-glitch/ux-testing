"use client"

import { useState, useEffect } from "react"

interface SvgIconProps {
  src: string
  size?: number | string
  className?: string
  style?: React.CSSProperties
}

/**
 * Component that loads and renders an SVG icon from the public folder
 */
export function SvgIcon({ src, size = 16, className = "", style }: SvgIconProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load SVG")
        return res.text()
      })
      .then((text) => setSvgContent(text))
      .catch(() => setError(true))
  }, [src])

  if (error) {
    return null
  }

  if (!svgContent) {
    return <div style={{ width: size, height: size }} className={className} />
  }

  const sizeValue = typeof size === "number" ? size : parseInt(size || "16") || 16

  // Parse SVG and set size while preserving viewBox
  const parser = new DOMParser()
  const svgDoc = parser.parseFromString(svgContent, "image/svg+xml")
  const svgElement = svgDoc.documentElement
  
  if (svgElement && svgElement.tagName === "svg") {
    // Preserve viewBox if it exists
    const viewBox = svgElement.getAttribute("viewBox")
    if (!viewBox) {
      svgElement.setAttribute("viewBox", `0 0 ${sizeValue} ${sizeValue}`)
    }
    
    // Set size attributes
    svgElement.setAttribute("width", sizeValue.toString())
    svgElement.setAttribute("height", sizeValue.toString())
    
    // Set class
    if (className) {
      svgElement.setAttribute("class", className)
    }
    
    // Set style attributes
    if (style) {
      const styleString = Object.entries(style)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value}`)
        .join("; ")
      if (styleString) {
        svgElement.setAttribute("style", styleString)
      }
    }
    
    // Make SVG inherit current color if fill is black
    const paths = svgElement.querySelectorAll("path")
    paths.forEach((path) => {
      const fill = path.getAttribute("fill")
      if (fill === "black" || fill === "#000" || fill === "#000000") {
        path.setAttribute("fill", "currentColor")
      }
    })
    
    const modifiedSvg = new XMLSerializer().serializeToString(svgElement)
    
    return (
      <span
        style={{ 
          width: sizeValue, 
          height: sizeValue, 
          display: "inline-flex", 
          alignItems: "center", 
          justifyContent: "center",
          flexShrink: 0,
          ...style 
        }}
        dangerouslySetInnerHTML={{ __html: modifiedSvg }}
      />
    )
  }

  return null
}

