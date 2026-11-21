class SetupScene extends Phaser.Scene {
  constructor() { super('SetupScene'); }

  create() {
    this.names = [];
    this.typed = '';
    this.cursorOn = true;

    this.add.text(560, 70, 'Who is playing?', {
      fontSize: '32px', fill: '#ff5555', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(560, 115, 'Type a name and press ENTER. Add up to 8 cousins.', {
      fontSize: '16px', fill: '#aaaaaa'
    }).setOrigin(0.5);

    this.listText = this.add.text(410, 170, '', { fontSize: '22px', fill: '#ffffff', lineSpacing: 6 });
    this.inputText = this.add.text(410, 520, '', { fontSize: '22px', fill: '#88ff88' });
    this.footerText = this.add.text(560, 650, '', { fontSize: '16px', fill: '#888888' }).setOrigin(0.5);

    this.time.addEvent({ delay: 400, loop: true, callback: () => { this.cursorOn = !this.cursorOn; this.draw(); } });
    this.input.keyboard.on('keydown', e => this.onKey(e));
    this.draw();
  }

  onKey(e) {
    if (e.repeat) return;
    if (e.key === 'Escape') return this.scene.start('MenuScene');
    if (e.key === 'Backspace') {
      if (this.typed) this.typed = this.typed.slice(0, -1);
      else this.names.pop();
    } else if (e.key === 'Enter') {
      const name = this.typed.trim();
      if (name && this.names.length < 8) this.names.push(name);
      else if (!name && this.names.length) return this.scene.start('GameScene', { names: this.names });
      this.typed = '';
    } else if (e.key.length === 1 && this.typed.length < 12) {
      this.typed += e.key;
    }
    this.draw();
  }

  draw() {
    this.listText.setText(this.names.map((n, i) => `${i + 1}. ${n}`).join('\n'));
    this.inputText.setText(this.names.length < 8 ? 'Name: ' + this.typed + (this.cursorOn ? '_' : '') : '');
    this.footerText.setText(this.names.length
      ? 'Press ENTER on an empty name to start  ·  BACKSPACE removes the last name'
      : 'ESC = back to menu');
  }
}
