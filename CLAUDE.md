# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Blockout is a web-based 3D Tetris clone built with Three.js and TypeScript. Players manipulate falling 3D tetromino pieces in a 5x5x10 well to form complete horizontal layers.

## Tech Stack

- **TypeScript** (strict mode) - NO interfaces, use types instead
- **Three.js** for 3D rendering
- **Vite** for bundling and development
- **NO Tailwind CSS** - use vanilla CSS or CSS modules only

## Project Initialization

The project is initialized using Vite with vanilla TypeScript template:

```bash
npm create vite@latest . -- --template vanilla-ts
npm install three @types/three
npm run dev
```

## Development Commands

Once initialized, these commands will be available:

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (TypeScript compilation + Vite bundling)
- `npm run preview` - Preview production build locally

## Architecture

### Directory Structure

```
src/
├── main.ts              # Entry point, initializes the game
├── game/
│   ├── Game.ts          # Main game loop and state management
│   ├── Piece.ts         # 3D piece definitions and transformations
│   ├── Well.ts          # Game well logic and occupied cell tracking
│   ├── Controls.ts      # Keyboard input handling
│   └── Renderer.ts      # Three.js scene, camera, and rendering
├── types/
│   └── index.ts         # TypeScript type definitions (use types, not interfaces)
├── utils/
│   ├── collision.ts     # Collision detection algorithms
│   └── coordinates.ts   # Grid/world coordinate conversions
├── audio/               # Audio system (Phase 5)
│   └── AudioManager.ts  # Web Audio API wrapper for game sounds
└── effects/             # Visual effects (Phase 5)
    └── ParticleEffects.ts  # Three.js particle systems for line clears
```

### Key Design Principles

**Separation of Concerns:**
- Game logic (Game.ts, Well.ts, Piece.ts) is completely separate from rendering (Renderer.ts)
- Controls.ts handles input and translates to game actions
- Renderer.ts only consumes game state, never modifies it
- AudioManager and ParticleEffects respond to game events without coupling to game logic

**State Management:**
- GameState is the single source of truth
- Occupied cells stored as Map with "x,y,z" string keys
- Pieces defined as relative block positions + world position + rotation

**Coordinate System:**
- Game well: 5 width (x) × 5 depth (z) × 10 height (y)
- Y-axis is vertical (0 at bottom, 10 at top)
- Origin (0,0,0) is bottom-front-left corner

## Core Type Definitions

All types are defined in `src/types/index.ts` (use `type`, not `interface`):

```typescript
type Vector3 = { x: number; y: number; z: number }
type Piece3D = { blocks: Vector3[]; position: Vector3; color: string; rotation: Vector3 }
type GameWell = { width: number; depth: number; height: number; occupiedCells: Map<string, string> }
type GameState = { currentPiece, nextPiece, well, score, level, linesCleared, gameOver, isPaused, fallSpeed }
```

## Game Controls

- **Arrow Keys:** Move piece horizontally (X/Z plane)
- **Q/W:** Rotate around X axis
- **A/S:** Rotate around Y axis
- **Z/X:** Rotate around Z axis
- **Space:** Fast drop
- **P:** Pause/unpause

## Critical Algorithms

### Collision Detection
Check each block of a piece against:
1. Well boundaries (x: 0-4, y: 0-9, z: 0-4)
2. Occupied cells in `well.occupiedCells` Map

### Layer Clearing
For each Y level, count blocks at all (x,z) positions. If count equals width × depth (25), the layer is complete.

### Rotation
3D rotation requires matrix transformations around X, Y, and Z axes. Apply to each block's relative position, then check collision before committing.

## Implementation Phases

The game spec defines 5 phases (see docs/blockout-game-spec.md):
- **Phase 1-4:** Core game mechanics (pieces, collision, controls, layer clearing)
- **Phase 5:** Polish (audio, particle effects, levels, high scores)

**Audio & Effects Strategy:**
- Directory structure includes `audio/` and `effects/` from the start
- These modules are stubbed early but implemented in Phase 5
- Game.ts will emit events (piece landed, line cleared, etc.) that audio/effects can hook into
- Using Web Audio API for sound (no external dependencies)
- Using Three.js Points/BufferGeometry for particle systems

When working on features, refer to the spec for detailed requirements and example algorithms.

## Visual Design

- Background: Dark (#0a0a0a)
- Well: Cyan wireframe (#00ffff), transparent walls
- Pieces: Bright colors (red, green, blue, yellow, purple, orange)
- Camera: Perspective, positioned at (15, 15, 15) looking at well center (2.5, 5, 2.5)

## Development Notes

- Keep rendering separate from game logic - Renderer.ts consumes state but never modifies it
- Use Three.js BoxGeometry for individual blocks
- Consider InstancedMesh for performance when many blocks are rendered
- Piece definitions in Piece.ts should be static arrays of Vector3 block positions
- Test collision detection thoroughly before implementing rotation
- Files should remain focused and under 200 lines when possible

## Audio & Effects (Phase 5)

**Particle Effects:**
- Use Three.js `Points` with `BufferGeometry` and `PointsMaterial`
- Can handle hundreds of thousands of particles with good performance
- For line clears: spawn particles at cleared layer, animate outward, fade out

**Audio System:**
- Use native Web Audio API (no dependencies)
- Sound events: piece move, rotate, land, line clear, game over
- Supports 3D positional audio (pieces landing at different positions)
- Mobile considerations: requires user interaction to start audio context
- If the dev server or the app is already running there's no need to run the build script