import type { Piece3D, Vector3 } from '../types'

// Piece definitions - relative block positions
// Coordinate system: X=width, Y=height, Z=depth

// 2x2x2 Cube
export const CUBE_SHAPE: Vector3[] = [
  { x: 0, y: 0, z: 0 },
  { x: 1, y: 0, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: 1, y: 0, z: 1 },
  { x: 0, y: 1, z: 0 },
  { x: 1, y: 1, z: 0 },
  { x: 0, y: 1, z: 1 },
  { x: 1, y: 1, z: 1 }
]

// I-piece (4 blocks vertical)
export const I_PIECE_SHAPE: Vector3[] = [
  { x: 0, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 0, y: 2, z: 0 },
  { x: 0, y: 3, z: 0 }
]

export type PieceType = 'cube' | 'i-piece'

type PieceDefinition = {
  blocks: Vector3[]
  color: string
}

const PIECE_DEFINITIONS: Record<PieceType, PieceDefinition> = {
  'cube': { blocks: CUBE_SHAPE, color: '#ffff00' },      // Yellow
  'i-piece': { blocks: I_PIECE_SHAPE, color: '#00ffff' } // Cyan
}

// Create a new piece at the spawn position (top center of well)
// Well is 5x5x10, so spawn at (2, 6, 2) - centered horizontally
// y=6 ensures even the tallest piece (I-piece with height 4) fits within bounds
export function createPiece(type: PieceType): Piece3D {
  const definition = PIECE_DEFINITIONS[type]

  return {
    blocks: [...definition.blocks], // Copy array to avoid mutation
    position: { x: 2, y: 6, z: 2 },
    color: definition.color,
    rotation: { x: 0, y: 0, z: 0 }
  }
}

// Get a random piece type
export function getRandomPieceType(): PieceType {
  const types: PieceType[] = ['cube', 'i-piece']
  return types[Math.floor(Math.random() * types.length)]
}

// Create a random piece at spawn position
export function createRandomPiece(): Piece3D {
  return createPiece(getRandomPieceType())
}
