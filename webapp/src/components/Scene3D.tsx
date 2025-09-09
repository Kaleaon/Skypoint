import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const Scene3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene?: THREE.Scene
    camera?: THREE.PerspectiveCamera
    renderer?: THREE.WebGLRenderer
    cube?: THREE.Mesh
    animationId?: number
  }>({})

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x111122)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mountRef.current.appendChild(renderer.domElement)

    // Create a simple 3D scene similar to Second Life primitives
    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20)
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x336633 })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // Cube (primitive object)
    const cubeGeometry = new THREE.BoxGeometry()
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x4ecdc4 })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.position.y = 1
    cube.castShadow = true
    scene.add(cube)

    // Sky box simulation
    const skyGeometry = new THREE.SphereGeometry(50, 32, 32)
    const skyMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x87ceeb,
      side: THREE.BackSide 
    })
    const sky = new THREE.Mesh(skyGeometry, skyMaterial)
    scene.add(sky)

    // Lighting (similar to Second Life world lighting)
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    scene.add(directionalLight)

    // Store references
    sceneRef.current = { scene, camera, renderer, cube }

    // Animation loop
    const animate = () => {
      if (sceneRef.current.cube) {
        sceneRef.current.cube.rotation.x += 0.01
        sceneRef.current.cube.rotation.y += 0.01
      }

      if (sceneRef.current.renderer && sceneRef.current.scene && sceneRef.current.camera) {
        sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera)
      }

      sceneRef.current.animationId = requestAnimationFrame(animate)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !sceneRef.current.camera || !sceneRef.current.renderer) return
      
      const width = mountRef.current.clientWidth
      const height = mountRef.current.clientHeight
      
      sceneRef.current.camera.aspect = width / height
      sceneRef.current.camera.updateProjectionMatrix()
      sceneRef.current.renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId)
      }
      
      if (sceneRef.current.renderer && mountRef.current) {
        mountRef.current.removeChild(sceneRef.current.renderer.domElement)
        sceneRef.current.renderer.dispose()
      }
    }
  }, [])

  return (
    <div className="scene-container">
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      <div className="scene-overlay">
        <div><span className="status-indicator connected"></span>WebGL Renderer: Active</div>
        <div>Three.js Version: {THREE.REVISION}</div>
        <div>Primitives: 3 (Ground, Cube, Sky)</div>
        <div>Lighting: Ambient + Directional</div>
      </div>
    </div>
  )
}