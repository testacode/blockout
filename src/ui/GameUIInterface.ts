// GameUIInterface - Common interface for desktop and mobile UI
// Ensures both implementations can be used interchangeably

import type { GameState } from '../types';
import type { Game } from '../game/Game';

export type IGameUI = {
  setGame(game: Game): void;
  update(state: GameState): void;
  dispose(): void;
};
