/* eslint-env jest */
// @jest-environment jsdom

// Mock Phaser before importing anything else
jest.mock('phaser', () => ({
  __esModule: true,
  default: {
    Scene: class MockScene {
      scene = { key: 'FarmingGameScene' };
      add = {};
      cameras = {};
      tweens = {};
      time = {};
      constructor(config?: { key?: string }) {
        if (config?.key) {
          this.scene.key = config.key;
        }
      }
    },
    AUTO: 'AUTO',
  },
}));

import { FarmingGameScene } from '@/game/FarmingGameScene';
import { Grid } from '@/game/Grid';
import { Farmer } from '@/game/Farmer';
import { InputController } from '@/game/InputController';
import { SpriteManager } from '@/game/SpriteManager';
import { FarmingAction, TileState } from '@/game/types';

// Mock all the dependencies
jest.mock('@/game/Grid');
jest.mock('@/game/Farmer');
jest.mock('@/game/InputController');
jest.mock('@/game/SpriteManager');

const mockGrid = Grid as jest.MockedClass<typeof Grid>;
const mockFarmer = Farmer as jest.MockedClass<typeof Farmer>;
const mockInputController = InputController as jest.MockedClass<typeof InputController>;
const mockSpriteManager = SpriteManager as jest.MockedClass<typeof SpriteManager>;

// Mock Phaser scene methods
const mockAdd = {
  sprite: jest.fn(() => ({
    setOrigin: jest.fn(),
    setDepth: jest.fn(),
    setAlpha: jest.fn(),
    setTexture: jest.fn(),
    setPosition: jest.fn(),
  })),
  text: jest.fn(() => ({
    setDepth: jest.fn(),
    setScrollFactor: jest.fn(),
    setText: jest.fn(),
  })),
};

const mockCameras = {
  main: {
    setBounds: jest.fn(),
    setZoom: jest.fn(),
    centerOn: jest.fn(),
  },
};

const mockTweens = {
  add: jest.fn(),
};

const mockTime = {
  now: 1000,
};

