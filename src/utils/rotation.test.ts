import { describe, it, expect } from 'vitest';
import { rotateAroundX, rotateAroundY, rotateAroundZ, rotateBlocks } from './rotation';
import type { Vector3 } from '../types';

describe('rotateAroundX', () => {
  it('should rotate 90 degrees around X-axis', () => {
    const vector: Vector3 = { x: 1, y: 1, z: 0 };
    const result = rotateAroundX(vector, 90);
    expect(result).toEqual({ x: 1, y: 0, z: 1 });
  });

  it('should rotate 180 degrees around X-axis', () => {
    const vector: Vector3 = { x: 1, y: 1, z: 0 };
    const result = rotateAroundX(vector, 180);
    expect(result).toEqual({ x: 1, y: -1, z: 0 });
  });

  it('should rotate 270 degrees around X-axis', () => {
    const vector: Vector3 = { x: 1, y: 1, z: 0 };
    const result = rotateAroundX(vector, 270);
    // Handle -0 vs +0 from floating point arithmetic
    expect(result.x).toBe(1);
    expect(Math.abs(result.y)).toBe(0);
    expect(result.z).toBe(-1);
  });

  it('should rotate 360 degrees to original position', () => {
    const vector: Vector3 = { x: 2, y: 3, z: 4 };
    const result = rotateAroundX(vector, 360);
    expect(result).toEqual(vector);
  });

  it('should handle zero rotation', () => {
    const vector: Vector3 = { x: 1, y: 2, z: 3 };
    const result = rotateAroundX(vector, 0);
    expect(result).toEqual(vector);
  });

  it('should handle negative angles', () => {
    const vector: Vector3 = { x: 1, y: 1, z: 0 };
    const result = rotateAroundX(vector, -90);
    expect(result).toEqual({ x: 1, y: 0, z: -1 });
  });

  it('should not affect x coordinate', () => {
    const vector: Vector3 = { x: 5, y: 2, z: 3 };
    const result = rotateAroundX(vector, 45);
    expect(result.x).toBe(5);
  });

  it('should handle zero vector', () => {
    const vector: Vector3 = { x: 0, y: 0, z: 0 };
    const result = rotateAroundX(vector, 90);
    expect(result).toEqual({ x: 0, y: 0, z: 0 });
  });
});

describe('rotateAroundY', () => {
  it('should rotate 90 degrees around Y-axis', () => {
    const vector: Vector3 = { x: 1, y: 1, z: 0 };
    const result = rotateAroundY(vector, 90);
    expect(result).toEqual({ x: 0, y: 1, z: -1 });
  });

  it('should rotate 180 degrees around Y-axis', () => {
    const vector: Vector3 = { x: 1, y: 1, z: 0 };
    const result = rotateAroundY(vector, 180);
    // Handle -0 vs +0 from floating point arithmetic
    expect(result.x).toBe(-1);
    expect(result.y).toBe(1);
    expect(Math.abs(result.z)).toBe(0);
  });

  it('should rotate 270 degrees around Y-axis', () => {
    const vector: Vector3 = { x: 1, y: 1, z: 0 };
    const result = rotateAroundY(vector, 270);
    // Handle -0 vs +0 from floating point arithmetic
    expect(Math.abs(result.x)).toBe(0);
    expect(result.y).toBe(1);
    expect(result.z).toBe(1);
  });

  it('should rotate 360 degrees to original position', () => {
    const vector: Vector3 = { x: 2, y: 3, z: 4 };
    const result = rotateAroundY(vector, 360);
    expect(result).toEqual(vector);
  });

  it('should handle zero rotation', () => {
    const vector: Vector3 = { x: 1, y: 2, z: 3 };
    const result = rotateAroundY(vector, 0);
    expect(result).toEqual(vector);
  });

  it('should handle negative angles', () => {
    const vector: Vector3 = { x: 1, y: 1, z: 0 };
    const result = rotateAroundY(vector, -90);
    expect(result).toEqual({ x: 0, y: 1, z: 1 });
  });

  it('should not affect y coordinate', () => {
    const vector: Vector3 = { x: 2, y: 5, z: 3 };
    const result = rotateAroundY(vector, 45);
    expect(result.y).toBe(5);
  });

  it('should handle zero vector', () => {
    const vector: Vector3 = { x: 0, y: 0, z: 0 };
    const result = rotateAroundY(vector, 90);
    expect(result).toEqual({ x: 0, y: 0, z: 0 });
  });
});

