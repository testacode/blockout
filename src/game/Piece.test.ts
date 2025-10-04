import { describe, it, expect, vi } from 'vitest'
import {
  createPiece,
  getRandomPieceType,
  createRandomPiece,
  CUBE_SHAPE,
  I_PIECE_SHAPE
} from './Piece'
import type { PieceType } from './Piece'

describe('CUBE_SHAPE', () => {
  it('should have 8 blocks (2x2x2 cube)', () => {
    expect(CUBE_SHAPE).toHaveLength(8)
  })

  it('should have blocks at all corners of a 2x2x2 cube', () => {
    const expectedBlocks = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: 1, y: 0, z: 1 },
      { x: 0, y: 1, z: 0 },
      { x: 1, y: 1, z: 0 },
      { x: 0, y: 1, z: 1 },
      { x: 1, y: 1, z: 1 }
    ]

    expectedBlocks.forEach(block => {
      expect(CUBE_SHAPE).toContainEqual(block)
    })
  })
})

describe('I_PIECE_SHAPE', () => {
  it('should have 4 blocks (vertical line)', () => {
    expect(I_PIECE_SHAPE).toHaveLength(4)
  })

  it('should be a vertical line along Y-axis', () => {
    const expectedBlocks = [
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 0, y: 2, z: 0 },
      { x: 0, y: 3, z: 0 }
    ]

    expect(I_PIECE_SHAPE).toEqual(expectedBlocks)
  })
})

describe('createPiece', () => {
  it('should create cube piece with correct blocks', () => {
    const piece = createPiece('cube')
    expect(piece.blocks).toEqual(CUBE_SHAPE)
  })

  it('should create I-piece with correct blocks', () => {
    const piece = createPiece('i-piece')
    expect(piece.blocks).toEqual(I_PIECE_SHAPE)
  })

  it('should create cube piece with yellow color', () => {
    const piece = createPiece('cube')
    expect(piece.color).toBe('#ffff00')
  })

  it('should create I-piece with cyan color', () => {
    const piece = createPiece('i-piece')
    expect(piece.color).toBe('#00ffff')
  })

  it('should spawn at correct position (2, 6, 2)', () => {
    const cubePiece = createPiece('cube')
    const iPiece = createPiece('i-piece')

    expect(cubePiece.position).toEqual({ x: 2, y: 6, z: 2 })
    expect(iPiece.position).toEqual({ x: 2, y: 6, z: 2 })
  })

  it('should initialize rotation to zero', () => {
    const piece = createPiece('cube')
    expect(piece.rotation).toEqual({ x: 0, y: 0, z: 0 })
  })

  it('should not mutate original shape definitions', () => {
    const originalCubeShape = [...CUBE_SHAPE]
    const piece = createPiece('cube')

    // Modify the piece's blocks
    piece.blocks[0] = { x: 99, y: 99, z: 99 }

    // Original should be unchanged
    expect(CUBE_SHAPE).toEqual(originalCubeShape)
  })

  it('should create independent pieces', () => {
    const piece1 = createPiece('cube')
    const piece2 = createPiece('cube')

    // Modify one piece
    piece1.blocks[0] = { x: 99, y: 99, z: 99 }
    piece1.position = { x: 10, y: 10, z: 10 }

    // Other piece should be unaffected
    expect(piece2.blocks[0]).toEqual({ x: 0, y: 0, z: 0 })
    expect(piece2.position).toEqual({ x: 2, y: 6, z: 2 })
  })
})

describe('getRandomPieceType', () => {
  it('should return a valid piece type', () => {
    const validTypes: PieceType[] = ['cube', 'i-piece']
    const result = getRandomPieceType()
    expect(validTypes).toContain(result)
  })

  it('should return different types over multiple calls (probabilistic)', () => {
    const types = new Set<PieceType>()

    // Run 20 times - should get both types with high probability
    for (let i = 0; i < 20; i++) {
      types.add(getRandomPieceType())
    }

    // This test could theoretically fail due to randomness,
    // but probability is extremely low (1 in 2^20 = ~1 million)
    expect(types.size).toBeGreaterThan(1)
  })

  it('should use Math.random internally', () => {
    const spy = vi.spyOn(Math, 'random')

    getRandomPieceType()

    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
  })
})

describe('createRandomPiece', () => {
  it('should create a piece with valid type', () => {
    const piece = createRandomPiece()
    const validColors = ['#ffff00', '#00ffff'] // Yellow (cube) or Cyan (i-piece)
    expect(validColors).toContain(piece.color)
  })

  it('should create piece at spawn position', () => {
    const piece = createRandomPiece()
    expect(piece.position).toEqual({ x: 2, y: 6, z: 2 })
  })

  it('should create piece with zero rotation', () => {
    const piece = createRandomPiece()
    expect(piece.rotation).toEqual({ x: 0, y: 0, z: 0 })
  })

  it('should create pieces with valid block counts', () => {
    const validBlockCounts = [8, 4] // Cube or I-piece

    for (let i = 0; i < 10; i++) {
      const piece = createRandomPiece()
      expect(validBlockCounts).toContain(piece.blocks.length)
    }
  })

  it('should create cube piece when random returns < 0.5', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25)

    const piece = createRandomPiece()

    expect(piece.color).toBe('#ffff00')
    expect(piece.blocks).toHaveLength(8)

    vi.restoreAllMocks()
  })

  it('should create I-piece when random returns >= 0.5', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.75)

    const piece = createRandomPiece()

    expect(piece.color).toBe('#00ffff')
    expect(piece.blocks).toHaveLength(4)

    vi.restoreAllMocks()
  })
})

describe('piece spawning logic', () => {
  it('should spawn I-piece (tallest piece) within well bounds', () => {
    // I-piece has height 4, spawns at y=6
    // Highest block: y=6+3=9, which is < 10 (well height)
    const piece = createPiece('i-piece')
    const maxY = Math.max(...piece.blocks.map(b => b.y + piece.position.y))
    expect(maxY).toBeLessThan(10)
  })

  it('should spawn cube piece within well bounds', () => {
    // Cube has height 2, spawns at y=6
    // Highest block: y=6+1=7, which is < 10
    const piece = createPiece('cube')
    const maxY = Math.max(...piece.blocks.map(b => b.y + piece.position.y))
    expect(maxY).toBeLessThan(10)
  })

  it('should spawn pieces centered horizontally in 5x5 well', () => {
    // Well is 5x5, spawning at (2, 6, 2) centers pieces
    const piece = createPiece('cube')

    expect(piece.position.x).toBe(2)
    expect(piece.position.z).toBe(2)
  })
})
