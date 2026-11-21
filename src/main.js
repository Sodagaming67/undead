const config = {
  type: Phaser.AUTO,
  width: 1120,
  height: 700,
  backgroundColor: '#101810',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootScene, MenuScene, SetupScene, GameScene, UIScene]
};

new Phaser.Game(config);
