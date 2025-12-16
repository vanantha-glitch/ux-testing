import { ComponentType } from "react"
import AdjustmentTools from "./components/organisms/cura-cloud/adjustment-tools"
import CuraCloudProduction from "./components/pages/cura-cloud/production"
import Viewport from "./components/organisms/cura-cloud/viewport"

export type PrototypeMode = "production" | "experiments"

export interface Variation {
  id: string
  branch?: string // Branch/exploration type this variation belongs to
  description?: string // Auto-generated description of differences from production
}

export interface Branch {
  id: string
  name: string // Display name for the branch/exploration type
  variations: string[] // Variation IDs in this branch (production is always included)
}

export interface BasePrototype {
  id: string
  name: string
  description: string
  component?: ComponentType // Optional for components with variations
  fields?: FormFieldDescription[] // Optional for non-form components
  variations?: string[] // Active variation IDs (e.g., ["production", "support.v2"])
  hasVariations?: boolean // Whether this component uses the variation system
  branches?: Branch[] // Branches/exploration types for organizing variations
  variationDetails?: Record<string, Variation> // Details about each variation
}

export interface PagePrototype extends BasePrototype {
  type: "page"
}

export interface OrganismPrototype extends BasePrototype {
  type: "organism"
  pageId: string // The page this organism belongs to
}

export type Prototype = PagePrototype | OrganismPrototype

export interface FormFieldDescription {
  name: string
  type: "text" | "email" | "password" | "textarea" | "number" | "select" | "checkbox" | "radio" | "date" | "file"
  label: string
  required?: boolean
  placeholder?: string
  description?: string
  validation?: string
}

export const prototypes: Prototype[] = [
  // Pages
  {
    type: "page",
    id: "cura-cloud",
    name: "Cura Cloud",
    description: "Complete Cura Cloud page with top bar, adjustment tools, viewport, and right panel",
    component: CuraCloudProduction,
    hasVariations: true,
    variations: ["production"],
    variationDetails: {
      production: {
        id: "production",
        description: "Production version - source of truth",
      },
    },
  },
  // Organisms - Cura Cloud
  {
    type: "organism",
    pageId: "cura-cloud",
    id: "right-panel",
    name: "Right Panel",
    description: "Right panel component rebuilt from Figma design",
    hasVariations: true,
    variations: ["production", "support.v2", "behavior.v2", "behavior.v3"],
    branches: [
      {
        id: "communicating-support",
        name: "Communicating Support",
        variations: ["support.v2"], // Production is always included, so we only list non-production variations
      },
      {
        id: "behavior-explorations",
        name: "Behavior Explorations",
        variations: ["behavior.v2", "behavior.v3"], // Production is always included, so we only list non-production variations
      },
    ],
    variationDetails: {
      production: {
        id: "production",
        description: "Production version - source of truth",
      },
      "support.v2": {
        id: "support.v2",
        branch: "communicating-support",
        description: "Moved support toggle to top of settings section and changed extruder selection from buttons to radio group",
      },
      "behavior.v2": {
        id: "behavior.v2",
        branch: "behavior-explorations",
        description: "Added focus functionality to Printer Type and Material Type items with keyboard navigation support",
      },
      "behavior.v3": {
        id: "behavior.v3",
        branch: "behavior-explorations",
        description: "Added Three.js interactive raycasting points visualization that reacts to mouse movement",
      },
    },
  },
  {
    type: "organism",
    pageId: "cura-cloud",
    id: "top-bar",
    name: "Top Bar",
    description: "Top bar component with toolbar, filename editing, and notifications",
    hasVariations: true,
    variations: ["production"],
    variationDetails: {
      production: {
        id: "production",
        description: "Production version - source of truth",
      },
    },
  },
  {
    type: "organism",
    pageId: "cura-cloud",
    id: "adjustment-tools",
    name: "Adjustment Tools",
    description: "Model adjustment toolbar with Move, Scale, Rotate, and Multiply tools",
    component: AdjustmentTools,
    hasVariations: false,
  },
  {
    type: "organism",
    pageId: "cura-cloud",
    id: "viewport",
    name: "Viewport",
    description: "3D viewport component for viewing and rotating STL models using Three.js",
    component: Viewport,
    hasVariations: false,
  },
]

export function getPrototype(id: string): Prototype | undefined {
  return prototypes.find((p) => p.id === id)
}

export function getPages(): PagePrototype[] {
  return prototypes.filter((p): p is PagePrototype => p.type === "page")
}

export function getOrganisms(): OrganismPrototype[] {
  return prototypes.filter((p): p is OrganismPrototype => p.type === "organism")
}

export function getOrganismsForPage(pageId: string): OrganismPrototype[] {
  return prototypes.filter((p): p is OrganismPrototype => p.type === "organism" && p.pageId === pageId)
}

export function isPage(prototype: Prototype): prototype is PagePrototype {
  return prototype.type === "page"
}

export function isOrganism(prototype: Prototype): prototype is OrganismPrototype {
  return prototype.type === "organism"
}

export function filterByMode(mode: PrototypeMode): Prototype[] {
  if (mode === "production") {
    // Only show prototypes that have production variation or no variations
    return prototypes.filter(p => {
      if (!p.hasVariations) return true
      return p.variations?.includes("production") ?? false
    })
  }
  // Experiments mode shows everything
  return prototypes
}

export function getActiveVariations(componentId: string): string[] {
  const prototype = getPrototype(componentId)
  return prototype?.variations || []
}

export function getBranches(componentId: string): Branch[] {
  const prototype = getPrototype(componentId)
  return prototype?.branches || []
}

export function getVariationsForBranch(componentId: string, branchId: string | null): string[] {
  const prototype = getPrototype(componentId)
  if (!prototype?.hasVariations) return []
  
  // Production is always included
  const variations: string[] = ["production"]
  
  if (branchId === null) {
    // Show all variations when no branch is selected
    return prototype.variations || ["production"]
  }
  
  // Find the branch and add its variations
  const branch = prototype.branches?.find(b => b.id === branchId)
  if (branch) {
    variations.push(...branch.variations)
  }
  
  return variations
}

export function getVariationDescription(componentId: string, variationId: string): string | undefined {
  const prototype = getPrototype(componentId)
  return prototype?.variationDetails?.[variationId]?.description
}

/**
 * Generate a URL path to a specific prototype variant
 * @param prototypeId The ID of the prototype
 * @param variationId The ID of the variation (defaults to "production")
 * @returns URL path with hash for variation (e.g., "/prototypes/right-panel#support.v2")
 */
export function getPrototypeVariantUrl(prototypeId: string, variationId: string = "production"): string {
  const baseUrl = `/prototypes/${prototypeId}`
  if (variationId === "production") {
    return baseUrl
  }
  return `${baseUrl}#${variationId}`
}

/**
 * Check if a variation exists for a prototype
 * @param prototypeId The ID of the prototype
 * @param variationId The ID of the variation to check
 * @returns true if the variation exists
 */
export function hasVariation(prototypeId: string, variationId: string): boolean {
  const prototype = getPrototype(prototypeId)
  if (!prototype?.hasVariations) {
    return variationId === "production" && prototype !== undefined
  }
  return prototype.variations?.includes(variationId) ?? false
}

// Re-export loaders from component-loader
export { loadVariation } from "./component-loader"

