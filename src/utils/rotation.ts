// Rotation utilities for 3D piece rotation
// Uses rotation matrices for X, Y, Z axes

import type { Vector3 } from '../types'

// Rotate a vector around the X-axis
// Positive angle rotates counter-clockwise when looking from positive X towards origin
export function rotateAroundX(vector: Vector3, angleDegrees: number): Vector3 {
  const rad = (angleDegrees * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  return {
    x: vector.x,
    y: Math.round(vector.y * cos - vector.z * sin),
    z: Math.round(vector.y * sin + vector.z * cos)
  }
}

// Rotate a vector around the Y-axis
// Positive angle rotates counter-clockwise when looking from positive Y towards origin
export function rotateAroundY(vector: Vector3, angleDegrees: number): Vector3 {
  const rad = (angleDegrees * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  return {
    x: Math.round(vector.x * cos + vector.z * sin),
    y: vector.y,
    z: Math.round(-vector.x * sin + vector.z * cos)
  }
}

// Rotate a vector around the Z-axis
// Positive angle rotates counter-clockwise when looking from positive Z towards origin
export function rotateAroundZ(vector: Vector3, angleDegrees: number): Vector3 {
  const rad = (angleDegrees * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  return {
    x: Math.round(vector.x * cos - vector.y * sin),
    y: Math.round(vector.x * sin + vector.y * cos),
    z: vector.z
  }
}

// Apply rotation to all blocks in a piece
export function rotateBlocks(
  blocks: Vector3[],
  axis: 'x' | 'y' | 'z',
  angleDegrees: number
): Vector3[] {
  const rotateFn = axis === 'x'
    ? rotateAroundX
    : axis === 'y'
    ? rotateAroundY
    : rotateAroundZ

  return blocks.map(block => rotateFn(block, angleDegrees))
}
