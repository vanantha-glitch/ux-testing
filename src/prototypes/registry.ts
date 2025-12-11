import { ComponentType } from "react"
import ExampleContactForm from "./example-contact-form"

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

export interface Prototype {
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
  {
    id: "right-panel",
    name: "Right Panel",
    description: "Right panel component rebuilt from Figma design",
    hasVariations: true,
    variations: ["production", "support.v2"],
    branches: [
      {
        id: "communicating-support",
        name: "Communicating Support",
        variations: ["support.v2"], // Production is always included, so we only list non-production variations
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
    },
  },
  {
    id: "example-contact-form",
    name: "Contact Form",
    description: "A simple contact form with name, email, and message fields",
    component: ExampleContactForm,
    hasVariations: false,
    fields: [
      {
        name: "name",
        type: "text",
        label: "Name",
        required: true,
        placeholder: "John Doe",
        description: "Your full name",
        validation: "Minimum 2 characters",
      },
      {
        name: "email",
        type: "email",
        label: "Email",
        required: true,
        placeholder: "john@example.com",
        description: "Your email address",
        validation: "Valid email format",
      },
      {
        name: "message",
        type: "textarea",
        label: "Message",
        required: true,
        placeholder: "Tell us what's on your mind...",
        description: "Your message",
        validation: "Minimum 10 characters",
      },
    ],
  },
]

export function getPrototype(id: string): Prototype | undefined {
  return prototypes.find((p) => p.id === id)
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

// Re-export loaders from component-loader
export { loadVariation } from "./component-loader"

