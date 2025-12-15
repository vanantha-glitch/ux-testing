"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { TransformControls as ThreeTransformControls } from "three/examples/jsm/controls/TransformControls.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

interface UseTransformControlsProps {
  object: THREE.Object3D | null
  camera: THREE.Camera | null
  renderer: THREE.WebGLRenderer | null
  orbitControls: OrbitControls | null
  mode: "translate" | "rotate" | "scale" | null
  enabled: boolean
  onObjectChange?: (object: THREE.Object3D) => void
}

/**
 * Hook to manage TransformControls for a 3D object
 */
export function useTransformControls({
  object,
  camera,
  renderer,
  orbitControls,
  mode,
  enabled,
  onObjectChange,
}: UseTransformControlsProps) {
  const controlsRef = useRef<ThreeTransformControls | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)

  useEffect(() => {
    if (!camera || !renderer || !object) {
      return
    }

    // Get the scene from the object
    if (!sceneRef.current && object.parent) {
      sceneRef.current = object.parent as THREE.Scene
    }

    if (!sceneRef.current) {
      return
    }

    // Create TransformControls
    const controls = new ThreeTransformControls(camera, renderer.domElement)
    controls.attach(object)
    controls.setMode(mode || "translate")
    controls.enabled = enabled

    // Disable orbit controls when dragging
    controls.addEventListener("dragging-changed", (event) => {
      if (orbitControls) {
        orbitControls.enabled = !event.value
      }
    })

    // Listen for changes
    controls.addEventListener("change", () => {
      if (onObjectChange && object) {
        onObjectChange(object)
      }
    })

    sceneRef.current.add(controls)
    controlsRef.current = controls

    return () => {
      if (controlsRef.current && sceneRef.current) {
        sceneRef.current.remove(controlsRef.current)
        controlsRef.current.dispose()
        controlsRef.current = null
      }
    }
  }, [object, camera, renderer, orbitControls, mode, enabled, onObjectChange])

  // Update mode when it changes
  useEffect(() => {
    if (controlsRef.current && mode) {
      controlsRef.current.setMode(mode)
    }
  }, [mode])

  // Update enabled state
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = enabled
    }
  }, [enabled])

  return controlsRef.current
}

