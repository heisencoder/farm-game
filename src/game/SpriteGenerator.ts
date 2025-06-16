/**
 * Generates pixel art sprites programmatically using a 16-color palette.
 * SNES-era aesthetic with limited colors and crisp pixels.
 */

/**
 * 16-color palette inspired by SNES games.
 */
export const PALETTE = {
  BLACK: '#000000',
  DARK_GRAY: '#2D2D2D',
  GRAY: '#5A5A5A',
  LIGHT_GRAY: '#A5A5A5',
  WHITE: '#FFFFFF',
  DARK_BROWN: '#3D2914',
  BROWN: '#5A3A1A',
  LIGHT_BROWN: '#8B5A2B',
  DARK_GREEN: '#1A4D1A',
  GREEN: '#2D7D2D',
  LIGHT_GREEN: '#5FAD5F',
  YELLOW: '#FFFF5F',
  ORANGE: '#FF8F2D',
  BLUE: '#2D5FFF',
  LIGHT_BLUE: '#5F8FFF',
  RED: '#FF2D2D',
} as const;

/**
 * Creates a canvas with pixel art for sprites.
 */
export class SpriteGenerator {
  /**
   * Generate farmer sprite (16x16 pixels).
   * @param direction - Direction the farmer is facing (0=down, 1=left, 2=right, 3=up).
   * @returns Canvas element with the farmer sprite.
   */
  static generateFarmer(direction = 0): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;

    // Disable smoothing for pixel art
    ctx.imageSmoothingEnabled = false;

    // Base farmer pattern (facing down)
    const patterns = [
      // Facing down (0)
      [
        '0000666600000000',
        '0006666660000000',
        '0066666666000000',
        '0066FFFF66000000',
        '0066F44F66000000',
        '0066FFFF66000000',
        '0066666666000000',
        '0000AAAA00000000',
        '0000AAAA00000000',
        '0000AAAA00000000',
        '0000A44A00000000',
        '0000AAAA00000000',
        '0000A44A00000000',
        '0000AAAA00000000',
        '00003333000C0000',
        '00003333000C0000',
      ],
      // Facing left (1)
      [
        '0000666600000000',
        '0006666660000000',
        '0066666666000000',
        '0066FFFF66000000',
        '0066F44F66000000',
        '0066FFFF66000000',
        '0066666666000000',
        '000AAAAA0000000',
        '000AAAAA0000000',
        '000AAAAA0000000',
        '000AA44A0000000',
        '000AAAAA0000000',
        '0033A44A0000000',
        '0033AAAA0000000',
        '00C33333000000',
        '00003333000000',
      ],
      // Facing right (2)
      [
        '0000666600000000',
        '0006666660000000',
        '0066666666000000',
        '0066FFFF66000000',
        '0066F44F66000000',
        '0066FFFF66000000',
        '0066666666000000',
        '0000AAAAA000000',
        '0000AAAAA000000',
        '0000AAAAA000000',
        '0000A44AA000000',
        '0000AAAAA000000',
        '0000A44A3300000',
        '0000AAAA3300000',
        '000033333C000000',
        '000033330000000',
      ],
      // Facing up (3)
      [
        '0000666600000000',
        '0006666660000000',
        '0066666666000000',
        '0066666666000000',
        '0066F44F66000000',
        '0066FFFF66000000',
        '0066666666000000',
        '0000AAAA00000000',
        '0000AAAA00000000',
        '0000AAAA00000000',
        '0000A44A00000000',
        '0000AAAA00000000',
        '0000A44A00000000',
        '0000AAAA00000000',
        '00003333000C0000',
        '00003333000C0000',
      ],
    ];

    const colorMap: Record<string, string> = {
      '0': PALETTE.BLACK,        // Background (transparent)
      '3': PALETTE.DARK_BROWN,   // Boots
      '4': PALETTE.BROWN,        // Eyes/mouth
      '6': PALETTE.LIGHT_BROWN,  // Skin
      'A': PALETTE.BLUE,         // Shirt
      'C': PALETTE.DARK_GRAY,    // Tool handle
      'F': PALETTE.WHITE,        // Eyes
    };

    const pattern = patterns[direction] || patterns[0];
    
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const colorKey = pattern[y][x];
        if (colorKey !== '0') {
          ctx.fillStyle = colorMap[colorKey] || PALETTE.BLACK;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    return canvas;
  }

