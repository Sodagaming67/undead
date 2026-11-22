const MAX_FREE = 2;
const HEARTBREAK = 3;
const PLAYER_COLORS = ['#ff6b6b', '#4dabf7', '#69db7c', '#ffd43b', '#da77f2', '#ffa94d', '#3bc9db', '#f783ac'];
const HIT_CHANCE = { follow: 0.35, protect: 0.7, fight: 0.5, hide: 0 };
const SAVE_CHANCE = { follow: 0.5, protect: 0.75, fight: 0.5, hide: 0 };
const HISTORY_KEY = 'undeadIncHistory';
const ADMIN_CODE = 'zombie king 67';
const ZOMBIE_START = { house: 6, school: 25, park: 15, gas: 10, mall: 40, sports: 20, police: 15, hospital: 35, woods: 8, tower: 5 };
const ROAD_ZOMBIES = 12;
const FOREST_ZOMBIES = 50;
const OVERRUN_DANGER = 45;
const STORY_VIEW = { top: 76, bottom: 664 };
const PANEL_VIEW = { top: 80, bottom: 676 };
const normalZombies = k => ZOMBIE_START[k] ?? (LOCATIONS[k].isForest ? FOREST_ZOMBIES : ROAD_ZOMBIES);

class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  init(data) {
    this.players = data.names.map((name, i) => ({
      name, color: PLAYER_COLORS[i % PLAYER_COLORS.length], hearts: 3, alive: true, last: null,
      at: 'house', spot: null, spotFresh: false, justArrived: true,
      items: [], vehicles: [], found: {}, team: [], teamHearts: {}, orders: {}, lost: [], met: [], eventIdx: {},
      streetSearched: [], stay: 0, prevTurnAt: null, turns: 0, freeUsed: 0,
      stats: { fightsWon: 0, timesHurt: 0, miles: 0, visited: ['house'], itemsFound: 0, vehiclesFound: 0, recruited: 0, friendsLost: 0, freeActions: 0 },
      recap: '', diedRound: 0, death: ''
    }));
    this.round = 1;
    this.turn = 0;
    this.players.forEach((p, i) => {
      Object.assign(p, { escapeItems: [], traps: [], bunkerProgress: 0, bunkerBuilt: false, bunkerTurns: 0, inBunker: false });
      p.skill = (data.skills || [])[i] || null;
      p.bosses = {};
      for (const k in BOSSES) p.bosses[k] = BOSSES[k].hp;
      if (p.skill) p.items = SKILLS[p.skill].kit.slice();
    });
    const forests = Phaser.Utils.Array.Shuffle(Object.keys(LOCATIONS).filter(k => LOCATIONS[k].isForest));
    this.escapes = { heli: forests[0], subway: forests[1] };
    this.escapeAt = {};
    this.escapedWinner = null;
    this.placeEscapeItems();
    this.zombies = {};
    for (const k in LOCATIONS) this.zombies[k] = normalZombies(k);
    this.overrunAt = null;
    this.placeOverrun();
  }

  placeOverrun() {
    this.overrunAt = Phaser.Utils.Array.GetRandom(TOWN.filter(k => k !== this.overrunAt && !(this.round === 1 && k === 'house')));
  }

  zombieDanger(k) {
    const n = this.zombies[k];
    if (n === 0) return -200;
    if (k === this.overrunAt) return OVERRUN_DANGER;
    return Phaser.Math.Clamp(Math.round((n / normalZombies(k) - 1) * 20), -40, 60);
  }

  zombieLine(k) {
    const n = this.zombies[k], r = n / normalZombies(k);
    if (n === 0) return 'There is not a single zombie in sight. It is eerily quiet.';
    if (k === this.overrunAt) return `☠☠ ${LOCATIONS[k].name.toUpperCase()} IS OVERRUN THIS ROUND! Zombies are pouring out of every door and window. Every move here is EXTREMELY dangerous. Get out as fast as you can!`;
    if (r < 0.5) return 'There are only a few zombies around here right now.';
    if (r >= 4) return `⚠⚠ This place is OVERRUN. There must be ${n} zombies here, way more than anywhere else in town!`;
    if (r >= 2) return `⚠ There are way more zombies here than usual, about ${n} of them.`;
    return '';
  }

  create() {
    const W = this.scale.width;
    this.bannerText = this.add.text(W / 2, 8, '', { fontSize: '30px', fontStyle: 'bold', stroke: '#000000', strokeThickness: 5 }).setOrigin(0.5, 0);
    this.statusText = this.add.text(20, 50, '', { fontSize: '15px', fill: '#cccccc', wordWrap: { width: W - 40 } });
    this.headerText = this.add.text(30, 82, '', { fontSize: '26px', fill: '#ff5555', fontStyle: 'bold' });
    this.recapText = this.add.text(30, 118, '', { fontSize: '14px', fill: '#888888', fontStyle: 'italic', wordWrap: { width: 660 } });
    this.storyText = this.add.text(30, 146, '', { fontSize: '16px', fill: '#ffffff', wordWrap: { width: 660 }, lineSpacing: 5 });
    this.inputText = this.add.text(30, 400, '', { fontSize: '18px', fill: '#88ff88', wordWrap: { width: 660 }, lineSpacing: 5 });
    this.hintText = this.add.text(30, 500, '', { fontSize: '15px', fill: '#ffaa44', wordWrap: { width: 660 } });

    this.add.rectangle(715, 78, 390, 600, 0x1c2a1c).setOrigin(0).setStrokeStyle(2, 0x3a5a3a);
    this.panelText = this.add.text(728, 88, '', { fontSize: '13px', fill: '#dddddd', wordWrap: { width: 366 }, lineSpacing: 2 });

    this.footerText = this.add.text(W / 2, 710, '', { fontSize: '13px', fill: '#888888', align: 'center', wordWrap: { width: W - 40 } }).setOrigin(0.5);

    this.storyBox = this.add.container(0, 0, [this.headerText, this.recapText, this.storyText, this.inputText, this.hintText]);
    this.storyBox.setMask(this.make.graphics().fillRect(0, STORY_VIEW.top, 712, STORY_VIEW.bottom - STORY_VIEW.top).createGeometryMask());
    this.panelText.setMask(this.make.graphics().fillRect(715, PANEL_VIEW.top, 390, PANEL_VIEW.bottom - PANEL_VIEW.top).createGeometryMask());
    this.storyScroll = 0;
    this.panelScroll = 0;
    this.storyBar = this.add.rectangle(705, STORY_VIEW.top, 4, 10, 0x88ff88, 0.6).setOrigin(0.5, 0);
    this.panelBar = this.add.rectangle(1098, PANEL_VIEW.top, 4, 10, 0x88ff88, 0.6).setOrigin(0.5, 0);
    this.storyMore = this.add.text(698, STORY_VIEW.bottom - 18, '▼ more: scroll or press ↓', { fontSize: '12px', fill: '#88ff88', backgroundColor: '#101810', padding: { x: 6, y: 1 } }).setOrigin(1, 0);
    this.panelMore = this.add.text(910, PANEL_VIEW.bottom - 18, '▼ scroll for more', { fontSize: '12px', fill: '#88ff88', backgroundColor: '#1c2a1c', padding: { x: 6, y: 1 } }).setOrigin(0.5, 0);
    this.input.on('wheel', (pointer, objects, dx, dy) => {
      if (this.adminPanel.isOpen) return;
      this.scrollBy(pointer.worldX > 712 ? 'panel' : 'story', dy * 0.5);
    });

    this.typed = '';
    this.hint = '';
    this.cursorOn = true;
    this.time.addEvent({ delay: 400, loop: true, callback: () => { this.cursorOn = !this.cursorOn; this.drawInput(); } });
    this.input.keyboard.on('keydown', e => this.onKey(e));
    this.adminPanel = new AdminPanel(this);
    this.startTurn();
  }

  drawBanner(text, color) {
    this.bannerText.setText(text).setColor(color);
  }

  drawStatus() {
    const list = this.players.map(p => !p.alive ? `${p.name} 💀` : p.sitOut ? `${p.name} (watching)` : `${p.name} ${'❤'.repeat(p.hearts)}`).join('     ');
    this.statusText.setText(`Round ${this.round}     ${list}`);
  }

  fastestVehicle(p) {
    return p.vehicles.slice().sort((a, b) => VEHICLES[a].factor - VEHICLES[b].factor)[0] || null;
  }

  itemsLeft(p, loc, spot) {
    return LOCATIONS[loc].spots[spot].items.length - (p.found[`${loc}.${spot}`] || 0);
  }

  campDanger(p) {
    if (LOCATIONS[p.at].isForest) return 35 + p.stay * 25;
    if (LOCATIONS[p.at].isRoad) return p.stay >= 1 ? 30 + (p.stay - 1) * 20 : 5;
    return Math.max(0, p.stay - 1) * 6;
  }

  drawPanel() {
    const p = this.current;
    const loc = LOCATIONS[p.at];
    const lines = loc.isForest
      ? [`🌲 IN ${loc.name.toUpperCase()}`, '     deep in the woods, off the road', '     ⚠⚠ EXTREMELY DANGEROUS: GET OUT FAST!']
      : loc.isRoad
      ? [`🛣 ON ${loc.name.toUpperCase()}`, `     between ${LOCATIONS[loc.ends[0]].name} and ${LOCATIONS[loc.ends[1]].name}`]
      : [`📍 ${loc.name.toUpperCase()}`, p.spot ? `     inside: ${loc.spots[p.spot].name}` : '     outside, on the street'];
    if (loc.isRoad) lines.push(p.stay >= 1 ? '     ⚠⚠ ZOMBIES ON THE ROAD: EXTREME DANGER, LEAVE NOW!' : '     ⚠ zombies coming: leave the road next turn!');
    else if (p.stay >= 2) lines.push(`     ⚠ zombies gathering (here ${p.stay + 1} turns in a row)`);
    if (loc.isForest) lines.push(`     ways out: ${loc.roads.map(r => LOCATIONS[r].name).filter((n, i, a) => a.indexOf(n) === i).join(', ')}`);
    if (loc.isRoad) {
      const woods = Object.keys(LOCATIONS).filter(k => LOCATIONS[k].isForest && LOCATIONS[k].roads.includes(p.at)).map(k => LOCATIONS[k].name);
      if (woods.length) lines.push(`     🌲 woods beside the road: ${woods.join(', ')} (⚠ deadly)`);
    }
    const boss = this.bossHere(p);
    if (boss) lines.push(`     🧟 ${BOSSES[boss].name} is here! ${this.hpBar(p, boss)}`);
    if (p.at === this.overrunAt) lines.push('     ☠☠ OVERRUN THIS ROUND: EXTREME DANGER, LEAVE!');
    if (p.at === 'house') {
      const bunker = p.inBunker ? `INSIDE ${this.bunkerBar(p)}` : p.bunkerBuilt ? `ready ${this.bunkerBar(p)}` : `${p.bunkerProgress}/${bunkerBuildTurns(p)} built`;
      lines.push(`     🪤 traps: ${p.traps.length ? p.traps.map(t => `${TRAPS[t.kind].name} ${t.chance}%`).join(', ') : 'none'}`, `     🛡 bunker: ${bunker}`);
    }
    lines.push('', `ESCAPE:  🚁 ${LOCATIONS[this.escapes.heli].name}   🚇 ${LOCATIONS[this.escapes.subway].name}`,
      '  need: ' + Object.keys(ESCAPE_ITEMS).map(k => `${ESCAPE_ITEMS[k].icon}${p.escapeItems.includes(k) ? '✓' : ' at ' + LOCATIONS[this.escapeAt[k]].name}`).join('  '),
      '  (escape items move every round)');
    lines.push('', loc.isForest ? 'IN THESE WOODS  (🔎 = stuff to find):' : loc.isRoad ? 'ON THIS ROAD  (🔎 = stuff to find):' : 'STORES & ROOMS HERE  (🔎 = stuff to find):');
    for (const k in loc.spots) {
      lines.push(`  ${k === p.spot ? '▶' : '•'} ${loc.spots[k].name}${this.itemsLeft(p, p.at, k) > 0 ? '  🔎' : ''}`);
    }

    const fast = this.fastestVehicle(p);
    const factor = fast ? VEHICLES[fast].factor : 1;
    const { dist } = routeFrom(p.at);
    lines.push('', `ROADS TO OTHER PLACES  (risk ${fast ? 'by ' + VEHICLES[fast].name.toLowerCase() : 'on foot'}):`);
    TOWN.filter(k => k !== p.at).sort((a, b) => dist[a] - dist[b]).forEach(k => {
      const miles = Math.round(dist[k] * 10) / 10;
      const here = Object.keys(ESCAPE_ITEMS).filter(i => this.escapeAt[i] === k && !p.escapeItems.includes(i)).map(i => ' ' + ESCAPE_ITEMS[i].icon).join('');
      const risk = k === this.overrunAt ? '☠ OVERRUN, EXTREME risk' : riskLabel(miles * factor);
      lines.push(`  ${LOCATIONS[k].name}${here}: ${miles} mi, ${risk}${k === p.cameFrom ? ' + zombies on your trail' : ''}`);
    });

    lines.push('', 'VEHICLES:');
    if (p.vehicles.length) p.vehicles.forEach(v => lines.push(`  ${VEHICLES[v].icon} ${VEHICLES[v].name}: ${VEHICLES[v].how}`));
    else lines.push('  none yet (find them on roads or get one from a survivor)');

    const counts = {};
    p.items.forEach(k => { counts[k] = (counts[k] || 0) + 1; });
    const items = Object.keys(counts).map(k => ITEMS[k].short + (counts[k] > 1 ? ` x${counts[k]}` : ''));
    if (SKILLS[p.skill]) lines.push('', `SKILL: ${SKILLS[p.skill].icon} ${SKILLS[p.skill].name}`);
    lines.push('', 'BACKPACK: ' + (items.length ? items.join(', ') : '(empty)'));

    lines.push('', 'TEAM ORDERS  (type "team protect/fight/hide/follow"):');
    if (p.team.length) p.team.forEach(k => lines.push(`  ${SURVIVORS[k].name} ${'❤'.repeat(p.teamHearts[k])}: ${ORDER_INFO[p.orders[k] || 'follow'].label}`));
    else lines.push('  no team yet');

    const survivor = survivorHere(p);
    if (p.stats.friendsLost) {
      lines.push(`  friends lost: ${'💔'.repeat(p.stats.friendsLost)}`);
    }
    if (survivor) lines.push('', `SURVIVOR HERE: ${SURVIVORS[survivor].name} (talk to them!)`);
    this.panelText.setText(lines.join('\n'));
    this.scrollBy('panel', 0);
  }

  startTurn() {
    const p = this.current = this.players[this.turn];
    p.freeUsed = 0;
    p.stay = p.prevTurnAt === p.at ? p.stay + 1 : 0;
    p.prevTurnAt = p.at;
    this.prepareStory(p);
    this.showTurn();
  }

  prepareStory(p) {
    const loc = LOCATIONS[p.at];
    const idx = p.eventIdx[p.at] || 0;
    const beaten = Object.keys(BOSSES).filter(k => BOSSES[k].at === p.at && p.bosses[k] <= 0).map(k => BOSSES[k].tag);
    const events = loc.events.filter(e => !beaten.some(tag => e.text.includes(tag)));
    this.event = (events.length ? events : loc.events)[idx % (events.length || loc.events.length)];
    p.eventIdx[p.at] = idx + 1;

    const parts = [];
    if (p.inBunker) {
      this.turnStory = p.bunkerTurns > 0
        ? `🛡 ${p.name} is sealed inside the bunker. Outside, the zombies are scratching and pounding on the walls.\n\nBunker strength: ${this.bunkerBar(p)} (${p.bunkerTurns} more turn${p.bunkerTurns === 1 ? '' : 's'} before it breaks). Type "wait" to stay safe inside, or "leave the bunker" to climb out.`
        : `⚠⚠ The bunker is about to BREAK! The walls are split and gray hands are reaching through the cracks. Type "leave the bunker" to get out now, or stay and face the zombies when they break in!`;
      return;
    }
    if (!p.sawPrologue) parts.push(PROLOGUE);
    p.sawPrologue = true;
    if (p.justArrived) parts.push(loc.intro);
    if (p.spot && p.spotFresh) parts.push(`You are inside ${spotLabel(loc.spots[p.spot].name)}. ${loc.spots[p.spot].desc}`);
    p.justArrived = false;
    p.spotFresh = false;
    if (loc.isForest) parts.push(p.stay >= 1
      ? `⚠⚠ ${p.name} is STILL in ${loc.name}. More and more zombies are closing in through the trees. Every turn in here is worse than the last!`
      : `⚠⚠ Zombies are everywhere in these woods. Staying in ${loc.name} is EXTREMELY dangerous, and every turn here makes it worse.`);
    else if (loc.isRoad && p.stay >= 1) parts.push(`⚠⚠ THE ZOMBIES HAVE REACHED ${loc.name.toUpperCase()}! They are pouring onto the road from both directions. Staying out here is EXTREMELY dangerous. Get off the road now!`);
    else if (loc.isRoad) parts.push(`⚠ Zombies from both sides are already heading for ${loc.name}. ${p.name} can stay out here for this turn, but if ${p.name} is still on the road next turn, it will be EXTREMELY dangerous.`);
    else if (p.stay >= 2) parts.push(`⚠ More and more zombies are gathering around ${loc.name}. The longer ${p.name} stays here, the more dangerous it gets.`);
    parts.push(this.event.text);

    const survivor = survivorHere(p);
    if (survivor && !p.met.includes(survivor)) {
      p.met.push(survivor);
      const first = SURVIVORS[survivor].aliases[0];
      parts.push(`${SURVIVORS[survivor].intro} (Try typing something like "ask ${first[0].toUpperCase() + first.slice(1)} to join". Talking is a small action, so it won't use up your turn.)`);
    }
    this.turnStory = parts.join('\n\n');
  }

  pullOver(p, road) {
    p.cameFrom = p.at;
    p.at = road;
    p.spot = null;
    p.justArrived = true;
    p.spotFresh = false;
    const r = LOCATIONS[road];
    return `${p.name} is now out on ${r.name}, between ${LOCATIONS[r.ends[0]].name} and ${LOCATIONS[r.ends[1]].name}.`;
  }

  showTurn() {
    const p = this.current;
    this.phase = 'typing';
    this.storyScroll = 0;
    this.panelScroll = 0;
    this.typed = '';
    this.hint = '';
    this.drawBanner(`🎮 ${p.name.toUpperCase()}'S TURN 🎮`, p.color);
    this.headerText.setText(p.freeUsed ? `Still ${p.name}'s turn` : `What will ${p.name} do?`).setColor(p.color);
    this.recapText.setText(p.recap ? `Last time: ${p.recap}` : `Pass the keyboard to ${p.name}!`);
    this.storyText.setY(this.recapText.y + this.recapText.height + 10);
    const extra = [this.zombieLine(p.at)];
    if (p.overrunSeen !== this.round && p.at !== this.overrunAt) {
      p.overrunSeen = this.round;
      extra.unshift(`☠ ROUND ${this.round}: ${LOCATIONS[this.overrunAt].name} has been OVERRUN by zombies! Stay away from it this round.`);
    }
    const boss = !p.inBunker && this.bossHere(p);
    if (boss) {
      const b = BOSSES[boss];
      extra.push(`🧟 ${b.name.toUpperCase()} IS HERE! (health ${this.hpBar(p, boss)}) ${b.warn} You don't have to fight it: you can hide, sneak, or leave. Or type "${b.fight}" to take it on. Beating it earns a reward!`);
    }
    const esc = this.escapeHere(p);
    if (esc) {
      const missing = this.missingItems(p);
      extra.push(`${ESCAPES[esc].icon} ${ESCAPES[esc].seen} ` + (missing.length
        ? `It won't start without all 3 escape items. Still needed: ${missing.map(k => ESCAPE_ITEMS[k].icon + ' ' + ESCAPE_ITEMS[k].name).join(', ')}.`
        : `${p.name} has all 3 escape items! Type something like "${esc === 'heli' ? 'fly the helicopter' : 'take the subway'}" to ESCAPE!`));
    }
    const item = this.escapeItemAt(p.at);
    if (item && !p.escapeItems.includes(item)) extra.push(`📦 The ${ESCAPE_ITEMS[item].icon} ${ESCAPE_ITEMS[item].name} is somewhere at ${LOCATIONS[p.at].name} this round! Search to find it.`);
    this.storyText.setText([this.turnStory, ...extra.filter(Boolean)].join('\n\n')).setColor('#ffffff');
    this.inputText.setColor('#88ff88');
    const homeTips = p.at === 'house' && !p.inBunker ? '\nAt your house you can also: "set a trap" · "build a bunker"' + (p.bunkerBuilt ? ' · "go into the bunker"' : '') : '';
    const ride = homeTips + (p.vehicles.length ? `\nYou have: ${p.vehicles.map(v => VEHICLES[v].icon + ' ' + VEHICLES[v].name).join(', ')}. You can use it to travel anywhere!` : '');
    const free = `\nSmall actions (talking to people, team orders, searching the street for a vehicle) are free: ${MAX_FREE - p.freeUsed} left this turn.`;
    this.footerText.setText(`${IDEAS}${ride}${free}\nPress ENTER when you're done typing`);
    this.drawStatus();
    this.drawPanel();
    this.drawInput();
  }

  drawInput() {
    if (this.phase !== 'typing') return this.scrollBy('story', 0);
    this.inputText.setY(this.storyText.y + this.storyText.height + 22);
    this.inputText.setText(`What does ${this.current.name} do?\n> ` + this.typed + (this.cursorOn ? (this.admin ? '▮' : '_') : ''));
    this.hintText.setY(this.inputText.y + this.inputText.height + 10);
    this.hintText.setText(this.hint);
    this.scrollBy('story', 0);
  }

  storyBottom() {
    return Math.max(...[this.storyText, this.inputText, this.hintText].filter(t => t.text).map(t => t.y + t.height), this.headerText.y + this.headerText.height) + 12;
  }

  scrollBy(which, amount) {
    const story = which === 'story';
    const view = story ? STORY_VIEW : PANEL_VIEW;
    const height = view.bottom - view.top;
    const total = story ? this.storyBottom() - view.top : this.panelText.height + 16;
    const max = Math.max(0, total - height);
    const pos = Phaser.Math.Clamp((story ? this.storyScroll : this.panelScroll) + amount, 0, max);
    const bar = story ? this.storyBar : this.panelBar;
    if (story) {
      this.storyScroll = pos;
      this.storyBox.y = -pos;
    } else {
      this.panelScroll = pos;
      this.panelText.y = 88 - pos;
    }
    bar.setVisible(max > 0);
    if (max > 0) {
      bar.height = Math.max(20, height * height / total);
      bar.y = view.top + (height - bar.height) * (pos / max);
    }
    (story ? this.storyMore : this.panelMore).setVisible(max > 0 && pos < max - 2);
  }

  resetScroll() {
    this.storyScroll = 0;
    this.scrollBy('story', 0);
  }

  onKey(e) {
    if (this.adminPanel.isOpen) return;
    const scroll = { ArrowUp: -40, ArrowDown: 40, PageUp: -300, PageDown: 300 }[e.key];
    if (scroll) return this.scrollBy('story', scroll);
    if (e.repeat) return;
    if (this.phase === 'typing' && e.key.length === 1) this.storyScroll = 1e6;
    if (this.phase === 'typing') {
      if (e.key === 'Backspace') this.typed = this.typed.slice(0, -1);
      else if (e.key === 'Enter') { if (this.typed.trim()) return this.resolve(); }
      else if (e.key.length === 1 && this.typed.length < 140) this.typed += e.key;
      this.drawInput();
    } else if (this.phase === 'free' && e.key === 'Enter') {
      this.showTurn();
    } else if (this.phase === 'result' && e.key === 'Enter') {
      this.nextTurn();
    } else if (this.phase === 'over') {
      if (e.key === 's' || e.key === 'S') this.downloadSpreadsheet();
      else if (e.key === 'Enter') this.scene.restart({ names: this.players.map(p => p.name), skills: this.players.map(p => p.skill) });
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
    p.stats.itemsFound++;
    return item;
  }

  giveVehicle(p, pool) {
    const options = pool.filter(v => !p.vehicles.includes(v));
    if (!options.length) return null;
    const v = Phaser.Utils.Array.GetRandom(options);
    p.vehicles.push(v);
    p.stats.vehiclesFound++;
    return v;
  }

  loseFriend(p, friend) {
    p.team.splice(p.team.indexOf(friend), 1);
    p.lost.push(friend);
    p.stats.friendsLost++;
  }

  pickTeammate(p, chances) {
    const candidates = Phaser.Utils.Array.Shuffle(p.team.slice());
    return candidates.find(k => Math.random() < chances[p.orders[k] || 'follow']) || null;
  }

  showResult(text, look, free) {
    const p = this.current;
    this.phase = free ? 'free' : 'result';
    this.storyScroll = 0;
    this.headerText.setText(look[0]).setColor(look[1]);
    this.recapText.setText('');
    this.storyText.setY(146);
    this.storyText.setText(`${p.name}: "${this.typed}"`).setColor('#aaaaaa');
    this.inputText.setY(this.storyText.y + this.storyText.height + 22);
    this.inputText.setText(text).setColor(look[1]);
    this.hintText.setText('');
    this.footerText.setText(free
      ? `That was a small action, so ${p.name}'s turn isn't over! (${MAX_FREE - p.freeUsed} small actions left)\nPress ENTER to keep going`
      : 'Press ENTER to continue');
    this.drawStatus();
    this.drawPanel();
    this.resetScroll();
  }

  giveOrder(parsed) {
    const p = this.current;
    parsed.who.forEach(k => { p.orders[k] = parsed.order; });
    p.freeUsed++;
    p.stats.freeActions++;
    const names = parsed.who.map(k => SURVIVORS[k].name).join(' and ');
    const replies = { protect: '"Got it. I\'m right beside you."', fight: '"Let\'s do this."', hide: '"Okay. I\'ll keep my head down."', follow: '"Right behind you."' };
    const text = `${names} ${parsed.who.length > 1 ? 'nod' : 'nods'}. ${replies[parsed.order]}\n\nNew order: ${ORDER_INFO[parsed.order].label}. ${ORDER_INFO[parsed.order].desc[0].toUpperCase() + ORDER_INFO[parsed.order].desc.slice(1)}.`;
    this.showResult(text, ['ORDERS GIVEN', '#66ccff'], true);
  }

  adminDo(cmd, t, arg) {
    switch (cmd) {
      case 'heal': t.hearts = 3; return `Healed ${t.name} to full hearts`;
      case 'healAll': this.players.filter(o => o.alive).forEach(o => { o.hearts = 3; }); return 'Everyone is at full hearts';
      case 'hurt': t.hearts = Math.max(1, t.hearts - 1); return `${t.name} lost a heart`;
      case 'kill':
        t.alive = false; t.hearts = 0; t.diedRound = this.round; t.death = 'struck down by a mysterious force';
        if (t === this.current) this.nextTurn();
        else this.checkGameEnd();
        return `💀 ${t.name} was struck down by a mysterious force`;
      case 'revive':
        t.alive = true; t.hearts = 3; t.heartbroken = false; t.death = '';
        return `${t.name} is back from the dead`;
      case 'god': t.god = !t.god; t.curse = false; return `God mode ${t.god ? 'on' : 'off'} for ${t.name}`;
      case 'curse': t.curse = true; t.god = false; return `${t.name}'s next real move will go badly`;
      case 'giveEscape':
        if (arg === 'all') t.escapeItems = Object.keys(ESCAPE_ITEMS);
        else if (!t.escapeItems.includes(arg)) t.escapeItems.push(arg);
        return `Gave ${t.name} ${arg === 'all' ? 'all 3 escape items' : 'the ' + ESCAPE_ITEMS[arg].name}`;
      case 'takeEscape': t.escapeItems = []; return `Took away ${t.name}'s escape items`;
      case 'moveItems': this.placeEscapeItems(); return 'Escape items moved to new places';
      case 'overrun':
        this.overrunAt = arg;
        return `☠ ${LOCATIONS[arg].name} is now the overrun area`;
      case 'moveEscapes': {
        const forests = Phaser.Utils.Array.Shuffle(Object.keys(LOCATIONS).filter(k => LOCATIONS[k].isForest));
        this.escapes = { heli: forests[0], subway: forests[1] };
        return `🚁 Helicopter: ${LOCATIONS[forests[0]].name}, 🚇 Subway: ${LOCATIONS[forests[1]].name}`;
      }
      case 'give':
        if (arg === 'all') Object.keys(ITEMS).forEach(k => t.items.push(k));
        else t.items.push(arg);
        return `Gave ${t.name} ${arg === 'all' ? 'every item' : ITEMS[arg].name}`;
      case 'vehicle':
        t.vehicles = arg === 'all' ? Object.keys(VEHICLES) : [...new Set([...t.vehicles, arg])];
        return `Gave ${t.name} ${arg === 'all' ? 'every vehicle' : 'a ' + VEHICLES[arg].name.toLowerCase()}`;
      case 'teleport':
        if (!arg) return '';
        Object.assign(t, { at: arg, spot: null, justArrived: true, spotFresh: false, stay: 0, prevTurnAt: arg, cameFrom: null, inBunker: false });
        if (!t.stats.visited.includes(arg)) t.stats.visited.push(arg);
        if (t === this.current) this.prepareStory(t);
        return `${t.name} teleported to ${LOCATIONS[arg].name}`;
      case 'recruit':
        if (!arg) return '';
        t.team.push(arg); t.teamHearts[arg] = 2; t.stats.recruited++;
        if (!t.met.includes(arg)) t.met.push(arg);
        return `${SURVIVORS[arg].name} joined ${t.name}'s team`;
      case 'skip': this.nextTurn(); return `Skipped ${t.name}'s turn`;
      case 'nextUp':
        this.nextUp = this.nextUp === t ? null : t;
        return this.nextUp ? `${t.name} will go next` : 'Back to the normal turn order';
      case 'playNow':
        this.turn = this.players.indexOf(t);
        if (this.nextUp === t) this.nextUp = null;
        this.startTurn();
        return `It's ${t.name}'s turn now`;
      case 'sitOut':
        t.sitOut = !t.sitOut;
        if (this.nextUp === t) this.nextUp = null;
        if (t.sitOut && t === this.current) this.nextTurn();
        else if (!t.sitOut) this.checkGameEnd();
        return t.sitOut ? `${t.name} is sitting out and won't get turns` : `${t.name} is back in the game`;
      case 'round':
        if (Math.max(1, arg) !== this.round) this.placeEscapeItems();
        this.round = Math.max(1, arg);
        return `Now on round ${this.round} (escape items moved)`;
      case 'win': this.gameOver(t); return '';
      case 'zombies':
        this.zombies[t] = Phaser.Math.Clamp(Math.round(arg), 0, 999);
        return `${LOCATIONS[t].name}: ${this.zombies[t]} zombies`;
      case 'allZombies':
        for (const k in this.zombies) this.zombies[k] = Math.round(normalZombies(k) * arg);
        return arg === 0 ? 'Every zombie in town is gone' : `Zombies everywhere set to ${Math.round(arg * 100)}% of normal`;
    }
  }

  refreshAfterAdmin() {
    if (this.phase === 'typing') this.showTurn();
    else if (this.phase !== 'over') { this.drawStatus(); this.drawPanel(); }
  }

  resolve() {
    if (this.typed.trim().toLowerCase().replace(/\s+/g, ' ') === ADMIN_CODE) {
      this.admin = true;
      this.typed = '';
      this.drawInput();
      return this.adminPanel.open();
    }
    if (this.tryEscape()) return;
    const p = this.current;
    const loc = LOCATIONS[p.at];
    const startAt = p.at;
    const said =' ' + this.typed.toLowerCase().replace(/[^a-z0-9 ]/g, ' ') + ' ';
    const other = this.players.find(o => o !== p && o.name.trim().length > 1 && said.includes(' ' + o.name.toLowerCase().trim() + ' '));
    const parsed = parseSurvival(this.typed, p) || (other
      ? { hint: `${other.name} is off in their own story somewhere else in town. ${p.name} can't reach them, so make a move for ${p.name}!` }
      : parseAction(this.typed, p));
    if (parsed.hint) {
      this.hint = parsed.hint;
      this.typed = '';
      return this.drawInput();
    }

    const type = parsed.type;
    const free = type === 'order' || type === 'recruit' || (type === 'supplies' && parsed.street) || (parsed.survival === 'trap' && p.skill === 'trapper');
    if (free && p.freeUsed >= MAX_FREE) {
      this.hint = `${p.name} already used both small actions this turn. Time to make a real move!`;
      this.typed = '';
      return this.drawInput();
    }
    if (type === 'order') return this.giveOrder(parsed);
    const warnKey = `${this.round}:${parsed.dest}`;
    if (type === 'travel' && parsed.dest === this.overrunAt && this.zombies[parsed.dest] > 0 && p.overrunOk !== warnKey) {
      p.overrunOk = warnKey;
      this.hint = `☠☠ WARNING! ${LOCATIONS[parsed.dest].name} is OVERRUN with zombies this round! Going there now is EXTREMELY dangerous. If ${p.name} really wants to go, type it again and press ENTER.`;
      this.typed = '';
      return this.drawInput();
    }

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
    const skill = SKILLS[p.skill];
    if (skill && boostOf(skill.boost)) { boost += boostOf(skill.boost); helpers.push(`${skill.icon} ${skill.name} skill`); }
    if (type === 'travel' && parsed.vehicle) { boost += VEHICLES[parsed.vehicle].boost; helpers.push(VEHICLES[parsed.vehicle].name.toLowerCase()); }
    p.team.forEach(k => {
      const order = p.orders[k] || 'follow';
      let v = boostOf(SURVIVORS[k].boost);
      if (order === 'hide') v = 0;
      if (order === 'protect') v = Math.floor(v / 2);
      if (order === 'fight' && style === 'fight') v += 15;
      if (v) { boost += v; helpers.push(SURVIVORS[k].name); }
    });
    const armor = p.items.find(k => ITEMS[k].armor);
    if (armor) helpers.push(ITEMS[armor].short.toLowerCase());

    const backtrack = type === 'travel' && parsed.dest === p.cameFrom;
    const route = parsed.forest ? { miles: 0.2, roads: [], path: [p.at, parsed.dest] } : type === 'travel' ? routeTo(p.at, parsed.dest) : null;
    const miles = route ? route.miles * (parsed.vehicle ? VEHICLES[parsed.vehicle].factor : 1) * (p.skill === 'runner' ? 0.75 : 1) : 0;

    const repeated = !free && !parsed.survival && !(type === 'fight' && this.bossHere(p)) && !['travel', 'supplies', 'enter'].includes(type) && p.last === type;
    const bunkerBreaks = parsed.survival === 'bunkerWait' && p.bunkerTurns <= 0;
    if (['bunkerEnter', 'bunkerLeave', 'bunkerWait'].includes(parsed.survival)) helpers.length = 0;
    if (!free) p.last = type;
    const baseOdds = type === 'enter' ? (parsed.crash ? ACTIONS.drive.odds : [65, 25, 10]) : ACTIONS[style].odds;
    const zombieDanger = this.zombieDanger(type === 'travel' ? parsed.dest : p.at);
    if (zombieDanger < 0) boost -= zombieDanger;
    let result = rollOutcome(baseOdds, boost, !!armor, this.round, repeated, miles, this.campDanger(p) + (backtrack ? 12 : 0) + Math.max(0, zombieDanger) + (parsed.forest && LOCATIONS[parsed.dest].isForest ? 25 : 0) + (bunkerBreaks ? 40 : 0) + (type === 'travel' && startAt === this.overrunAt && this.zombies[startAt] > 0 ? 20 : 0));
    if (p.god || (type !== 'travel' && this.zombies[p.at] === 0)) result = 'good';
    else if (p.curse && !free) { result = p.hearts > 1 ? 'hurt' : 'dead'; p.curse = false; }
    if (['bunkerEnter', 'bunkerLeave'].includes(parsed.survival) || (parsed.survival === 'bunkerWait' && !bunkerBreaks)) result = 'good';

    let trapNote = '';
    if (p.at === 'house' && p.traps.length && type !== 'travel' && !p.inBunker && !bunkerBreaks && (result === 'hurt' || result === 'dead')) {
      const trap = this.springTrap(p, 'The zombies');
      if (trap.worked) result = 'good';
      trapNote = trap.note;
    }

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
      if (parsed.forest) text = pick(FOREST_TEXT[LOCATIONS[parsed.dest].isForest ? 'enter' : 'exit'][result]);
      else if (parsed.crash) text = pick(result === 'dead' ? TRAVEL_TEXT.crashDead : TRAVEL_TEXT.crash);
      else text = pick(result === 'good' ? (parsed.vehicle ? TRAVEL_TEXT[parsed.vehicle] : TRAVEL_TEXT.good) : TRAVEL_TEXT[result]);
      if (parsed.crash && result === 'hurt') text += ` ${p.name} got banged up in the crash.`;
      if (backtrack) text = `The zombies that followed ${p.name} here are still on the trail back to ${destLoc.name}. ` + text;
      const fromRoad = loc.isRoad ? 1 : 0;
      const nextRoad = route && route.path.length > fromRoad + 1 ? roadKey(route.path[fromRoad], route.path[fromRoad + 1]) : null;
      const found = result === 'good' && nextRoad && !parsed.crash && !parsed.forest && !loc.isForest && parsed.vehicle !== 'car' && Math.random() < 0.2 ? this.giveVehicle(p, Object.keys(VEHICLES)) : null;
      if (found) {
        const road = nextRoad;
        const r = LOCATIONS[road];
        text = `${p.name} sets off toward ${destLoc.name}. ${fromRoad ? `${p.name} makes it past ${LOCATIONS[route.path[1]].name}, and partway` : 'Partway'} down ${r.name}, ${p.name} spots ${VEHICLES[found].found}. ${p.name} takes it and pulls over to check it out! (You now have a ${VEHICLES[found].name.toLowerCase()}: ${VEHICLES[found].how}.) `;
        p.stats.miles = Math.round((p.stats.miles + r.miles / 2 + (fromRoad ? loc.miles / 2 : 0)) * 10) / 10;
        text += this.pullOver(p, road);
      } else if (result !== 'dead') {
        p.cameFrom = p.at;
        p.at = parsed.dest;
        p.spot = parsed.spot;
        p.justArrived = true;
        p.spotFresh = !!parsed.spot;
        p.stats.miles = Math.round((p.stats.miles + route.miles) * 10) / 10;
        if (!p.stats.visited.includes(parsed.dest)) p.stats.visited.push(parsed.dest);
        if (parsed.crash) {
          p.vehicles.splice(p.vehicles.indexOf('car'), 1);
          text += ' (The car is wrecked. You will need to find another one.)';
        }
      }
    } else if (type === 'enter') {
      if (parsed.spot === null) {
        text = pick(result === 'good' ? ENTER_TEXT.outside : result === 'hurt' ? ENTER_TEXT.outsideHurt : ENTER_TEXT.outsideDead);
        if (result !== 'dead') p.spot = null;
      } else {
        const container = /locker|cabinet|cupboard/i.test(loc.spots[parsed.spot].name) && p.at !== 'school';
        text = pick(parsed.crash ? (result === 'dead' ? ENTER_TEXT.crashDead : ENTER_TEXT.crash) : result === 'dead' && container ? ENTER_TEXT.deadOnWay : ENTER_TEXT[result]);
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
        p.orders[parsed.survivor] = 'follow';
        p.stats.recruited++;
        text += ` (Give orders any time: "${s.aliases[0]} protect me", "team fight", "everyone hide".)`;
        const gift = SURVIVOR_GIFTS[parsed.survivor];
        if (gift && !p.vehicles.includes(gift[0])) {
          p.vehicles.push(gift[0]);
          p.stats.vehiclesFound++;
          text += ' ' + gift[1];
        }
      }
    } else if (type === 'supplies' && parsed.street) {
      p.streetSearched.push(p.at);
      if (result === 'good' && Math.random() < 0.4) {
        const v = this.giveVehicle(p, Object.keys(VEHICLES));
        text = v
          ? `${p.name} checks the cars and driveways up and down the street and finds ${VEHICLES[v].found}! (You now have a ${VEHICLES[v].name.toLowerCase()}: ${VEHICLES[v].how}.)`
          : `${p.name} already has every kind of vehicle there is!`;
        if (v) text += ` ${p.name} parks it right outside ${loc.name}, ready to go.`;
      } else {
        text = result === 'good' ? fill(STREET_SEARCH_FAIL) : pick(ACTIONS.supplies[result]);
      }
    } else if (parsed.survival) {
      text = this.survivalText(p, parsed, result, pick);
    } else {
      text = pick(ACTIONS[type][result]);
      if ((type === 'hide' || type === 'supplies') && result !== 'good') {
        if (p.at === 'school' && /\blockers?\b/.test(said)) {
          text = pick(SCHOOL_LOCKER_TEXT[result]);
        } else if (/\b(cabinet|cupboard|locker)s?\b/.test(said)) {
          const safe = ACTIONS[type][result].filter(s => !ZOMBIE_INSIDE.test(s));
          if (safe.length) text = pick(safe);
        }
      }
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

    if (result === 'good') {
      if (type === 'fight') p.stats.fightsWon++;
      text = this.applyRewards(p, type, text);
    }

    const boss = this.bossHere(p, startAt);
    if (boss && !free && !p.inBunker && !bunkerBreaks && result !== 'dead') {
      const turn = this.bossTurn(p, boss, { type, result, fill, pick });
      text += '\n\n' + turn.text;
      if (turn.bite) {
        if (result === 'good') result = 'hurt';
        else if (--p.hearts <= 0) { result = 'dead'; text += `  ${p.name} has no hearts left...`; }
        else text += '  (-1 ❤)';
      }
    }

    if (result === 'hurt') {
      const friend = this.pickTeammate(p, HIT_CHANCE);
      if (friend) {
        p.teamHearts[friend]--;
        text += `\n\n${SURVIVORS[friend].name} takes the hit instead of ${p.name}! (${SURVIVORS[friend].name} -1 ❤)`;
        if (p.teamHearts[friend] <= 0) {
          text += '\n\n' + SURVIVORS[friend].death + ' 💔';
          this.loseFriend(p, friend);
        }
      } else {
        p.hearts--;
        p.stats.timesHurt++;
        if (p.hearts <= 0) {
          result = 'dead';
          text += `\n\n${p.name} has no hearts left. That last bite was one too many...`;
        } else {
          text += '  (-1 ❤)';
        }
      }
    }

    if (result === 'dead') {
      const friend = this.pickTeammate(p, SAVE_CHANCE);
      if (friend) {
        this.loseFriend(p, friend);
        p.hearts = Math.max(p.hearts, 1);
        result = 'saved';
        text += '\n\nBut at the last second, someone steps in. ' + SURVIVORS[friend].death + ' 💔';
      }
    }

    if (result !== 'dead' && p.stats.friendsLost >= HEARTBREAK) {
      result = 'dead';
      p.heartbroken = true;
      text += `\n\n💔 That was the third friend ${p.name} has lost. ${p.name} can't stop thinking about all of them, and in that moment of grief ${p.name} doesn't notice the zombies closing in. ${p.name} dies of a broken heart.`;
    }

    if (result === 'dead') {
      p.alive = false;
      p.diedRound = this.round;
      p.death = this.typed;
    }

    if (repeated) text = 'The zombies have seen that move before and they are starting to catch on...\n\n' + text;
    if (!free) p.recap = text.replace(/^The zombies have seen.*\n\n/, '').split(/(?<=[.!?])\s/)[0];
    if (trapNote) text = trapNote + '\n\n' + text;
    const escapeItem = this.escapeItemAt(p.at);
    if (type === 'supplies' && result !== 'dead' && escapeItem) {
      const e = ESCAPE_ITEMS[escapeItem];
      if (p.escapeItems.includes(escapeItem)) {
        text += `\n\n(${p.name} sees another ${e.icon} ${e.name} here, but already has one. You can only carry one of each escape item.)`;
      } else {
        p.escapeItems.push(escapeItem);
        text += `\n\n📦 ${p.name} also found ${e.found}! ${e.icon} ${e.name} added. (Escape items: ${p.escapeItems.length}/3)`;
        if (!this.missingItems(p).length) text += ` ${p.name} has everything needed to escape! Get to the 🚁 helicopter in ${LOCATIONS[this.escapes.heli].name} or the 🚇 subway in ${LOCATIONS[this.escapes.subway].name}!`;
      }
    }
    if (helpers.length && result !== 'dead') text += `\n\nHelped by: ${helpers.join(', ')}`;

    const look = {
      good: ['SAFE!', '#55ff55'],
      hurt: ['HURT!', '#ffcc33'],
      saved: ['SAVED BY A FRIEND!', '#ff9933'],
      dead: [p.heartbroken ? `${p.name.toUpperCase()} DIED OF HEARTBREAK 💔` : `${p.name.toUpperCase()} IS DEAD!`, '#ff3333']
    }[result];

    const stillGoing = free && result !== 'dead';
    if (free) { p.freeUsed++; p.stats.freeActions++; }
    else p.turns++;
    if (free && result === 'dead') p.turns++;
    this.showResult(text, look, stillGoing);
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
        const medic = p.skill === 'medic' ? 1 : 0;
        const gain = Math.min((healer ? ITEMS[healer].heals : 1) + medic, 3 - p.hearts);
        if (medic) text += ' 🩺 Medic skill: +1 extra heart.';
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
      p.stats.itemsFound++;
      text += ` Inside the package is ${ITEMS[key].name}! ${ITEMS[key].desc}`;
    }
    return text;
  }

  springTrap(p, who) {
    const trap = p.traps.shift();
    const T = TRAPS[trap.kind];
    const left = `${p.traps.length} trap${p.traps.length === 1 ? '' : 's'} left`;
    const worked = Math.random() * 100 < trap.chance;
    const note = worked
      ? `🪤 TRAP WORKED! ${who} came for ${p.name}, but ran right into the ${T.name}. ${T.works}\n(The ${T.name} had a ${trap.chance}% chance and it WORKED. It is used up now: ${left}.)`
      : `🪤 TRAP FAILED! ${who} ran into the ${T.name}, but... ${T.fails}\n(The ${T.name} had a ${trap.chance}% chance and it FAILED. It is used up now: ${left}.)`;
    return { worked, note };
  }

  bossHere(p, place = p.at) {
    const k = bossAt(place);
    return k && p.bosses[k] > 0 && this.zombies[place] > 0 ? k : null;
  }

  hpBar(p, k) { return '❤'.repeat(p.bosses[k]) + '🖤'.repeat(BOSSES[k].hp - p.bosses[k]); }

  bossTurn(p, k, ctx) {
    const b = BOSSES[k];
    const lines = [];
    if (ctx.type === 'fight' && ctx.result === 'good') {
      const fighter = p.skill === 'fighter';
      p.bosses[k] = Math.max(0, p.bosses[k] - (fighter ? 2 : 1));
      const power = fighter ? ' ⚔️ Fighter skill: DOUBLE DAMAGE (-2 ❤)!' : '';
      if (p.bosses[k] <= 0) {
        p.items.push(b.drop);
        p.stats.itemsFound++;
        p.stats.bossesBeaten = (p.stats.bossesBeaten || 0) + 1;
        return { text: `🏆 ${b.name.toUpperCase()} DEFEATED!${power} ${ctx.fill(b.defeat)} (Got ${ITEMS[b.drop].name}! ${ITEMS[b.drop].desc})`, bite: false };
      }
      return { text: `⚔️ ${ctx.pick(b.hits)}${power} ${b.name} is too staggered to hit back this turn! (${b.name} health: ${this.hpBar(p, k)})`, bite: false };
    }
    const leaving = ctx.type === 'travel';
    const chance = Math.round(b.attack * (p.stay === 0 || leaving ? 0.5 : 1) * (['hide', 'sneak'].includes(ctx.type) && ctx.result === 'good' ? 0.5 : 1));
    if (Math.random() * 100 >= chance) {
      lines.push(`🧟 ${b.name.toUpperCase()} ATTACKS${leaving ? ` as ${p.name} tries to leave` : ''}... and MISSES! ${ctx.pick(b.misses)} (${chance}% chance to hit)`);
      return { text: lines.join('\n\n'), bite: false };
    }
    lines.push(`🧟 ${b.name.toUpperCase()} ATTACKS${leaving ? ` as ${p.name} tries to leave` : ''}! ${ctx.pick(b.bites)}`);
    if (p.god) return { text: lines.join('\n\n') + ' (God mode: the bite does nothing.)', bite: false };
    if (k === 'henderson' && p.traps.length) {
      const trap = this.springTrap(p, 'Mr. Henderson');
      lines.push(trap.note);
      if (trap.worked) return { text: lines.join('\n\n'), bite: false };
    }
    return { text: lines.join('\n\n'), bite: true };
  }

  bunkerBar(p) { return '■'.repeat(p.bunkerTurns) + '□'.repeat(bunkerHoldTurns(p) - p.bunkerTurns); }

  survivalText(p, parsed, result, pick) {
    const n = p.name;
    if (result === 'dead' && parsed.survival !== 'bunkerWait') return pick(ACTIONS.barricade.dead);
    const ouch = result === 'hurt' ? `A zombie got into the house while ${n} was working and bit ${n}, but ${n} kept going. ` : '';
    switch (parsed.survival) {
      case 'trap': {
        const T = TRAPS[parsed.trap];
        const tools = p.items.find(k => ['duct_tape', 'rope', 'hammer_nails'].includes(k));
        const trapper = p.skill === 'trapper';
        const chance = Math.min(trapper ? 95 : 85, T.chance + (tools ? 10 : 0) + (trapper ? 20 : 0));
        p.traps.push({ kind: parsed.trap, chance });
        return `${ouch}🪤 TRAP SET: ${T.name.toUpperCase()}\n${n} ${T.build}.${tools ? ` The ${ITEMS[tools].short.toLowerCase()} makes it extra sturdy (+10%).` : ''}${trapper ? ` 🪤 Trapper skill: ${n} knows exactly where to put it (+20%), and it only took a minute (free small action)!` : ''}\n\n` +
          `HOW IT WORKS: The next time zombies would hurt or kill ${n} here at Your House, this trap goes off first. It has a ${chance}% chance to stop the attack completely. If it fails, the zombies get through like normal. Each trap works only once, whether it works or fails, and traps only protect ${n} while ${n} is at Your House. (Traps ready: ${p.traps.length}/${maxTraps(p)})`;
      }
      case 'bunkerBuild':
        p.bunkerProgress++;
        if (p.bunkerProgress < bunkerBuildTurns(p)) {
          return `${ouch}🛡 ${n} drags the old mattress, the metal shelves and the deep freezer down to the basement and starts building a bunker around the water heater. It is not done yet. (Bunker: ${p.bunkerProgress}/${bunkerBuildTurns(p)} built. Type "build the bunker" again to finish it.)`;
        }
        p.bunkerBuilt = true;
        p.bunkerTurns = bunkerHoldTurns(p);
        return `${ouch}🛡 BUNKER READY! ${n} bolts the last sheet of plywood over the metal shelves and stacks sandbags made of rice and dog food on top. It's small, it's ugly, and it's strong.\n\n` +
          `HOW IT WORKS: Type "go into the bunker" to seal yourself inside. While ${n} is inside, NOTHING can hurt ${n}, but all ${n} can do is wait or leave. The zombies will pound on it every turn, and it can only hold for ${bunkerHoldTurns(p)} turns. If ${n} is still inside after that, it breaks and the zombies pour in. That will be EXTREMELY dangerous. Type "leave the bunker" to get out first.`;
      case 'bunkerEnter':
        p.inBunker = true;
        p.spot = 'basement';
        return `🛡 ${n} climbs into the bunker and slams the hatch shut. It's dark and it smells like rice, but it's safe. For now.\n\nBunker strength: ${this.bunkerBar(p)} (${p.bunkerTurns} turns before it breaks). Next turn type "wait" to stay inside, or "leave the bunker".`;
      case 'bunkerLeave':
        p.inBunker = false;
        return `🛡 ${n} carefully opens the hatch and climbs out of the bunker into the basement. The house is quiet... for a moment. (The bunker is still there with ${p.bunkerTurns} turn${p.bunkerTurns === 1 ? '' : 's'} of strength left.)`;
      case 'bunkerWait':
        if (p.bunkerTurns > 0) {
          p.bunkerTurns--;
          const warn = p.bunkerTurns === 0
            ? `⚠⚠ The walls are bending and the plywood is splitting! The bunker WILL BREAK next turn. Type "leave the bunker" NOW, or face the zombies when they break in!`
            : `The bunker can hold for ${p.bunkerTurns} more turn${p.bunkerTurns === 1 ? '' : 's'}.`;
          return `🛡 THUD. THUD. THUD. The zombies pound on the bunker walls all turn, but ${n} stays safe inside.${/\b(wait|stay|rest|sleep|hide|chill)\b/.test(this.typed.toLowerCase()) ? '' : ` (Inside the bunker, ${n} can only wait or leave.)`}\n\nBunker strength: ${this.bunkerBar(p)}. ${warn}`;
        }
        p.inBunker = false;
        p.bunkerBuilt = false;
        p.bunkerProgress = 0;
        p.spot = 'basement';
        return `💥 CRASH! The bunker finally gives way. The plywood splits, the shelves topple, and zombies pour in from every side!\n\n` + ({
          good: `${n} dives through a gap in the zombies and scrambles up the basement stairs. ALIVE! But the bunker is destroyed.`,
          hurt: `${n} fights through the pile of zombies, getting bitten on the way, and staggers up the basement stairs. The bunker is destroyed.`,
          dead: `There are too many of them. ${n} never makes it out of the basement.`
        })[result];
    }
  }

  placeEscapeItems() {
    const used = [];
    for (const k in ESCAPE_ITEMS) {
      this.escapeAt[k] = Phaser.Utils.Array.GetRandom(TOWN.filter(t => !used.includes(t) && t !== this.escapeAt[k]));
      used.push(this.escapeAt[k]);
    }
  }

  newRound() {
    this.round++;
    this.placeEscapeItems();
    this.placeOverrun();
  }

  escapeHere(p) { return Object.keys(ESCAPES).find(e => this.escapes[e] === p.at) || null; }

  escapeItemAt(place) { return Object.keys(ESCAPE_ITEMS).find(k => this.escapeAt[k] === place) || null; }

  missingItems(p) { return Object.keys(ESCAPE_ITEMS).filter(k => !p.escapeItems.includes(k)); }

  tryEscape() {
    const p = this.current;
    const t = ' ' + this.typed.toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
    const here = this.escapeHere(p);
    const named = Object.keys(ESCAPES).find(e => ESCAPES[e].words.some(w => t.includes(' ' + w + ' ')));
    const justEscape = t.includes(' escape ') && t.trim().split(' ').length <= 3;
    if (!named && !(here && justEscape)) return false;
    if (!here && / (call|radio|phone|signal|wave|flag|shout|yell|scream|hear|listen) /.test(t)) return false;

    const which = named || here;
    const e = ESCAPES[which];
    const hint = msg => {
      this.hint = msg;
      this.typed = '';
      this.drawInput();
      return true;
    };
    if (this.escapes[which] !== p.at) {
      return hint(`The ${e.icon} ${e.name} is hidden deep in ${LOCATIONS[this.escapes[which]].name}. ${p.name} has to get there first: run into those woods from a road next to them.`);
    }
    const missing = this.missingItems(p);
    if (missing.length) {
      const list = missing.map(k => `${ESCAPE_ITEMS[k].icon} ${ESCAPE_ITEMS[k].name} (this round at ${LOCATIONS[this.escapeAt[k]].name})`).join(', ');
      return hint(`${p.name} found the ${e.icon} ${e.name}, but it won't start yet! Still needed: ${list}. Escape items move to new places every round.`);
    }
    p.escaped = which;
    p.turns++;
    p.recap = `${p.name} escaped by ${e.name.toLowerCase()}!`;
    this.escapedWinner = p;
    this.showResult(`${e.win.replaceAll('{name}', p.name)}\n\n${e.icon} ${p.name.toUpperCase()} ESCAPED! ${e.icon}`, ['ESCAPED!', '#66ffcc'], false);
    this.footerText.setText(`${p.name} wins the game! Press ENTER to see the results`);
    return true;
  }

  canPlay(p) { return p.alive && !p.sitOut; }

  checkGameEnd() {
    const playing = this.players.filter(p => !p.sitOut);
    const alive = playing.filter(p => p.alive);
    if (alive.length > 1 || (playing.length === 1 && alive.length === 1)) return false;
    this.gameOver(alive[0]);
    return true;
  }

  nextTurn() {
    if (this.escapedWinner) return this.gameOver(this.escapedWinner);
    if (this.checkGameEnd()) return;
    const chosen = this.nextUp && this.canPlay(this.nextUp) ? this.players.indexOf(this.nextUp) : -1;
    this.nextUp = null;
    if (chosen >= 0) {
      if (chosen <= this.turn) this.newRound();
      this.turn = chosen;
      return this.startTurn();
    }
    do {
      this.turn++;
      if (this.turn >= this.players.length) {
        this.turn = 0;
        this.newRound();
      }
    } while (!this.canPlay(this.players[this.turn]));
    this.startTurn();
  }

  score(p, winner) {
    const s = p.stats;
    return p.turns * 10 + s.visited.length * 4 + s.itemsFound * 3 + s.vehiclesFound * 5 + s.recruited * 5 + s.fightsWon * 2 + (p.alive ? p.hearts * 5 : 0) + (p === winner ? 50 : 0);
  }

  ranking(winner) {
    return this.players.slice().sort((a, b) =>
      (b === winner) - (a === winner) || (!!a.sitOut - !!b.sitOut) || (b.alive - a.alive) || (b.diedRound - a.diedRound) || (b.turns - a.turns) || (this.score(b, winner) - this.score(a, winner)));
  }

  gameOver(winner) {
    this.phase = 'over';
    this.winner = winner;
    this.drawBanner('🏁 GAME OVER 🏁', '#ffffff');
    if (winner && winner.escaped) {
      const e = ESCAPES[winner.escaped];
      this.headerText.setText(`${winner.name} ESCAPED by ${e.name.toLowerCase()}! ${e.icon}`).setColor('#66ffcc');
    } else if (this.players.length === 1) {
      const p = this.players[0];
      this.headerText.setText(`${p.name} survived ${p.turns - 1} turns!`).setColor('#ffcc33');
    } else {
      this.headerText.setText(winner ? `${winner.name} is the last survivor!` : 'Nobody survived!').setColor(winner ? '#55ff55' : '#ff5555');
    }

    const ranked = this.ranking(winner);
    const pad = (s, n) => String(s).slice(0, n).padEnd(n);
    const lines = [pad('#', 3) + pad('NAME', 12) + pad('TURNS', 7) + pad('RESULT', 14) + pad('ITEMS', 7) + pad('FRIENDS', 9) + pad('MILES', 7) + 'SCORE'];
    ranked.forEach((p, i) => {
      lines.push(pad(i + 1, 3) + pad(p.name, 12) + pad(p.turns, 7) + pad(p.escaped ? 'ESCAPED ' + ESCAPES[p.escaped].icon : p.sitOut && p.alive ? 'SAT OUT' : p.alive ? 'SURVIVED' : `died rnd ${p.diedRound}`, 14) +
        pad(p.stats.itemsFound, 7) + pad(p.stats.recruited, 9) + pad(p.stats.miles, 7) + this.score(p, winner));
    });
    lines.push('');
    ranked.filter(p => !p.alive).forEach(p => {
      const last = p.death.length > 45 ? p.death.slice(0, 45) + '...' : p.death;
      lines.push(p.heartbroken
        ? `💔 ${p.name} died of heartbreak at ${LOCATIONS[p.at].name} after losing ${HEARTBREAK} friends`
        : `💀 ${p.name} died at ${LOCATIONS[p.at].name} after "${last}"`);
    });
    lines.push('', 'Turns only count real moves. Small actions like talking or giving orders are not counted.');

    this.saveHistory(ranked, winner);
    this.recapText.setText('');
    this.storyText.setY(146);
    this.storyText.setText(lines.join('\n')).setColor('#ffffff');
    this.inputText.setText('');
    this.hintText.setText('');
    this.panelText.setText('GAME OVER\n\nThanks for playing UNDEAD INC!\n\nPress S to save a spreadsheet of everyone\'s stats (this game and every earlier game on this computer).\n\nIt goes to your Downloads folder as undead-inc-results.csv. Open it with Excel or Google Sheets.');
    this.footerText.setText('S = save spreadsheet     ENTER = play again with the same cousins     ESC = main menu');
    this.resetScroll();
    this.drawStatus();
  }

  statRows(ranked, winner) {
    const date = new Date().toLocaleString();
    return ranked.map((p, i) => [
      date, this.players.length, i + 1, p.name, p.escaped ? 'Escaped by ' + ESCAPES[p.escaped].name.toLowerCase() : p.sitOut && p.alive ? 'Sat out' : p.alive ? 'Survived' : p.heartbroken ? 'Died of heartbreak' : 'Died', p.alive ? '' : p.diedRound, p.turns, p.stats.freeActions,
      p.alive ? p.hearts : 0, p.stats.visited.length, p.stats.miles, p.stats.itemsFound, p.stats.vehiclesFound, p.stats.recruited,
      p.stats.friendsLost, p.stats.fightsWon, p.stats.timesHurt, p.alive ? '' : p.death, this.score(p, winner)
    ]);
  }

  loadHistory() {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  saveHistory(ranked, winner) {
    const history = this.loadHistory();
    const game = history.length ? Math.max(...history.map(r => r[0])) + 1 : 1;
    this.thisGame = this.statRows(ranked, winner).map(r => [game, ...r]);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.concat(this.thisGame)));
    } catch (e) {}
  }

  downloadSpreadsheet() {
    const header = ['Game #', 'Date', 'Players', 'Place', 'Name', 'Result', 'Round Died', 'Full Turns', 'Small Actions', 'Hearts Left', 'Places Visited', 'Miles Traveled', 'Items Found', 'Vehicles Found', 'Survivors Recruited', 'Survivors Lost', 'Fights Won', 'Times Hurt', 'Last Action', 'Score'];
    let rows = this.loadHistory();
    if (!rows.length) rows = this.thisGame;
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' }));
    link.download = 'undead-inc-results.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    this.footerText.setText('✅ Saved! Look in your Downloads folder for undead-inc-results.csv\nENTER = play again     ESC = main menu');
  }
}
