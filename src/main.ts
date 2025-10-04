import './styles/main.css';
import { Game } from './game/Game';

// Initialize the game
const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const game = new Game(app);
  game.start();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    game.stop();
  });
}
