const ITEMS = {
  frying_pan: { name: 'a frying pan', short: 'Frying pan', desc: 'It is heavy and makes a very satisfying BONG sound. Way better than fighting with your fists!', boost: { fight: 10 } },
  flashlight: { name: 'a flashlight', short: 'Flashlight', desc: 'Now you can spot zombies in the dark before they spot you. Helps with sneaking and searching.', boost: { sneak: 15, supplies: 10, hide: 5 } },
  first_aid: { name: 'a first aid kit', short: 'First aid kit', desc: 'Bandages, ointment, the works. Type "heal" or "bandage" to use it and get back 2 hearts!', boost: { heal: 30 }, consumable: true },
  hockey_stick: { name: 'a hockey stick', short: 'Hockey stick', desc: 'Long reach, so the zombies stay a stick-length away from your face. Helps with fighting.', boost: { fight: 15 } },
  fireworks: { name: 'a box of fireworks', short: 'Fireworks', desc: 'Zombies go crazy for loud noises. Throw these to distract them!', boost: { trick: 30 } },
  rope: { name: 'a long rope', short: 'Rope', desc: 'Perfect for climbing up (or down) in a hurry. Also great for pulling people to safety.', boost: { climb: 25, help: 10 } },
  skateboard: { name: 'a skateboard', short: 'Skateboard', desc: 'Zoom! Running away and traveling to other places is safer now.', boost: { run: 15, travel: 15 } },
  car_keys: { name: 'a set of car keys', short: 'Car keys', desc: 'There is a dusty old car outside that these fit. Type "drive" to use it, or "drive to" a nearby place!', boost: { drive: 35, travel: 20 } },
  energy_drink: { name: 'an energy drink', short: 'Energy drink', desc: 'ULTRA ZOOM MAX! You feel like you could outrun a cheetah. Helps with running and traveling.', boost: { run: 15, travel: 10 } },
  crowbar: { name: 'a crowbar', short: 'Crowbar', desc: 'Good for bonking zombies AND for prying up boards to build barricades.', boost: { fight: 20, barricade: 15 } },
  helmet: { name: 'a motorcycle helmet', short: 'Helmet', desc: 'Zombies cannot bite through this! You are harder to kill now, no matter what you do.', armor: true },
  katana: { name: 'a katana', short: 'Katana', desc: 'A real samurai sword from the Samurai Shack in the food court. The best weapon in town!', boost: { fight: 35 } },
  walkie: { name: 'a walkie-talkie', short: 'Walkie-talkie', desc: 'Type "call" or "radio" to try to reach other survivors. They might send supplies!', boost: { call: 30 } },
  bat: { name: 'a baseball bat', short: 'Baseball bat', desc: 'The classic zombie-bonker. Helps a lot with fighting.', boost: { fight: 20 } },
  crossbow: { name: 'a crossbow', short: 'Crossbow', desc: 'Lets you attack zombies from far away, before they can get close. A great weapon!', boost: { fight: 30, help: 10 } },
  binoculars: { name: 'a pair of binoculars', short: 'Binoculars', desc: 'Spot zombies from far away so you can sneak around them or pick a safe path.', boost: { sneak: 15, travel: 10 } },
  riot_shield: { name: 'a riot shield', short: 'Riot shield', desc: 'A big see-through police shield. Harder to kill, and it helps when fighting.', boost: { fight: 10 }, armor: true },
  fire_axe: { name: 'a fire axe', short: 'Fire axe', desc: 'Big, red, and scary. Zombies should be afraid of YOU now. Helps with fighting and barricades.', boost: { fight: 30, barricade: 10 } },
  hammer_nails: { name: 'a hammer and a bag of nails', short: 'Hammer & nails', desc: 'Type "barricade" or "board up the door" to make a super sturdy fort.', boost: { barricade: 30, fight: 10 } },
  flare_gun: { name: 'a flare gun', short: 'Flare gun', desc: 'Shoot it into the sky to signal for help, or fire it near zombies to scare them off.', boost: { call: 30, trick: 20 } }
};

