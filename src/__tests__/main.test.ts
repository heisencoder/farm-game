/* eslint-env jest */
// @jest-environment jsdom

// Mock Phaser.Game constructor
const mockGame = jest.fn();
jest.mock('phaser', () => ({
  __esModule: true,
  default: {
    Game: mockGame,
    AUTO: 'AUTO',
  },
}));

// Mock the config module
const mockCreateGameConfig = jest.fn(() => ({
  type: 'AUTO',
  parent: 'game-container',
  width: 1024,
  height: 768,
}));
jest.mock('@/config', () => ({
  createGameConfig: mockCreateGameConfig,
}));

// Mock the FarmingGameScene
const mockFarmingGameScene = jest.fn();
jest.mock('@/game/FarmingGameScene', () => ({
  FarmingGameScene: mockFarmingGameScene,
}));

describe('main.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    // Reset document state
    document.removeEventListener('DOMContentLoaded', expect.any(Function) as EventListener);

    // Mock document.readyState
    Object.defineProperty(document, 'readyState', {
      writable: true,
      value: 'complete',
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('when DOM is already loaded', () => {
    it('should start game immediately', async () => {
      Object.defineProperty(document, 'readyState', {
        value: 'complete',
      });

      // Dynamically import to trigger execution
      await import('@/main');

      expect(mockCreateGameConfig).toHaveBeenCalledWith([mockFarmingGameScene]);
      expect(mockGame).toHaveBeenCalledWith({
        type: 'AUTO',
        parent: 'game-container',
        width: 1024,
        height: 768,
      });
    });

    it('should start game when readyState is interactive', async () => {
      Object.defineProperty(document, 'readyState', {
        value: 'interactive',
      });

      await import('@/main');

      expect(mockCreateGameConfig).toHaveBeenCalledWith([mockFarmingGameScene]);
      expect(mockGame).toHaveBeenCalledTimes(1);
    });
  });

  describe('when DOM is still loading', () => {
    it('should wait for DOMContentLoaded event', async () => {
      Object.defineProperty(document, 'readyState', {
        value: 'loading',
      });

      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      await import('@/main');

      // Should not start game immediately
      expect(mockGame).not.toHaveBeenCalled();

      // Should add event listener
      expect(addEventListenerSpy).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));

      // Simulate DOMContentLoaded event
      const eventHandler = addEventListenerSpy.mock.calls.find(
        (call) => call[0] === 'DOMContentLoaded',
      )?.[1] as () => void;

      if (eventHandler) {
        eventHandler();
      }

      // Now game should start
      expect(mockCreateGameConfig).toHaveBeenCalledWith([mockFarmingGameScene]);
      expect(mockGame).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple imports correctly', async () => {
      Object.defineProperty(document, 'readyState', {
        value: 'loading',
      });

      const addEventListenerSpy2 = jest.spyOn(document, 'addEventListener');

      // Import multiple times
      await import('@/main');

      // Clear mocks and import again
      jest.clearAllMocks();
      jest.resetModules();

      await import('@/main');

      // Should still behave correctly
      expect(addEventListenerSpy2).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));
    });
  });

  describe('startGame function', () => {
    it('should create game with FarmingGameScene', async () => {
      Object.defineProperty(document, 'readyState', {
        value: 'complete',
      });

      await import('@/main');

      expect(mockCreateGameConfig).toHaveBeenCalledWith([mockFarmingGameScene]);
      expect(mockGame).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'AUTO',
          parent: 'game-container',
          width: 1024,
          height: 768,
        }),
      );
    });
  });
});
