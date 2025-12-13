"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"

interface ViewportProps {
  stlPath?: string
  backgroundColor?: string
  meshColor?: string
}

export default function Viewport({
  stlPath = "/meshes/ultimaker_method_platform.stl",
  backgroundColor = "#FAF8F6",
  meshColor = "#d9d9d9",
}: ViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const isInitializedRef = useRef<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string>("Initializing...")

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let cleanup: (() => void) | null = null
    let resizeObserver: ResizeObserver | null = null
    let eventListenersCleanup: (() => void) | null = null
    
    const initializeScene = () => {
      if (!containerRef.current || isInitializedRef.current) return
      
      const width = container.clientWidth || 800
      const height = container.clientHeight || 600

      // Don't initialize if dimensions are still zero
      if (width === 0 || height === 0) {
        return
      }

      isInitializedRef.current = true
      console.log("Initializing Three.js scene with dimensions:", width, height)
      setDebugInfo(`Initializing scene: ${width}x${height}`)
      setError(null)

      // Scene setup
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(backgroundColor)
      sceneRef.current = scene

      // Camera setup - handle division by zero
      const aspect = height > 0 ? width / height : 1
      const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
      camera.position.set(0, 0, 100)
      cameraRef.current = camera

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: false, // Set to false so background shows properly
        preserveDrawingBuffer: true
      })
      renderer.setSize(width, height)
      renderer.setPixelRatio(window.devicePixelRatio)
      const canvas = renderer.domElement
      canvas.style.display = 'block'
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      canvas.style.position = 'absolute'
      canvas.style.top = '0'
      canvas.style.left = '0'
      canvas.style.pointerEvents = 'auto' // Ensure canvas can receive pointer events
      canvas.style.zIndex = '1' // Ensure canvas is above background
      container.appendChild(canvas)
      rendererRef.current = renderer
      
      // Verify canvas is set up correctly
      console.log('Canvas pointer events:', canvas.style.pointerEvents)
      console.log('Canvas z-index:', canvas.style.zIndex)

      // Lighting setup - similar to Neoprep style (softer, more even lighting)
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
      scene.add(ambientLight)

      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6)
      directionalLight1.position.set(1, 1, 1).normalize()
      scene.add(directionalLight1)

      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3)
      directionalLight2.position.set(-1, -1, -1).normalize()
      scene.add(directionalLight2)
      
      // Add a top light for better visibility
      const topLight = new THREE.DirectionalLight(0xffffff, 0.4)
      topLight.position.set(0, 1, 0).normalize()
      scene.add(topLight)

      // Add a test cube to verify rendering (temporary - remove after debugging)
      // const testGeometry = new THREE.BoxGeometry(10, 10, 10)
      // const testMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 })
      // const testCube = new THREE.Mesh(testGeometry, testMaterial)
      // testCube.position.set(0, 0, 0)
      // scene.add(testCube)
      // console.log("Test cube added to scene")

      // OrbitControls setup
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.screenSpacePanning = false
      controls.minDistance = 10
      controls.maxDistance = 500
      controls.enablePan = true
      controls.enableRotate = true
      controls.enableZoom = true
      
      // Add event listeners to verify controls are receiving events
      const handleMouseDown = () => {
        console.log('Canvas mousedown event')
        setDebugInfo('Mouse down on canvas')
      }
      const handleMouseMove = () => {
        // Only log occasionally to avoid spam
        if (Math.random() < 0.01) {
          console.log('Canvas mousemove event')
        }
      }
      
      canvas.addEventListener('mousedown', handleMouseDown)
      canvas.addEventListener('mousemove', handleMouseMove)
      
      // Store cleanup for event listeners
      eventListenersCleanup = () => {
        canvas.removeEventListener('mousedown', handleMouseDown)
        canvas.removeEventListener('mousemove', handleMouseMove)
      }
      
      controlsRef.current = controls

      // Load STL file
      const loader = new STLLoader()
      loader.load(
        stlPath,
        (geometry) => {
          try {
            console.log("STL file loaded successfully", geometry)
            setDebugInfo("STL file loaded, processing geometry...")
            
            // Compute bounding box BEFORE centering
            geometry.computeBoundingBox()
            const box = geometry.boundingBox
            if (!box) {
              throw new Error("Failed to compute bounding box")
            }
            
            const size = box.getSize(new THREE.Vector3())
            const center = box.getCenter(new THREE.Vector3())
            const maxDim = Math.max(size.x, size.y, size.z)
            
            console.log("Geometry size:", size, "maxDim:", maxDim, "center:", center)
            setDebugInfo(`Geometry: ${maxDim.toFixed(2)} max dimension`)
            
            if (maxDim === 0) {
              throw new Error("STL file appears to be empty or invalid")
            }
            
            // Center the geometry
            geometry.translate(-center.x, -center.y, -center.z)
            
            // Scale to fit in view (adjust scale factor as needed)
            const scale = 50 / maxDim
            geometry.scale(scale, scale, scale)
            
            console.log("Scaled geometry, scale factor:", scale)
            setDebugInfo(`Scaled: ${scale.toFixed(4)}x`)

            // Create material with light grey matte finish (similar to Neoprep)
            const material = new THREE.MeshPhongMaterial({
              color: meshColor,
              specular: 0x222222,
              shininess: 30,
              flatShading: false,
            })

            const mesh = new THREE.Mesh(geometry, material)
            // Rotate 90 degrees + 180 degrees (270 degrees total) around X axis
            mesh.rotation.x = Math.PI / 2 + Math.PI
            scene.add(mesh)
            meshRef.current = mesh

            console.log("Mesh added to scene", mesh.position, mesh.rotation)
            setDebugInfo("Mesh added to scene")

            // Adjust camera to fit the model (after scaling)
            // The center is at origin (0,0,0) after centering
            // Position camera for isometric view (looking down and from front-right)
            const scaledSize = maxDim * scale
            const distance = scaledSize * 2.5
            // Isometric view: front-right and slightly above
            camera.position.set(distance * 0.7, distance * 0.5, distance * 0.7)
            camera.lookAt(0, 0, 0)
            controls.target.set(0, 0, 0)
            controls.update()
            
            console.log("Camera positioned at:", camera.position, "looking at:", controls.target)
            setDebugInfo(`Camera: (${camera.position.x.toFixed(1)}, ${camera.position.y.toFixed(1)}, ${camera.position.z.toFixed(1)})`)
            
            // Force a render to ensure the model is visible
            if (rendererRef.current && cameraRef.current && sceneRef.current) {
              rendererRef.current.render(sceneRef.current, cameraRef.current)
              setDebugInfo("Model rendered successfully!")
            }
            
            setLoading(false)
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Unknown error processing STL file"
            console.error("Error processing STL file:", err)
            setError(errorMsg)
            setLoading(false)
          }
        },
        (progress) => {
          // Loading progress
          if (progress.total > 0) {
            const percent = (progress.loaded / progress.total) * 100
            console.log("Loading progress:", percent + "%")
          }
        },
        (error) => {
          const errorMsg = (error instanceof Error ? error.message : String(error)) || "Failed to load STL file"
          console.error("Error loading STL file:", error)
          setDebugInfo(`Error: ${errorMsg}`)
          setError(`Failed to load STL file: ${errorMsg}. Path: ${stlPath}`)
          setLoading(false)
        }
      )

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
        // Clean up event listeners before removing canvas
        if (eventListenersCleanup) {
          eventListenersCleanup()
          eventListenersCleanup = null
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
        if (meshRef.current) {
          meshRef.current.geometry.dispose()
          if (Array.isArray(meshRef.current.material)) {
            meshRef.current.material.forEach((mat) => mat.dispose())
          } else {
            meshRef.current.material.dispose()
          }
          meshRef.current = null
        }
        if (controlsRef.current) {
          controlsRef.current.dispose()
          controlsRef.current = null
        }
        sceneRef.current = null
        cameraRef.current = null
        isInitializedRef.current = false
      }
    }

    // Use ResizeObserver to wait for container dimensions
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0 && !isInitializedRef.current) {
          initializeScene()
        }
      }
    })

    resizeObserver.observe(container)

    // Also try to initialize immediately if dimensions are already available
    if (container.clientWidth > 0 && container.clientHeight > 0 && !isInitializedRef.current) {
      initializeScene()
    }
    
    // Fallback: try multiple times with increasing delays in case dimensions aren't ready yet
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
      
      // Use a reasonable minimum if dimensions are still zero
      const effectiveWidth = width > 0 ? width : 800
      const effectiveHeight = height > 0 ? height : 600
      
      if (width > 0 && height > 0) {
        console.log(`Initialization attempt ${attempt} with dimensions:`, width, height)
        initializeScene()
      } else if (attempt < maxAttempts) {
        console.log(`Initialization attempt ${attempt} - dimensions not ready (${width}x${height}), retrying...`)
        setTimeout(() => tryInitialize(attempt + 1, maxAttempts), 100 * attempt)
      } else {
        // Last attempt - use fallback dimensions if still zero
        console.warn("Container still has zero dimensions after all attempts, using fallback:", effectiveWidth, effectiveHeight)
        if (effectiveWidth > 0 && effectiveHeight > 0) {
          initializeScene()
        }
      }
    }
    
    const timeoutId = setTimeout(() => tryInitialize(), 100)

    // Return cleanup from useEffect
    return () => {
      clearTimeout(timeoutId)
      if (cleanup) {
        cleanup()
      }
    }
  }, [stlPath, backgroundColor, meshColor])

  return (
    <div 
      className="w-full h-full relative" 
      style={{ 
        backgroundColor: '#FAF8F6',
        width: '100%',
        height: '100%',
        minWidth: '100%',
        minHeight: '600px', // Ensure minimum height for standalone view
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'auto' // Ensure this container can receive pointer events
      }}
    >
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 border-2 border-red-200 rounded p-4 z-10">
          <div className="text-center">
            <p className="text-red-600 font-semibold mb-2">Error loading 3D model</p>
            <p className="text-red-500 text-sm">{error}</p>
            <p className="text-red-400 text-xs mt-2">Check browser console for details</p>
          </div>
        </div>
      )}
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <p className="text-gray-600">Loading 3D model...</p>
            <p className="text-gray-400 text-xs mt-2">Path: {stlPath}</p>
            <p className="text-gray-500 text-xs mt-1">{debugInfo}</p>
          </div>
        </div>
      )}
      <div 
        ref={containerRef} 
        className="w-full h-full flex-1" 
        style={{ 
          width: '100%', 
          height: '100%',
          minWidth: '100%',
          minHeight: '600px', // Ensure minimum height
          position: 'relative',
          overflow: 'hidden',
          display: 'block',
          flex: '1 1 auto',
          pointerEvents: 'auto' // Ensure this div can receive pointer events
        }} 
      />
    </div>
  )
}