const SURVIVORS = {
  coach: {
    name: 'Coach Barry', aliases: ['coach', 'barry'],
    intro: 'In the middle of the gym, a big man in a red tracksuit is swinging a lacrosse stick at zombies and blowing a whistle at them. "TWO LAPS, YOU ROTTEN MAGGOTS!" It is Coach Barry, the gym teacher. He spots you and waves you over.',
    join: 'Coach Barry slaps you on the back so hard you almost fall over. "Alright, rookie! Stick with me and we will get through this. Hustle, hustle!" (Coach makes fighting and running safer.)',
    boost: { fight: 15, run: 10, travel: 5 }
  },
  biscuit: {
    name: 'Biscuit', aliases: ['biscuit', 'dog', 'puppy', 'doggy', 'doggo', 'pup'],
    intro: 'Under the slide, a scruffy golden retriever is curled up, shaking. It has a muddy red collar with a tag that says BISCUIT. It looks at you with big hopeful eyes and its tail thumps once on the ground.',
    join: 'Biscuit licks your whole face and wags so hard that their entire body wiggles. Biscuit has a super nose and growls whenever zombies get close! (Biscuit makes hiding and sneaking safer.)',
    boost: { hide: 15, sneak: 15, travel: 5 }
  },
  tank: {
    name: 'Tank', aliases: ['tank', 'mechanic'],
    intro: 'A pair of work boots is sticking out from under the tow truck. A woman in greasy overalls rolls out on a creeper, holding a giant wrench. "Name is Tank. I fix cars. Lately I have been fixing zombies too, if you know what I mean."',
    join: 'Tank wipes her hands on a rag and grins. "Anything with wheels, I can make it go. Anything with walls, I can make it stronger." (Tank makes driving, traveling and barricades safer.)',
    boost: { drive: 20, travel: 15, barricade: 10 }
  },
  luna: {
    name: 'Luna', aliases: ['luna', 'skater'],
    intro: 'A girl about your age zooms past on a skateboard, weaving between zombies like they are traffic cones. She kicks her board up into her hand and skids to a stop right next to you. "I am Luna. No offense, but you look like you need help."',
    join: 'Luna fist-bumps you. "I know every shortcut and hiding spot in this town. Stay close and stay quiet." (Luna makes sneaking, running and traveling safer.)',
    boost: { sneak: 15, run: 15, travel: 10 }
  },
  diaz: {
    name: 'Officer Diaz', aliases: ['officer', 'diaz', 'cop'],
    intro: 'Behind the front desk, a police officer with a bandaged arm is holding the door shut with her whole body. "Officer Diaz," she grunts. "You are the first living person I have seen in two days. Want to team up?"',
    join: 'Officer Diaz nods. "I have been trained for emergencies. Not exactly THIS emergency, but close enough." (Officer Diaz makes fighting, calling for help and rescuing people safer.)',
    boost: { fight: 15, call: 15, help: 10 }
  },
  priya: {
    name: 'Dr. Priya', aliases: ['priya', 'doctor', 'nurse'],
    intro: 'In a supply closet, a doctor in a white coat is stuffing bandages into a backpack. She jumps when she sees you, then sighs with relief. "Oh good, you are not a zombie. I am Dr. Priya. Are you hurt?"',
    join: 'Dr. Priya zips up her backpack. "I will come with you. Someone has to keep you patched up." (Dr. Priya makes healing and helping others much safer.)',
    boost: { heal: 25, help: 10 }
  },
  joe: {
    name: 'Grandpa Joe', aliases: ['grandpa', 'joe', 'old man', 'hunter'],
    intro: 'An old man in a camouflage hat is sitting on a stump, calmly whittling a stick while zombies groan in the distance. "Been living in these woods for forty years," he says without looking up. "Zombies are just loud deer, if you ask me."',
    join: 'Grandpa Joe stands up, his knees cracking loudly. "Alright, kiddo. I know a thing or two about hiding and setting traps." (Grandpa Joe makes hiding, tricks and climbing safer.)',
    boost: { hide: 15, trick: 15, climb: 10 }
  }
};

