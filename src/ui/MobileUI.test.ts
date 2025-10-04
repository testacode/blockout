import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MobileUI } from './MobileUI';
import type { GameState } from '../types';
import type { Game } from '../game/Game';

describe('MobileUI', () => {
  let mobileUI: MobileUI;

  beforeEach(() => {
    // Create app element that MobileUI expects
    const appElement = document.createElement('div');
    appElement.id = 'app';
    document.body.appendChild(appElement);

    mobileUI = new MobileUI();
  });

  afterEach(() => {
    mobileUI.dispose();
    // Clean up app element
    const appElement = document.getElementById('app');
    appElement?.remove();
  });

  describe('Initialization', () => {
    it('should create MobileUI instance', () => {
      expect(mobileUI).toBeTruthy();
    });

    it('should create mobile header', () => {
      const header = document.getElementById('mobile-header');
      expect(header).toBeTruthy();
      expect(header?.classList.contains('mobile-header')).toBe(true);
    });

    it('should create stats bottom sheet', () => {
      const sheet = document.getElementById('mobile-stats-sheet');
      expect(sheet).toBeTruthy();
      expect(sheet?.classList.contains('mobile-stats-sheet')).toBe(true);
    });

    it('should create game over overlay', () => {
      const overlay = document.getElementById('game-over-overlay');
      expect(overlay).toBeTruthy();
    });

    it('should have info button in header', () => {
      const infoBtn = document.getElementById('mobile-info-btn');
      expect(infoBtn).toBeTruthy();
    });
  });

  describe('Header Display', () => {
    it('should display score in header', () => {
      const scoreElement = document.getElementById('mobile-score');
      expect(scoreElement).toBeTruthy();
      expect(scoreElement?.textContent).toBe('0');
    });

    it('should update score in header', () => {
      const mockState: GameState = {
        currentPiece: null,
        nextPiece: null,
        well: { width: 5, depth: 5, height: 15, occupiedCells: new Map() },
        score: 1000,
        level: 1,
        linesCleared: 0,
        gameOver: false,
        isPaused: false,
        fallSpeed: 1000,
      };

      mobileUI.update(mockState);

      const scoreElement = document.getElementById('mobile-score');
      expect(scoreElement?.textContent).toBe('1000');
    });
  });

  describe('Stats Sheet', () => {
    it('should be hidden by default', () => {
      const sheet = document.getElementById('mobile-stats-sheet');
      expect(sheet?.classList.contains('visible')).toBe(false);
    });

    it('should show sheet when info button is clicked', () => {
      const infoBtn = document.getElementById('mobile-info-btn');
      const sheet = document.getElementById('mobile-stats-sheet');

      infoBtn?.click();

      expect(sheet?.classList.contains('visible')).toBe(true);
    });

    it('should hide sheet when close button is clicked', () => {
      const infoBtn = document.getElementById('mobile-info-btn');
      const sheet = document.getElementById('mobile-stats-sheet');

      // Show first
      infoBtn?.click();
      expect(sheet?.classList.contains('visible')).toBe(true);

      // Close
      const closeBtn = sheet?.querySelector('.mobile-sheet-close');
      (closeBtn as HTMLElement)?.click();

      expect(sheet?.classList.contains('visible')).toBe(false);
    });

    it('should toggle sheet on multiple info button clicks', () => {
      const infoBtn = document.getElementById('mobile-info-btn');
      const sheet = document.getElementById('mobile-stats-sheet');

      // First click - show
      infoBtn?.click();
      expect(sheet?.classList.contains('visible')).toBe(true);

      // Second click - hide
      infoBtn?.click();
      expect(sheet?.classList.contains('visible')).toBe(false);

      // Third click - show again
      infoBtn?.click();
      expect(sheet?.classList.contains('visible')).toBe(true);
    });

    it('should display all stats in sheet', () => {
      const highScore = document.getElementById('mobile-highscore');
      const lines = document.getElementById('mobile-lines');
      const level = document.getElementById('mobile-level');

      expect(highScore).toBeTruthy();
      expect(lines).toBeTruthy();
      expect(level).toBeTruthy();
    });

    it('should update stats in sheet', () => {
      const mockGame: Partial<Game> = {
        getHighScore: () => 5000,
      };

      mobileUI.setGame(mockGame as Game);

      const mockState: GameState = {
        currentPiece: null,
        nextPiece: null,
        well: { width: 5, depth: 5, height: 15, occupiedCells: new Map() },
        score: 2000,
        level: 3,
        linesCleared: 25,
        gameOver: false,
        isPaused: false,
        fallSpeed: 800,
      };

      mobileUI.update(mockState);

      const highScore = document.getElementById('mobile-highscore');
      const lines = document.getElementById('mobile-lines');
      const level = document.getElementById('mobile-level');

      expect(highScore?.textContent).toBe('5000');
      expect(lines?.textContent).toBe('25');
      expect(level?.textContent).toBe('3');
    });
  });

  describe('Auto-show on Pause/Game Over', () => {
    it('should auto-show sheet when game is paused', () => {
      const sheet = document.getElementById('mobile-stats-sheet');

      const mockState: GameState = {
        currentPiece: null,
        nextPiece: null,
        well: { width: 5, depth: 5, height: 15, occupiedCells: new Map() },
        score: 0,
        level: 1,
        linesCleared: 0,
        gameOver: false,
        isPaused: true,
        fallSpeed: 1000,
      };

      mobileUI.update(mockState);

      expect(sheet?.classList.contains('visible')).toBe(true);
    });

    it('should auto-show sheet when game is over', () => {
      const sheet = document.getElementById('mobile-stats-sheet');

      const mockState: GameState = {
        currentPiece: null,
        nextPiece: null,
        well: { width: 5, depth: 5, height: 15, occupiedCells: new Map() },
        score: 0,
        level: 1,
        linesCleared: 0,
        gameOver: true,
        isPaused: false,
        fallSpeed: 1000,
      };

      mobileUI.update(mockState);

      expect(sheet?.classList.contains('visible')).toBe(true);
    });
  });

  describe('Game Over Overlay', () => {
    it('should hide overlay by default', () => {
      const overlay = document.getElementById('game-over-overlay');
      expect(overlay?.classList.contains('hidden')).toBe(true);
    });

    it('should show overlay when game is over', () => {
      const mockState: GameState = {
        currentPiece: null,
        nextPiece: null,
        well: { width: 5, depth: 5, height: 15, occupiedCells: new Map() },
        score: 0,
        level: 1,
        linesCleared: 0,
        gameOver: true,
        isPaused: false,
        fallSpeed: 1000,
      };

      mobileUI.update(mockState);

      const overlay = document.getElementById('game-over-overlay');
      expect(overlay?.classList.contains('hidden')).toBe(false);
    });

    it('should hide overlay when game is not over', () => {
      // First set game over
      const mockStateGameOver: GameState = {
        currentPiece: null,
        nextPiece: null,
        well: { width: 5, depth: 5, height: 15, occupiedCells: new Map() },
        score: 0,
        level: 1,
        linesCleared: 0,
        gameOver: true,
        isPaused: false,
        fallSpeed: 1000,
      };

      mobileUI.update(mockStateGameOver);

      // Then reset
      const mockStatePlaying: GameState = {
        ...mockStateGameOver,
        gameOver: false,
      };

      mobileUI.update(mockStatePlaying);

      const overlay = document.getElementById('game-over-overlay');
      expect(overlay?.classList.contains('hidden')).toBe(true);
    });
  });

  describe('Dispose', () => {
    it('should clean up on dispose', () => {
      const wrapper = document.getElementById('game-wrapper');
      const overlay = document.getElementById('game-over-overlay');

      expect(wrapper).toBeTruthy();
      expect(overlay).toBeTruthy();

      mobileUI.dispose();

      expect(document.getElementById('game-wrapper')).toBeFalsy();
      expect(document.getElementById('game-over-overlay')).toBeFalsy();
    });
  });
});
