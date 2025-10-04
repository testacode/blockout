import * as THREE from 'three'
import { ParticleEffects } from '../effects/ParticleEffects'

// Renderer - Three.js scene, camera, and rendering
// Consumes game state but never modifies it (separation of concerns)

export class Renderer {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private particleEffects: ParticleEffects

  constructor(container: HTMLElement) {
    // Create scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x0a0a0a)

    // Create camera
    // Camera at (15, 15, 15) looking at well center (2.5, 5, 2.5)
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.set(15, 15, 15)
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
}
