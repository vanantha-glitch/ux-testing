/**
 * Component Loader
 * 
 * Explicitly maps component variations to their imports for Next.js compatibility
 */

import { ComponentType } from "react"

// Import all variation components explicitly
// Right Panel variations
import RightPanelProduction from "./components/right-panel/production"
import RightPanelV2 from "./components/right-panel/v2"

// Type for component map
type ComponentMap = Record<string, Record<string, ComponentType>>

// Map of componentId -> variationId -> Component
const componentMap: ComponentMap = {
  "right-panel": {
    production: RightPanelProduction,
    "support.v2": RightPanelV2,
  },
}

export function loadVariationSync(
  componentId: string,
  variationId: string
): ComponentType | null {
  return componentMap[componentId]?.[variationId] || null
}

export async function loadVariation(
  componentId: string,
  variationId: string
): Promise<ComponentType | null> {
  // For now, use sync loader
  // In the future, this could be extended to support async loading
  return loadVariationSync(componentId, variationId)
}

