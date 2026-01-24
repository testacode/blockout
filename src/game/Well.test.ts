import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Well } from './Well';
import * as THREE from 'three';

// Mock Three.js scene
vi.mock('three', async () => {
  const actual = await vi.importActual<typeof THREE>('three');
  return {
    ...actual,
    Scene: vi.fn().mockImplementation(() => ({
      add: vi.fn(),
    })),
  };
});

describe('Well', () => {
  let well: Well;
  let mockScene: THREE.Scene;

  beforeEach(() => {
    mockScene = new THREE.Scene();
    well = new Well(mockScene);
  });

  describe('getWellData', () => {
    it('should return well data with correct dimensions', () => {
      const wellData = well.getWellData();
      expect(wellData.width).toBe(5);
      expect(wellData.depth).toBe(5);
      expect(wellData.height).toBeGreaterThanOrEqual(10);
      expect(wellData.height).toBeLessThanOrEqual(15);
    });

    it('should return well data with empty occupied cells initially', () => {
      const wellData = well.getWellData();
      expect(wellData.occupiedCells.size).toBe(0);
    });
  });

  describe('isInBounds', () => {
    it('should return true for valid coordinates', () => {
      expect(well.isInBounds(2, 5, 2)).toBe(true);
    });

    it('should return true for boundary edges', () => {
      const wellData = well.getWellData();
      expect(well.isInBounds(0, 0, 0)).toBe(true);
      expect(well.isInBounds(4, wellData.height - 1, 4)).toBe(true);
    });

    it('should return false for x < 0', () => {
      expect(well.isInBounds(-1, 5, 2)).toBe(false);
    });

    it('should return false for x >= width', () => {
      expect(well.isInBounds(5, 5, 2)).toBe(false);
    });

    it('should return false for y < 0', () => {
      expect(well.isInBounds(2, -1, 2)).toBe(false);
    });

    it('should return false for y >= height', () => {
      const wellData = well.getWellData();
      expect(well.isInBounds(2, wellData.height, 2)).toBe(false);
    });

    it('should return false for z < 0', () => {
      expect(well.isInBounds(2, 5, -1)).toBe(false);
    });

    it('should return false for z >= depth', () => {
      expect(well.isInBounds(2, 5, 5)).toBe(false);
    });

    it('should return false for all coordinates out of bounds', () => {
      expect(well.isInBounds(-1, -1, -1)).toBe(false);
      expect(well.isInBounds(10, 10, 10)).toBe(false);
    });
  });

  describe('isOccupied', () => {
    it('should return false for empty cell', () => {
      expect(well.isOccupied(2, 5, 2)).toBe(false);
    });

    it('should return true for occupied cell', () => {
      well.addBlock(2, 5, 2, '#ff0000');
      expect(well.isOccupied(2, 5, 2)).toBe(true);
    });

    it('should return false for different cell', () => {
      well.addBlock(2, 5, 2, '#ff0000');
      expect(well.isOccupied(3, 5, 2)).toBe(false);
    });
  });

  describe('addBlock', () => {
    it('should add a block to occupied cells', () => {
      well.addBlock(1, 2, 3, '#ff0000');
      expect(well.isOccupied(1, 2, 3)).toBe(true);
    });

    it('should store the color', () => {
      well.addBlock(1, 2, 3, '#ff0000');
      const wellData = well.getWellData();
      expect(wellData.occupiedCells.get('1,2,3')).toBe('#ff0000');
    });

    it('should allow multiple blocks', () => {
      well.addBlock(0, 0, 0, '#ff0000');
      well.addBlock(1, 1, 1, '#00ff00');
      well.addBlock(2, 2, 2, '#0000ff');

      expect(well.isOccupied(0, 0, 0)).toBe(true);
      expect(well.isOccupied(1, 1, 1)).toBe(true);
      expect(well.isOccupied(2, 2, 2)).toBe(true);
    });

    it('should overwrite existing block color', () => {
      well.addBlock(1, 2, 3, '#ff0000');
      well.addBlock(1, 2, 3, '#00ff00');

      const wellData = well.getWellData();
      expect(wellData.occupiedCells.get('1,2,3')).toBe('#00ff00');
    });
  });

  describe('removeBlock', () => {
    it('should remove an occupied block', () => {
      well.addBlock(1, 2, 3, '#ff0000');
      well.removeBlock(1, 2, 3);
      expect(well.isOccupied(1, 2, 3)).toBe(false);
    });

    it('should not affect other blocks', () => {
      well.addBlock(1, 2, 3, '#ff0000');
      well.addBlock(2, 3, 4, '#00ff00');
      well.removeBlock(1, 2, 3);

      expect(well.isOccupied(1, 2, 3)).toBe(false);
      expect(well.isOccupied(2, 3, 4)).toBe(true);
    });

    it('should handle removing non-existent block gracefully', () => {
      expect(() => well.removeBlock(1, 2, 3)).not.toThrow();
      expect(well.isOccupied(1, 2, 3)).toBe(false);
    });
  });

  describe('clearLayer', () => {
    it('should remove all blocks at specified Y level', () => {
      // Fill layer y=5
      for (let x = 0; x < 5; x++) {
        for (let z = 0; z < 5; z++) {
          well.addBlock(x, 5, z, '#ff0000');
        }
      }

      well.clearLayer(5);

      // Check all cells at y=5 are now empty
      for (let x = 0; x < 5; x++) {
        for (let z = 0; z < 5; z++) {
          expect(well.isOccupied(x, 5, z)).toBe(false);
        }
      }
    });

    it('should not affect blocks at other Y levels', () => {
      well.addBlock(2, 4, 2, '#ff0000');
      well.addBlock(2, 5, 2, '#00ff00');
      well.addBlock(2, 6, 2, '#0000ff');

      well.clearLayer(5);

      expect(well.isOccupied(2, 4, 2)).toBe(true);
      expect(well.isOccupied(2, 5, 2)).toBe(false);
      expect(well.isOccupied(2, 6, 2)).toBe(true);
    });

    it('should handle clearing empty layer gracefully', () => {
      expect(() => well.clearLayer(3)).not.toThrow();
    });

    it('should handle clearing partially filled layer', () => {
      well.addBlock(0, 3, 0, '#ff0000');
      well.addBlock(1, 3, 1, '#00ff00');

      well.clearLayer(3);

      expect(well.isOccupied(0, 3, 0)).toBe(false);
      expect(well.isOccupied(1, 3, 1)).toBe(false);
    });
  });

  describe('isLayerComplete', () => {
    it('should return false for empty layer', () => {
      expect(well.isLayerComplete(0)).toBe(false);
    });

    it('should return false for partially filled layer', () => {
      well.addBlock(0, 0, 0, '#ff0000');
      well.addBlock(1, 0, 0, '#ff0000');
      expect(well.isLayerComplete(0)).toBe(false);
    });

    it('should return true for completely filled layer (5x5 = 25 blocks)', () => {
      // Fill all 25 cells at y=3
      for (let x = 0; x < 5; x++) {
        for (let z = 0; z < 5; z++) {
          well.addBlock(x, 3, z, '#ff0000');
        }
      }
      expect(well.isLayerComplete(3)).toBe(true);
    });

    it('should return false when missing one block', () => {
      // Fill all but one cell
      for (let x = 0; x < 5; x++) {
        for (let z = 0; z < 5; z++) {
          if (!(x === 4 && z === 4)) {
            well.addBlock(x, 3, z, '#ff0000');
          }
        }
      }
      expect(well.isLayerComplete(3)).toBe(false);
    });

    it('should return false for layer with exact count but wrong Y level', () => {
      // Fill layer y=2
      for (let x = 0; x < 5; x++) {
        for (let z = 0; z < 5; z++) {
          well.addBlock(x, 2, z, '#ff0000');
        }
      }

      expect(well.isLayerComplete(2)).toBe(true);
      expect(well.isLayerComplete(3)).toBe(false);
    });

    it('should handle multiple complete layers independently', () => {
      // Fill two layers
      for (let x = 0; x < 5; x++) {
        for (let z = 0; z < 5; z++) {
          well.addBlock(x, 1, z, '#ff0000');
          well.addBlock(x, 2, z, '#00ff00');
        }
      }

      expect(well.isLayerComplete(1)).toBe(true);
      expect(well.isLayerComplete(2)).toBe(true);
      expect(well.isLayerComplete(0)).toBe(false);
      expect(well.isLayerComplete(3)).toBe(false);
    });

    it('should early exit when first cell is empty (optimization)', () => {
      // No blocks at y=0, should return false immediately
      expect(well.isLayerComplete(0)).toBe(false);
    });

    it('should early exit when cell in middle is empty', () => {
      // Fill first half of layer at y=3
      for (let x = 0; x < 3; x++) {
        for (let z = 0; z < 5; z++) {
          well.addBlock(x, 3, z, '#ff0000');
        }
      }
      // Missing blocks at x=3 and x=4
      expect(well.isLayerComplete(3)).toBe(false);
    });
  });

  describe('integration scenarios', () => {
    it('should handle add, check complete, and clear sequence', () => {
      // Fill a complete layer
      for (let x = 0; x < 5; x++) {
        for (let z = 0; z < 5; z++) {
          well.addBlock(x, 5, z, '#ff0000');
        }
      }

      expect(well.isLayerComplete(5)).toBe(true);

      well.clearLayer(5);

      expect(well.isLayerComplete(5)).toBe(false);

      // Verify all cells are empty
      for (let x = 0; x < 5; x++) {
        for (let z = 0; z < 5; z++) {
          expect(well.isOccupied(x, 5, z)).toBe(false);
        }
      }
    });

    it('should maintain occupied cells count correctly', () => {
      const wellData = well.getWellData();

      expect(wellData.occupiedCells.size).toBe(0);

      well.addBlock(0, 0, 0, '#ff0000');
      expect(wellData.occupiedCells.size).toBe(1);

      well.addBlock(1, 0, 0, '#00ff00');
      expect(wellData.occupiedCells.size).toBe(2);

      well.removeBlock(0, 0, 0);
      expect(wellData.occupiedCells.size).toBe(1);
    });
  });
});
