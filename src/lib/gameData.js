// ─── RACES ──────────────────────────────────────────────────────
export const RACES = {
  human: { label: "Human", speed: 30, abilityBonuses: { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 }, traits: ["Extra Language"], autoProficiencies: [] },
  elf: { label: "Elf", speed: 30, abilityBonuses: { dexterity: 2 }, traits: ["Darkvision", "Fey Ancestry", "Trance"], autoProficiencies: ["Perception"], subraces: {
    "high-elf": { label: "High Elf", abilityBonuses: { intelligence: 1 }, traits: ["Elf Weapon Training", "Cantrip"] },
    "wood-elf": { label: "Wood Elf", abilityBonuses: { wisdom: 1 }, traits: ["Fleet of Foot", "Mask of the Wild"], speed: 35 },
    "dark-elf": { label: "Drow", abilityBonuses: { charisma: 1 }, traits: ["Superior Darkvision", "Drow Magic"] }
  }},
  dwarf: { label: "Dwarf", speed: 25, abilityBonuses: { constitution: 2 }, traits: ["Darkvision", "Dwarven Resilience", "Stonecunning"], autoProficiencies: [], subraces: {
    "hill-dwarf": { label: "Hill Dwarf", abilityBonuses: { wisdom: 1 }, traits: ["Dwarven Toughness"] },
    "mountain-dwarf": { label: "Mountain Dwarf", abilityBonuses: { strength: 2 }, traits: ["Dwarven Armor Training"] }
  }},
  halfling: { label: "Halfling", speed: 25, abilityBonuses: { dexterity: 2 }, traits: ["Lucky", "Brave", "Halfling Nimbleness"], autoProficiencies: [], subraces: {
    "lightfoot": { label: "Lightfoot", abilityBonuses: { charisma: 1 }, traits: ["Naturally Stealthy"] },
    "stout": { label: "Stout", abilityBonuses: { constitution: 1 }, traits: ["Stout Resilience"] }
  }},
  "half-elf": { label: "Half-Elf", speed: 30, abilityBonuses: { charisma: 2 }, traits: ["Darkvision", "Fey Ancestry", "Two +1 Ability Scores"], autoProficiencies: [], bonusSkills: 2 },
  "half-orc": { label: "Half-Orc", speed: 30, abilityBonuses: { strength: 2, constitution: 1 }, traits: ["Darkvision", "Menacing", "Relentless Endurance", "Savage Attacks"], autoProficiencies: ["Intimidation"] },
  tiefling: { label: "Tiefling", speed: 30, abilityBonuses: { intelligence: 1, charisma: 2 }, traits: ["Darkvision", "Hellish Resistance", "Infernal Legacy"], autoProficiencies: [] },
  gnome: { label: "Gnome", speed: 25, abilityBonuses: { intelligence: 2 }, traits: ["Darkvision", "Gnome Cunning"], autoProficiencies: [], subraces: {
    "forest-gnome": { label: "Forest Gnome", abilityBonuses: { dexterity: 1 }, traits: ["Natural Illusionist", "Speak with Small Beasts"] },
    "rock-gnome": { label: "Rock Gnome", abilityBonuses: { constitution: 1 }, traits: ["Artificer's Lore", "Tinker"] }
  }},
  dragonborn: { label: "Dragonborn", speed: 30, abilityBonuses: { strength: 2, charisma: 1 }, traits: ["Draconic Ancestry", "Breath Weapon", "Damage Resistance"], autoProficiencies: [] },
};

