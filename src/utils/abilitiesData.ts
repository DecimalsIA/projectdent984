import { v4 as uuidv4 } from 'uuid';
export interface Ability {
  id: string;
  description: string;
  type_habilities: string;
  melee: string;
  Status: string;
  use: number;
  Parts: string;
  name: string;
}

export const ABILITIES: Ability[] = [
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "YES",
    "Status": "",
    "use": -1, // infinite
    "Parts": "(ALL)",
    "name": "Attack",
    "description": "Attack the enemy melee (x1)"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "",
    "use": -1, // infinite
    "Parts": "(ALL)",
    "name": "Throw",
    "description": "Attack the enemy ranged (x0.9)"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Flying",
    "use": -1, // infinite
    "Parts": "(ALL)",
    "name": "Ground",
    "description": "Stop flying status"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Flying",
    "use": 4,
    "Parts": "(ALL)",
    "name": "Fly",
    "description": "Avoid the next ground-based attack (melee and trapped status are avoided) In case the opponent bee attacks first, this status prevails until the next turn. If this bee moves first, the flying status is lost this turn"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Defending",
    "use": 5,
    "Parts": "(ALL)",
    "name": "Cover",
    "description": "Defend (x2) the next attack or consecutive attacks for 2 turns"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "",
    "use": 2,
    "Parts": "(ALL)",
    "name": "Distract",
    "description": "Cancels the channeling ability of the opposite bee. Deals no damage."
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Sleeping",
    "use": 2,
    "Parts": "(ALL)",
    "name": "Wake up",
    "description": "The bee wakes up from a Sleeping status"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "Wall",
    "use": 2,
    "Parts": "Metal",
    "name": "Reflection",
    "description": "Raises a wall that reflects the next attack of the opponent in this turn. Lasts for 2 turns. It doesn't matter who has more speed (for first attacking). The effects of this ability also reflect any negative effects from the attacker. If the attacker does not attack, this ability does nothing."
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "Paralyzed",
    "use": 3,
    "Parts": "Earth",
    "name": "Down to Earth",
    "description": "The opponent cannot move for the next 3 turns. Any attack that requires melee attacking cannot be performed (ability locked)"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "YES",
    "Status": "",
    "use": 3,
    "Parts": "Fire",
    "name": "Frenzy",
    "description": "Perform 4 melee attacks. (x0.6 your Attack Stat each hit)"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "",
    "use": 3,
    "Parts": "Fire",
    "name": "Fireball",
    "description": "Throw a fireball from distance (x2.5 Attack Stat)"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "Trapped",
    "use": 1,
    "Parts": "Gem",
    "name": "Jailwalk",
    "description": "The opponent loses 20% of current health if it tries to move (Permanent)"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "All debuffs",
    "use": 3,
    "Parts": "Water",
    "name": "Freedom",
    "description": "Remove all current debuffs"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "YES",
    "Status": "",
    "use": 2,
    "Parts": "Phantom",
    "name": "See through",
    "description": "Can attack through ANY wall without receiving any debuff, (x2 Attack Stat) this includes Reflection ability and the reflection doesn't take place"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self + Attack",
    "melee": "YES",
    "Status": "Healing",
    "use": 5,
    "Parts": "Poison",
    "name": "Drain",
    "description": "Perform a melee attack (x1) and steal 20% damage dealt as health back"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "Poisoned",
    "use": 1,
    "Parts": "Poison",
    "name": "Poison Dart",
    "description": "Throw a poison dart from distance and damage enemy the next 4 turns (x1.5 attack each turn)"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "",
    "use": 1,
    "Parts": "Water",
    "name": "Transform",
    "description": "Become a full water bee (Bee becomes 6/6 water, even if it has just one piece)"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self + Attack",
    "melee": "YES",
    "Status": "Channeling + Def",
    "use": 2,
    "Parts": "Metal",
    "name": "Charge",
    "description": "Charge an attack for 2 turns. Defense (x3) increases and you can't move or perform any other abilities. After 2 turns, charge with melee attack that kills the opponent."
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Flying",
    "use": 2,
    "Parts": "Air",
    "name": "Fly high",
    "description": "(Status change) Your bee is permanently flying. It avoids all melee attacks and ground stuns"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Flying",
    "use": 2,
    "Parts": "Phantom",
    "name": "Fly high",
    "description": "(Status change) Your bee is permanently flying. It avoids all melee attacks and ground stuns"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "",
    "use": -1, // infinite,
    "Parts": "Earth",
    "name": "Salvation",
    "description": "(Passive) If your Bee is about to die, instead of dying, it has 1 Hp and defense is now (x2) for 2 turns. Only 1 activation."
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Defending",
    "use": -1, // infinite,
    "Parts": "Gem",
    "name": "Solidification",
    "description": "(Passive) All the attacks you receive are decreased (x0.3 Defense) points (Permanent Status: Defending)"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "YES",
    "Status": "Burning",
    "use": 3,
    "Parts": "Fire",
    "name": "Burn",
    "description": "Perform 1 melee attack (x1) and inflict Burning Status for 3 turns (x2 each turn)."
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "All buffs",
    "use": 1,
    "Parts": "Phantom",
    "name": "Back",
    "description": "Removes all the opponent Bee Buff Status and reverts status to grounded"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "Confused",
    "use": 1,
    "Parts": "Poison",
    "name": "Puking",
    "description": "Throws a venomous spit at the Bee (x2) that makes the bee confused for 3 turns"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "YES",
    "Status": "All status",
    "use": 1,
    "Parts": "Metal",
    "name": "Gimme",
    "description": "Steal all current Status (buffs or debuffs) of the opponent Bee"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Healing",
    "use": 1,
    "Parts": "Gem",
    "name": "Strenghten",
    "description": "Increase by x1.5 your current health"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "Confused",
    "use": 2,
    "Parts": "Air",
    "name": "Tornado",
    "description": "Creates a tornado that deals x2 damage each turn for 2 turns and applies Confused 1 turn"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Flying",
    "use": -1, // infinite,
    "Parts": "Air",
    "name": "Skyborn",
    "description": "(Passive) Your bee starts the combat permanently flying"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Wall",
    "use": 2,
    "Parts": "Earth",
    "name": "Rockwall",
    "description": "Creates a rock wall that stops the next 3 attacks from you or the opponent. The wall is permanent unless it's destroyed. Attacks like Frenzy destroy the wall and still have 1 attack left for the defendant."
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "All debuffs",
    "use": 2,
    "Parts": "Water",
    "name": "Foryou",
    "description": "Gives to the opponent all your current active debuffs."
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "YES",
    "Status": "",
    "use": 3,
    "Parts": "Fire",
    "name": "Sting",
    "description": "Performs a Sting attack that does (x4) damage but you receive 50% of the damage dealt as damage to your health"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "Burning",
    "use": 2,
    "Parts": "Fire",
    "name": "Fireballs",
    "description": "Throw 3 fireballs (x0.8) and burn the opponent for 2 turns (x0.8 each turn)"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Wall + Trap + Burn",
    "use": 3,
    "Parts": "Fire",
    "name": "Firewall",
    "description": "Raises a firewall for 3 turns. If the opponent or yourself try delivering a mele attack, it becomes burned for 2 turns (x1.5 each turn)"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Healing",
    "use": 3,
    "Parts": "Water",
    "name": "Heal",
    "description": "Heals a 40% of the maximum HP"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Wall",
    "use": 2,
    "Parts": "Water",
    "name": "Waterblock",
    "description": "Raise a wall of water that reduces all damage dealt by 90%. Wall lasts 3 turns."
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "Confused",
    "use": 2,
    "Parts": "Water",
    "name": "Drowned",
    "description": "Throws water at attacker (x1 damage) and makes it become confused for 3 turns."
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "",
    "use": -1, // infinite,
    "Parts": "Earth",
    "name": "Giant",
    "description": "(Passive) Start with (x2) total Health"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Confused",
    "use": -1, // infinite,
    "Parts": "Earth",
    "name": "Centered",
    "description": "(Passive) Immune to confussion"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Sleeping",
    "use": -1, // infinite,
    "Parts": "Earth",
    "name": "Big eyes",
    "description": "(Passive) Immune to sleep"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "Paralyzed",
    "use": 2,
    "Parts": "Air",
    "name": "Push",
    "description": "Invokes air that avoids all ranged attacks for 2 turns and damages the opponent (x1.5) each turn it lasts (2) and applies Paralyzed"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "",
    "use": 1,
    "Parts": "Air",
    "name": "Wrecking ball",
    "description": "Destroys all current walls raised. Does not deal any more damage."
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self + Attack",
    "melee": "NO",
    "Status": "Channeling",
    "use": 3,
    "Parts": "Air",
    "name": "Typhon",
    "description": "Channels attack for 1 turn. After that, deals (x5) damage"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "Sleep",
    "use": 2,
    "Parts": "Phantom",
    "name": "Sweetdreams",
    "description": "Makes the opponent fall into sleep. Opponent bee won't wake up unless it's attacked or uses special ability."
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "YES",
    "Status": "",
    "use": 2,
    "Parts": "Phantom",
    "name": "Screamer",
    "description": "Scares the opponent bee, deals (x2) damage and enters in a Paralyzed state for 3 turns"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Paralyzed",
    "use": -1, // infinite,
    "Parts": "Phantom",
    "name": "Unchained",
    "description": "(Passive) Immune to Paralyzed"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Trapped",
    "use": -1, // infinite,
    "Parts": "Phantom",
    "name": "Unbound",
    "description": "(Passive) Immune to Trapped"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Poisoned",
    "use": -1, // infinite,
    "Parts": "Poison",
    "name": "Untied",
    "description": "(Passive) Immune to Poison"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "Paralyzed",
    "use": 3,
    "Parts": "Poison",
    "name": "Bequiet",
    "description": "Throws a dart that deals (x2) damage and makes the opponent bee Paralyzed 2 turns"
  },
  {
    "id": uuidv4(),
    "type_habilities": "",
    "melee": "",
    "Status": "Wall +Trapped",
    "use": 2,
    "Parts": "Poison",
    "name": "Poisontrap",
    "description": "Creates a trap and makes the enemy Trapped. If the enemy performs any fly or melee, becomes poisoned (x0.8) for 2 turns"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "All ~ All",
    "use": 2,
    "Parts": "Metal",
    "name": "Swap",
    "description": "Exchanges all buffs, debuffs and passives with the opponent. Walls don't affect this ability."
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "YES",
    "Status": "Channeling",
    "use": 4,
    "Parts": "Metal",
    "name": "Hammer",
    "description": "Charges for 1 turn. Then delivers (x6) attack"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "",
    "use": 3,
    "Parts": "Metal",
    "name": "Defender",
    "description": "For the next 4 turns, all attacks received are lowered (x1.5) your defense. You can do any other action meanwhile."
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "Passives",
    "use": 1,
    "Parts": "Gem",
    "name": "Mindclean",
    "description": "Removes all passive abilities from both bees. If opponent is using reflection, this only affects to the bee who's using Mindclean"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self + Attack",
    "melee": "",
    "Status": "Poisoned + Poisoned",
    "use": -1, // infinite,
    "Parts": "Gem",
    "name": "Mirroring",
    "description": "(Passive) If the opponent tries to use any Poison status, the opponent becomes poisoned instead, also applying any turn-based poison damage"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "Trapped",
    "use": 2,
    "Parts": "Gem",
    "name": "Nodrone",
    "description": "For each turn the opponent is flying, it receives a 15% damage of his full HP."
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Burned",
    "use": -1, // infinite,
    "Parts": "Fire",
    "name": "Uncooked",
    "description": "(Passive) Immune to Burned"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "YES",
    "Status": "Flying",
    "use": 3,
    "Parts": "Earth",
    "name": "Goaway",
    "description": "Deals (x2) damage to the opponent and sends it to fly for 2 turns"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "Flying",
    "use": 3,
    "Parts": "Air",
    "name": "Airkick",
    "description": "Deals (x1.5) damage to the opponent and sends it flying for 3 turns"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "Flying",
    "use": 3,
    "Parts": "Water",
    "name": "Tsuthrow",
    "description": "Deals (x1) damage to the opponent and sends it flying for 4 turns"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Flying",
    "use": -1, // infinite,
    "Parts": "Earth",
    "name": "Grounded",
    "description": "(Passive) You cannot Fly (impossible to apply flying status)"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Healing",
    "use": -1, // infinite,
    "Parts": "Earth",
    "name": "Regen",
    "description": "(Passive) At the end of each turn, you recover 1/8 of your max Health"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Healing",
    "use": -1, // infinite,
    "Parts": "Water",
    "name": "Regen",
    "description": "(Passive) At the end of each turn, you recover 1/8 of your max Health"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "YES",
    "Status": "Healing",
    "use": 2,
    "Parts": "Poison",
    "name": "Incurable",
    "description": "Deals (x2) Damage and stops any Healing effect of the enemy for 2 turns"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "Healing",
    "use": 2,
    "Parts": "Fire",
    "name": "Ablaze",
    "description": "Deals (x1) Damage and stops any Healing effect of the enemy for 3 turns"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self + Attack",
    "melee": "NO",
    "Status": "Channeling",
    "use": 1,
    "Parts": "Fire",
    "name": "Nuclear",
    "description": "Channels for 1 turn, then deals (x10) damage to the enemy Bee, but leaves your Bee with only 1 HP"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Defending",
    "use": -1, // infinite,
    "Parts": "Metal",
    "name": "Guard",
    "description": "(Passive) The Bee is always Defending (x0.5) all the incoming attacks"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Self",
    "melee": "",
    "Status": "Defending",
    "use": -1, // infinite,
    "Parts": "Gem",
    "name": "Guard",
    "description": "(Passive) The Bee is always Defending (x0.5) all the incoming attacks"
  },
  {
    "id": uuidv4(),
    "type_habilities": "Attack",
    "melee": "NO",
    "Status": "Sleep",
    "use": 2,
    "Parts": "Air",
    "name": "Calmbree",
    "description": "Makes the opponent fall into sleep. Opponent bee won't wake up unless it's attacked or uses special ability."
  }
];
