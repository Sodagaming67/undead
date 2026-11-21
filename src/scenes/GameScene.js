class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  create() {
    this.add.text(400, 250, 'Game Scene — build here!', {
      fontSize: '24px', fill: '#ffffff'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-ESC', () => this.scene.start('MenuScene'));
  }
}
