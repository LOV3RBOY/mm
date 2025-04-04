"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { simulationVertexShader, simulationFragmentShader, renderVertexShader, renderFragmentShader } from "./shaders"

interface LiquidEffectProps {
  imageUrl: string
  onLoad?: () => void
}

export default function LiquidEffect({ imageUrl, onLoad }: LiquidEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const simScene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Mouse tracking
    const mouse = new THREE.Vector2(0, 0)
    let frame = 0
    let isPointerDown = false

    // Render targets for ping-pong buffer
    const width = window.innerWidth * window.devicePixelRatio
    const height = window.innerHeight * window.devicePixelRatio
    const options = {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
      depthBuffer: false,
    }
    let rtA = new THREE.WebGLRenderTarget(width, height, options)
    let rtB = new THREE.WebGLRenderTarget(width, height, options)

    // Simulation material
    const simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        mouse: { value: mouse },
        resolution: { value: new THREE.Vector2(width, height) },
        time: { value: 0 },
        frame: { value: 0 },
      },
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
    })

    // Load the image texture
    const textureLoader = new THREE.TextureLoader()
    const imageTexture = textureLoader.load(imageUrl, () => {
      if (onLoad) onLoad()

      // Removed the automatic random ripples as requested
    })

    imageTexture.minFilter = THREE.LinearFilter
    imageTexture.magFilter = THREE.LinearFilter

    // Render material
    const renderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        textureB: { value: imageTexture },
      },
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      transparent: true,
    })

    // Create meshes
    const plane = new THREE.PlaneGeometry(2, 2)
    const simQuad = new THREE.Mesh(plane, simMaterial)
    const renderQuad = new THREE.Mesh(plane, renderMaterial)

    simScene.add(simQuad)
    scene.add(renderQuad)

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth * window.devicePixelRatio
      const newHeight = window.innerHeight * window.devicePixelRatio

      renderer.setSize(window.innerWidth, window.innerHeight)
      rtA.setSize(newWidth, newHeight)
      rtB.setSize(newWidth, newHeight)
      simMaterial.uniforms.resolution.value.set(newWidth, newHeight)
    }

    window.addEventListener("resize", handleResize)

    // Handle pointer events
    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return

      mouse.x = e.clientX * window.devicePixelRatio
      mouse.y = (window.innerHeight - e.clientY) * window.devicePixelRatio
    }

    const handlePointerDown = (e: PointerEvent) => {
      isPointerDown = true
      mouse.x = e.clientX * window.devicePixelRatio
      mouse.y = (window.innerHeight - e.clientY) * window.devicePixelRatio
    }

    const handlePointerUp = () => {
      isPointerDown = false
      mouse.set(0, 0)
    }

    const handlePointerLeave = () => {
      if (isPointerDown) {
        isPointerDown = false
        mouse.set(0, 0)
      }
    }

    renderer.domElement.addEventListener("pointermove", handlePointerMove)
    renderer.domElement.addEventListener("pointerdown", handlePointerDown)
    renderer.domElement.addEventListener("pointerup", handlePointerUp)
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave)

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate)

      simMaterial.uniforms.frame.value = frame++
      simMaterial.uniforms.time.value = performance.now() / 1000

      simMaterial.uniforms.textureA.value = rtA.texture
      renderer.setRenderTarget(rtB)
      renderer.render(simScene, camera)

      renderMaterial.uniforms.textureA.value = rtB.texture
      renderer.setRenderTarget(null)
      renderer.render(scene, camera)

      // Ping-pong buffers
      const temp = rtA
      rtA = rtB
      rtB = temp

      return animationId
    }

    const animationId = animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
      renderer.domElement.removeEventListener("pointermove", handlePointerMove)
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown)
      renderer.domElement.removeEventListener("pointerup", handlePointerUp)
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave)

      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }

      // Dispose resources
      rtA.dispose()
      rtB.dispose()
      plane.dispose()
      simMaterial.dispose()
      renderMaterial.dispose()
      imageTexture.dispose()
    }
  }, [imageUrl, onLoad])

  return <div ref={containerRef} className="absolute inset-0 z-0" />
}

