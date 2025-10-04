# Blockout - 3D Tetris

A web-based 3D Tetris clone built with Three.js and TypeScript. Features falling 3D tetromino pieces in a 5×5×10 well where players must form complete horizontal layers.

## Features

- **Full 3D Gameplay** - Move and rotate pieces in three dimensions
- **Progressive Difficulty** - 19 levels with increasing speed (1000ms → 100ms)
- **Scoring System** - 100/300/500/800 points for clearing 1/2/3/4+ lines
- **Visual Effects** - Particle explosions on line clears with physics
- **Sound Effects** - Audio feedback for moves, rotations, locks, and clears
- **High Score Persistence** - Saves your best score to localStorage
- **Retro Aesthetic** - Cyan wireframe well with 3D interior grid

## Controls

| Key | Action |
|-----|--------|
| **Arrow Keys** | Move piece (left/right/forward/back) |
| **Q / W** | Rotate around X-axis |
| **A / S** | Rotate around Y-axis |
| **Z / X** | Rotate around Z-axis |
| **Space** | Fast drop to bottom |
| **P** | Pause/unpause game |
| **R** | Restart game |

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd blockout

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **TypeScript** - Type-safe development
- **Three.js** - 3D rendering engine
- **Vite** - Fast build tool and dev server
- **Web Audio API** - Sound effects
- **Vanilla CSS** - Styling (no frameworks)

## Game Rules

1. 3D pieces fall from the top of a 5×5×10 well
2. Move and rotate pieces to fit them together
3. Complete horizontal layers (25 blocks) to clear them
4. Cleared layers disappear and blocks above drop down
5. Game ends when pieces reach the top
6. Every 10 lines cleared increases the level and speed

## Project Structure

```
src/
├── main.ts              # Entry point
├── game/
│   ├── Game.ts          # Main game loop and state
│   ├── Piece.ts         # 3D piece definitions
│   ├── Well.ts          # Game well logic
│   ├── Controls.ts      # Keyboard input
│   └── Renderer.ts      # Three.js rendering
├── utils/
│   ├── collision.ts     # Collision detection
│   ├── rotation.ts      # 3D rotation matrices
│   └── coordinates.ts   # Grid/world conversions
├── audio/
│   └── AudioManager.ts  # Sound effects
├── effects/
│   └── ParticleEffects.ts # Line clear particles
├── ui/
│   └── GameUI.ts        # Score/stats UI
├── types/
│   └── index.ts         # TypeScript definitions
└── style.css            # Global styles

sound/                   # Audio files
docs/                    # Game specification
```

## Development Notes

- Uses strict TypeScript mode
- Follows SOLID principles
- Separation of concerns (game logic vs rendering)
- No Tailwind CSS (vanilla CSS only)
- Uses `type` instead of `interface`

## License

MIT

## Credits

Inspired by the classic Blockout game (1989) by California Dreams.
