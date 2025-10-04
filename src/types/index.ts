// Core type definitions for Blockout game
// Using types instead of interfaces per project requirements

export type Vector3 = {
  x: number
  y: number
  z: number
}

export type Piece3D = {
  blocks: Vector3[]      // Relative positions of blocks
  position: Vector3      // Current position in well
  color: string          // Hex color
  rotation: Vector3      // Current rotation (Euler angles)
}

export type GameWell = {
  width: number
  depth: number
  height: number
  occupiedCells: Map<string, string>  // "x,y,z" -> color
}

export type GameState = {
  currentPiece: Piece3D | null
  nextPiece: Piece3D | null
  well: GameWell
  score: number
  level: number
  linesCleared: number
  gameOver: boolean
  isPaused: boolean
  fallSpeed: number  // ms between drops
}

export type GameRules = {
  initialFallSpeed: number
  speedIncreasePerLevel: number
  linesPerLevel: number
  scoring: {
    dropPoints: number
    linePoints: number[]  // [single, double, triple, etc.]
  }
}
