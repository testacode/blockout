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

- Node.js (>=22.12.0)
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

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linter
npm run lint

# Format code
npm run format

# Run all checks (typecheck + lint + format)
npm run check
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with UI interface
npm run test:ui
```

Tests are written with Vitest and cover:
- Game logic (collision detection, rotation, piece movement)
- Utility functions (coordinate conversions, rotation matrices)
- Well management (layer clearing, occupancy tracking)

### Code Quality

```bash
# Check code formatting
npm run format:check

# Auto-format all files
npm run format

# Run linter
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Run all checks (typecheck + lint + format)
npm run check
```

The project uses Biome.js for fast linting and formatting with strict TypeScript rules.

## Tech Stack

- **TypeScript** - Type-safe development
- **Three.js** - 3D rendering engine
- **Vite** - Fast build tool and dev server
- **Vitest** - Modern unit testing framework
- **Biome.js** - Fast linter and formatter
- **Web Audio API** - Sound effects
- **Modular CSS** - Organized styling (no frameworks)

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
│   ├── Renderer.ts      # Three.js rendering
│   ├── Piece.test.ts    # Piece unit tests
│   └── Well.test.ts     # Well unit tests
├── utils/
│   ├── collision.ts     # Collision detection
│   ├── rotation.ts      # 3D rotation matrices
│   ├── coordinates.ts   # Grid/world conversions
│   ├── collision.test.ts    # Collision tests
│   ├── rotation.test.ts     # Rotation tests
│   └── coordinates.test.ts  # Coordinates tests
├── audio/
│   └── AudioManager.ts  # Sound effects
├── effects/
│   └── ParticleEffects.ts # Line clear particles
├── ui/
│   └── GameUI.ts        # Score/stats UI
├── types/
│   └── index.ts         # TypeScript definitions
└── styles/
    ├── main.css         # Main stylesheet (imports all)
    ├── reset.css        # CSS reset
    ├── layout.css       # Layout and positioning
    ├── ui-panel.css     # UI panel styles
    └── animations.css   # Animations and transitions

public/
└── sound/               # Audio files (.wav)
docs/                    # Game specification
```

## Development Notes

- Uses strict TypeScript mode (Node.js >=22.12.0)
- Follows SOLID principles
- Separation of concerns (game logic vs rendering)
- Comprehensive unit tests with Vitest (155 tests)
- Code quality enforced with Biome.js (linting + formatting)
- No Tailwind CSS (modular vanilla CSS)
- Uses `type` instead of `interface`
- Automated CI/CD with GitHub Actions

## CI/CD

The project uses GitHub Actions for continuous integration and deployment.

### CI Workflow

Runs on every push to `master`:
- ✅ TypeScript typecheck (`tsc --noEmit`)
- ✅ Unit tests (`npm test`)
- ✅ Biome linting (`npm run lint`)
- ✅ Format checking (`npm run format:check`)

### Deployment

- **Automatic deployment** to GitHub Pages on push to `master`
- **Live URL**: https://testacode.github.io/blockout/
- Built with Vite and optimized for production

## License

MIT

## Credits

Inspired by the classic Blockout game (1989) by California Dreams.
