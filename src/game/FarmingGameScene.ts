import Phaser from 'phaser';
import { Grid } from './Grid';
import { Farmer } from './Farmer';
import { InputController } from './InputController';
import { SpriteManager } from './SpriteManager';
import { FarmingAction, TileState, CropType, GAME_CONFIG } from './types';

/**
 * Main game scene for the farming simulation.
 */
export class FarmingGameScene extends Phaser.Scene {
  private grid!: Grid;
  private farmer!: Farmer;
  private inputController!: InputController;
  private spriteManager!: SpriteManager;
  private tileSprites: Phaser.GameObjects.Sprite[][];
  private cursor!: Phaser.GameObjects.Sprite;
  private uiText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'FarmingGameScene' });
    this.tileSprites = [];
  }

  /**
   * Create the game scene.
   */
  override create(): void {
    // Initialize core systems
    this.grid = new Grid();
    this.spriteManager = new SpriteManager(this);

    // Load all sprites
    this.spriteManager.loadSprites();

    // Create tile grid visual representation
    this.createTileGrid();

    // Create farmer at center of screen
    const startPosition = {
      x: Math.floor(GAME_CONFIG.GRID_WIDTH / 2),
      y: Math.floor(GAME_CONFIG.GRID_HEIGHT / 2),
    };
    this.farmer = new Farmer(this, startPosition, this.spriteManager);

    // Create cursor for tile selection
    this.createCursor();

    // Set up input handling
    this.inputController = new InputController(this, this.farmer);
    this.inputController.setFarmingActionCallback((action) => {
      this.handleFarmingAction(action);
    });

    // Create UI
    this.createUI();

    // Set camera to follow farmer area
    this.setupCamera();
  }

  /**
   * Create the visual grid of tiles.
   */
  private createTileGrid(): void {
    const dimensions = this.grid.getDimensions();

    for (let y = 0; y < dimensions.height; y++) {
      this.tileSprites[y] = [];
      for (let x = 0; x < dimensions.width; x++) {
        const worldX = x * GAME_CONFIG.TILE_SIZE;
        const worldY = y * GAME_CONFIG.TILE_SIZE;

        const tile = this.grid.getTile({ x, y })!;
        const textureKey = this.spriteManager.getTileTextureKey(tile.state);

        const sprite = this.add.sprite(worldX, worldY, textureKey);
        sprite.setOrigin(0, 0);
        sprite.setDepth(0);

        this.tileSprites[y][x] = sprite;
      }
    }
  }

  /**
   * Create the cursor for tile selection.
   */
  private createCursor(): void {
    this.cursor = this.add.sprite(0, 0, 'cursor');
    this.cursor.setOrigin(0, 0);
    this.cursor.setDepth(5);
    this.cursor.setAlpha(0.8);

    // Animate cursor
    this.tweens.add({
      targets: this.cursor,
      alpha: 0.4,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }

  /**
   * Create UI elements.
   */
  private createUI(): void {
    this.uiText = this.add.text(10, 10, '', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    });
    this.uiText.setDepth(100);
    this.uiText.setScrollFactor(0);

    this.updateUI();
  }

  /**
   * Set up camera to show the farming area.
   */
  private setupCamera(): void {
    const worldWidth = GAME_CONFIG.GRID_WIDTH * GAME_CONFIG.TILE_SIZE;
    const worldHeight = GAME_CONFIG.GRID_HEIGHT * GAME_CONFIG.TILE_SIZE;

    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.setZoom(1.5); // Zoom in for better visibility

    // Center camera on the game area
    this.cameras.main.centerOn(worldWidth / 2, worldHeight / 2);
  }

  /**
   * Handle farming actions from input.
   * @param action - The farming action to perform.
   */
  private handleFarmingAction(action: FarmingAction): void {
    const farmerPos = this.farmer.getGridPosition();
    const tile = this.grid.getTile(farmerPos);

    if (!tile) {
      return;
    }

    let success = false;
    const currentTime = this.time.now;

    switch (action) {
      case FarmingAction.HOE:
        if (tile.state === TileState.EMPTY) {
          success = this.grid.setTileState(farmerPos, TileState.HOED);
        }
        break;

      case FarmingAction.PLANT:
        if (tile.state === TileState.HOED) {
          success = this.grid.plantCrop(farmerPos, CropType.WHEAT, currentTime);
        }
        break;

      case FarmingAction.WATER:
        if (tile.state === TileState.PLANTED) {
          success = this.grid.waterTile(farmerPos, currentTime);
        }
        break;

      case FarmingAction.HARVEST:
        if (tile.state === TileState.HARVESTABLE) {
          const cropType = this.grid.harvestCrop(farmerPos);
          success = cropType !== null;
        }
        break;
    }

    if (success) {
      this.updateTileSprite(farmerPos);
      this.updateUI();
    }
  }

  /**
   * Update a single tile sprite to match its state.
   * @param position - Grid position of the tile to update.
   * @param position.x - X coordinate.
   * @param position.y - Y coordinate.
   */
  private updateTileSprite(position: { x: number; y: number }): void {
    const tile = this.grid.getTile(position);
    if (!tile) {
      return;
    }

    const sprite = this.tileSprites[position.y][position.x];
    const textureKey = this.spriteManager.getTileTextureKey(tile.state);
    sprite.setTexture(textureKey);
  }

  /**
   * Update all tile sprites to match their states.
   */
  private updateAllTileSprites(): void {
    const dimensions = this.grid.getDimensions();

    for (let y = 0; y < dimensions.height; y++) {
      for (let x = 0; x < dimensions.width; x++) {
        this.updateTileSprite({ x, y });
      }
    }
  }

  /**
   * Update UI text with current information.
   */
  private updateUI(): void {
    const farmerPos = this.farmer.getGridPosition();
    const tile = this.grid.getTile(farmerPos);

    if (!tile) {
      return;
    }

    let tileInfo = `Position: (${farmerPos.x}, ${farmerPos.y})\\n`;
    tileInfo += `Tile State: ${tile.state}\\n`;

    if (tile.cropType) {
      tileInfo += `Crop: ${tile.cropType}\\n`;
    }

    tileInfo += '\\nControls:\\n';
    tileInfo += 'Arrow Keys: Move\\n';
    tileInfo += 'H: Hoe  P: Plant  W: Water  Space: Harvest';

    this.uiText.setText(tileInfo);
  }

  /**
   * Update the cursor position to match farmer position.
   */
  private updateCursor(): void {
    const farmerPos = this.farmer.getGridPosition();
    const worldX = farmerPos.x * GAME_CONFIG.TILE_SIZE;
    const worldY = farmerPos.y * GAME_CONFIG.TILE_SIZE;

    this.cursor.setPosition(worldX, worldY);
  }

  /**
   * Update the scene each frame.
   * @param _time - Current time.
   * @param _delta - Time since last frame.
   */
  override update(_time: number, _delta: number): void {
    // Update grid for crop growth
    this.grid.updateTiles(this.time.now);

    // Update tile sprites if needed
    this.updateAllTileSprites();

    // Update cursor position
    this.updateCursor();

    // Update UI
    this.updateUI();

    // Update input controller
    this.inputController.update();
  }

  /**
   * Clean up when scene is destroyed.
   */
  override destroy(): void {
    if (this.inputController) {
      this.inputController.destroy();
    }
    if (this.farmer) {
      this.farmer.destroy();
    }
    super.destroy();
  }
}
