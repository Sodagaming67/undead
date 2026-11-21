class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;

    this.add.text(cx, cy - 90, 'UNDEAD INC', {
      fontSize: '64px', fill: '#ff3333', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(cx, cy - 20, 'Type what you would do in a zombie apocalypse.\nLast cousin alive wins.', {
      fontSize: '20px', fill: '#cccccc', align: 'center', lineSpacing: 6
    }).setOrigin(0.5);

    const startText = this.add.text(cx, cy + 80, 'Press SPACE to Start', {
      fontSize: '22px', fill: '#aaaaaa'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: startText, alpha: 0, duration: 700, yoyo: true, repeat: -1
    });

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('SetupScene'));
  }
}
