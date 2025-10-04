import * as THREE from 'three';
import { ParticleEffects } from '../effects/ParticleEffects';
import { gridToWorld, keyToBlock } from '../utils/coordinates';
import { addVector3 } from '../utils/collision';
import type { Piece3D, GameWell } from '../types';

// Renderer - Three.js scene, camera, and rendering
// Consumes game state but never modifies it (separation of concerns)

export class Renderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private particleEffects: ParticleEffects;
  private currentPieceWireframes: THREE.LineSegments[] = [];
  private occupiedBlockWireframes: Map<string, THREE.LineSegments> = new Map();
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    // Store container reference
    this.container = container;

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

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
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
    this.renderer.render(this.scene, this.camera);
  }

  update(deltaTime: number): void {
    this.particleEffects.update(deltaTime);
  }

  dispose(): void {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    this.renderer.dispose();
  }

  updateCurrentPiece(piece: Piece3D | null): void {
    // Remove old piece wireframes
    this.currentPieceWireframes.forEach((wireframe) => {
      this.scene.remove(wireframe);
      wireframe.geometry.dispose();
      if (wireframe.material instanceof THREE.Material) {
        wireframe.material.dispose();
      }
    });
    this.currentPieceWireframes = [];

    if (!piece) {
      return;
    }

    // Create wireframe blocks for current piece
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
    const material = new THREE.LineBasicMaterial({ color: piece.color });

    for (const block of piece.blocks) {
      const worldPos = addVector3(piece.position, block);
      const renderPos = gridToWorld(worldPos);

      const wireframe = new THREE.LineSegments(edgesGeometry, material);
      wireframe.position.set(renderPos.x, renderPos.y, renderPos.z);

      this.scene.add(wireframe);
      this.currentPieceWireframes.push(wireframe);
    }

    boxGeometry.dispose();
  }

  updateOccupiedBlocks(well: GameWell): void {
    // Remove blocks that no longer exist
    const currentKeys = new Set(well.occupiedCells.keys());

    this.occupiedBlockWireframes.forEach((wireframe, key) => {
      if (!currentKeys.has(key)) {
        this.scene.remove(wireframe);
        wireframe.geometry.dispose();
        if (wireframe.material instanceof THREE.Material) {
          wireframe.material.dispose();
        }
        this.occupiedBlockWireframes.delete(key);
      }
    });

    // Add new blocks as wireframes
    well.occupiedCells.forEach((color, key) => {
      if (!this.occupiedBlockWireframes.has(key)) {
        const pos = keyToBlock(key);
        const renderPos = gridToWorld(pos);

        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
        const material = new THREE.LineBasicMaterial({ color });

        const wireframe = new THREE.LineSegments(edgesGeometry, material);
        wireframe.position.set(renderPos.x, renderPos.y, renderPos.z);

        this.scene.add(wireframe);
        this.occupiedBlockWireframes.set(key, wireframe);

        boxGeometry.dispose();
        edgesGeometry.dispose();
      }
    });
  }
}
