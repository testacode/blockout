import type { Vector3 } from '../types';

// Convert grid coordinates to Three.js world coordinates
// Grid: (0,0,0) is bottom-front-left corner
// Three.js: BoxGeometry is centered, so we add 0.5 to center each block
export function gridToWorld(gridPos: Vector3): Vector3 {
  return {
    x: gridPos.x + 0.5,
    y: gridPos.y + 0.5,
    z: gridPos.z + 0.5,
  };
}

// Convert grid coordinates to Map key string
export function blockToKey(x: number, y: number, z: number): string {
  return `${x},${y},${z}`;
}

// Parse a Map key string back to coordinates
export function keyToBlock(key: string): Vector3 {
  const [x, y, z] = key.split(',').map(Number);
  return { x, y, z };
}
