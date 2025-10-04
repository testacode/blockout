import { Renderer } from './Renderer'
import { Well } from './Well'
import { Controls } from './Controls'
import { GameUI } from '../ui/GameUI'
import { AudioManager } from '../audio/AudioManager'
import { createRandomPiece } from './Piece'
import { wouldCollide, addVector3 } from '../utils/collision'
import { rotateBlocks } from '../utils/rotation'
import type { GameState, Vector3 } from '../types'

// Game - Main game loop and state management
// Single source of truth for game state

export class Game {
  private renderer: Renderer
  private well: Well
  private controls: Controls
  private gameUI: GameUI
  private audioManager: AudioManager
  private state: GameState
  private lastTime: number = 0
  private animationFrameId: number | null = null
  private fallTimer: number = 0

  // Scoring constants
  private readonly SCORE_DROP = 1
  private readonly SCORE_LINES = [0, 100, 300, 500, 800]  // [0, single, double, triple, quad+]

  constructor(container: HTMLElement) {
    // Initialize renderer and scene
    this.renderer = new Renderer(container)

    // Initialize game well
    this.well = new Well(this.renderer.getScene())

    // Initialize controls
    this.controls = new Controls()
    this.controls.setActionHandler(this.handleAction.bind(this))

    // Initialize UI
    this.gameUI = new GameUI()

    // Initialize audio (stub for now)
    this.audioManager = new AudioManager()

    // Initialize game state
    this.state = this.createInitialState()
  }

  private createInitialState(): GameState {
    return {
      currentPiece: null,
      nextPiece: null,
      well: this.well.getWellData(),
      score: 0,
      level: 1,
      linesCleared: 0,
      gameOver: false,
      isPaused: false,
      fallSpeed: 1000  // 1 second per drop initially
    }
  }

  start(): void {
    // Generate first next piece
    this.state.nextPiece = createRandomPiece()
    this.spawnPiece()
    this.controls.enable()
    this.lastTime = performance.now()
    this.gameLoop()
  }

  private gameLoop = (): void => {
    const currentTime = performance.now()
    const deltaTime = currentTime - this.lastTime
    this.lastTime = currentTime

    // Update game logic
    this.update(deltaTime)

    // Update UI
    this.gameUI.update(this.state)

    // Render the scene
    this.renderer.update(deltaTime)
    this.renderer.render()

    // Continue the loop
    this.animationFrameId = requestAnimationFrame(this.gameLoop)
  }

  private update(deltaTime: number): void {
    if (this.state.gameOver || this.state.isPaused) {
      return
    }

    if (!this.state.currentPiece) {
      return
    }

    // Accumulate fall timer
    this.fallTimer += deltaTime

    // Check if it's time to drop the piece
    if (this.fallTimer >= this.state.fallSpeed) {
      this.fallTimer = 0

      // Try to move piece down
      const downOffset: Vector3 = { x: 0, y: -1, z: 0 }

      if (!wouldCollide(this.state.currentPiece, this.state.well, downOffset)) {
        // Move piece down
        this.state.currentPiece.position = addVector3(
          this.state.currentPiece.position,
          downOffset
        )
        // Update visual representation
        this.renderer.updateCurrentPiece(this.state.currentPiece)
      } else {
        // Piece has landed - lock it and spawn new piece
        this.lockPiece()
        this.spawnPiece()
      }
    }

    // TODO: Phase 4
    // - Check for complete layers
    // - Update score
  }

  getState(): GameState {
    return this.state
  }

  pause(): void {
    this.state.isPaused = true
  }

