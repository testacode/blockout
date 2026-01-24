import * as THREE from 'three';
import type { GameWell } from '../types';

// Well - Game well logic and visualization
// Dimensions: 5x5x15 (width x depth x height - fixed)
// Coordinate system: Y-axis is vertical (0 at bottom)

export class Well {
  private wellData: GameWell;
  private wellMesh: THREE.LineSegments;
  private gridMesh: THREE.LineSegments;

  constructor(scene: THREE.Scene) {
    // Initialize well data with fixed height of 15
    this.wellData = {
      width: 5,
      depth: 5,
      height: 15,
      occupiedCells: new Map<string, string>(),
    };

    // Create wireframe visualization
    this.wellMesh = this.createWireframe();
    scene.add(this.wellMesh);

    // Create interior grid visualization
    this.gridMesh = this.createInteriorGrid();
    scene.add(this.gridMesh);
  }

  private createWireframe(): THREE.LineSegments {
    const { width, depth, height } = this.wellData;

    // Create edges geometry for the well boundaries
    const geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(width, height, depth));

    // White wireframe material
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
    });

    const wireframe = new THREE.LineSegments(geometry, material);

    // Position the wireframe so bottom-front-left corner is at origin
    // Box geometry is centered, so offset by half dimensions
    wireframe.position.set(width / 2, height / 2, depth / 2);

    return wireframe;
  }

  private createInteriorGrid(): THREE.LineSegments {
    const { width, depth, height } = this.wellData;
    const vertices: number[] = [];

    // Helper to add a line segment
    const addLine = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
      vertices.push(x1, y1, z1, x2, y2, z2);
    };

    // 1. Bottom floor grid (y = 0)
    for (let z = 0; z <= depth; z++) {
      addLine(0, 0, z, width, 0, z); // Lines parallel to X-axis
    }
    for (let x = 0; x <= width; x++) {
      addLine(x, 0, 0, x, 0, depth); // Lines parallel to Z-axis
    }

    // 2. Back wall grid (z = depth)
    for (let y = 0; y <= height; y++) {
      addLine(0, y, depth, width, y, depth); // Horizontal lines
    }
    for (let x = 0; x <= width; x++) {
      addLine(x, 0, depth, x, height, depth); // Vertical lines
    }

    // 3. Left wall grid (x = 0)
    for (let y = 0; y <= height; y++) {
      addLine(0, y, 0, 0, y, depth); // Horizontal lines
    }
    for (let z = 0; z <= depth; z++) {
      addLine(0, 0, z, 0, height, z); // Vertical lines
    }

    // 4. Right wall grid (x = width)
    for (let y = 0; y <= height; y++) {
      addLine(width, y, 0, width, y, depth); // Horizontal lines
    }
    for (let z = 0; z <= depth; z++) {
      addLine(width, 0, z, width, height, z); // Vertical lines
    }

    // 5. Front wall grid (z = 0)
    for (let y = 0; y <= height; y++) {
      addLine(0, y, 0, width, y, 0); // Horizontal lines
    }
    for (let x = 0; x <= width; x++) {
      addLine(x, 0, 0, x, height, 0); // Vertical lines
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // Semi-transparent green grid material (Matrix style)
    const material = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.3,
    });

    return new THREE.LineSegments(geometry, material);
  }

  getWellData(): GameWell {
    return this.wellData;
  }

  // Check if a position is within well boundaries
  isInBounds(x: number, y: number, z: number): boolean {
    return (
      x >= 0 &&
      x < this.wellData.width &&
      y >= 0 &&
      y < this.wellData.height &&
      z >= 0 &&
      z < this.wellData.depth
    );
  }

  // Check if a cell is occupied
  isOccupied(x: number, y: number, z: number): boolean {
    const key = `${x},${y},${z}`;
    return this.wellData.occupiedCells.has(key);
  }

  // Add a block to occupied cells
  addBlock(x: number, y: number, z: number, color: string): void {
    const key = `${x},${y},${z}`;
    this.wellData.occupiedCells.set(key, color);
  }

  // Remove a block from occupied cells
  removeBlock(x: number, y: number, z: number): void {
    const key = `${x},${y},${z}`;
    this.wellData.occupiedCells.delete(key);
  }

  // Clear all blocks at a specific Y level
  clearLayer(y: number): void {
    for (let x = 0; x < this.wellData.width; x++) {
      for (let z = 0; z < this.wellData.depth; z++) {
        this.removeBlock(x, y, z);
      }
    }
  }

  // Check if a layer is complete (early exit on first empty cell)
  isLayerComplete(y: number): boolean {
    for (let x = 0; x < this.wellData.width; x++) {
      for (let z = 0; z < this.wellData.depth; z++) {
        if (!this.isOccupied(x, y, z)) {
          return false; // Early exit: found empty cell
        }
      }
    }
    return true;
  }
}
