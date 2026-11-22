class SetupScene extends Phaser.Scene {
  constructor() { super('SetupScene'); }

  create() {
    this.names = [];
    this.skills = [];
    this.picking = null;
    this.typed = '';
    this.cursorOn = true;

    this.titleText = this.add.text(560, 70, '', { fontSize: '32px', fill: '#ff5555', fontStyle: 'bold' }).setOrigin(0.5);
    this.subText = this.add.text(560, 115, '', { fontSize: '16px', fill: '#aaaaaa', align: 'center' }).setOrigin(0.5);
    this.listText = this.add.text(330, 170, '', { fontSize: '22px', fill: '#ffffff', lineSpacing: 6 });
    this.skillRows = Object.keys(SKILLS).map((k, i) => {
      const s = SKILLS[k];
      const y = 150 + i * 66;
      const desc = this.add.text(370, y + 1, s.desc, { fontSize: '15px', fill: '#dddddd', wordWrap: { width: 660 } });
      return [
        this.add.text(110, y, `${i + 1}  ${s.icon} ${s.name.toUpperCase()}`, { fontSize: '19px', fill: '#ffd43b', fontStyle: 'bold' }),
        desc,
        this.add.text(370, desc.y + desc.height + 4, 'Starts with: ' + s.kit.map(it => ITEMS[it].short).join(', '), { fontSize: '14px', fill: '#88ff88' })
      ];
    }).flat();
    this.skillRows.push(this.add.text(110, 150 + Object.keys(SKILLS).length * 66 + 6, 'R  🎲 RANDOM', { fontSize: '19px', fill: '#ffd43b', fontStyle: 'bold' }),
      this.add.text(370, 150 + Object.keys(SKILLS).length * 66 + 8, 'Let the zombies decide!', { fontSize: '15px', fill: '#dddddd' }));
    this.inputText = this.add.text(330, 520, '', { fontSize: '22px', fill: '#88ff88' });
    this.footerText = this.add.text(560, 690, '', { fontSize: '16px', fill: '#888888' }).setOrigin(0.5);

    this.time.addEvent({ delay: 400, loop: true, callback: () => { this.cursorOn = !this.cursorOn; this.draw(); } });
    this.input.keyboard.on('keydown', e => this.onKey(e));
    this.draw();
  }

  onKey(e) {
    if (e.repeat) return;
    if (this.picking) return this.pickSkill(e);
    if (e.key === 'Escape') return this.scene.start('MenuScene');
    if (e.key === 'Backspace') {
      if (this.typed) this.typed = this.typed.slice(0, -1);
      else { this.names.pop(); this.skills.pop(); }
    } else if (e.key === 'Enter') {
      const name = this.typed.trim();
      if (name && this.names.length < 8) this.picking = name;
      else if (!name && this.names.length) return this.scene.start('GameScene', { names: this.names, skills: this.skills });
      this.typed = '';
    } else if (e.key.length === 1 && this.typed.length < 12) {
      this.typed += e.key;
    }
    this.draw();
  }

  pickSkill(e) {
    const keys = Object.keys(SKILLS);
    let skill = null;
    if (e.key === 'Escape' || e.key === 'Backspace') {
      this.typed = this.picking;
      this.picking = null;
      return this.draw();
    }
    if (e.key === 'r' || e.key === 'R') skill = Phaser.Utils.Array.GetRandom(keys);
    else if (keys[parseInt(e.key, 10) - 1]) skill = keys[parseInt(e.key, 10) - 1];
    if (!skill) return;
    this.names.push(this.picking);
    this.skills.push(skill);
    this.picking = null;
    this.draw();
  }

  draw() {
    const picking = !!this.picking;
    this.listText.setVisible(!picking);
    this.inputText.setVisible(!picking);
    this.skillRows.forEach(t => t.setVisible(picking));
    if (picking) {
      this.titleText.setText(`Choose a skill for ${this.picking}`);
      this.subText.setText('Every skill has a special power and starts with its own stuff.');
      this.footerText.setText(`Press 1-${Object.keys(SKILLS).length} to choose, or R for random  ·  BACKSPACE = change the name`);
      return;
    }
    this.titleText.setText('Who is playing?');
    this.subText.setText('Type a name and press ENTER, then pick a skill. Add up to 8 cousins.');
    this.listText.setText(this.names.map((n, i) => `${i + 1}. ${n}  ${SKILLS[this.skills[i]].icon} ${SKILLS[this.skills[i]].name}`).join('\n'));
    this.inputText.setText(this.names.length < 8 ? 'Name: ' + this.typed + (this.cursorOn ? '_' : '') : '');
    this.footerText.setText(this.names.length
      ? 'Press ENTER on an empty name to start  ·  BACKSPACE removes the last name'
      : 'ESC = back to menu');
  }
}
