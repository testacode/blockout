// GameUI - Display game stats and information
// Updates from GameState

import type { GameState } from '../types'
import type { Game } from '../game/Game'

export class GameUI {
  private wrapper: HTMLElement
  private container: HTMLElement
  private scoreElement: HTMLElement
  private linesElement: HTMLElement
  private levelElement: HTMLElement
  private highScoreElement: HTMLElement
  private gameOverElement: HTMLElement
  private game: Game | null = null

  constructor() {
    // Create game wrapper to contain both canvas and UI
    this.wrapper = document.createElement('div')
    this.wrapper.id = 'game-wrapper'
    document.body.appendChild(this.wrapper)

    // Move the app element into the wrapper first (left side)
    const appElement = document.getElementById('app')
    if (appElement) {
      this.wrapper.appendChild(appElement)
    }

    // Create UI panel and add to wrapper second (right side)
    this.container = this.createUI()
    this.wrapper.appendChild(this.container)

    this.scoreElement = document.getElementById('game-score')!
    this.linesElement = document.getElementById('game-lines')!
    this.levelElement = document.getElementById('game-level')!
    this.highScoreElement = document.getElementById('game-highscore')!

    // Create game over overlay (fixed positioning, centered on viewport)
    this.gameOverElement = this.createGameOverOverlay()
    document.body.appendChild(this.gameOverElement)
  }

  setGame(game: Game): void {
    this.game = game
  }

  private createUI(): HTMLElement {
    const panel = document.createElement('div')
    panel.id = 'game-ui'
    panel.innerHTML = `
      <div class="ui-panel">
        <h1 class="game-title">BLOCK<br>OUT</h1>

        <div class="stat-group">
          <div class="stat-label">SCORE</div>
          <div class="stat-value" id="game-score">0</div>
        </div>

        <div class="stat-group stat-group-highlight">
          <div class="stat-label">HIGH SCORE</div>
          <div class="stat-value stat-value-large" id="game-highscore">0</div>
        </div>

        <div class="stat-group stat-group-secondary">
          <div class="stat-label-small">LINES</div>
          <div class="stat-value-small" id="game-lines">0</div>
        </div>

        <div class="stat-group stat-group-secondary">
          <div class="stat-label-small">LEVEL</div>
          <div class="stat-value-small" id="game-level">1</div>
        </div>

        <div class="stat-group">
          <div class="stat-label">PIT</div>
          <div class="stat-value">5×5×10</div>
        </div>

        <div class="controls-hint">
          <div class="hint-item">↑↓←→: Move</div>
          <div class="hint-item">Q/W/A/S/Z/X: Rotate</div>
          <div class="hint-item">Space: Drop | P: Pause | R: Restart</div>
        </div>
      </div>
    `
    return panel
  }

  private createGameOverOverlay(): HTMLElement {
    const overlay = document.createElement('div')
    overlay.id = 'game-over-overlay'
    overlay.className = 'game-over-overlay hidden'
    overlay.textContent = 'GAME OVER'
    return overlay
  }

  update(state: GameState): void {
    this.scoreElement.textContent = state.score.toString()
    this.linesElement.textContent = state.linesCleared.toString()
    this.levelElement.textContent = state.level.toString()

    // Update high score
    if (this.game) {
      this.highScoreElement.textContent = this.game.getHighScore().toString()
    }

    if (state.gameOver) {
      this.gameOverElement.classList.remove('hidden')
    } else {
      this.gameOverElement.classList.add('hidden')
    }
  }

  dispose(): void {
    this.wrapper.remove()
    this.gameOverElement.remove()
  }
}
