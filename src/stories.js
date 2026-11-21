const ACTIONS = {
  fight: {
    odds: [45, 35, 20],
    words: ['fight', 'fought', 'punch', 'kick', 'attack', 'hit', 'smash', 'whack', 'bash', 'swing', 'swung', 'slash', 'chop', 'stab', 'strike', 'struck', 'shoot', 'shot', 'fire at', 'beat', 'knock', 'kill', 'destroy', 'defeat', 'battle', 'take down', 'take out', 'stomp', 'crush', 'karate', 'kung fu', 'wrestl', 'tackl', 'headbutt', 'slap', 'bonk', 'uppercut', 'body slam', 'suplex', 'elbow', 'jab', 'pummel', 'clobber', 'wallop', 'thwack', 'fend off', 'fight back', 'take them on', 'charge at', 'slice', 'cut', 'behead', 'bat', 'baseball bat', 'sword', 'katana', 'axe', 'knife', 'crowbar', 'pan', 'frying pan', 'hammer', 'shovel', 'stick', 'hockey stick', 'crossbow', 'arrow', 'shield', 'pipe', 'club', 'spear', 'chainsaw', 'machete', 'weapon', 'lacrosse', 'golf club', 'wrench', 'rake', 'broom', 'umbrella', 'chair', 'lamp', 'brick', 'fist', 'ladle', 'mop', 'flip', 'squash', 'pound', 'shove', 'push', 'trip'],
    good: [
      '{name} grips {weapon} and goes full action-movie hero. One zombie goes down, then another, then another. When it is all over, {name} is standing alone, breathing hard, and totally victorious.',
      'BONK! {name} attacks with {weapon} and knocks the zombie flat on its back. It groans and does not get back up. Nobody messes with {name}.',
      '{name} fights like a legend, dodging grabby hands and striking back with {weapon}. The last zombie stumbles away like it just remembered it left the oven on.'
    ],
    hurt: [
      '{name} wins the fight with {weapon}, but not before a zombie gets a nasty scratch in. It stings like crazy.',
      'That zombie was a LOT tougher than it looked. {name} finally takes it down with {weapon}, but gets bitten on the arm in the struggle.',
      '{name} swings {weapon} and connects! But a second zombie was sneaking up from behind and gets a good chomp in before {name} shakes it off.'
    ],
    dead: [
      '{name} swings {weapon}... and misses. The zombie does not miss.',
      'There were way, WAY more zombies than {name} thought. {weapon} was not enough. The horde closes in.',
      '{name} charges in bravely with {weapon}, but trips over a curb at the worst possible moment. The zombies pile on.'
    ]
  },
  run: {
    odds: [60, 28, 12],
    words: ['run', 'ran', 'sprint', 'flee', 'fled', 'escap', 'jog', 'dash', 'race', 'racing', 'bolt', 'book it', 'get away', 'getaway', 'get out', 'take off', 'scram', 'hurry', 'hurri', 'rush', 'leave', 'retreat', 'back away', 'skedaddle', 'zoom', 'speed off', 'speed away', 'outrun', 'high tail', 'hightail', 'bail', 'evacuat', 'go away', 'move away', 'away from', 'far away', 'vamoose', 'peace out', 'skate', 'skateboard', 'bike', 'cycle', 'ride', 'rid', 'hop on', 'parkour', 'jump out', 'get out of here', 'move', 'go'],
    good: [],
    hurt: [],
    dead: []
  },
  drive: {
    odds: [50, 32, 18],
    words: ['drive', 'driv', 'drove', 'car', 'truck', 'van', 'jeep', 'motorcycle', 'motorbike', 'scooter', 'tractor', 'tow truck', 'bus', 'vehicle', 'steer', 'hotwire', 'floor it', 'gas pedal', 'honk', 'engine', 'ignition', 'keys', 'car keys', 'ambulance', 'police car', 'cop car', 'golf cart', 'go kart', 'limo', 'speed'],
    good: [],
    hurt: [],
    dead: []
  },
  climb: {
    odds: [60, 30, 10],
    words: ['climb', 'clamber', 'roof', 'rooftop', 'tree', 'ladder', 'scale', 'up high', 'higher', 'top of', 'on top', 'up the', 'balcony', 'fire escape', 'pole', 'fence', 'lamp post', 'billboard', 'jump onto', 'jump up', 'leap onto', 'hop onto', 'swing up', 'pull myself up', 'bleachers', 'stairs', 'upstairs', 'helipad', 'slide', 'jungle gym', 'monkey bars', 'water tower', 'branch', 'rope', 'cliff', 'jump on', 'shimmy', 'climb up', 'go up'],
    good: [
      '{name} scrambles up as fast as possible. Zombies cannot climb, so they just gather down below, moaning and reaching up with their gross gray hands. {name} is totally safe up here.',
      'From way up high, {name} can see the whole area and spots a safe way around the zombies. Smart move!',
      '{name} climbs higher and higher until the zombies are tiny groaning dots below. They lose interest and wander off after a while.'
    ],
    hurt: [
      '{name} slips halfway up and scrapes both knees on the way, but manages to pull up to safety. Ouch.',
      'A zombie grabs {name} by the shoe during the climb! {name} kicks free, but the zombie scratched an ankle.'
    ],
    dead: [
      'CRACK. The branch snaps, and {name} falls right into the middle of the zombies.',
      '{name} climbs all the way up... and finds out there was already a zombie up there, waiting.'
    ]
  },
  hide: {
    odds: [60, 30, 10],
    words: ['hide', 'hid', 'hidden', 'hiding spot', 'closet', 'under', 'underneath', 'duck', 'crouch', 'cover', 'bush', 'shelter', 'camouflag', 'lay low', 'lie low', 'stay still', 'freeze', 'froze', 'play dead', 'pretend to be', 'blend in', 'cabinet', 'locker', 'dumpster', 'behind', 'wardrobe', 'vent', 'trunk', 'bathroom', 'bathtub', 'stall', 'basement', 'attic', 'cupboard', 'fridge', 'box', 'tent', 'in the dark', 'stay put', 'keep still', 'curtain', 'bed', 'pantry', 'crawl space', 'bunker', 'cave', 'sewer', 'hole', 'disguise', 'dress up as', 'cover myself', 'zombie guts', 'act like a zombie', 'walk like a zombie', 'mannequin', 'statue', 'inside', 'shed'],
    good: [
      '{name} finds the perfect hiding spot and goes completely still. The zombies shuffle right past, so close {name} can smell them. Gross, but safe.',
      '{name} holds their breath. A zombie sniffs around for what feels like forever... then gives up and wanders away.',
      'Amazing hiding spot! Not even a zombie bloodhound could find {name} in there. The horde passes by without a clue.'
    ],
    hurt: [
      '{name} hides, but a zombie reaches into the hiding spot and gets a scratch in before losing interest.',
      "{name}'s hiding spot was full of broken glass and pointy junk. Safe from zombies, but very much not safe from splinters."
    ],
    dead: [
      "{name}'s hiding spot already had a zombie in it. It was hiding too. Not for the same reason.",
      'A zombie walks right past {name}... and then {name} sneezes. Game over.'
    ]
  },
  sneak: {
    odds: [60, 30, 10],
    words: ['sneak', 'snuck', 'quiet', 'tiptoe', 'tip toe', 'creep', 'crept', 'slowly', 'carefully', 'careful', 'crawl', 'stealth', 'silent', 'shh', 'shush', 'ninja', 'slip past', 'slip away', 'slip by', 'slip out', 'sneak past', 'softly', 'unnoticed', 'unseen', 'stay low', 'keep low', 'without a sound', 'no noise', 'hold my breath', 'hold breath', 'prowl', 'sidle', 'inch', 'edge past', 'go around', 'avoid', 'dodge', 'weav', 'zigzag', 'shadow', 'back door', 'side door', 'window', 'past them', 'past the', 'slip'],
    good: [
      '{name} tiptoes like a ninja, staying in the shadows the whole time. Not a single zombie notices a thing.',
      'Silent as a shadow, {name} slips right past the zombies. One of them turns around, sniffs the air, shrugs, and goes back to groaning.',
      '{name} creeps along so carefully that the zombies never even know {name} was there. Smooth.'
    ],
    hurt: [
      '{name} steps on a squeaky dog toy. SQUEAK! A zombie lunges and scratches {name} before {name} can slip away.',
      '{name} makes it past the zombies, but bumps into something sharp in the dark. Ow, ow, ow.'
    ],
    dead: [
      "{name}'s phone rings at the worst possible moment. It's Grandma, calling to ask if everyone is okay. Everyone is not okay.",
      '{name} steps on one crunchy leaf. Every single zombie turns around at once.'
    ]
  },
  barricade: {
    odds: [60, 30, 10],
    words: ['barricad', 'lock', 'block', 'board up', 'boards', 'board', 'fort', 'nail', 'shut', 'close', 'seal', 'blockade', 'furniture', 'couch', 'sofa', 'desk', 'table', 'dresser', 'bookshelf', 'wedge', 'chain', 'secure', 'fortify', 'build a wall', 'wall', 'brace', 'hold the door', 'stack', 'pile up', 'safe room', 'panic room', 'tape', 'door', 'gate', 'bolt the', 'reinforce', 'plank', 'build', 'defend', 'defense', 'hold them off', 'keep them out'],
    good: [
      '{name} drags furniture, boards and anything heavy in front of the doors and windows. The zombies bang and moan outside all night, but they cannot get in. {name} gets some rest.',
      'Locked, blocked and boarded up. {name} builds a fort so strong the zombies eventually just give up and wander away.',
      "{name}'s barricade holds! A zombie arm pokes through a gap, waves around sadly, and then pulls back out."
    ],
    hurt: [
      'A zombie arm smashes through the boards and scratches {name} before the barricade is finished.',
      '{name} hammers their own thumb while building the barricade. OUCH. The zombies are kept out, at least.'
    ],
    dead: [
      '{name} builds an amazing barricade in front of the front door... and forgets about the back door.',
      'The barricade was mostly made of cardboard boxes and pillows. It did not hold.'
    ]
  },
  trick: {
    odds: [55, 35, 10],
    words: ['distract', 'throw', 'threw', 'toss', 'chuck', 'yeet', 'trap', 'lure', 'noise', 'firework', 'decoy', 'trick', 'rock', 'stone', 'alarm', 'music', 'speaker', 'fire', 'burn', 'flame', 'smoke', 'bait', 'meat', 'bang', 'lighter', 'match', 'explo', 'bomb', 'dynamite', 'fool', 'bluff', 'mirror', 'whistle', 'clap', 'make a sound', 'car alarm', 'siren', 'sound', 'flare', 'confus', 'divert', 'over there', 'the other way', 'other direction', 'prank', 'perfume', 'candy', 'ice cream', 'bell', 'horn', 'drum', 'trombone', 'trumpet', 'firecracker', 'stink bomb', 'marble', 'banana peel', 'glue', 'net', 'tripwire', 'pit', 'lead them away', 'loud', 'shout over', 'yell over', 'make noise', 'kick a can', 'balloon', 'gorilla', 'build a fire', 'light a fire', 'start a fire', 'campfire', 'torch'],
    good: [
      '{name} makes a loud noise far away and every single zombie turns and shuffles toward it. Genius! {name} walks away like nothing happened.',
      "{name}'s trick works perfectly. The zombies are so confused that they start bumping into each other like bumper cars.",
      'Classic distraction. The zombies chase after the noise and {name} slips away, laughing quietly.'
    ],
    hurt: [
      'The trick only half worked. Most of the zombies chased the distraction, but one stayed behind and scratched {name}.',
      '{name} trips over their own trap. It was embarrassing AND it hurt.'
    ],
    dead: [
      'The zombies did not fall for it. They are smarter than they look. A little bit.',
      "{name}'s distraction worked TOO well. It brought every zombie for five miles, and they all came straight to {name}."
    ]
  },
  call: {
    odds: [55, 35, 10],
    words: ['call', 'phone', 'radio', 'signal', 'text', 'flare', 'walkie', 'message', 'army', 'police', '911', 'sos', 'mayday', 'beacon', 'broadcast', 'contact', 'national guard', 'helicopter', 'chopper', 'rescue team', 'send help', 'ask for help', 'cry for help', 'shout for help', 'yell for help', 'scream for help', 'call for help', 'wave down', 'smoke signal', 'morse', 'satellite', 'email', 'tweet', 'livestream', 'write help', 'paint help', 'antenna', 'microphone', 'intercom', 'speakers'],
    good: [
      'Someone answers! "We hear you, hang tight!" A few minutes later, a drone buzzes overhead and drops a care package for {name}.',
      "{name} reaches a group of survivors hiding across town. They can't come yet, but they send a supply drone right away!"
    ],
    hurt: [
      'The signal was SO loud that it attracted zombies from everywhere. {name} gets scratched while running for cover.',
      'Only static... and then a zombie grabs {name} from behind. {name} wriggles free, but gets hurt.'
    ],
    dead: [
      'The only ones listening to that signal were a giant horde of zombies. And they were VERY interested.',
      "All that noise led every zombie in town straight to {name}'s location."
    ]
  },
  heal: {
    odds: [65, 30, 5],
    words: ['heal', 'bandag', 'medicin', 'first aid', 'medkit', 'med kit', 'pill', 'rest', 'potion', 'wrap', 'patch up', 'patch', 'treat', 'cure', 'recover', 'band aid', 'bandaid', 'ointment', 'vitamin', 'stitch', 'splint', 'wound', 'disinfect', 'take a break', 'catch my breath', 'eat', 'snack', 'drink', 'water', 'energy drink', 'breathe', 'relax', 'calm down', 'heart'],
    good: [
      '{name} finds a quiet corner, patches up, and eats a snack. {name} feels SO much better.',
      '{name} takes a moment to clean up all the scratches and catch their breath. Ready for more zombies!'
    ],
    hurt: [
      'That was not medicine. That was very old cough syrup. {name} feels worse.',
      '{name} rested a little too long, and a zombie snuck up and scratched {name} before {name} could get away.'
    ],
    dead: [
      'While {name} was busy bandaging up, the zombies broke in.'
    ]
  },
  help: {
    odds: [50, 30, 20],
    words: ['help', 'save', 'rescu', 'protect', 'assist', 'carry', 'pull', 'aid', 'guard', 'shield them', 'cover them', 'free them', 'free the', 'unlock the', 'get them out', 'lift', 'support', 'escort', 'lead them', 'for them', 'the person', 'someone', 'survivor', 'people', 'kid', 'stranger', 'them out', 'hero', 'heroic'],
    good: [
      "{name} saves the day! The person {name} rescued says thank you about a hundred times and hands over a granola bar before running off to hide.",
      'Teamwork! {name} pulls the stranger to safety just in time, and they share some food before going their separate ways.',
      "{name} is a hero. Everyone is safe, and nobody had to get bitten."
    ],
    hurt: [
      '{name} saves them, but gets bitten during the rescue. Being a hero hurts sometimes.',
      'The person {name} rescued was a little bit clumsy and knocked {name} into a zombie by accident. Oops.'
    ],
    dead: [
      'The person calling for help turns around... and it was a zombie the whole time. Oops.',
      '{name} was really brave, but there were just too many zombies.'
    ]
  },
  supplies: {
    odds: [60, 30, 10],
    words: ['search', 'look', 'find', 'found', 'scaveng', 'loot', 'grab', 'take', 'took', 'pick up', 'collect', 'check', 'explor', 'investigat', 'raid', 'rummag', 'gather', 'steal', 'stole', 'open', 'inspect', 'dig through', 'go through', 'hunt for', 'shop', 'browse', 'supplies', 'supply', 'stuff', 'items', 'item', 'gear', 'equipment', 'weapon', 'tools', 'backpack', 'bag', 'food', 'ammo', 'medicine', 'batteries', 'pockets', 'drawer', 'shelf', 'shelves', 'store', 'cabinet', 'fridge', 'trunk', 'glovebox', 'crate', 'chest', 'treasure', 'pillage', 'plunder', 'salvage', 'stock up', 'pack', 'arm myself', 'get a', 'get some', 'what is here', 'useful'],
    strong: ['search', 'look for', 'look around', 'find', 'scaveng', 'loot', 'grab', 'pick up', 'collect', 'rummag', 'gather', 'steal', 'raid', 'hunt for', 'dig through', 'go through', 'stock up', 'explor', 'check'],
    good: [
      '{name} searches every corner of {place} carefully.'
    ],
    hurt: [
      '{name} digs through {place}, but a zombie was hiding behind a shelf and scratches {name} before {name} can get away.'
    ],
    dead: [
      '{name} reaches into the wrong cabinet. There was a zombie in it.',
      '{name} was so busy looting that the zombies snuck up from behind.'
    ]
  },
  recruit: {
    odds: [80, 15, 5],
    words: ['talk', 'ask', 'recruit', 'invite', 'team up', 'join', 'come with', 'follow me', 'befriend', 'make friends', 'friend', 'say hi', 'hello', 'hey', 'greet', 'introduc', 'trust', 'partner', 'buddy', 'pal', 'ally', 'alliance', 'together', 'shake hand', 'handshake', 'high five', 'fist bump', 'wave', 'go with', 'bring', 'adopt', 'pet', 'feed', 'good boy', 'good girl', 'who are you', 'offer', 'share', 'hire', 'team', 'squad', 'crew'],
    good: [],
    hurt: [],
    dead: [
      'While {name} was busy chatting, a horde of zombies snuck up on both of them. Bad timing.'
    ]
  },
  dumb: {
    odds: [5, 15, 80],
    words: ['sleep', 'nap', 'dance', 'danc', 'scream', 'give up', 'gave up', 'do nothing', 'nothing', 'cry', 'sing', 'selfie', 'party', 'sit down', 'lie down', 'lay down', 'take a bath', 'shower', 'watch tv', 'video game', 'fortnite', 'tiktok', 'karaoke', 'faint', 'pass out', 'surrender', 'wait', 'stand there', 'stay there', 'juggl', 'moonwalk', 'yodel', 'floss', 'dab', 'cartwheel', 'backflip', 'somersault', 'meditat', 'order pizza', 'snore', 'yell at', 'insult', 'tell a joke', 'make fun', 'stare'],
    strong: ['take a nap', 'go to sleep', 'fall asleep', 'run toward', 'run towards', 'run at them', 'run into the horde', 'walk up to', 'go up to', 'walk into', 'jump in', 'dive into', 'let them', 'let it bite', 'get bitten', 'become a zombie', 'eat a zombie', 'give up', 'surrender', 'do nothing', 'fight all of them', 'open the door for'],
    affection: ['hug', 'kiss', 'pet', 'lick', 'befriend', 'say hi', 'hello', 'high five', 'poke', 'tickle', 'cuddle', 'shake hand', 'invite', 'talk', 'ask', 'join', 'make friends', 'smile at', 'wave at', 'bite', 'taste', 'eat', 'feed', 'adopt', 'marry', 'date', 'sing to', 'dance with', 'play with', 'reason with', 'negotiat', 'apologiz', 'compliment'],
    good: [
      'Somehow, against all logic, that actually worked. The zombies are just as confused as everyone else. {name} lives to see another day!'
    ],
    hurt: [
      'That was a terrible, terrible idea. {name} barely escapes with a nasty bite mark and a lesson learned.'
    ],
    dead: [
      'The zombies did not appreciate that. {name} is now zombie lunch.',
      "That is... not how you survive a zombie apocalypse. Rest in peace, {name}.",
      '{name} made one very bad choice, and the zombies said thank you very much.'
    ]
  }
};

