/**
 * Component Loader
 * 
 * Explicitly maps component variations to their imports for Next.js compatibility
 */

import { ComponentType } from "react"

// Import all variation components explicitly
// Right Panel variations
import RightPanelProduction from "./components/right-panel/production"

// Type for component map
type ComponentMap = Record<string, Record<string, ComponentType>>

// Map of componentId -> variationId -> Component
const componentMap: ComponentMap = {
  "right-panel": {
    production: RightPanelProduction,
  },
}

// Map for archived components
const archivedComponentMap: ComponentMap = {
  // Add archived components here as needed
  // "right-panel": {
  //   v0: RightPanelV0,
  // }
}

export function loadVariationSync(
  componentId: string,
  variationId: string
): ComponentType | null {
  return componentMap[componentId]?.[variationId] || null
}

export function loadArchivedVariationSync(
  componentId: string,
  variationId: string
): ComponentType | null {
  return archivedComponentMap[componentId]?.[variationId] || null
}

export async function loadVariation(
  componentId: string,
  variationId: string
): Promise<ComponentType | null> {
  // For now, use sync loader
  // In the future, this could be extended to support async loading
  return loadVariationSync(componentId, variationId)
}

export async function loadArchivedVariation(
  componentId: string,
  variationId: string
): Promise<ComponentType | null> {
  return loadArchivedVariationSync(componentId, variationId)
}

