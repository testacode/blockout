import { Renderer } from './Renderer'
import { Well } from './Well'
import { AudioManager } from '../audio/AudioManager'
import type { GameState } from '../types'

// Game - Main game loop and state management
// Single source of truth for game state

export class Game {
  private renderer: Renderer
  private well: Well
  private audioManager: AudioManager
  private state: GameState
  private lastTime: number = 0
  private animationFrameId: number | null = null

  constructor(container: HTMLElement) {
    // Initialize renderer and scene
    this.renderer = new Renderer(container)

    // Initialize game well
    this.well = new Well(this.renderer.getScene())

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

    // TODO: Phase 2-4
    // - Update piece falling
    // - Check collisions
    // - Handle piece landing
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
    this.renderer.dispose()
  }
}
