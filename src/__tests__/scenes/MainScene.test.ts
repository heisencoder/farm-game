/* eslint-env jest */
// @jest-environment jsdom

// Mock Phaser before importing
jest.mock('phaser', () => ({
  __esModule: true,
  default: {
    Scene: class MockScene {
      scene = { key: 'MainScene' };
      constructor(config?: { key?: string }) {
        if (config?.key) {
          this.scene.key = config.key;
        }
      }
    },
  },
}));

import { MainScene } from '@/scenes/MainScene';

// Mock Phaser methods for testing
const mockAdd = {
  text: jest.fn(() => ({
    setOrigin: jest.fn(),
  })),
};

const mockCameras = {
  main: {
    centerX: 512,
    centerY: 384,
  },
};

const mockTweens = {
  add: jest.fn(),
};

const mockScene = {
  add: mockAdd,
  cameras: mockCameras,
  tweens: mockTweens,
};

describe('MainScene', () => {
  let mainScene: MainScene;

  beforeEach(() => {
    jest.clearAllMocks();
    mainScene = new MainScene();

    // Mock the scene properties
    Object.assign(mainScene, mockScene);
  });

  describe('constructor', () => {
    it('should create scene with correct key', () => {
      expect(mainScene.scene.key).toBe('MainScene');
    });
  });

  describe('preload', () => {
    it('should complete without errors', () => {
      expect(() => mainScene.preload()).not.toThrow();
    });
  });

  describe('create', () => {
    it('should create hello world text', () => {
      mainScene.create();

      expect(mockAdd.text).toHaveBeenCalledWith(
        512, // centerX
        334, // centerY - 50
        'Hello, Phaser World!',
        expect.objectContaining({
          fontSize: '48px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 6,
        }),
      );
    });

    it('should create subtitle text', () => {
      mainScene.create();

      expect(mockAdd.text).toHaveBeenCalledWith(
        512, // centerX
        414, // centerY + 30
        'Welcome to Vibe Farming Game',
        expect.objectContaining({
          fontSize: '24px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 4,
        }),
      );
    });

    it('should create instructions text', () => {
      mainScene.create();

      expect(mockAdd.text).toHaveBeenCalledWith(
        512, // centerX
        484, // centerY + 100
        'This is your future farming adventure!',
        expect.objectContaining({
          fontSize: '18px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 3,
        }),
      );
    });

    it('should set origin for all text elements', () => {
      const mockTextObject = {
        setOrigin: jest.fn(),
      };
      mockAdd.text.mockReturnValue(mockTextObject);

      mainScene.create();

      // Should be called 3 times for each text element
      expect(mockTextObject.setOrigin).toHaveBeenCalledTimes(3);
      expect(mockTextObject.setOrigin).toHaveBeenCalledWith(0.5);
    });

    it('should create floating animation for hello text', () => {
      const mockTextObject = {
        setOrigin: jest.fn(),
      };
      mockAdd.text.mockReturnValue(mockTextObject);

      mainScene.create();

      expect(mockTweens.add).toHaveBeenCalledWith({
        targets: mockTextObject,
        y: 324, // centerY - 60
        duration: 2000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
      });
    });
  });

  describe('update', () => {
    it('should complete without errors', () => {
      expect(() => mainScene.update(0, 16)).not.toThrow();
    });

    it('should accept time and delta parameters', () => {
      const time = 1000;
      const delta = 16.67;

      expect(() => mainScene.update(time, delta)).not.toThrow();
    });
  });
});
