const ITEMS = {
  frying_pan: { name: 'a cast-iron frying pan', short: 'Frying pan', desc: 'Heavy enough to really hurt. Better than fighting with your fists.', boost: { fight: 10 } },
  kitchen_knife: { name: 'a kitchen knife', short: 'Kitchen knife', desc: 'Short, so you have to get close. Better than nothing in a fight.', boost: { fight: 12 } },
  canned_food: { name: 'some canned food', short: 'Canned food', desc: 'Type "eat" or "heal" to use it and get back 1 heart.', boost: { heal: 15 }, heals: 1 },
  water_bottle: { name: 'a bottle of water', short: 'Water bottle', desc: 'Type "drink" or "heal" to use it and get back 1 heart.', boost: { heal: 10 }, heals: 1 },
  first_aid: { name: 'a first aid kit', short: 'First aid kit', desc: 'Bandages, antiseptic, the works. Type "heal" or "bandage" to use it and get back 2 hearts.', boost: { heal: 30 }, heals: 2 },
  flashlight: { name: 'a flashlight', short: 'Flashlight', desc: 'Spot zombies in the dark before they spot you. Helps with sneaking and searching.', boost: { sneak: 15, supplies: 10, hide: 5 } },
  duct_tape: { name: 'a roll of duct tape', short: 'Duct tape', desc: 'Fixes almost anything. Helps with barricades.', boost: { barricade: 15 } },
  golf_club: { name: 'a golf club', short: 'Golf club', desc: 'A long metal driver. Good reach for keeping zombies back.', boost: { fight: 15 } },
  hockey_stick: { name: 'a hockey stick', short: 'Hockey stick', desc: 'Long reach, so the zombies stay a stick-length away. Helps with fighting.', boost: { fight: 15 } },
  lighter: { name: 'a lighter', short: 'Lighter', desc: 'Fire scares zombies and makes great distractions. Helps with tricks.', boost: { trick: 20 } },
  fire_extinguisher: { name: 'a fire extinguisher', short: 'Extinguisher', desc: 'Spray it to blind zombies in a white cloud, or swing it. Helps with tricks and fighting.', boost: { trick: 20, fight: 15 } },
  rope: { name: 'a long rope', short: 'Rope', desc: 'For climbing up (or down) in a hurry, or pulling people to safety.', boost: { climb: 25, help: 10 } },
  road_map: { name: 'a road map of town', short: 'Road map', desc: 'Shows back roads and shortcuts. Every trip is safer now.', boost: { travel: 15 } },
  air_horn: { name: 'an air horn', short: 'Air horn', desc: 'Painfully loud. Blast it somewhere far away and the zombies will follow the sound.', boost: { trick: 25 } },
  hiking_boots: { name: 'a pair of hiking boots', short: 'Hiking boots', desc: 'Good grip and ankle support. Helps with traveling and climbing.', boost: { travel: 10, climb: 10, run: 5 } },
  energy_drink: { name: 'an energy drink', short: 'Energy drink', desc: 'You feel like you could run a marathon. Helps with running and traveling.', boost: { run: 15, travel: 10 } },
  crowbar: { name: 'a crowbar', short: 'Crowbar', desc: 'Good for fighting AND for prying boards loose to build barricades.', boost: { fight: 20, barricade: 15 } },
  nail_gun: { name: 'a nail gun', short: 'Nail gun', desc: 'Board up a door in seconds. Helps a lot with barricades.', boost: { barricade: 30, fight: 10 } },
  helmet: { name: 'a motorcycle helmet', short: 'Helmet', desc: 'Zombies cannot bite through this. You are harder to kill, no matter what you do.', armor: true },
  katana: { name: 'a katana', short: 'Katana', desc: 'A real, sharp sword. The best weapon in town.', boost: { fight: 35 } },
  walkie: { name: 'a walkie-talkie', short: 'Walkie-talkie', desc: 'Type "call" or "radio" to reach other survivors. They might send supplies.', boost: { call: 30 } },
  megaphone: { name: 'a megaphone', short: 'Megaphone', desc: 'Great for calling for help or for luring zombies away with noise.', boost: { call: 15, trick: 20 } },
  bat: { name: 'an aluminum baseball bat', short: 'Baseball bat', desc: 'The classic. Helps a lot with fighting.', boost: { fight: 20 } },
  crossbow: { name: 'a crossbow', short: 'Crossbow', desc: 'Attack zombies from far away, before they get close. A great weapon.', boost: { fight: 30, help: 10 } },
  machete: { name: 'a machete', short: 'Machete', desc: 'Long and sharp. A very good weapon.', boost: { fight: 25 } },
  binoculars: { name: 'a pair of binoculars', short: 'Binoculars', desc: 'Spot zombies from far away so you can sneak around them or pick a safe route.', boost: { sneak: 15, travel: 10 } },
  riot_shield: { name: 'a riot shield', short: 'Riot shield', desc: 'A big see-through police shield. Harder to kill, and it helps when fighting.', boost: { fight: 10 }, armor: true },
  kevlar_vest: { name: 'a bulletproof vest', short: 'Kevlar vest', desc: 'Zombie teeth cannot get through it. You are harder to kill now.', armor: true },
  pepper_spray: { name: 'a can of pepper spray', short: 'Pepper spray', desc: 'Not sure zombies feel it, but it blinds them for a few seconds. Helps with fighting and tricks.', boost: { fight: 10, trick: 15 } },
  fire_axe: { name: 'a fire axe', short: 'Fire axe', desc: 'Big, red and heavy. Helps with fighting and with breaking things down for barricades.', boost: { fight: 30, barricade: 10 } },
  hammer_nails: { name: 'a hammer and a box of nails', short: 'Hammer & nails', desc: 'Type "barricade" or "board up the door" to make a sturdy fort.', boost: { barricade: 25, fight: 10 } },
  flare_gun: { name: 'a flare gun', short: 'Flare gun', desc: 'Shoot it into the sky to signal for help, or fire it near zombies to scare them off.', boost: { call: 30, trick: 20 } }
};

