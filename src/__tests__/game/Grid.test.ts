import { Grid } from '@/game/Grid';
import { TileState, CropType, GridPosition } from '@/game/types';

describe('Grid', () => {
  let grid: Grid;
  const testPosition: GridPosition = { x: 5, y: 5 };

  beforeEach(() => {
    grid = new Grid(10, 10);
  });

  describe('initialization', () => {
    it('should create a grid with correct dimensions', () => {
      const dimensions = grid.getDimensions();
      expect(dimensions.width).toBe(10);
      expect(dimensions.height).toBe(10);
    });

    it('should initialize all tiles as empty', () => {
      const tile = grid.getTile(testPosition);
      expect(tile).not.toBeNull();
      expect(tile!.state).toBe(TileState.EMPTY);
      expect(tile!.position).toEqual(testPosition);
    });
  });

  describe('tile access', () => {
    it('should return tile for valid position', () => {
      const tile = grid.getTile({ x: 0, y: 0 });
      expect(tile).not.toBeNull();
      expect(tile!.position).toEqual({ x: 0, y: 0 });
    });

    it('should return null for invalid position', () => {
      expect(grid.getTile({ x: -1, y: 0 })).toBeNull();
      expect(grid.getTile({ x: 0, y: -1 })).toBeNull();
      expect(grid.getTile({ x: 10, y: 0 })).toBeNull();
      expect(grid.getTile({ x: 0, y: 10 })).toBeNull();
    });
  });

  describe('position validation', () => {
    it('should validate positions correctly', () => {
      expect(grid.isValidPosition({ x: 0, y: 0 })).toBe(true);
      expect(grid.isValidPosition({ x: 9, y: 9 })).toBe(true);
      expect(grid.isValidPosition({ x: 5, y: 5 })).toBe(true);

      expect(grid.isValidPosition({ x: -1, y: 0 })).toBe(false);
      expect(grid.isValidPosition({ x: 0, y: -1 })).toBe(false);
      expect(grid.isValidPosition({ x: 10, y: 0 })).toBe(false);
      expect(grid.isValidPosition({ x: 0, y: 10 })).toBe(false);
    });
  });

  describe('tile state management', () => {
    it('should set tile state successfully', () => {
      const success = grid.setTileState(testPosition, TileState.HOED);
      expect(success).toBe(true);

      const tile = grid.getTile(testPosition);
      expect(tile!.state).toBe(TileState.HOED);
    });

    it('should fail to set tile state for invalid position', () => {
      const success = grid.setTileState({ x: -1, y: 0 }, TileState.HOED);
      expect(success).toBe(false);
    });
  });

  describe('crop planting', () => {
    beforeEach(() => {
      grid.setTileState(testPosition, TileState.HOED);
    });

    it('should plant crop on hoed tile', () => {
      const currentTime = Date.now();
      const success = grid.plantCrop(testPosition, CropType.WHEAT, currentTime);

      expect(success).toBe(true);
      const tile = grid.getTile(testPosition);
      expect(tile!.state).toBe(TileState.PLANTED);
      expect(tile!.cropType).toBe(CropType.WHEAT);
      expect(tile!.plantedTime).toBe(currentTime);
    });

    it('should fail to plant crop on non-hoed tile', () => {
      grid.setTileState(testPosition, TileState.EMPTY);
      const success = grid.plantCrop(testPosition, CropType.WHEAT, Date.now());
      expect(success).toBe(false);
    });
  });

  describe('tile watering', () => {
    beforeEach(() => {
      grid.setTileState(testPosition, TileState.HOED);
      grid.plantCrop(testPosition, CropType.WHEAT, Date.now());
    });

    it('should water planted tile', () => {
      const currentTime = Date.now();
      const success = grid.waterTile(testPosition, currentTime);

      expect(success).toBe(true);
      const tile = grid.getTile(testPosition);
      expect(tile!.state).toBe(TileState.WATERED);
      expect(tile!.wateredTime).toBe(currentTime);
    });

    it('should fail to water non-planted tile', () => {
      grid.setTileState(testPosition, TileState.EMPTY);
      const success = grid.waterTile(testPosition, Date.now());
      expect(success).toBe(false);
    });
  });

  describe('crop harvesting', () => {
    beforeEach(() => {
      grid.setTileState(testPosition, TileState.HOED);
      grid.plantCrop(testPosition, CropType.WHEAT, Date.now());
      grid.waterTile(testPosition, Date.now());
      // Manually set to harvestable for testing
      grid.setTileState(testPosition, TileState.HARVESTABLE);
    });

    it('should harvest crop from harvestable tile', () => {
      const cropType = grid.harvestCrop(testPosition);

      expect(cropType).toBe(CropType.WHEAT);
      const tile = grid.getTile(testPosition);
      expect(tile!.state).toBe(TileState.EMPTY);
      expect(tile!.cropType).toBeUndefined();
      expect(tile!.plantedTime).toBeUndefined();
      expect(tile!.wateredTime).toBeUndefined();
    });

    it('should fail to harvest from non-harvestable tile', () => {
      grid.setTileState(testPosition, TileState.PLANTED);
      const cropType = grid.harvestCrop(testPosition);
      expect(cropType).toBeNull();
    });
  });

  describe('tile growth update', () => {
    it('should update watered tile to harvestable after growth time', () => {
      const plantTime = 1000;
      const waterTime = 2000;
      const checkTime = waterTime + 6000; // After wheat growth time (5000ms)

      grid.setTileState(testPosition, TileState.HOED);
      grid.plantCrop(testPosition, CropType.WHEAT, plantTime);
      grid.waterTile(testPosition, waterTime);

      grid.updateTiles(checkTime);

      const tile = grid.getTile(testPosition);
      expect(tile!.state).toBe(TileState.HARVESTABLE);
    });

    it('should not update tile before growth time', () => {
      const plantTime = 1000;
      const waterTime = 2000;
      const checkTime = waterTime + 3000; // Before wheat growth time

      grid.setTileState(testPosition, TileState.HOED);
      grid.plantCrop(testPosition, CropType.WHEAT, plantTime);
      grid.waterTile(testPosition, waterTime);

      grid.updateTiles(checkTime);

      const tile = grid.getTile(testPosition);
      expect(tile!.state).toBe(TileState.WATERED);
    });
  });

  describe('getDimensions', () => {
    it('should return correct dimensions', () => {
      const dimensions = grid.getDimensions();
      expect(dimensions.width).toBe(10);
      expect(dimensions.height).toBe(10);
    });
  });

  describe('getAllTiles', () => {
    it('should return all tiles in the grid', () => {
      const allTiles = grid.getAllTiles();
      expect(allTiles).toHaveLength(10); // height (custom grid size)
      expect(allTiles[0]).toHaveLength(10); // width (custom grid size)

      // Verify structure
      expect(allTiles[0]![0]).toEqual({
        position: { x: 0, y: 0 },
        state: TileState.EMPTY,
      });
    });

    it('should return reference to actual tiles array', () => {
      const allTiles = grid.getAllTiles();

      // Modify a tile through grid methods
      grid.setTileState({ x: 5, y: 5 }, TileState.HOED);

      // Check that the returned array reflects the change
      expect(allTiles[5]![5]!.state).toBe(TileState.HOED);
    });
  });
});