describe('rotateAroundZ', () => {
  it('should rotate 90 degrees around Z-axis', () => {
    const vector: Vector3 = { x: 1, y: 0, z: 1 };
    const result = rotateAroundZ(vector, 90);
    expect(result).toEqual({ x: 0, y: 1, z: 1 });
  });

  it('should rotate 180 degrees around Z-axis', () => {
    const vector: Vector3 = { x: 1, y: 0, z: 1 };
    const result = rotateAroundZ(vector, 180);
    expect(result).toEqual({ x: -1, y: 0, z: 1 });
  });

  it('should rotate 270 degrees around Z-axis', () => {
    const vector: Vector3 = { x: 1, y: 0, z: 1 };
    const result = rotateAroundZ(vector, 270);
    // Handle -0 vs +0 from floating point arithmetic
    expect(Math.abs(result.x)).toBe(0);
    expect(result.y).toBe(-1);
    expect(result.z).toBe(1);
  });

  it('should rotate 360 degrees to original position', () => {
    const vector: Vector3 = { x: 2, y: 3, z: 4 };
    const result = rotateAroundZ(vector, 360);
    expect(result).toEqual(vector);
  });

  it('should handle zero rotation', () => {
    const vector: Vector3 = { x: 1, y: 2, z: 3 };
    const result = rotateAroundZ(vector, 0);
    expect(result).toEqual(vector);
  });

  it('should handle negative angles', () => {
    const vector: Vector3 = { x: 1, y: 0, z: 1 };
    const result = rotateAroundZ(vector, -90);
    expect(result).toEqual({ x: 0, y: -1, z: 1 });
  });

  it('should not affect z coordinate', () => {
    const vector: Vector3 = { x: 2, y: 3, z: 5 };
    const result = rotateAroundZ(vector, 45);
    expect(result.z).toBe(5);
  });

  it('should handle zero vector', () => {
    const vector: Vector3 = { x: 0, y: 0, z: 0 };
    const result = rotateAroundZ(vector, 90);
    expect(result).toEqual({ x: 0, y: 0, z: 0 });
  });
});

describe('rotateBlocks', () => {
  it('should rotate all blocks around X-axis', () => {
    const blocks: Vector3[] = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
    ];
    const result = rotateBlocks(blocks, 'x', 90);
    expect(result).toEqual([
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
    ]);
  });

  it('should rotate all blocks around Y-axis', () => {
    const blocks: Vector3[] = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
    ];
    const result = rotateBlocks(blocks, 'y', 90);
    expect(result).toEqual([
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: -1 },
      { x: 0, y: 1, z: 0 },
    ]);
  });

  it('should rotate all blocks around Z-axis', () => {
    const blocks: Vector3[] = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
    ];
    const result = rotateBlocks(blocks, 'z', 90);
    expect(result).toEqual([
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: -1, y: 0, z: 0 },
    ]);
  });

  it('should handle empty blocks array', () => {
    const blocks: Vector3[] = [];
    const result = rotateBlocks(blocks, 'x', 90);
    expect(result).toEqual([]);
  });

  it('should not mutate original blocks array', () => {
    const blocks: Vector3[] = [
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
    ];
    const originalBlocks = blocks.map((b) => ({ ...b }));

    rotateBlocks(blocks, 'y', 90);

    expect(blocks).toEqual(originalBlocks);
  });

  it('should handle multiple rotations correctly', () => {
    const blocks: Vector3[] = [{ x: 1, y: 0, z: 0 }];

    const result1 = rotateBlocks(blocks, 'z', 90);
    const result2 = rotateBlocks(result1, 'z', 90);

    expect(result2).toEqual([{ x: -1, y: 0, z: 0 }]);
  });

  it('should handle cube piece (8 blocks)', () => {
    const cubeBlocks: Vector3[] = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: 1, y: 0, z: 1 },
      { x: 0, y: 1, z: 0 },
      { x: 1, y: 1, z: 0 },
      { x: 0, y: 1, z: 1 },
      { x: 1, y: 1, z: 1 },
    ];

    const result = rotateBlocks(cubeBlocks, 'y', 90);
    expect(result).toHaveLength(8);
  });
});

describe('rotation consistency', () => {
  it('should maintain vector length after rotation', () => {
    const vector: Vector3 = { x: 3, y: 4, z: 0 };
    const length = Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2);

    const rotated = rotateAroundZ(vector, 45);
    const rotatedLength = Math.sqrt(rotated.x ** 2 + rotated.y ** 2 + rotated.z ** 2);

    // Math.round() in rotation functions can affect length slightly
    // Allow larger tolerance due to rounding
    expect(Math.abs(rotatedLength - length)).toBeLessThan(0.2);
  });

  it('should be reversible (rotate then rotate back)', () => {
    const vector: Vector3 = { x: 2, y: 3, z: 4 };

    const rotated = rotateAroundX(vector, 90);
    const rotatedBack = rotateAroundX(rotated, -90);

    expect(rotatedBack).toEqual(vector);
  });
});
