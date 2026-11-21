class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    this.add.text(cx, cy - 60, 'Undead Inc', {
      fontSize: '48px', fill: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    const startText = this.add.text(cx, cy + 40, 'Press SPACE to Start', {
      fontSize: '22px', fill: '#aaaaaa'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: startText, alpha: 0, duration: 700, yoyo: true, repeat: -1
    });

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('GameScene'));
  }
}
