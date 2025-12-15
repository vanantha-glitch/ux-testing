/**
 * Build Plate Configuration
 * Defines printer types, their build plate file paths, and printable area dimensions
 */

export interface BuildPlateConfig {
  printerId: string
  printerName: string
  filePath: string
  fileType: 'stl' | 'obj'
  printableArea: {
    width: number  // X dimension (mm)
    depth: number  // Y dimension (mm)
    height: number // Z dimension (mm)
  }
}

/**
 * Default printable area dimensions for each printer
 * Dimensions verified through manufacturer specifications and industry sources
 * All dimensions are in millimeters (mm)
 */
export const BUILD_PLATE_CONFIGS: BuildPlateConfig[] = [
  {
    printerId: 'ultimaker-s7',
    printerName: 'Ultimaker S7',
    filePath: '/build-plates/ultimaker-s7.obj',
    fileType: 'obj',
    printableArea: {
      width: 330,   // mm - Verified: Same build volume as Ultimaker S5
      depth: 240,   // mm
      height: 300,  // mm
    },
  },
  {
    printerId: 'ultimaker-s3',
    printerName: 'Ultimaker S3',
    filePath: '/build-plates/ultimaker-s3.obj',
    fileType: 'obj',
    printableArea: {
      width: 230,   // mm - Verified: Official Ultimaker S3 specification
      depth: 190,   // mm - Verified: Official Ultimaker S3 specification
      height: 200,  // mm - Verified: Official Ultimaker S3 specification
    },
  },
  {
    printerId: 'ultimaker-method-x',
    printerName: 'Ultimaker Method X',
    filePath: '/build-plates/ultimaker-method-x.stl',
    fileType: 'stl',
    printableArea: {
      width: 294,   // mm
      depth: 190,   // mm
      height: 200,  // mm
    },
  },
  {
    printerId: 'ultimaker-method-xl',
    printerName: 'Ultimaker Method XL',
    filePath: '/build-plates/ultimaker-method-xl.stl',
    fileType: 'stl',
    printableArea: {
      width: 294,   // mm - Same width/depth as Method X
      depth: 190,   // mm
      height: 300,  // mm - XL version has increased height capacity
    },
  },
  {
    printerId: 'ultimaker-factor4',
    printerName: 'Ultimaker Factor 4',
    filePath: '/build-plates/ultimaker-factor4.obj',
    fileType: 'obj',
    printableArea: {
      width: 330,   // mm
      depth: 240,   // mm
      height: 300,  // mm
    },
  },
  {
    printerId: 'makerbot-sketch-sprint',
    printerName: 'MakerBot Sketch Sprint',
    filePath: '/build-plates/makerbot-sketch-sprint.obj',
    fileType: 'obj',
    printableArea: {
      width: 200,   // mm
      depth: 200,   // mm
      height: 200,  // mm
    },
  },
]

/**
 * Get build plate configuration by printer ID
 */
export function getBuildPlateConfig(printerId: string): BuildPlateConfig | undefined {
  return BUILD_PLATE_CONFIGS.find(config => config.printerId === printerId)
}

/**
 * Get default build plate configuration (first in list)
 */
export function getDefaultBuildPlateConfig(): BuildPlateConfig {
  return BUILD_PLATE_CONFIGS[0]
}

/**
 * Get all available printer IDs
 */
export function getAvailablePrinterIds(): string[] {
  return BUILD_PLATE_CONFIGS.map(config => config.printerId)
}

