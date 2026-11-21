const SCENARIOS = [
  { text: 'A horde of zombies is shuffling down your street, straight toward your house.', bonus: ['barricade', 'hide', 'drive'] },
  { text: 'You wake up on the floor of a grocery store. Something is groaning in the next aisle.', bonus: ['sneak', 'supplies'] },
  { text: 'A zombie dog is growling at you from across the park. It looks hungry.', bonus: ['climb', 'trick', 'run'] },
  { text: 'Your car runs out of gas on a dark highway. Shapes are moving in the trees.', bonus: ['run', 'sneak', 'call'] },
  { text: 'You hear someone yelling for help from inside a school bus surrounded by zombies.', bonus: ['help', 'fight', 'trick'] },
  { text: "You're starving. There's a pizza place across the street... and it's full of zombies.", bonus: ['trick', 'sneak', 'supplies'] },
  { text: 'CRASH! A zombie bursts through your bedroom window!', bonus: ['fight', 'run'] },
  { text: 'You find an old radio tower. Maybe you can reach other survivors.', bonus: ['call', 'climb'] },
  { text: "It's night. The zombies are creeping closer to your campfire.", bonus: ['hide', 'climb', 'trick'] },
  { text: "You're stuck on the roof of the mall. The stairs are packed with zombies.", bonus: ['trick', 'call'] },
  { text: 'A GIANT zombie wearing a football helmet is blocking the only bridge out of town.', bonus: ['trick', 'drive', 'sneak'] },
  { text: 'You got scratched yesterday and you feel kind of... funny.', bonus: ['heal', 'call'] },
  { text: 'Zombies have surrounded the hospital you are hiding in.', bonus: ['barricade', 'hide', 'heal'] },
  { text: 'A zombie in a clown costume is honking a bike horn at you. Why is it doing that?!', bonus: ['run', 'fight', 'drive'] },
  { text: 'You find a backpack on the ground. A zombie is lying next to it. Is it sleeping?', bonus: ['sneak', 'fight', 'supplies'] }
];

