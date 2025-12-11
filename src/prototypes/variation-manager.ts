/**
 * Variation Management Utilities
 * 
 * These functions handle deleting and creating component variations.
 * 
 * IMPORTANT: In a Next.js environment, file operations cannot be performed from
 * client-side code. These functions should be called from:
 * - Server Actions (recommended)
 * - API Routes
 * - Server Components
 * 
 * The actual file operations (fs operations) will need to be implemented in
 * server-side code. This file provides the interface and logic structure.
 * 
 * Example implementation:
 * - Create API routes: /api/prototypes/[id]/delete, etc.
 * - Or use Next.js Server Actions in a separate file
 */

import { prototypes, getPrototype } from "./registry"
import fs from "fs/promises"
import path from "path"

export interface VariationOperationResult {
  success: boolean
  message: string
  error?: string
}


/**
 * Delete a variation permanently
 */
export async function deleteVariation(
  componentId: string,
  variationId: string
): Promise<VariationOperationResult> {
  try {
    const componentDir = path.join(process.cwd(), "src/prototypes/components", componentId)
    const filePath = path.join(componentDir, `${variationId}.tsx`)

    await fs.unlink(filePath)

    // Update registry (this would need to be persisted)

    return {
      success: true,
      message: `Variation ${variationId} deleted successfully`,
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to delete variation ${variationId}`,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}


/**
 * Create a new variation based on an existing one
 */
export async function createVariation(
  componentId: string,
  baseVariationId?: string
): Promise<VariationOperationResult & { variationId?: string }> {
  try {
    const prototype = getPrototype(componentId)
    if (!prototype) {
      return {
        success: false,
        message: `Component ${componentId} not found`,
      }
    }

    // Determine next variation number
    const existingVariations = prototype.variations || []
    const nextNum = existingVariations.length > 0
      ? Math.max(...existingVariations.map(v => parseInt(v.replace("v", "")))) + 1
      : 1
    const newVariationId = `v${nextNum}`

    const componentDir = path.join(process.cwd(), "src/prototypes/components", componentId)
    const newFile = path.join(componentDir, `${newVariationId}.tsx`)

    if (baseVariationId) {
      // Copy from base variation
      const baseFile = path.join(componentDir, `${baseVariationId}.tsx`)
      const content = await fs.readFile(baseFile, "utf-8")
      // Replace component name in the content
      const updatedContent = content
        .replace(new RegExp(baseVariationId, "g"), newVariationId)
        .replace(/export default function \w+/, `export default function ${componentId}${newVariationId}`)
      await fs.writeFile(newFile, updatedContent, "utf-8")
    } else {
      // Create from template
      const template = `"use client"

export default function ${componentId}${newVariationId}() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">${componentId} - ${newVariationId}</h2>
        <p className="text-muted-foreground">New variation component</p>
      </div>
    </div>
  )
}
`
      await fs.writeFile(newFile, template, "utf-8")
    }

    // Update registry (this would need to be persisted)

    return {
      success: true,
      message: `Variation ${newVariationId} created successfully`,
      variationId: newVariationId,
    }
  } catch (error) {
    return {
      success: false,
      message: `Failed to create variation`,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

