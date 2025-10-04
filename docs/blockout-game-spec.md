# Blockout (Tetris 3D) Game Specification

## Project Overview
Create a web-based 3D Tetris clone (Blockout) using Three.js and TypeScript. The game features falling 3D tetromino pieces in a 3D well where players must form complete horizontal layers.

## Tech Stack
- **TypeScript** (strict mode)
- **Three.js** for 3D rendering
- **Vite** for bundling
- **NO Tailwind CSS** - use vanilla CSS or CSS modules

## Core Game Specifications

### Game Well
- Dimensions: 5x5x10 (width x depth x height)
- Transparent/wireframe walls to see inside
- Full 3D grid lines throughout interior for depth perception
- Grid-based coordinate system

### Game Pieces (3D Tetrominos)
Start with these basic pieces:
1. **I-piece**: 4 blocks in a line
2. **L-piece**: L-shaped piece
3. **T-piece**: T-shaped piece  
4. **Cube**: 2x2x2 cube
5. **Z-piece**: Z-shaped piece

### Controls
- **Arrow Keys**: Move piece (X/Z axis)
- **Q/W**: Rotate around X axis
- **A/S**: Rotate around Y axis
- **Z/X**: Rotate around Z axis
- **Space**: Fast drop
- **P**: Pause

## Domain Model (TypeScript Types)

**Note:** Using `type` instead of `interface` per project requirements.

```typescript
type Vector3 = {
  x: number
  y: number
  z: number
}

type Piece3D = {
  blocks: Vector3[]      // Relative positions of blocks
  position: Vector3      // Current position in well
  color: string         // Hex color
  rotation: Vector3     // Current rotation
}

type GameWell = {
  width: number
  depth: number
  height: number
  occupiedCells: Map<string, string> // "x,y,z" -> color
}

type GameState = {
  currentPiece: Piece3D | null
  nextPiece: Piece3D | null
  well: GameWell
  score: number
  level: number
  linesCleared: number
  gameOver: boolean
  isPaused: boolean
  fallSpeed: number // ms between drops
}

type GameRules = {
  initialFallSpeed: number
  speedIncreasePerLevel: number
  linesPerLevel: number
  scoring: {
    dropPoints: number
    linePoints: number[]  // [single, double, triple, etc.]
  }
}
```

## Implementation Steps (Priority Order)

### Phase 1: Basic Setup ✅ **COMPLETED**
1. ✅ Initialize Vite + TypeScript project with Node.js 22.12.0
2. ✅ Set up Three.js scene with camera and lighting
3. ✅ Create the wireframe well (5x5x10)
4. ✅ Create project structure with audio/ and effects/ directories
5. ✅ Implement core types (Vector3, Piece3D, GameWell, GameState)
6. ✅ Create stub classes for AudioManager and ParticleEffects
7. ✅ Set up game loop in Game.ts
8. ✅ Wire up Renderer with scene, camera, lighting

**Completed Files:**
- `src/types/index.ts` - Core type definitions
- `src/game/Renderer.ts` - Three.js scene and rendering
- `src/game/Well.ts` - Well visualization and logic
- `src/game/Game.ts` - Game loop and state management
- `src/audio/AudioManager.ts` - Stub for Phase 5
- `src/effects/ParticleEffects.ts` - Stub for Phase 5
- `src/main.ts` - Entry point

### Phase 2: Core Mechanics ✅ **COMPLETED**
1. ✅ Create piece definitions (start with just Cube and I-piece)
2. ✅ Implement piece spawning at top center
3. ✅ Add gravity (piece falls one unit per interval)
4. ✅ Implement collision detection with bottom and occupied cells
5. ✅ Add piece to occupiedCells when it lands

**Completed Files:**
- `src/game/Piece.ts` - CUBE and I_PIECE definitions with spawn logic
- `src/utils/collision.ts` - Collision detection algorithm
- `src/utils/coordinates.ts` - Grid/world coordinate helpers
- Updated `src/game/Game.ts` - Gravity, spawning, locking mechanics
- Updated `src/game/Renderer.ts` - Visual rendering of pieces and occupied blocks

### Phase 2.5: Visual Enhancements 🔜 **NEXT**
1. Adjust camera angle to top-down view (match reference image)
2. Add 3D grid visualization throughout well interior
3. Improve depth perception for upcoming rotation controls

**Purpose:** Better visuals will help testing/debugging Phase 3 controls and rotations

