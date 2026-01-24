import * as THREE from 'three';

// ParticleEffects - Three.js particle systems for visual effects
// Using Three.js Points with BufferGeometry for performance

type ParticleSystem = {
  points: THREE.Points;
  velocities: Float32Array;
  lifetimes: Float32Array;
  maxLifetime: number;
  age: number;
};

export class ParticleEffects {
  private scene: THREE.Scene;
  private activeSystems: ParticleSystem[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  // Check if there are active particle effects (for dirty flag rendering)
  hasActiveEffects(): boolean {
    return this.activeSystems.length > 0;
  }

  // Clean up all active particle systems
  dispose(): void {
    for (const system of this.activeSystems) {
      this.scene.remove(system.points);
      system.points.geometry.dispose();
      if (system.points.material instanceof THREE.Material) {
        system.points.material.dispose();
      }
    }
    this.activeSystems = [];
  }

  // Spawn particles when a layer is cleared
  spawnLineClearEffect(y: number): void {
    const particleCount = 100; // Total particles for the effect
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const lifetimes = new Float32Array(particleCount);
    const maxLifetime = 1000; // 1 second effect duration

    // Generate particles across the 5x5 layer
    for (let i = 0; i < particleCount; i++) {
      // Random position within the 5x5 layer
      const x = Math.random() * 5;
      const z = Math.random() * 5;

      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Random outward velocity
      const speed = 2 + Math.random() * 3;
      const angle = Math.random() * Math.PI * 2;
      velocities[i * 3 + 0] = Math.cos(angle) * speed; // X velocity
      velocities[i * 3 + 1] = 2 + Math.random() * 3; // Y velocity (upward)
      velocities[i * 3 + 2] = Math.sin(angle) * speed; // Z velocity

      lifetimes[i] = maxLifetime;
    }

    // Create geometry and material
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.3,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    this.scene.add(points);

    // Track this particle system
    this.activeSystems.push({
      points,
      velocities,
      lifetimes,
      maxLifetime,
      age: 0,
    });

    console.debug(`[ParticleEffects] Spawned ${particleCount} particles at y=${y}`);
  }

  // Update particle animations
  update(deltaTime: number): void {
    const deltaSeconds = deltaTime / 1000;

    for (let i = this.activeSystems.length - 1; i >= 0; i--) {
      const system = this.activeSystems[i];
      system.age += deltaTime;

      // Remove completed systems
      if (system.age >= system.maxLifetime) {
        this.scene.remove(system.points);
        system.points.geometry.dispose();
        if (system.points.material instanceof THREE.Material) {
          system.points.material.dispose();
        }
        this.activeSystems.splice(i, 1);
        continue;
      }

      // Update particle positions and opacity
      const positions = system.points.geometry.attributes.position.array as Float32Array;
      const particleCount = positions.length / 3;

      for (let j = 0; j < particleCount; j++) {
        // Update position based on velocity
        positions[j * 3 + 0] += system.velocities[j * 3 + 0] * deltaSeconds;
        positions[j * 3 + 1] += system.velocities[j * 3 + 1] * deltaSeconds;
        positions[j * 3 + 2] += system.velocities[j * 3 + 2] * deltaSeconds;

        // Apply gravity to Y velocity
        system.velocities[j * 3 + 1] -= 5 * deltaSeconds;
      }

      system.points.geometry.attributes.position.needsUpdate = true;

      // Fade out based on age
      const lifeProgress = system.age / system.maxLifetime;
      const material = system.points.material as THREE.PointsMaterial;
      material.opacity = 1.0 - lifeProgress;
    }
  }
}
