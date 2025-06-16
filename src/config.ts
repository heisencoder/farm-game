import Phaser from 'phaser';

export const GAME_CONFIG = {
  width: 800,
  height: 600,
  backgroundColor: '#87CEEB',
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
