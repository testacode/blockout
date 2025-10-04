import { describe, it, expect, vi } from 'vitest'
import {
  createPiece,
  getRandomPieceType,
  createRandomPiece,
  I_PIECE_SHAPE,
  O_PIECE_SHAPE,
  T_PIECE_SHAPE,
  L_PIECE_SHAPE,
  J_PIECE_SHAPE,
  S_PIECE_SHAPE,
  Z_PIECE_SHAPE,
  L_TRIMINO_SHAPE
} from './Piece'
import type { PieceType } from './Piece'

describe('Piece Shapes', () => {
  describe('I_PIECE_SHAPE', () => {
    it('should have 4 blocks (horizontal line)', () => {
      expect(I_PIECE_SHAPE).toHaveLength(4)
    })

    it('should be a horizontal line along X-axis', () => {
      const expectedBlocks = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 2, y: 0, z: 0 },
        { x: 3, y: 0, z: 0 }
      ]
      expect(I_PIECE_SHAPE).toEqual(expectedBlocks)
    })
  })

  describe('O_PIECE_SHAPE', () => {
    it('should have 4 blocks (2x2 square)', () => {
      expect(O_PIECE_SHAPE).toHaveLength(4)
    })

    it('should be a 2x2 square in XZ plane', () => {
      const expectedBlocks = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 0, z: 1 },
        { x: 1, y: 0, z: 1 }
      ]
      expect(O_PIECE_SHAPE).toEqual(expectedBlocks)
    })
  })

  describe('T_PIECE_SHAPE', () => {
    it('should have 4 blocks (T shape)', () => {
      expect(T_PIECE_SHAPE).toHaveLength(4)
    })

    it('should form a T shape', () => {
      const expectedBlocks = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 2, y: 0, z: 0 },
        { x: 1, y: 0, z: 1 }
      ]
      expect(T_PIECE_SHAPE).toEqual(expectedBlocks)
    })
  })

  describe('L_PIECE_SHAPE', () => {
    it('should have 4 blocks (L shape)', () => {
      expect(L_PIECE_SHAPE).toHaveLength(4)
    })

    it('should form an L shape', () => {
      const expectedBlocks = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 2, y: 0, z: 0 },
        { x: 0, y: 0, z: 1 }
      ]
      expect(L_PIECE_SHAPE).toEqual(expectedBlocks)
    })
  })

  describe('J_PIECE_SHAPE', () => {
    it('should have 4 blocks (J shape)', () => {
      expect(J_PIECE_SHAPE).toHaveLength(4)
    })

    it('should form a J shape (inverted L)', () => {
      const expectedBlocks = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 2, y: 0, z: 0 },
        { x: 2, y: 0, z: 1 }
      ]
      expect(J_PIECE_SHAPE).toEqual(expectedBlocks)
    })
  })

  describe('S_PIECE_SHAPE', () => {
    it('should have 4 blocks (S shape)', () => {
      expect(S_PIECE_SHAPE).toHaveLength(4)
    })

    it('should form an S shape', () => {
      const expectedBlocks = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 1, y: 0, z: 1 },
        { x: 2, y: 0, z: 1 }
      ]
      expect(S_PIECE_SHAPE).toEqual(expectedBlocks)
    })
  })

  describe('Z_PIECE_SHAPE', () => {
    it('should have 4 blocks (Z shape)', () => {
      expect(Z_PIECE_SHAPE).toHaveLength(4)
    })

    it('should form a Z shape', () => {
      const expectedBlocks = [
        { x: 1, y: 0, z: 0 },
        { x: 2, y: 0, z: 0 },
        { x: 0, y: 0, z: 1 },
        { x: 1, y: 0, z: 1 }
      ]
      expect(Z_PIECE_SHAPE).toEqual(expectedBlocks)
    })
  })

  describe('L_TRIMINO_SHAPE', () => {
    it('should have 3 blocks (small L)', () => {
      expect(L_TRIMINO_SHAPE).toHaveLength(3)
    })

    it('should form a small L shape', () => {
      const expectedBlocks = [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 0, z: 1 }
      ]
      expect(L_TRIMINO_SHAPE).toEqual(expectedBlocks)
    })
  })
})

