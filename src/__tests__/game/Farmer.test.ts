import { Farmer } from '@/game/Farmer';
import { GridPosition, GAME_CONFIG } from '@/game/types';

// Mock Phaser scene and sprite
const mockTweens = {
  add: jest.fn(),
};

const mockSprite = {
  setOrigin: jest.fn(),
  setDepth: jest.fn(),
  setTexture: jest.fn(),
  setPosition: jest.fn(),
  destroy: jest.fn(),
  scene: {
    tweens: mockTweens,
  },
};

interface MockScene {
  add: {
    sprite: jest.Mock;
  };
}

interface MockSpriteManager {
  getFarmerTextureKey: jest.Mock;
}

const mockScene: MockScene = {
  add: {
    sprite: jest.fn(() => mockSprite),
  },
};

const mockSpriteManager: MockSpriteManager = {
  getFarmerTextureKey: jest.fn((direction) => `farmer-${direction}`),
};

describe('Farmer', () => {
  let farmer: Farmer;
  const startPosition: GridPosition = { x: 5, y: 5 };

  beforeEach(() => {
    jest.clearAllMocks();
    farmer = new Farmer(mockScene as never, startPosition, mockSpriteManager as never);
  });

  describe('initialization', () => {
    it('should create sprite at correct world position', () => {
      const expectedX = startPosition.x * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2;
      const expectedY = startPosition.y * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2;

      expect(mockScene.add.sprite).toHaveBeenCalledWith(expectedX, expectedY, 'farmer-0');
      expect(mockSprite.setOrigin).toHaveBeenCalledWith(0.5, 0.5);
      expect(mockSprite.setDepth).toHaveBeenCalledWith(10);
    });

    it('should set initial grid position correctly', () => {
      expect(farmer.getGridPosition()).toEqual(startPosition);
    });

    it('should set initial direction to 0 (down)', () => {
      expect(farmer.getDirection()).toBe(0);
    });
  });

  describe('movement', () => {
    it('should move down successfully', () => {
      const success = farmer.move(0);

      expect(success).toBe(true);
      expect(farmer.getGridPosition()).toEqual({ x: 5, y: 6 });
      expect(farmer.getDirection()).toBe(0);
      expect(mockTweens.add).toHaveBeenCalled();
    });

    it('should move left successfully', () => {
      const success = farmer.move(1);

      expect(success).toBe(true);
      expect(farmer.getGridPosition()).toEqual({ x: 4, y: 5 });
      expect(farmer.getDirection()).toBe(1);
    });

    it('should move right successfully', () => {
      const success = farmer.move(2);

      expect(success).toBe(true);
      expect(farmer.getGridPosition()).toEqual({ x: 6, y: 5 });
      expect(farmer.getDirection()).toBe(2);
    });

    it('should move up successfully', () => {
      const success = farmer.move(3);

      expect(success).toBe(true);
      expect(farmer.getGridPosition()).toEqual({ x: 5, y: 4 });
      expect(farmer.getDirection()).toBe(3);
    });

    it('should fail to move outside left boundary', () => {
      farmer.setPosition({ x: 0, y: 5 });
      const success = farmer.move(1); // Move left

      expect(success).toBe(false);
      expect(farmer.getGridPosition()).toEqual({ x: 0, y: 5 });
      expect(farmer.getDirection()).toBe(1); // Direction should still change
    });

    it('should fail to move outside right boundary', () => {
      farmer.setPosition({ x: GAME_CONFIG.GRID_WIDTH - 1, y: 5 });
      const success = farmer.move(2); // Move right

      expect(success).toBe(false);
      expect(farmer.getGridPosition()).toEqual({ x: GAME_CONFIG.GRID_WIDTH - 1, y: 5 });
      expect(farmer.getDirection()).toBe(2);
    });

    it('should fail to move outside top boundary', () => {
      farmer.setPosition({ x: 5, y: 0 });
      const success = farmer.move(3); // Move up

      expect(success).toBe(false);
      expect(farmer.getGridPosition()).toEqual({ x: 5, y: 0 });
      expect(farmer.getDirection()).toBe(3);
    });

    it('should fail to move outside bottom boundary', () => {
      farmer.setPosition({ x: 5, y: GAME_CONFIG.GRID_HEIGHT - 1 });
      const success = farmer.move(0); // Move down

      expect(success).toBe(false);
      expect(farmer.getGridPosition()).toEqual({ x: 5, y: GAME_CONFIG.GRID_HEIGHT - 1 });
      expect(farmer.getDirection()).toBe(0);
    });

    it('should fail to move with invalid direction', () => {
      const initialPosition = farmer.getGridPosition();
      const success = farmer.move(5); // Invalid direction

      expect(success).toBe(false);
      expect(farmer.getGridPosition()).toEqual(initialPosition);
    });

    it('should not move while already moving', () => {
      // Simulate being in the middle of a move
      farmer.move(0); // Start first move

      const secondMoveSuccess = farmer.move(1); // Try second move
      expect(secondMoveSuccess).toBe(false);
    });
  });

  describe('sprite management', () => {
    it('should update sprite texture when direction changes', () => {
      farmer.move(1); // Move left

      expect(mockSpriteManager.getFarmerTextureKey).toHaveBeenCalledWith(1);
      expect(mockSprite.setTexture).toHaveBeenCalledWith('farmer-1');
    });

    it('should return sprite object', () => {
      expect(farmer.getSprite()).toBe(mockSprite);
    });

    it('should destroy sprite when destroyed', () => {
      farmer.destroy();
      expect(mockSprite.destroy).toHaveBeenCalled();
    });
  });

  describe('position management', () => {
    it('should set position directly when not moving', () => {
      const newPosition = { x: 10, y: 8 };
      farmer.setPosition(newPosition);

      expect(farmer.getGridPosition()).toEqual(newPosition);
      expect(mockSprite.setPosition).toHaveBeenCalled();
    });

    it('should not set position while moving', () => {
      farmer.move(0); // Start moving
      const initialPosition = farmer.getGridPosition();

      farmer.setPosition({ x: 10, y: 8 });

      expect(farmer.getGridPosition()).toEqual(initialPosition);
    });
  });

  describe('state queries', () => {
    it('should report moving state correctly', () => {
      expect(farmer.getIsMoving()).toBe(false);

      farmer.move(0);
      expect(farmer.getIsMoving()).toBe(true);
    });
  });
});
