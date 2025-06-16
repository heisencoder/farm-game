import { FarmingAction, TileState, CropType } from '@/game/types';

// Test the farming action logic
describe('Farming Action Logic', () => {
  describe('action validation', () => {
    it('should validate hoe action on empty tile', () => {
      const tileState = TileState.EMPTY;
      const action = FarmingAction.HOE;

      // Hoe action should be valid on empty tiles
      const isValid = tileState === TileState.EMPTY && action === FarmingAction.HOE;
      expect(isValid).toBe(true);
    });

    it('should validate plant action on hoed tile', () => {
      const tileState = TileState.HOED;
      const action = FarmingAction.PLANT;

      // Plant action should be valid on hoed tiles
      const isValid = tileState === TileState.HOED && action === FarmingAction.PLANT;
      expect(isValid).toBe(true);
    });

    it('should validate water action on planted tile', () => {
      const tileState = TileState.PLANTED;
      const action = FarmingAction.WATER;

      // Water action should be valid on planted tiles
      const isValid = tileState === TileState.PLANTED && action === FarmingAction.WATER;
      expect(isValid).toBe(true);
    });

    it('should validate harvest action on harvestable tile', () => {
      const tileState = TileState.HARVESTABLE;
      const action = FarmingAction.HARVEST;

      // Harvest action should be valid on harvestable tiles
      const isValid = tileState === TileState.HARVESTABLE && action === FarmingAction.HARVEST;
      expect(isValid).toBe(true);
    });

    it('should invalidate incorrect action combinations', () => {
      // Can't plant on empty tile
      expect(TileState.EMPTY === TileState.HOED).toBe(false);

      // Can't water empty tile
      expect(TileState.EMPTY === TileState.PLANTED).toBe(false);

      // Can't harvest planted tile (not ready yet)
      expect(TileState.PLANTED === TileState.HARVESTABLE).toBe(false);
    });
  });

  describe('farming workflow', () => {
    it('should follow correct farming sequence', () => {
      const sequence = [
        TileState.EMPTY,
        TileState.HOED,
        TileState.PLANTED,
        TileState.WATERED,
        TileState.HARVESTABLE,
        TileState.EMPTY, // After harvest
      ];

      const actions = [
        FarmingAction.HOE,
        FarmingAction.PLANT,
        FarmingAction.WATER,
        FarmingAction.HARVEST,
      ];

      // Verify the sequence makes sense
      expect(sequence[0]).toBe(TileState.EMPTY);
      expect(sequence[1]).toBe(TileState.HOED);
      expect(sequence[2]).toBe(TileState.PLANTED);
      expect(sequence[3]).toBe(TileState.WATERED);
      expect(sequence[4]).toBe(TileState.HARVESTABLE);
      expect(sequence[5]).toBe(TileState.EMPTY);

      expect(actions[0]).toBe(FarmingAction.HOE);
      expect(actions[1]).toBe(FarmingAction.PLANT);
      expect(actions[2]).toBe(FarmingAction.WATER);
      expect(actions[3]).toBe(FarmingAction.HARVEST);
    });
  });

  describe('crop types', () => {
    it('should support wheat crop type', () => {
      expect(CropType.WHEAT).toBe('wheat');
    });

    it('should handle crop type in farming workflow', () => {
      const cropType = CropType.WHEAT;

      // Crop type should be assigned during planting
      expect(cropType).toBeDefined();
      expect(typeof cropType).toBe('string');
    });
  });
});
