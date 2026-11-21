# Undead Inc — Feature Requests Log

Every feature ask is recorded here in the order it was made, across all sessions.
Each entry links to [09-design-decisions.md](09-design-decisions.md) for the full reasoning behind the implementation.

---

## How to Read This

- Entries are numbered in the order they were asked — never renumbered
- "Session" labels mark which conversation the request came from
- "Files changed" is a quick pointer for finding the relevant code
- When a request is later revised, a follow-up entry is added (not the original edited)

---

## Session 1 — Project Setup

### #1 — Initial Project Scaffold

**Asked:** "Create a new Phaser game project called Undead Inc"
**Status:** ✓ Done
**What was built:** Phaser 3 project with four scenes (Boot, Menu, Game, UI), index.html entry point, Python dev server, CLAUDE.md rules, auto-commit hook, and docs.
**Files changed:** `index.html`, `src/main.js`, `src/scenes/BootScene.js`, `src/scenes/MenuScene.js`, `src/scenes/GameScene.js`, `src/scenes/UIScene.js`
**Design note:** → [Session 1 — Initial Project Scaffold](09-design-decisions.md)

### #2 — Zombie Story Game

**Asked:** "Build the zombie story game where each cousin types what they do, and the last one alive wins"
**Status:** ✓ Done
**What was built:** Name entry screen for up to 8 cousins. Players take turns: each gets a random zombie situation, types what they do, and the game matches keywords to pick an outcome (safe, hurt, or dead). 3 hearts each, danger rises every round, smart moves for the situation are safer, repeating your last move is riskier. Last cousin alive wins; with one player it counts rounds survived. Game over screen shows who died when and from what.
**Files changed:** `src/stories.js` (new), `src/scenes/SetupScene.js` (new), `src/scenes/GameScene.js`, `src/scenes/MenuScene.js`, `src/main.js`, `index.html`
**Design note:** → [Session 1 — Zombie Story Game](09-design-decisions.md)