const ACTIONS = {
  dumb: {
    words: ['hug', 'pet', 'kiss', 'lick', 'befriend', 'say hi', 'hello', 'high five', 'sleep', 'nap', 'dance', 'scream', 'poke', 'bite', 'give up', 'nothing', 'sit', 'cry', 'taste', 'join'],
    odds: [5, 15, 80],
    good: ['Somehow, against all logic, that worked. The zombies are just as confused as everyone else. {name} lives!'],
    hurt: ['That was a terrible idea. {name} barely escapes with a nasty bite mark.'],
    dead: ['The zombies did not appreciate that. {name} is now zombie lunch.', "That's... not how you survive a zombie apocalypse. RIP {name}.", '{name} made one very bad choice. The zombies say thank you.']
  },
  run: {
    words: ['run', 'sprint', 'flee', 'escape', 'jog', 'dash', 'race', 'leave'],
    odds: [60, 30, 10],
    good: ['{name} runs like the wind! The slow zombies never stood a chance.', '{name} sprints away and leaves the zombies in the dust.', 'Legs pumping, {name} escapes down an alley. Safe for now!'],
    hurt: ['{name} trips over a trash can and a zombie gets a scratch in before {name} escapes.', '{name} gets away, but twists an ankle doing it.'],
    dead: ['{name} runs straight into a dead end. Uh oh.', '{name} runs right into an even BIGGER group of zombies.']
  },
  hide: {
    words: ['hide', 'closet', 'under', 'duck', 'crouch', 'basement', 'attic', 'cover', 'bush'],
    odds: [60, 30, 10],
    good: ['{name} hides perfectly. The zombies shuffle right past.', '{name} holds their breath. The zombies sniff around... and leave.', 'Great hiding spot! Not even a zombie bloodhound could find {name}.'],
    hurt: ['{name} hides, but a zombie reaches in and gets a scratch before giving up.', "{name}'s hiding spot was full of broken glass. Ouch."],
    dead: ["{name}'s hiding spot already had a zombie in it.", 'A zombie hears {name} sneeze. Game over.']
  },
  fight: {
    words: ['fight', 'punch', 'kick', 'attack', 'hit', 'smash', 'bat', 'sword', 'axe', 'knife', 'shoot', 'gun', 'kill', 'stab', 'shovel', 'pan', 'crowbar', 'hammer', 'karate', 'bow'],
    odds: [45, 35, 20],
    good: ['{name} goes full action hero and takes down the zombies. Epic!', 'BONK! {name} knocks the zombie flat. Nobody messes with {name}.', '{name} fights like a legend. The zombies are running away now.'],
    hurt: ['{name} wins the fight, but not without getting bitten on the arm.', 'The zombie was tougher than it looked. {name} wins, but gets hurt.'],
    dead: ['{name} swings and misses. The zombie does not miss.', 'There were way more zombies than {name} thought.']
  },
  climb: {
    words: ['climb', 'roof', 'tree', 'ladder', 'jump', 'wall'],
    odds: [60, 30, 10],
    good: ["{name} climbs up high. Zombies can't climb, so they just groan angrily below.", "From way up high, {name} can see a safe path out. Nice!", '{name} scrambles up and is totally safe.'],
    hurt: ['{name} slips halfway up and scrapes both knees, but makes it.', 'A zombie grabs a shoe as {name} climbs. Close call!'],
    dead: ['The branch snaps. {name} lands right in the middle of the zombies.', "{name} climbs up... and there's a zombie on the roof too."]
  },
  drive: {
    words: ['drive', 'car', 'truck', 'bike', 'bus', 'motorcycle', 'scooter', 'skateboard', 'tractor', 'tank', 'helicopter', 'boat'],
    odds: [55, 30, 15],
    good: ['VROOM! {name} speeds away, honking at the zombies on the way out.', '{name} finds the keys still in it and gets out of there fast.', '{name} rides off like a movie star. Zombies everywhere are jealous.'],
    hurt: ['{name} crashes into a mailbox. A little banged up, but safe.', "It took forever to start. A zombie grabbed {name}'s arm before it finally did."],
    dead: ['Out of gas. Surrounded. Bad luck, {name}.', "{name} drives straight into a zombie pile-up and can't get out."]
  },
  sneak: {
    words: ['sneak', 'quiet', 'tiptoe', 'creep', 'slowly', 'carefully', 'crawl', 'stealth'],
    odds: [60, 30, 10],
    good: ['{name} tiptoes like a ninja. Not a single zombie notices.', "Silent as a shadow, {name} slips right past them.", '{name} sneaks by so well the zombies will never know.'],
    hurt: ['{name} steps on a squeaky toy. A zombie lunges and scratches {name}.', '{name} sneaks past, but bumps into something sharp in the dark.'],
    dead: ["{name}'s phone rings at the worst possible moment.", '{name} steps on a crunchy leaf. Every zombie turns around.']
  },
  barricade: {
    words: ['barricade', 'lock', 'block', 'board', 'door', 'fort', 'fence', 'nail', 'shut', 'close'],
    odds: [60, 30, 10],
    good: ["{name} builds a fort so strong the zombies just give up.", 'Locked, blocked, and boarded. {name} is safe inside.', "{name}'s barricade holds! The zombies bang on it all night, but can't get in."],
    hurt: ['A zombie arm breaks through the boards and scratches {name}.', '{name} hammers their own thumb building the barricade. Ouch!'],
    dead: ['{name} forgot to lock the back door.', 'The barricade was made of cardboard. It did not hold.']
  },
  supplies: {
    words: ['food', 'eat', 'water', 'loot', 'search', 'grab', 'supplies', 'store', 'shop', 'backpack', 'snack', 'pizza', 'look'],
    odds: [50, 35, 15],
    good: ['{name} finds a bag full of snacks, water, and a flashlight. Jackpot!', '{name} loots the place clean and gets out safe.', '{name} finds supplies and a cool hat. Survival is going great.'],
    hurt: ['{name} grabs some food, but a zombie was hiding behind the shelf.', "{name} ate something that was waaay past its expiration date."],
    dead: ['{name} reached into the wrong cabinet. There was a zombie in it.', '{name} was so busy looting that the zombies snuck up from behind.']
  },
  help: {
    words: ['help', 'save', 'rescue', 'friend', 'together', 'team', 'protect', 'carry'],
    odds: [50, 30, 20],
    good: ['{name} saves the day! The rescued survivor gives {name} a high five.', 'Teamwork! {name} and a new friend fight their way out together.', "{name} is a hero. Everyone's safe."],
    hurt: ['{name} saves them, but takes a bite doing it.', 'The person {name} rescued was a little bit clumsy. {name} gets hurt.'],
    dead: ['The person calling for help was actually a zombie. Oops.', '{name} was brave, but there were just too many zombies.']
  },
  call: {
    words: ['call', 'phone', 'radio', 'signal', 'text', 'flare', 'walkie', 'message', 'army', 'police'],
    odds: [55, 35, 10],
    good: ['Someone answers! A helicopter swoops in and drops supplies for {name}.', "{name} reaches a group of survivors. They're sending help!", '{name} gets through. Help is on the way!'],
    hurt: ['The signal was so loud it attracted zombies. {name} gets scratched running away.', 'Only static... and then a zombie grabs {name} from behind. {name} escapes, hurt.'],
    dead: ['The only one listening to the radio was a zombie horde.', 'All that noise led every zombie in town straight to {name}.']
  },
  trick: {
    words: ['distract', 'throw', 'trap', 'lure', 'noise', 'firework', 'decoy', 'trick', 'rock', 'alarm', 'music', 'fire', 'smoke', 'bait', 'meat'],
    odds: [60, 30, 10],
    good: ['{name} throws something and all the zombies chase after it. Genius!', "{name}'s trap works perfectly. The zombies fall right in.", 'Classic distraction. {name} walks away like nothing happened.'],
    hurt: ['The trick half-worked. One zombie stayed behind and scratched {name}.', '{name} tripped over their own trap. Embarrassing AND painful.'],
    dead: ['The zombies did not fall for it.', "{name}'s distraction worked a little too well and brought every zombie for miles."]
  },
  heal: {
    words: ['heal', 'bandage', 'medicine', 'first aid', 'doctor', 'pill', 'rest', 'medkit', 'potion', 'hospital'],
    odds: [70, 25, 5],
    good: ['{name} patches up and feels way better!', '{name} finds a first aid kit. Good as new!', 'A little medicine and {name} is ready for more zombies.'],
    hurt: ['That was not medicine. That was cough syrup from 1987.', '{name} rested too long and a zombie snuck up.'],
    dead: ['While {name} was busy healing, the zombies broke in.']
  },
  unknown: {
    words: [],
    odds: [35, 40, 25],
    good: ['Nobody knows what {name} just did, including the zombies. It worked though!', 'The zombies are so confused by {name} that they just walk away.'],
    hurt: ["That plan didn't really make sense. {name} gets hurt in all the confusion.", "{name} tries it, but the zombies aren't impressed. Ouch."],
    dead: ['That plan did not work. At all. Goodbye, {name}.', "{name}'s weird plan backfired big time."]
  }
};

