import * as THREE from 'three';
import { ParticleEffects } from '../effects/ParticleEffects';
import type { GameWell, Piece3D } from '../types';
import { addVector3 } from '../utils/collision';
import { gridToWorld, keyToBlock } from '../utils/coordinates';

// Renderer - Three.js scene, camera, and rendering
// Consumes game state but never modifies it (separation of concerns)

// Cached geometry for reuse (avoids GC pressure)
type GeometryCache = {
  box: THREE.BoxGeometry;
  edges: THREE.EdgesGeometry;
};

export class Renderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private particleEffects: ParticleEffects;
  private currentPieceWireframes: THREE.LineSegments[] = [];
  private occupiedBlockWireframes: Map<string, THREE.LineSegments> = new Map();
  private container: HTMLElement;
  private boundResizeHandler: () => void;

  // Caches for geometry and materials (performance optimization)
  private geometryCache: GeometryCache;
  private materialCache: Map<string, THREE.LineBasicMaterial> = new Map();

  // Object pool for wireframes (reduces GC pressure)
  private wireframePool: THREE.LineSegments[] = [];

  // Dirty flag for conditional rendering
  private needsRender: boolean = true;

  constructor(container: HTMLElement) {
    // Store container reference
    this.container = container;

    // Initialize geometry cache (reused for all blocks)
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.geometryCache = {
      box: boxGeometry,
      edges: new THREE.EdgesGeometry(boxGeometry),
    };

    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);

    // Get container dimensions
    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width || 600;
    const height = containerRect.height || 600;

    // Create camera
    // Top-down view with perspective
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.set(2.5, 20, 2.5);
    this.camera.lookAt(2.5, 7.5, 2.5); // Center of 15-height well

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Add lighting
    this.setupLighting();

    // Initialize particle effects
    this.particleEffects = new ParticleEffects(this.scene);

    // Handle window resize (store bound reference for proper cleanup)
    this.boundResizeHandler = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.boundResizeHandler);
  }

  private setupLighting(): void {
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional light for depth
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    this.scene.add(directionalLight);
  }

  private onWindowResize(): void {
    const containerRect = this.container.getBoundingClientRect();
    const width = containerRect.width || 600;
    const height = containerRect.height || 600;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  getScene(): THREE.Scene {
    return this.scene;
  }

  getParticleEffects(): ParticleEffects {
    return this.particleEffects;
  }

  render(): void {
    // Skip render if no changes and no active particle effects
    if (!this.needsRender && !this.particleEffects.hasActiveEffects()) {
      return;
    }
    this.renderer.render(this.scene, this.camera);
    this.needsRender = false;
  }

  // Mark scene as needing re-render
  markDirty(): void {
    this.needsRender = true;
  }

  update(deltaTime: number): void {
    this.particleEffects.update(deltaTime);
  }

  dispose(): void {
    window.removeEventListener('resize', this.boundResizeHandler);
    this.particleEffects.dispose();

    // Dispose cached geometries
    this.geometryCache.box.dispose();
    this.geometryCache.edges.dispose();

    // Dispose cached materials
    for (const material of this.materialCache.values()) {
      material.dispose();
    }
    this.materialCache.clear();

    this.renderer.dispose();
  }

  // Get or create cached material for a color
  private getMaterial(color: string): THREE.LineBasicMaterial {
    let material = this.materialCache.get(color);
    if (!material) {
      material = new THREE.LineBasicMaterial({ color });
      this.materialCache.set(color, material);
    }
    return material;
  }

  // Get a wireframe from pool or create new one
  private getWireframe(material: THREE.LineBasicMaterial): THREE.LineSegments {
    const wireframe = this.wireframePool.pop();
    if (wireframe) {
      wireframe.material = material;
      wireframe.visible = true;
      return wireframe;
    }
    return new THREE.LineSegments(this.geometryCache.edges, material);
  }

  // Return a wireframe to the pool for reuse
  private returnToPool(wireframe: THREE.LineSegments): void {
    this.scene.remove(wireframe);
    wireframe.visible = false;
    this.wireframePool.push(wireframe);
  }

  updateCurrentPiece(piece: Piece3D | null): void {
    // Return old wireframes to pool for reuse
    for (const wireframe of this.currentPieceWireframes) {
      this.returnToPool(wireframe);
    }
    this.currentPieceWireframes = [];

    if (!piece) {
      this.needsRender = true;
      return;
    }

    // Use cached geometry, material, and pooled wireframes
    const material = this.getMaterial(piece.color);

    for (const block of piece.blocks) {
      const worldPos = addVector3(piece.position, block);
      const renderPos = gridToWorld(worldPos);

      const wireframe = this.getWireframe(material);
      wireframe.position.set(renderPos.x, renderPos.y, renderPos.z);

      this.scene.add(wireframe);
      this.currentPieceWireframes.push(wireframe);
    }

    this.needsRender = true;
  }

  updateOccupiedBlocks(well: GameWell): void {
    // Return removed blocks to pool for reuse
    const currentKeys = new Set(well.occupiedCells.keys());
    let hasChanges = false;

    this.occupiedBlockWireframes.forEach((wireframe, key) => {
      if (!currentKeys.has(key)) {
        this.returnToPool(wireframe);
        this.occupiedBlockWireframes.delete(key);
        hasChanges = true;
      }
    });

    // Add new blocks using cached geometry, material, and pooled wireframes
    well.occupiedCells.forEach((color, key) => {
      if (!this.occupiedBlockWireframes.has(key)) {
        const pos = keyToBlock(key);
        const renderPos = gridToWorld(pos);
        const material = this.getMaterial(color);

        const wireframe = this.getWireframe(material);
        wireframe.position.set(renderPos.x, renderPos.y, renderPos.z);

        this.scene.add(wireframe);
        this.occupiedBlockWireframes.set(key, wireframe);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.needsRender = true;
    }
  }
}