const TRAVEL_TEXT = {
  good: [
    '{name} cuts through backyards, jumps two fences, and makes it all the way to {dest} without a single scratch.',
    '{name} keeps low and moves fast, ducking behind cars and mailboxes the whole way. Finally, {dest} comes into view.',
    'It is a long, scary trip with zombies groaning on every street, but {name} makes it to {dest} in one piece.'
  ],
  drive: [
    '{name} jumps into the car, turns the key, and the engine roars to life! {name} floors it, honks at a few zombies on the way, and screeches into {dest}.'
  ],
  hurt: [
    '{name} makes it to {dest}, but a zombie hiding under a parked car grabs an ankle on the way. {name} kicks free, limping.',
    'Halfway to {dest}, {name} runs right into a zombie. After a scary struggle, {name} breaks free and makes it there, scratched up.'
  ],
  dead: [
    '{name} never makes it to {dest}. A horde was waiting just around the corner.',
    'On the way to {dest}, {name} takes a shortcut down an alley. It is a dead end. Full of zombies.'
  ]
};

const SACRIFICE_TEXT = 'But {friend} jumps in the way at the last second and pushes {name} to safety! {friend} holds the zombies back while {name} escapes... but {friend} does not make it out. 💔';

const MOVE_WORDS = ['go', 'went', 'head', 'walk', 'travel', 'move', 'ride', 'rid', 'visit', 'enter', 'return', 'back to', 'over to', 'to the', 'toward', 'towards', 'make my way', 'get to', 'run', 'ran', 'sprint', 'flee', 'escap', 'skate', 'bike', 'hike', 'jog', 'dash', 'race', 'drive', 'driv', 'sneak to', 'crawl to', 'hurry', 'rush', 'leave for', 'set off', 'journey', 'way to', 'cross', 'look for', 'find'];

