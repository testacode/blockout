import { describe, expect, it } from 'vitest';
import type { GameWell, Piece3D, Vector3 } from '../types';
import { addVector3, checkCollision, wouldCollide } from './collision';

describe('addVector3', () => {
  it('should add two positive vectors correctly', () => {
    const a: Vector3 = { x: 1, y: 2, z: 3 };
    const b: Vector3 = { x: 4, y: 5, z: 6 };
    const result = addVector3(a, b);
    expect(result).toEqual({ x: 5, y: 7, z: 9 });
  });

  it('should handle negative numbers', () => {
    const a: Vector3 = { x: 5, y: 3, z: 2 };
    const b: Vector3 = { x: -2, y: -1, z: -3 };
    const result = addVector3(a, b);
    expect(result).toEqual({ x: 3, y: 2, z: -1 });
  });

  it('should handle zeros', () => {
    const a: Vector3 = { x: 0, y: 0, z: 0 };
    const b: Vector3 = { x: 1, y: 2, z: 3 };
    const result = addVector3(a, b);
    expect(result).toEqual({ x: 1, y: 2, z: 3 });
  });

  it('should be commutative', () => {
    const a: Vector3 = { x: 2, y: 3, z: 4 };
    const b: Vector3 = { x: 5, y: 6, z: 7 };
    expect(addVector3(a, b)).toEqual(addVector3(b, a));
  });
});

describe('checkCollision', () => {
  const createTestWell = (): GameWell => ({
    width: 5,
    depth: 5,
    height: 10,
    occupiedCells: new Map(),
  });

  const createTestPiece = (position: Vector3, blocks: Vector3[]): Piece3D => ({
    blocks,
    position,
    color: '#ff0000',
    rotation: { x: 0, y: 0, z: 0 },
  });

  describe('boundary checks', () => {
    it('should return false for piece within bounds', () => {
      const well = createTestWell();
      const piece = createTestPiece({ x: 2, y: 5, z: 2 }, [{ x: 0, y: 0, z: 0 }]);
      expect(checkCollision(piece, well)).toBe(false);
    });

    it('should detect collision with left wall (x < 0)', () => {
      const well = createTestWell();
      const piece = createTestPiece({ x: -1, y: 5, z: 2 }, [{ x: 0, y: 0, z: 0 }]);
      expect(checkCollision(piece, well)).toBe(true);
    });

    it('should detect collision with right wall (x >= width)', () => {
      const well = createTestWell();
      const piece = createTestPiece({ x: 5, y: 5, z: 2 }, [{ x: 0, y: 0, z: 0 }]);
      expect(checkCollision(piece, well)).toBe(true);
    });

    it('should detect collision with front wall (z < 0)', () => {
      const well = createTestWell();
      const piece = createTestPiece({ x: 2, y: 5, z: -1 }, [{ x: 0, y: 0, z: 0 }]);
      expect(checkCollision(piece, well)).toBe(true);
    });

    it('should detect collision with back wall (z >= depth)', () => {
      const well = createTestWell();
      const piece = createTestPiece({ x: 2, y: 5, z: 5 }, [{ x: 0, y: 0, z: 0 }]);
      expect(checkCollision(piece, well)).toBe(true);
    });

    it('should detect collision with floor (y < 0)', () => {
      const well = createTestWell();
      const piece = createTestPiece({ x: 2, y: -1, z: 2 }, [{ x: 0, y: 0, z: 0 }]);
      expect(checkCollision(piece, well)).toBe(true);
    });

    it('should detect collision with ceiling (y >= height)', () => {
      const well = createTestWell();
      const piece = createTestPiece({ x: 2, y: 10, z: 2 }, [{ x: 0, y: 0, z: 0 }]);
      expect(checkCollision(piece, well)).toBe(true);
    });

    it('should allow piece at boundary edges', () => {
      const well = createTestWell();
      const piece = createTestPiece({ x: 4, y: 9, z: 4 }, [{ x: 0, y: 0, z: 0 }]);
      expect(checkCollision(piece, well)).toBe(false);
    });
  });

  describe('occupied cell checks', () => {
    it('should detect collision with single occupied cell', () => {
      const well = createTestWell();
      well.occupiedCells.set('2,5,2', '#ff0000');

      const piece = createTestPiece({ x: 2, y: 5, z: 2 }, [{ x: 0, y: 0, z: 0 }]);
      expect(checkCollision(piece, well)).toBe(true);
    });

    it('should not collide with non-overlapping occupied cells', () => {
      const well = createTestWell();
      well.occupiedCells.set('0,0,0', '#ff0000');
      well.occupiedCells.set('4,9,4', '#00ff00');

      const piece = createTestPiece({ x: 2, y: 5, z: 2 }, [{ x: 0, y: 0, z: 0 }]);
      expect(checkCollision(piece, well)).toBe(false);
    });

    it('should detect collision with any block in multi-block piece', () => {
      const well = createTestWell();
      well.occupiedCells.set('3,5,2', '#ff0000');

      const piece = createTestPiece({ x: 2, y: 5, z: 2 }, [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 }, // This block at (3,5,2) collides
        { x: 0, y: 1, z: 0 },
      ]);
      expect(checkCollision(piece, well)).toBe(true);
    });
  });

  describe('complex scenarios', () => {
    it('should handle piece with multiple blocks, all valid', () => {
      const well = createTestWell();
      const piece = createTestPiece({ x: 1, y: 1, z: 1 }, [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 1, y: 1, z: 0 },
      ]);
      expect(checkCollision(piece, well)).toBe(false);
    });

    it('should handle piece extending beyond width boundary', () => {
      const well = createTestWell();
      const piece = createTestPiece({ x: 4, y: 1, z: 1 }, [
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 }, // This extends to x=5, out of bounds
      ]);
      expect(checkCollision(piece, well)).toBe(true);
    });
  });
});

