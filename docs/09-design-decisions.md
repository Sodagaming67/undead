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

### Cheater Test

**What was asked:** Make sure stupid answers never give free good results, and test it like a cheater would.
**What was built:** Self-harm and claim checks run first, on the text before the "don't" removal (so "I don't get hurt" is still caught). Then come the cheat check, the stuffing check after scoring, and a fake-destination check in the random-travel branch. In GameScene: an other-player-name check, entering/leaving rooms rolls with odds [65, 25, 10], and backtracking adds +12 danger.
**Test results:**
- A 115-answer cheater test (blocked / stupid / normal) passes 115/115.
- 2,000-game simulations per strategy showed honest play has the best average score (47) and the best single game (196). Camping, room-hopping, small-action spam, heal spam, barricade spam, shuttling back and forth, and blocked claims all scored lower. Stupid answers averaged 1.2 turns.
**Why this way:**
- Self-harm phrases are handled gently and never acted out, because the game is played by kids and should not turn that into a joke or a game mechanic.
- Refusing (with a retry) instead of punishing keeps it fair for younger cousins, while making sure the trick gains nothing.
**What was ruled out:** Making the character die from self-harm phrases (it would depict it as a game action). Silently ignoring claims (players would not learn why it failed).

### Roads as Places

**What was asked:** Stay on the road when you find a vehicle there.
**What was built:** `world.js` generates a `LOCATIONS` entry per road segment (`road_<a>_<b>`, `isRoad: true`, `ends`, `miles`) with shared `ROAD_EVENTS` and one "Abandoned Cars" spot. `routeFrom` adds two half-length edges from a road to its ends, so routes and distances work from the middle of a road. `routeTo` now also returns the node `path`, so the game knows which road segment you were on when you found the vehicle. `TOWN` lists only real places, for the panel and for travel.
**Why this way:** Making roads normal locations reused all the existing code (events, spots, searching, hiding, camping danger, death screen) instead of adding a separate "on the road" mode with its own rules. Finding a vehicle no longer stops a car trip, because a car is already the fastest option.
**What was ruled out:** Letting players type "go to Route 9" (road names repeat across segments, so it would be ambiguous).

### Zombies Reach the Roads

**What was asked:** Roads should not be a safe place to stay.
**What was built:** `campDanger` has a separate rule for roads: 5 on the first turn, then 30 + 20 per extra turn. This uses the same consecutive-turns counter (`p.stay`) as town camping.
**Why this way:** Reusing the camping counter means hiding behind the abandoned cars or entering them still counts as staying on the road. The first turn stays only slightly dangerous so finding a vehicle is still worth it. You just have to move on next turn.
**What was ruled out:** Forcing players off the road automatically (taking away their choice felt worse than a clear warning plus real danger).

### Heartbreak

