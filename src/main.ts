import Phaser from 'phaser';
import { createGameConfig } from './config';
import { MainScene } from './scenes/MainScene';

/**
 * Initialize and start the Phaser game.
 */
const startGame = (): void => {
  const config = createGameConfig([MainScene]);
  new Phaser.Game(config);
};

// Start the game when the DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startGame);
} else {
  startGame();
}
