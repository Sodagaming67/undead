# Undead Inc — Design Decisions Log

This is a living document. Every time a feature is added or changed, a new entry goes here **in the same response as the code change** — before the auto-commit fires.

The goal is to capture **why** a decision was made, not just **what** was built. That way, if you come back later and want to swap out a technology or rethink an approach, you have the full context of what was considered at the time.

---

## How to Read This

Each feature entry has four parts:

- **What was asked** — the original request, quoted where possible
- **What was built** — a plain description of the implementation
- **Why this way** — the reasoning behind the specific choices made
- **What was ruled out** — alternatives that were considered and rejected, and why

See [10-feature-requests.md](10-feature-requests.md) for a quick numbered index of every request with file references.

---

## Session 1 — Project Setup

### Initial Project Scaffold

**What was asked:** Set up a new Phaser game project called Undead Inc: a zombie apocalypse typing game where cousins type what they would do, the game says what happens, and the last one alive wins.
**What was built:** Basic Phaser 3 project structure with BootScene, MenuScene, GameScene, and UIScene. Python HTTP server for local development. Auto-commit stop hook. Local git only.
**Why this way:** Phaser 3 is a well-documented, beginner-friendly game framework. Python's built-in HTTP server requires no installation. The scene structure separates concerns cleanly. Everything is free.
**What was ruled out (scaffold):** AI-generated story outcomes (needs a paid API key, so keyword matching will be used instead). GitHub repo (skipped at the user's request to keep things simple). Node/npm dev server (adds complexity). Webpack/Vite (overkill for a small project).

### Zombie Story Game

**What was asked:** "Build the zombie story game where each cousin types what they do, and the last one alive wins"
**What was built:** `src/stories.js` holds 15 situations and 13 action types (run, hide, fight, climb, drive, sneak, barricade, supplies, help, call, trick, heal, plus "dumb" moves like hugging a zombie and "unknown" for anything unmatched). Each action type has keywords, base odds (safe/hurt/dead), and outcome lines. `SetupScene` collects names. `GameScene` runs turns, hearts, rounds, and the game over screen.
**Why this way:** Keyword matching is free and works offline. Dumb moves are checked first so "run and hug the zombie" still counts as dumb. Otherwise the action type with the most keyword hits wins. Hearts (3 each) stop one unlucky roll from knocking someone out on turn one. Odds shift toward death by 4 points per round so games end. Situation bonuses reward thinking about the situation, and the repeat penalty stops someone typing "run" every turn. Typing is captured straight from the keyboard in Phaser, so no HTML input box is needed.
**What was ruled out:** Paid AI for outcomes (costs money). An HTML text box over the canvas (more moving parts than needed). Pure instant-death with no hearts (too harsh and random for a party game).