const SURVIVORS = {
  coach: {
    name: 'Barry Wilson', aliases: ['barry', 'wilson', 'coach', 'mr wilson'],
    intro: `On the bleachers in the gym, a heavyset man in his fifties is standing with a lacrosse stick, breathing hard. Three zombies lie still on the floor below him. He watches you for a long moment before he lowers the stick. "Barry Wilson. I teach gym here. Taught, I guess." He wipes his forehead with his sleeve. "I've been stuck in here since yesterday. You alone?"`,
    join: `Barry grabs his duffel bag and climbs down, one bleacher at a time. "I'm not as fast as I used to be, but I can still swing. Let's go." (Barry makes fighting and running safer.)`,
    death: `Barry plants his feet in front of you and swings until he can't anymore. "Go!" is the last thing he shouts. You hear his old whistle clatter onto the pavement behind you.`,
    boost: { fight: 15, run: 10, travel: 5 }
  },
  biscuit: {
    name: 'Biscuit', aliases: ['biscuit', 'dog', 'puppy', 'doggy', 'doggo', 'pup'],
    intro: `Under the slide, a golden retriever with a muddy red collar is pressed flat against the ground, trembling. The tag says BISCUIT, with a phone number nobody is going to answer. The dog watches you with its ears back, ready to bolt.`,
    join: `Biscuit sniffs your hand for a long time, then leans against your leg. From now on, Biscuit growls low in their throat whenever zombies are close. (Biscuit makes hiding and sneaking safer.)`,
    death: `Biscuit charges at the zombies, barking, and buys you the few seconds you need to get away. Biscuit doesn't come back.`,
    boost: { hide: 15, sneak: 15, travel: 5 }
  },
  tank: {
    name: 'Teresa "Tank" Morales', aliases: ['tank', 'teresa', 'morales', 'mechanic'],
    intro: `A woman in her forties with grease up to her elbows slides out from under the tow truck, a wrench in her fist. She looks you up and down. "Teresa Morales. Everyone calls me Tank." She jerks a thumb at the truck. "Alternator's shot. Doesn't matter. Give me ten minutes and I can get anything with an engine running."`,
    join: `"Fine. Safer in numbers." Tank swings her tool bag over her shoulder. "Just don't slow me down." (Tank can hotwire cars, so you can drive without keys. She also makes driving, travel and barricades safer.)`,
    death: `Tank shoves you out of the way and swings her wrench into the crowd of zombies. There are too many of them. She doesn't get back up.`,
    boost: { drive: 20, travel: 15, barricade: 10 }
  },
  luna: {
    name: 'Luna Reyes', aliases: ['luna', 'reyes', 'skater'],
    intro: `A young woman in a coffee shop apron rolls out from behind a kiosk on a skateboard, a stuffed backpack on her shoulders. She looks about nineteen. She stops a safe distance away. "Hey. You're not bitten, right?" She waits until you answer. "Luna. I work at the coffee place here. Worked. I know every back hallway in this mall."`,
    join: `"Okay. I know the service hallways and the back roads across town. Stay close and keep your voice down." (Luna makes sneaking, running and travel safer.)`,
    death: `Luna yells and bangs on a metal railing to pull the zombies toward her and away from you. It works. You never see her again.`,
    boost: { sneak: 15, run: 15, travel: 10 }
  },
  diaz: {
    name: 'Officer Ana Diaz', aliases: ['ana', 'diaz', 'officer', 'cop'],
    intro: `Behind the front desk, a police officer with a bandaged forearm has her back against the door to the cells. She's exhausted, but her voice is calm. "Officer Ana Diaz. I've been trying to reach anyone on the radio for two days." She studies you. "If you're heading out, I'm coming with you. Nobody should be out there alone."`,
    join: `Diaz checks her gear and nods once. "Stay behind me when it gets bad. And it will get bad." (Officer Diaz makes fighting, calling for help and rescues safer.)`,
    death: `Diaz holds the doorway long enough for you to get clear. Over the radio, you hear her say "Go. Keep going." Then the radio goes quiet.`,
    boost: { fight: 15, call: 15, help: 10 }
  },
  priya: {
    name: 'Dr. Priya Shah', aliases: ['priya', 'shah', 'dr shah', 'doctor', 'nurse'],
    intro: `In a supply room off the ER, a woman in blue scrubs is packing gauze and medicine into a backpack with shaking hands. She freezes when she sees you, then lets out a long breath. "Dr. Priya Shah. Emergency medicine." Her eyes go straight to your scratches. "Sit down for a second. Let me look at that."`,
    join: `"I can't stay here. There's no one left to treat." She zips the bag shut. "I'll keep you and your team patched up." (Dr. Shah makes healing and helping safer, and heals your teammates when you heal.)`,
    death: `Dr. Shah stops to help you up when you stumble. It costs her. She pushes her medical bag into your hands before the zombies close in.`,
    boost: { heal: 25, help: 10 }
  },
  joe: {
    name: 'Joe Kowalski', aliases: ['joe', 'kowalski', 'old man', 'ranger'],
    intro: `An old man in a faded ranger jacket is sitting on a stump beside the trail with a hatchet across his knees. He doesn't seem surprised to see you. "Joe Kowalski. I was a ranger out here for thirty-one years." He nods toward the trees. "They're loud and they're clumsy. Out here that's an advantage, if you know what you're doing."`,
    join: `Joe stands up slowly, knees cracking. "Alright. I'll come. Watch where you step and don't break any branches." (Joe makes hiding, traps and climbing safer.)`,
    death: `Joe tells you to run and doesn't follow. When you look back, he's standing on the trail with his hatchet, calm as ever, as the zombies come out of the trees.`,
    boost: { hide: 15, trick: 15, climb: 10 }
  },
  al: {
    name: 'Al Brennan', aliases: ['brennan', 'al brennan', 'store owner', 'owner'],
    intro: `A big bearded man in a fishing vest steps out from behind the register holding a crossbow, and points it at the floor when he sees you're not a zombie. "Al Brennan. Yes, THE Big Al. This is my store." He sighs. "Twenty years selling camping gear and I never thought I'd actually need any of it."`,
    join: `"Take what you need, then let's get moving. I know where every useful thing in this town is kept." (Al makes searching and fighting safer.)`,
    death: `Al shouts "Go! I've got this!" and wades into the zombies to cover you. He was brave right to the end.`,
    boost: { supplies: 20, fight: 10 }
  },
  rita: {
    name: 'Rita Okafor', aliases: ['rita', 'okafor', 'engineer'],
    intro: `Inside the control shack, a woman in a hard hat is bent over the radio with a soldering iron, headphones around her neck. "Rita Okafor. I'm the engineer for this tower." She doesn't look up. "I've almost got the long-range transmitter working. If I can get it on, we can reach the National Guard."`,
    join: `Rita coils up a cable and hangs it on her shoulder. "Fine, I'll come. I can rig a signal out of almost anything." (Rita makes calling for help and barricades safer.)`,
    death: `Rita stays behind to keep the signal going while you get away. Through your radio, you hear her keep broadcasting long after you're gone.`,
    boost: { call: 30, barricade: 10 }
  }
};

