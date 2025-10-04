import type { Piece3D, GameWell, Vector3 } from '../types'

// Add two Vector3 positions
export function addVector3(a: Vector3, b: Vector3): Vector3 {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    z: a.z + b.z
  }
}

// Check if a piece collides with well boundaries or occupied cells
export function checkCollision(piece: Piece3D, well: GameWell): boolean {
  for (const block of piece.blocks) {
    const worldPos = addVector3(piece.position, block)

    // Check boundaries
    if (
      worldPos.x < 0 ||
      worldPos.x >= well.width ||
      worldPos.z < 0 ||
      worldPos.z >= well.depth ||
      worldPos.y < 0 ||
      worldPos.y >= well.height
    ) {
      return true
    }

    // Check occupied cells
    const key = `${worldPos.x},${worldPos.y},${worldPos.z}`
    if (well.occupiedCells.has(key)) {
      return true
    }
  }

  return false
}

// Check if moving a piece in a direction would cause collision
export function wouldCollide(
  piece: Piece3D,
  well: GameWell,
  offset: Vector3
): boolean {
  const testPiece: Piece3D = {
    ...piece,
    position: addVector3(piece.position, offset)
  }

  return checkCollision(testPiece, well)
}
