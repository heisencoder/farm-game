import { SpriteGenerator } from './SpriteGenerator';
import { TileState } from './types';

/**
 * Manages sprite loading and generation for the farming game.
 */
export class SpriteManager {
  private scene: Phaser.Scene;
  private loaded = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Load all sprites into the scene.
   */
  loadSprites(): void {
    if (this.loaded) {
      return;
    }

    // Generate farmer sprites for all directions
    for (let direction = 0; direction < 4; direction++) {
      const canvas = SpriteGenerator.generateFarmer(direction);
      SpriteGenerator.canvasToTexture(this.scene, `farmer-${direction}`, canvas);
    }

    // Generate tile sprites for all states
    const tileTypes = ['empty', 'hoed', 'planted', 'watered', 'harvestable'];
    tileTypes.forEach((type) => {
      const canvas = SpriteGenerator.generateTile(type);
      SpriteGenerator.canvasToTexture(this.scene, `tile-${type}`, canvas);
    });

    // Generate cursor sprite
    const cursorCanvas = SpriteGenerator.generateCursor();
    SpriteGenerator.canvasToTexture(this.scene, 'cursor', cursorCanvas);

    this.loaded = true;
  }

  /**
   * Get the appropriate tile texture key for a tile state.
   * @param state - The tile state.
   * @returns The texture key.
   */
  getTileTextureKey(state: TileState): string {
    switch (state) {
      case TileState.EMPTY:
        return 'tile-empty';
      case TileState.HOED:
        return 'tile-hoed';
      case TileState.PLANTED:
        return 'tile-planted';
      case TileState.WATERED:
        return 'tile-watered';
      case TileState.HARVESTABLE:
        return 'tile-harvestable';
      default:
        return 'tile-empty';
    }
  }

  /**
   * Get the farmer texture key for a direction.
   * @param direction - The direction (0=down, 1=left, 2=right, 3=up).
   * @returns The texture key.
   */
  getFarmerTextureKey(direction: number): string {
    return `farmer-${Math.max(0, Math.min(3, direction))}`;
  }

  /**
   * Check if sprites are loaded.
   * @returns True if sprites are loaded, false otherwise.
   */
  isLoaded(): boolean {
    return this.loaded;
  }
}