const LOCATIONS = {
  house: {
    name: 'Your House', aliases: ['house', 'home'],
    intro: `Your house is quiet. Too quiet. The TV in the living room is still playing an emergency broadcast on repeat: "STAY INDOORS. DO NOT APPROACH THE INFECTED." Through the front window you can see your neighbor, Mr. Henderson, shuffling across his lawn in his bathrobe. He is definitely not okay anymore.`,
    events: [
      { text: 'Something thumps against the back door. Then again. THUMP. THUMP. The door frame creaks and you can hear moaning on the other side. The front door is still clear, for now.', bonus: ['barricade', 'run', 'hide'] },
      { text: 'The power flickers and goes out. In the dark, you hear glass breaking somewhere in the house, followed by slow, dragging footsteps. Whatever it is, it is getting closer.', bonus: ['hide', 'sneak', 'fight'] },
      { text: 'Mr. Henderson has made it onto your porch. He is pressing his gray face against the window. Three more zombies are stumbling up the driveway behind him.', bonus: ['barricade', 'trick', 'run'] }
    ],
    spots: {
      kitchen: { name: 'Kitchen', aliases: ['kitchen', 'pantry', 'fridge'], desc: `The kitchen still smells like this morning's toast. Dishes are piled in the sink and the back door rattles every time the wind blows.`, items: ['frying_pan', 'kitchen_knife', 'canned_food'], good: ['supplies', 'heal'] },
      garage: { name: 'Garage', aliases: ['garage'], desc: `The garage is dim and smells like oil and cut grass. The family car is gone, just an oil stain where it used to be, and a pegboard of tools hangs on the wall.`, items: ['duct_tape', 'golf_club', 'hammer_nails'], good: ['barricade'] },
      basement: { name: 'Basement', aliases: ['basement', 'cellar'], desc: `Wooden stairs creak down into the basement. There's a water heater, a washer and dryer, shelves of old paint cans, and only one way in.`, items: ['first_aid', 'flashlight'], good: ['hide', 'barricade', 'heal'] },
      bedroom: { name: 'Your Bedroom', aliases: ['bedroom', 'my room', 'your room'], desc: `Your bedroom is exactly how you left it: an unmade bed, clothes on the floor, and a window looking out over the street.`, items: ['binoculars'], good: ['hide', 'sneak'] }
    }
  },
  school: {
    name: 'Lincoln Middle School', aliases: ['school', 'middle school', 'lincoln'],
    survivor: 'coach',
    intro: `The hallways of Lincoln Middle School are covered in scattered homework and knocked-over trash cans. The fire alarm light is still blinking, but there's no sound. Somewhere upstairs, a locker door is slamming open and shut, open and shut.`,
    events: [
      { text: 'A group of zombies in marching band uniforms is shuffling down the main hallway, still holding their instruments. They have not spotted you yet, but they are coming your way.', bonus: ['sneak', 'hide', 'trick'] },
      { text: 'You hear someone shouting for help from the far end of the school. It sounds like they are trapped, and the shouting is drawing zombies toward them.', bonus: ['help', 'fight', 'trick'] },
      { text: 'The cafeteria doors burst open and a zombie in a lunch lady hairnet comes charging out, faster than the others, with more behind her.', bonus: ['fight', 'run', 'barricade'] }
    ],
    spots: {
      gym: { name: 'Gym', aliases: ['gym', 'gymnasium', 'bleachers'], desc: `The gym is huge and echoey. Basketballs are scattered across the floor and the bleachers are pulled out along one wall.`, items: ['hockey_stick'], good: ['climb', 'fight'] },
      lab: { name: 'Science Lab', aliases: ['science lab', 'lab', 'laboratory', 'chemistry'], desc: `Lab stools are knocked over and a fish tank bubbles in the corner. There are gas valves on every table and a fire extinguisher by the door.`, items: ['lighter', 'fire_extinguisher'], good: ['trick'] },
      janitor: { name: `Janitor's Closet`, aliases: ['janitor', 'janitors closet', 'janitor closet', 'supply closet'], desc: `A cramped closet full of mops, buckets and cleaning supplies. The door has a heavy deadbolt on the inside.`, items: ['rope', 'duct_tape'], good: ['hide', 'barricade'] },
      cafeteria: { name: 'Cafeteria', aliases: ['cafeteria', 'lunchroom', 'lunch room'], desc: `Long tables, plastic trays and the smell of old tater tots. The serving counter has a metal shutter that pulls down.`, items: ['canned_food', 'water_bottle'], good: ['supplies', 'barricade'] },
      nurse: { name: `Nurse's Office`, aliases: ['nurse office', 'nurses office', 'school nurse'], desc: `A small office with a cot, a mini fridge and a cabinet of bandages. The window has blinds you can close.`, items: ['first_aid'], good: ['heal', 'hide'] }
    }
  },
  park: {
    name: 'Maple Park', aliases: ['park', 'maple'],
    survivor: 'biscuit',
    intro: `Maple Park used to be the best place in town for soccer games and ice cream. Now the swings creak in the wind, the ice cream truck sits abandoned with its jingle still playing, and zombies wander between the trees.`,
    events: [
      { text: 'The ice cream truck jingle is drawing every zombie in the neighborhood. A crowd is gathering around the truck, and you are standing right in their path.', bonus: ['sneak', 'hide', 'climb'] },
      { text: 'A zombie dog bursts out of the bushes, snarling. It is fast, much faster than the regular zombies, and it is already running at you.', bonus: ['climb', 'trick', 'fight'] },
      { text: 'A thick fog rolls in over the park. You can barely see ten feet ahead, but you can hear groaning from every direction.', bonus: ['hide', 'sneak', 'run'] }
    ],
    spots: {
      truck: { name: 'Ice Cream Truck', aliases: ['ice cream truck'], desc: `The ice cream truck's door hangs open and its jingle plays on a loop. Inside there's a freezer and a serving window. The keys are gone.`, items: ['water_bottle'], good: ['hide'] },
      playground: { name: 'Playground', aliases: ['playground', 'slide', 'swings', 'jungle gym', 'monkey bars'], desc: `A wooden playground with a tall slide, swings and a climbing tower. From the top of the tower you can see most of the park.`, items: ['energy_drink'], good: ['climb'] },
      booth: { name: 'Ranger Booth', aliases: ['ranger booth', 'booth', 'info booth'], desc: `A little wooden booth with maps of the town taped to the windows. A lost-and-found box sits by the door.`, items: ['road_map', 'air_horn'], good: ['barricade', 'call'] },
      restrooms: { name: 'Public Restrooms', aliases: ['restrooms', 'restroom', 'bathroom', 'bathrooms', 'toilet'], desc: `Concrete restrooms with heavy metal doors. It smells awful, but the doors lock from the inside.`, items: ['hiking_boots'], good: ['hide', 'barricade'] }
    }
  },
  gas: {
    name: 'Gas-N-Go Station', aliases: ['gas', 'gas station', 'gas n go', 'fuel', 'pump'],
    survivor: 'tank',
    intro: `The Gas-N-Go is a small gas station with a convenience store attached. The neon sign buzzes and flickers. Snacks are scattered across the floor inside, and a tow truck is parked crooked by the garage.`,
    events: [
      { text: 'A zombie in a Gas-N-Go uniform is stuck in the revolving door, turning around and around. Every time it comes around, it gets a little closer to breaking free.', bonus: ['fight', 'sneak', 'trick'] },
      { text: 'A large pack of zombies is coming down Route 9 toward the station, drawn by the buzzing neon sign. You have maybe a minute before they get here.', bonus: ['drive', 'run', 'barricade', 'trick'] }
    ],
    spots: {
      store: { name: 'Convenience Store', aliases: ['convenience store', 'mini mart', 'snack aisle'], desc: `Shelves of chips and candy are knocked over. The cooler doors hang open and the cash register sits under a flickering light.`, items: ['energy_drink', 'lighter'], good: ['supplies'] },
      bay: { name: 'Garage Bay', aliases: ['garage bay', 'repair shop', 'service bay', 'tow truck'], desc: `The repair bay has a car up on a lift, rolling toolboxes, and the tow truck parked half inside. The big roll-up door can be pulled down.`, items: ['crowbar', 'nail_gun'], good: ['barricade'] },
      office: { name: 'Back Office', aliases: ['back office', 'managers office', 'manager office'], desc: `A tiny office with a desk, an open safe, and a security monitor showing grainy pictures of the pumps outside.`, items: ['first_aid'], good: ['hide', 'sneak'] }
    }
  },
  mall: {
    name: 'Riverside Mall', aliases: ['mall', 'riverside'],
    survivor: 'luna',
    intro: `Riverside Mall is enormous: three floors of stores, a food court, and an indoor fountain that is somehow still running. The escalators are stopped, half the lights are off, and mannequins are knocked over everywhere. Some of the mannequins are moving.`,
    events: [
      { text: 'The "mannequins" in a store window suddenly turn their heads toward you, all at once. They are not mannequins. They step down out of the display.', bonus: ['run', 'fight', 'hide'] },
      { text: 'You hear a rumble. A huge crowd of zombies is pouring in through the main entrance below and starting up the stopped escalators.', bonus: ['climb', 'hide', 'trick'] },
      { text: 'A zombie in a security guard uniform is wandering the main hallway, keys jingling on its belt, blocking the path you need.', bonus: ['fight', 'sneak', 'trick'] }
    ],
    spots: {
      samurai: { name: 'Samurai Shack', aliases: ['samurai shack', 'samurai', 'sword shop', 'sword store'], desc: `A tiny shop crammed with decorative swords, throwing stars and anime posters. Most of it is cheap, but one katana in the locked case looks real.`, items: ['katana'], good: ['fight'] },
      cycles: { name: 'Iron Horse Cycles', aliases: ['iron horse cycles', 'iron horse', 'motorcycle shop', 'cycle shop'], desc: `A motorcycle dealership with shiny bikes lined up by the glass doors. Helmets and leather jackets hang on the walls.`, items: ['helmet', 'road_map'], good: ['hide'] },
      electronics: { name: 'Voltage Electronics', aliases: ['voltage electronics', 'voltage', 'electronics', 'tech store'], desc: `TVs line the walls, all showing the same emergency broadcast. Phones, radios and speakers fill the display tables.`, items: ['walkie', 'megaphone'], good: ['call', 'trick'] },
      dept: { name: `Hartley's Department Store`, aliases: ['hartleys', 'hartley', 'department store', 'clothing store', 'fitting room', 'dressing room'], desc: `Three floors of clothes, shoes and housewares. The fitting rooms in the back have doors that lock, and there are mannequins everywhere.`, items: ['hiking_boots', 'duct_tape'], good: ['hide', 'sneak'] },
      foodcourt: { name: 'Food Court', aliases: ['food court', 'burger place', 'pizza place'], desc: `Tables and chairs are scattered everywhere. The burger and pizza counters still have food under the heat lamps, and the freezers in back are full.`, items: ['canned_food', 'water_bottle'], good: ['supplies', 'heal'] }
    }
  },
  sports: {
    name: `Big Al's Sporting Goods`, aliases: ['sporting', 'sports', 'sporting goods', 'big al', 'big als'],
    survivor: 'al',
    intro: `Big Al's Sporting Goods has everything: bats, bikes, camping gear, and a giant inflatable gorilla on the roof. The front window is smashed, but it looks like nobody has had time to loot the place yet.`,
    events: [
      { text: 'A zombie in full hockey goalie gear is standing in the main aisle. Its padding is so thick it barely notices when things bounce off it.', bonus: ['trick', 'sneak'] },
      { text: 'The inflatable gorilla on the roof comes loose and flops over the front of the store, blocking the main exit. You can hear zombies clawing at it from outside.', bonus: ['climb', 'barricade', 'fight'] }
    ],
    spots: {
      bats: { name: 'Team Sports Aisle', aliases: ['team sports aisle', 'team sports', 'baseball aisle', 'sports aisle'], desc: `Racks of baseball bats, hockey sticks and golf clubs, all with the price tags still on.`, items: ['bat', 'golf_club'], good: ['fight'] },
      hunting: { name: 'Hunting & Camping', aliases: ['hunting and camping', 'hunting', 'camping section', 'hunting section', 'outdoor section'], desc: `Display tents, camo jackets, lanterns, and a locked glass case behind the counter.`, items: ['crossbow', 'machete', 'lighter'], good: ['hide', 'trick'] },
      fishing: { name: 'Fishing Section', aliases: ['fishing section', 'fishing', 'fishing aisle'], desc: `Rods, tackle boxes and coolers. The bike rack next to it has been stripped bare. Someone got here first.`, items: ['rope', 'air_horn'], good: ['trick', 'hide'] },
      stockroom: { name: 'Stockroom', aliases: ['stockroom', 'stock room', 'storeroom', 'back room'], desc: `Tall metal shelves full of boxes reach the ceiling. There's a loading dock door in the back and only one other way in.`, items: ['binoculars', 'hiking_boots'], good: ['hide', 'barricade'] }
    }
  },
  police: {
    name: 'Police Station', aliases: ['police', 'police station', 'cop station', 'precinct'],
    survivor: 'diaz',
    intro: `The Police Station doors are wide open, and the lights on the cruisers outside are still flashing red and blue. Papers are scattered everywhere and a radio on the front desk crackles with static. The holding cells in the back are full of zombies, rattling the bars.`,
    events: [
      { text: 'CLANG. One of the holding cell doors swings open. A zombie in an orange jumpsuit stumbles out, followed by two more. They turn toward you.', bonus: ['fight', 'barricade', 'run'] },
      { text: 'The radio crackles: "...any survivors... head to the radio tower..." Then the zombies outside hear it too, and they start pounding on the windows.', bonus: ['call', 'barricade', 'hide'] }
    ],
    spots: {
      desk: { name: 'Front Desk', aliases: ['front desk', 'lobby', 'reception'], desc: `The lobby has a thick glass window, a row of plastic chairs, and a radio that keeps crackling on and off.`, items: ['walkie'], good: ['call'] },
      armory: { name: 'Armory', aliases: ['armory', 'armoury', 'weapons locker', 'gear room'], desc: `A caged room full of riot gear and equipment shelves. The cage door is hanging open.`, items: ['riot_shield', 'kevlar_vest', 'pepper_spray'], good: ['fight', 'barricade'] },
      evidence: { name: 'Evidence Room', aliases: ['evidence room', 'evidence'], desc: `Rows of labeled boxes and bags from old cases. A hook by the door labeled CRUISER 4 is empty.`, items: ['machete', 'megaphone'], good: ['supplies', 'hide'] },
      cells: { name: 'Holding Cells', aliases: ['holding cells', 'cells', 'cell', 'jail'], desc: `A hallway of barred cells. Most have zombies inside, reaching through the bars. One cell at the end is empty, with the key still in the lock.`, items: ['duct_tape'], good: ['barricade'] }
    }
  },
  hospital: {
    name: 'St. Mercy Hospital', aliases: ['hospital', 'st mercy', 'mercy'],
    survivor: 'priya',
    intro: `St. Mercy Hospital is the creepiest place in town. The hallways are long and white, the lights flicker, and empty wheelchairs sit at odd angles in the halls. Signs point to the Emergency Room, the Pharmacy, Maintenance, and the Roof Helipad.`,
    events: [
      { text: 'The elevator dings. The doors slide open and it is packed with zombies in hospital gowns. They all turn to look at you at the same time.', bonus: ['run', 'fight', 'trick'] },
      { text: 'The hallway behind you is filling up with zombie patients and zombie doctors. You are stuck at a dead end.', bonus: ['barricade', 'heal', 'hide'] },
      { text: 'A voice comes over the speakers: "Any survivors, the roof helipad is clear!" But the stairwell to the roof is crawling with zombies.', bonus: ['climb', 'sneak', 'call'] }
    ],
    spots: {
      er: { name: 'Emergency Room', aliases: ['emergency room', 'er'], desc: `Curtained beds, rolling carts and monitors that are still beeping. Supply drawers line the walls.`, items: ['first_aid', 'first_aid'], good: ['heal'] },
      pharmacy: { name: 'Pharmacy', aliases: ['pharmacy', 'medicine cabinet'], desc: `Behind a half-open metal security gate, shelves of medicine go from floor to ceiling.`, items: ['first_aid', 'energy_drink'], good: ['heal', 'barricade', 'supplies'] },
      maintenance: { name: 'Maintenance Room', aliases: ['maintenance room', 'maintenance', 'boiler room'], desc: `Pipes hiss along the ceiling and tools hang on the walls. There's a fire axe in a glass case marked IN CASE OF EMERGENCY.`, items: ['fire_axe', 'hammer_nails', 'fire_extinguisher'], good: ['barricade', 'fight'] },
      helipad: { name: 'Roof Helipad', aliases: ['helipad', 'roof', 'rooftop'], desc: `The roof is windy and flat, with a big painted H in the middle. You can see the whole town from up here, and the stairwell door is the only way up.`, items: ['road_map', 'flare_gun'], good: ['call', 'climb'] }
    }
  },
  woods: {
    name: 'Whispering Woods', aliases: ['woods', 'forest', 'whispering'],
    survivor: 'joe',
    intro: `The Whispering Woods are thick and dark, with tall pines that block out the sun. A ranger shed sits beside the trail and a creek runs nearby. It is very quiet here, which could be good, or really, really bad.`,
    events: [
      { text: 'Twigs snap all around you. Zombies are stumbling out from between the trees, and there are a lot of them. At least they are slow out here, tripping over roots and mud.', bonus: ['climb', 'hide', 'sneak'] },
      { text: 'You find a campfire someone left burning. The zombies seem wary of the fire and keep a few steps away, but more keep arriving every minute.', bonus: ['trick', 'hide', 'fight'] }
    ],
    spots: {
      shed: { name: 'Ranger Shed', aliases: ['ranger shed', 'shed', 'tool shed'], desc: `A wooden shed with a padlock that has been snapped off. Inside are shovels, rope, and a workbench.`, items: ['fire_axe', 'rope'], good: ['barricade', 'supplies'] },
      campsite: { name: 'Old Campsite', aliases: ['campsite', 'camp site', 'campground'], desc: `A ring of stones, a few logs to sit on, and a tent that has seen better days. Someone left in a hurry.`, items: ['lighter', 'canned_food'], good: ['trick', 'heal'] },
      blind: { name: 'Hunting Blind', aliases: ['hunting blind', 'deer stand', 'tree stand', 'treehouse', 'tree house'], desc: `A camouflaged platform bolted high up in a pine tree, with a ladder you can pull up after you.`, items: ['binoculars'], good: ['hide', 'climb'] },
      creek: { name: 'Creek', aliases: ['creek', 'stream', 'river'], desc: `Cold, fast water over slippery rocks. The zombies don't seem to like the water much.`, items: ['water_bottle'], good: ['hide', 'sneak'] }
    }
  },
  tower: {
    name: 'Old Radio Tower', aliases: ['tower', 'radio tower', 'hill'],
    survivor: 'rita',
    intro: `The Old Radio Tower stands on a hill outside town, a huge metal tower with a red light blinking at the top. There's a small control shack at the bottom with a big radio inside. If anyone out there is still alive, this is the place to reach them.`,
    events: [
      { text: 'The radio in the shack crackles: "...this is the National Guard... any survivors, send a signal..." But the noise has attracted zombies, and they are climbing the hill toward you.', bonus: ['call', 'barricade', 'climb'] },
      { text: 'A storm is rolling in. Lightning flashes, and in the light you see dozens of zombies standing around the base of the tower, staring up at the blinking red light.', bonus: ['call', 'hide', 'sneak'] }
    ],
    spots: {
      shack: { name: 'Control Shack', aliases: ['control shack', 'shack', 'control room', 'radio room'], desc: `A cramped room full of old radio equipment, blinking lights and a desk covered in coffee mugs. The main radio still works.`, items: ['flare_gun', 'walkie'], good: ['call', 'barricade'] },
      top: { name: 'Top of the Tower', aliases: ['top of the tower', 'tower top', 'platform'], desc: `A narrow metal platform two hundred feet up, swaying in the wind. Terrifying, but nothing is getting up here easily.`, items: ['binoculars'], good: ['climb', 'hide', 'call'] },
      locker: { name: 'Supply Locker', aliases: ['supply locker', 'locker'], desc: `A rusty metal storage locker bolted to the side of the shack, full of emergency supplies.`, items: ['first_aid', 'duct_tape'], good: ['supplies'] }
    }
  }
};