### Phase 3: Player Control
1. Implement lateral movement (arrow keys)
2. Add boundary checking (can't move outside well)
3. Implement fast drop (spacebar)
4. Add rotation for one axis first, then expand

### Phase 4: Game Logic
1. Detect complete layers
2. Remove complete layers and drop blocks above
3. Implement scoring system
4. Add next piece preview
5. Game over detection (pieces reach top)
6. Create UI panel displaying: score, cubes played, high score, pit dimensions

### Phase 5: Polish
1. Add start/pause/restart functionality
2. Implement levels and speed increase
3. Add particle effects for line clears (using Three.js Points)
4. Sound effects using Web Audio API
5. High score persistence (localStorage)

## Project Structure

```
blockout/
├── src/
│   ├── main.ts              // Entry point ✅
│   ├── game/
│   │   ├── Game.ts          // Main game class ✅
│   │   ├── Piece.ts         // Piece definitions and logic ✅
│   │   ├── Well.ts          // Game well/board logic ✅
│   │   ├── Controls.ts      // Input handling
│   │   └── Renderer.ts      // Three.js rendering ✅
│   ├── types/
│   │   └── index.ts         // TypeScript types (NO interfaces) ✅
│   ├── utils/
│   │   ├── collision.ts     // Collision detection ✅
│   │   └── coordinates.ts   // Grid/world coordinate conversion ✅
│   ├── ui/                  // UI components (Phase 4)
│   │   └── GameUI.ts        // UI panel for score/stats display
│   ├── audio/               // Audio system (Phase 5) ✅
│   │   └── AudioManager.ts  // Web Audio API wrapper (stub)
│   └── effects/             // Visual effects (Phase 5) ✅
│       └── ParticleEffects.ts  // Three.js particle systems (stub)
├── docs/
│   └── blockout-game-spec.md  // This file
├── index.html               // HTML entry point ✅
├── src/style.css            // Styles (NO Tailwind) ✅
├── package.json             // Node.js 22.12.0+ required ✅
├── tsconfig.json            // TypeScript config ✅
├── .nvmrc                   // Node version (22.12.0) ✅
├── .npmrc                   // npm config (engine-strict) ✅
└── CLAUDE.md                // Claude Code instructions ✅
```

## Key Algorithms

### Collision Detection
```typescript
function checkCollision(piece: Piece3D, well: GameWell): boolean {
  for (const block of piece.blocks) {
    const worldPos = addVector3(piece.position, block)
    
    // Check boundaries
    if (worldPos.x < 0 || worldPos.x >= well.width ||
        worldPos.z < 0 || worldPos.z >= well.depth ||
        worldPos.y < 0) {
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
```

### Layer Detection
```typescript
function findCompleteLayers(well: GameWell): number[] {
  const completeLayers: number[] = []
  
  for (let y = 0; y < well.height; y++) {
    let blocksInLayer = 0
    
    for (let x = 0; x < well.width; x++) {
      for (let z = 0; z < well.depth; z++) {
        if (well.occupiedCells.has(`${x},${y},${z}`)) {
          blocksInLayer++
        }
      }
    }
    
    if (blocksInLayer === well.width * well.depth) {
      completeLayers.push(y)
    }
  }
  
  return completeLayers
}
```

## Visual Design

### Colors
- Background: Dark blue/black (#0a0a0a)
- Well wireframe: Cyan (#00ffff)
- Pieces: Bright colors (red, green, blue, yellow, purple, orange)
- Grid lines: Semi-transparent white

### Camera
- Top-down angled view for better well interior visibility
- Perspective camera with 45° FOV
- Position: (2.5, 20, 12) looking at (2.5, 5, 2.5)
- Steeper angle provides better depth perception for 3D gameplay

## Start Command
```bash
npm create vite@latest blockout-game -- --template vanilla-ts
cd blockout-game
npm install three @types/three
npm run dev
```

## Notes for Implementation
1. Start simple - get a single cube falling and stopping at the bottom
2. Use Three.js BoxGeometry for each block
3. Consider using InstancedMesh for performance with many blocks
4. Keep game logic separate from rendering logic
5. Test collision detection thoroughly before adding rotation
6. Use CSS Grid or Flexbox for UI elements, NOT Tailwind

## MVP Definition
A playable game with:
- 2-3 piece types
- Working collision detection
- Layer clearing
- Score display
- Game over detection

Everything else is enhancement.
