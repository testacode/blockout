// GameUI - Display game stats and information
// Updates from GameState

import type { GameState } from '../types'

export class GameUI {
  private container: HTMLElement
  private scoreElement: HTMLElement
  private linesElement: HTMLElement
  private levelElement: HTMLElement
  private gameOverElement: HTMLElement

  constructor() {
    this.container = this.createUI()
    document.body.appendChild(this.container)

    this.scoreElement = document.getElementById('game-score')!
    this.linesElement = document.getElementById('game-lines')!
    this.levelElement = document.getElementById('game-level')!
    this.gameOverElement = document.getElementById('game-over')!
  }

  private createUI(): HTMLElement {
    const panel = document.createElement('div')
    panel.id = 'game-ui'
    panel.innerHTML = `
      <div class="ui-panel">
        <h1>BLOCKOUT</h1>

        <div class="stat-group">
          <div class="stat-label">SCORE</div>
          <div class="stat-value" id="game-score">0</div>
        </div>

        <div class="stat-group">
          <div class="stat-label">LINES</div>
          <div class="stat-value" id="game-lines">0</div>
        </div>

        <div class="stat-group">
          <div class="stat-label">LEVEL</div>
          <div class="stat-value" id="game-level">1</div>
        </div>

        <div class="stat-group">
          <div class="stat-label">PIT</div>
          <div class="stat-value">5×5×10</div>
        </div>

        <div id="game-over" class="game-over hidden">
          GAME OVER
        </div>

        <div class="controls-hint">
          <div class="hint-title">CONTROLS</div>
          <div class="hint-item">Arrows: Move</div>
          <div class="hint-item">Q/W: Rotate X</div>
          <div class="hint-item">A/S: Rotate Y</div>
          <div class="hint-item">Z/X: Rotate Z</div>
          <div class="hint-item">Space: Drop</div>
          <div class="hint-item">P: Pause</div>
        </div>
      </div>
    `
    return panel
  }

  update(state: GameState): void {
    this.scoreElement.textContent = state.score.toString()
    this.linesElement.textContent = state.linesCleared.toString()
    this.levelElement.textContent = state.level.toString()

    if (state.gameOver) {
      this.gameOverElement.classList.remove('hidden')
    } else {
      this.gameOverElement.classList.add('hidden')
    }
  }

  dispose(): void {
    this.container.remove()
  }
}
