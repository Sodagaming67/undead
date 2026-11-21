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

### Connected Story Update

**What was asked:** More story, connected events, longer descriptions, nearby places with items (weapons make attacks safer), survivors to meet, and a much bigger word list so answers are less confusing.
**What was built:** `src/world.js` holds the town: `LOCATIONS` (name, aliases, neighbors, items, survivor, intro, events), `ITEMS` (boosts per action, armor), and `SURVIVORS` (aliases, intro, join text, boosts). Each cousin has their own story state: location, backpack, team, which events and items they have already seen. `src/stories.js` holds the word lists and outcome text. Running or driving moves you to a nearby place, so actions change where your story goes next.
**Why this way:**
- Per-cousin worlds keep the competition fair, because one cousin cannot loot everything before the others.
- Only the single best item counts toward an action, so carrying five weapons is not overpowered. Survivors stack, because recruiting them takes a turn.
- Words match with common endings (run/running, hide/hiding) so fewer words are needed.
- "Strong" phrases (like "look for", "take a nap", "run toward") count double to fix confusing ties.
- Silly moves like "hug" only count as dumb when aimed at a zombie, so "hug Biscuit" recruits the dog.
- If nothing matches, the game asks you to retype instead of rolling a random outcome. This was the main cause of confusing answers before.
- Survivors have a 50% chance to sacrifice themselves when you would die. This adds drama and makes recruiting worth it.
**What was ruled out:** A shared world for all cousins (unfair looting). Stacking all item boosts (too easy). An AI to read sentences (costs money).

### Trick-Proof Word-Finder

**What was asked:** Add a lot more words so the word-finder is nearly impossible to trick.
**What was built:** `src/words.js` holds the extra word lists, place misspellings, cheat words, fake gear, item names, "don't" words, and a list of normal English words that should never be treated as typos. `stories.js` merges them into the main lists when the game loads, then:
1. cleans up the text (removes apostrophes, keeps sentence breaks),
2. removes "don't X" parts,
3. blocks cheats,
4. checks survivors and gear,
5. scores every action type (ignoring a word when a longer phrase containing it also matched, so "frying pan" does not count twice),
6. picks the winner.

**Why this way:**
- Typo matching only kicks in for words the game does not already know, and only when the first letter matches. That stops real words like "night" or "fright" from being read as "fight".
- The "don't" removal stops at a comma, "and", "but", "so" or "I", so "don't fight, just hide" keeps the "hide" part.
- Cheats, missing gear and missing survivors all give a hint and let the player retype instead of punishing them. That keeps it fun for kids while still not letting the trick work.
- Cheat words must match exactly, so "wand" never matches "wander".

**What was ruled out:** A real AI to understand sentences (costs money). Punishing cheats with instant death (would feel unfair to younger cousins). Typo matching on short words under 5 letters (too many false matches).

### Stores, Roads, Vehicles

**What was asked:** Items in every building, roads with distance-based danger, realistic survivors who can die, more possible actions (driving into malls, hiding in specific stores), vehicles shown and usable, vehicles only from roads or survivors.
**What was built:**
- Each location has `spots` (stores and rooms) with `items` and `good` (actions that get +20 there).
- `ROADS` lists road name, miles and endpoints. `routeFrom`/`routeTo` (shortest path) give distance and road names for the travel text.
- Travel moves odds toward hurt and dead by miles × vehicle factor (car 0.4, motorcycle 0.5, bike 0.65, skateboard 0.8, walking 1).
- Vehicles live in `p.vehicles`, separate from the backpack. A good trip has a 25% chance to find one. "Search the street" (outside only) has a 60% chance. Survivors Tank, Diaz, Luna, Al and Joe each bring one.
- Teammates have 2 hearts. On a hurt result, a teammate takes the hit 35% of the time. On a dead result, a teammate sacrifices themselves 50% of the time.
**Why this way:**
- Spots let the same word ("hide", "search") mean something different depending on where you are, which makes many more actions possible without many new action types.
- Shortest-path routes mean the map stays readable while making far places truly risky.
- Keeping vehicles out of the backpack lets the game check you really own one before driving, and lets the panel show how to use each one.
- Crashing into a building wrecks the car so it is a real choice, not a free win.
- Only a spot's first alias counts for traveling to it from another place, so generic words like "roof" do not send you across town.
**What was ruled out:** Only letting you travel to neighbors (felt limiting once roads had distances). Keeping car keys as a findable item (the user wanted vehicles only from roads or survivors). Letting unrecruited survivors die off-screen (more confusing than fun).

### Team Orders and Stats

**What was asked:** Simple orders for survivors, the player's name on screen, small actions not counting as turns, a stats spreadsheet at the end, and no way to farm free turns.
**What was built:**
- `p.orders` holds each teammate's order. HIDE gives 0 help and 0 risk to them. PROTECT gives half help, but they take hits 70% of the time and sacrifice themselves 75% of the time. FIGHT gives +15 on fights and a 50% hit chance. FOLLOW is the old normal (35% hit, 50% sacrifice).
- Small actions go to a `free` phase, which re-shows the same turn and the same event after ENTER.
- `p.turns` counts only full actions. `p.stats` tracks everything for the table and the CSV.
- Game history is saved in the browser's local storage, so the CSV includes all earlier games on this computer.
**Why this way:**
- Orders need a teammate's name or a team word ("team", "everyone", "guys"). That way a plain "hide" still means YOU hide, and sentences starting with "I" count as your own move unless they say "tell" or "ask".
- The 2-small-action cap, the once-per-street vehicle search, and the camping danger (+6 hurt and +6 death per extra turn in the same place after the second) close the farming loopholes. Simulations showed campers and small-action spammers survive fewer turns than explorers.
- A CSV download needs no accounts or paid tools and opens in any spreadsheet app.
**What was ruled out:** A separate text box for team talk (one box is simpler for kids). Making small actions risk-free (would be farmable). Uploading results to Google Sheets (needs sign-in and an internet connection).
