import Phaser from 'phaser';

/**
 * Main game scene that displays a Hello World message.
 */
export class MainScene extends Phaser.Scene {
  private helloText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'MainScene' });
  }

  /**
   * Preload game assets.
   * Currently no assets to preload for Hello World.
   */
  preload(): void {
    // No assets to preload for Hello World
  }

  /**
   * Create game objects and initialize the scene.
   */
  create(): void {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Create Hello World text
    this.helloText = this.add.text(centerX, centerY - 50, 'Hello, Phaser World!', {
      fontSize: '48px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000000',
        blur: 2,
        stroke: true,
        fill: true,
      },
    });
    this.helloText.setOrigin(0.5);

    // Create subtitle
    const subtitleText = this.add.text(centerX, centerY + 30, 'Welcome to Vibe Farming Game', {
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    });
    subtitleText.setOrigin(0.5);

    // Create instructions
    const instructionsText = this.add.text(
      centerX,
      centerY + 100,
      'This is your future farming adventure!',
      {
        fontSize: '18px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      },
    );
    instructionsText.setOrigin(0.5);

    // Add floating animation to Hello World text
    this.tweens.add({
      targets: this.helloText,
      y: centerY - 60,
      duration: 2000,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }

  /**
   * Update the scene. Called every frame.
   * @param _time - The current time.
   * @param _delta - The delta time in milliseconds since the last frame.
   */
  update(_time: number, _delta: number): void {
    // Future game logic will go here
  }
}
