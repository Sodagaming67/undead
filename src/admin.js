const ADMIN_CSS = `
#admin-root {
  --bg: #0e1116; --surface: #161b22; --surface-2: #1e242d; --border: #2a313c;
  --text: #e8eaed; --muted: #9aa4b2; --accent: #2bb3a3; --accent-hover: #3cc7b6; --accent-soft: rgba(43,179,163,.14);
  --on-accent: #062b27; --danger: #f28b82; --danger-soft: rgba(242,139,130,.14); --warn: #f3b664; --warn-soft: rgba(243,182,100,.14);
  --violet: #b4a2f8; --violet-soft: rgba(180,162,248,.14);
  position: fixed; inset: 0; z-index: 100; display: flex; justify-content: center; align-items: flex-start;
  padding: 28px 16px; overflow-y: auto; background: rgba(5,8,12,.72); backdrop-filter: blur(6px);
  font: 14px/1.5 'Inter', system-ui, 'Segoe UI', Roboto, sans-serif; color: var(--text); -webkit-font-smoothing: antialiased;
}
#admin-root[hidden] { display: none; }
#admin-root * { box-sizing: border-box; margin: 0; }
#admin-root button, #admin-root select { font: inherit; color: inherit; }
.ad-sheet { width: 100%; max-width: 1080px; background: var(--bg); border: 1px solid var(--border); border-radius: 18px; box-shadow: 0 30px 80px rgba(0,0,0,.6); overflow: hidden; }
.ad-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; height: 62px; padding: 0 22px; background: var(--surface); border-bottom: 1px solid var(--border); }
.ad-brand { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 17px; letter-spacing: -.01em; }
.ad-mark { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 8px; background: var(--accent); color: var(--on-accent); }
.ad-top-right { display: flex; align-items: center; gap: 10px; }
.ad-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 500; color: var(--muted); background: var(--surface-2); border: 1px solid var(--border); padding: 4px 10px; border-radius: 999px; }
.ad-body { padding: 22px; display: grid; gap: 18px; }
.ad-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.ad-stat { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 14px 16px; }
.ad-stat-label { font-size: 12px; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; }
.ad-stat-value { font-size: 24px; font-weight: 700; letter-spacing: -.02em; margin-top: 2px; display: flex; align-items: center; gap: 8px; }
.ad-layout { display: grid; grid-template-columns: 1fr 300px; gap: 18px; align-items: start; }
.ad-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 18px; }
.ad-panel-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
.ad-panel h2 { font-size: 16px; font-weight: 650; letter-spacing: -.01em; }
.ad-sub { font-size: 13px; color: var(--muted); }
.ad-players { display: grid; gap: 12px; }
.ad-player { border: 1px solid var(--border); border-radius: 12px; padding: 14px; background: var(--surface-2); border-left: 4px solid var(--pc); }
.ad-player.dead { opacity: .72; }
.ad-player-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.ad-name { display: flex; align-items: center; gap: 8px; font-weight: 650; font-size: 15px; }
.ad-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--pc); }
.ad-pills { display: flex; gap: 6px; flex-wrap: wrap; }
.ad-pill { font-size: 11px; font-weight: 600; padding: 1px 8px; border-radius: 999px; background: var(--surface); color: var(--muted); border: 1px solid var(--border); }
.ad-pill.accent { background: var(--accent-soft); color: var(--accent); border-color: transparent; }
.ad-pill.danger { background: var(--danger-soft); color: var(--danger); border-color: transparent; }
.ad-pill.warn { background: var(--warn-soft); color: var(--warn); border-color: transparent; }
.ad-pill.violet { background: var(--violet-soft); color: var(--violet); border-color: transparent; }
.ad-meta { display: flex; gap: 16px; flex-wrap: wrap; font-size: 13px; color: var(--muted); margin: 8px 0 12px; }
.ad-meta b { color: var(--text); font-weight: 600; }
.ad-hearts { color: var(--danger); letter-spacing: 1px; }
.ad-hearts i { color: var(--border); font-style: normal; }
.ad-actions { display: flex; gap: 6px; flex-wrap: wrap; }
.ad-forms { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
.ad-form { display: flex; gap: 6px; }
.ad-turn-label { align-self: center; font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; margin-right: 4px; }
.ad-form select { flex: 1; min-width: 0; height: 32px; padding: 0 8px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); font-size: 13px; }
.ad-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 32px; padding: 0 12px; border-radius: 8px; border: 1px solid transparent; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: background .15s, border-color .15s; }
.ad-btn:active { transform: translateY(1px); }
.ad-btn:disabled { opacity: .4; cursor: not-allowed; transform: none; }
.ad-btn.primary { background: var(--accent); color: var(--on-accent); }
.ad-btn.primary:hover:not(:disabled) { background: var(--accent-hover); }
.ad-btn.secondary { background: var(--accent-soft); color: var(--accent); }
.ad-btn.secondary:hover:not(:disabled) { border-color: var(--accent); }
.ad-btn.ghost { background: transparent; border-color: var(--border); }
.ad-btn.ghost:hover:not(:disabled) { background: var(--surface); }
.ad-btn.danger { background: #dc2626; color: #fff; }
.ad-btn.danger:hover:not(:disabled) { background: #b91c1c; }
.ad-btn.on { background: var(--warn-soft); color: var(--warn); border-color: var(--warn); }
.ad-btn.wide { width: 100%; }
.ad-side { display: grid; gap: 18px; }
.ad-owner { border-color: color-mix(in srgb, #dc2626 30%, var(--border)); }
.ad-stepper { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.ad-stepper span { flex: 1; text-align: center; font-size: 22px; font-weight: 700; }
.ad-stack { display: grid; gap: 8px; }
.ad-hint { font-size: 12.5px; color: var(--muted); margin-top: 10px; }
.ad-kbd { font-family: ui-monospace, Consolas, monospace; font-size: 12px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; padding: 1px 6px; }
.ad-toast { position: fixed; left: 50%; bottom: 28px; transform: translateX(-50%); background: #111827; color: #fff; border: 1px solid var(--border); padding: 10px 16px; border-radius: 10px; font-size: 14px; font-weight: 500; box-shadow: 0 20px 50px rgba(0,0,0,.5); z-index: 101; }
.ad-toast[hidden] { display: none; }
.ad-mapwrap { display: grid; grid-template-columns: 1fr 300px; gap: 18px; align-items: start; }
.ad-map { width: 100%; height: auto; display: block; border-radius: 12px; background: #0b0f14; border: 1px solid var(--border); }
.ad-map .place, .ad-map .road-hit { cursor: pointer; }
.ad-map .place:hover circle.node { stroke: var(--text); }
.ad-legend { display: flex; gap: 14px; flex-wrap: wrap; font-size: 12px; color: var(--muted); margin-top: 10px; }
.ad-legend span { display: inline-flex; align-items: center; gap: 6px; }
.ad-legend i { width: 10px; height: 10px; border-radius: 3px; display: inline-block; }
.ad-zed { display: grid; gap: 14px; }
.ad-zbox { border: 1px solid var(--border); border-radius: 12px; padding: 14px; background: var(--surface-2); }
.ad-zbox h3 { font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; }
.ad-zname { font-size: 15px; font-weight: 650; margin-top: 4px; }
.ad-zcount { font-size: 30px; font-weight: 700; letter-spacing: -.02em; display: flex; align-items: baseline; gap: 8px; margin: 2px 0 8px; }
.ad-zcount small { font-size: 13px; font-weight: 500; color: var(--muted); letter-spacing: 0; }
.ad-row { display: flex; gap: 6px; flex-wrap: wrap; }
.ad-row .ad-btn { flex: 1; padding: 0 8px; }
.ad-range { width: 100%; margin: 10px 0; accent-color: var(--accent); }
.ad-here { font-size: 12.5px; color: var(--muted); margin-top: 8px; }
@media (max-width: 860px) { .ad-mapwrap { grid-template-columns: 1fr; } }
@media (max-width: 860px) { .ad-layout { grid-template-columns: 1fr; } .ad-stats { grid-template-columns: repeat(2, 1fr); } .ad-forms { grid-template-columns: 1fr; } }
`;

