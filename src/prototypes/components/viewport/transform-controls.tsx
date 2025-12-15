"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { TransformControls as ThreeTransformControls } from "three/examples/jsm/controls/TransformControls.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

interface UseTransformControlsProps {
  scene: THREE.Scene | null
  object: THREE.Object3D | null
  camera: THREE.Camera | null
  renderer: THREE.WebGLRenderer | null
  orbitControls: OrbitControls | null
  mode: "translate" | "rotate" | "scale" | null
  enabled: boolean
  onObjectChange?: (object: THREE.Object3D) => void
}

/**
 * Hook to manage TransformControls for a 3D object.
 * The controls are attached to the provided object and added to the given scene.
 */
export function useTransformControls({
  scene,
  object,
  camera,
  renderer,
  orbitControls,
  mode,
  enabled,
  onObjectChange,
}: UseTransformControlsProps) {
  const controlsRef = useRef<ThreeTransformControls | null>(null)

  useEffect(() => {
    if (!scene || !camera || !renderer || !object) {
      return
    }

    // Clean up any existing controls before creating new ones
    if (controlsRef.current) {
      scene.remove(controlsRef.current)
      controlsRef.current.dispose()
      controlsRef.current = null
    }

    const controls = new ThreeTransformControls(camera, renderer.domElement)

    // Attach to the object – this will place the gizmo at the object's origin,
    // which we've already aligned with the center of its bounding volume.
    controls.attach(object)

    // Initial mode and visibility
    const initialMode = mode || "translate"
    controls.setMode(initialMode)
    controls.enabled = enabled
    controls.visible = enabled

    // Disable orbit controls when dragging
    controls.addEventListener("dragging-changed", (event) => {
      if (orbitControls) {
        orbitControls.enabled = !event.value
      }
    })

    // Listen for changes
    controls.addEventListener("objectChange", () => {
      if (onObjectChange && object) {
        onObjectChange(object)
      }
    })

    scene.add(controls)
    controlsRef.current = controls

    return () => {
      if (controlsRef.current) {
        scene.remove(controlsRef.current)
        controlsRef.current.dispose()
        controlsRef.current = null
      }
    }
  }, [scene, object, camera, renderer, orbitControls, mode, enabled, onObjectChange])

  // Update mode when it changes
  useEffect(() => {
    if (controlsRef.current && mode) {
      controlsRef.current.setMode(mode)
    }
  }, [mode])

  // Update enabled state / visibility when it changes
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = enabled
      controlsRef.current.visible = enabled
    }
  }, [enabled])

  return controlsRef.current
}

