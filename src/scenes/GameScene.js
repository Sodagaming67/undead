const MAX_FREE = 2;
const HEARTBREAK = 3;
const PLAYER_COLORS = ['#ff6b6b', '#4dabf7', '#69db7c', '#ffd43b', '#da77f2', '#ffa94d', '#3bc9db', '#f783ac'];
const HIT_CHANCE = { follow: 0.35, protect: 0.7, fight: 0.5, hide: 0 };
const SAVE_CHANCE = { follow: 0.5, protect: 0.75, fight: 0.5, hide: 0 };
const HISTORY_KEY = 'undeadIncHistory';
const ADMIN_CODE = 'zombie king 67';
const ADMIN_HELP = '👑 ADMIN: /heal /hurt /kill /revive /god /curse /give /vehicle /teleport /recruit /skip /round /win /items /places /off   (add a name, like "/heal ann". No name = whoever\'s turn it is)';

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

    this.typed = '';
    this.hint = '';
    this.cursorOn = true;
    this.time.addEvent({ delay: 400, loop: true, callback: () => { this.cursorOn = !this.cursorOn; this.drawInput(); } });
    this.input.keyboard.on('keydown', e => this.onKey(e));
    this.startTurn();
  }

  drawBanner(text, color) {
    this.bannerText.setText(text).setColor(color);
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

  campDanger(p) {
    if (LOCATIONS[p.at].isRoad) return p.stay >= 1 ? 30 + (p.stay - 1) * 20 : 5;
    return Math.max(0, p.stay - 1) * 6;
  }

  drawPanel() {
    const p = this.current;
    const loc = LOCATIONS[p.at];
    const lines = loc.isRoad
      ? [`🛣 ON ${loc.name.toUpperCase()}`, `     between ${LOCATIONS[loc.ends[0]].name} and ${LOCATIONS[loc.ends[1]].name}`]
      : [`📍 ${loc.name.toUpperCase()}`, p.spot ? `     inside: ${loc.spots[p.spot].name}` : '     outside, on the street'];
    if (loc.isRoad) lines.push(p.stay >= 1 ? '     ⚠⚠ ZOMBIES ON THE ROAD: EXTREME DANGER, LEAVE NOW!' : '     ⚠ zombies coming: leave the road next turn!');
    else if (p.stay >= 2) lines.push(`     ⚠ zombies gathering (here ${p.stay + 1} turns in a row)`);
    lines.push('', loc.isRoad ? 'ON THIS ROAD  (🔎 = stuff to find):' : 'STORES & ROOMS HERE  (🔎 = stuff to find):');
    for (const k in loc.spots) {
      lines.push(`  ${k === p.spot ? '▶' : '•'} ${loc.spots[k].name}${this.itemsLeft(p, p.at, k) > 0 ? '  🔎' : ''}`);
    }

    const fast = this.fastestVehicle(p);
    const factor = fast ? VEHICLES[fast].factor : 1;
    const { dist } = routeFrom(p.at);
    lines.push('', `ROADS TO OTHER PLACES  (risk ${fast ? 'by ' + VEHICLES[fast].name.toLowerCase() : 'on foot'}):`);
    TOWN.filter(k => k !== p.at).sort((a, b) => dist[a] - dist[b]).forEach(k => {
      const miles = Math.round(dist[k] * 10) / 10;
      lines.push(`  ${LOCATIONS[k].name}: ${miles} mi, ${riskLabel(miles * factor)}${k === p.cameFrom ? ' + zombies on your trail' : ''}`);
    });

    lines.push('', 'VEHICLES:');
    if (p.vehicles.length) p.vehicles.forEach(v => lines.push(`  ${VEHICLES[v].icon} ${VEHICLES[v].name}: ${VEHICLES[v].how}`));
    else lines.push('  none yet (find them on roads or get one from a survivor)');

    const counts = {};
    p.items.forEach(k => { counts[k] = (counts[k] || 0) + 1; });
    const items = Object.keys(counts).map(k => ITEMS[k].short + (counts[k] > 1 ? ` x${counts[k]}` : ''));
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
    this.event = loc.events[idx % loc.events.length];
    p.eventIdx[p.at] = idx + 1;

    const parts = [];
    if (!p.sawPrologue) parts.push(PROLOGUE);
    p.sawPrologue = true;
    if (p.justArrived) parts.push(loc.intro);
    if (p.spot && p.spotFresh) parts.push(`You are inside ${spotLabel(loc.spots[p.spot].name)}. ${loc.spots[p.spot].desc}`);
    p.justArrived = false;
    p.spotFresh = false;
    if (loc.isRoad && p.stay >= 1) parts.push(`⚠⚠ THE ZOMBIES HAVE REACHED ${loc.name.toUpperCase()}! They are pouring onto the road from both directions. Staying out here is EXTREMELY dangerous. Get off the road now!`);
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
    this.typed = '';
    this.hint = '';
    this.drawBanner(`🎮 ${p.name.toUpperCase()}'S TURN 🎮`, p.color);
    this.headerText.setText(p.freeUsed ? `Still ${p.name}'s turn` : `What will ${p.name} do?`).setColor(p.color);
    this.recapText.setText(p.recap ? `Last time: ${p.recap}` : `Pass the keyboard to ${p.name}!`);
    this.storyText.setY(this.recapText.y + this.recapText.height + 10);
    this.storyText.setText(this.turnStory).setColor('#ffffff');
    this.inputText.setColor('#88ff88');
    const ride = p.vehicles.length ? `\nYou have: ${p.vehicles.map(v => VEHICLES[v].icon + ' ' + VEHICLES[v].name).join(', ')}. You can use it to travel anywhere!` : '';
    const free = `\nSmall actions (talking to people, team orders, searching the street for a vehicle) are free: ${MAX_FREE - p.freeUsed} left this turn.`;
    this.footerText.setText(`${IDEAS}${ride}${free}\nPress ENTER when you're done typing`);
    this.drawStatus();
    this.drawPanel();
    this.drawInput();
  }

  drawInput() {
    if (this.phase !== 'typing') return;
    this.inputText.setY(this.storyText.y + this.storyText.height + 22);
    this.inputText.setText(`What does ${this.current.name} do?\n> ` + this.typed + (this.cursorOn ? (this.admin ? '▮' : '_') : ''));
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
    } else if (this.phase === 'free' && e.key === 'Enter') {
      this.showTurn();
    } else if (this.phase === 'result' && e.key === 'Enter') {
      this.nextTurn();
    } else if (this.phase === 'over') {
      if (e.key === 's' || e.key === 'S') this.downloadSpreadsheet();
      else if (e.key === 'Enter') this.scene.restart({ names: this.players.map(p => p.name) });
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

  adminCommand() {
    const raw = this.typed.trim().toLowerCase().replace(/\s+/g, ' ');
    if (raw === ADMIN_CODE) {
      this.admin = !this.admin;
      return this.admin ? ADMIN_HELP : 'Admin mode off.';
    }
    if (!this.admin || !raw.startsWith('/')) return null;

    const words = raw.slice(1).split(' ');
    const cmd = words.shift();
    let target = this.current;
    const named = words.length && this.players.find(o => o.name.toLowerCase().startsWith(words[0]));
    if (named) { target = named; words.shift(); }
    const rest = words.join(' ');
    const t = target;
    const findIn = (obj, label) => Object.keys(obj).find(k => k === rest.replace(/ /g, '_') || (obj[k][label] || '').toLowerCase().includes(rest));

    switch (cmd) {
      case 'off': this.admin = false; return 'Admin mode off.';
      case 'help': return ADMIN_HELP;
      case 'heal': t.hearts = 3; break;
      case 'hurt':
        if (t.hearts > 1) { t.hearts--; break; }
        return `${t.name} only has 1 heart. Use /kill if you really mean it.`;
      case 'kill':
        if (!t.alive) return `${t.name} is already dead.`;
        t.alive = false; t.hearts = 0; t.diedRound = this.round; t.death = 'struck down by a mysterious force';
        if (t === this.current) { this.nextTurn(); return `💀 ${t.name} was struck down by a mysterious force.`; }
        if (this.players.length > 1 && this.players.filter(o => o.alive).length <= 1) { this.gameOver(this.players.find(o => o.alive)); return ''; }
        break;
      case 'revive':
        if (t.alive) return `${t.name} is not dead.`;
        t.alive = true; t.hearts = 3; t.heartbroken = false; t.death = '';
        break;
      case 'god': t.god = !t.god; t.curse = false; return `${t.name} god mode ${t.god ? 'ON: every move works' : 'OFF'}.`;
      case 'curse': t.curse = true; t.god = false; return `${t.name} is cursed. Their next real move will go badly.`;
      case 'give': {
        const item = !rest || rest === 'all' ? null : findIn(ITEMS, 'name');
        if (rest === 'all') Object.keys(ITEMS).forEach(k => t.items.push(k));
        else if (item) t.items.push(item);
        else return `No item called "${rest}". Type /items to see them all.`;
        break;
      }
      case 'vehicle': {
        const v = !rest || rest === 'all' ? null : findIn(VEHICLES, 'name');
        if (rest === 'all') t.vehicles = Object.keys(VEHICLES);
        else if (v) { if (!t.vehicles.includes(v)) t.vehicles.push(v); }
        else return 'Vehicles: car, motorcycle, bike, skateboard, all';
        break;
      }
      case 'teleport': case 'tp': {
        const place = TOWN.find(k => k === rest || LOCATIONS[k].name.toLowerCase().includes(rest));
        if (!rest || !place) return `Places: ${TOWN.join(', ')}`;
        Object.assign(t, { at: place, spot: null, justArrived: true, spotFresh: false, stay: 0, prevTurnAt: place, cameFrom: null });
        if (!t.stats.visited.includes(place)) t.stats.visited.push(place);
        if (t === this.current) this.prepareStory(t);
        break;
      }
      case 'recruit': {
        const s = Object.keys(SURVIVORS).find(k => k === rest || SURVIVORS[k].name.toLowerCase().includes(rest));
        if (!rest || !s) return `Survivors: ${Object.keys(SURVIVORS).join(', ')}`;
        if (!t.team.includes(s)) { t.team.push(s); t.teamHearts[s] = 2; t.stats.recruited++; }
        if (!t.met.includes(s)) t.met.push(s);
        break;
      }
      case 'skip': this.nextTurn(); return `Skipped ${t.name}'s turn.`;
      case 'round': {
        const n = parseInt(rest, 10);
        if (!(n >= 1)) return 'Type a number, like /round 5';
        this.round = n;
        break;
      }
      case 'win': this.gameOver(t); return '';
      case 'items': return 'Items: ' + Object.keys(ITEMS).join(', ') + ', all';
      case 'places': return 'Places: ' + TOWN.join(', ');
      default: return `Unknown command "/${cmd}". ${ADMIN_HELP}`;
    }
    if (t === this.current) this.showTurn();
    return `✅ Done: ${this.typed.trim()}`;
  }

  resolve() {
    const adminReply = this.adminCommand();
    if (adminReply !== null) {
      if (this.phase !== 'typing') return;
      this.typed = '';
      this.hint = adminReply;
      return this.drawInput();
    }
    const p = this.current;
    const loc = LOCATIONS[p.at];
    const said = ' ' + this.typed.toLowerCase().replace(/[^a-z0-9 ]/g, ' ') + ' ';
    const other = this.players.find(o => o !== p && o.name.trim().length > 1 && said.includes(' ' + o.name.toLowerCase().trim() + ' '));
    const parsed = other
      ? { hint: `${other.name} is off in their own story somewhere else in town. ${p.name} can't reach them, so make a move for ${p.name}!` }
      : parseAction(this.typed, p);
    if (parsed.hint) {
      this.hint = parsed.hint;
      this.typed = '';
      return this.drawInput();
    }

    const type = parsed.type;
    const free = type === 'order' || type === 'recruit' || (type === 'supplies' && parsed.street);
    if (free && p.freeUsed >= MAX_FREE) {
      this.hint = `${p.name} already used both small actions this turn. Time to make a real move!`;
      this.typed = '';
      return this.drawInput();
    }
    if (type === 'order') return this.giveOrder(parsed);

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
    const route = type === 'travel' ? routeTo(p.at, parsed.dest) : null;
    const miles = route ? route.miles * (parsed.vehicle ? VEHICLES[parsed.vehicle].factor : 1) : 0;

    const repeated = !free && !['travel', 'supplies', 'enter'].includes(type) && p.last === type;
    if (!free) p.last = type;
    const baseOdds = type === 'enter' ? (parsed.crash ? ACTIONS.drive.odds : [65, 25, 10]) : ACTIONS[style].odds;
    let result = rollOutcome(baseOdds, boost, !!armor, this.round, repeated, miles, this.campDanger(p) + (backtrack ? 12 : 0));
    if (p.god) result = 'good';
    else if (p.curse && !free) { result = p.hearts > 1 ? 'hurt' : 'dead'; p.curse = false; }

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
      if (backtrack) text = `The zombies that followed ${p.name} here are still on the trail back to ${destLoc.name}. ` + text;
      const found = result === 'good' && !parsed.crash && parsed.vehicle !== 'car' && Math.random() < 0.2 ?this.giveVehicle(p, Object.keys(VEHICLES)) : null;
      if (found) {
        const road = LOCATIONS[p.at].isRoad ? p.at : roadKey(route.path[0], route.path[1]);
        const r = LOCATIONS[road];
        text = `${p.name} sets off toward ${destLoc.name}. Partway down ${r.name}, ${p.name} spots ${VEHICLES[found].found}. ${p.name} takes it and pulls over to check it out! (You now have a ${VEHICLES[found].name.toLowerCase()}: ${VEHICLES[found].how}.) `;
        p.stats.miles = Math.round((p.stats.miles + r.miles / 2) * 10) / 10;
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
        if (v && !LOCATIONS[p.at].isRoad) {
          const road = roadKey(p.at, Phaser.Utils.Array.GetRandom(LOCATIONS[p.at].neighbors));
          text += ` ${p.name} takes it out onto ${LOCATIONS[road].name} to try it out. ` + this.pullOver(p, road);
          this.prepareStory(p);
        }
      } else {
        text = result === 'good' ? fill(STREET_SEARCH_FAIL) : pick(ACTIONS.supplies[result]);
      }
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
      p.stats.itemsFound++;
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

  score(p, winner) {
    const s = p.stats;
    return p.turns * 10 + s.visited.length * 4 + s.itemsFound * 3 + s.vehiclesFound * 5 + s.recruited * 5 + s.fightsWon * 2 + (p.alive ? p.hearts * 5 : 0) + (p === winner ? 50 : 0);
  }

  ranking(winner) {
    return this.players.slice().sort((a, b) =>
      (b === winner) - (a === winner) || (b.alive - a.alive) || (b.diedRound - a.diedRound) || (b.turns - a.turns) || (this.score(b, winner) - this.score(a, winner)));
  }

  gameOver(winner) {
    this.phase = 'over';
    this.winner = winner;
    this.drawBanner('🏁 GAME OVER 🏁', '#ffffff');
    if (this.players.length === 1) {
      const p = this.players[0];
      this.headerText.setText(`${p.name} survived ${p.turns - 1} turns!`).setColor('#ffcc33');
    } else {
      this.headerText.setText(`${winner.name} is the last survivor!`).setColor('#55ff55');
    }

    const ranked = this.ranking(winner);
    const pad = (s, n) => String(s).slice(0, n).padEnd(n);
    const lines = [pad('#', 3) + pad('NAME', 12) + pad('TURNS', 7) + pad('RESULT', 14) + pad('ITEMS', 7) + pad('FRIENDS', 9) + pad('MILES', 7) + 'SCORE'];
    ranked.forEach((p, i) => {
      lines.push(pad(i + 1, 3) + pad(p.name, 12) + pad(p.turns, 7) + pad(p.alive ? 'SURVIVED' : `died rnd ${p.diedRound}`, 14) +
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
    this.drawStatus();
  }

  statRows(ranked, winner) {
    const date = new Date().toLocaleString();
    return ranked.map((p, i) => [
      date, this.players.length, i + 1, p.name, p.alive ? 'Survived' : p.heartbroken ? 'Died of heartbreak' : 'Died', p.alive ? '' : p.diedRound, p.turns, p.stats.freeActions,
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
