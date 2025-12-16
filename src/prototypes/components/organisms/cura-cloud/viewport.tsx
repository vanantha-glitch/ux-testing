"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { useViewport, Model } from "../../viewport/viewport-context"
import { useTransformControls } from "../../viewport/transform-controls"
import { validatePrintableArea } from "../../viewport/printable-area-validator"
import { useToast } from "@/hooks/use-toast"
import { BUILD_PLATE_CONFIGS } from "../../viewport/build-plate-config"
import { MODEL_CONFIGS } from "../../viewport/model-config"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface ViewportProps {
  stlPath?: string
  backgroundColor?: string
  meshColor?: string
  showDropdowns?: boolean
}

export default function Viewport({
  stlPath,
  backgroundColor = "#FAF8F6",
  meshColor = "#d9d9d9",
  showDropdowns = true,
}: ViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const buildPlateMeshRef = useRef<THREE.Mesh | null>(null)
  const printableAreaRef = useRef<THREE.LineSegments | null>(null)
  const raycasterRef = useRef<THREE.Raycaster | null>(null)
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2())
  const modelMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map())
  const animationFrameRef = useRef<number | null>(null)
  const isInitializedRef = useRef<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sceneReady, setSceneReady] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>("Initializing...")
  const [activeTool, setActiveTool] = useState<"move" | "rotate" | "scale" | null>(null)
  const [hoveredModelId, setHoveredModelId] = useState<string | null>(null)

  const {
    selectedPrinter,
    models,
    selectedModelId,
    buildPlateConfig,
    validationErrors,
    updateModelTransform,
    selectModel,
    setValidationErrors,
    setSelectedPrinter,
    addModel,
    clearModels,
  } = useViewport()
  const { toast } = useToast()
  const [selectedModelConfig, setSelectedModelConfig] = useState<string>("")

  // Initialize selected model config from current models
  useEffect(() => {
    if (models.length > 0 && !selectedModelConfig) {
      const firstModel = models[0]
      const matchingConfig = MODEL_CONFIGS.find(
        config => config.filePath === firstModel.filePath
      )
      if (matchingConfig) {
        setSelectedModelConfig(matchingConfig.modelId)
      }
    } else if (models.length === 0) {
      setSelectedModelConfig("")
    }
  }, [models, selectedModelConfig])

  // Helper function to get base transformations (same as build plate)
  const getBaseTransformations = useCallback(() => {
    const baseRotationX = (3 * Math.PI) / 2
    const basePositionY = -buildPlateConfig.printableArea.depth / 2 - buildPlateConfig.printableArea.depth * 0.04
    const basePositionZ = buildPlateConfig.printableArea.height / 2
    return { baseRotationX, basePositionY, basePositionZ }
  }, [buildPlateConfig])

  // Helper function to calculate Y position to align face closest to build plate
  const calculateBuildPlateAlignedYPosition = useCallback((
    geometry: THREE.BufferGeometry,
    rotation: { x: number; y: number; z: number },
    scale: { x: number; y: number; z: number }
  ): number => {
    const { baseRotationX, basePositionY } = getBaseTransformations()
    
    // Get geometry bounding box (should already be centered)
    geometry.computeBoundingBox()
    const geoBox = geometry.boundingBox!
    const size = geoBox.getSize(new THREE.Vector3())
    
    // Create corners of bounding box
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
    
    // Apply scale
    corners.forEach(corner => {
      corner.multiply(new THREE.Vector3(scale.x, scale.y, scale.z))
    })
    
    // Apply rotation (base rotation + model rotation)
    const totalRotationX = rotation.x + baseRotationX
    const euler = new THREE.Euler(totalRotationX, rotation.y, rotation.z, 'XYZ')
    const quaternion = new THREE.Quaternion().setFromEuler(euler)
    corners.forEach(corner => {
      corner.applyQuaternion(quaternion)
    })
    
    // Find min Y after rotation (face closest to build plate)
    let minY = Infinity
    corners.forEach(corner => {
      minY = Math.min(minY, corner.y)
    })
    
    // Position so minY aligns with build plate Y position (face closest to build plate)
    // Build plate is at basePositionY, so position model so its bottom face is at that level
    return basePositionY - minY
  }, [buildPlateConfig, getBaseTransformations])

  // Get selected model mesh
  const selectedModel = models.find(m => m.id === selectedModelId)
  const selectedMesh = selectedModel ? modelMeshesRef.current.get(selectedModel.id) || null : null

  // Transform controls
  useTransformControls({
    scene: sceneRef.current,
    object: selectedMesh,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    orbitControls: controlsRef.current,
    // Default to translate so the gizmo is always visible when a model is selected.
    mode:
      activeTool === "move"
        ? "translate"
        : activeTool === "rotate"
          ? "rotate"
          : activeTool === "scale"
            ? "scale"
            : "translate",
    // Keep controls enabled whenever a model is selected; tool choice only changes the mode.
    enabled: !!selectedMesh,
    onObjectChange: (object) => {
      if (selectedModel && selectedMesh) {
        // Transform controls give us world position/rotation (with base transformations)
        // We need to subtract base transformations and top Y position to get relative position/rotation
        const { baseRotationX, basePositionZ } = getBaseTransformations()
        const position = object.position
        const rotation = object.rotation
        const scale = object.scale
        // Calculate Y position to align face closest to build plate (use object's current rotation/scale)
        const currentRotation = {
          x: rotation.x - baseRotationX,
          y: rotation.y,
          z: rotation.z
        }
        const buildPlateAlignedY = calculateBuildPlateAlignedYPosition(selectedMesh.geometry, currentRotation, scale)
        updateModelTransform(selectedModel.id, {
          position: { 
            x: position.x, 
            y: position.y - buildPlateAlignedY, 
            z: position.z - basePositionZ 
          },
          rotation: currentRotation,
          scale: { x: scale.x, y: scale.y, z: scale.z },
        })
      }
    },
  })

  // Helper to extract modelId from any intersected object (mesh or child)
  const getModelIdFromObject = useCallback((object: THREE.Object3D | null): string | null => {
    let current: THREE.Object3D | null = object
    while (current) {
      const modelId = (current as any).userData?.modelId as string | undefined
      if (modelId) {
        return modelId
      }
      current = current.parent
    }
    return null
  }, [])

  // Listen for active tool changes from AdjustmentTools
  useEffect(() => {
    const handleToolChange = (event: CustomEvent<"move" | "rotate" | "scale" | null>) => {
      setActiveTool(event.detail)
    }
    window.addEventListener("adjustment-tool-change" as any, handleToolChange)
    return () => {
      window.removeEventListener("adjustment-tool-change" as any, handleToolChange)
    }
  }, [])

  // Load build plate
  const loadBuildPlate = useCallback(async (config: typeof buildPlateConfig) => {
    if (!sceneRef.current) return

    // Remove old build plate
    if (buildPlateMeshRef.current) {
      sceneRef.current.remove(buildPlateMeshRef.current)
      buildPlateMeshRef.current.geometry.dispose()
      if (Array.isArray(buildPlateMeshRef.current.material)) {
        buildPlateMeshRef.current.material.forEach(mat => mat.dispose())
      } else {
        buildPlateMeshRef.current.material.dispose()
      }
      buildPlateMeshRef.current = null
    }

    try {
      let geometry: THREE.BufferGeometry

      if (config.fileType === "obj") {
        const loader = new OBJLoader()
        const object = await new Promise<THREE.Group>((resolve, reject) => {
          loader.load(
            config.filePath,
            (obj) => resolve(obj),
            undefined,
            (err) => reject(err)
          )
        })
        // OBJLoader returns a Group, we need to extract geometry
        // Merge all geometries into one
        const geometries: THREE.BufferGeometry[] = []
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            geometries.push(child.geometry)
          }
        })
        if (geometries.length === 0) {
          throw new Error("No geometry found in OBJ file")
        }
        // Use first geometry (or could merge if needed)
        geometry = geometries[0]
      } else {
        const loader = new STLLoader()
        geometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
          loader.load(
            config.filePath,
            (geo) => resolve(geo),
            undefined,
            (err) => reject(err)
          )
        })
      }

      // Center build plate at origin (original orientation - no rotation)
      geometry.computeBoundingBox()
      const box = geometry.boundingBox
      if (!box) {
        throw new Error("Failed to compute bounding box")
      }

      const center = box.getCenter(new THREE.Vector3())
      geometry.translate(-center.x, -center.y, -center.z)

      // Create material
      const material = new THREE.MeshPhongMaterial({
        color: meshColor,
        specular: 0x222222,
        shininess: 30,
        flatShading: false,
      })

      const mesh = new THREE.Mesh(geometry, material)
      // Rotate 270 degrees around X axis (180 + 90)
      mesh.rotation.x = (3 * Math.PI) / 2
      // Move build plate down in Y direction by 50% + 10% - 7% + 1% (54% total) of bounding box depth
      // Move build plate in +Z direction by 50% of bounding box height
      mesh.position.set(0, -config.printableArea.depth / 2 - config.printableArea.depth * 0.04, config.printableArea.height / 2)
      
      sceneRef.current.add(mesh)
      buildPlateMeshRef.current = mesh

      // Create printable area visualization
      createPrintableAreaVisualization(config)
    } catch (err) {
      console.error("Error loading build plate:", err)
      setError(err instanceof Error ? err.message : "Failed to load build plate")
    }
  }, [meshColor])

  // Create printable area visualization
  // Reference: https://neoprep.staging.ultimaker.com/ for build plate and bounding box orientation
  const createPrintableAreaVisualization = useCallback((config: typeof buildPlateConfig) => {
    if (!sceneRef.current) return

    // Remove old visualization
    if (printableAreaRef.current) {
      sceneRef.current.remove(printableAreaRef.current)
      printableAreaRef.current.geometry.dispose()
      if (printableAreaRef.current.material instanceof THREE.Material) {
        printableAreaRef.current.material.dispose()
      }
      printableAreaRef.current = null
    }

    const width = config.printableArea.width
    const depth = config.printableArea.depth
    const height = config.printableArea.height

    // Create wireframe box for printable area (green bounding box)
    // Reset to original orientation - centered at origin, no translation
    const geometry = new THREE.BoxGeometry(width, depth, height)
    const edges = new THREE.EdgesGeometry(geometry)
    const material = new THREE.LineBasicMaterial({
      color: 0x00ff00, // Green color for printable area visualization
      opacity: 0.5,
      transparent: true,
    })

    const lines = new THREE.LineSegments(edges, material)
    // Move bounding box up by 50% of its height in Z direction
    // BoxGeometry is centered by default, so moving by height/2 positions bottom at Z=0
    lines.position.set(0, 0, height / 2)
    lines.rotation.set(0, 0, 0)
    
    sceneRef.current.add(lines)
    printableAreaRef.current = lines
  }, [])

  // Load model
  const loadModel = useCallback(async (model: Model) => {
    if (!sceneRef.current || modelMeshesRef.current.has(model.id)) {
      return
    }

    try {
      let geometry: THREE.BufferGeometry
      const filePath = model.filePath

      if (filePath.endsWith(".obj")) {
        const loader = new OBJLoader()
        const object = await new Promise<THREE.Group>((resolve, reject) => {
          loader.load(
            filePath,
            (obj) => resolve(obj),
            undefined,
            (err) => reject(err)
          )
        })
        const geometries: THREE.BufferGeometry[] = []
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            geometries.push(child.geometry)
          }
        })
        if (geometries.length === 0) {
          throw new Error("No geometry found in OBJ file")
        }
        // Merge geometries if multiple
        if (geometries.length === 1) {
          geometry = geometries[0]
        } else {
          // For now, use first geometry. Could merge if BufferGeometryUtils is available
          geometry = geometries[0]
        }
      } else {
        const loader = new STLLoader()
        geometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
          loader.load(
            filePath,
            (geo) => resolve(geo),
            undefined,
            (err) => reject(err)
          )
        })
      }

      // Center geometry
      geometry.computeBoundingBox()
      const box = geometry.boundingBox
      if (!box) {
        throw new Error("Failed to compute bounding box")
      }

      const center = box.getCenter(new THREE.Vector3())
      geometry.translate(-center.x, -center.y, -center.z)

      // Create material
      const baseColor = new THREE.Color(0x4a90e2)
      const material = new THREE.MeshPhongMaterial({
        color: baseColor,
        specular: 0x222222,
        shininess: 30,
        flatShading: false,
      })

      const mesh = new THREE.Mesh(geometry, material)
      // Apply same transformations as build plate
      const { baseRotationX, basePositionZ } = getBaseTransformations()
      
      // Calculate Y position to align face closest to build plate (standard import location)
      const buildPlateAlignedY = calculateBuildPlateAlignedYPosition(geometry, model.rotation, model.scale)
      
      mesh.rotation.set(
        model.rotation.x + baseRotationX,
        model.rotation.y,
        model.rotation.z
      )
      mesh.scale.set(model.scale.x, model.scale.y, model.scale.z)
      mesh.position.set(
        model.position.x,
        model.position.y + buildPlateAlignedY,
        model.position.z + basePositionZ
      )
      mesh.userData.modelId = model.id
      mesh.userData.baseColor = baseColor

      // Selection outline (1px stroke-style edges)
      const edgeGeometry = new THREE.EdgesGeometry(geometry)
      const outlineMaterial = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 1,
        transparent: true,
        opacity: 0.9,
      })
      const outline = new THREE.LineSegments(edgeGeometry, outlineMaterial)
      outline.visible = false
      outline.userData.isSelectionOutline = true
      mesh.add(outline)
      mesh.userData.selectionOutline = outline

      sceneRef.current.add(mesh)
      modelMeshesRef.current.set(model.id, mesh)

      // Update model mesh reference in context (for validation)
      // Note: The mesh is stored in modelMeshesRef, not in the context model object
      // This is because THREE.Mesh objects shouldn't be in React state
    } catch (err) {
      console.error("Error loading model:", err)
      toast({
        title: "Error loading model",
        description: err instanceof Error ? err.message : "Failed to load model",
        variant: "destructive",
      })
    }
  }, [updateModelTransform, toast, getBaseTransformations])

  // Update model meshes when models change
  useEffect(() => {
    models.forEach(model => {
      if (!modelMeshesRef.current.has(model.id)) {
        loadModel(model)
      } else {
        const mesh = modelMeshesRef.current.get(model.id)
        if (mesh) {
          // Apply base transformations (same as build plate)
          const { baseRotationX, basePositionZ } = getBaseTransformations()
          // Calculate Y position to align face closest to build plate
          const buildPlateAlignedY = calculateBuildPlateAlignedYPosition(mesh.geometry, model.rotation, model.scale)
          mesh.rotation.set(
            model.rotation.x + baseRotationX,
            model.rotation.y,
            model.rotation.z
          )
          mesh.position.set(
            model.position.x,
            model.position.y + buildPlateAlignedY,
            model.position.z + basePositionZ
          )
          mesh.scale.set(model.scale.x, model.scale.y, model.scale.z)
        }
      }
    })

    // Remove meshes for models that no longer exist
    const modelIds = new Set(models.map(m => m.id))
    modelMeshesRef.current.forEach((mesh, id) => {
      if (!modelIds.has(id)) {
        if (sceneRef.current) {
          sceneRef.current.remove(mesh)
        }
        mesh.geometry.dispose()
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(mat => mat.dispose())
        } else {
          mesh.material.dispose()
        }
        modelMeshesRef.current.delete(id)
      }
    })
  }, [models, loadModel, getBaseTransformations, calculateBuildPlateAlignedYPosition])

  // Update model meshes when transforms change
  useEffect(() => {
    const { baseRotationX, basePositionZ } = getBaseTransformations()
    models.forEach(model => {
      const mesh = modelMeshesRef.current.get(model.id)
      if (mesh) {
        // Apply base transformations (same as build plate)
        // Calculate Y position to align face closest to build plate
        const buildPlateAlignedY = calculateBuildPlateAlignedYPosition(mesh.geometry, model.rotation, model.scale)
        mesh.rotation.set(
          model.rotation.x + baseRotationX,
          model.rotation.y,
          model.rotation.z
        )
        mesh.position.set(
          model.position.x,
          model.position.y + buildPlateAlignedY,
          model.position.z + basePositionZ
        )
        mesh.scale.set(model.scale.x, model.scale.y, model.scale.z)
      }
    })
  }, [models, getBaseTransformations, calculateBuildPlateAlignedYPosition])

  // Validate models and update errors
  useEffect(() => {
    const errors: Array<{ modelId: string; message: string; axis?: "x" | "y" | "z" }> = []
    const previousErrorCount = validationErrors.length
    
    models.forEach(model => {
      const mesh = modelMeshesRef.current.get(model.id)
        if (mesh) {
          // Create model object with mesh for validation
          const modelWithMesh: Model = { ...model, mesh }
          const validation = validatePrintableArea(modelWithMesh, buildPlateConfig)
          
          if (!validation.isValid) {
            validation.errors.forEach(err => {
              errors.push({
                modelId: model.id,
                message: err.message,
                axis: err.axis,
              })
            })
          }

          // Store validation state for later visual styling
          ;(mesh as any).userData.validationIsValid = validation.isValid
        }
    })

    setValidationErrors(errors)
    
    // Show toast notification when errors change
    if (errors.length > 0 && errors.length !== previousErrorCount) {
      const firstError = errors[0]
      toast({
        title: "Model placement error",
        description: firstError.message,
        variant: "destructive",
      })
    }
  }, [models, buildPlateConfig, setValidationErrors, validationErrors.length, toast])

  // Visual styling for hover / selection / validation
  useEffect(() => {
    modelMeshesRef.current.forEach((mesh, id) => {
      const isSelected = id === selectedModelId
      const isHovered = id === hoveredModelId
      const isValid = (mesh as any).userData?.validationIsValid !== false
      const baseColor: THREE.Color =
        (mesh as any).userData?.baseColor instanceof THREE.Color
          ? (mesh as any).userData.baseColor
          : (mesh.material instanceof THREE.MeshPhongMaterial
              ? mesh.material.color.clone()
              : new THREE.Color(0x4a90e2))

      // Update fill color (slightly brighter on hover)
      if (mesh.material instanceof THREE.MeshPhongMaterial) {
        const targetColor = isHovered
          ? baseColor.clone().lerp(new THREE.Color(0xffffff), 0.2)
          : baseColor
        mesh.material.color.copy(targetColor)

        // Validation feedback via emissive
        if (!isValid) {
          mesh.material.emissive.setHex(0xff0000)
          mesh.material.emissiveIntensity = 0.3
        } else {
          mesh.material.emissive.setHex(0x000000)
          mesh.material.emissiveIntensity = 0
        }
      }

      // Selection outline visibility
      const outline = (mesh as any).userData?.selectionOutline as THREE.LineSegments | undefined
      if (outline) {
        outline.visible = isSelected
      }
    })
  }, [hoveredModelId, selectedModelId])

  // Load build plate when printer changes or scene is initialized
  useEffect(() => {
    if (sceneReady && sceneRef.current && buildPlateConfig) {
      loadBuildPlate(buildPlateConfig)
    }
  }, [selectedPrinter, buildPlateConfig, loadBuildPlate, sceneReady])

  // Ensure build plate loads after scene initialization
  useEffect(() => {
    if (sceneReady && sceneRef.current && buildPlateConfig && !buildPlateMeshRef.current) {
      loadBuildPlate(buildPlateConfig)
    }
  }, [buildPlateConfig, loadBuildPlate, sceneReady])

  // Handle model selection via click
  const handleModelClick = useCallback((event: MouseEvent) => {
    if (!cameraRef.current || !sceneRef.current || !raycasterRef.current) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)

    const meshes = Array.from(modelMeshesRef.current.values())
    const intersects = raycasterRef.current.intersectObjects(meshes, true)

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object
      const modelId = getModelIdFromObject(clickedObject)
      if (modelId) {
        selectModel(modelId)
        return
      }
    }

    selectModel(null)
  }, [selectModel, getModelIdFromObject])

  // Handle hover state (slightly brighter model on hover)
  const handleModelHover = useCallback((event: MouseEvent) => {
    if (!cameraRef.current || !sceneRef.current || !raycasterRef.current) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)

    const meshes = Array.from(modelMeshesRef.current.values())
    const intersects = raycasterRef.current.intersectObjects(meshes, true)

    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object
      const modelId = getModelIdFromObject(hoveredObject)
      setHoveredModelId(modelId || null)
    } else {
      setHoveredModelId(null)
    }
  }, [getModelIdFromObject])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("click", handleModelClick)
    return () => {
      container.removeEventListener("click", handleModelClick)
    }
  }, [handleModelClick])

  // Hover listeners for models
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseLeave = () => setHoveredModelId(null)

    container.addEventListener("mousemove", handleModelHover)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      container.removeEventListener("mousemove", handleModelHover)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [handleModelHover])

  // Initialize scene
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let cleanup: (() => void) | null = null
    let resizeObserver: ResizeObserver | null = null

    const initializeScene = () => {
      if (!containerRef.current || isInitializedRef.current) return

      const width = container.clientWidth || 800
      const height = container.clientHeight || 600

      if (width === 0 || height === 0) {
        return
      }

      isInitializedRef.current = true
      setDebugInfo(`Initializing scene: ${width}x${height}`)
      setError(null)

      // Scene setup
      const scene = new THREE.Scene()
      scene.background = null
      sceneRef.current = scene

      // Camera setup
      const aspect = height > 0 ? width / height : 1
      const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
      camera.position.set(200, 200, 200)
      camera.lookAt(0, 0, 0)
      cameraRef.current = camera

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      })
      renderer.setSize(width, height)
      renderer.setPixelRatio(window.devicePixelRatio)
      const canvas = renderer.domElement
      canvas.style.display = "block"
      canvas.style.width = "100%"
      canvas.style.height = "100%"
      canvas.style.position = "absolute"
      canvas.style.top = "0"
      canvas.style.left = "0"
      canvas.style.pointerEvents = "auto"
      canvas.style.zIndex = "1"
      container.appendChild(canvas)
      rendererRef.current = renderer

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
      scene.add(ambientLight)

      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6)
      directionalLight1.position.set(1, 1, 1).normalize()
      scene.add(directionalLight1)

      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3)
      directionalLight2.position.set(-1, -1, -1).normalize()
      scene.add(directionalLight2)

      const topLight = new THREE.DirectionalLight(0xffffff, 0.4)
      topLight.position.set(0, 1, 0).normalize()
      scene.add(topLight)

      // OrbitControls
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.screenSpacePanning = false
      controls.minDistance = 50
      controls.maxDistance = 1000
      controls.target.set(0, 0, 0)
      controls.update()
      controlsRef.current = controls

      // Raycaster for model selection
      raycasterRef.current = new THREE.Raycaster()

      // Animation loop
      const animate = () => {
        animationFrameRef.current = requestAnimationFrame(animate)
        if (controlsRef.current) {
          controlsRef.current.update()
        }
        if (rendererRef.current && cameraRef.current && sceneRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current)
        }
      }
      animate()

      // Handle window resize
      const handleResize = () => {
        if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
        const newWidth = containerRef.current.clientWidth || 800
        const newHeight = containerRef.current.clientHeight || 600
        cameraRef.current.aspect = newWidth / newHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(newWidth, newHeight)
      }
      window.addEventListener("resize", handleResize)

      setLoading(false)
      setSceneReady(true)

      // Set cleanup function
      cleanup = () => {
        if (resizeObserver) {
          resizeObserver.disconnect()
        }
        window.removeEventListener("resize", handleResize)
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = null
        }
        if (containerRef.current && rendererRef.current?.domElement) {
          try {
            containerRef.current.removeChild(rendererRef.current.domElement)
          } catch (e) {
            // Element might already be removed
          }
        }
        if (rendererRef.current) {
          rendererRef.current.dispose()
          rendererRef.current = null
        }
        if (controlsRef.current) {
          controlsRef.current.dispose()
          controlsRef.current = null
        }
        // Clean up model meshes
        modelMeshesRef.current.forEach((mesh) => {
          mesh.geometry.dispose()
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => mat.dispose())
          } else {
            mesh.material.dispose()
          }
        })
        modelMeshesRef.current.clear()
        if (buildPlateMeshRef.current) {
          buildPlateMeshRef.current.geometry.dispose()
          if (Array.isArray(buildPlateMeshRef.current.material)) {
            buildPlateMeshRef.current.material.forEach((mat) => mat.dispose())
          } else {
            buildPlateMeshRef.current.material.dispose()
          }
        }
        if (printableAreaRef.current) {
          printableAreaRef.current.geometry.dispose()
          if (printableAreaRef.current.material instanceof THREE.Material) {
            printableAreaRef.current.material.dispose()
          }
        }
        sceneRef.current = null
        cameraRef.current = null
        isInitializedRef.current = false
        setSceneReady(false)
      }
    }

    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0 && !isInitializedRef.current) {
          initializeScene()
        }
      }
    })

    resizeObserver.observe(container)

    if (container.clientWidth > 0 && container.clientHeight > 0 && !isInitializedRef.current) {
      initializeScene()
    }

    const tryInitialize = (attempt = 1, maxAttempts = 5) => {
      if (isInitializedRef.current) return

      if (!containerRef.current) {
        if (attempt < maxAttempts) {
          setTimeout(() => tryInitialize(attempt + 1, maxAttempts), 100 * attempt)
        }
        return
      }

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      if (width > 0 && height > 0) {
        initializeScene()
      } else if (attempt < maxAttempts) {
        setTimeout(() => tryInitialize(attempt + 1, maxAttempts), 100 * attempt)
      }
    }

    const timeoutId = setTimeout(() => tryInitialize(), 100)

    return () => {
      clearTimeout(timeoutId)
      if (cleanup) {
        cleanup()
      }
    }
  }, [])

  // Handle build plate change
  const handleBuildPlateChange = useCallback((printerId: string) => {
    setSelectedPrinter(printerId)
  }, [setSelectedPrinter])

  // Handle model change
  const handleModelChange = useCallback(async (modelId: string) => {
    setSelectedModelConfig(modelId)
    const modelConfig = MODEL_CONFIGS.find(m => m.modelId === modelId)
    if (modelConfig) {
      // Clear existing models and add the new one
      clearModels()
      await addModel(modelConfig.filePath, modelConfig.modelName)
    }
  }, [addModel, clearModels])

  return (
    <div
      className="w-full h-full relative backdrop-blur-sm rounded-lg"
      style={{
        backgroundColor: "rgba(250, 248, 246, 0.5)",
        backdropFilter: "blur(4px)",
        width: "100%",
        height: "100%",
        minWidth: "100%",
        minHeight: "600px",
        display: "flex",
        flexDirection: "column",
        pointerEvents: "auto",
      }}
    >
      {/* Dropdown Controls Overlay - Only show in standalone mode */}
      {showDropdowns && (
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-3 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 p-4 shadow-lg">
          <div className="flex flex-col gap-2">
            <Label htmlFor="build-plate-select" className="text-xs font-semibold text-gray-700">
              Build Plate
            </Label>
            <Select
              value={selectedPrinter}
              onValueChange={handleBuildPlateChange}
            >
              <SelectTrigger id="build-plate-select" className="w-[200px]">
                <SelectValue placeholder="Select build plate" />
              </SelectTrigger>
              <SelectContent>
                {BUILD_PLATE_CONFIGS.map((config) => (
                  <SelectItem key={config.printerId} value={config.printerId}>
                    {config.printerName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="model-select" className="text-xs font-semibold text-gray-700">
              Model
            </Label>
            <Select
              value={selectedModelConfig}
              onValueChange={handleModelChange}
            >
              <SelectTrigger id="model-select" className="w-[200px]">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {MODEL_CONFIGS.map((config) => (
                  <SelectItem key={config.modelId} value={config.modelId}>
                    {config.modelName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 border-2 border-red-200 rounded p-4 z-10">
          <div className="text-center">
            <p className="text-red-600 font-semibold mb-2">Error loading 3D model</p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        </div>
      )}
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <p className="text-gray-600">Loading 3D viewport...</p>
            <p className="text-gray-500 text-xs mt-1">{debugInfo}</p>
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full h-full flex-1"
        style={{
          width: "100%",
          height: "100%",
          minWidth: "100%",
          minHeight: "600px",
          position: "relative",
          overflow: "hidden",
          display: "block",
          flex: "1 1 auto",
          pointerEvents: "auto",
        }}
      />
    </div>
  )
}
