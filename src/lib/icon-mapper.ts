/**
 * Mapping from Carbon icon names to Ultimaker icon filenames
 * Based on Figma design system naming convention
 * When a Carbon icon is not available, we'll use the corresponding Ultimaker icon
 */
export const carbonToUltimakerIconMap: Record<string, string> = {
  // Navigation icons - matching Figma naming (Chevron--down, Chevron--up)
  ArrowLeft: "Ultimaker-chevron-double-left.svg",
  ArrowRight: "Ultimaker-chevron-double-right.svg",
  ChevronDown: "Ultimaker-chevron-double-down.svg", // Maps to Chevron--down in Figma
  ChevronUp: "Ultimaker-chevron-double-up.svg", // Maps to Chevron--up in Figma
  
  // Action icons
  Archive: "Ultimaker-folder-filled.svg",
  TrashCan: "Ultimaker--Close--filled.svg", // Using close as delete alternative
  Reset: "Reset.svg", // Matches Figma Reset component
  
  // Device icons
  Printer: "UltiMaker-printer.svg",
  Package: "Ultimaker-material-spool.svg",
  
  // Print settings icons - matching Figma naming
  Settings: "UltiMaker-system settings-alt.svg",
  CheckmarkFilled: "Ultimaker--Checkmark--filled.svg",
  Time: "Ultimaker-spinner.svg", // Using spinner as time alternative
  
  // Menu icons
  OverflowMenuVertical: "Ultimaker-Expand.svg", // Using expand as menu alternative
  
  // Figma-specific Ultimaker icons (for direct use in components)
  // These match the Figma component names exactly
  "UltiMaker_PrintQuality": "UltiMaker_PrintQuality.svg",
  "Ultimaker-infill-1": "Ultimaker-infill-1.svg",
  "Ultimaker-infill-2": "Ultimaker-infill-2.svg",
  "Ultimaker-Support": "Ultimaker-Support.svg",
  "Ultimaker-Adhesion": "Ultimaker-Adhesion.svg",
  "Ultimaker-shell": "Ultimaker-shell.svg",
  "Ultimaker-shell-Side": "Ultimaker-shell-Side.svg",
  "Ultimaker-shell-Top": "Ultimaker-shell-Top.svg",
  "Ultimaker-material-1": "Ultimaker-material-1.svg",
  "Ultimaker-material-2": "Ultimaker-material-2.svg",
}

/**
 * Get the Ultimaker icon filename for a Carbon icon name
 * Returns null if no mapping exists
 */
export function getUltimakerIcon(carbonIconName: string): string | null {
  return carbonToUltimakerIconMap[carbonIconName] || null
}

/**
 * Get Ultimaker icon filename directly by name (matches Figma component names)
 * This allows direct access to Ultimaker icons without Carbon mapping
 */
export function getUltimakerIconByName(iconName: string): string | null {
  // First check if it's already in the map (could be Carbon name or direct Ultimaker name)
  if (carbonToUltimakerIconMap[iconName]) {
    return carbonToUltimakerIconMap[iconName]
  }
  
  // Check if the iconName matches a filename directly (with or without .svg extension)
  const iconNameWithoutExt = iconName.replace(/\.svg$/, "")
  for (const [key, value] of Object.entries(carbonToUltimakerIconMap)) {
    const valueWithoutExt = value.replace(/\.svg$/, "")
    if (valueWithoutExt === iconNameWithoutExt || key === iconNameWithoutExt) {
      return value
    }
  }
  
  // Try to find by partial match (case-insensitive)
  const normalizedName = iconNameWithoutExt.toLowerCase().replace(/[_-]/g, "-")
  for (const [key, value] of Object.entries(carbonToUltimakerIconMap)) {
    const normalizedKey = key.toLowerCase().replace(/[_-]/g, "-")
    const normalizedValue = value.toLowerCase().replace(/\.svg$/, "").replace(/[_-]/g, "-")
    if (normalizedKey === normalizedName || normalizedValue === normalizedName) {
      return value
    }
  }
  
  return null
}