const LOCATIONS = {
  house: {
    name: 'Your House', aliases: ['house', 'home'],
    neighbors: ['school', 'park', 'gas'],
    items: ['frying_pan', 'flashlight', 'first_aid'],
    intro: 'Your house is quiet. Too quiet. The TV in the living room is still on, playing an emergency broadcast on repeat: "STAY INDOORS. DO NOT APPROACH THE INFECTED." Through the front window you can see your neighbor, Mr. Henderson, shuffling across his lawn in his bathrobe. He is definitely not okay anymore.',
    events: [
      { text: 'Something thumps against the back door. Then again. THUMP. THUMP. The door frame creaks and you can hear moaning on the other side. The front door is still clear... for now.', bonus: ['barricade', 'run', 'hide'] },
      { text: 'The power flickers and goes out. In the darkness, you hear glass breaking in the kitchen, followed by slow, dragging footsteps across the tile floor. Whatever it is, it is coming closer.', bonus: ['hide', 'sneak', 'fight'] },
      { text: 'Mr. Henderson has made it onto your porch. He is pressing his gray face against the window and leaving gross smudges on the glass. Three more zombies are stumbling up the driveway behind him.', bonus: ['barricade', 'trick', 'run'] }
    ]
  },
  school: {
    name: 'Lincoln Middle School', aliases: ['school', 'middle school', 'lincoln', 'classroom', 'gym'],
    neighbors: ['house', 'park', 'police'],
    items: ['hockey_stick', 'fireworks', 'rope'],
    survivor: 'coach',
    intro: 'The hallways of Lincoln Middle School are covered in scattered homework and knocked-over trash cans. The fire alarm light is still blinking, but it is not making any sound. Somewhere upstairs, a locker door is slamming open and shut, open and shut, open and shut.',
    events: [
      { text: 'A group of zombies in marching band uniforms is shuffling down the main hallway, still clutching their trumpets and tubas. One of them accidentally blows into a trombone. They have not spotted you yet, but they are heading your way.', bonus: ['sneak', 'hide', 'trick'] },
      { text: 'You hear a shout from the gym! Through the little window in the door, you can see someone trapped on top of the bleachers, surrounded by zombies reaching up at them.', bonus: ['help', 'fight', 'trick'] },
      { text: 'The cafeteria doors burst open and the lunch lady zombie comes charging out, still wearing her hairnet and swinging a giant soup ladle. Behind her, the mystery meat is... moving?', bonus: ['fight', 'run', 'barricade'] }
    ]
  },
  park: {
    name: 'Maple Park', aliases: ['park', 'maple', 'playground'],
    neighbors: ['house', 'school', 'sports', 'woods'],
    items: ['skateboard'],
    survivor: 'biscuit',
    intro: 'Maple Park used to be the best place in town for soccer games and ice cream. Now the swings creak back and forth in the wind, the ice cream truck sits abandoned with its jingle still playing, and zombies wander between the trees like they are out for a Sunday stroll.',
    events: [
      { text: 'The ice cream truck jingle is attracting every zombie in the neighborhood. A huge crowd is gathering around the truck, and you are standing right in their path.', bonus: ['sneak', 'hide', 'climb'] },
      { text: 'A zombie dog bursts out of the bushes, growling and drooling. It is fast, WAY faster than the regular zombies, and it is already sprinting toward you.', bonus: ['climb', 'trick', 'fight'] },
      { text: 'A thick fog rolls in over the park. You can barely see ten feet in front of you, but you can hear groaning coming from every direction at once.', bonus: ['hide', 'sneak', 'run'] }
    ]
  },
  gas: {
    name: 'Gas-N-Go Station', aliases: ['gas', 'gas station', 'gas n go', 'fuel', 'pump'],
    neighbors: ['house', 'mall'],
    items: ['car_keys', 'energy_drink', 'crowbar'],
    survivor: 'tank',
    intro: 'The Gas-N-Go is a little gas station with a convenience store attached. The neon sign buzzes and flickers. Chips and candy are scattered all over the floor inside, and one of the pumps is leaking a puddle that smells terrible. A tow truck is parked crooked by the garage.',
    events: [
      { text: 'A zombie in a Gas-N-Go uniform is stuck in the revolving door, spinning around and around. Every time it comes around, it gets a little closer to breaking free. Its name tag says "HI, I AM GARY."', bonus: ['fight', 'sneak', 'trick'] },
      { text: 'A massive pack of zombies is coming down the road toward the station, attracted by the buzzing neon sign. You have maybe one minute before they get here.', bonus: ['drive', 'run', 'barricade', 'trick'] }
    ]
  },
  mall: {
    name: 'Riverside Mall', aliases: ['mall', 'riverside', 'shopping', 'food court'],
    neighbors: ['gas', 'sports', 'hospital'],
    items: ['helmet', 'katana', 'walkie'],
    survivor: 'luna',
    intro: 'Riverside Mall is enormous: three floors of stores, a food court, and an indoor fountain that is somehow still splashing. The escalators are stuck, the lights are half on, and mannequins are knocked over everywhere. Some of the mannequins... are moving.',
    events: [
      { text: 'The "mannequins" in the clothing store window suddenly turn their heads toward you, all at the same time. Those are NOT mannequins. They step down out of the window display.', bonus: ['run', 'fight', 'hide'] },
      { text: 'You are on the second floor when you hear a rumble. A huge crowd of zombies is pouring in through the main entrance below and starting to crawl up the stuck escalators.', bonus: ['climb', 'hide', 'trick'] },
      { text: 'The food court smells like week-old pizza. A zombie in a giant hot dog costume is stumbling between the tables, blocking the only clear path to the exit.', bonus: ['fight', 'sneak', 'trick'] }
    ]
  },
  sports: {
    name: "Big Al's Sporting Goods", aliases: ['sporting', 'sports', 'sporting goods', 'big al', 'big als'],
    neighbors: ['park', 'mall'],
    items: ['bat', 'crossbow', 'binoculars'],
    intro: "Big Al's Sporting Goods has everything: bats, bikes, camping gear, and a giant inflatable gorilla on the roof. The front window is smashed, but it looks like nobody has had time to loot the place yet. A sign by the register says \"ZOMBIES PAY DOUBLE.\"",
    events: [
      { text: 'A zombie wearing full hockey goalie gear is guarding the aisle with all the best weapons. Its padding is so thick it barely notices when things bounce off it.', bonus: ['trick', 'sneak'] },
      { text: 'The giant inflatable gorilla on the roof comes loose and flops down over the front of the store, blocking the exit. You can hear zombies clawing at it from outside. Pop. Pop. Hiss.', bonus: ['climb', 'barricade', 'fight'] }
    ]
  },
  police: {
    name: 'Police Station', aliases: ['police', 'police station', 'cop station', 'precinct'],
    neighbors: ['school', 'hospital'],
    items: ['riot_shield', 'hammer_nails'],
    survivor: 'diaz',
    intro: 'The Police Station doors are wide open, and the lights on the cop cars outside are still spinning red and blue. Papers are scattered everywhere and a radio on the front desk crackles with static. The holding cells in the back are full... of zombies, rattling the bars.',
    events: [
      { text: 'CLANG! One of the holding cell doors swings open. A zombie in an orange jumpsuit stumbles out, followed by two more. They sniff the air and turn toward you.', bonus: ['fight', 'barricade', 'run'] },
      { text: 'The radio on the front desk crackles: "...anyone out there... survivors... head to the radio tower..." Then the zombies outside hear it too, and they start pounding on the windows.', bonus: ['call', 'barricade', 'hide'] }
    ]
  },
  hospital: {
    name: 'St. Mercy Hospital', aliases: ['hospital', 'st mercy', 'mercy', 'emergency room'],
    neighbors: ['police', 'mall', 'tower'],
    items: ['first_aid', 'first_aid', 'energy_drink'],
    survivor: 'priya',
    intro: 'St. Mercy Hospital is the creepiest place in town. The hallways are long and white, the lights flicker, and empty wheelchairs roll slowly down the halls by themselves. Or are they being pushed? Signs point to the Pharmacy, the Emergency Room, and the Roof Helipad.',
    events: [
      { text: 'The elevator dings. The doors slide open and it is PACKED with zombies in hospital gowns. They all turn to look at you at the exact same time.', bonus: ['run', 'fight', 'trick'] },
      { text: 'You find a supply room full of medicine, but the hallway behind you is filling up with zombie patients and zombie doctors. You are stuck in a dead end.', bonus: ['barricade', 'heal', 'hide'] },
      { text: 'A voice comes over the hospital speakers: "Any survivors, the roof helipad is clear!" But the stairwell up to the roof is crawling with zombies.', bonus: ['climb', 'sneak', 'call'] }
    ]
  },
  woods: {
    name: 'Whispering Woods', aliases: ['woods', 'forest', 'whispering'],
    neighbors: ['park', 'tower'],
    items: ['fire_axe', 'rope'],
    survivor: 'joe',
    intro: 'The Whispering Woods are thick and dark, with tall pine trees that block out the sun. A ranger shed sits beside the trail and a creek gurgles nearby. It is very quiet here, which could be good... or really, really bad.',
    events: [
      { text: 'Twigs snap all around you. Zombies are stumbling out from between the trees, and there are a LOT of them. At least they are slow out here, tripping over roots and mud.', bonus: ['climb', 'hide', 'sneak'] },
      { text: 'You find a campfire that someone left burning. The zombies seem scared of the fire and stay a few steps away from it, but more of them keep arriving every minute.', bonus: ['trick', 'hide', 'fight'] }
    ]
  },
  tower: {
    name: 'Old Radio Tower', aliases: ['tower', 'radio tower', 'hill'],
    neighbors: ['woods', 'hospital'],
    items: ['flare_gun'],
    intro: 'The Old Radio Tower stands on a hill outside town, a huge metal tower with a red light blinking at the very top. There is a little control shack at the bottom with a big old radio inside. If anyone out there is still alive, this is the place to reach them.',
    events: [
      { text: 'The big radio in the shack crackles to life: "...this is the National Guard... any survivors, send a signal..." But the noise has attracted zombies, and they are climbing the hill toward you.', bonus: ['call', 'barricade', 'climb'] },
      { text: 'A storm is rolling in. Lightning flashes, and in the light you see dozens of zombies standing around the bottom of the tower, staring up at the red blinking light like it is hypnotizing them.', bonus: ['call', 'hide', 'sneak'] }
    ]
  }
};

const PROLOGUE = 'It was a normal Saturday morning, until every phone in town started screaming with an emergency alert. ZOMBIES. Real ones. Nobody knows where they came from, but they are everywhere now.';
