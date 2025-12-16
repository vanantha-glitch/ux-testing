/**
 * Component Loader
 * 
 * Explicitly maps component variations to their imports for Next.js compatibility
 * Supports both page and organism variations
 */

import { ComponentType } from "react"

// Import page variations
// Cura Cloud page variations
import CuraCloudProduction from "./components/pages/cura-cloud/production"

// Import organism variations
// Right Panel variations
import RightPanelProduction from "./components/organisms/cura-cloud/right-panel/production"
import RightPanelV2 from "./components/organisms/cura-cloud/right-panel/v2"
import RightPanelBehaviorV2 from "./components/organisms/cura-cloud/right-panel/behavior-v2"
import RightPanelBehaviorV3 from "./components/organisms/cura-cloud/right-panel/behavior-v3"

// Top Bar variations
import TopBarProduction from "./components/organisms/cura-cloud/top-bar/production"

// Type for component map
type ComponentMap = Record<string, Record<string, ComponentType>>

// Map of componentId -> variationId -> Component
const componentMap: ComponentMap = {
  // Pages
  "cura-cloud": {
    production: CuraCloudProduction,
  },
  // Organisms
  "right-panel": {
    production: RightPanelProduction,
    "support.v2": RightPanelV2,
    "behavior.v2": RightPanelBehaviorV2,
    "behavior.v3": RightPanelBehaviorV3,
  },
  "top-bar": {
    production: TopBarProduction,
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