const ROADS = [
  ['house', 'school', 0.6, 'Elm Street'],
  ['house', 'park', 0.5, 'Maple Avenue'],
  ['house', 'gas', 0.9, 'Route 9'],
  ['school', 'park', 0.5, 'Oak Lane'],
  ['school', 'police', 0.8, 'Main Street'],
  ['park', 'sports', 0.7, 'Maple Avenue'],
  ['park', 'woods', 1.2, 'Trail Road'],
  ['gas', 'mall', 1.0, 'Route 9'],
  ['sports', 'mall', 0.6, 'Commerce Drive'],
  ['police', 'hospital', 0.9, 'Main Street'],
  ['mall', 'hospital', 1.1, 'Riverside Parkway'],
  ['hospital', 'tower', 1.5, 'Hill Road'],
  ['woods', 'tower', 1.3, 'Old Logging Road']
];

for (const k in LOCATIONS) LOCATIONS[k].neighbors = [];
for (const [a, b] of ROADS) {
  LOCATIONS[a].neighbors.push(b);
  LOCATIONS[b].neighbors.push(a);
}

function routeFrom(start) {
  const dist = { [start]: 0 }, prev = {}, done = new Set();
  while (done.size < Object.keys(LOCATIONS).length) {
    const here = Object.keys(dist).filter(k => !done.has(k)).sort((a, b) => dist[a] - dist[b])[0];
    if (!here) break;
    done.add(here);
    for (const [a, b, miles, road] of ROADS) {
      const next = a === here ? b : b === here ? a : null;
      if (next && (dist[next] === undefined || dist[here] + miles < dist[next])) {
        dist[next] = dist[here] + miles;
        prev[next] = { from: here, road };
      }
    }
  }
  return { dist, prev };
}