const MAP_POS = {
  house: [120, 170], school: [190, 80], park: [260, 170], gas: [70, 300], police: [330, 50],
  sports: [360, 210], mall: [450, 270], hospital: [510, 120], woods: [290, 340], tower: [600, 330]
};
const MAP_LABEL = {
  house: [0, 42, 'middle'], school: [0, -36, 'middle'], park: [0, 42, 'middle'], gas: [0, 42, 'middle'], police: [0, -32, 'middle'],
  sports: [30, 10, 'start'], mall: [0, 46, 'middle'], hospital: [32, 4, 'start'], woods: [-30, 4, 'end'], tower: [0, -32, 'middle']
};
const SVG_NS = 'http://www.w3.org/2000/svg';
Object.assign(MAP_POS, { forest_pines: [190, 140], forest_blackthorn: [390, 128], forest_deadfall: [180, 238], forest_grave: [322, 240], forest_hollow: [512, 252], crossing: [283, 283] });
const FOREST_SHAPE = {
  forest_pines: ['house', 'school', 'park'],
  forest_blackthorn: ['school', 'police', 'hospital', 'mall', 'sports', 'park'],
  forest_deadfall: ['house', 'park', 'crossing', 'gas'],
  forest_grave: ['park', 'sports', 'mall', 'crossing'],
  forest_hollow: ['crossing', 'mall', 'hospital', 'tower', 'woods']
};

