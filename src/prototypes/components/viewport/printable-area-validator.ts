import * as THREE from "three"
import { BuildPlateConfig } from "./build-plate-config"
import { Model } from "./viewport-context"

export interface ValidationResult {
  isValid: boolean
  errors: {
    axis: 'x' | 'y' | 'z'
    message: string
    exceeded: number // How much it exceeds (mm)
  }[]
}

/**
 * Calculate the bounding box of a model considering its rotation and scale
 */
function getModelBounds(model: Model): THREE.Box3 {
  if (!model.mesh) {
    return new THREE.Box3()
  }

  // Create a temporary box3 to calculate bounds
  const box = new THREE.Box3()
  box.setFromObject(model.mesh)
  
  // Apply model's transform
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  
  // Create corners of the bounding box
  const corners = [
    new THREE.Vector3(-size.x / 2, -size.y / 2, -size.z / 2),
    new THREE.Vector3(size.x / 2, -size.y / 2, -size.z / 2),
    new THREE.Vector3(-size.x / 2, size.y / 2, -size.z / 2),
    new THREE.Vector3(size.x / 2, size.y / 2, -size.z / 2),
    new THREE.Vector3(-size.x / 2, -size.y / 2, size.z / 2),
    new THREE.Vector3(size.x / 2, -size.y / 2, size.z / 2),
    new THREE.Vector3(-size.x / 2, size.y / 2, size.z / 2),
    new THREE.Vector3(size.x / 2, size.y / 2, size.z / 2),
  ]

  // Apply rotation
  const euler = new THREE.Euler(
    model.rotation.x,
    model.rotation.y,
    model.rotation.z,
    'XYZ'
  )
  const quaternion = new THREE.Quaternion().setFromEuler(euler)

  // Apply scale
  corners.forEach(corner => {
    corner.multiplyScalar(model.scale.x) // Assuming uniform scale for simplicity
    corner.applyQuaternion(quaternion)
    corner.add(new THREE.Vector3(model.position.x, model.position.y, model.position.z))
  })

  // Find min/max after rotation
  const min = new THREE.Vector3(Infinity, Infinity, Infinity)
  const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity)

  corners.forEach(corner => {
    min.min(corner)
    max.max(corner)
  })

  return new THREE.Box3(min, max)
}

/**
 * Validate if a model is within the printable area
 */
export function validatePrintableArea(
  model: Model,
  config: BuildPlateConfig
): ValidationResult {
  const errors: ValidationResult['errors'] = []
  
  if (!model.mesh) {
    return { isValid: true, errors: [] }
  }

  const bounds = getModelBounds(model)
  const min = bounds.min
  const max = bounds.max

  // Check X axis (width)
  const halfWidth = config.printableArea.width / 2
  if (min.x < -halfWidth) {
    errors.push({
      axis: 'x',
      message: `Model extends beyond left edge by ${Math.abs(min.x + halfWidth).toFixed(2)}mm`,
      exceeded: Math.abs(min.x + halfWidth),
    })
  }
  if (max.x > halfWidth) {
    errors.push({
      axis: 'x',
      message: `Model extends beyond right edge by ${(max.x - halfWidth).toFixed(2)}mm`,
      exceeded: max.x - halfWidth,
    })
  }

  // Check Y axis (depth)
  const halfDepth = config.printableArea.depth / 2
  if (min.y < -halfDepth) {
    errors.push({
      axis: 'y',
      message: `Model extends beyond front edge by ${Math.abs(min.y + halfDepth).toFixed(2)}mm`,
      exceeded: Math.abs(min.y + halfDepth),
    })
  }
  if (max.y > halfDepth) {
    errors.push({
      axis: 'y',
      message: `Model extends beyond back edge by ${(max.y - halfDepth).toFixed(2)}mm`,
      exceeded: max.y - halfDepth,
    })
  }

  // Check Z axis (height) - model should be above build plate (z >= 0)
  if (min.z < 0) {
    errors.push({
      axis: 'z',
      message: `Model extends below build plate by ${Math.abs(min.z).toFixed(2)}mm`,
      exceeded: Math.abs(min.z),
    })
  }
  if (max.z > config.printableArea.height) {
    errors.push({
      axis: 'z',
      message: `Model extends beyond height limit by ${(max.z - config.printableArea.height).toFixed(2)}mm`,
      exceeded: max.z - config.printableArea.height,
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Snap model to build plate surface (set Z position to 0, accounting for model height)
 */
export function snapToBuildPlate(model: Model): Model {
  if (!model.mesh) {
    return model
  }

  // Get the model's bounding box
  const box = new THREE.Box3()
  box.setFromObject(model.mesh)
  const size = box.getSize(new THREE.Vector3())
  
  // The lowest point of the model should be at Z=0
  // So we need to move the model up by half its height (if centered) or by the full min Z
  const minZ = box.min.z
  
  return {
    ...model,
    position: {
      ...model.position,
      z: model.position.z - minZ, // Move up so bottom is at Z=0
    },
  }
}

