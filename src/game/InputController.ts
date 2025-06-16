import { Farmer } from './Farmer';
import { FarmingAction } from './types';

/**
 * Callback function for farming actions.
 */
export type FarmingActionCallback = (action: FarmingAction) => void;

/**
 * Handles input for player movement and farming actions.
 */
export class InputController {
  private scene: Phaser.Scene;
  private farmer: Farmer;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private actionKeys: Record<string, Phaser.Input.Keyboard.Key>;
  private farmingActionCallback?: FarmingActionCallback;

  constructor(scene: Phaser.Scene, farmer: Farmer) {
    this.scene = scene;
    this.farmer = farmer;

    // Create cursor keys for movement
    this.cursors = scene.input.keyboard!.createCursorKeys();

    // Create action keys
    this.actionKeys = {
      H: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.H), // Hoe
      P: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P), // Plant
      W: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W), // Water
      SPACE: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE), // Harvest
    };

    // Set up key press handlers
    this.setupKeyHandlers();
  }

  /**
   * Set up key press event handlers.
   */
  private setupKeyHandlers(): void {
    // Movement keys
    this.cursors.down.on('down', () => this.handleMovement(0));
    this.cursors.left.on('down', () => this.handleMovement(1));
    this.cursors.right.on('down', () => this.handleMovement(2));
    this.cursors.up.on('down', () => this.handleMovement(3));

    // Action keys
    this.actionKeys.H.on('down', () => this.handleAction(FarmingAction.HOE));
    this.actionKeys.P.on('down', () => this.handleAction(FarmingAction.PLANT));
    this.actionKeys.W.on('down', () => this.handleAction(FarmingAction.WATER));
    this.actionKeys.SPACE.on('down', () => this.handleAction(FarmingAction.HARVEST));
  }

  /**
   * Handle movement input.
   * @param direction - Direction to move.
   */
  private handleMovement(direction: number): void {
    this.farmer.move(direction);
  }

  /**
   * Handle farming action input.
   * @param action - The farming action to perform.
   */
  private handleAction(action: FarmingAction): void {
    if (this.farmingActionCallback) {
      this.farmingActionCallback(action);
    }
  }

  /**
   * Set callback for farming actions.
   * @param callback - Function to call when farming action is triggered.
   */
  setFarmingActionCallback(callback: FarmingActionCallback): void {
    this.farmingActionCallback = callback;
  }

  /**
   * Update input controller (called each frame).
   */
  update(): void {
    // Handle continuous movement if we want it in the future
    // For now, we use discrete movement on key press
  }

  /**
   * Destroy input controller and clean up listeners.
   */
  destroy(): void {
    // Remove key listeners
    this.cursors.down.removeAllListeners();
    this.cursors.left.removeAllListeners();
    this.cursors.right.removeAllListeners();
    this.cursors.up.removeAllListeners();

    Object.values(this.actionKeys).forEach((key) => {
      key.removeAllListeners();
    });
  }
}