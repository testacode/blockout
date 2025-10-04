import * as THREE from 'three'
import type { GameWell } from '../types'

// Well - Game well logic and visualization
// Dimensions: 5x5x10 (width x depth x height)
// Coordinate system: Y-axis is vertical (0 at bottom, 10 at top)

export class Well {
  private wellData: GameWell
  private wellMesh: THREE.LineSegments

  constructor(scene: THREE.Scene) {
    // Initialize well data
    this.wellData = {
      width: 5,
      depth: 5,
      height: 10,
      occupiedCells: new Map<string, string>()
    }

    // Create wireframe visualization
    this.wellMesh = this.createWireframe()
    scene.add(this.wellMesh)
  }

  private createWireframe(): THREE.LineSegments {
    const { width, depth, height } = this.wellData

    // Create edges geometry for the well boundaries
    const geometry = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(width, height, depth)
    )

    // Cyan wireframe material
    const material = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6
    })

    const wireframe = new THREE.LineSegments(geometry, material)

    // Position the wireframe so bottom-front-left corner is at origin
    // Box geometry is centered, so offset by half dimensions
    wireframe.position.set(width / 2, height / 2, depth / 2)

    return wireframe
  }

  getWellData(): GameWell {
    return this.wellData
  }

  // Check if a position is within well boundaries
  isInBounds(x: number, y: number, z: number): boolean {
    return (
      x >= 0 && x < this.wellData.width &&
      y >= 0 && y < this.wellData.height &&
      z >= 0 && z < this.wellData.depth
    )
  }

  // Check if a cell is occupied
  isOccupied(x: number, y: number, z: number): boolean {
    const key = `${x},${y},${z}`
    return this.wellData.occupiedCells.has(key)
  }

  // Add a block to occupied cells
  addBlock(x: number, y: number, z: number, color: string): void {
    const key = `${x},${y},${z}`
    this.wellData.occupiedCells.set(key, color)
  }

  // Remove a block from occupied cells
  removeBlock(x: number, y: number, z: number): void {
    const key = `${x},${y},${z}`
    this.wellData.occupiedCells.delete(key)
  }

  // Clear all blocks at a specific Y level
  clearLayer(y: number): void {
    for (let x = 0; x < this.wellData.width; x++) {
      for (let z = 0; z < this.wellData.depth; z++) {
        this.removeBlock(x, y, z)
      }
    }
  }

  // Check if a layer is complete
  isLayerComplete(y: number): boolean {
    const totalCells = this.wellData.width * this.wellData.depth
    let occupiedCount = 0

    for (let x = 0; x < this.wellData.width; x++) {
      for (let z = 0; z < this.wellData.depth; z++) {
        if (this.isOccupied(x, y, z)) {
          occupiedCount++
        }
      }
    }

    return occupiedCount === totalCells
  }
}