function zombieColor(n, normal) {
  const r = n / normal;
  if (n === 0) return '#2bb3a3';
  if (r < 0.75) return '#69db7c';
  if (r < 1.5) return '#f3b664';
  if (r < 3) return '#ff922b';
  return '#f03e3e';
}

const CROWN ='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/></svg>';
const LOCK = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

class AdminPanel {
  constructor(scene) {
    this.scene = scene;
    if (!document.getElementById('admin-css')) {
      const style = document.createElement('style');
      style.id = 'admin-css';
      style.textContent = ADMIN_CSS;
      document.head.appendChild(style);
    }
    document.getElementById('admin-root')?.remove();
    document.getElementById('admin-toast')?.remove();
    this.root = this.el('div');
    this.root.id = 'admin-root';
    this.root.hidden = true;
    this.root.addEventListener('mousedown', e => { if (e.target === this.root) this.close(); });
    this.toastEl = this.el('div', 'ad-toast');
    this.toastEl.id = 'admin-toast';
    this.toastEl.hidden = true;
    document.body.append(this.root, this.toastEl);
    this.onKey = e => {
      if (this.root.hidden) return;
      e.stopImmediatePropagation();
      if (e.key === 'Escape') this.close();
    };
    window.addEventListener('keydown', this.onKey, true);
    scene.events.once('shutdown', () => this.destroy());
  }

  get isOpen() { return !this.root.hidden; }

  el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  button(label, cls, onClick, disabled) {
    const b = this.el('button', 'ad-btn ' + cls, label);
    b.type = 'button';
    b.disabled = !!disabled;
    b.addEventListener('click', onClick);
    return b;
  }

  pill(text, cls = '') { return this.el('span', 'ad-pill ' + cls, text); }

  open() {
    this.root.hidden = false;
    this.render();
  }

  close() {
    this.root.hidden = true;
    this.hideToast();
  }

  destroy() {
    window.removeEventListener('keydown', this.onKey, true);
    this.root.remove();
    this.toastEl.remove();
  }