describe('createPiece', () => {
  const wellHeight = 10

  it('should create I-piece with correct blocks', () => {
    const piece = createPiece('i', wellHeight)
    expect(piece.blocks).toEqual(I_PIECE_SHAPE)
  })

  it('should create O-piece with correct blocks', () => {
    const piece = createPiece('o', wellHeight)
    expect(piece.blocks).toEqual(O_PIECE_SHAPE)
  })

  it('should create T-piece with correct blocks', () => {
    const piece = createPiece('t', wellHeight)
    expect(piece.blocks).toEqual(T_PIECE_SHAPE)
  })

  it('should create I-piece with cyan color', () => {
    const piece = createPiece('i', wellHeight)
    expect(piece.color).toBe('#00ffff')
  })

  it('should create O-piece with yellow color', () => {
    const piece = createPiece('o', wellHeight)
    expect(piece.color).toBe('#ffff00')
  })

  it('should create T-piece with purple color', () => {
    const piece = createPiece('t', wellHeight)
    expect(piece.color).toBe('#9b59b6')
  })

  it('should spawn at position relative to well height (wellHeight-2)', () => {
    const oPiece = createPiece('o', wellHeight)
    const iPiece = createPiece('i', wellHeight)

    expect(oPiece.position).toEqual({ x: 2, y: 8, z: 2 })
    expect(iPiece.position).toEqual({ x: 2, y: 8, z: 2 })
  })

  it('should initialize rotation to zero', () => {
    const piece = createPiece('t', wellHeight)
    expect(piece.rotation).toEqual({ x: 0, y: 0, z: 0 })
  })

  it('should not mutate original shape definitions', () => {
    const originalOShape = [...O_PIECE_SHAPE]
    const piece = createPiece('o', wellHeight)

    // Modify the piece's blocks
    piece.blocks[0] = { x: 99, y: 99, z: 99 }

    // Original should be unchanged
    expect(O_PIECE_SHAPE).toEqual(originalOShape)
  })

  it('should create independent pieces', () => {
    const piece1 = createPiece('l', wellHeight)
    const piece2 = createPiece('l', wellHeight)

    // Modify one piece
    piece1.blocks[0] = { x: 99, y: 99, z: 99 }
    piece1.position = { x: 10, y: 10, z: 10 }

    // Other piece should be unaffected
    expect(piece2.blocks[0]).toEqual({ x: 0, y: 0, z: 0 })
    expect(piece2.position).toEqual({ x: 2, y: 8, z: 2 })
  })
})

describe('getRandomPieceType', () => {
  it('should return a valid piece type', () => {
    const validTypes: PieceType[] = ['i', 'o', 't', 'l', 'j', 's', 'z', 'l-trimino']
    const result = getRandomPieceType()
    expect(validTypes).toContain(result)
  })

  it('should return different types over multiple calls (probabilistic)', () => {
    const types = new Set<PieceType>()

    // Run 50 times - should get multiple different types with high probability
    for (let i = 0; i < 50; i++) {
      types.add(getRandomPieceType())
    }

    // Should get at least 4 different types out of 8
    expect(types.size).toBeGreaterThan(3)
  })

  it('should use Math.random internally', () => {
    const spy = vi.spyOn(Math, 'random')

    getRandomPieceType()

    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
  })
})

describe('createRandomPiece', () => {
  const wellHeight = 10

  it('should create a piece with valid type', () => {
    const piece = createRandomPiece(wellHeight)
    const validColors = ['#00ffff', '#ffff00', '#9b59b6', '#ff8c00', '#0000ff', '#00ff00', '#ff0000', '#808080']
    expect(validColors).toContain(piece.color)
  })

  it('should create piece at spawn position relative to well height', () => {
    const piece = createRandomPiece(wellHeight)
    expect(piece.position).toEqual({ x: 2, y: 8, z: 2 })
  })

  it('should create piece with zero rotation', () => {
    const piece = createRandomPiece(wellHeight)
    expect(piece.rotation).toEqual({ x: 0, y: 0, z: 0 })
  })

  it('should create pieces with valid block counts', () => {
    const validBlockCounts = [3, 4] // L-trimino (3) or tetrominos (4)

    for (let i = 0; i < 20; i++) {
      const piece = createRandomPiece(wellHeight)
      expect(validBlockCounts).toContain(piece.blocks.length)
    }
  })

  it('should create I-piece when random returns ~0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01)

    const piece = createRandomPiece(wellHeight)

    expect(piece.color).toBe('#00ffff') // Cyan - I piece
    expect(piece.blocks).toHaveLength(4)

    vi.restoreAllMocks()
  })

  it('should create O-piece when random returns ~0.125', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.13)

    const piece = createRandomPiece(wellHeight)

    expect(piece.color).toBe('#ffff00') // Yellow - O piece
    expect(piece.blocks).toHaveLength(4)

    vi.restoreAllMocks()
  })
})

describe('piece spawning logic', () => {
  const wellHeight = 10

  it('should spawn all pieces within well bounds (all flat pieces)', () => {
    const pieceTypes: PieceType[] = ['i', 'o', 't', 'l', 'j', 's', 'z', 'l-trimino']

    pieceTypes.forEach(type => {
      const piece = createPiece(type, wellHeight)
      const maxY = Math.max(...piece.blocks.map(b => b.y + piece.position.y))
      expect(maxY).toBeLessThan(wellHeight)
    })
  })

  it('should spawn pieces at correct Y position (wellHeight-2)', () => {
    const piece = createPiece('t', wellHeight)
    expect(piece.position.y).toBe(wellHeight - 2)
  })

  it('should spawn pieces centered horizontally in 5x5 well', () => {
    // Well is 5x5, spawning at (2, wellHeight-2, 2) centers pieces
    const piece = createPiece('o', wellHeight)

    expect(piece.position.x).toBe(2)
    expect(piece.position.z).toBe(2)
  })

  it('should spawn pieces with minimum well height (7)', () => {
    const minWellHeight = 7
    const pieceTypes: PieceType[] = ['i', 'o', 't', 'l', 'j', 's', 'z', 'l-trimino']

    pieceTypes.forEach(type => {
      const piece = createPiece(type, minWellHeight)
      const maxY = Math.max(...piece.blocks.map(b => b.y + piece.position.y))
      expect(maxY).toBeLessThan(minWellHeight)
    })
  })
})
