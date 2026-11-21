const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 640,
  backgroundColor: '#101810',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootScene, MenuScene, SetupScene, GameScene, UIScene]
};

new Phaser.Game(config);
