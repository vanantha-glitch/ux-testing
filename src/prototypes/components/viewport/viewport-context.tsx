"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import * as THREE from "three"
import { BuildPlateConfig, getBuildPlateConfig, getDefaultBuildPlateConfig } from "./build-plate-config"

export interface Model {
  id: string
  name: string
  mesh: THREE.Mesh | null
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  filePath: string
}

export interface ValidationError {
  modelId: string
  message: string
  axis?: 'x' | 'y' | 'z'
}

interface ViewportContextValue {
  // State
  selectedPrinter: string
  models: Model[]
  selectedModelId: string | null
  buildPlateConfig: BuildPlateConfig
  validationErrors: ValidationError[]

  // Actions
  setSelectedPrinter: (printerId: string) => void
  addModel: (modelPath: string, name?: string) => Promise<string | null>
  removeModel: (modelId: string) => void
  selectModel: (modelId: string | null) => void
  updateModelTransform: (
    modelId: string,
    transform: Partial<{
      position: { x: number; y: number; z: number }
      rotation: { x: number; y: number; z: number }
      scale: { x: number; y: number; z: number }
    }>
  ) => void
  clearModels: () => void
  setValidationErrors: (errors: ValidationError[]) => void
}

const ViewportContext = createContext<ViewportContextValue | undefined>(undefined)

export function useViewport() {
  const context = useContext(ViewportContext)
  if (!context) {
    throw new Error("useViewport must be used within a ViewportProvider")
  }
  return context
}

interface ViewportProviderProps {
  children: ReactNode
  initialPrinterId?: string
}

export function ViewportProvider({ children, initialPrinterId }: ViewportProviderProps) {
  const defaultConfig = getDefaultBuildPlateConfig()
  const initialPrinter = initialPrinterId ? getBuildPlateConfig(initialPrinterId) : null
  const [selectedPrinter, setSelectedPrinterState] = useState<string>(initialPrinter?.printerId || defaultConfig.printerId)
  const [models, setModels] = useState<Model[]>([])
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])

  // Update build plate config when printer changes
  const buildPlateConfig = getBuildPlateConfig(selectedPrinter) || defaultConfig

  const setSelectedPrinter = useCallback((printerId: string) => {
    setSelectedPrinterState(printerId)
    // Clear selection when printer changes
    setSelectedModelId(null)
  }, [])

  const addModel = useCallback(async (modelPath: string, name?: string): Promise<string | null> => {
    try {
      const modelId = `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const modelName = name || modelPath.split('/').pop() || 'Model'

      // The actual mesh loading will be handled by the viewport component
      // We just create a placeholder here
      const newModel: Model = {
        id: modelId,
        name: modelName,
        mesh: null, // Will be set by viewport component
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        filePath: modelPath,
      }

      setModels(prev => [...prev, newModel])
      return modelId
    } catch (error) {
      console.error("Error adding model:", error)
      return null
    }
  }, [])

  const removeModel = useCallback((modelId: string) => {
    setModels(prev => {
      const updated = prev.filter(m => m.id !== modelId)
      // Clear selection if removed model was selected
      if (selectedModelId === modelId) {
        setSelectedModelId(null)
      }
      return updated
    })
    // Clear validation errors for removed model
    setValidationErrors(prev => prev.filter(e => e.modelId !== modelId))
  }, [selectedModelId])

  const selectModel = useCallback((modelId: string | null) => {
    setSelectedModelId(modelId)
  }, [])

  const updateModelTransform = useCallback((
    modelId: string,
    transform: Partial<{
      position: { x: number; y: number; z: number }
      rotation: { x: number; y: number; z: number }
      scale: { x: number; y: number; z: number }
    }>
  ) => {
    setModels(prev => prev.map(model => {
      if (model.id === modelId) {
        return {
          ...model,
          position: transform.position || model.position,
          rotation: transform.rotation || model.rotation,
          scale: transform.scale || model.scale,
        }
      }
      return model
    }))
  }, [])

  const clearModels = useCallback(() => {
    setModels([])
    setSelectedModelId(null)
    setValidationErrors([])
  }, [])

  const value: ViewportContextValue = {
    selectedPrinter,
    models,
    selectedModelId,
    buildPlateConfig,
    validationErrors,
    setSelectedPrinter,
    addModel,
    removeModel,
    selectModel,
    updateModelTransform,
    clearModels,
    setValidationErrors,
  }

  return (
    <ViewportContext.Provider value={value}>
      {children}
    </ViewportContext.Provider>
  )
}

