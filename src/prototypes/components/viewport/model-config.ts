/**
 * Model Configuration
 * Defines available 3D models for testing
 */

export interface ModelConfig {
  modelId: string
  modelName: string
  filePath: string
  fileType: 'stl' | 'obj'
}

/**
 * Available models for testing
 */
export const MODEL_CONFIGS: ModelConfig[] = [
  {
    modelId: 'boom-bracket',
    modelName: 'Boom Bracket',
    filePath: '/models/boomBracket.stl',
    fileType: 'stl',
  },
]

/**
 * Get model configuration by model ID
 */
export function getModelConfig(modelId: string): ModelConfig | undefined {
  return MODEL_CONFIGS.find(config => config.modelId === modelId)
}

/**
 * Get default model configuration (first in list)
 */
export function getDefaultModelConfig(): ModelConfig | undefined {
  return MODEL_CONFIGS[0]
}

/**
 * Get all available model IDs
 */
export function getAvailableModelIds(): string[] {
  return MODEL_CONFIGS.map(config => config.modelId)
}

