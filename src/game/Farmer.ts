import { GridPosition, GAME_CONFIG } from './types';
import { SpriteManager } from './SpriteManager';

/**
 * Represents the farmer character with grid-based movement.
 */
export class Farmer {
  private sprite: Phaser.GameObjects.Sprite;
  private gridPosition: GridPosition;
  private spriteManager: SpriteManager;
  private direction = 0; // 0=down, 1=left, 2=right, 3=up
  private isMoving = false;

  constructor(scene: Phaser.Scene, startPosition: GridPosition, spriteManager: SpriteManager) {
    this.gridPosition = { ...startPosition };
    this.spriteManager = spriteManager;

    // Create sprite at world position
    const worldPos = this.gridToWorld(startPosition);
    this.sprite = scene.add.sprite(
      worldPos.x,
      worldPos.y,
      spriteManager.getFarmerTextureKey(this.direction),
    );

    // Set origin to center for better alignment
    this.sprite.setOrigin(0.5, 0.5);

    // Ensure sprite is above tiles
    this.sprite.setDepth(10);
  }

  /**
   * Convert grid position to world coordinates.
   * @param gridPos - Grid position.
   * @returns World coordinates.
   */
  private gridToWorld(gridPos: GridPosition): { x: number; y: number } {
    return {
      x: gridPos.x * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2,
      y: gridPos.y * GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_SIZE / 2,
    };
  }

  /**
   * Move the farmer in a direction if possible.
   * @param direction - Direction to move (0=down, 1=left, 2=right, 3=up).
   * @returns True if movement was successful, false otherwise.
   */
  move(direction: number): boolean {
    if (this.isMoving) {
      return false;
    }

    const newPosition = { ...this.gridPosition };

    switch (direction) {
      case 0: // Down
        newPosition.y += 1;
        break;
      case 1: // Left
        newPosition.x -= 1;
        break;
      case 2: // Right
        newPosition.x += 1;
        break;
      case 3: // Up
        newPosition.y -= 1;
        break;
      default:
        return false;
    }

    // Check bounds
    if (
      newPosition.x < 0 ||
      newPosition.x >= GAME_CONFIG.GRID_WIDTH ||
      newPosition.y < 0 ||
      newPosition.y >= GAME_CONFIG.GRID_HEIGHT
    ) {
      // Still update direction for sprite facing
      this.setDirection(direction);
      return false;
    }

    // Update direction and position
    this.setDirection(direction);
    this.gridPosition = newPosition;

    // Animate movement
    this.animateToPosition(newPosition);

    return true;
  }

  /**
   * Set the farmer's facing direction.
   * @param direction - Direction to face.
   */
  private setDirection(direction: number): void {
    this.direction = direction;
    this.sprite.setTexture(this.spriteManager.getFarmerTextureKey(direction));
  }

  /**
   * Animate farmer movement to new position.
   * @param targetPosition - Target grid position.
   */
  private animateToPosition(targetPosition: GridPosition): void {
    const worldPos = this.gridToWorld(targetPosition);
    this.isMoving = true;

    // Create smooth movement tween
    this.sprite.scene.tweens.add({
      targets: this.sprite,
      x: worldPos.x,
      y: worldPos.y,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        this.isMoving = false;
      },
    });
  }

  /**
   * Get the farmer's current grid position.
   * @returns Current grid position.
   */
  getGridPosition(): GridPosition {
    return { ...this.gridPosition };
  }

  /**
   * Get the farmer's current facing direction.
   * @returns Current direction (0=down, 1=left, 2=right, 3=up).
   */
  getDirection(): number {
    return this.direction;
  }

  /**
   * Check if the farmer is currently moving.
   * @returns True if moving, false otherwise.
   */
  getIsMoving(): boolean {
    return this.isMoving;
  }

  /**
   * Get the sprite object for external manipulation.
   * @returns The Phaser sprite object.
   */
  getSprite(): Phaser.GameObjects.Sprite {
    return this.sprite;
  }

  /**
   * Set the farmer's position directly (for initialization).
   * @param position - New grid position.
   */
  setPosition(position: GridPosition): void {
    if (this.isMoving) {
      return;
    }

    this.gridPosition = { ...position };
    const worldPos = this.gridToWorld(position);
    this.sprite.setPosition(worldPos.x, worldPos.y);
  }

  /**
   * Destroy the farmer sprite.
   */
  destroy(): void {
    this.sprite.destroy();
  }
}
