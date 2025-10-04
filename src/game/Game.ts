import { Renderer } from './Renderer'
import { Well } from './Well'
import { Controls } from './Controls'
import { AudioManager } from '../audio/AudioManager'
import { createRandomPiece } from './Piece'
import { wouldCollide, addVector3 } from '../utils/collision'
import type { GameState, Vector3 } from '../types'

// Game - Main game loop and state management
// Single source of truth for game state

export class Game {
  private renderer: Renderer
  private well: Well
  private controls: Controls
  private audioManager: AudioManager
  private state: GameState
  private lastTime: number = 0
  private animationFrameId: number | null = null
  private fallTimer: number = 0

  constructor(container: HTMLElement) {
    // Initialize renderer and scene
    this.renderer = new Renderer(container)

    // Initialize game well
    this.well = new Well(this.renderer.getScene())

    // Initialize controls
    this.controls = new Controls()
    this.controls.setActionHandler(this.handleAction.bind(this))

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
    this.renderer.dispose()
  }

  private spawnPiece(): void {
    const newPiece = createRandomPiece()

    // Check if spawn position is blocked (game over)
    if (wouldCollide(newPiece, this.state.well, { x: 0, y: 0, z: 0 })) {
      this.state.gameOver = true
      console.log('Game Over!')
      return
    }

    this.state.currentPiece = newPiece
    this.renderer.updateCurrentPiece(newPiece)
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
  }

  private handleAction(action: { type: string, offset?: Vector3 }): void {
    if (this.state.gameOver) {
      return
    }

    switch (action.type) {
      case 'move':
        if (action.offset) {
          this.movePiece(action.offset)
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
