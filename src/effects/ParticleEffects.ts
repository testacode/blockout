import * as THREE from 'three'

// ParticleEffects - Three.js particle systems for visual effects
// Phase 5: Will implement particle effects for line clears
// Using Three.js Points with BufferGeometry for performance

export class ParticleEffects {
  private scene: THREE.Scene

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  // Spawn particles when a layer is cleared
  spawnLineClearEffect(y: number): void {
    // TODO: Phase 5
    // - Create BufferGeometry with particle positions
    // - Use PointsMaterial with color and size
    // - Animate particles outward from cleared layer
    // - Fade out over time
    // - Remove from scene when complete
    console.log(`Line clear effect at y=${y} (not yet implemented)`)
  }

  // Update particle animations
  update(deltaTime: number): void {
    // TODO: Phase 5
    // - Update particle positions
    // - Update opacity/fade
    // - Remove completed effects
  }
}
