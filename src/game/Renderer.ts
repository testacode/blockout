import * as THREE from 'three'
import { ParticleEffects } from '../effects/ParticleEffects'
import { gridToWorld, keyToBlock } from '../utils/coordinates'
import { addVector3 } from '../utils/collision'
import type { Piece3D, GameWell } from '../types'

// Renderer - Three.js scene, camera, and rendering
// Consumes game state but never modifies it (separation of concerns)

export class Renderer {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private particleEffects: ParticleEffects
  private currentPieceMeshes: THREE.Mesh[] = []
  private occupiedBlockMeshes: Map<string, THREE.Mesh> = new Map()

  constructor(container: HTMLElement) {
    // Create scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x0a0a0a)

    // Create camera
    // Top-down angled camera at (2.5, 20, 12) looking at well center (2.5, 5, 2.5)
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.set(2.5, 20, 12)
    this.camera.lookAt(2.5, 5, 2.5)

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(this.renderer.domElement)

    // Add lighting
    this.setupLighting()

    // Initialize particle effects
    this.particleEffects = new ParticleEffects(this.scene)

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this))
  }

  private setupLighting(): void {
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    this.scene.add(ambientLight)

    // Directional light for depth
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 20, 10)
    this.scene.add(directionalLight)
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  getScene(): THREE.Scene {
    return this.scene
  }

  getParticleEffects(): ParticleEffects {
    return this.particleEffects
  }

  render(): void {
    this.renderer.render(this.scene, this.camera)
  }

  update(deltaTime: number): void {
    this.particleEffects.update(deltaTime)
  }

  dispose(): void {
    window.removeEventListener('resize', this.onWindowResize.bind(this))
    this.renderer.dispose()
  }

  updateCurrentPiece(piece: Piece3D | null): void {
    // Remove old piece meshes
    this.currentPieceMeshes.forEach(mesh => {
      this.scene.remove(mesh)
      mesh.geometry.dispose()
      if (mesh.material instanceof THREE.Material) {
        mesh.material.dispose()
      }
    })
    this.currentPieceMeshes = []

    if (!piece) {
      return
    }

    // Create new meshes for current piece
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshPhongMaterial({
      color: piece.color,
      emissive: piece.color,
      emissiveIntensity: 0.2
    })

    for (const block of piece.blocks) {
      const worldPos = addVector3(piece.position, block)
      const renderPos = gridToWorld(worldPos)

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(renderPos.x, renderPos.y, renderPos.z)

      this.scene.add(mesh)
      this.currentPieceMeshes.push(mesh)
    }
  }

  updateOccupiedBlocks(well: GameWell): void {
    // Remove blocks that no longer exist
    const currentKeys = new Set(well.occupiedCells.keys())

    this.occupiedBlockMeshes.forEach((mesh, key) => {
      if (!currentKeys.has(key)) {
        this.scene.remove(mesh)
        mesh.geometry.dispose()
        if (mesh.material instanceof THREE.Material) {
          mesh.material.dispose()
        }
        this.occupiedBlockMeshes.delete(key)
      }
    })

    // Add new blocks
    well.occupiedCells.forEach((color, key) => {
      if (!this.occupiedBlockMeshes.has(key)) {
        const pos = keyToBlock(key)
        const renderPos = gridToWorld(pos)

        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshPhongMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.1
        })

        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(renderPos.x, renderPos.y, renderPos.z)

        this.scene.add(mesh)
        this.occupiedBlockMeshes.set(key, mesh)
      }
    })
  }
}
