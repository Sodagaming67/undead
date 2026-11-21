class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  init(data) {
    this.players = data.names.map(name => ({
      name, hearts: 3, alive: true, last: null,
      at: 'house', spot: null, spotFresh: false, justArrived: true,
      items: [], vehicles: [], found: {}, team: [], teamHearts: {}, lost: [], met: [], eventIdx: {},
      recap: '', diedRound: 0, death: ''
    }));
    this.round = 1;
    this.turn = 0;
  }

  create() {
    const W = this.scale.width;
    this.statusText = this.add.text(20, 14, '', { fontSize: '16px', fill: '#cccccc', wordWrap: { width: W - 40 } });
    this.headerText = this.add.text(30, 58, '', { fontSize: '28px', fill: '#ff5555', fontStyle: 'bold' });
    this.recapText = this.add.text(30, 98, '', { fontSize: '14px', fill: '#888888', fontStyle: 'italic', wordWrap: { width: 660 } });
    this.storyText = this.add.text(30, 128, '', { fontSize: '16px', fill: '#ffffff', wordWrap: { width: 660 }, lineSpacing: 5 });
    this.inputText = this.add.text(30, 400, '', { fontSize: '18px', fill: '#88ff88', wordWrap: { width: 660 }, lineSpacing: 5 });
    this.hintText = this.add.text(30, 500, '', { fontSize: '15px', fill: '#ffaa44', wordWrap: { width: 660 } });

    this.add.rectangle(715, 50, 390, 600, 0x1c2a1c).setOrigin(0).setStrokeStyle(2, 0x3a5a3a);
    this.panelText = this.add.text(728, 60, '', { fontSize: '13px', fill: '#dddddd', wordWrap: { width: 366 }, lineSpacing: 2 });

    this.footerText = this.add.text(W / 2, 674, '', { fontSize: '13px', fill: '#888888', align: 'center', wordWrap: { width: W - 40 } }).setOrigin(0.5);

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

  fastestVehicle(p) {
    return p.vehicles.slice().sort((a, b) => VEHICLES[a].factor - VEHICLES[b].factor)[0] || null;
  }

  itemsLeft(p, loc, spot) {
    return LOCATIONS[loc].spots[spot].items.length - (p.found[`${loc}.${spot}`] || 0);
  }

  drawPanel() {
    const p = this.current;
    const loc = LOCATIONS[p.at];
    const lines = [`📍 ${loc.name.toUpperCase()}`, p.spot ? `     inside: ${loc.spots[p.spot].name}` : '     outside, on the street', '', 'STORES & ROOMS HERE  (🔎 = stuff to find):'];
    for (const k in loc.spots) {
      lines.push(`  ${k === p.spot ? '▶' : '•'} ${loc.spots[k].name}${this.itemsLeft(p, p.at, k) > 0 ? '  🔎' : ''}`);
    }

    const fast = this.fastestVehicle(p);
    const factor = fast ? VEHICLES[fast].factor : 1;
    const { dist } = routeFrom(p.at);
    lines.push('', `ROADS TO OTHER PLACES  (risk ${fast ? 'by ' + VEHICLES[fast].name.toLowerCase() : 'on foot'}):`);
    Object.keys(LOCATIONS).filter(k => k !== p.at).sort((a, b) => dist[a] - dist[b]).forEach(k => {
      const miles = Math.round(dist[k] * 10) / 10;
      lines.push(`  ${LOCATIONS[k].name}: ${miles} mi, ${riskLabel(miles * factor)}`);
    });

    lines.push('', 'VEHICLES:');
    if (p.vehicles.length) p.vehicles.forEach(v => lines.push(`  ${VEHICLES[v].icon} ${VEHICLES[v].name}: ${VEHICLES[v].how}`));
    else lines.push('  none yet (find them on roads or get one from a survivor)');

    const counts = {};
    p.items.forEach(k => { counts[k] = (counts[k] || 0) + 1; });
    const items = Object.keys(counts).map(k => ITEMS[k].short + (counts[k] > 1 ? ` x${counts[k]}` : ''));
    lines.push('', 'BACKPACK: ' + (items.length ? items.join(', ') : '(empty)'));
    lines.push('', 'TEAM: ' + (p.team.length ? p.team.map(k => `${SURVIVORS[k].name} ${'❤'.repeat(p.teamHearts[k])}`).join(', ') : 'just you'));

    const survivor = survivorHere(p);
    if (survivor) lines.push('', `SURVIVOR HERE: ${SURVIVORS[survivor].name} (talk to them!)`);
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
    if (p.spot && p.spotFresh) parts.push(`You are inside ${spotLabel(loc.spots[p.spot].name)}. ${loc.spots[p.spot].desc}`);
    p.justArrived = false;
    p.spotFresh = false;
    parts.push(this.event.text);

    const survivor = survivorHere(p);
    if (survivor && !p.met.includes(survivor)) {
      p.met.push(survivor);
      parts.push(`${SURVIVORS[survivor].intro} (Try typing something like "ask ${SURVIVORS[survivor].aliases[0][0].toUpperCase() + SURVIVORS[survivor].aliases[0].slice(1)} to join".)`);
    }

    this.headerText.setText(`${p.name}'s turn`).setColor('#ff5555');
    this.recapText.setText(p.recap ? `Last time: ${p.recap}` : `Pass the keyboard to ${p.name}!`);
    this.storyText.setText(parts.join('\n\n')).setColor('#ffffff');
    this.inputText.setColor('#88ff88');
    const ride = p.vehicles.length ? `\nYou have: ${p.vehicles.map(v => VEHICLES[v].icon + ' ' + VEHICLES[v].name).join(', ')}. You can use it to travel anywhere!` : '';
    this.footerText.setText(`${IDEAS}${ride}\nPress ENTER when you're done typing`);
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

  takeItem(p, loc, spot) {
    const key = `${loc}.${spot}`;
    const n = p.found[key] || 0;
    const item = LOCATIONS[loc].spots[spot].items[n];
    if (!item) return null;
    p.found[key] = n + 1;
    p.items.push(item);
    return item;
  }

  giveVehicle(p, pool) {
    const options = pool.filter(v => !p.vehicles.includes(v));
    if (!options.length) return null;
    const v = Phaser.Utils.Array.GetRandom(options);
    p.vehicles.push(v);
    return v;
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
    const style = type === 'travel' ? (parsed.vehicle === 'car' ? 'drive' : 'run') : type === 'enter' && parsed.crash ? 'drive' : type;
    const keys = type === 'travel' ? ['travel', style] : type === 'enter' ? [] : [type];
    const boostOf = b => keys.reduce((sum, k) => sum + ((b || {})[k] || 0), 0);
    const helpers = [];
    let boost = 0;

    if (type !== 'enter' && this.event.bonus.includes(style)) { boost += 20; helpers.push('a smart move for this situation'); }
    const actionSpot = type === 'travel' || type === 'enter' ? null : (parsed.spot || p.spot);
    if (actionSpot && loc.spots[actionSpot].good.includes(style)) { boost += 20; helpers.push(`${loc.spots[actionSpot].name} is a good spot for that`); }
    const bestItem = p.items.reduce((best, k) => boostOf(ITEMS[k].boost) > (best ? boostOf(ITEMS[best].boost) : 0) ? k : best, null);
    if (bestItem) { boost += boostOf(ITEMS[bestItem].boost); helpers.push(ITEMS[bestItem].short.toLowerCase()); }
    if (type === 'travel' && parsed.vehicle) { boost += VEHICLES[parsed.vehicle].boost; helpers.push(VEHICLES[parsed.vehicle].name.toLowerCase()); }
    p.team.forEach(k => {
      const v = boostOf(SURVIVORS[k].boost);
      if (v) { boost += v; helpers.push(SURVIVORS[k].name); }
    });
    const armor = p.items.find(k => ITEMS[k].armor);
    if (armor) helpers.push(ITEMS[armor].short.toLowerCase());

    const route = type === 'travel' ? routeTo(p.at, parsed.dest) : null;
    const miles = route ? route.miles * (parsed.vehicle ? VEHICLES[parsed.vehicle].factor : 1) : 0;

    const repeated = !['travel', 'supplies', 'recruit', 'enter'].includes(type) && p.last === type;
    p.last = type;
    const baseOdds = type === 'enter' ? (parsed.crash ? ACTIONS.drive.odds : [80, 15, 5]) : ACTIONS[style].odds;
    let result = rollOutcome(baseOdds, boost, !!armor, this.round, repeated, miles);
    if (type === 'enter' && parsed.spot === null) result = 'good';

    const weapon = p.items.reduce((best, k) => ((ITEMS[k].boost || {}).fight || 0) > (best ? ITEMS[best].boost.fight : 0) ? k : best, null);
    const destLoc = parsed.dest ? LOCATIONS[parsed.dest] : loc;
    const spotKey = type === 'supplies' && !parsed.street ? this.searchSpot(p, parsed) : parsed.spot;
    const spotName = spotKey ? spotLabel(destLoc.spots[spotKey].name) : '';
    const fill = s => s.replaceAll('{name}', p.name).replaceAll('{place}', spotName || loc.name).replaceAll('{dest}', destLoc.name)
      .replaceAll('{spot}', spotName).replaceAll('{route}', route ? route.roads.join(' and ') : '').replaceAll('{miles}', route ? route.miles : '')
      .replaceAll('{weapon}', weapon ? 'the ' + ITEMS[weapon].short.toLowerCase() : 'nothing but bare fists');
    const pick = list => fill(Phaser.Utils.Array.GetRandom(list));
    let text;

    if (type === 'travel') {
      if (parsed.crash) text = pick(result === 'dead' ? TRAVEL_TEXT.crashDead : TRAVEL_TEXT.crash);
      else text = pick(result === 'good' ? (parsed.vehicle ? TRAVEL_TEXT[parsed.vehicle] : TRAVEL_TEXT.good) : TRAVEL_TEXT[result]);
      if (parsed.crash && result === 'hurt') text += ` ${p.name} got banged up in the crash.`;
      if (result !== 'dead') {
        p.at = parsed.dest;
        p.spot = parsed.spot;
        p.justArrived = true;
        p.spotFresh = !!parsed.spot;
        if (parsed.crash) {
          p.vehicles.splice(p.vehicles.indexOf('car'), 1);
          text += ' (The car is wrecked. You will need to find another one.)';
        } else if (result === 'good' && Math.random() < 0.25) {
          const v = this.giveVehicle(p, Object.keys(VEHICLES));
          if (v) text += ` On the way, along ${route.roads[0]}, ${p.name} spots ${VEHICLES[v].found}. ${p.name} takes it! (You now have a ${VEHICLES[v].name.toLowerCase()}: ${VEHICLES[v].how}.)`;
        }
      }
    } else if (type === 'enter') {
      if (parsed.spot === null) {
        text = pick(ENTER_TEXT.outside);
        p.spot = null;
      } else {
        text = pick(parsed.crash ? (result === 'dead' ? ENTER_TEXT.crashDead : ENTER_TEXT.crash) : ENTER_TEXT[result]);
        if (result !== 'dead') {
          p.spot = parsed.spot;
          text += ' ' + loc.spots[parsed.spot].desc;
          if (parsed.crash) {
            p.vehicles.splice(p.vehicles.indexOf('car'), 1);
            text += ' (The car is wrecked.)';
          }
        }
      }
    } else if (type === 'recruit') {
      const s = SURVIVORS[parsed.survivor];
      if (result === 'dead') text = pick(ACTIONS.recruit.dead);
      else {
        text = result === 'hurt'
          ? `${s.name} spins around in panic and hits ${p.name} before realizing ${p.name} is not a zombie. After a lot of apologizing, they agree to come along. ${s.join}`
          : s.join;
        p.team.push(parsed.survivor);
        p.teamHearts[parsed.survivor] = 2;
        const gift = SURVIVOR_GIFTS[parsed.survivor];
        if (gift && !p.vehicles.includes(gift[0])) {
          p.vehicles.push(gift[0]);
          text += ' ' + gift[1];
        }
      }
    } else if (type === 'supplies' && parsed.street) {
      if (result === 'good' && Math.random() < 0.6) {
        const v = this.giveVehicle(p, Object.keys(VEHICLES));
        text = v
          ? `${p.name} checks the cars and driveways up and down the street and finds ${VEHICLES[v].found}! (You now have a ${VEHICLES[v].name.toLowerCase()}: ${VEHICLES[v].how}.)`
          : `${p.name} already has every kind of vehicle there is!`;
      } else {
        text = result === 'good' ? fill(STREET_SEARCH_FAIL) : pick(ACTIONS.supplies[result]);
      }
    } else {
      text = pick(ACTIONS[type][result]);
      if (spotKey && result !== 'dead' && spotKey !== p.spot) {
        text = `${p.name} heads into ${spotName}. ${text}`;
        p.spot = spotKey;
      }
    }

    if (type === 'supplies' && !parsed.street && result !== 'dead') {
      const item = this.takeItem(p, p.at, spotKey);
      if (item) {
        text += ` ${result === 'hurt' ? 'But at least' : 'Nice!'} ${p.name} found ${ITEMS[item].name}! ${ITEMS[item].desc}`;
      } else {
        const anyLeft = Object.keys(loc.spots).some(k => this.itemsLeft(p, p.at, k) > 0);
        text += ` But there is nothing useful left in ${spotName}.${anyLeft ? ' Other stores or rooms here still have stuff (look for 🔎 on the right).' : ' This whole place has been picked clean.'}`;
      }
    }

    if (result === 'good') text = this.applyRewards(p, type, text);

    if (result === 'hurt') {
      if (p.team.length && Math.random() < 0.35) {
        const friend = Phaser.Utils.Array.GetRandom(p.team);
        p.teamHearts[friend]--;
        text += `\n\n${SURVIVORS[friend].name} takes the hit instead of ${p.name}! (${SURVIVORS[friend].name} -1 ❤)`;
        if (p.teamHearts[friend] <= 0) {
          text += '\n\n' + SURVIVORS[friend].death + ' 💔';
          p.team.splice(p.team.indexOf(friend), 1);
          p.lost.push(friend);
        }
      } else {
        p.hearts--;
        if (p.hearts <= 0) {
          result = 'dead';
          text += `\n\n${p.name} has no hearts left. That last bite was one too many...`;
        } else {
          text += '  (-1 ❤)';
        }
      }
    }

    if (result === 'dead' && p.team.length && Math.random() < 0.5) {
      const friend = Phaser.Utils.Array.GetRandom(p.team);
      p.team.splice(p.team.indexOf(friend), 1);
      p.lost.push(friend);
      p.hearts = Math.max(p.hearts, 1);
      result = 'saved';
      text += '\n\nBut at the last second, someone steps in. ' + SURVIVORS[friend].death + ' 💔';
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

  searchSpot(p, parsed) {
    const spots = Object.keys(LOCATIONS[p.at].spots);
    let target = parsed.spot || p.spot;
    if (!target || (!parsed.spot && this.itemsLeft(p, p.at, target) <= 0)) {
      target = spots.find(k => this.itemsLeft(p, p.at, k) > 0) || target || spots[0];
    }
    return target;
  }

  applyRewards(p, type, text) {
    if (type === 'heal') {
      if (p.hearts < 3) {
        const healer = p.items.filter(k => ITEMS[k].heals).sort((a, b) => ITEMS[b].heals - ITEMS[a].heals)[0];
        const gain = Math.min(healer ? ITEMS[healer].heals : 1, 3 - p.hearts);
        if (healer) {
          p.items.splice(p.items.indexOf(healer), 1);
          text += ` (Used up ${ITEMS[healer].name}.)`;
        }
        p.hearts += gain;
        text += `  (+${gain} ❤)`;
      } else {
        text += ` (${p.name} already has full hearts!)`;
      }
      if (p.team.includes('priya')) {
        p.team.forEach(k => { p.teamHearts[k] = 2; });
        text += ' Dr. Shah patches up the whole team too.';
      }
    } else if (type === 'help' && p.hearts < 3) {
      p.hearts++;
      text += '  (+1 ❤)';
    } else if (type === 'call') {
      const key = Phaser.Utils.Array.GetRandom(Object.keys(ITEMS));
      p.items.push(key);
      text += ` Inside the package is ${ITEMS[key].name}! ${ITEMS[key].desc}`;
    }
    return text;
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
