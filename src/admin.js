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
@media (max-width: 860px) { .ad-layout { grid-template-columns: 1fr; } .ad-stats { grid-template-columns: repeat(2, 1fr); } .ad-forms { grid-template-columns: 1fr; } }
`;

const CROWN = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/></svg>';
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
    body.append(stats, layout);
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
    if (p.god) pills.append(this.pill('God mode', 'warn'));
    if (p.curse) pills.append(this.pill('Cursed', 'violet'));
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
      metaItem('Vehicles', String(p.vehicles.length)), metaItem('Team', String(p.team.length)), metaItem('Turns', String(p.turns)));

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
      form('Teleport', TOWN.filter(k => k !== p.at).map(k => [k, LOCATIONS[k].name]), 'teleport'),
      form('Give', [['all', '⭐ Every item'], ...Object.keys(ITEMS).map(k => [k, ITEMS[k].short]).sort(byName)], 'give'),
      form('Give', [['all', '⭐ Every vehicle'], ...Object.keys(VEHICLES).map(k => [k, VEHICLES[k].icon + ' ' + VEHICLES[k].name])], 'vehicle'),
      form('Recruit', Object.keys(SURVIVORS).filter(k => !p.team.includes(k)).map(k => [k, SURVIVORS[k].name]), 'recruit')
    );

    card.append(head, meta, actions, forms);
    return card;
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
    game.append(gameHead, stepper, stack, note);

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

    side.append(game, owner);
    return side;
  }
}