function routeTo(start, dest) {
  const { dist, prev } = routeFrom(start);
  const roads = [];
  for (let at = dest; at !== start; at = prev[at].from) {
    if (roads[0] !== prev[at].road) roads.unshift(prev[at].road);
  }
  return { miles: Math.round(dist[dest] * 10) / 10, roads };
}

function riskLabel(miles) {
  if (miles < 0.8) return 'low risk';
  if (miles < 1.6) return 'medium risk';
  if (miles < 2.5) return 'high risk';
  return 'very high risk';
}

const PROLOGUE = 'It was a normal Saturday morning, until every phone in town started blaring an emergency alert. ZOMBIES. Real ones. Nobody knows where they came from, but they are everywhere now.';

const VEHICLES = {
  car: { name: 'Car', icon: '🚗', factor: 0.4, boost: 35, how: 'type "drive to" a place', found: 'an abandoned car in the middle of the road, door open, keys still in the ignition' },
  motorcycle: { name: 'Motorcycle', icon: '🏍', factor: 0.5, boost: 30, how: 'type "ride my motorcycle to" a place', found: 'a motorcycle lying on its side by the curb, key still in it' },
  bike: { name: 'Mountain bike', icon: '🚲', factor: 0.65, boost: 25, how: 'type "ride my bike to" a place', found: 'a mountain bike leaning against a mailbox, tires still full' },
  skateboard: { name: 'Skateboard', icon: '🛹', factor: 0.8, boost: 15, how: 'type "skate to" a place', found: 'a skateboard sitting in the gutter' }
};

