const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  backgroundColor: '#101810',
  scene: [BootScene, MenuScene, SetupScene, GameScene, UIScene]
};

new Phaser.Game(config);