  /**
   * Generate a farm tile sprite (32x32 pixels).
   * @param type - Type of tile ('empty', 'hoed', 'planted', 'watered', 'harvestable').
   * @returns Canvas element with the tile sprite.
   */
  static generateTile(type: string): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    // Base grass background
    ctx.fillStyle = PALETTE.GREEN;
    ctx.fillRect(0, 0, 32, 32);

    // Add grass texture
    ctx.fillStyle = PALETTE.DARK_GREEN;
    for (let i = 0; i < 50; i++) {
      const x = Math.floor(Math.random() * 32);
      const y = Math.floor(Math.random() * 32);
      ctx.fillRect(x, y, 1, 1);
    }

    switch (type) {
      case 'hoed':
        // Brown hoed earth
        ctx.fillStyle = PALETTE.DARK_BROWN;
        ctx.fillRect(4, 4, 24, 24);
        ctx.fillStyle = PALETTE.BROWN;
        for (let i = 0; i < 30; i++) {
          const x = 4 + Math.floor(Math.random() * 24);
          const y = 4 + Math.floor(Math.random() * 24);
          ctx.fillRect(x, y, 1, 1);
        }
        break;
        
      case 'planted':
        // Hoed earth with small green sprout
        ctx.fillStyle = PALETTE.DARK_BROWN;
        ctx.fillRect(4, 4, 24, 24);
        ctx.fillStyle = PALETTE.BROWN;
        for (let i = 0; i < 20; i++) {
          const x = 4 + Math.floor(Math.random() * 24);
          const y = 4 + Math.floor(Math.random() * 24);
          ctx.fillRect(x, y, 1, 1);
        }
        // Small sprout
        ctx.fillStyle = PALETTE.LIGHT_GREEN;
        ctx.fillRect(15, 18, 2, 2);
        ctx.fillRect(14, 19, 1, 1);
        ctx.fillRect(17, 19, 1, 1);
        break;
        
      case 'watered':
        // Darker, wet earth with growing plant
        ctx.fillStyle = PALETTE.DARK_BROWN;
        ctx.fillRect(4, 4, 24, 24);
        ctx.fillStyle = PALETTE.DARK_GRAY;
        for (let i = 0; i < 15; i++) {
          const x = 4 + Math.floor(Math.random() * 24);
          const y = 4 + Math.floor(Math.random() * 24);
          ctx.fillRect(x, y, 1, 1);
        }
        // Medium plant
        ctx.fillStyle = PALETTE.LIGHT_GREEN;
        ctx.fillRect(14, 16, 4, 4);
        ctx.fillRect(13, 17, 1, 1);
        ctx.fillRect(18, 17, 1, 1);
        ctx.fillRect(15, 15, 2, 1);
        break;
        
      case 'harvestable':
        // Full grown wheat
        ctx.fillStyle = PALETTE.DARK_BROWN;
        ctx.fillRect(4, 4, 24, 24);
        
        // Wheat stalks
        ctx.fillStyle = PALETTE.YELLOW;
        ctx.fillRect(12, 8, 2, 12);
        ctx.fillRect(16, 6, 2, 14);
        ctx.fillRect(20, 9, 2, 11);
        ctx.fillRect(10, 10, 2, 10);
        ctx.fillRect(18, 7, 2, 13);
        
        // Wheat tops
        ctx.fillStyle = PALETTE.ORANGE;
        ctx.fillRect(11, 8, 4, 2);
        ctx.fillRect(15, 6, 4, 2);
        ctx.fillRect(19, 9, 4, 2);
        ctx.fillRect(9, 10, 4, 2);
        ctx.fillRect(17, 7, 4, 2);
        break;
    }

    return canvas;
  }

  /**
   * Generate cursor/selection indicator (32x32 pixels).
   * @returns Canvas element with selection indicator.
   */
  static generateCursor(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    // Draw selection border
    ctx.strokeStyle = PALETTE.YELLOW;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 30, 30);
    
    // Corner highlights
    ctx.fillStyle = PALETTE.WHITE;
    ctx.fillRect(0, 0, 4, 4);
    ctx.fillRect(28, 0, 4, 4);
    ctx.fillRect(0, 28, 4, 4);
    ctx.fillRect(28, 28, 4, 4);

    return canvas;
  }

  /**
   * Convert canvas to Phaser texture.
   * @param scene - Phaser scene to add texture to.
   * @param key - Texture key.
   * @param canvas - Canvas element.
   */
  static canvasToTexture(scene: Phaser.Scene, key: string, canvas: HTMLCanvasElement): void {
    if (scene.textures.exists(key)) {
      scene.textures.remove(key);
    }
    scene.textures.addCanvas(key, canvas);
  }
}