// ─── CLASSES ────────────────────────────────────────────────────
export const CLASSES = {
  barbarian: { label: "Barbarian", hitDie: 12, primaryAbility: "strength", savingThrows: ["strength", "constitution"], skillChoices: 2, skills: ["Animal Handling", "Athletics", "Intimidation", "Nature", "Perception", "Survival"], icon: "⚔️" },
  bard: { label: "Bard", hitDie: 8, primaryAbility: "charisma", savingThrows: ["dexterity", "charisma"], skillChoices: 3, skills: ["Acrobatics","Animal Handling","Arcana","Athletics","Deception","History","Insight","Intimidation","Investigation","Medicine","Nature","Perception","Performance","Persuasion","Religion","Sleight of Hand","Stealth","Survival"], icon: "🎵" },
  cleric: { label: "Cleric", hitDie: 8, primaryAbility: "wisdom", savingThrows: ["wisdom", "charisma"], skillChoices: 2, skills: ["History", "Insight", "Medicine", "Persuasion", "Religion"], icon: "✝️" },
  druid: { label: "Druid", hitDie: 8, primaryAbility: "wisdom", savingThrows: ["intelligence", "wisdom"], skillChoices: 2, skills: ["Arcana", "Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Religion", "Survival"], icon: "🌿" },
  fighter: { label: "Fighter", hitDie: 10, primaryAbility: "strength", savingThrows: ["strength", "constitution"], skillChoices: 2, skills: ["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Perception", "Survival"], icon: "🛡️" },
  monk: { label: "Monk", hitDie: 8, primaryAbility: "dexterity", savingThrows: ["strength", "dexterity"], skillChoices: 2, skills: ["Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"], icon: "👊" },
  paladin: { label: "Paladin", hitDie: 10, primaryAbility: "strength", savingThrows: ["wisdom", "charisma"], skillChoices: 2, skills: ["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"], icon: "⚜️" },
  ranger: { label: "Ranger", hitDie: 10, primaryAbility: "dexterity", savingThrows: ["strength", "dexterity"], skillChoices: 3, skills: ["Animal Handling", "Athletics", "Insight", "Investigation", "Nature", "Perception", "Stealth", "Survival"], icon: "🏹" },
  rogue: { label: "Rogue", hitDie: 8, primaryAbility: "dexterity", savingThrows: ["dexterity", "intelligence"], skillChoices: 4, skills: ["Acrobatics","Athletics","Deception","Insight","Intimidation","Investigation","Perception","Performance","Persuasion","Sleight of Hand","Stealth"], icon: "🗡️" },
  sorcerer: { label: "Sorcerer", hitDie: 6, primaryAbility: "charisma", savingThrows: ["constitution", "charisma"], skillChoices: 2, skills: ["Arcana", "Deception", "Insight", "Intimidation", "Persuasion", "Religion"], icon: "✨" },
  warlock: { label: "Warlock", hitDie: 8, primaryAbility: "charisma", savingThrows: ["wisdom", "charisma"], skillChoices: 2, skills: ["Arcana", "Deception", "History", "Intimidation", "Investigation", "Nature", "Religion"], icon: "🔮" },
  wizard: { label: "Wizard", hitDie: 6, primaryAbility: "intelligence", savingThrows: ["intelligence", "wisdom"], skillChoices: 2, skills: ["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"], icon: "📖" },
};

// ─── BACKGROUNDS ────────────────────────────────────────────────
export const BACKGROUNDS = {
  acolyte: { label: "Acolyte", skills: ["Insight", "Religion"], feature: "Shelter of the Faithful" },
  charlatan: { label: "Charlatan", skills: ["Deception", "Sleight of Hand"], feature: "False Identity" },
  criminal: { label: "Criminal", skills: ["Deception", "Stealth"], feature: "Criminal Contact" },
  entertainer: { label: "Entertainer", skills: ["Acrobatics", "Performance"], feature: "By Popular Demand" },
  folkhero: { label: "Folk Hero", skills: ["Animal Handling", "Survival"], feature: "Rustic Hospitality" },
  guildartisan: { label: "Guild Artisan", skills: ["Insight", "Persuasion"], feature: "Guild Membership" },
  hermit: { label: "Hermit", skills: ["Medicine", "Religion"], feature: "Discovery" },
  noble: { label: "Noble", skills: ["History", "Persuasion"], feature: "Position of Privilege" },
  outlander: { label: "Outlander", skills: ["Athletics", "Survival"], feature: "Wanderer" },
  sage: { label: "Sage", skills: ["Arcana", "History"], feature: "Researcher" },
  sailor: { label: "Sailor", skills: ["Athletics", "Perception"], feature: "Ship's Passage" },
  soldier: { label: "Soldier", skills: ["Athletics", "Intimidation"], feature: "Military Rank" },
  urchin: { label: "Urchin", skills: ["Sleight of Hand", "Stealth"], feature: "City Secrets" },
};

// ─── SKILLS ─────────────────────────────────────────────────────
export const ALL_SKILLS = {
  "Acrobatics": "dexterity", "Animal Handling": "wisdom", "Arcana": "intelligence", "Athletics": "strength",
  "Deception": "charisma", "History": "intelligence", "Insight": "wisdom", "Intimidation": "charisma",
  "Investigation": "intelligence", "Medicine": "wisdom", "Nature": "intelligence", "Perception": "wisdom",
  "Performance": "charisma", "Persuasion": "charisma", "Religion": "intelligence", "Sleight of Hand": "dexterity",
  "Stealth": "dexterity", "Survival": "wisdom"
};

export const ABILITIES = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
export const ABILITY_SHORT = { strength: "STR", dexterity: "DEX", constitution: "CON", intelligence: "INT", wisdom: "WIS", charisma: "CHA" };

// ─── UTILITY FUNCTIONS ──────────────────────────────────────────
export const calcMod = (score) => Math.floor((score - 10) / 2);
export const modStr = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);
export const calcProfBonus = (level) => 2 + Math.floor((level - 1) / 4);
export const genId = () => crypto.randomUUID();

export const rollDice = (sides, count = 1) => {
  const rolls = [];
  for (let i = 0; i < count; i++) rolls.push(Math.floor(Math.random() * sides) + 1);
  return rolls;
};

export const roll4d6DropLowest = () => {
  const rolls = rollDice(6, 4).sort((a, b) => b - a);
  return { rolls, total: rolls[0] + rolls[1] + rolls[2], dropped: rolls[3] };
};
