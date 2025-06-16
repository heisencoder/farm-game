import { SpriteManager } from '@/game/SpriteManager';
import { TileState } from '@/game/types';
import { SpriteGenerator } from '@/game/SpriteGenerator';

// Mock SpriteGenerator
jest.mock('@/game/SpriteGenerator');
const mockSpriteGenerator = SpriteGenerator as jest.Mocked<typeof SpriteGenerator>;

describe('SpriteManager', () => {
  let spriteManager: SpriteManager;
  let mockScene: {
    textures: {
      exists: jest.Mock;
      remove: jest.Mock;
      addCanvas: jest.Mock;
    };
  };

  beforeEach(() => {
    mockScene = {
      textures: {
        exists: jest.fn(() => false),
        remove: jest.fn(),
        addCanvas: jest.fn(),
      },
    };

    spriteManager = new SpriteManager(mockScene as Phaser.Scene);
    jest.clearAllMocks();
  });

  describe('loadSprites', () => {
    it('should load all sprites when called', () => {
      const mockCanvas = document.createElement('canvas');
      mockSpriteGenerator.generateFarmer.mockReturnValue(mockCanvas);
      mockSpriteGenerator.generateTile.mockReturnValue(mockCanvas);
      mockSpriteGenerator.generateCursor.mockReturnValue(mockCanvas);
      mockSpriteGenerator.canvasToTexture.mockImplementation(() => {});

      spriteManager.loadSprites();

      // Should generate farmer sprites for all 4 directions
      expect(mockSpriteGenerator.generateFarmer).toHaveBeenCalledTimes(4);
      expect(mockSpriteGenerator.generateFarmer).toHaveBeenCalledWith(0);
      expect(mockSpriteGenerator.generateFarmer).toHaveBeenCalledWith(1);
      expect(mockSpriteGenerator.generateFarmer).toHaveBeenCalledWith(2);
      expect(mockSpriteGenerator.generateFarmer).toHaveBeenCalledWith(3);

      // Should generate tile sprites for all states
      expect(mockSpriteGenerator.generateTile).toHaveBeenCalledTimes(5);
      expect(mockSpriteGenerator.generateTile).toHaveBeenCalledWith('empty');
      expect(mockSpriteGenerator.generateTile).toHaveBeenCalledWith('hoed');
      expect(mockSpriteGenerator.generateTile).toHaveBeenCalledWith('planted');
      expect(mockSpriteGenerator.generateTile).toHaveBeenCalledWith('watered');
      expect(mockSpriteGenerator.generateTile).toHaveBeenCalledWith('harvestable');

      // Should generate cursor
      expect(mockSpriteGenerator.generateCursor).toHaveBeenCalledTimes(1);

      // Should add all textures to scene
      expect(mockSpriteGenerator.canvasToTexture).toHaveBeenCalledTimes(10);
    });

    it('should not reload sprites if already loaded', () => {
      const mockCanvas = document.createElement('canvas');
      mockSpriteGenerator.generateFarmer.mockReturnValue(mockCanvas);
      mockSpriteGenerator.generateTile.mockReturnValue(mockCanvas);
      mockSpriteGenerator.generateCursor.mockReturnValue(mockCanvas);

      spriteManager.loadSprites();
      spriteManager.loadSprites(); // Second call

      // Should only generate sprites once
      expect(mockSpriteGenerator.generateFarmer).toHaveBeenCalledTimes(4);
      expect(mockSpriteGenerator.generateTile).toHaveBeenCalledTimes(5);
      expect(mockSpriteGenerator.generateCursor).toHaveBeenCalledTimes(1);
    });

    it('should mark sprites as loaded after loading', () => {
      expect(spriteManager.isLoaded()).toBe(false);

      spriteManager.loadSprites();

      expect(spriteManager.isLoaded()).toBe(true);
    });
  });

  describe('getTileTextureKey', () => {
    it('should return correct texture keys for all tile states', () => {
      expect(spriteManager.getTileTextureKey(TileState.EMPTY)).toBe('tile-empty');
      expect(spriteManager.getTileTextureKey(TileState.HOED)).toBe('tile-hoed');
      expect(spriteManager.getTileTextureKey(TileState.PLANTED)).toBe('tile-planted');
      expect(spriteManager.getTileTextureKey(TileState.WATERED)).toBe('tile-watered');
      expect(spriteManager.getTileTextureKey(TileState.HARVESTABLE)).toBe('tile-harvestable');
    });

    it('should return default texture for unknown state', () => {
      const unknownState = 'unknown' as TileState;
      expect(spriteManager.getTileTextureKey(unknownState)).toBe('tile-empty');
    });
  });

  describe('getFarmerTextureKey', () => {
    it('should return correct texture keys for all directions', () => {
      expect(spriteManager.getFarmerTextureKey(0)).toBe('farmer-0');
      expect(spriteManager.getFarmerTextureKey(1)).toBe('farmer-1');
      expect(spriteManager.getFarmerTextureKey(2)).toBe('farmer-2');
      expect(spriteManager.getFarmerTextureKey(3)).toBe('farmer-3');
    });

    it('should clamp direction values to valid range', () => {
      expect(spriteManager.getFarmerTextureKey(-1)).toBe('farmer-0');
      expect(spriteManager.getFarmerTextureKey(5)).toBe('farmer-3');
    });
  });

  describe('isLoaded', () => {
    it('should return false initially', () => {
      expect(spriteManager.isLoaded()).toBe(false);
    });

    it('should return true after loading sprites', () => {
      spriteManager.loadSprites();
      expect(spriteManager.isLoaded()).toBe(true);
    });
  });
});
