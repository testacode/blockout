// GameUI - Display game stats and information
// Updates from GameState

import type { GameState, Piece3D } from '../types';
import type { Game } from '../game/Game';

export class GameUI {
  private wrapper: HTMLElement;
  private container: HTMLElement;
  private scoreElement: HTMLElement;
  private linesElement: HTMLElement;
  private levelElement: HTMLElement;
  private highScoreElement: HTMLElement;
  private gameOverElement: HTMLElement;
  private game: Game | null = null;

  constructor() {
    // Create game wrapper to contain both canvas and UI
    this.wrapper = document.createElement('div');
    this.wrapper.id = 'game-wrapper';
    document.body.appendChild(this.wrapper);

    // Move the app element into the wrapper first (left side)
    const appElement = document.getElementById('app');
    if (appElement) {
      this.wrapper.appendChild(appElement);
    }

    // Create UI panel and add to wrapper second (right side)
    this.container = this.createUI();
    this.wrapper.appendChild(this.container);

    const scoreElement = document.getElementById('game-score');
    const linesElement = document.getElementById('game-lines');
    const levelElement = document.getElementById('game-level');
    const highScoreElement = document.getElementById('game-highscore');

    if (!scoreElement || !linesElement || !levelElement || !highScoreElement) {
      throw new Error('Failed to initialize GameUI: required elements not found');
    }

    this.scoreElement = scoreElement;
    this.linesElement = linesElement;
    this.levelElement = levelElement;
    this.highScoreElement = highScoreElement;

    // Create game over overlay (fixed positioning, centered on viewport)
    this.gameOverElement = this.createGameOverOverlay();
    document.body.appendChild(this.gameOverElement);
  }

  setGame(game: Game): void {
    this.game = game;
  }

  private createUI(): HTMLElement {
    const panel = document.createElement('div');
    panel.id = 'game-ui';
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
          <div class="stat-label">NEXT</div>
          <div id="next-piece-preview" class="next-piece-preview"></div>
        </div>

        <div class="controls-hint">
          <div class="hint-item">↑↓←→: Move</div>
          <div class="hint-item">Q/W/A/S/Z/X: Rotate</div>
          <div class="hint-item">Space: Drop | P: Pause | R: Restart</div>
        </div>
      </div>
    `;
    return panel;
  }

  private createGameOverOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.id = 'game-over-overlay';
    overlay.className = 'game-over-overlay hidden';
    overlay.textContent = 'GAME OVER';
    return overlay;
  }

  private renderNextPiece(piece: Piece3D | null): void {
    const previewContainer = document.getElementById('next-piece-preview');
    if (!previewContainer) {
      return;
    }

    // Clear previous preview
    previewContainer.innerHTML = '';

    if (!piece) {
      return;
    }

    // Find bounding box of piece blocks
    let minX = Infinity,
      maxX = -Infinity;
    let minZ = Infinity,
      maxZ = -Infinity;

    for (const block of piece.blocks) {
      minX = Math.min(minX, block.x);
      maxX = Math.max(maxX, block.x);
      minZ = Math.min(minZ, block.z);
      maxZ = Math.max(maxZ, block.z);
    }

    const width = maxX - minX + 1;
    const height = maxZ - minZ + 1;

    // Create grid container
    const grid = document.createElement('div');
    grid.className = 'preview-grid';
    grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${height}, 1fr)`;

    // Create grid cells
    for (let z = minZ; z <= maxZ; z++) {
      for (let x = minX; x <= maxX; x++) {
        const cell = document.createElement('div');
        cell.className = 'preview-cell';

        // Check if this position has a block
        const hasBlock = piece.blocks.some((b) => b.x === x && b.z === z);
        if (hasBlock) {
          cell.style.backgroundColor = piece.color;
          cell.classList.add('preview-cell-filled');
        }

        grid.appendChild(cell);
      }
    }

    previewContainer.appendChild(grid);
  }

  update(state: GameState): void {
    this.scoreElement.textContent = state.score.toString();
    this.linesElement.textContent = state.linesCleared.toString();
    this.levelElement.textContent = state.level.toString();

    // Update high score
    if (this.game) {
      this.highScoreElement.textContent = this.game.getHighScore().toString();
    }

    // Update next piece preview
    this.renderNextPiece(state.nextPiece);

    if (state.gameOver) {
      this.gameOverElement.classList.remove('hidden');
    } else {
      this.gameOverElement.classList.add('hidden');
    }
  }

  dispose(): void {
    this.wrapper.remove();
    this.gameOverElement.remove();
  }
}
