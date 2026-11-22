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

### #5 — Stores and Rooms, Roads, Vehicles, Realistic Survivors

**Asked:** "Give each structure items, connect each area by roads (farther = more likely to get caught), make the side characters more realistic and less kid-like and able to die, and make a lot more things possible like driving into malls and hiding in specific stores." Follow-ups: "If I have a car or skateboard, tell me, and let me drive or ride it", "Vehicles should only come from roads or from side characters", and "There is a bug with starting the game."
**Status:** ✓ Done
**What was built:**
- Every place now has 3 to 5 stores or rooms (like the Samurai Shack, Hartley's fitting rooms, Pharmacy, Armory, Hunting Blind), each with its own description, items, and actions it is good for.
- 13 named roads connect the 10 places. You can travel anywhere; the game finds the shortest route and long trips are much more dangerous.
- 4 vehicles (car, motorcycle, mountain bike, skateboard) can only be found on roads (on a trip or by "search the street for a car") or from survivors. The panel lists them with how to use them. Faster vehicles make long trips safer. A car can crash through the doors of any building, but it gets wrecked.
- Survivors were rewritten as realistic adults with full names. Two new ones were added (Al Brennan and Rita Okafor). They have 2 hearts each, can take hits for you, and can die.
- Bug: the game crashed when starting a turn because it was opened mid-update (new town file with the old game screen). Fixed by finishing the update, and checked with a real browser playthrough.
**Files changed:** `src/world.js`, `src/words.js`, `src/stories.js`, `src/scenes/GameScene.js`, `src/scenes/SetupScene.js`, `src/main.js`
**Design note:** → [Session 1 — Stores, Roads, Vehicles](09-design-decisions.md)

### #6 — Team Orders, Name Banner, Free Small Actions, Stats Spreadsheet, Anti-Farming

**Asked:** "Make a spot for talking to the other survivors (just words like protect, fight, or hide). Make each player have their name on top of the screen on their turn. Don't count small actions like talking to survivors or stealing a car as full turns. At the end put the number of turns everyone took and their stats on a spreadsheet. Make sure there's always action everywhere so my cousins can't farm free turns to get a high score."
**Status:** ✓ Done
**What was built:**
- Team orders: "barry protect me", "team fight", "everyone hide", "luna follow me". Each teammate has an order (FOLLOW, PROTECT, FIGHT, HIDE) shown in a TEAM ORDERS section of the panel, and it changes how much they help and how often they take hits for you.
- A big colored name banner ("🎮 ANN'S TURN 🎮") at the top during each player's whole turn, with a different color per player.
- Small actions (talking to or recruiting survivors, giving orders, searching the street for a vehicle) don't end your turn, with a maximum of 2 per turn. They can still go wrong.
- Anti-farming: each street can only be searched for vehicles once, zombies gather if you stay at the same place turn after turn (danger grows each extra turn), danger still rises every round, and only full turns count toward stats and score.
- Game over shows a ranked stats table. Press S to download `undead-inc-results.csv` (opens in Excel or Google Sheets) with every game played on this computer: turns, small actions, hearts, places visited, miles, items, vehicles, survivors recruited and lost, fights won, times hurt, last action, and score.
**Files changed:** `src/scenes/GameScene.js`, `src/stories.js`, `src/words.js`, `src/main.js`, `src/scenes/SetupScene.js`
**Design note:** → [Session 1 — Team Orders and Stats](09-design-decisions.md)

### #7 — Advanced Cheater Test and Stupid-Answer Protection

**Asked:** "Can you run an advanced cheater test by making sure the word generator is prepared for stupid answers and doesn't give out free good results. An example of a stupid answer is like 'I will kill myself'."
**Status:** ✓ Done
**What was built:**
- Self-harm phrases ("kill myself", "kms", "want to die" and about 35 more) are refused with a calm message. The character never does it, the turn is not used, and the message reminds the player to talk to a trusted grown-up if they ever feel that way. (Before, "kill" made this count as a fight.)
- "Claim" answers that try to choose the outcome ("I survive", "nothing bad happens", "I get a katana", "without getting hurt", "skip my turn") are refused.
- Keyword stuffing (4 or more different action types in one answer) is refused with "pick ONE thing".
- About 50 more stupid answers now count as dumb moves (jump off the roof, eat glass, drink gasoline, invite them in, throw away my weapon...).
- "Go to the moon" style answers say that place doesn't exist instead of sending you somewhere random.
- Typing another cousin's name is refused (each cousin is in their own story).
- Loopholes closed: walking in and out of rooms is no longer almost risk-free (leaving a room used to be 100% safe), and going straight back to the place you just came from is extra dangerous ("zombies on your trail").
- "Hide behind Coach" or "fight with Barry" now counts as YOUR move, not an order for the teammate.
**Files changed:** `src/words.js`, `src/stories.js`, `src/scenes/GameScene.js`
**Design note:** → [Session 1 — Cheater Test](09-design-decisions.md)

### #8 — Stay on the Road When You Find a Vehicle

**Asked:** "Fix the issue where if you get a vehicle on the highway, instead of staying on the highway, you teleport back to your previous location." (Clarified: when you find a vehicle on the road, stay out on that road instead of being at a place.)
**Status:** ✓ Done
**What was built:** Every road segment (13) is now a place you can be. Each has its own zombie events, an intro, and "Abandoned Cars" you can search or hide behind, with a little loot. Finding a vehicle while traveling (on foot, bike, skateboard or motorcycle) stops you on that road. Finding one with "search the street" takes you out onto a nearby road. From a road, distances and risks to every town place are measured from the middle of the road. The opening story now only shows once per player.
**Files changed:** `src/world.js`, `src/stories.js`, `src/scenes/GameScene.js`
**Design note:** → [Session 1 — Roads as Places](09-design-decisions.md)

### #9 — Zombies Reach the Roads

**Asked:** "Make sure that zombies can get to the roads so you can't stay on the roads for that long. Also, make the roads extremely dangerous if you stay there for more than one turn."
**Status:** ✓ Done
**What was built:** On your first turn on a road there is a little extra danger and a warning that zombies are coming. If you are still on the same road the next turn, the zombies reach it: +30 hurt and +30 death danger, and +20 more for every turn after that. The story and side panel both warn you ("⚠⚠ ZOMBIES ON THE ROAD: EXTREME DANGER, LEAVE NOW!"). In testing, 46% of players who stayed died on their second turn there, and almost none lasted past turn 5.
**Files changed:** `src/scenes/GameScene.js`
**Design note:** → [Session 1 — Zombies Reach the Roads](09-design-decisions.md)

### #10 — Dying of Heartbreak

**Asked:** "Make it so that you can die of heartbreak if three of your friends die, so players can't get all their friends killed to save themselves." Follow-up: "Don't give them a warning so it will be funny if they randomly die of heartbreak. You can keep the hearts if you don't tell them you die if you get too many."
**Status:** ✓ Done
**What was built:** When a player's 3rd teammate dies (even while saving them), the player dies of heartbreak. The header says "ANN DIED OF HEARTBREAK 💔", and the game over screen and spreadsheet ("Died of heartbreak") show it too. The side panel shows a 💔 for each friend lost, but on purpose nothing warns that 3 is the limit.
**Files changed:** `src/scenes/GameScene.js`
**Design note:** → [Session 1 — Heartbreak](09-design-decisions.md)

### #11 — No Zombies in Cabinets; School Lockers Only

**Asked:** "Make it so that zombies can't be in cabinets, but can be in lockers only in the school."
**Status:** ✓ Done
**What was built:** Removed the "zombie in the cabinet" search death. When you hide in or search a cabinet, cupboard, or a locker outside the school, the game never picks a story where a zombie was inside it. Entering the radio tower's Supply Locker can't say it was full of zombies either. At the school, hiding in or searching lockers uses new locker scenes where zombies burst out, and there is a new school event where a row of lockers bangs open.
**Files changed:** `src/stories.js`, `src/world.js`, `src/scenes/GameScene.js`
**Design note:** → [Session 1 — Cabinets and Lockers](09-design-decisions.md)