  toast(msg) {
    this.toastEl.textContent = msg;
    this.toastEl.hidden = false;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.hideToast(), 2600);
  }

  hideToast() { this.toastEl.hidden = true; }

  act(fn) {
    const msg = fn();
    if (this.scene.phase === 'over') return this.close();
    this.scene.refreshAfterAdmin();
    this.render();
    if (msg) this.toast(msg);
  }

  render() {
    const s = this.scene;
    const alive = s.players.filter(p => p.alive);
    this.root.replaceChildren();
    const sheet = this.el('div', 'ad-sheet');

    const top = this.el('div', 'ad-top');
    const brand = this.el('div', 'ad-brand');
    const mark = this.el('span', 'ad-mark');
    mark.innerHTML = CROWN;
    brand.append(mark, 'Undead Inc Admin');
    const right = this.el('div', 'ad-top-right');
    const badge = this.el('span', 'ad-badge');
    badge.innerHTML = LOCK;
    badge.append('Only you can see this');
    right.append(badge, this.button('Close', 'ghost', () => this.close()));
    top.append(brand, right);

    const stats = this.el('div', 'ad-stats');
    const stat = (label, value, color) => {
      const box = this.el('div', 'ad-stat');
      const v = this.el('div', 'ad-stat-value', value);
      if (color) v.style.color = color;
      box.append(this.el('div', 'ad-stat-label', label), v);
      return box;
    };
    const godCount = s.players.filter(p => p.god).length;
    stats.append(
      stat('Round', String(s.round)),
      stat('Players alive', `${alive.length} / ${s.players.length}`),
      stat('Whose turn', s.current.name, s.current.color),
      stat('God mode', godCount ? `${godCount} on` : 'Off', godCount ? 'var(--warn)' : 'var(--muted)')
    );

    const players = this.el('section', 'ad-panel');
    const head = this.el('div', 'ad-panel-head');
    head.append(this.el('h2', '', 'Players'), this.el('span', 'ad-sub', 'Changes happen right away'));
    const list = this.el('div', 'ad-players');
    s.players.forEach(p => list.append(this.playerCard(p)));
    players.append(head, list);

    const layout = this.el('div', 'ad-layout');
    layout.append(players, this.sidePanels());

    const body = this.el('div', 'ad-body');
    body.append(stats, this.mapPanel(), layout);
    sheet.append(top, body);
    this.root.append(sheet);
  }

  playerCard(p) {
    const s = this.scene;
    const card = this.el('div', 'ad-player' + (p.alive ? '' : ' dead'));
    card.style.setProperty('--pc', p.color);

    const head = this.el('div', 'ad-player-head');
    const name = this.el('div', 'ad-name');
    name.append(this.el('span', 'ad-dot'), p.name);
    const pills = this.el('div', 'ad-pills');
    if (p === s.current && p.alive) pills.append(this.pill('Playing now', 'accent'));
    pills.append(p.alive ? this.pill('Alive') : this.pill('Dead', 'danger'));
    if (SKILLS[p.skill]) pills.append(this.pill(`${SKILLS[p.skill].icon} ${SKILLS[p.skill].name}`));
    if (s.nextUp === p) pills.append(this.pill('Up next', 'accent'));
    if (p.sitOut) pills.append(this.pill('Sitting out', 'violet'));
    if (p.god) pills.append(this.pill('God mode', 'warn'));
    if (p.curse) pills.append(this.pill('Cursed', 'violet'));
    if (p.escaped) pills.append(this.pill('Escaped ' + ESCAPES[p.escaped].icon, 'accent'));
    else if (p.escapeItems.length) pills.append(this.pill('Escape ' + p.escapeItems.map(k => ESCAPE_ITEMS[k].icon).join('') + ` ${p.escapeItems.length}/3`, p.escapeItems.length === 3 ? 'accent' : ''));
    head.append(name, pills);

    const meta = this.el('div', 'ad-meta');
    const hearts = this.el('span', 'ad-hearts');
    hearts.textContent = '❤'.repeat(p.hearts);
    const empty = this.el('i', '', '❤'.repeat(Math.max(0, 3 - p.hearts)));
    hearts.append(empty);
    const metaItem = (label, value) => {
      const span = this.el('span', '', label + ' ');
      span.append(this.el('b', '', value));
      return span;
    };
    meta.append(hearts, metaItem('📍', LOCATIONS[p.at].name), metaItem('Items', String(p.items.length)),
      metaItem('Vehicles', String(p.vehicles.length)), metaItem('Team', String(p.team.length)), metaItem('Turns', String(p.turns)),
      metaItem('🪤', String(p.traps.length)), metaItem('🛡', p.inBunker ? `inside (${p.bunkerTurns})` : p.bunkerBuilt ? 'built' : `${p.bunkerProgress}/${bunkerBuildTurns(p)}`));

    const actions = this.el('div', 'ad-actions');
    actions.append(
      this.button('Heal', 'secondary', () => this.act(() => s.adminDo('heal', p)), !p.alive || p.hearts >= 3),
      this.button('Hurt', 'ghost', () => this.act(() => s.adminDo('hurt', p)), !p.alive || p.hearts <= 1),
      this.button(p.god ? 'God mode: ON' : 'God mode', p.god ? 'on' : 'ghost', () => this.act(() => s.adminDo('god', p)), !p.alive),
      this.button('Curse', 'ghost', () => this.act(() => s.adminDo('curse', p)), !p.alive || p.curse),
      this.button('Make winner', 'ghost', () => this.act(() => s.adminDo('win', p)), !p.alive),
      p.alive ? this.button('Kill', 'danger', () => this.act(() => s.adminDo('kill', p)))
        : this.button('Revive', 'primary', () => this.act(() => s.adminDo('revive', p)))
    );

    const isCurrent = p === s.current && p.alive;
    const othersCanPlay = s.players.some(o => o !== p && s.canPlay(o));
    const turns = this.el('div', 'ad-actions');
    turns.style.marginTop = '6px';
    turns.append(
      this.el('span', 'ad-turn-label', 'Turns:'),
      this.button(s.nextUp === p ? 'Going next ✓' : 'Go next', s.nextUp === p ? 'on' : 'ghost', () => this.act(() => s.adminDo('nextUp', p)), !s.canPlay(p) || isCurrent),
      this.button('Play now', 'ghost', () => this.act(() => s.adminDo('playNow', p)), !s.canPlay(p) || isCurrent),
      this.button(p.sitOut ? 'Back in the game' : 'Sit out', p.sitOut ? 'secondary' : 'ghost', () => this.act(() => s.adminDo('sitOut', p)), !p.alive || (!p.sitOut && !othersCanPlay))
    );

    const forms = this.el('div', 'ad-forms');
    const form = (label, options, cmd) => {
      const row = this.el('div', 'ad-form');
      const sel = this.el('select');
      options.forEach(([value, text]) => sel.append(new Option(text, value)));
      row.append(sel, this.button(label, 'secondary', () => this.act(() => s.adminDo(cmd, p, sel.value)), !p.alive));
      return row;
    };
    const byName = (a, b) => a[1].localeCompare(b[1]);
    forms.append(
      form('Teleport', Object.keys(LOCATIONS).filter(k => k !== p.at && !LOCATIONS[k].isRoad).map(k => [k, (LOCATIONS[k].isForest ? '🌲 ' : '') + LOCATIONS[k].name]), 'teleport'),
      form('Give', [['all', '⭐ Every item'], ...Object.keys(ITEMS).map(k => [k, ITEMS[k].short]).sort(byName)], 'give'),
      form('Give', [['all', '⭐ Every vehicle'], ...Object.keys(VEHICLES).map(k => [k, VEHICLES[k].icon + ' ' + VEHICLES[k].name])], 'vehicle'),
      form('Recruit', Object.keys(SURVIVORS).filter(k => !p.team.includes(k)).map(k => [k, SURVIVORS[k].name]), 'recruit'),
      form('Give', [['all', '⭐ All 3 escape items'], ...Object.keys(ESCAPE_ITEMS).filter(k => !p.escapeItems.includes(k)).map(k => [k, ESCAPE_ITEMS[k].icon + ' ' + ESCAPE_ITEMS[k].name])], 'giveEscape')
    );

    card.append(head, meta, actions, turns, forms);
    return card;
  }

  svg(tag, attrs, parent) {
    const e = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.append(e);
    return e;
  }

  svgText(parent, x, y, text, attrs) {
    const t = this.svg('text', { x, y, 'text-anchor': 'middle', 'font-family': 'Inter, system-ui, sans-serif', ...attrs }, parent);
    t.textContent = text;
    return t;
  }

  mapPanel() {
    const s = this.scene;
    if (!this.selected || !LOCATIONS[this.selected]) this.selected = s.current.at;
    const panel = this.el('section', 'ad-panel');
    const head = this.el('div', 'ad-panel-head');
    head.append(this.el('h2', '', 'Town map'), this.el('span', 'ad-sub', 'Click a place or road to change its zombies'));

    const map = this.svg('svg', { viewBox: '0 0 660 380', class: 'ad-map' });
    const defs = this.svg('defs', {}, map);
    const grid = this.svg('pattern', { id: 'ad-grid', width: 20, height: 20, patternUnits: 'userSpaceOnUse' }, defs);
    this.svg('path', { d: 'M20 0H0V20', fill: 'none', stroke: '#18202a', 'stroke-width': 1 }, grid);
    this.svg('rect', { width: 660, height: 380, fill: 'url(#ad-grid)' }, map);
    const trees = this.svg('pattern', { id: 'ad-trees', width: 16, height: 14, patternUnits: 'userSpaceOnUse' }, defs);
    this.svg('rect', { width: 16, height: 14, fill: '#13261a' }, trees);
    this.svg('path', { d: 'M4 1L7.5 8H0.5Z M12 7L15.5 14H8.5Z', fill: '#2b5a38' }, trees);

    const select = k => () => { this.selected = k; this.render(); };
    const mid = k => {
      const [a, b] = LOCATIONS[k].ends;
      const t = k === 'road_house_park' ? 0.2 : 0.5;
      return [MAP_POS[a][0] + (MAP_POS[b][0] - MAP_POS[a][0]) * t, MAP_POS[a][1] + (MAP_POS[b][1] - MAP_POS[a][1]) * t];
    };
    const roads = Object.keys(LOCATIONS).filter(k => LOCATIONS[k].isRoad);
    const forests = Object.keys(LOCATIONS).filter(k => LOCATIONS[k].isForest);
    forests.forEach(k => {
      const points = FOREST_SHAPE[k].map(n => MAP_POS[n].join(',')).join(' ');
      const area = this.svg('polygon', { points, class: 'place', fill: 'url(#ad-trees)', stroke: k === this.selected ? '#2bb3a3' : '#1f3d2a', 'stroke-width': k === this.selected ? 6 : 2, 'stroke-linejoin': 'round' }, map);
      area.addEventListener('click', select(k));
    });
    roads.forEach(k => {
      const [a, b] = LOCATIONS[k].ends;
      const color = zombieColor(s.zombies[k], normalZombies(k));
      const line = { x1: MAP_POS[a][0], y1: MAP_POS[a][1], x2: MAP_POS[b][0], y2: MAP_POS[b][1] };
      this.svg('line', { ...line, stroke: '#2a313c', 'stroke-width': 10, 'stroke-linecap': 'round' }, map);
      this.svg('line', { ...line, stroke: color, 'stroke-width': k === this.selected ? 4 : 2, 'stroke-dasharray': '6 6', opacity: k === this.selected ? 1 : 0.7 }, map);
    });
    roads.forEach(k => {
      const [x, y] = mid(k);
      const g = this.svg('g', { class: 'place' }, map);
      g.addEventListener('click', select(k));
      const sel = k === this.selected;
      this.svg('rect', { x: x - 15, y: y - 9, width: 30, height: 18, rx: 9, fill: sel ? '#2bb3a3' : '#161b22', stroke: zombieColor(s.zombies[k], normalZombies(k)), 'stroke-width': 1.5 }, g);
      this.svgText(g, x, y + 4, String(s.zombies[k]), { 'font-size': 11, 'font-weight': 700, fill: sel ? '#062b27' : '#e8eaed' });
      const title = this.svg('title', {}, g);
      title.textContent = `${LOCATIONS[k].name}: ${s.zombies[k]} zombies`;
    });
    forests.forEach(k => {
      const [x, y] = MAP_POS[k];
      const n = s.zombies[k];
      const sel = k === this.selected;
      const g = this.svg('g', { class: 'place' }, map);
      g.addEventListener('click', select(k));
      const esc = Object.keys(ESCAPES).find(e => s.escapes[e] === k);
      if (esc) {
        this.svg('circle', { cx: x, cy: y - 8, r: 13, fill: '#0b0f14', stroke: '#66ffcc', 'stroke-width': 2 }, g);
        this.svgText(g, x, y - 3, ESCAPES[esc].icon, { 'font-size': 14 });
      } else this.svgText(g, x, y - 3, '🌲', { 'font-size': 14 });
      this.svg('rect', { x: x - 17, y: y + 1, width: 34, height: 16, rx: 8, fill: sel ? '#2bb3a3' : '#0b0f14', stroke: zombieColor(n, normalZombies(k)), 'stroke-width': 1.5 }, g);
      this.svgText(g, x, y + 13, String(n), { 'font-size': 10.5, 'font-weight': 700, fill: sel ? '#062b27' : '#e8eaed' });
      this.svgText(g, x, y + (k === 'forest_pines' ? 27 : 30), LOCATIONS[k].name, { 'font-size': 10, 'font-weight': 600, 'font-style': 'italic', fill: '#69db7c', stroke: '#0b0f14', 'stroke-width': 3, 'paint-order': 'stroke' });
      const title = this.svg('title', {}, g);
      title.textContent = `${LOCATIONS[k].name} (deadly woods): ${n} zombies`;
    });
    TOWN.forEach(k => {
      const [x, y] = MAP_POS[k];
      const n = s.zombies[k];
      const color = zombieColor(n, normalZombies(k));
      const g = this.svg('g', { class: 'place' }, map);
      g.addEventListener('click', select(k));
      if (k === this.selected) this.svg('circle', { cx: x, cy: y, r: 30, fill: 'none', stroke: '#2bb3a3', 'stroke-width': 3 }, g);
      this.svg('circle', { cx: x, cy: y, r: 23, fill: color, 'fill-opacity': 0.22 + Math.min(0.5, n / 200), stroke: color, 'stroke-width': 2, class: 'node' }, g);
      this.svgText(g, x, y - 2, '🧟', { 'font-size': 12 });
      this.svgText(g, x, y + 12, String(n), { 'font-size': 12, 'font-weight': 700, fill: '#ffffff' });
      const item = s.escapeItemAt(k);
      if (item) {
        this.svg('circle', { cx: x + 22, cy: y - 18, r: 10, fill: '#0b0f14', stroke: '#66ffcc', 'stroke-width': 1.5 }, g);
        this.svgText(g, x + 22, y - 14, ESCAPE_ITEMS[item].icon, { 'font-size': 11 });
      }
      const [dx, dy, anchor] = MAP_LABEL[k];
      this.svgText(g, x + dx, y + dy, LOCATIONS[k].name, { 'text-anchor': anchor, 'font-size': 11, 'font-weight': 600, fill: '#9aa4b2', stroke: '#0b0f14', 'stroke-width': 3, 'paint-order': 'stroke' });
    });

    const groups = {};
    s.players.forEach(p => (groups[p.at] = groups[p.at] || []).push(p));
    for (const k in groups) {
      const [cx, cy] = LOCATIONS[k].isRoad ? mid(k) : LOCATIONS[k].isForest ? [MAP_POS[k][0], MAP_POS[k][1] + 4] : MAP_POS[k];
      const list = groups[k];
      list.forEach((p, i) => {
        const angle = -Math.PI / 2 + (i - (list.length - 1) / 2) * 0.75;
        const dist = LOCATIONS[k].isRoad ? 22 : 34;
        const x = cx + Math.cos(angle) * dist, y = cy + Math.sin(angle) * dist;
        const g = this.svg('g', {}, map);
        if (p === s.current && p.alive) this.svg('circle', { cx: x, cy: y, r: 13, fill: 'none', stroke: '#ffffff', 'stroke-width': 2 }, g);
        this.svg('circle', { cx: x, cy: y, r: 10, fill: p.alive ? p.color : '#4b5563', stroke: '#0b0f14', 'stroke-width': 2 }, g);
        this.svgText(g, x, y + 4, p.alive ? p.name[0].toUpperCase() : '💀', { 'font-size': p.alive ? 11 : 9, 'font-weight': 800, fill: '#0b0f14' });
        const where = p.spot ? ` (inside ${LOCATIONS[k].spots[p.spot].name})` : '';
        const title = this.svg('title', {}, g);
        title.textContent = `${p.name}${p.alive ? '' : ' (dead)'}: ${LOCATIONS[k].name}${where}`;
      });
    }

    const legend = this.el('div', 'ad-legend');
    [['#2bb3a3', 'No zombies'], ['#69db7c', 'Fewer than normal'], ['#f3b664', 'Normal'], ['#ff922b', 'Lots'], ['#f03e3e', 'Overrun'], ['#2f5d3d', '🌲 Dark woods (deadly)']].forEach(([c, label]) => {
      const span = this.el('span');
      const sw = this.el('i');
      sw.style.background = c;
      span.append(sw, label);
      legend.append(span);
    });
    const left = this.el('div');
    left.append(map, legend);

    const wrap = this.el('div', 'ad-mapwrap');
    wrap.append(left, this.zombieEditor());
    panel.append(head, wrap);
    return panel;
  }

  zombieEditor() {
    const s = this.scene;
    const k = this.selected;
    const n = s.zombies[k];
    const normal = normalZombies(k);
    const set = v => this.act(() => s.adminDo('zombies', k, v));
    const box = this.el('div', 'ad-zbox');
    box.append(this.el('h3', '', LOCATIONS[k].isRoad ? 'Selected road' : 'Selected place'), this.el('div', 'ad-zname', LOCATIONS[k].name));
    const count = this.el('div', 'ad-zcount', String(n));
    const label = this.el('small', '', `zombies (normal is ${normal})`);
    count.style.color = zombieColor(n, normal);
    count.append(label);
    const range = this.el('input', 'ad-range');
    Object.assign(range, { type: 'range', min: 0, max: Math.max(200, n), value: n });
    range.addEventListener('input', () => { count.firstChild.textContent = range.value; });
    range.addEventListener('change', () => set(+range.value));
    const steps = this.el('div', 'ad-row');
    [-10, -1, 1, 10].forEach(d => steps.append(this.button((d > 0 ? '+' : '−') + Math.abs(d), 'ghost', () => set(n + d), n + d < 0)));
    const presets = this.el('div', 'ad-row');
    presets.style.marginTop = '6px';
    presets.append(
      this.button('Clear', 'secondary', () => set(0)),
      this.button('Normal', 'ghost', () => set(normal)),
      this.button('Horde', 'ghost', () => set(normal * 3)),
      this.button('Overrun', 'danger', () => set(normal * 6))
    );
    const here = s.players.filter(p => p.at === k).map(p => p.name + (p.alive ? '' : ' 💀'));
    box.append(count, range, steps, presets, this.el('p', 'ad-here', here.length ? `Here now: ${here.join(', ')}` : 'Nobody is here right now.'));

    const total = Object.values(s.zombies).reduce((a, b) => a + b, 0);
    const normalTotal = Object.keys(s.zombies).reduce((a, z) => a + normalZombies(z), 0);
    const town = this.el('div', 'ad-zbox');
    const tcount = this.el('div', 'ad-zcount', String(total));
    tcount.append(this.el('small', '', `zombies in town (normal is ${normalTotal})`));
    const pct = Math.round(total / normalTotal * 100);
    const trange = this.el('input', 'ad-range');
    Object.assign(trange, { type: 'range', min: 0, max: 600, step: 25, value: Math.min(600, pct) });
    const tlabel = this.el('p', 'ad-here', `Set every place to ${trange.value}% of normal`);
    trange.addEventListener('input', () => { tlabel.textContent = `Set every place to ${trange.value}% of normal`; });
    trange.addEventListener('change', () => this.act(() => s.adminDo('allZombies', null, trange.value / 100)));
    const all = this.el('div', 'ad-row');
    [['None', 0, 'secondary'], ['Half', 0.5, 'ghost'], ['Normal', 1, 'ghost'], ['×2', 2, 'ghost'], ['×5', 5, 'danger']].forEach(([label, m, cls]) =>
      all.append(this.button(label, cls, () => this.act(() => s.adminDo('allZombies', null, m)))));
    town.append(this.el('h3', '', 'Whole town'), tcount, trange, all, tlabel);

    const col = this.el('div', 'ad-zed');
    col.append(box, town);
    return col;
  }

  sidePanels() {
    const s = this.scene;
    const side = this.el('div', 'ad-side');

    const game = this.el('section', 'ad-panel');
    const gameHead = this.el('div', 'ad-panel-head');
    gameHead.append(this.el('h2', '', 'Game'));
    const stepper = this.el('div', 'ad-stepper');
    stepper.append(
      this.button('−', 'ghost', () => this.act(() => s.adminDo('round', null, s.round - 1)), s.round <= 1),
      this.el('span', '', `Round ${s.round}`),
      this.button('+', 'ghost', () => this.act(() => s.adminDo('round', null, s.round + 1)))
    );
    const stack = this.el('div', 'ad-stack');
    stack.append(
      this.button(`Skip ${s.current.name}'s turn`, 'ghost wide', () => this.act(() => s.adminDo('skip', s.current))),
      this.button('Heal everyone', 'secondary wide', () => this.act(() => s.adminDo('healAll')))
    );
    const note = this.el('p', 'ad-hint', 'Higher rounds make the zombies more dangerous for everyone.');
    const order = this.el('div', 'ad-zbox');
    order.style.marginTop = '14px';
    const watching = s.players.filter(p => p.sitOut && p.alive).map(p => p.name);
    order.append(
      this.el('h3', '', 'Turn order'),
      this.el('div', 'ad-zname', s.nextUp ? `Up next: ${s.nextUp.name}` : 'Up next: normal order'),
      this.el('p', 'ad-here', watching.length ? `Sitting out: ${watching.join(', ')}` : 'Use "Go next", "Play now" and "Sit out" on each player.')
    );
    if (s.nextUp) {
      const clear = this.button('Use normal order', 'ghost wide', () => this.act(() => s.adminDo('nextUp', s.nextUp)));
      clear.style.marginTop = '8px';
      order.append(clear);
    }
    game.append(gameHead, stepper, stack, note, order);

    const owner = this.el('section', 'ad-panel ad-owner');
    const ownerHead = this.el('div', 'ad-panel-head');
    const titles = this.el('div');
    titles.append(this.el('h2', '', 'Admin mode'), this.el('p', 'ad-sub', 'Only you can see this.'));
    ownerHead.append(titles);
    const hint = this.el('p', 'ad-hint');
    hint.append('Press ', this.el('span', 'ad-kbd', 'Esc'), ' or Close to hide this panel. Type the secret code again to bring it back.');
    owner.append(ownerHead, this.button('Turn off admin mode', 'danger wide', () => {
      s.admin = false;
      s.players.forEach(p => { p.god = false; p.curse = false; });
      this.close();
      s.refreshAfterAdmin();
    }), hint);

    const escape = this.el('section', 'ad-panel');
    const escHead = this.el('div', 'ad-panel-head');
    escHead.append(this.el('h2', '', 'Escape'), this.el('span', 'ad-sub', 'First out wins'));
    const where = this.el('div', 'ad-stack');
    Object.keys(ESCAPES).forEach(e => where.append(this.el('div', 'ad-here', `${ESCAPES[e].icon} ${ESCAPES[e].name}: ${LOCATIONS[s.escapes[e]].name}`)));
    Object.keys(ESCAPE_ITEMS).forEach(k => where.append(this.el('div', 'ad-here', `${ESCAPE_ITEMS[k].icon} ${ESCAPE_ITEMS[k].name}: ${LOCATIONS[s.escapeAt[k]].name}`)));
    const escButtons = this.el('div', 'ad-stack');
    escButtons.style.marginTop = '12px';
    escButtons.append(
      this.button('Move escape items now', 'secondary wide', () => this.act(() => s.adminDo('moveItems'))),
      this.button('Move helicopter & subway', 'ghost wide', () => this.act(() => s.adminDo('moveEscapes')))
    );
    escape.append(escHead, where, escButtons, this.el('p', 'ad-hint', 'Items move by themselves at the start of every round.'));
    side.append(game, escape, owner);
    return side;
  }
}
