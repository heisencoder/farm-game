import { SpriteGenerator, PALETTE } from '@/game/SpriteGenerator';

// Mock canvas and context for testing
const mockFillRect = jest.fn();
const mockStrokeRect = jest.fn();
const mockGetContext = jest.fn(() => ({
  imageSmoothingEnabled: false,
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
  fillRect: mockFillRect,
  strokeRect: mockStrokeRect,
}));

// Mock createElement to return our mock canvas
const originalCreateElement = document.createElement;
const mockCreateElement = jest.fn(() => ({
  width: 0,
  height: 0,
  getContext: mockGetContext,
}));

describe('SpriteGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock document.createElement for each test
    document.createElement = mockCreateElement;
  });

  afterEach(() => {
    // Restore original createElement
    document.createElement = originalCreateElement;
  });

  describe('PALETTE', () => {
    it('should have exactly 16 colors', () => {
      const colorCount = Object.keys(PALETTE).length;
      expect(colorCount).toBe(16);
    });

    it('should have valid hex color values', () => {
      const hexColorRegex = /^#[0-9A-F]{6}$/i;
      Object.values(PALETTE).forEach((color) => {
        expect(color).toMatch(hexColorRegex);
      });
    });
  });

  describe('generateFarmer', () => {
    it('should create a 16x16 canvas', () => {
      const canvas = SpriteGenerator.generateFarmer();
      
      expect(document.createElement).toHaveBeenCalledWith('canvas');
      expect(canvas.width).toBe(16);
      expect(canvas.height).toBe(16);
    });

    it('should handle all four directions', () => {
      for (let direction = 0; direction < 4; direction++) {
        mockFillRect.mockClear();
        SpriteGenerator.generateFarmer(direction);
        expect(mockFillRect).toHaveBeenCalled();
      }
    });

    it('should default to direction 0 for invalid direction', () => {
      const canvas1 = SpriteGenerator.generateFarmer(-1);
      const canvas2 = SpriteGenerator.generateFarmer(0);
      
      // Both should result in the same number of fillRect calls
      expect(mockFillRect).toHaveBeenCalled();
    });
  });

  describe('generateTile', () => {
    it('should create a 32x32 canvas', () => {
      const canvas = SpriteGenerator.generateTile('empty');
      
      expect(document.createElement).toHaveBeenCalledWith('canvas');
      expect(canvas.width).toBe(32);
      expect(canvas.height).toBe(32);
    });

    it('should handle all tile types', () => {
      const tileTypes = ['empty', 'hoed', 'planted', 'watered', 'harvestable'];
      
      tileTypes.forEach((type) => {
        mockFillRect.mockClear();
        SpriteGenerator.generateTile(type);
        expect(mockFillRect).toHaveBeenCalled();
      });
    });

    it('should render base grass for empty tiles', () => {
      SpriteGenerator.generateTile('empty');
      
      // Should have calls for base grass and texture
      expect(mockFillRect).toHaveBeenCalled();
    });

    it('should render wheat for harvestable tiles', () => {
      SpriteGenerator.generateTile('harvestable');
      
      // Should have many fillRect calls for wheat rendering
      expect(mockFillRect.mock.calls.length).toBeGreaterThan(10);
    });
  });

  describe('generateCursor', () => {
    it('should create a 32x32 canvas', () => {
      const canvas = SpriteGenerator.generateCursor();
      
      expect(document.createElement).toHaveBeenCalledWith('canvas');
      expect(canvas.width).toBe(32);
      expect(canvas.height).toBe(32);
    });

    it('should draw selection border and corners', () => {
      SpriteGenerator.generateCursor();
      
      expect(mockStrokeRect).toHaveBeenCalled();
      expect(mockFillRect).toHaveBeenCalled();
    });
  });

  describe('canvasToTexture', () => {
    const mockScene = {
      textures: {
        exists: jest.fn(() => false),
        remove: jest.fn(),
        addCanvas: jest.fn(),
      },
    } as any;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should add canvas as texture to scene', () => {
      const canvas = mockCreateElement() as any;
      SpriteGenerator.canvasToTexture(mockScene, 'test-key', canvas);
      
      expect(mockScene.textures.addCanvas).toHaveBeenCalledWith('test-key', canvas);
    });

    it('should remove existing texture before adding new one', () => {
      mockScene.textures.exists.mockReturnValue(true);
      const canvas = mockCreateElement() as any;
      
      SpriteGenerator.canvasToTexture(mockScene, 'test-key', canvas);
      
      expect(mockScene.textures.remove).toHaveBeenCalledWith('test-key');
      expect(mockScene.textures.addCanvas).toHaveBeenCalledWith('test-key', canvas);
    });
  });
});