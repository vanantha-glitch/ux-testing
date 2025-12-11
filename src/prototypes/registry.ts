import { ComponentType } from "react"
import ExampleContactForm from "./example-contact-form"

export interface Prototype {
  id: string
  name: string
  description: string
  component?: ComponentType // Optional for components with variations
  fields?: FormFieldDescription[] // Optional for non-form components
  variations?: string[] // Active variation IDs (e.g., ["v1", "v2"])
  archivedVariations?: string[] // Archived variation IDs
  hasVariations?: boolean // Whether this component uses the variation system
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
    variations: ["production"],
    archivedVariations: [],
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

export function getArchivedVariations(componentId: string): string[] {
  const prototype = getPrototype(componentId)
  return prototype?.archivedVariations || []
}

// Re-export loaders from component-loader
export { loadVariation, loadArchivedVariation } from "./component-loader"