describe('wouldCollide', () => {
  const createTestWell = (): GameWell => ({
    width: 5,
    depth: 5,
    height: 10,
    occupiedCells: new Map(),
  });

  const createTestPiece = (position: Vector3): Piece3D => ({
    blocks: [{ x: 0, y: 0, z: 0 }],
    position,
    color: '#ff0000',
    rotation: { x: 0, y: 0, z: 0 },
  });

  it('should return false when movement is valid', () => {
    const well = createTestWell();
    const piece = createTestPiece({ x: 2, y: 5, z: 2 });
    const offset: Vector3 = { x: 0, y: -1, z: 0 };
    expect(wouldCollide(piece, well, offset)).toBe(false);
  });

  it('should return true when moving down into floor', () => {
    const well = createTestWell();
    const piece = createTestPiece({ x: 2, y: 0, z: 2 });
    const offset: Vector3 = { x: 0, y: -1, z: 0 };
    expect(wouldCollide(piece, well, offset)).toBe(true);
  });

  it('should return true when moving left into wall', () => {
    const well = createTestWell();
    const piece = createTestPiece({ x: 0, y: 5, z: 2 });
    const offset: Vector3 = { x: -1, y: 0, z: 0 };
    expect(wouldCollide(piece, well, offset)).toBe(true);
  });

  it('should return true when moving right into wall', () => {
    const well = createTestWell();
    const piece = createTestPiece({ x: 4, y: 5, z: 2 });
    const offset: Vector3 = { x: 1, y: 0, z: 0 };
    expect(wouldCollide(piece, well, offset)).toBe(true);
  });

  it('should return true when moving forward into wall', () => {
    const well = createTestWell();
    const piece = createTestPiece({ x: 2, y: 5, z: 0 });
    const offset: Vector3 = { x: 0, y: 0, z: -1 };
    expect(wouldCollide(piece, well, offset)).toBe(true);
  });

  it('should return true when moving back into wall', () => {
    const well = createTestWell();
    const piece = createTestPiece({ x: 2, y: 5, z: 4 });
    const offset: Vector3 = { x: 0, y: 0, z: 1 };
    expect(wouldCollide(piece, well, offset)).toBe(true);
  });

  it('should return true when moving into occupied cell', () => {
    const well = createTestWell();
    well.occupiedCells.set('2,4,2', '#00ff00');

    const piece = createTestPiece({ x: 2, y: 5, z: 2 });
    const offset: Vector3 = { x: 0, y: -1, z: 0 };
    expect(wouldCollide(piece, well, offset)).toBe(true);
  });

  it('should not modify original piece', () => {
    const well = createTestWell();
    const piece = createTestPiece({ x: 2, y: 5, z: 2 });
    const originalPosition = { ...piece.position };
    const offset: Vector3 = { x: 1, y: -1, z: 1 };

    wouldCollide(piece, well, offset);

    expect(piece.position).toEqual(originalPosition);
  });
});