  resume(): void {
    this.state.isPaused = false
  }

  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    this.controls.disable()
    this.gameUI.dispose()
    this.renderer.dispose()
  }

  private spawnPiece(): void {
    // Use next piece if available, otherwise generate random
    const newPiece = this.state.nextPiece || createRandomPiece()

    // Check if spawn position is blocked (game over)
    if (wouldCollide(newPiece, this.state.well, { x: 0, y: 0, z: 0 })) {
      this.state.gameOver = true
      console.log('Game Over!')
      return
    }

    this.state.currentPiece = newPiece
    this.renderer.updateCurrentPiece(newPiece)

    // Generate new next piece
    this.state.nextPiece = createRandomPiece()
  }

  private lockPiece(): void {
    if (!this.state.currentPiece) {
      return
    }

    // Add each block to occupied cells
    for (const block of this.state.currentPiece.blocks) {
      const worldPos = addVector3(this.state.currentPiece.position, block)
      this.well.addBlock(
        worldPos.x,
        worldPos.y,
        worldPos.z,
        this.state.currentPiece.color
      )
    }

    // Update renderer to show locked blocks
    this.renderer.updateOccupiedBlocks(this.state.well)

    // Clear current piece
    this.state.currentPiece = null

    // Check for complete layers and clear them
    this.checkAndClearLayers()
  }

  private checkAndClearLayers(): void {
    const completeLayers: number[] = []
    const wellData = this.well.getWellData()

    // Find all complete layers
    for (let y = 0; y < wellData.height; y++) {
      if (this.well.isLayerComplete(y)) {
        completeLayers.push(y)
      }
    }

    if (completeLayers.length === 0) {
      return
    }

    console.debug(`[Game] Clearing ${completeLayers.length} layer(s):`, completeLayers)

    // Clear the layers
    for (const y of completeLayers) {
      this.well.clearLayer(y)
    }

    // Drop blocks above cleared layers
    this.dropBlocksAbove(completeLayers)

    // Update renderer
    this.renderer.updateOccupiedBlocks(this.well)

    // Update score and stats
    this.state.linesCleared += completeLayers.length
    this.addScore(completeLayers.length)
  }

  private addScore(linesCleared: number): void {
    // Add points based on number of lines cleared at once
    const lineScore = this.SCORE_LINES[Math.min(linesCleared, this.SCORE_LINES.length - 1)]
    this.state.score += lineScore
    console.debug(`[Game] Score +${lineScore} (${linesCleared} line(s)), Total: ${this.state.score}`)
  }

  private dropBlocksAbove(clearedLayers: number[]): void {
    const wellData = this.well.getWellData()

    // Sort layers from bottom to top for proper dropping
    const sortedLayers = [...clearedLayers].sort((a, b) => a - b)

    // For each cleared layer, drop all blocks above it
    for (const clearedY of sortedLayers) {
      // Scan from cleared layer upward
      for (let y = clearedY + 1; y < wellData.height; y++) {
        for (let x = 0; x < wellData.width; x++) {
          for (let z = 0; z < wellData.depth; z++) {
            const key = `${x},${y},${z}`
            const color = wellData.occupiedCells.get(key)

            if (color) {
              // Remove block from current position
              this.well.removeBlock(x, y, z)
              // Add block one position down
              this.well.addBlock(x, y - 1, z, color)
            }
          }
        }
      }
    }
  }

  private handleAction(action: { type: string, offset?: Vector3, axis?: 'x' | 'y' | 'z', direction?: number }): void {
    if (this.state.gameOver) {
      return
    }

    switch (action.type) {
      case 'move':
        if (action.offset) {
          this.movePiece(action.offset)
        }
        break
      case 'rotate':
        if (action.axis && action.direction) {
          this.rotatePiece(action.axis, action.direction)
        }
        break
      case 'fastDrop':
        this.fastDrop()
        break
      case 'pause':
        if (this.state.isPaused) {
          this.resume()
        } else {
          this.pause()
        }
        break
    }
  }

  private movePiece(offset: Vector3): void {
    if (!this.state.currentPiece || this.state.isPaused) {
      return
    }

    // Check if move is valid
    if (!wouldCollide(this.state.currentPiece, this.state.well, offset)) {
      this.state.currentPiece.position = addVector3(
        this.state.currentPiece.position,
        offset
      )
      this.renderer.updateCurrentPiece(this.state.currentPiece)
    }
  }

  private rotatePiece(axis: 'x' | 'y' | 'z', direction: number): void {
    if (!this.state.currentPiece || this.state.isPaused) {
      console.debug('[Game] Rotation blocked: no piece or paused')
      return
    }

    // Rotate 90 degrees in the specified direction
    const angle = direction * 90
    console.debug(`[Game] Attempting rotation: axis=${axis}, direction=${direction}, angle=${angle}°`)

    // Create rotated copy of blocks
    const rotatedBlocks = rotateBlocks(this.state.currentPiece.blocks, axis, angle)

    // Create temporary piece with rotated blocks for collision check
    const testPiece = {
      ...this.state.currentPiece,
      blocks: rotatedBlocks
    }

    // Check if rotation is valid (no collision at current position)
    if (!wouldCollide(testPiece, this.state.well, { x: 0, y: 0, z: 0 })) {
      console.debug('[Game] Rotation SUCCESS')
      this.state.currentPiece.blocks = rotatedBlocks
      this.renderer.updateCurrentPiece(this.state.currentPiece)
    } else {
      console.debug('[Game] Rotation BLOCKED by collision')
    }
  }

  private fastDrop(): void {
    if (!this.state.currentPiece || this.state.isPaused) {
      return
    }

    const downOffset: Vector3 = { x: 0, y: -1, z: 0 }

    // Drop piece until it collides
    while (!wouldCollide(this.state.currentPiece, this.state.well, downOffset)) {
      this.state.currentPiece.position = addVector3(
        this.state.currentPiece.position,
        downOffset
      )
    }

    // Update visual and lock piece
    this.renderer.updateCurrentPiece(this.state.currentPiece)
    this.lockPiece()
    this.spawnPiece()
  }
}