**What was asked:** Stop players from using friends as shields, with a surprise heartbreak death after losing 3 friends.
**What was built:** `HEARTBREAK = 3`. After all hit and sacrifice handling in `resolve`, if `p.stats.friendsLost >= 3` the result becomes dead and `p.heartbroken` is set for the header, game over line and CSV.
**Why this way:** The check runs last, so a friend's sacrifice that would have saved you can still break your heart. The user asked for no warning so it is a funny surprise, so only the 💔 counter is shown. Simulations: recruiting survivors scores well with any orders (follow 66, protect 68, no friends 44), so after this change the shield trick is not what makes recruiting strong.
**What was ruled out:** A warning at 2 friends lost (removed at the user's request).

### Cabinets and Lockers

**What was asked:** No zombies inside cabinets anywhere. Zombies inside lockers only at the school.
**What was built:** `SCHOOL_LOCKER_TEXT` (hurt and dead) and `ZOMBIE_INSIDE` (a pattern that spots "zombie was inside" lines). In `resolve`, hide and search results that are not safe check what the player typed: school + locker uses the locker scenes; any other cabinet, cupboard or locker filters out the "zombie inside" lines. `ENTER_TEXT.deadOnWay` is used when entering a locker or cabinet spot outside the school.
**Why this way:** Checking the player's own words means the story matches what they said they were hiding in, without adding a new action type. A 4,000-try test per case showed 0 zombies inside cabinets or non-school lockers.
**What was ruled out:** Removing every "hiding spot already had a zombie" line (it is still funny for closets, dumpsters and so on).

### Secret Admin Mode

**What was asked:** A secret typed command that gives the user control of the whole game.
**What was built:** `ADMIN_CODE` and `adminCommand()` in `GameScene`. `resolve()` checks for admin input first, so the code and `/` commands never reach the word-finder, never use up a turn, and show their reply in the hint line. God mode and curse change the dice result right after `rollOutcome`. Curse only affects a real move and only once.
**Why this way:** The admin types in the same box as everyone else, so cousins can't tell anything special is happening except for the different cursor. The code is a phrase no one would type by accident. The word "admin" on its own still gets the normal "no cheating" reply.
**What was ruled out:** A secret key shortcut (the user asked for a typed command). A separate admin screen (everyone would see it on the shared screen).

### Admin Control Panel

**What was asked:** Make the admin screen look advanced, like the Chore Pool admin screen.
**What was built:** `src/admin.js` has an `AdminPanel` class that builds a regular web page panel (HTML and CSS) over the Phaser canvas. It copies Chore Pool's dark-mode colors and its panel, button and pill styles. Every button calls `GameScene.adminDo(cmd, player, value)`, then `refreshAfterAdmin()` redraws the game. While the panel is open it catches every key first, so typing in it never reaches the game.
**Why this way:** Real HTML buttons, dropdowns and cards look much more like the chore app than anything drawn with Phaser text, and are much easier to click. It needed a new file because the panel's styles and layout are large and separate from the game rules.
**What was ruled out:** Keeping the `/` commands as well (two ways to do the same thing). Drawing the panel with Phaser shapes (would not look like the chore app).

### Minimap and Zombie Counts

**What was asked:** A top-down minimap showing players, and admin control of zombie numbers per place and town-wide.
**What was built:** `GameScene.zombies` holds a count per location (`ZOMBIE_START`, roads use `ROAD_ZOMBIES`). `zombieDanger(k)` turns the count compared with normal into extra danger (+20 for each "extra normal", capped at +60) or extra luck (down to −40). It checks the destination when traveling and the current place otherwise. Zero zombies forces a good result for non-travel moves. `zombieLine()` adds a quiet/crowded/overrun sentence to the story when the page is drawn. The minimap is an SVG drawn in `AdminPanel.mapPanel()` with hand-placed positions (`MAP_POS`, `MAP_LABEL`) laid out to match the road network.
**Why this way:** At normal counts the danger is exactly 0, so the game plays the same as before unless the admin changes something. Drawing the map with SVG inside the HTML panel keeps it sharp, clickable, and in the same style as the rest of the admin screen.
**What was ruled out:** Real moving zombie characters on the map (the game has no zombie positions, only per-place danger). Working out map positions from road lengths automatically (it gave messy, overlapping layouts).

### Turn Order Control

**What was asked:** Let the admin choose who goes next, so the admin doesn't have to play.
**What was built:** `nextUp` (a chosen next player, used once by `nextTurn`), `p.sitOut`, `canPlay(p)` (alive and not sitting out), and `checkGameEnd()`, which only counts players who are not sitting out. Choosing a player whose spot in the list is at or before the current one counts as a new round, so round danger still goes up.
**Why this way:** "Sit out" covers "so they don't have to play" directly: the admin can add themselves to the game (to keep an eye on things) and never take a turn. "Go next" and "Play now" give full control without changing the order of the player list.
**What was ruled out:** A separate admin-only spot outside the player list (it would need a new setup screen). Dragging players to reorder them (more complicated, and "Go next" does the same job one turn at a time).

### Deadly Woods

**What was asked:** Woods between the roads that players can run into, and that are extremely dangerous.
**What was built:** `FORESTS` in `world.js` adds four `isForest` locations, each with the list of roads around it (`roads`, also its `neighbors`) and `forestWords` for its name. They are kept out of `aliases` and `TOWN`, so they can't be traveled to by name from town and don't appear in the travel list. `routeFrom` adds paths from a forest to the ends of its roads, so traveling to town works from inside. `parseAction` sends forest words typed on a road to a forest, and exit words or "run" typed in a forest to one of its roads, both marked `forest: true`. `resolve` gives those trips a short route, its own `FOREST_TEXT` stories, no vehicle finding, and +25 danger for going in. `campDanger` for a forest is 35 + 25 for every extra turn, and this applies to every action there, including leaving. In a 400-try test: entering killed 31–38%, hiding inside killed 32–34%, and leaving killed about 28%. Hiding at the mall kills about 5%.
**Why this way:** Separate locations let the woods have their own stories, loot, zombie count and spot on the admin map, while reusing all the normal action code. The great loot gives a reason to take the risk.
**What was ruled out:** Letting players run into the woods from town places (the request was woods between the roads). Treating "woods" as the roadside forest on Trail Road (players there almost always mean Whispering Woods).

### Woods Fill the Gaps

**What was asked:** Woods should fill every empty space between the roads.
**What was built:** `FOREST_SHAPE` lists the corners of each enclosed area on the map: the places at its corners, plus the point where Route 9 crosses Trail Road (`crossing`). Each forest is drawn as a polygon filled with an SVG tree pattern under the roads, so the road outlines cover the edges and the woods meet the roads exactly. New `forest_grave` covers the one space without woods, and `forest_hollow` gained the roads around its bigger area.
**Why this way:** Drawing the shapes from the same corner positions as the roads means the woods always line up with them. Putting the roads on top hides the edges, so nothing has to be shrunk to fit inside the roads.
**What was ruled out:** Filling the area outside the road network (it isn't between roads, and it would cover the edge of the map).

### Escape to Win

**What was asked:** A way to win by escaping: a helicopter and a subway in two random forests, started with three items found at random main places that move every round. Each cousin can carry one of each item.
**What was built:** `ESCAPE_ITEMS` and `ESCAPES` in `world.js`. In `GameScene`: `escapes` (which forest has which escape), `escapeAt` (where each item is), `p.escapeItems`, `placeEscapeItems()` (three different `TOWN` places, each different from where that item was last round), `newRound()` (used everywhere the round goes up), and `tryEscape()`. `tryEscape()` runs before the word-finder, so words like "helicopter" or "fly away" aren't caught by the cheat check, and it gives free hints until all the conditions are met. When a player escapes, `escapedWinner` makes the next ENTER go to `gameOver`. Escape items are handed out in `resolve` after any search that doesn't kill you.
**Why this way:** One shared set of three items for both escapes keeps it simple: collect all three, then pick whichever escape is closer. Items are tracked per player instead of being used up, so every cousin has a fair chance. Showing where everything is in the side panel makes it a race instead of a guessing game, and moving the items every round keeps players traveling. Escaping always works once you're in the forest with the items, because getting into the deadly forest is already the dangerous part.
**What was ruled out:** Separate items for each escape (it would need four or more items). Hidden item locations (with 9 places and items moving every round, players could never find them). A dice roll on the escape itself.

### Traps and Bunker

**What was asked:** Traps made from house stuff and a bunker that only lasts a few turns, with clear explanations.
**What was built:** `TRAPS`, `MAX_TRAPS`, `BUNKER_BUILD` and `BUNKER_TURNS` in `world.js`. `parseSurvival()` in `stories.js` runs before the normal word-finder, and while a player is in the bunker it turns everything they type into wait or leave. In `resolve`, survival moves use the barricade odds and boosts (so the garage tools help), they aren't counted as repeated moves, entering/leaving/waiting in the bunker always goes safely, and a bunker break-in adds +40 danger. A trap check runs after the dice roll: at the house, any hurt or dead result (except when traveling) uses up the oldest trap and might turn into a safe result. `survivalText()` writes every explanation, including the trap's percentage and how many traps are left. While a player is in the bunker, `prepareStory` shows only the bunker status.
**Why this way:** Traps that go off only when you are about to be hurt or killed make the chance easy to understand ("60% to stop the attack"). Being used up either way keeps them from being too strong. The bunker is safe for a fixed number of turns, then very dangerous, so it is a good way to wait out a bad moment but a terrible place to stay, just as asked.
**What was ruled out:** Traps that protect other cousins (each cousin is in their own story). Bunkers anywhere in town (the request was about the house).

### Skills

**What was asked:** Choose a skill after each name, with skill powers (like a better trapper) and a starting kit.
**What was built:** `SKILLS` in `world.js` (name, icon, description, `boost` per action type, `kit`), plus `maxTraps(p)`, `bunkerBuildTurns(p)` and `bunkerHoldTurns(p)`, which replace the fixed limits everywhere. `SetupScene` has a picking step after each name and passes `skills` along with `names` to `GameScene`. `GameScene.init` sets `p.skill` and gives the starting kit. The skill's `boost` is added in `resolve` the same way item boosts are. Special powers have their own small hooks: a free trap action for the trapper, the trapper's chance in `survivalText`, travel risk × 0.75 for the runner, an extra heart in `applyRewards` for the medic, and a second `takeItem` for the scavenger.
**Why this way:** Reusing the action boost system means most skills need no new rules. Each special power is a one-line check where that action already happens. The kits are strong but not game-winning, so the skills feel different without making one obviously best.
**What was ruled out:** Leveling up skills during the game (more to explain to new players). Only letting one cousin have each skill (cousins may all want the same one).

### Boss Zombies

**What was asked:** The named zombies should really attack.
**What was built:** `BOSSES` and `bossAt()` in `world.js`. Each player has `p.bosses` (health for each boss). In `resolve`, after the normal result and rewards, `bossTurn()` runs for the place the player started the turn at. A successful fight hits the boss (or defeats it, giving its drop). Otherwise the boss attacks with a chance based on `attack`, halved on arrival (`stay === 0`), when traveling away, or after a successful hide or sneak. A bite turns SAFE into HURT, or costs one more heart when the player was already hurt, so the normal teammate, death and heartbreak handling still applies. `springTrap()` is now shared by normal zombie attacks and Mr. Henderson's bites. `prepareStory` skips events that mention a boss that has been beaten.
**Why this way:** Having the boss attack after your move makes it a separate, easy-to-read attack instead of hiding it inside the dice roll. Halved chances reward hiding, sneaking and leaving. Not hitting back on the turn you land a hit makes fights feel fair: early tests without it had 73% of band fights ending in death.
**What was ruled out:** Bosses that follow you to other places (too punishing, and the other places have their own events). Shared bosses between cousins (each cousin plays their own story).

### Bosses Everywhere

**What was asked:** One optional boss at every main place, and none in forests or stores/rooms.
**What was built:** Seven more entries in `BOSSES`, one for each remaining `TOWN` place. No code changes were needed except clearer wording in the story line, because bosses are found by place (`bossAt`) and `bossHere` only matches main places.
**Why this way:** The park boss is the ice cream man instead of a zombie dog, because "dog" would match Biscuit, the friendly survivor dog. The hospital boss is "the surgeon" so "doctor" still means Dr. Shah. A check script confirmed that no fight command uses a survivor's name.
**What was ruled out:** Making fighting required (the request said bosses are optional). Lowering every boss's attack (the simulation showed the game is only about one turn shorter).

### Zombie Dog Boss

**What was asked:** Use the zombie dog as the park boss instead of the ice cream man.
**What was built:** `BOSSES.fang` replaces `icecream`. In `parseAction`, the cleaned-up text changes "zombie dog" and similar phrases into "fang" (now one of the `ZOMBIE_WORDS`) before survivor and teammate matching.
**Why this way:** This fixes the "dog" clash with Biscuit at the source, so every later check (recruiting, team orders, missing-survivor hints) sees the boss and the friendly dog as different things without any special cases.
**What was ruled out:** Removing "dog" from Biscuit's aliases (players naturally call Biscuit "the dog").
