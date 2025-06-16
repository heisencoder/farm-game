import Phaser from 'phaser';

export const GAME_CONFIG = {
  width: 1024,
  height: 768,
  backgroundColor: '#4A5D3A', // Dark green for farming theme
} as const;

export const createGameConfig = (
  scenes: Phaser.Types.Scenes.SceneType[],
): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME_CONFIG.width,
  height: GAME_CONFIG.height,
  backgroundColor: GAME_CONFIG.backgroundColor,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: scenes,
});
