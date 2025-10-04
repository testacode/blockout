import type { Piece3D, Vector3 } from '../types'

// Piece definitions - relative block positions
// Coordinate system: X=width, Y=height, Z=depth

// I-piece (4 blocks horizontal - Tetris classic)
export const I_PIECE_SHAPE: Vector3[] = [
  { x: 0, y: 0, z: 0 },
  { x: 1, y: 0, z: 0 },
  { x: 2, y: 0, z: 0 },
  { x: 3, y: 0, z: 0 }
]

// O-piece (2x2 square - Tetris classic)
export const O_PIECE_SHAPE: Vector3[] = [
  { x: 0, y: 0, z: 0 },
  { x: 1, y: 0, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: 1, y: 0, z: 1 }
]

// T-piece (T shape - Tetris classic)
export const T_PIECE_SHAPE: Vector3[] = [
  { x: 0, y: 0, z: 0 },
  { x: 1, y: 0, z: 0 },
  { x: 2, y: 0, z: 0 },
  { x: 1, y: 0, z: 1 }
]

// L-piece (L shape - Tetris classic)
export const L_PIECE_SHAPE: Vector3[] = [
  { x: 0, y: 0, z: 0 },
  { x: 1, y: 0, z: 0 },
  { x: 2, y: 0, z: 0 },
  { x: 0, y: 0, z: 1 }
]

// J-piece (Inverted L - Tetris classic)
export const J_PIECE_SHAPE: Vector3[] = [
  { x: 0, y: 0, z: 0 },
  { x: 1, y: 0, z: 0 },
  { x: 2, y: 0, z: 0 },
  { x: 2, y: 0, z: 1 }
]

// S-piece (S shape - Tetris classic)
export const S_PIECE_SHAPE: Vector3[] = [
  { x: 0, y: 0, z: 0 },
  { x: 1, y: 0, z: 0 },
  { x: 1, y: 0, z: 1 },
  { x: 2, y: 0, z: 1 }
]

// Z-piece (Z shape - Tetris classic)
export const Z_PIECE_SHAPE: Vector3[] = [
  { x: 1, y: 0, z: 0 },
  { x: 2, y: 0, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: 1, y: 0, z: 1 }
]

// L-Trimino (Small L - 3 blocks)
export const L_TRIMINO_SHAPE: Vector3[] = [
  { x: 0, y: 0, z: 0 },
  { x: 1, y: 0, z: 0 },
  { x: 0, y: 0, z: 1 }
]

export type PieceType = 'i' | 'o' | 't' | 'l' | 'j' | 's' | 'z' | 'l-trimino'

type PieceDefinition = {
  blocks: Vector3[]
  color: string
}

const PIECE_DEFINITIONS: Record<PieceType, PieceDefinition> = {
  'i': { blocks: I_PIECE_SHAPE, color: '#00ffff' },        // Cyan
  'o': { blocks: O_PIECE_SHAPE, color: '#ffff00' },        // Yellow
  't': { blocks: T_PIECE_SHAPE, color: '#9b59b6' },        // Purple
  'l': { blocks: L_PIECE_SHAPE, color: '#ff8c00' },        // Orange
  'j': { blocks: J_PIECE_SHAPE, color: '#0000ff' },        // Blue
  's': { blocks: S_PIECE_SHAPE, color: '#00ff00' },        // Green
  'z': { blocks: Z_PIECE_SHAPE, color: '#ff0000' },        // Red
  'l-trimino': { blocks: L_TRIMINO_SHAPE, color: '#808080' } // Gray
}

// Create a new piece at the spawn position (top center of well)
// Well is 5x5x(7-10), spawn centered horizontally at (2, wellHeight-2, 2)
// wellHeight-2 gives margin for pieces (I-piece horizontal only needs 1 height)
export function createPiece(type: PieceType, wellHeight: number): Piece3D {
  const definition = PIECE_DEFINITIONS[type]
  const spawnY = wellHeight - 2  // Spawn near top with margin

  return {
    blocks: [...definition.blocks], // Copy array to avoid mutation
    position: { x: 2, y: spawnY, z: 2 },
    color: definition.color,
    rotation: { x: 0, y: 0, z: 0 }
  }
}

// Get a random piece type
export function getRandomPieceType(): PieceType {
  const types: PieceType[] = ['i', 'o', 't', 'l', 'j', 's', 'z', 'l-trimino']
  return types[Math.floor(Math.random() * types.length)]
}

// Create a random piece at spawn position
export function createRandomPiece(wellHeight: number): Piece3D {
  return createPiece(getRandomPieceType(), wellHeight)
}