const VEHICLE_WORDS = {
  car: ['drive', 'driv', 'drove', 'by car', 'take the car', 'take my car', 'in the car', 'in my car', 'my car', 'the car', 'get in the car', 'the cruiser', 'my truck', 'the tow truck', 'floor it', 'hit the gas'],
  motorcycle: ['motorcycle', 'motorbike', 'dirt bike', 'moped', 'scooter'],
  bike: ['bike', 'bicycle', 'mountain bike', 'bmx', 'pedal', 'cycle'],
  skateboard: ['skateboard', 'skate board', 'skate', 'skating']
};

const RIDE_WORDS = ['ride', 'rid', 'rode', 'hop on', 'get on'];

const SURVIVOR_GIFTS = {
  tank: ['car', `Tank slaps the hood of her tow truck. "And she comes with me. Get in." (You now have a CAR!)`],
  diaz: ['car', `Diaz tosses you a key ring labeled CRUISER 4. "The cruiser's out front. You drive, I'll watch the windows." (You now have a CAR!)`],
  luna: ['skateboard', `Luna pulls a second skateboard out of her backpack and hands it to you. "Spare. Don't lose it." (You now have a SKATEBOARD!)`],
  al: ['bike', `Al wheels a mountain bike out of the back room. "Last one I had. Wasn't going to sell it anyway." (You now have a MOUNTAIN BIKE!)`],
  joe: ['motorcycle', `Joe pulls a tarp off an old dirt bike behind the ranger shed. "Still runs. Mostly." (You now have a MOTORCYCLE!)`]
};
