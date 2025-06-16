import Phaser from 'phaser';
import { createGameConfig } from './config';
import { FarmingGameScene } from './game/FarmingGameScene';

/**
 * Initialize and start the Phaser game.
 */
const startGame = (): void => {
  const config = createGameConfig([FarmingGameScene]);
  new Phaser.Game(config);
};

// Start the game when the DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startGame);
} else {
  startGame();
}
