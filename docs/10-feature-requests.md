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

### #3 — Connected Story, Places, Items, Survivors, Smarter Words

**Asked:** "Make it more like a story and make everything connected, add a lot more words to the descriptions, give info on places nearby to run to or have stuff in them (like weapons that make you less likely to die when you attack), add other survivors you can meet, and give the word-finder a lot more words so it doesn't give confusing answers."
**Status:** ✓ Done
**What was built:** A town map of 10 connected places, each with a long description, its own zombie situations, and items to find. 20 items (weapons boost fighting, others boost sneaking, healing, driving, calling, barricades; helmets and shields make you harder to kill). 7 survivors (including Biscuit the dog) who join your team, make actions safer, and may sacrifice themselves to save you. Side panel shows place, nearby places, backpack, team, and whether there is stuff left to find. "Last time" recap line keeps each cousin's story connected. Word-finder now has hundreds of words, understands "go to <place>", and asks you to try again instead of guessing when it does not understand. Screen is bigger (960x640) and scales to fit the window.
**Files changed:** `src/world.js` (new), `src/stories.js`, `src/scenes/GameScene.js`, `src/scenes/SetupScene.js`, `src/main.js`, `index.html`
**Design note:** → [Session 1 — Connected Story Update](09-design-decisions.md)

### #4 — Word-Finder That Is Nearly Impossible to Trick

**Asked:** "Can you add a lot more words to the word finder to make it nearly impossible to trick"
**Status:** ✓ Done
**What was built:** About 2,200 action words and phrases (up from about 700), including slang and common misspellings. Typo forgiveness ("atack", "barricde", "sneek", "hosptal" still work). Understands "don't / not / instead of" ("don't fight, just hide" = hide). Blocks superpowers and cheats (teleport, god mode, kill all the zombies, it was a dream...) with a "nice try" message and lets you retype. Checks your backpack, so "attack with my katana" or "use my shotgun" is refused if you don't have it. Checks that survivors you talk to are actually there. Says so if you try to go somewhere you already are.
**Files changed:** `src/words.js` (new), `src/stories.js`, `index.html`
**Design note:** → [Session 1 — Trick-Proof Word-Finder](09-design-decisions.md)
