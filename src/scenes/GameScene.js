class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  init(data) {
    this.players = data.names.map(name => ({
      name, hearts: 3, alive: true, last: null,
      at: 'house', justArrived: true, items: [], found: {}, team: [], lost: [], met: [], eventIdx: {},
      recap: '', diedRound: 0, death: ''
    }));
    this.round = 1;
    this.turn = 0;
  }

  create() {
    const W = this.scale.width;
    this.statusText = this.add.text(20, 14, '', { fontSize: '16px', fill: '#cccccc', wordWrap: { width: W - 40 } });
    this.headerText = this.add.text(30, 58, '', { fontSize: '28px', fill: '#ff5555', fontStyle: 'bold' });
    this.recapText = this.add.text(30, 98, '', { fontSize: '14px', fill: '#888888', fontStyle: 'italic', wordWrap: { width: 600 } });
    this.storyText = this.add.text(30, 128, '', { fontSize: '16px', fill: '#ffffff', wordWrap: { width: 600 }, lineSpacing: 5 });
    this.inputText = this.add.text(30, 400, '', { fontSize: '18px', fill: '#88ff88', wordWrap: { width: 600 }, lineSpacing: 5 });
    this.hintText = this.add.text(30, 500, '', { fontSize: '15px', fill: '#ffaa44', wordWrap: { width: 600 } });

    this.add.rectangle(655, 52, 285, 530, 0x1c2a1c).setOrigin(0).setStrokeStyle(2, 0x3a5a3a);
    this.panelText = this.add.text(670, 64, '', { fontSize: '14px', fill: '#dddddd', wordWrap: { width: 260 }, lineSpacing: 3 });

    this.footerText = this.add.text(W / 2, 612, '', { fontSize: '13px', fill: '#888888', align: 'center', wordWrap: { width: W - 40 } }).setOrigin(0.5);

    this.typed = '';
    this.hint = '';
    this.cursorOn = true;
    this.time.addEvent({ delay: 400, loop: true, callback: () => { this.cursorOn = !this.cursorOn; this.drawInput(); } });
    this.input.keyboard.on('keydown', e => this.onKey(e));
    this.startTurn();
  }

  drawStatus() {
    const list = this.players.map(p => p.alive ? `${p.name} ${'❤'.repeat(p.hearts)}` : `${p.name} 💀`).join('     ');
    this.statusText.setText(`Round ${this.round}     ${list}`);
  }

  drawPanel() {
    const p = this.current;
    const loc = LOCATIONS[p.at];
    const counts = {};
    p.items.forEach(k => { counts[k] = (counts[k] || 0) + 1; });
    const items = Object.keys(counts).map(k => '  • ' + ITEMS[k].short + (counts[k] > 1 ? ` x${counts[k]}` : ''));
    const survivor = survivorHere(p);

    const lines = [
      `📍 ${loc.name.toUpperCase()}`,
      '',
      'PLACES NEARBY:',
      ...loc.neighbors.map(n => '  → ' + LOCATIONS[n].name),
      '',
      `${p.name.toUpperCase()}'S BACKPACK:`,
      ...(items.length ? items : ['  (empty)']),
      '',
      'TEAM:',
      ...(p.team.length ? p.team.map(k => '  • ' + SURVIVORS[k].name) : ['  just you'])
    ];
    if (survivor) lines.push('', `SURVIVOR HERE: ${SURVIVORS[survivor].name}`, '  (talk to them!)');
    lines.push('', (p.found[p.at] || 0) < loc.items.length ? '🔎 There is still stuff to find here!' : '🔎 Nothing left to find here.');
    this.panelText.setText(lines.join('\n'));
  }

  startTurn() {
    this.phase = 'typing';
    this.typed = '';
    this.hint = '';
    const p = this.current = this.players[this.turn];
    const loc = LOCATIONS[p.at];

    const idx = p.eventIdx[p.at] || 0;
    this.event = loc.events[idx % loc.events.length];
    p.eventIdx[p.at] = idx + 1;

    const parts = [];
    if (this.round === 1 && p.justArrived) parts.push(PROLOGUE);
    if (p.justArrived) parts.push(loc.intro);
    p.justArrived = false;
    parts.push(this.event.text);

    const survivor = survivorHere(p);
    if (survivor && !p.met.includes(survivor)) {
      p.met.push(survivor);
      parts.push(`${SURVIVORS[survivor].intro} (Try typing something like "ask ${SURVIVORS[survivor].name} to join".)`);
    }

    this.headerText.setText(`${p.name}'s turn`).setColor('#ff5555');
    this.recapText.setText(p.recap ? `Last time: ${p.recap}` : `Pass the keyboard to ${p.name}!`);
    this.storyText.setText(parts.join('\n\n')).setColor('#ffffff');
    this.inputText.setColor('#88ff88');
    this.footerText.setText(`${IDEAS}\nPress ENTER when you're done typing`);
    this.drawStatus();
    this.drawPanel();
    this.drawInput();
  }

  drawInput() {
    if (this.phase !== 'typing') return;
    this.inputText.setY(this.storyText.y + this.storyText.height + 22);
    this.inputText.setText('What do you do?\n> ' + this.typed + (this.cursorOn ? '_' : ''));
    this.hintText.setY(this.inputText.y + this.inputText.height + 10);
    this.hintText.setText(this.hint);
  }

  onKey(e) {
    if (e.repeat) return;
    if (this.phase === 'typing') {
      if (e.key === 'Backspace') this.typed = this.typed.slice(0, -1);
      else if (e.key === 'Enter') { if (this.typed.trim()) return this.resolve(); }
      else if (e.key.length === 1 && this.typed.length < 140) this.typed += e.key;
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
    const loc = LOCATIONS[p.at];
    const parsed = parseAction(this.typed, p);
    if (parsed.hint) {
      this.hint = parsed.hint;
      this.typed = '';
      return this.drawInput();
    }

    const type = parsed.type;
    const style = type === 'travel' ? parsed.via : type;
    const keys = type === 'travel' ? ['travel', parsed.via] : [type];
    const boostOf = b => keys.reduce((sum, k) => sum + ((b || {})[k] || 0), 0);
    const helpers = [];
    let boost = 0;

    if (this.event.bonus.includes(style)) { boost += 20; helpers.push('a smart move for this situation'); }
    const bestItem = p.items.reduce((best, k) => boostOf(ITEMS[k].boost) > (best ? boostOf(ITEMS[best].boost) : 0) ? k : best, null);
    if (bestItem) { boost += boostOf(ITEMS[bestItem].boost); helpers.push(ITEMS[bestItem].short.toLowerCase()); }
    p.team.forEach(k => {
      const v = boostOf(SURVIVORS[k].boost);
      if (v) { boost += v; helpers.push(SURVIVORS[k].name); }
    });
    const armor = p.items.find(k => ITEMS[k].armor);
    if (armor) helpers.push(ITEMS[armor].short.toLowerCase());

    const repeated = !['travel', 'supplies', 'recruit'].includes(type) && p.last === type;
    p.last = type;
    let result = rollOutcome(ACTIONS[style].odds, boost, !!armor, this.round, repeated);

    const weapon = p.items.reduce((best, k) => ((ITEMS[k].boost || {}).fight || 0) > (best ? ITEMS[best].boost.fight : 0) ? k : best, null);
    const destName = parsed.dest ? LOCATIONS[parsed.dest].name : '';
    const fill = s => s.replaceAll('{name}', p.name).replaceAll('{place}', loc.name).replaceAll('{dest}', destName)
      .replaceAll('{weapon}', weapon ? 'the ' + ITEMS[weapon].short.toLowerCase() : 'nothing but bare fists');
    const pick = list => fill(Phaser.Utils.Array.GetRandom(list));
    let text;

    if (type === 'travel') {
      const driving = parsed.via === 'drive' && (p.items.includes('car_keys') || p.team.includes('tank'));
      text = pick(result === 'good' && driving ? TRAVEL_TEXT.drive : TRAVEL_TEXT[result]);
      if (result !== 'dead') { p.at = parsed.dest; p.justArrived = true; }
    } else if (type === 'recruit') {
      const s = SURVIVORS[parsed.survivor];
      if (result === 'dead') text = pick(ACTIONS.recruit.dead);
      else {
        text = result === 'hurt'
          ? `${s.name} jumps in surprise and accidentally bonks ${p.name}, thinking ${p.name} was a zombie! After a LOT of apologizing, ${s.name} agrees to join the team. ${s.join}`
          : s.join;
        p.team.push(parsed.survivor);
      }
    } else {
      text = pick(ACTIONS[type][result]);
    }

    if (type === 'supplies' && result !== 'dead') {
      const n = p.found[p.at] || 0;
      const key = loc.items[n];
      if (key) {
        p.found[p.at] = n + 1;
        p.items.push(key);
        text += ` ${result === 'hurt' ? 'But at least' : 'Awesome!'} ${p.name} found ${ITEMS[key].name}! ${ITEMS[key].desc}`;
      } else {
        text += ` But there is nothing useful left at ${loc.name}. Maybe try somewhere else.`;
      }
    }

    if (result === 'good') {
      if (type === 'heal') {
        const kit = p.items.indexOf('first_aid');
        if (p.hearts < 3) {
          const gain = Math.min(kit >= 0 ? 2 : 1, 3 - p.hearts);
          if (kit >= 0) { p.items.splice(kit, 1); text += ' The first aid kit was used up.'; }
          p.hearts += gain;
          text += `  (+${gain} ❤)`;
        } else {
          text += ` (${p.name} already has full hearts!)`;
        }
      } else if (type === 'help' && p.hearts < 3) {
        p.hearts++;
        text += '  (+1 ❤)';
      } else if (type === 'call') {
        const key = Phaser.Utils.Array.GetRandom(Object.keys(ITEMS));
        p.items.push(key);
        text += ` Inside the package is ${ITEMS[key].name}! ${ITEMS[key].desc}`;
      }
    }

    if (result === 'hurt') {
      p.hearts--;
      if (p.hearts <= 0) {
        result = 'dead';
        text += `\n\n${p.name} has no hearts left. That last bite was one too many...`;
      } else {
        text += '  (-1 ❤)';
      }
    }

    if (result === 'dead' && p.team.length && Math.random() < 0.5) {
      const friend = Phaser.Utils.Array.RemoveRandomElement(p.team);
      p.lost.push(friend);
      p.hearts = Math.max(p.hearts, 1);
      result = 'saved';
      text += '\n\n' + SACRIFICE_TEXT.replaceAll('{friend}', SURVIVORS[friend].name).replaceAll('{name}', p.name);
    }

    if (result === 'dead') {
      p.alive = false;
      p.diedRound = this.round;
      p.death = this.typed;
    }

    if (repeated) text = 'The zombies have seen that move before and they are starting to catch on...\n\n' + text;
    p.recap = text.replace(/^The zombies have seen.*\n\n/, '').split(/(?<=[.!?])\s/)[0];
    if (helpers.length && result !== 'dead') text += `\n\nHelped by: ${helpers.join(', ')}`;

    const look = {
      good: ['SAFE!', '#55ff55'],
      hurt: ['HURT!', '#ffcc33'],
      saved: ['SAVED BY A FRIEND!', '#ff9933'],
      dead: [`${p.name.toUpperCase()} IS DEAD!`, '#ff3333']
    }[result];

    this.phase = 'result';
    this.headerText.setText(look[0]).setColor(look[1]);
    this.recapText.setText('');
    this.storyText.setText(`${p.name}: "${this.typed}"`).setColor('#aaaaaa');
    this.inputText.setY(this.storyText.y + this.storyText.height + 22);
    this.inputText.setText(text).setColor(look[1]);
    this.hintText.setText('');
    this.footerText.setText('Press ENTER to continue');
    this.drawStatus();
    this.drawPanel();
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
    if (this.players.length === 1) {
      const p = this.players[0];
      this.headerText.setText(`${p.name} survived ${p.diedRound - 1} rounds!`).setColor('#ffcc33');
    } else {
      this.headerText.setText(`${winner.name} is the last survivor!`).setColor('#55ff55');
    }

    const shorten = s => s.length > 50 ? s.slice(0, 50) + '...' : s;
    const lines = [];
    if (winner) {
      lines.push(`🏆 ${winner.name} made it with ${winner.hearts} ❤, ${winner.items.length} items, and ${winner.team.length ? 'a team of ' + winner.team.map(k => SURVIVORS[k].name).join(', ') : 'no team'}.`, '');
    }
    this.players
      .filter(p => !p.alive)
      .sort((a, b) => b.diedRound - a.diedRound)
      .forEach(p => lines.push(`💀 ${p.name}: died in round ${p.diedRound} at ${LOCATIONS[p.at].name}, after "${shorten(p.death)}"`));

    this.recapText.setText('');
    this.storyText.setText(lines.join('\n')).setColor('#ffffff');
    this.inputText.setText('');
    this.hintText.setText('');
    this.panelText.setText('GAME OVER\n\nThanks for playing\nUNDEAD INC!');
    this.footerText.setText('ENTER = play again with the same cousins     ESC = main menu');
    this.drawStatus();
  }
}