const ZOMBIE_WORDS = ['zombie', 'them', 'it', 'monster', 'undead', 'horde', 'walker', 'corpse', 'ghoul', 'dead', 'creature', 'gary', 'henderson', 'lunch lady', 'hot dog', 'goalie', 'mannequin'];

const PRIORITY = ['fight', 'run', 'drive', 'climb', 'hide', 'sneak', 'barricade', 'trick', 'call', 'heal', 'help', 'supplies', 'dumb'];

const IDEAS = 'Try: run · hide · fight · climb · sneak · drive · trick · barricade · search · help · call · heal · talk to survivors · "go to" a place';

const SUFFIX = '(s|es|ed|d|ing|ning|ting|ping|ging|ming|bing|king|ling|er|ers|y|ily|ly)?';
const regexCache = {};
function has(text, word) {
  if (!regexCache[word]) regexCache[word] = new RegExp('\\b' + word + SUFFIX + '\\b');
  return regexCache[word].test(text);
}
const countHits = (text, words) => words.filter(w => has(text, w)).length;

function survivorHere(p) {
  const key = LOCATIONS[p.at].survivor;
  if (!key || p.team.includes(key) || p.lost.includes(key)) return null;
  return key;
}

function parseAction(typed, p) {
  const t = typed.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ');
  const here = LOCATIONS[p.at];

  const scores = {};
  for (const type of PRIORITY) scores[type] = countHits(t, ACTIONS[type].words);
  const aimedAtZombie = countHits(t, ZOMBIE_WORDS) > 0;
  scores.supplies += countHits(t, ACTIONS.supplies.strong);
  scores.dumb += countHits(t, ACTIONS.dumb.strong) * 2;
  if (aimedAtZombie) scores.dumb += countHits(t, ACTIONS.dumb.affection) * 2;

  const survivor = survivorHere(p);
  if (survivor && SURVIVORS[survivor].aliases.some(a => has(t, a))) return { type: 'recruit', survivor };

  let best = null, bestScore = 0;
  for (const type of PRIORITY) {
    if (scores[type] > bestScore) { best = type; bestScore = scores[type]; }
  }

  const place = Object.keys(LOCATIONS).find(k => k !== p.at && LOCATIONS[k].aliases.some(a => has(t, a)));
  if (place && best !== 'dumb' && (countHits(t, MOVE_WORDS) > 0 || !best || ['run', 'drive', 'sneak'].includes(best))) {
    if (!here.neighbors.includes(place)) {
      return { hint: `${LOCATIONS[place].name} is too far away from here! From ${here.name} you can get to: ${here.neighbors.map(n => LOCATIONS[n].name).join(', ')}.` };
    }
    return { type: 'travel', dest: place, via: best === 'drive' ? 'drive' : 'run' };
  }

  if (best !== 'dumb') {
    const recruitScore = countHits(t, ACTIONS.recruit.words);
    if (survivor && recruitScore > 0 && recruitScore >= bestScore) return { type: 'recruit', survivor };
    if (!best && recruitScore > 0) {
      return { hint: 'There is nobody here to talk to... except zombies, and they are terrible listeners. (Survivors can be found at some places around town!)' };
    }
  }

  if (!best) {
    return { hint: `Hmm, the game didn't understand what ${p.name} is trying to do. Try using an action word like run, hide, fight, climb, sneak, search, or "go to" a nearby place.` };
  }
  if (best === 'run' || best === 'drive') {
    return { type: 'travel', dest: Phaser.Utils.Array.GetRandom(here.neighbors), via: best };
  }
  return { type: best };
}

function moveOdds(odds, from, to, amount) {
  const min = [10, 5, 3][from];
  const moved = Math.max(0, Math.min(amount, odds[from] - min));
  odds[from] -= moved;
  odds[to] += moved;
}

function rollOutcome(baseOdds, boost, armor, round, repeated) {
  const odds = baseOdds.slice();
  moveOdds(odds, 2, 0, boost / 2);
  moveOdds(odds, 1, 0, boost / 2);
  if (armor) moveOdds(odds, 2, 1, 12);
  moveOdds(odds, 0, 2, (round - 1) * 4);
  if (repeated) moveOdds(odds, 0, 2, 15);

  const roll = Math.random() * 100;
  return roll < odds[0] ? 'good' : roll < odds[0] + odds[1] ? 'hurt' : 'dead';
}
