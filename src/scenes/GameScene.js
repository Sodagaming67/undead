class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  init(data) {
    this.players = data.names.map(name => ({ name, hearts: 3, alive: true, last: null, diedRound: 0, death: '' }));
    this.round = 1;
    this.turn = 0;
    this.deck = [];
  }

  create() {
    this.statusText = this.add.text(20, 14, '', { fontSize: '16px', fill: '#cccccc', wordWrap: { width: 760 } });
    this.headerText = this.add.text(400, 95, '', { fontSize: '28px', fill: '#ff5555', fontStyle: 'bold' }).setOrigin(0.5);
    this.bodyText = this.add.text(50, 135, '', { fontSize: '20px', fill: '#ffffff', wordWrap: { width: 700 }, lineSpacing: 6 });
    this.inputText = this.add.text(50, 260, '', { fontSize: '20px', fill: '#88ff88', wordWrap: { width: 700 }, lineSpacing: 6 });
    this.footerText = this.add.text(400, 470, '', { fontSize: '14px', fill: '#888888', align: 'center' }).setOrigin(0.5);

    this.typed = '';
    this.cursorOn = true;
    this.time.addEvent({ delay: 400, loop: true, callback: () => { this.cursorOn = !this.cursorOn; this.drawInput(); } });
    this.input.keyboard.on('keydown', e => this.onKey(e));
    this.startTurn();
  }

  nextScenario() {
    if (!this.deck.length) this.deck = Phaser.Utils.Array.Shuffle(SCENARIOS.slice());
    return this.deck.pop();
  }

  drawStatus() {
    const list = this.players.map(p => p.alive ? `${p.name} ${'❤'.repeat(p.hearts)}` : `${p.name} 💀`).join('     ');
    this.statusText.setText(`Round ${this.round}     ${list}`);
  }

  startTurn() {
    this.phase = 'typing';
    this.typed = '';
    this.current = this.players[this.turn];
    this.scenario = this.nextScenario();

    this.headerText.setText(`${this.current.name}'s turn`).setColor('#ff5555');
    this.bodyText.setText(this.scenario.text).setColor('#ffffff');
    this.inputText.setColor('#88ff88');
    this.footerText.setText(`${IDEAS}\nPress ENTER when you're done typing`);
    this.drawStatus();
    this.drawInput();
  }

  drawInput() {
    if (this.phase !== 'typing') return;
    this.inputText.setY(this.bodyText.y + this.bodyText.height + 30);
    this.inputText.setText('What do you do?\n> ' + this.typed + (this.cursorOn ? '_' : ''));
  }

  onKey(e) {
    if (e.repeat) return;
    if (this.phase === 'typing') {
      if (e.key === 'Backspace') this.typed = this.typed.slice(0, -1);
      else if (e.key === 'Enter') { if (this.typed.trim()) return this.resolve(); }
      else if (e.key.length === 1 && this.typed.length < 120) this.typed += e.key;
      this.drawInput();
    } else if (this.phase === 'result' && e.key === 'Enter') {
      this.nextTurn();
    } else if (this.phase === 'over') {
      if (e.key === 'Enter') this.scene.restart({ names: this.players.map(p => p.name) });
      else if (e.key === 'Escape') this.scene.start('MenuScene');
    }
  }

  resolve() {
    const p = this.current;
    const action = findAction(this.typed);
    const repeated = action !== 'unknown' && action === p.last;
    p.last = action;

    const outcome = rollOutcome(action, this.scenario, this.round, repeated);
    let text = outcome.text.replaceAll('{name}', p.name);
    let result = outcome.result;

    if (result === 'hurt') {
      p.hearts--;
      if (p.hearts <= 0) {
        result = 'dead';
        text += `\n\nThat was one hit too many for ${p.name}...`;
      } else {
        text += '  (-1 ❤)';
      }
    } else if (result === 'good' && action === 'heal' && p.hearts < 3) {
      p.hearts++;
      text += '  (+1 ❤)';
    }
    if (repeated) text = 'The zombies have seen that move before...\n\n' + text;

    if (result === 'dead') {
      p.alive = false;
      p.diedRound = this.round;
      p.death = this.typed;
    }

    const look = {
      good: ['SAFE!', '#55ff55'],
      hurt: ['HURT!', '#ffcc33'],
      dead: [`${p.name.toUpperCase()} IS DEAD!`, '#ff3333']
    }[result];

    this.phase = 'result';
    this.headerText.setText(look[0]).setColor(look[1]);
    this.bodyText.setText(`${p.name}: "${this.typed}"`).setColor('#aaaaaa');
    this.inputText.setY(this.bodyText.y + this.bodyText.height + 30);
    this.inputText.setText(text).setColor(look[1]);
    this.footerText.setText('Press ENTER to continue');
    this.drawStatus();
  }

  nextTurn() {
    const alive = this.players.filter(p => p.alive);
    if (alive.length === 0 || (this.players.length > 1 && alive.length === 1)) return this.gameOver(alive[0]);

    do {
      this.turn++;
      if (this.turn >= this.players.length) {
        this.turn = 0;
        this.round++;
      }
    } while (!this.players[this.turn].alive);
    this.startTurn();
  }

  gameOver(winner) {
    this.phase = 'over';
    const solo = this.players.length === 1;
    if (solo) {
      const p = this.players[0];
      this.headerText.setText(`${p.name} survived ${p.diedRound - 1} rounds!`).setColor('#ffcc33');
    } else {
      this.headerText.setText(`${winner.name} is the last survivor!`).setColor('#55ff55');
    }

    const shorten = s => s.length > 45 ? s.slice(0, 45) + '...' : s;
    const fallen = this.players
      .filter(p => !p.alive)
      .sort((a, b) => b.diedRound - a.diedRound)
      .map(p => `💀 ${p.name}: round ${p.diedRound}, after "${shorten(p.death)}"`);

    this.bodyText.setText(fallen.join('\n')).setColor('#ffffff');
    this.inputText.setText('');
    this.footerText.setText('ENTER = play again with the same cousins     ESC = main menu');
    this.drawStatus();
  }
}
