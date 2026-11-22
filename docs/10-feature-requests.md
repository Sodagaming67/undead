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

### #12 — Secret Admin Mode

**Asked:** "Add a special secret command I can type to enter an admin mode where I am in control of the whole game."
**Status:** ✓ Done
**What was built:** On any turn, typing `zombie king 67` and pressing ENTER turns admin mode on (type it again or `/off` to turn it off). It doesn't use up the turn. While it's on, the typing cursor is a block (▮) instead of _, so only the admin can tell. Admin commands start with `/` and can name a player (no name = whoever's turn it is): `/heal`, `/hurt`, `/kill`, `/revive`, `/god` (every move works), `/curse` (next real move goes badly), `/give <item or all>`, `/vehicle <car/motorcycle/bike/skateboard/all>`, `/teleport <place>`, `/recruit <survivor>`, `/skip`, `/round <number>`, `/win`, `/items`, `/places`, `/help`. Commands never use up a turn.
**Files changed:** `src/scenes/GameScene.js`
**Design note:** → [Session 1 — Secret Admin Mode](09-design-decisions.md)

### #13 — Admin Control Panel (Chore Pool Style)

**Asked:** "Completely change the Admin screen to look advanced and more like the chore app admin screen."
**Status:** ✓ Done
**What was built:** Typing the secret code now opens a full admin control panel on top of the game, styled like Chore Pool's dark mode (same colors, cards, rounded buttons, pills, "Only you can see this" badge and pop-up messages). It has summary boxes for the round, players alive, whose turn it is and god mode. Each player has a card with hearts, location, items, vehicles, team and turns. The card's buttons are Heal, Hurt, God mode, Curse, Make winner and Kill/Revive, and there are dropdowns to Teleport, Give an item, Give a vehicle and Recruit a survivor. A Game panel has a round − / + stepper, Skip turn and Heal everyone. A red "Admin mode" panel has "Turn off admin mode" (which also clears god mode and curses). Esc, Close, or clicking outside hides the panel. The typed `/` commands from #12 were replaced by the panel.
**Files changed:** `src/admin.js` (new), `src/scenes/GameScene.js`, `index.html`
**Design note:** → [Session 1 — Admin Control Panel](09-design-decisions.md)

### #14 — Admin Minimap and Zombie Control

**Asked:** "Give the admin a top view 2D minimap of the world with all the players' exact locations on it. Also give the admin full control of how many zombies there are in specific places and the power to change it, as well as the number of zombies on the entire map."
**Status:** ✓ Done
**What was built:** Every place and road now has a zombie count (normal: house 6, school 25, park 15, gas 10, mall 40, sporting goods 20, police 15, hospital 35, woods 8, tower 5, each road 12). More zombies than normal makes actions there more dangerous, fewer makes them safer, and zero zombies means nothing bad can happen there. The story tells the player when a place is quiet, crowded, or overrun. The admin panel has a "Town map": a top-down map of all 10 places and 13 roads, colored from teal (no zombies) to red (overrun), with each place's zombie count and a colored dot with the first letter of each player's name at their exact location. The player whose turn it is gets a white ring, and dead players show a 💀. Hovering a dot shows which store or room they're in. Clicking a place or road selects it, and the editor next to the map changes its zombies with a slider, −10/−1/+1/+10, and Clear/Normal/Horde/Overrun buttons. A "Whole town" box shows the total and sets every place at once (slider 0–600%, or None/Half/Normal/×2/×5). Counts reset each new game.
**Files changed:** `src/admin.js`, `src/scenes/GameScene.js`
**Design note:** → [Session 1 — Minimap and Zombie Counts](09-design-decisions.md)

### #15 — Admin Controls the Turn Order

**Asked:** "Make it so that the admin can control who goes next so they don't have to play."
**Status:** ✓ Done
**What was built:** Each player card in the admin panel has a "Turns" row. **Go next** picks who plays after the current turn (click again to cancel). **Play now** switches the turn to that player right away. **Sit out** takes a player out of the turn order without killing them, so the admin can run the game without playing, and **Back in the game** returns them. Pills show "Up next" and "Sitting out". The Game box shows who is up next, who is sitting out, and a "Use normal order" button. Players who sit out show as "(watching)" in the top bar. They never get turns, don't count when deciding the last survivor, and show as "SAT OUT" on the game over screen and "Sat out" in the spreadsheet. You can't make the last playing player sit out. If every playing player dies, the game ends with "Nobody survived!"
**Files changed:** `src/scenes/GameScene.js`, `src/admin.js`
**Design note:** → [Session 1 — Turn Order Control](09-design-decisions.md)

### #16 — Deadly Woods Between the Roads

**Asked:** "Add some woods between the roads that people can run into, but make the woods extremely dangerous."
**Status:** ✓ Done
**What was built:** Four patches of dark woods sit in the spaces between the roads: Crooked Pines, Blackthorn Forest, Deadfall Thicket and Hollow Timber. From a road beside them, type something like "run into the trees", "hide in the bushes", "run into the woods" or a forest's name to go in. On Trail Road, "the woods" still means Whispering Woods. The side panel on a road lists any woods beside it. Inside the woods, "run back to the road", "get out of the woods" or just "run" takes you out to one of the roads around it. You can also travel straight to a town place, but vehicles can't go through the trees. Going in, staying, and getting out are all extremely dangerous: about 1 in 3 moves kills you and about 1 in 2 hurts you, and it gets worse every turn you stay. As a reward, each forest has a Bone Clearing with a great item (crossbow, katana, machete or bulletproof vest) and a Hollow Tree with a first aid kit. The woods have 50 zombies each and show on the admin map as green tree patches the admin can click and change. The admin can also teleport players into them.
**Files changed:** `src/world.js`, `src/stories.js`, `src/scenes/GameScene.js`, `src/admin.js`
**Design note:** → [Session 1 — Deadly Woods](09-design-decisions.md)

### #17 — Woods Fill Every Space Between the Roads

**Asked:** "Make the woods space fill in every empty space between roads."
**Status:** ✓ Done
**What was built:** On the admin map, each forest is now the full shape of the space between its roads, filled with a dark green pine tree pattern, instead of a small oval. Clicking anywhere in a forest selects it. The one empty space that had no woods (between Maple Park, Big Al's Sporting Goods, Riverside Mall and Trail Road) is now a fifth forest, **Gravewood**, with a riot shield in its Bone Clearing. Hollow Timber now fills the whole space down to Route 9, Trail Road and the Old Logging Road, so you can also enter it from those roads.
**Files changed:** `src/admin.js`, `src/world.js`
**Design note:** → [Session 1 — Woods Fill the Gaps](09-design-decisions.md)

### #18 — Escape by Helicopter or Subway to Win

**Asked:** "To win the game, add an escape route out of the map in two random forests (one is a subway, the other a helicopter). Have three random places with items you need to start the escape vehicles. Every cousin can get one of each item, but can't take more than one of an item. Change the places for the escape items every round, but never put them in forests or small places inside a main place."
**Status:** ✓ Done
**What was built:** Each new game puts a 🚁 Helicopter in one random forest and a 🚇 Subway in a different one. There are three escape items: ⚡ Power Cell, 🔑 Master Key and 📋 Escape Codes. You need all three to start either escape. Each item is at a different random main town place (never a forest, road, or store/room inside a place). At the start of every round, all three move to new places. Searching anywhere at that place (outside or inside any of its stores or rooms) finds the item if the search doesn't kill you. Every cousin can pick up their own copy, but nobody can carry more than one of each. Inside the escape forest, with all three items, typing something like "fly the helicopter", "take the subway" or "escape" wins the game right away: a special ending story, "ESCAPED!" on the game over screen, and "Escaped by helicopter/subway" in the spreadsheet. Without all the items, the game tells you what's missing and where it is this round, and it doesn't use up your turn. The side panel shows where both escapes are, which items you have, and where the missing ones are. Places in the road list show the item icon, and the story tells you when an escape item or escape vehicle is where you are. "Call a helicopter" is still a normal call for help. The admin map shows 🚁/🚇 on the escape forests and item icons on their places. The admin panel has an Escape box (where everything is, "Move escape items now", "Move helicopter & subway") and lets the admin give each player escape items. Changing the round in the admin panel also moves the items.
**Files changed:** `src/world.js`, `src/scenes/GameScene.js`, `src/admin.js`
**Design note:** → [Session 1 — Escape to Win](09-design-decisions.md)

### #19 — House Traps and a Bunker

**Asked:** "Make advanced survival options possible, like setting up traps in your house using random house stuff, or building a bunker. Make sure the bunker can only survive a few turns, and explain clearly how the traps work or fail."
**Status:** ✓ Done
**What was built:** At Your House, "set a trap" (or "booby trap the door", "set a marble trap", etc.) builds one of 8 traps from house stuff. You can name one or get a random one: Marble Floor 60%, Pots & Pans Tripwire 55%, Lego Minefield 50%, Paint Bucket Door 55%, Slippery Kitchen 65%, Thumbtack Carpet 45%, Falling Bookshelf 60%, Mousetrap Wall 40%. Duct tape, rope or a hammer & nails adds +10% (up to 85%). Setting a trap takes the turn and is risky like barricading. The game explains exactly how it works: the next time zombies would hurt or kill you at Your House, the oldest trap goes off with its chance. "🪤 TRAP WORKED!" stops the attack, and "🪤 TRAP FAILED!" lets it through, each with a reason and the chance shown. A trap is used up either way. You can have up to 3 at once, and they only protect you at your house. "Build a bunker" takes 2 turns. "Go into the bunker" seals you in: nothing can hurt you, but you can only wait or leave. It holds for 3 turns (strength ■■■ → □□□, with a big warning on the last one). Staying one more turn breaks it: the zombies pour in (about 29% death, 60% hurt) and the bunker is destroyed. "Leave the bunker" gets you out safely and keeps the strength it has left. The side panel at the house shows your traps and bunker status, the footer reminds you of the options, and the admin player cards show 🪤 and 🛡. Trying it away from the house tells you to go home first.
**Files changed:** `src/world.js`, `src/stories.js`, `src/scenes/GameScene.js`, `src/admin.js`
**Design note:** → [Session 1 — Traps and Bunker](09-design-decisions.md)

### #20 — Skills With Starting Kits

**Asked:** "Add an area after choosing your name for choosing your skill, like trapping (a trapper can build traps faster and better). Also give each skill a set of stuff to help them (like a fighter gets a katana and a medkit)."
**Status:** ✓ Done
**What was built:** After typing a name and pressing ENTER, a "Choose a skill for ___" screen lists 7 skills, each with its power and starting items. Press 1–7, R for random, or BACKSPACE to go back and change the name. The name list shows each cousin's skill. Skills: ⚔️ Fighter (fights +20%; katana, first aid kit), 🪤 Trapper (setting a trap is a free small action, traps +20% chance up to 95%, up to 5 traps; duct tape, rope), 🔨 Builder (barricades +25%, bunker built in 1 turn and holds 4 turns; hammer & nails, crowbar), 🩺 Medic (healing +25% and +1 extra heart; 2 first aid kits, water bottle), 🏃 Runner (running/travel +15%, trips 25% less risky; energy drink, hiking boots), 🥷 Sneak (sneak/hide +20%; flashlight, binoculars), 🎒 Scavenger (searching +20%, finds 2 items at once when a room has 2 left; road map, pepper spray). Skill bonuses show in "Helped by", the side panel shows SKILL, the admin cards show a skill pill, and "play again" keeps everyone's skills.
**Files changed:** `src/world.js`, `src/scenes/SetupScene.js`, `src/scenes/GameScene.js`, `src/stories.js`, `src/admin.js`
**Design note:** → [Session 1 — Skills](09-design-decisions.md)

### #21 — Boss Zombies That Really Attack

**Asked:** "Make it so that zombies like Mr. Henderson, the gas station zombie, and the school band zombies actually attack you."
**Status:** ✓ Done
**What was built:** Three boss zombies with health: 🧟 Mr. Henderson at Your House (❤❤, 45% to hit), Gas Station Gary at the Gas-N-Go (❤❤, 50%), and The Zombie Marching Band at the school (❤❤❤, 45%). While a boss is alive at your place, the story and side panel say it's there and show its health. After your move, it attacks every turn you're there. The chance is halved on the turn you arrive, when you run away, or when you hide or sneak well. The result clearly says "ATTACKS!" with what happened and the -1 ❤, or "ATTACKS... and MISSES!" with the chance. Bites can make you lose an extra heart on top of a bad result, and can kill you. At your house, a trap can stop Mr. Henderson's bite. God mode cancels bites. If a place has 0 zombies (admin), its boss stays away. Fighting at a boss's place ("fight Mr. Henderson", "fight Gary", "fight the band") hits the boss when the fight goes well. The boss loses a heart and is too staggered to hit back that turn. Boss fights don't count as repeated moves. Beating a boss gives 🏆 a reward (golf club, motorcycle helmet, air horn) and removes its events from that place. Each cousin has their own bosses. Admin player cards show 🏆 bosses beaten. Test: with a katana you beat Henderson 78% of the time. With only a bat, the band wins about 2 out of 3 fights.
**Files changed:** `src/world.js`, `src/scenes/GameScene.js`, `src/admin.js`
**Design note:** → [Session 1 — Boss Zombies](09-design-decisions.md)
