import { FarmTile, GridPosition, TileState, CropType, GAME_CONFIG } from './types';

/**
 * Manages the farm grid system and tile states.
 */
export class Grid {
  private tiles: FarmTile[][];
  private readonly width: number;
  private readonly height: number;

  constructor(width = GAME_CONFIG.GRID_WIDTH, height = GAME_CONFIG.GRID_HEIGHT) {
    this.width = width;
    this.height = height;
    this.tiles = this.initializeGrid();
  }

  /**
   * Initialize the grid with empty tiles.
   * @returns A 2D array of empty farm tiles.
   */
  private initializeGrid(): FarmTile[][] {
    const grid: FarmTile[][] = [];
    for (let y = 0; y < this.height; y++) {
      grid[y] = [];
      for (let x = 0; x < this.width; x++) {
        grid[y][x] = {
          position: { x, y },
          state: TileState.EMPTY,
        };
      }
    }
    return grid;
  }

  /**
   * Get a tile at the specified position.
   * @param position - The grid position.
   * @returns The farm tile or null if position is invalid.
   */
  getTile(position: GridPosition): FarmTile | null {
    if (!this.isValidPosition(position)) {
      return null;
    }
    return this.tiles[position.y][position.x];
  }

  /**
   * Set the state of a tile at the specified position.
   * @param position - The grid position.
   * @param state - The new tile state.
   * @returns True if successful, false if position is invalid.
   */
  setTileState(position: GridPosition, state: TileState): boolean {
    const tile = this.getTile(position);
    if (!tile) {
      return false;
    }
    tile.state = state;
    return true;
  }

  /**
   * Plant a crop on a tile.
   * @param position - The grid position.
   * @param cropType - The type of crop to plant.
   * @param currentTime - Current game time.
   * @returns True if successful, false if tile cannot be planted.
   */
  plantCrop(position: GridPosition, cropType: CropType, currentTime: number): boolean {
    const tile = this.getTile(position);
    if (!tile || tile.state !== TileState.HOED) {
      return false;
    }
    tile.state = TileState.PLANTED;
    tile.cropType = cropType;
    tile.plantedTime = currentTime;
    return true;
  }

  /**
   * Water a planted tile.
   * @param position - The grid position.
   * @param currentTime - Current game time.
   * @returns True if successful, false if tile cannot be watered.
   */
  waterTile(position: GridPosition, currentTime: number): boolean {
    const tile = this.getTile(position);
    if (!tile || tile.state !== TileState.PLANTED) {
      return false;
    }
    tile.state = TileState.WATERED;
    tile.wateredTime = currentTime;
    return true;
  }

  /**
   * Harvest a crop from a tile.
   * @param position - The grid position.
   * @returns The crop type if successful, null if tile cannot be harvested.
   */
  harvestCrop(position: GridPosition): CropType | null {
    const tile = this.getTile(position);
    if (!tile || tile.state !== TileState.HARVESTABLE) {
      return null;
    }
    const cropType = tile.cropType;
    tile.state = TileState.EMPTY;
    tile.cropType = undefined;
    tile.plantedTime = undefined;
    tile.wateredTime = undefined;
    return cropType || null;
  }

  /**
   * Update tile states based on time progression.
   * @param currentTime - Current game time.
   */
  updateTiles(currentTime: number): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.tiles[y][x];
        this.updateTileGrowth(tile, currentTime);
      }
    }
  }

  /**
   * Update a single tile's growth state.
   * @param tile - The tile to update.
   * @param currentTime - Current game time.
   */
  private updateTileGrowth(tile: FarmTile, currentTime: number): void {
    if (tile.state === TileState.WATERED && tile.plantedTime && tile.wateredTime) {
      const growthTime = tile.cropType === CropType.WHEAT ? GAME_CONFIG.WHEAT_GROWTH_TIME : 0;
      const timeSinceWatered = currentTime - tile.wateredTime;

      if (timeSinceWatered >= growthTime) {
        tile.state = TileState.HARVESTABLE;
      }
    }
  }

  /**
   * Check if a position is within the grid bounds.
   * @param position - The position to check.
   * @returns True if position is valid, false otherwise.
   */
  isValidPosition(position: GridPosition): boolean {
    return (
      position.x >= 0 && position.x < this.width && position.y >= 0 && position.y < this.height
    );
  }

  /**
   * Get the grid dimensions.
   * @returns Object with width and height.
   */
  getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  /**
   * Get all tiles in the grid.
   * @returns 2D array of all tiles.
   */
  getAllTiles(): FarmTile[][] {
    return this.tiles;
  }
}
