// Mock Phaser to avoid DOM issues
jest.mock('phaser', () => ({
  __esModule: true,
  default: {
    AUTO: 'AUTO',
  },
}));

import { GAME_CONFIG, createGameConfig } from '@/config';

describe('config', () => {
  describe('GAME_CONFIG', () => {
    it('should have correct width and height', () => {
      expect(GAME_CONFIG.width).toBe(1024);
      expect(GAME_CONFIG.height).toBe(768);
    });

    it('should have correct background color', () => {
      expect(GAME_CONFIG.backgroundColor).toBe('#4A5D3A');
    });

    it('should be readonly configuration', () => {
      // TypeScript should enforce this, but we can verify values exist
      expect(typeof GAME_CONFIG.width).toBe('number');
      expect(typeof GAME_CONFIG.height).toBe('number');
      expect(typeof GAME_CONFIG.backgroundColor).toBe('string');
    });
  });

  describe('createGameConfig', () => {
    it('should create valid Phaser game config', () => {
      const mockScenes: never[] = [];
      const config = createGameConfig(mockScenes);

      expect(config.type).toBe('AUTO');
      expect(config.parent).toBe('game-container');
      expect(config.width).toBe(GAME_CONFIG.width);
      expect(config.height).toBe(GAME_CONFIG.height);
      expect(config.backgroundColor).toBe(GAME_CONFIG.backgroundColor);
      expect(config.scene).toBe(mockScenes);
    });

    it('should configure physics correctly', () => {
      const config = createGameConfig([]);

      expect(config.physics).toBeDefined();
      expect(config.physics?.default).toBe('arcade');
      expect(config.physics?.arcade?.gravity).toEqual({ x: 0, y: 0 });
      expect(config.physics?.arcade?.debug).toBe(false);
    });

    it('should accept different scene arrays', () => {
      const scenes1 = ['Scene1', 'Scene2'] as never[];
      const scenes2 = ['DifferentScene'] as never[];

      const config1 = createGameConfig(scenes1);
      const config2 = createGameConfig(scenes2);

      expect(config1.scene).toBe(scenes1);
      expect(config2.scene).toBe(scenes2);
    });
  });
});
