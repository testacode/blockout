// MobileUI - Mobile-optimized UI with compact header and bottom sheet
// Implements IGameUI interface for compatibility with Game.ts

import type { GameState, Piece3D } from '../types';
import type { Game } from '../game/Game';
import type { IGameUI } from './GameUIInterface';

export class MobileUI implements IGameUI {
  private wrapper: HTMLElement;
  private header: HTMLElement;
  private statsSheet: HTMLElement;
  private scoreElement: HTMLElement;
  private highScoreElement: HTMLElement;
  private linesElement: HTMLElement;
  private levelElement: HTMLElement;
  private infoButton: HTMLElement;
  private gameOverElement: HTMLElement;
  private game: Game | null = null;
  private isSheetVisible: boolean = false;

  constructor() {
    // Create wrapper
    this.wrapper = document.createElement('div');
    this.wrapper.id = 'game-wrapper';
    this.wrapper.className = 'mobile-game-wrapper';
    document.body.appendChild(this.wrapper);

    // Move app element into wrapper
    const appElement = document.getElementById('app');
    if (appElement) {
      this.wrapper.appendChild(appElement);
    }

    // Create compact header
    this.header = this.createHeader();
    this.wrapper.appendChild(this.header);

    // Create stats bottom sheet
    this.statsSheet = this.createStatsSheet();
    this.wrapper.appendChild(this.statsSheet);

    // Get references to elements
    const scoreElement = document.getElementById('mobile-score');
    const highScoreElement = document.getElementById('mobile-highscore');
    const linesElement = document.getElementById('mobile-lines');
    const levelElement = document.getElementById('mobile-level');
    const infoButton = document.getElementById('mobile-info-btn');

    if (!scoreElement || !highScoreElement || !linesElement || !levelElement || !infoButton) {
      throw new Error('Failed to initialize MobileUI: required elements not found');
    }

    this.scoreElement = scoreElement;
    this.highScoreElement = highScoreElement;
    this.linesElement = linesElement;
    this.levelElement = levelElement;
    this.infoButton = infoButton;

    // Setup info button toggle
    this.infoButton.addEventListener('click', () => this.toggleStatsSheet());

    // Setup sheet close on background tap
    this.statsSheet.addEventListener('click', (e) => {
      if (e.target === this.statsSheet) {
        this.hideStatsSheet();
      }
    });

    // Create game over overlay
    this.gameOverElement = this.createGameOverOverlay();
    document.body.appendChild(this.gameOverElement);
  }

  setGame(game: Game): void {
    this.game = game;
  }

  private createHeader(): HTMLElement {
    const header = document.createElement('div');
    header.id = 'mobile-header';
    header.className = 'mobile-header';
    header.innerHTML = `
      <div class="mobile-header-content">
        <div class="mobile-score-display">
          <span class="mobile-score-label">SCORE</span>
          <span class="mobile-score-value" id="mobile-score">0</span>
        </div>
        <button class="mobile-info-btn" id="mobile-info-btn" aria-label="Show stats">
          ℹ️
        </button>
      </div>
    `;
    return header;
  }

  private createStatsSheet(): HTMLElement {
    const sheet = document.createElement('div');
    sheet.id = 'mobile-stats-sheet';
    sheet.className = 'mobile-stats-sheet';
    sheet.innerHTML = `
      <div class="mobile-stats-content">
        <div class="mobile-stats-header">
          <h2>STATS</h2>
          <button class="mobile-sheet-close" aria-label="Close">&times;</button>
        </div>

        <div class="mobile-stat-group mobile-stat-highlight">
          <div class="mobile-stat-label">HIGH SCORE</div>
          <div class="mobile-stat-value mobile-stat-large" id="mobile-highscore">0</div>
        </div>

        <div class="mobile-stats-grid">
          <div class="mobile-stat-group">
            <div class="mobile-stat-label">LINES</div>
            <div class="mobile-stat-value" id="mobile-lines">0</div>
          </div>

          <div class="mobile-stat-group">
            <div class="mobile-stat-label">LEVEL</div>
            <div class="mobile-stat-value" id="mobile-level">1</div>
          </div>
        </div>

        <div class="mobile-stat-group">
          <div class="mobile-stat-label">NEXT PIECE</div>
          <div id="mobile-next-piece-preview" class="mobile-next-piece-preview"></div>
        </div>
      </div>
    `;

    // Add close button handler
    const closeBtn = sheet.querySelector('.mobile-sheet-close');
    closeBtn?.addEventListener('click', () => this.hideStatsSheet());

    return sheet;
  }

  private createGameOverOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.id = 'game-over-overlay';
    overlay.className = 'game-over-overlay hidden';
    overlay.textContent = 'GAME OVER';
    return overlay;
  }

  private toggleStatsSheet(): void {
    if (this.isSheetVisible) {
      this.hideStatsSheet();
    } else {
      this.showStatsSheet();
    }
  }

  private showStatsSheet(): void {
    this.statsSheet.classList.add('visible');
    this.isSheetVisible = true;
  }

  private hideStatsSheet(): void {
    this.statsSheet.classList.remove('visible');
    this.isSheetVisible = false;
  }

  private renderNextPiece(piece: Piece3D | null): void {
    const previewContainer = document.getElementById('mobile-next-piece-preview');
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
    grid.className = 'mobile-preview-grid';
    grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${height}, 1fr)`;

    // Create grid cells
    for (let z = minZ; z <= maxZ; z++) {
      for (let x = minX; x <= maxX; x++) {
        const cell = document.createElement('div');
        cell.className = 'mobile-preview-cell';

        // Check if this position has a block
        const hasBlock = piece.blocks.some((b) => b.x === x && b.z === z);
        if (hasBlock) {
          cell.style.backgroundColor = piece.color;
          cell.classList.add('mobile-preview-cell-filled');
        }

        grid.appendChild(cell);
      }
    }

    previewContainer.appendChild(grid);
  }

  update(state: GameState): void {
    // Update header score
    this.scoreElement.textContent = state.score.toString();

    // Update sheet stats
    this.linesElement.textContent = state.linesCleared.toString();
    this.levelElement.textContent = state.level.toString();

    // Update high score
    if (this.game) {
      this.highScoreElement.textContent = this.game.getHighScore().toString();
    }

    // Update next piece preview
    this.renderNextPiece(state.nextPiece);

    // Auto-show stats on pause or game over
    if (state.isPaused || state.gameOver) {
      this.showStatsSheet();
    } else if (!state.isPaused && this.isSheetVisible) {
      // Auto-hide when resuming (unless manually opened)
      // this.hideStatsSheet();
    }

    // Update game over overlay
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
