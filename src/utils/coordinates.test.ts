import { describe, it, expect } from 'vitest'
import { gridToWorld, blockToKey, keyToBlock } from './coordinates'
import type { Vector3 } from '../types'

describe('gridToWorld', () => {
  it('should add 0.5 to each coordinate', () => {
    const grid: Vector3 = { x: 0, y: 0, z: 0 }
    const world = gridToWorld(grid)
    expect(world).toEqual({ x: 0.5, y: 0.5, z: 0.5 })
  })

  it('should handle positive coordinates', () => {
    const grid: Vector3 = { x: 2, y: 5, z: 3 }
    const world = gridToWorld(grid)
    expect(world).toEqual({ x: 2.5, y: 5.5, z: 3.5 })
  })

  it('should handle large coordinates', () => {
    const grid: Vector3 = { x: 10, y: 20, z: 30 }
    const world = gridToWorld(grid)
    expect(world).toEqual({ x: 10.5, y: 20.5, z: 30.5 })
  })

  it('should handle negative coordinates (edge case)', () => {
    const grid: Vector3 = { x: -1, y: -2, z: -3 }
    const world = gridToWorld(grid)
    expect(world).toEqual({ x: -0.5, y: -1.5, z: -2.5 })
  })

  it('should handle fractional coordinates (edge case)', () => {
    const grid: Vector3 = { x: 1.5, y: 2.5, z: 3.5 }
    const world = gridToWorld(grid)
    expect(world).toEqual({ x: 2, y: 3, z: 4 })
  })

  it('should not mutate original vector', () => {
    const grid: Vector3 = { x: 1, y: 2, z: 3 }
    const originalGrid = { ...grid }

    gridToWorld(grid)

    expect(grid).toEqual(originalGrid)
  })

  it('should center blocks in Three.js BoxGeometry', () => {
    // BoxGeometry is centered, so grid (0,0,0) should be at world (0.5,0.5,0.5)
    // to align the block's center with the grid cell
    const grid: Vector3 = { x: 0, y: 0, z: 0 }
    const world = gridToWorld(grid)

    expect(world.x).toBe(0.5)
    expect(world.y).toBe(0.5)
    expect(world.z).toBe(0.5)
  })
})

describe('blockToKey', () => {
  it('should convert coordinates to string key', () => {
    const key = blockToKey(1, 2, 3)
    expect(key).toBe('1,2,3')
  })

  it('should handle zero coordinates', () => {
    const key = blockToKey(0, 0, 0)
    expect(key).toBe('0,0,0')
  })

  it('should handle large coordinates', () => {
    const key = blockToKey(100, 200, 300)
    expect(key).toBe('100,200,300')
  })

  it('should handle negative coordinates', () => {
    const key = blockToKey(-1, -2, -3)
    expect(key).toBe('-1,-2,-3')
  })

  it('should create unique keys for different coordinates', () => {
    const key1 = blockToKey(1, 2, 3)
    const key2 = blockToKey(1, 2, 4)
    const key3 = blockToKey(2, 2, 3)

    expect(key1).not.toBe(key2)
    expect(key1).not.toBe(key3)
    expect(key2).not.toBe(key3)
  })

  it('should create same key for same coordinates', () => {
    const key1 = blockToKey(5, 7, 9)
    const key2 = blockToKey(5, 7, 9)
    expect(key1).toBe(key2)
  })

  it('should handle fractional coordinates (edge case)', () => {
    const key = blockToKey(1.5, 2.5, 3.5)
    expect(key).toBe('1.5,2.5,3.5')
  })
})

describe('keyToBlock', () => {
  it('should parse string key to coordinates', () => {
    const coords = keyToBlock('1,2,3')
    expect(coords).toEqual({ x: 1, y: 2, z: 3 })
  })

  it('should handle zero coordinates', () => {
    const coords = keyToBlock('0,0,0')
    expect(coords).toEqual({ x: 0, y: 0, z: 0 })
  })

  it('should handle large coordinates', () => {
    const coords = keyToBlock('100,200,300')
    expect(coords).toEqual({ x: 100, y: 200, z: 300 })
  })

  it('should handle negative coordinates', () => {
    const coords = keyToBlock('-1,-2,-3')
    expect(coords).toEqual({ x: -1, y: -2, z: -3 })
  })

  it('should handle fractional coordinates', () => {
    const coords = keyToBlock('1.5,2.5,3.5')
    expect(coords).toEqual({ x: 1.5, y: 2.5, z: 3.5 })
  })

  it('should parse mixed positive and negative', () => {
    const coords = keyToBlock('-1,5,-3')
    expect(coords).toEqual({ x: -1, y: 5, z: -3 })
  })
})

describe('blockToKey and keyToBlock round-trip', () => {
  it('should convert from coordinates to key and back', () => {
    const original = { x: 5, y: 7, z: 9 }
    const key = blockToKey(original.x, original.y, original.z)
    const result = keyToBlock(key)
    expect(result).toEqual(original)
  })

  it('should handle multiple round-trips', () => {
    const testCases: Vector3[] = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 2, z: 3 },
      { x: -5, y: -10, z: -15 },
      { x: 100, y: 200, z: 300 }
    ]

    testCases.forEach(coords => {
      const key = blockToKey(coords.x, coords.y, coords.z)
      const result = keyToBlock(key)
      expect(result).toEqual(coords)
    })
  })

  it('should be consistent with Map key usage', () => {
    const map = new Map<string, string>()

    const x = 2
    const y = 5
    const z = 3
    const key = blockToKey(x, y, z)

    map.set(key, '#ff0000')

    // Should be able to retrieve using the key
    expect(map.has(key)).toBe(true)
    expect(map.get(key)).toBe('#ff0000')

    // Should be able to parse the key back
    const coords = keyToBlock(key)
    expect(coords).toEqual({ x: 2, y: 5, z: 3 })
  })
})

describe('integration with Well occupied cells', () => {
  it('should work with Map for storing occupied cells', () => {
    const occupiedCells = new Map<string, string>()

    // Add some blocks
    occupiedCells.set(blockToKey(0, 0, 0), '#ff0000')
    occupiedCells.set(blockToKey(1, 2, 3), '#00ff00')
    occupiedCells.set(blockToKey(4, 5, 6), '#0000ff')

    expect(occupiedCells.size).toBe(3)

    // Check specific cell
    expect(occupiedCells.has(blockToKey(1, 2, 3))).toBe(true)
    expect(occupiedCells.get(blockToKey(1, 2, 3))).toBe('#00ff00')

    // Check non-existent cell
    expect(occupiedCells.has(blockToKey(9, 9, 9))).toBe(false)
  })

  it('should iterate over all occupied cells and parse keys', () => {
    const occupiedCells = new Map<string, string>()

    occupiedCells.set(blockToKey(1, 2, 3), '#ff0000')
    occupiedCells.set(blockToKey(4, 5, 6), '#00ff00')

    const coords: Vector3[] = []

    for (const key of occupiedCells.keys()) {
      coords.push(keyToBlock(key))
    }

    expect(coords).toHaveLength(2)
    expect(coords).toContainEqual({ x: 1, y: 2, z: 3 })
    expect(coords).toContainEqual({ x: 4, y: 5, z: 6 })
  })
})