describe('FarmingGameScene', () => {
  let scene: FarmingGameScene;
  let mockGridInstance: jest.Mocked<Grid>;
  let mockFarmerInstance: jest.Mocked<Farmer>;
  let mockInputControllerInstance: jest.Mocked<InputController>;
  let mockSpriteManagerInstance: jest.Mocked<SpriteManager>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock instances
    mockGridInstance = {
      getDimensions: jest.fn(() => ({ width: 20, height: 15 })),
      getTile: jest.fn(() => ({ state: TileState.EMPTY, position: { x: 0, y: 0 } })),
      setTileState: jest.fn(() => true),
      plantCrop: jest.fn(() => true),
      waterTile: jest.fn(() => true),
      harvestCrop: jest.fn(() => 'wheat'),
      updateTiles: jest.fn(),
    } as unknown as jest.Mocked<Grid>;

    mockFarmerInstance = {
      getGridPosition: jest.fn(() => ({ x: 10, y: 7 })),
      destroy: jest.fn(),
    } as unknown as jest.Mocked<Farmer>;

    mockInputControllerInstance = {
      setFarmingActionCallback: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    } as unknown as jest.Mocked<InputController>;

    mockSpriteManagerInstance = {
      loadSprites: jest.fn(),
      getTileTextureKey: jest.fn(() => 'tile-empty'),
      getFarmerTextureKey: jest.fn(() => 'farmer-0'),
    } as unknown as jest.Mocked<SpriteManager>;

    // Setup mock constructors
    mockGrid.mockImplementation(() => mockGridInstance);
    mockFarmer.mockImplementation(() => mockFarmerInstance);
    mockInputController.mockImplementation(() => mockInputControllerInstance);
    mockSpriteManager.mockImplementation(() => mockSpriteManagerInstance);

    scene = new FarmingGameScene();

    // Mock scene properties
    Object.assign(scene, {
      add: mockAdd,
      cameras: mockCameras,
      tweens: mockTweens,
      time: mockTime,
    });
  });

  describe('constructor', () => {
    it('should create scene with correct key', () => {
      expect(scene.scene.key).toBe('FarmingGameScene');
    });

    it('should initialize tileSprites array', () => {
      expect(scene['tileSprites']).toEqual([]);
    });
  });

  describe('create', () => {
    it('should initialize core systems', () => {
      scene.create();

      expect(mockGrid).toHaveBeenCalledTimes(1);
      expect(mockSpriteManager).toHaveBeenCalledWith(scene);
      expect(mockSpriteManagerInstance.loadSprites).toHaveBeenCalledTimes(1);
    });

    it('should create farmer at center position', () => {
      scene.create();

      expect(mockFarmer).toHaveBeenCalledWith(
        scene,
        { x: 10, y: 7 }, // center of 20x15 grid
        mockSpriteManagerInstance,
      );
    });

    it('should setup input controller with callback', () => {
      scene.create();

      expect(mockInputController).toHaveBeenCalledWith(scene, mockFarmerInstance);
      expect(mockInputControllerInstance.setFarmingActionCallback).toHaveBeenCalledWith(
        expect.any(Function),
      );
    });

    it('should create tile grid sprites', () => {
      scene.create();

      // Should create 20x15 = 300 sprites
      expect(mockAdd.sprite).toHaveBeenCalledTimes(301); // 300 tiles + 1 cursor
    });

    it('should setup camera', () => {
      scene.create();

      expect(mockCameras.main.setBounds).toHaveBeenCalledWith(0, 0, 640, 480); // 20*32, 15*32
      expect(mockCameras.main.setZoom).toHaveBeenCalledWith(1.5);
      expect(mockCameras.main.centerOn).toHaveBeenCalledWith(320, 240); // center of world
    });
  });

  describe('farming actions', () => {
    beforeEach(() => {
      scene.create();
    });

    it('should handle hoe action on empty tile', () => {
      mockGridInstance.getTile.mockReturnValue({
        state: TileState.EMPTY,
        position: { x: 10, y: 7 },
      });

      // Call the farming action callback directly
      const callback = mockInputControllerInstance.setFarmingActionCallback.mock.calls[0]![0];
      callback(FarmingAction.HOE);

      expect(mockGridInstance.setTileState).toHaveBeenCalledWith({ x: 10, y: 7 }, TileState.HOED);
    });

    it('should handle plant action on hoed tile', () => {
      mockGridInstance.getTile.mockReturnValue({
        state: TileState.HOED,
        position: { x: 10, y: 7 },
      });

      const callback = mockInputControllerInstance.setFarmingActionCallback.mock.calls[0]![0];
      callback(FarmingAction.PLANT);

      expect(mockGridInstance.plantCrop).toHaveBeenCalledWith(
        { x: 10, y: 7 },
        'wheat',
        1000, // mockTime.now
      );
    });

    it('should handle water action on planted tile', () => {
      mockGridInstance.getTile.mockReturnValue({
        state: TileState.PLANTED,
        position: { x: 10, y: 7 },
      });

      const callback = mockInputControllerInstance.setFarmingActionCallback.mock.calls[0]![0];
      callback(FarmingAction.WATER);

      expect(mockGridInstance.waterTile).toHaveBeenCalledWith(
        { x: 10, y: 7 },
        1000, // mockTime.now
      );
    });

    it('should handle harvest action on harvestable tile', () => {
      mockGridInstance.getTile.mockReturnValue({
        state: TileState.HARVESTABLE,
        position: { x: 10, y: 7 },
      });

      const callback = mockInputControllerInstance.setFarmingActionCallback.mock.calls[0]![0];
      callback(FarmingAction.HARVEST);

      expect(mockGridInstance.harvestCrop).toHaveBeenCalledWith({ x: 10, y: 7 });
    });

    it('should not perform invalid actions', () => {
      mockGridInstance.getTile.mockReturnValue({
        state: TileState.PLANTED,
        position: { x: 10, y: 7 },
      });

      const callback = mockInputControllerInstance.setFarmingActionCallback.mock.calls[0]![0];
      callback(FarmingAction.HOE); // Can't hoe planted tile

      expect(mockGridInstance.setTileState).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    beforeEach(() => {
      scene.create();
    });

    it('should update grid tiles', () => {
      scene.update(2000, 16);

      expect(mockGridInstance.updateTiles).toHaveBeenCalledWith(1000); // mockTime.now
    });

    it('should update input controller', () => {
      scene.update(2000, 16);

      expect(mockInputControllerInstance.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      scene.create();
    });

    it('should destroy input controller and farmer', () => {
      scene.destroy();

      expect(mockInputControllerInstance.destroy).toHaveBeenCalledTimes(1);
      expect(mockFarmerInstance.destroy).toHaveBeenCalledTimes(1);
    });

    it('should handle missing components gracefully', () => {
      // Create new scene without calling create
      const newScene = new FarmingGameScene();

      expect(() => newScene.destroy()).not.toThrow();
    });
  });
});