const IDEAS = 'Ideas: run · hide · fight · climb · sneak · drive · trick · barricade · search · help · call · heal';

function findAction(typed) {
  const t = typed.toLowerCase();
  const hits = word => new RegExp('\\b' + word).test(t);
  if (ACTIONS.dumb.words.some(hits)) return 'dumb';
  let best = 'unknown', bestCount = 0;
  for (const name in ACTIONS) {
    if (name === 'dumb' || name === 'unknown') continue;
    const count = ACTIONS[name].words.filter(hits).length;
    if (count > bestCount) { best = name; bestCount = count; }
  }
  return best;
}

function moveOdds(odds, from, to, amount) {
  const min = from === 0 ? 10 : 0;
  const moved = Math.max(0, Math.min(amount, odds[from] - min));
  odds[from] -= moved;
  odds[to] += moved;
}

function rollOutcome(action, scenario, round, repeated) {
  const data = ACTIONS[action];
  const odds = data.odds.slice();
  if (scenario.bonus.includes(action)) {
    moveOdds(odds, 2, 0, 10);
    moveOdds(odds, 1, 0, 10);
  }
  moveOdds(odds, 0, 2, (round - 1) * 4);
  if (repeated) moveOdds(odds, 0, 2, 15);

  const roll = Math.random() * 100;
  const result = roll < odds[0] ? 'good' : roll < odds[0] + odds[1] ? 'hurt' : 'dead';
  return { result, text: Phaser.Utils.Array.GetRandom(data[result]) };
}
