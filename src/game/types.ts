/**
 * Core game types and enums for the farming game.
 */

/**
 * Different states a farm tile can be in.
 */
export enum TileState {
  EMPTY = 'empty',
  HOED = 'hoed',
  PLANTED = 'planted',
  WATERED = 'watered',
  HARVESTABLE = 'harvestable',
}

/**
 * Types of crops that can be planted.
 */
export enum CropType {
  WHEAT = 'wheat',
}

/**
 * Possible farming actions.
 */
export enum FarmingAction {
  HOE = 'hoe',
  PLANT = 'plant',
  WATER = 'water',
  HARVEST = 'harvest',
}

/**
 * Grid position coordinates.
 */
export interface GridPosition {
  x: number;
  y: number;
}

/**
 * Information about a farm tile.
 */
export interface FarmTile {
  position: GridPosition;
  state: TileState;
  cropType?: CropType;
  plantedTime?: number;
  wateredTime?: number;
}

/**
 * Game configuration constants.
 */
export const GAME_CONFIG = {
  TILE_SIZE: 32,
  GRID_WIDTH: 20,
  GRID_HEIGHT: 15,
  WHEAT_GROWTH_TIME: 5000, // 5 seconds for quick testing
  WATER_EFFECT_DURATION: 10000, // 10 seconds
} as const;
