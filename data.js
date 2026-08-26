// Quality tiers: `trait` is the quality appended for weapons (Common adds nothing).
// `enc` / `cost` are percentage modifiers (e.g. 0.25 = +25%).
const QUALITY = [
  { name: 'Rubbish',     trait: 'Primitive (5)', enc:  0.30, cost: -0.75 },
  { name: 'Terrible',    trait: 'Primitive (6)', enc:  0.20, cost: -0.50 },
  { name: 'Poor',        trait: 'Primitive (8)', enc:  0.10, cost: -0.25 },
  { name: 'Common',      trait: null,            enc:  0,    cost:  0    },
  { name: 'Expensive',   trait: 'Proven (3)',    enc: -0.10, cost:  0.25 },
  { name: 'Extravagant', trait: 'Proven (4)',    enc: -0.20, cost:  0.50 },
  { name: 'Exquisite',   trait: 'Proven (5)',    enc: -0.30, cost:  0.75 },
];

// Melee Weapon Materials: dam/pen are flat modifiers, qualities are added, costMulti multiplies base price.
const MATERIALS_MELEE = {
  'Adamantium':   { dam:  3, pen:  6, qualities: ['Dire'], enc: -0.25, costMulti: 9.0 },
  'Bone':         { dam: -2, pen: -3, qualities: [],       enc: -0.35, costMulti: 0.2 },
  'Bonemold':     { dam:  0, pen: -1, qualities: [],       enc: -0.15, costMulti: 0.8 },
  'Chitin':       { dam: -2, pen: -2, qualities: [],       enc: -0.35, costMulti: 0.6 },
  'Daedric':      { dam:  5, pen: 15, qualities: ['Dire'], enc:  0.50, costMulti: 15.0 },
  'Dragon-bone':  { dam:  5, pen: 14, qualities: ['Dire'], enc:  0.40, costMulti: 14.0 },
  'Dwemer':       { dam:  2, pen:  4, qualities: [],       enc:  0.25, costMulti: 4.0 },
  'Ebonsteel':    { dam:  3, pen:  9, qualities: [],       enc:  0.15, costMulti: 8.0 },
  'Ebony':        { dam:  4, pen: 10, qualities: [],       enc:  0.20, costMulti: 9.0 },
  'Iron':         { dam: -1, pen: -2, qualities: [],       enc: -0.05, costMulti: 0.7 },
  'Malachite':    { dam:  4, pen:  9, qualities: [],       enc: -0.25, costMulti: 8.0 },
  'Moonstone':    { dam:  2, pen:  8, qualities: [],       enc: -0.60, costMulti: 6.0 },
  'Orichalcum':   { dam:  1, pen:  3, qualities: [],       enc:  0.15, costMulti: 2.0 },
  'Quicksilver':  { dam:  3, pen:  7, qualities: [],       enc: -0.20, costMulti: 4.5 },
  'Silver':       { dam: -1, pen:  0, qualities: ['Dire'], enc: -0.30, costMulti: 1.5 },
  'Stalhrim':     { dam:  5, pen: 11, qualities: ['Dire'], enc: -0.15, costMulti: 12.0 },
  'Steel':        { dam:  0, pen:  0, qualities: [],       enc:  0,    costMulti: 1.0 },
  'Wood':         { dam: -3, pen: -3, qualities: [],       enc: -0.40, costMulti: 0.4 },
};

// Ranged Weapon Launcher Materials (bows/crossbows only): only Range is modified, no Dam/Pen/Qualities.
// Range mod applies to the medium value only; long range = 2 x new medium (per source table's note).
const MATERIALS_RANGED = {
  'Adamantium':   { range:  20, enc: -0.25, costMulti: 3.0 },
  'Bone':         { range: -10, enc: -0.35, costMulti: 0.2 },
  'Bonemold':     { range:  15, enc: -0.15, costMulti: 2.5 },
  'Chitin':       { range:  -5, enc: -0.35, costMulti: 0.5 },
  'Daedric':      { range:  55, enc:  0.50, costMulti: 6.5 },
  'Dragon-bone':  { range:  50, enc:  0.40, costMulti: 6.0 },
  'Dwemer':       { range:  10, enc:  0.25, costMulti: 2.0 },
  'Ebonsteel':    { range:  35, enc:  0.15, costMulti: 4.0 },
  'Ebony':        { range:  40, enc:  0.20, costMulti: 5.0 },
  'Malachite':    { range:  30, enc: -0.25, costMulti: 4.0 },
  'Moonstone':    { range:  25, enc: -0.60, costMulti: 3.5 },
  'Orichalcum':   { range:   5, enc:  0.15, costMulti: 1.5 },
  'Quicksilver':  { range:  35, enc: -0.20, costMulti: 4.5 },
  'Stalhrim':     { range:  45, enc: -0.15, costMulti: 5.5 },
  'Steel':        { range:   0, enc:  0,    costMulti: 1.0 },
  'Wood':         { range:   0, enc: -0.40, costMulti: 0.7 },
};

// Weapons. `dice`/`flat`/`type` describe damage (e.g. 3d10+2 R); null dice means no direct damage roll.
// `kind` is 'melee' or 'ranged' and picks which material table applies.
// Melee weapons carry s/r (size/reach); ranged weapons carry a range triplet [short, medium, long] instead.
const WEAPONS = [
  // Two-Handed Melee
  { name: 'Dai-Katana', category: 'Two-Handed Melee', kind: 'melee', dice: '3d10', flat: 2, type: 'R', pen: 8, s: 'L', r: 'L', wpc: 'EB', qualities: ['Impale', 'Tear', 'Unbalanced'], enc: 6, cost: 155 },
  { name: 'Glaive', category: 'Two-Handed Melee', kind: 'melee', dice: '2d10', flat: 10, type: 'R', pen: 12, s: 'L', r: 'VL', wpc: 'EB', qualities: ['Impale', 'Sunder', 'Unbalanced'], enc: 7, cost: 125 },
  { name: 'Great Axe', category: 'Two-Handed Melee', kind: 'melee', dice: '3d10', flat: 3, type: 'R', pen: 14, s: 'H', r: 'L', wpc: 'HA', qualities: ['Sunder', 'Tear', 'Unwieldy'], enc: 7, cost: 130 },
  { name: 'Great Club', category: 'Two-Handed Melee', kind: 'melee', dice: '2d10', flat: 0, type: 'I', pen: 13, s: 'H', r: 'L', wpc: 'HB', qualities: ['Concuss', 'Unwieldy'], enc: 6, cost: 45 },
  { name: 'Great Flail', category: 'Two-Handed Melee', kind: 'melee', dice: '2d10', flat: 0, type: 'I', pen: 15, s: 'L', r: 'L', wpc: 'HB', qualities: ['Concuss', 'Flail'], enc: 6, cost: 50 },
  { name: 'Great Hammer', category: 'Two-Handed Melee', kind: 'melee', dice: '3d10', flat: 0, type: 'I', pen: 20, s: 'H', r: 'L', wpc: 'HB', qualities: ['Concuss', 'Sunder', 'Unwieldy'], enc: 8, cost: 115 },
  { name: 'Great Sword', category: 'Two-Handed Melee', kind: 'melee', dice: '3d10', flat: 5, type: 'R', pen: 10, s: 'H', r: 'L', wpc: 'LBE', qualities: ['Impale', 'Sunder'], enc: 7, cost: 150 },
  { name: 'Halberd', category: 'Two-Handed Melee', kind: 'melee', dice: '2d10', flat: 8, type: 'R', pen: 12, s: 'H', r: 'VL', wpc: 'PA', qualities: ['Impale', 'Sunder', 'Unwieldy'], enc: 8, cost: 100 },
  { name: 'Lance (Foot)', category: 'Two-Handed Melee', kind: 'melee', dice: '2d10', flat: 5, type: 'R', pen: 15, s: 'H', r: 'VL', wpc: 'PA', qualities: ['Impale', 'Sunder', 'Unwieldy'], enc: 7, cost: 75 },
  { name: 'Maul', category: 'Two-Handed Melee', kind: 'melee', dice: '2d10', flat: 5, type: 'I', pen: 18, s: 'L', r: 'L', wpc: 'HB', qualities: ['Concuss', 'Sunder', 'Unwieldy'], enc: 6, cost: 90 },

  // Hand-and-a-Half Melee
  { name: 'Battle Axe', category: 'Hand-and-a-Half Melee', kind: 'melee', dice: '2d10', flat: 4, type: 'R', pen: 12, s: 'L', r: 'L', wpc: 'HA', qualities: ['Tear', 'Unbalanced'], enc: 5, cost: 105 },
  { name: 'Katana', category: 'Hand-and-a-Half Melee', kind: 'melee', dice: '2d10', flat: 2, type: 'R', pen: 6, s: 'M', r: 'M', wpc: 'EB', qualities: ['Finesse', 'Impale', 'Tear'], enc: 4, cost: 130 },
  { name: 'Long Spear', category: 'Hand-and-a-Half Melee', kind: 'melee', dice: '2d10', flat: 3, type: 'R', pen: 15, s: 'L', r: 'VL', wpc: 'PA', qualities: ['Impale', 'Unbalanced'], enc: 3, cost: 70 },
  { name: 'Long Sword', category: 'Hand-and-a-Half Melee', kind: 'melee', dice: '2d10', flat: 5, type: 'R', pen: 8, s: 'L', r: 'L', wpc: 'LBE', qualities: ['Balanced', 'Impale'], enc: 5, cost: 125 },
  { name: 'Quarterstaff', category: 'Hand-and-a-Half Melee', kind: 'melee', dice: '1d10', flat: 3, type: 'I', pen: 0, s: 'M', r: 'L', wpc: 'LBT', qualities: ['Finesse', 'Stun', 'Well Balanced'], enc: 3, cost: 15 },
  { name: 'Warhammer', category: 'Hand-and-a-Half Melee', kind: 'melee', dice: '2d10', flat: 0, type: 'I', pen: 18, s: 'L', r: 'M', wpc: 'HB', qualities: ['Concuss', 'Sunder', 'Unwieldy'], enc: 6, cost: 83 },

  // One-Handed Melee
  { name: 'Broadsword', category: 'One-Handed Melee', kind: 'melee', dice: '2d10', flat: 3, type: 'R', pen: 6, s: 'M', r: 'M', wpc: 'SB', qualities: ['Impale'], enc: 4, cost: 88 },
  { name: 'Claws', category: 'One-Handed Melee', kind: 'melee', dice: '1d5', flat: 2, type: 'R', pen: 3, s: 'S', r: 'T', wpc: 'H2H', qualities: ['Finesse', 'Tear'], enc: 1, cost: 10 },
  { name: 'Club', category: 'One-Handed Melee', kind: 'melee', dice: '1d10', flat: 1, type: 'I', pen: 8, s: 'M', r: 'M', wpc: 'LBT', qualities: ['Stun', 'Unbalanced'], enc: 4, cost: 20 },
  { name: 'Dagger', category: 'One-Handed Melee', kind: 'melee', dice: '1d10', flat: 2, type: 'R', pen: 5, s: 'S', r: 'S', wpc: 'SB', qualities: ['Finesse', 'Impale', 'Throw'], enc: 1, cost: 35 },
  { name: 'Flail', category: 'One-Handed Melee', kind: 'melee', dice: '1d10', flat: 1, type: 'I', pen: 10, s: 'M', r: 'M', wpc: 'LBT', qualities: ['Stun', 'Flail'], enc: 4, cost: 25 },
  { name: 'Hammer', category: 'One-Handed Melee', kind: 'melee', dice: '1d10', flat: 0, type: 'I', pen: 15, s: 'M', r: 'S', wpc: 'LBT', qualities: ['Concuss', 'Sunder'], enc: 4, cost: 70 },
  { name: 'Hatchet', category: 'One-Handed Melee', kind: 'melee', dice: '2d10', flat: 0, type: 'R', pen: 6, s: 'S', r: 'S', wpc: 'LA', qualities: ['Tear', 'Throw', 'Unbalanced'], enc: 2, cost: 45 },
  { name: 'Hook Sword', category: 'One-Handed Melee', kind: 'melee', dice: '2d10', flat: 0, type: 'R', pen: 3, s: 'M', r: 'M', wpc: 'SB', qualities: ['Entrap'], enc: 4, cost: 80 },
  { name: 'Javelin', category: 'One-Handed Melee', kind: 'melee', dice: '2d10', flat: 1, type: 'R', pen: 12, s: 'M', r: 'M', wpc: 'PA', qualities: ['Impale', 'Throw'], enc: 2, cost: 40 },
  { name: 'Knuckles', category: 'One-Handed Melee', kind: 'melee', dice: '1d5', flat: 1, type: 'I', pen: 0, s: 'S', r: 'T', wpc: 'H2H', qualities: ['Finesse', 'Stun'], enc: 0.1, cost: 5 },
  { name: 'Lance (Mounted)', category: 'One-Handed Melee', kind: 'melee', dice: '3d10', flat: 5, type: 'R', pen: 15, s: 'H', r: 'VL', wpc: 'PA', qualities: ['Impale', 'Sunder', 'Unwieldy'], enc: 7, cost: 75 },
  { name: 'Mace', category: 'One-Handed Melee', kind: 'melee', dice: '1d10', flat: 5, type: 'I', pen: 15, s: 'M', r: 'S', wpc: 'LBT', qualities: ['Concuss', 'Sunder'], enc: 4, cost: 63 },
  { name: 'Net', category: 'One-Handed Melee', kind: 'melee', dice: null, flat: 0, type: null, pen: null, s: 'S', r: 'L', wpc: 'Net', qualities: ['Entangle', 'Entrap', 'Throw'], enc: 0.1, cost: null },
  { name: 'Nunchaku', category: 'One-Handed Melee', kind: 'melee', dice: '1d10', flat: 3, type: 'I', pen: 10, s: 'M', r: 'S', wpc: 'LBT', qualities: ['Stun', 'Finesse', 'Flail'], enc: 3, cost: 40 },
  { name: 'Parrying Dagger', category: 'One-Handed Melee', kind: 'melee', dice: '1d10', flat: 0, type: 'R', pen: 4, s: 'S', r: 'M', wpc: 'SB', qualities: ['Finesse', 'Impale', 'Well Balanced'], enc: 1, cost: 50 },
  { name: 'Punch Dagger', category: 'One-Handed Melee', kind: 'melee', dice: '1d5', flat: 3, type: 'R', pen: 5, s: 'S', r: 'T', wpc: 'H2H', qualities: ['Finesse', 'Impale'], enc: 0.1, cost: 25 },
  { name: 'Rapier', category: 'One-Handed Melee', kind: 'melee', dice: '2d10', flat: 1, type: 'R', pen: 7, s: 'M', r: 'L', wpc: 'LBE', qualities: ['Finesse', 'Impale', 'Balanced'], enc: 3, cost: 63 },
  { name: 'Sabre', category: 'One-Handed Melee', kind: 'melee', dice: '2d10', flat: 2, type: 'R', pen: 6, s: 'M', r: 'M', wpc: 'SB', qualities: ['Balanced', 'Impale'], enc: 4, cost: 100 },
  { name: 'Scimitar', category: 'One-Handed Melee', kind: 'melee', dice: '1d10', flat: 6, type: 'R', pen: 6, s: 'M', r: 'S', wpc: 'SB', qualities: ['Finesse', 'Tear', 'Unbalanced'], enc: 3, cost: 113 },
  { name: 'Short Spear', category: 'One-Handed Melee', kind: 'melee', dice: '2d10', flat: 0, type: 'R', pen: 12, s: 'M', r: 'L', wpc: 'PA', qualities: ['Impale'], enc: 2, cost: 35 },
  { name: 'Short Sword', category: 'One-Handed Melee', kind: 'melee', dice: '1d10', flat: 5, type: 'R', pen: 6, s: 'M', r: 'S', wpc: 'SB', qualities: ['Finesse', 'Impale', 'Well Balanced'], enc: 3, cost: 63 },
  { name: 'Tanto', category: 'One-Handed Melee', kind: 'melee', dice: '1d10', flat: 2, type: 'R', pen: 4, s: 'S', r: 'S', wpc: 'EB', qualities: ['Finesse', 'Impale', 'Tear'], enc: 1, cost: 38 },
  { name: 'Throwing Knife', category: 'One-Handed Melee', kind: 'melee', dice: '1d10', flat: 1, type: 'R', pen: 4, s: 'S', r: 'T', wpc: 'SB', qualities: ['Finesse', 'Impale', 'Throw'], enc: 0.1, cost: 4 },
  { name: 'Trident', category: 'One-Handed Melee', kind: 'melee', dice: '2d10', flat: 1, type: 'R', pen: 12, s: 'M', r: 'L', wpc: 'PA', qualities: ['Barbed', 'Impale', 'Unbalanced'], enc: 4, cost: 80 },
  { name: 'Tulwar', category: 'One-Handed Melee', kind: 'melee', dice: '2d10', flat: 3, type: 'R', pen: 6, s: 'M', r: 'M', wpc: 'SB', qualities: ['Tear', 'Unwieldy'], enc: 4, cost: 113 },
  { name: 'Wakizashi', category: 'One-Handed Melee', kind: 'melee', dice: '1d10', flat: 5, type: 'R', pen: 5, s: 'M', r: 'S', wpc: 'EB', qualities: ['Finesse', 'Impale', 'Tear'], enc: 2, cost: 65 },
  { name: 'War Axe', category: 'One-Handed Melee', kind: 'melee', dice: '2d10', flat: 1, type: 'R', pen: 10, s: 'M', r: 'M', wpc: 'LA', qualities: ['Tear', 'Unbalanced'], enc: 4, cost: 88 },
  { name: 'War Pick', category: 'One-Handed Melee', kind: 'melee', dice: '2d10', flat: 0, type: 'R', pen: 20, s: 'M', r: 'M', wpc: 'LA', qualities: ['Impale', 'Unbalanced'], enc: 4, cost: 88 },
  { name: 'Staff', category: 'One-Handed Melee', kind: 'melee', dice: '1d10', flat: 3, type: 'I', pen: 0, s: 'M', r: 'L', wpc: 'LBT', qualities: ['School (Magic Type) OR Created, Focus, Stun, Well Balanced'], enc: 4, cost: 30 },
  { name: 'Stave', category: 'One-Handed Melee', kind: 'melee', dice: '1d5', flat: 2, type: 'I', pen: 0, s: 'M', r: 'S', wpc: 'LBT', qualities: ['School (Magic Type) OR Created, Focus, Stun, Well Balanced'], enc: 2, cost: 20 },

  // Two-Handed Ranged
  { name: 'Heavy Crossbow', category: 'Two-Handed Ranged', kind: 'ranged', dice: '3d10', flat: 4, type: 'R', pen: 20, range: [20, 150, 300], wpc: 'CB', qualities: ['Complex', 'Impale', 'Reload', 'Sunder'], enc: 5, cost: 175 },
  { name: 'Light Crossbow', category: 'Two-Handed Ranged', kind: 'ranged', dice: '2d10', flat: 4, type: 'R', pen: 15, range: [20, 100, 200], wpc: 'CB', qualities: ['Complex', 'Impale', 'Reload'], enc: 4, cost: 75 },
  { name: 'Longbow', category: 'Two-Handed Ranged', kind: 'ranged', dice: '2d10', flat: 5, type: 'R', pen: 10, range: [15, 125, 250], wpc: 'B', qualities: ['Impale'], enc: 3, cost: 100 },
  { name: 'Short-bow', category: 'Two-Handed Ranged', kind: 'ranged', dice: '1d10', flat: 5, type: 'R', pen: 5, range: [10, 100, 200], wpc: 'B', qualities: ['Impale'], enc: 2, cost: 45 },
  { name: 'Hand Crossbow', category: 'Two-Handed Ranged', kind: 'ranged', dice: '2d10', flat: 0, type: 'R', pen: 10, range: [10, 80, 160], wpc: 'CB', qualities: ['1HF', 'Complex', 'Impale', 'Reload'], enc: 2, cost: 88 },

  // One-Handed Ranged (thrown)
  { name: 'Bolas', category: 'One-Handed Ranged', kind: 'ranged', dice: null, flat: 0, type: null, pen: null, range: [10, 20, 40], wpc: 'TW', qualities: ['Entangle', 'Throw'], enc: 0.1, cost: 7 },
  { name: 'Thrown Dagger', category: 'One-Handed Ranged', kind: 'ranged', dice: '1d10', flat: 2, type: 'R', pen: 5, range: [5, 10, 20], wpc: 'TW', qualities: ['Impale', 'Throw'], enc: 1, cost: 35 },
  { name: 'Dart', category: 'One-Handed Ranged', kind: 'ranged', dice: '1d10', flat: 0, type: 'R', pen: 5, range: [5, 20, 40], wpc: 'TW', qualities: ['Impale', 'Throw'], enc: 0.1, cost: 5 },
  { name: 'Thrown Hatchet', category: 'One-Handed Ranged', kind: 'ranged', dice: '2d10', flat: 0, type: 'R', pen: 6, range: [5, 10, 20], wpc: 'TW', qualities: ['Throw'], enc: 2, cost: 45 },
  { name: 'Thrown Javelin', category: 'One-Handed Ranged', kind: 'ranged', dice: '2d10', flat: 1, type: 'R', pen: 12, range: [15, 30, 60], wpc: 'TW', qualities: ['Impale', 'Throw'], enc: 2, cost: 40 },
  { name: 'Thrown Net', category: 'One-Handed Ranged', kind: 'ranged', dice: null, flat: 0, type: null, pen: null, range: [5, 10, 20], wpc: 'Net', qualities: ['Entangle', 'Throw'], enc: 0.1, cost: null },
  { name: 'Sling', category: 'One-Handed Ranged', kind: 'ranged', dice: '1d10', flat: 2, type: 'I', pen: 0, range: [10, 20, 40], wpc: 'TW', qualities: ['Stunning'], enc: 0.1, cost: 5 },
  { name: 'Thrown Knife', category: 'One-Handed Ranged', kind: 'ranged', dice: '1d10', flat: 1, type: 'R', pen: 4, range: [5, 20, 40], wpc: 'TW', qualities: ['Impale', 'Throw'], enc: 0.1, cost: 4 },
  { name: 'Shuriken', category: 'One-Handed Ranged', kind: 'ranged', dice: '1d10', flat: 0, type: 'R', pen: 3, range: [5, 20, 40], wpc: 'TW', qualities: ['Tear', 'Thrown'], enc: 0.1, cost: 3 },
];

const CATEGORY_ORDER = [
  'Two-Handed Melee',
  'Hand-and-a-Half Melee',
  'One-Handed Melee',
  'Two-Handed Ranged',
  'One-Handed Ranged',
];

// Armor quality tiers: AR is added/subtracted directly (no trait names, unlike weapon Quality).
// `enc` / `cost` are percentage modifiers (e.g. 0.25 = +25%), same convention as weapon QUALITY.
const ARMOR_QUALITY = [
  { name: 'Rubbish',     ar: -3, enc:  0.30, cost: -0.75 },
  { name: 'Terrible',    ar: -2, enc:  0.20, cost: -0.50 },
  { name: 'Poor',        ar: -1, enc:  0.10, cost: -0.25 },
  { name: 'Common',      ar:  0, enc:  0,    cost:  0 },
  { name: 'Expensive',   ar:  1, enc: -0.10, cost:  0.25 },
  { name: 'Extravagant', ar:  2, enc: -0.20, cost:  0.50 },
  { name: 'Exquisite',   ar:  3, enc: -0.30, cost:  0.75 },
];

// Base armor types. `enc` is per-location (Body/Head/Arm/Leg) encumbrance; `totalEnc`/`totalCost`
// are the literal totals from the source table (a full suit = 1 body + 1 head + 2 arms + 2 legs).
const ARMOR_TYPES = [
  { name: 'Padded Robes',    category: 'Unarmored', ar: 2,  enc: { body: 1,  head: 1, arm: 1, leg: 1 }, totalEnc: 6,  costPerLoc: 20,  totalCost: 120 },
  { name: 'Natural/Cured',   category: 'Light',      ar: 8,  enc: { body: 3,  head: 1, arm: 1, leg: 1 }, totalEnc: 8,  costPerLoc: 10,  totalCost: 60 },
  { name: 'Padded/Quilted',  category: 'Light',      ar: 12, enc: { body: 3,  head: 1, arm: 2, leg: 2 }, totalEnc: 12, costPerLoc: 30,  totalCost: 180 },
  { name: 'Hardened/Sturdy', category: 'Light',      ar: 14, enc: { body: 4,  head: 2, arm: 2, leg: 2 }, totalEnc: 14, costPerLoc: 40,  totalCost: 240 },
  { name: 'Ring-mail',       category: 'Medium',     ar: 16, enc: { body: 5,  head: 2, arm: 2, leg: 3 }, totalEnc: 17, costPerLoc: 50,  totalCost: 300 },
  { name: 'Scaled',          category: 'Medium',     ar: 18, enc: { body: 6,  head: 2, arm: 3, leg: 4 }, totalEnc: 22, costPerLoc: 75,  totalCost: 450 },
  { name: 'Partial Plate',   category: 'Medium',     ar: 20, enc: { body: 7,  head: 2, arm: 4, leg: 5 }, totalEnc: 28, costPerLoc: 100, totalCost: 600 },
  { name: 'Mail',            category: 'Heavy',      ar: 23, enc: { body: 7,  head: 3, arm: 5, leg: 5 }, totalEnc: 30, costPerLoc: 150, totalCost: 900 },
  { name: 'Plated Mail',     category: 'Heavy',      ar: 26, enc: { body: 10, head: 4, arm: 6, leg: 7 }, totalEnc: 40, costPerLoc: 200, totalCost: 1200 },
  { name: 'Full Plate',      category: 'Heavy',      ar: 30, enc: { body: 12, head: 6, arm: 7, leg: 8 }, totalEnc: 48, costPerLoc: 250, totalCost: 1500 },
];

const ARMOR_CATEGORY_ORDER = ['Unarmored', 'Light', 'Medium', 'Heavy'];

// Body locations an armor piece can cover. Left/Right Arm both use the `arm` enc value (and
// likewise for legs) since the source table doesn't distinguish sides.
const BODY_LOCATIONS = [
  { name: 'Head', key: 'head' },
  { name: 'Body', key: 'body' },
  { name: 'Left Arm', key: 'arm' },
  { name: 'Right Arm', key: 'arm' },
  { name: 'Left Leg', key: 'leg' },
  { name: 'Right Leg', key: 'leg' },
];

// Armor materials. `enc`/`costMulti` scale the base armor type's totalEnc/totalCost above
// (costMulti is a straight multiplier, e.g. x9.0; enc is a percentage modifier, e.g. -0.25 = -25%).
// Malachite and Stalhrim have a different enc modifier depending on the base armor's weight
// category, so their `enc` is an object keyed by that category instead of a single number.
// Wood ("Shields Only" in the source) is omitted — this tab covers body armor, not shields.
const ARMOR_MATERIALS = {
  'Adamantium':   { weights: ['Medium', 'Heavy'],          ar:  6,   enc: -0.25, costMulti: 9.0,  qualities: ['Rigid', 'Resist (Magic)'] },
  'Bone':         { weights: ['Medium'],                   ar: -10,  enc:  0.30, costMulti: 0.2,  qualities: ['Mundane'] },
  'Bonemold':     { weights: ['Medium'],                   ar:  2,   enc: -0.15, costMulti: 2.5,  qualities: ['Brittle', 'Mundane'] },
  'Chaurus':      { weights: ['Unarmored', 'Light'],       ar:  1,   enc:  0.05, costMulti: 1.5,  qualities: ['Brittle', 'Mundane'] },
  'Chitin':       { weights: ['Unarmored', 'Light'],       ar:  2,   enc:  0.25, costMulti: 1.5,  qualities: ['Brittle', 'Mundane'] },
  'Daedric':      { weights: ['Heavy'],                    ar: 15,   enc:  0.50, costMulti: 15.0, qualities: ['Fear', 'Rigid', 'Spiked'] },
  'Dragon Bone':  { weights: ['Heavy'],                    ar: 14,   enc:  0.40, costMulti: 14.0, qualities: ['Rigid', 'Spiked', 'Resist (Magic)'] },
  'Dragon Scale': { weights: ['Medium'],                   ar: 13,   enc:  0.30, costMulti: 13.0, qualities: ['Brittle', 'Spiked', 'Resist (Dragon)'] },
  'Dragon Hide':  { weights: ['Light'],                    ar: 12,   enc:  0.15, costMulti: 12.0, qualities: ['Flexible', 'Spiked', 'Resist (Dragon)'] },
  'Dreugh Hide':  { weights: ['Unarmored', 'Light'],       ar:  4,   enc:  0.10, costMulti: 4.0,  qualities: ['Flammable', 'Flexible', 'Mundane'] },
  'Dwemer':       { weights: ['Heavy'],                    ar:  4,   enc:  0.25, costMulti: 4.0,  qualities: ['Mundane', 'Rigid'] },
  'Ebonsteel':    { weights: ['Medium', 'Heavy'],          ar:  9,   enc:  0.15, costMulti: 9.0,  qualities: ['Mundane', 'Rigid'] },
  'Ebony':        { weights: ['Medium', 'Heavy'],          ar: 10,   enc:  0.20, costMulti: 10.0, qualities: ['Mundane', 'Rigid', 'Resist (Magic)'] },
  'Fur':          { weights: ['Unarmored', 'Light'],       ar: -1,   enc:  0.05, costMulti: 0.9,  qualities: ['Flammable', 'Flexible', 'Mundane'] },
  'Iron':         { weights: ['Medium', 'Heavy'],          ar: -2,   enc: -0.05, costMulti: 0.8,  qualities: ['Mundane', 'Rigid'] },
  'Leather':      { weights: ['Unarmored', 'Light'],       ar:  0,   enc:  0,    costMulti: 1.0,  qualities: ['Flammable', 'Flexible', 'Mundane'] },
  'Lycan Hide':   { weights: ['Unarmored', 'Light'],       ar:  2,   enc:  0.10, costMulti: 2.0,  qualities: ['Flammable', 'Flexible'] },
  'Malachite':    { weights: ['Light', 'Medium'],          ar:  9,   enc: { Light: 0.30, Medium: -0.25 }, costMulti: 9.0, qualities: ['Mundane', 'Rigid'] },
  'Mithril':      { weights: ['Light'],                    ar:  6,   enc: -0.70, costMulti: 6.0,  qualities: ['Flexible', 'Mundane', 'Resist (Magic)'] },
  'Moonstone':    { weights: ['Unarmored', 'Light'],       ar:  8,   enc: -0.30, costMulti: 8.0,  qualities: ['Flexible', 'Mundane'] },
  'Orichalcum':   { weights: ['Medium', 'Heavy'],          ar:  8,   enc:  0.15, costMulti: 8.0,  qualities: ['Fear', 'Mundane', 'Rigid', 'Spiked'] },
  'Quicksilver':  { weights: ['Medium', 'Heavy'],          ar:  7,   enc: -0.20, costMulti: 7.0,  qualities: ['Mundane', 'Rigid', 'Resist (Magic)'] },
  'Stalhrim':     { weights: ['Light', 'Medium'],          ar: 11,   enc: { Light: 0.20, Medium: -0.40 }, costMulti: 11.0, qualities: ['Rigid', 'Resist (Frost)'] },
  'Steel':        { weights: ['Medium', 'Heavy'],          ar:  0,   enc:  0,    costMulti: 1.0,  qualities: ['Mundane', 'Rigid'] },
  'Troll':        { weights: ['Light', 'Medium', 'Heavy'], ar:  7,   enc:  0.30, costMulti: 6.0,  qualities: ['Flammable', 'Flexible', 'Resist (Normal)'] },
  'Wamasu':       { weights: ['Light', 'Medium', 'Heavy'], ar:  6,   enc:  0.20, costMulti: 6.0,  qualities: ['Flexible', 'Resist (Shock)', 'Mundane'] },
  // Shields-only material — its `weights` never match a body armor category, so it's automatically
  // excluded from the Armour tab and only appears in the Shields tab (which ignores `weights`).
  'Wood':         { weights: ['Shields Only'],             ar: -4,   enc: -0.50, costMulti: 0.6,  qualities: ['Brittle', 'Flammable', 'Mundane'] },
};

// Returns a material's encumbrance modifier for a given base-item category. Malachite and Stalhrim
// store their enc mod as {Light, Medium} since it differs by weight class; when there's no matching
// category (e.g. a shield, which has no weight class), the two variants are averaged.
function getMaterialEncMod(material, category) {
  if (typeof material.enc === 'number') return material.enc;
  if (category && material.enc[category] !== undefined) return material.enc[category];
  const values = Object.values(material.enc);
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

// Base shield types. `rangedDefense` scales 0.5 -> 1 -> 2 with size; `enc`/`cost` are per-shield
// totals (shields aren't split into body locations the way armor is).
const SHIELD_TYPES = [
  { name: 'Small',  ar: 15, bashDamage: '1d5 I',   rangedDefense: 0.5, enc: 2, cost: 50 },
  { name: 'Medium', ar: 20, bashDamage: '1d5+1 I', rangedDefense: 1,   enc: 4, cost: 100 },
  { name: 'Large',  ar: 25, bashDamage: '1d5+2 I', rangedDefense: 2,   enc: 6, cost: 150 },
];

const ARMOR_MATERIAL_NAMES = Object.keys(ARMOR_MATERIALS);

// Spell Scroll levels: `prefix` is prepended to the spell name (empty string = no prefix, the base tier).
// `level` (1-6) feeds the magicka/effect formulas below; `xp` is the cost in XP/CrP to learn a spell of that level.
const SPELL_LEVELS = [
  { name: 'Lesser',    prefix: 'Lesser',    level: 1, xp: 5 },
  { name: 'Minor',     prefix: 'Minor',     level: 2, xp: 10 },
  { name: 'Standard',  prefix: '',          level: 3, xp: 15 },
  { name: 'Major',     prefix: 'Major',     level: 4, xp: 20 },
  { name: 'Greater',   prefix: 'Greater',   level: 5, xp: 25 },
  { name: 'Legendary', prefix: 'Legendary', level: 6, xp: 30 },
];

// Spells. `magicka` is either a number (flat cost regardless of level), the string 'varies' (cost
// depends on the specific thing summoned, see effect text), or 'L*N' meaning level * N.
// `effect` uses "[Spell Level]" as a placeholder, substituted (and simple "N*[Spell Level]" products
// evaluated) at render time.
const SPELLS = [
  // Alteration
  { name: 'Barrier', school: 'Alteration', form: 'Self', magicka: 'L*20', effect: 'Target gains 5*[Spell Level] AR to all hit locations for 1 minute.' },
  { name: 'Iron-Flesh', school: 'Alteration', form: 'Self', magicka: 'L*10', effect: 'Target gains a magic shield that provides 5*[Spell Level] bonus armor against physical damage for 1 minute.' },
  { name: 'Leap', school: 'Alteration', form: 'Self', magicka: 'L*3', effect: 'Target gains a +30*[Spell Level] bonus on their next horizontal or vertical jump test within 3 rounds.' },
  { name: 'Blade-Mender', school: 'Alteration', form: 'Touch', magicka: 'L*7', effect: 'Reduces the X value of the Damaged (X) condition of target weapon by [Spell Level].' },
  { name: 'Crushing Weight', school: 'Alteration', form: 'Target', magicka: 'L*18', effect: "Reduce the target's Carry Rating by [Spell Level] for 2 minutes." },
  { name: 'Feather-light', school: 'Alteration', form: 'Self', magicka: 'L*4', effect: "Increases the target's Carry Rating by [Spell Level] for 2 minutes." },
  { name: 'Fire Barrier', school: 'Alteration', form: 'Self', magicka: 'L*10', effect: 'Target gains a magic shield that provides 5*[Spell Level] bonus armor against fire damage for 1 minute.' },
  { name: 'Frost Barrier', school: 'Alteration', form: 'Self', magicka: 'L*10', effect: 'Target gains a magic shield that provides 5*[Spell Level] bonus armor against frost damage for 1 minute.' },
  { name: 'Rising Force', school: 'Alteration', form: 'Self', magicka: 'L*15', effect: 'Target gains the Flyer ([Spell Level]) trait for 3 minutes.' },
  { name: 'Seal', school: 'Alteration', form: 'Touch', magicka: 'L*6', effect: 'Target door/chest is sealed with a magic lock (Level = [Spell Level]). Can only be opened with the Open effect.' },
  { name: 'Shield-Mender', school: 'Alteration', form: 'Touch', magicka: 'L*7', effect: 'Restores [Spell Level]d5 missing AR from target armor piece.' },
  { name: 'Shock Barrier', school: 'Alteration', form: 'Self', magicka: 'L*10', effect: 'Target gains a magic shield that provides 5*[Spell Level] bonus armor against shock damage for 1 minute.' },
  { name: 'Slowfall', school: 'Alteration', form: 'Self', magicka: 'L*3', effect: 'Target decreases the distance of his next fall within 3 rounds by 5*[Spell Level] meters for calculating damage.' },
  { name: 'Unhinging', school: 'Alteration', form: 'Touch', magicka: 'L*3', effect: 'Target lock of lock level [Spell Level] or lower is unlocked.' },
  { name: 'Water Breathing', school: 'Alteration', form: 'Self', magicka: 'L*3', effect: 'Target may breathe water as if it were air for [Spell Level] minutes.' },
  { name: 'Water Walking', school: 'Alteration', form: 'Self', magicka: 'L*3', effect: 'Target may walk on water as if it were land for [Spell Level] minutes.' },

  // Conjuration
  { name: 'Bind Construct', school: 'Conjuration', form: 'Self', magicka: 'varies', effect: 'Summons a construct for 30*[Spell Level] minutes. (e.g., Flesh Atronach cost 50, Iron Atronach cost 60).' },
  { name: 'Summon Daedra', school: 'Conjuration', form: 'Self', magicka: 'varies', effect: 'Summons a Daedra for 15 minutes (+15m per Spell Level). Base costs range from 20 (Scamp) to 80 (Winged Twilight).' },
  { name: 'Summon Daedric Armour', school: 'Conjuration', form: 'Self', magicka: 'L*5', effect: 'Summons Terrible quality Daedric armor. Persists for 30 Seconds (+30s per Spell Level). Upgrades one quality step per level.' },
  { name: 'Summon Daedric Weapon', school: 'Conjuration', form: 'Self', magicka: 'L*5', effect: 'Summons a Terrible quality Daedric weapon. Persists for 30 Seconds (+30s per Spell Level). Upgrades one quality step per level.' },
  { name: 'Summon Spirit', school: 'Conjuration', form: 'Self', magicka: 'varies', effect: 'Summons a spirit for 30*[Spell Level] minutes. (e.g., Ghost cost 25, Wraith cost 30).' },
  { name: 'Sunder Binding', school: 'Conjuration', form: 'Target', magicka: 'L*12', effect: 'Opposed Conjuration vs Willpower test to banish a Summoned or Bound character/item.' },

  // Destruction
  { name: 'Cloak of Fire', school: 'Destruction', form: 'Cloak', magicka: 'L*4', effect: '[Spell Level]d10 Fire Damage (Pen 5*[Spell Level])' },
  { name: 'Cloak of Frost', school: 'Destruction', form: 'Cloak', magicka: 'L*4', effect: '[Spell Level]d10 Frost Damage (Pen 5*[Spell Level])' },
  { name: 'Cloak of Lightning', school: 'Destruction', form: 'Cloak', magicka: 'L*4', effect: '[Spell Level]d10 Shock Damage (Pen 5*[Spell Level])' },
  { name: 'Cone of Fire', school: 'Destruction', form: 'Cone', magicka: 'L*8', effect: '[Spell Level]d10 Fire Damage (Pen 5*[Spell Level])' },
  { name: 'Cone of Frost', school: 'Destruction', form: 'Cone', magicka: 'L*8', effect: '[Spell Level]d10 Frost Damage (Pen 5*[Spell Level])' },
  { name: 'Cone of Lightning', school: 'Destruction', form: 'Cone', magicka: 'L*8', effect: '[Spell Level]d10 Shock Damage (Pen 5*[Spell Level])' },
  { name: 'Eat Armour', school: 'Destruction', form: 'Bolt', magicka: 'L*7', effect: 'Removes [Spell Level]d5 AR from armor on affected hit locations.' },
  { name: 'Eat Weapon', school: 'Destruction', form: 'Bolt', magicka: 'L*7', effect: 'Weapons held by target gain the Damaged([Spell Level]) quality.' },
  { name: 'Fireball', school: 'Destruction', form: 'Ball', magicka: 'L*4', effect: '[Spell Level]d10 Fire Damage (Pen 5*[Spell Level])' },
  { name: 'Fire Bite', school: 'Destruction', form: 'Touch', magicka: 'L*4', effect: '[Spell Level]d10 Fire Damage (Pen 5*[Spell Level])' },
  { name: 'Fire Bolt', school: 'Destruction', form: 'Bolt', magicka: 'L*4', effect: '[Spell Level]d10 Fire Damage (Pen 5*[Spell Level])' },
  { name: 'Fire Rune', school: 'Destruction', form: 'Rune', magicka: 'L*8', effect: '[Spell Level]d10 Fire Damage (Pen 5*[Spell Level])' },
  { name: 'Fire Storm', school: 'Destruction', form: 'Storm', magicka: 'L*16', effect: '[Spell Level]d10 Fire Damage (Pen 5*[Spell Level])' },
  { name: 'Frost Ball', school: 'Destruction', form: 'Ball', magicka: 'L*4', effect: '[Spell Level]d10 Frost Damage (Pen 5*[Spell Level])' },
  { name: 'Frostbite', school: 'Destruction', form: 'Touch', magicka: 'L*4', effect: '[Spell Level]d10 Frost Damage (Pen 5*[Spell Level])' },
  { name: 'Frost Bolt', school: 'Destruction', form: 'Bolt', magicka: 'L*4', effect: '[Spell Level]d10 Frost Damage (Pen 5*[Spell Level])' },
  { name: 'Frost Rune', school: 'Destruction', form: 'Rune', magicka: 'L*8', effect: '[Spell Level]d10 Frost Damage (Pen 5*[Spell Level])' },
  { name: 'Frost Storm', school: 'Destruction', form: 'Storm', magicka: 'L*16', effect: '[Spell Level]d10 Frost Damage (Pen 5*[Spell Level])' },
  { name: 'Lightning Ball', school: 'Destruction', form: 'Ball', magicka: 'L*4', effect: '[Spell Level]d10 Shock Damage (Pen 5*[Spell Level])' },
  { name: 'Lightning Bolt', school: 'Destruction', form: 'Bolt', magicka: 'L*4', effect: '[Spell Level]d10 Shock Damage (Pen 5*[Spell Level])' },
  { name: 'Chain-Lightning', school: 'Destruction', form: 'Bolt', magicka: 'L*8', effect: 'Arcs to everyone within [Spell Level]*5m. [Spell Level]d10 Shock Damage (Pen 5*[Spell Level])' },
  { name: 'Lightning Rune', school: 'Destruction', form: 'Rune', magicka: 'L*8', effect: '[Spell Level]d10 Shock Damage (Pen 5*[Spell Level])' },
  { name: 'Lightning Storm', school: 'Destruction', form: 'Storm', magicka: 'L*16', effect: '[Spell Level]d10 Shock Damage (Pen 5*[Spell Level])' },
  { name: 'Lightning Touch', school: 'Destruction', form: 'Touch', magicka: 'L*4', effect: '[Spell Level]d10 Shock Damage (Pen 5*[Spell Level])' },
  { name: 'Poison Bloom', school: 'Destruction', form: 'Varies', magicka: 'L*8', effect: 'Target makes End test; fails takes [Spell Level]d5 Poison Dmg (Ignores Armor). Passed takes half.' },
  { name: 'Poison Bolt', school: 'Destruction', form: 'Bolt', magicka: 'L*8', effect: '[Spell Level]d10 Poison Damage (Ignores Armor)' },
  { name: 'Poison Touch', school: 'Destruction', form: 'Touch', magicka: 'L*8', effect: '[Spell Level]d10 Poison Damage (Ignores Armor)' },
  { name: 'Flay Spirit', school: 'Destruction', form: 'Bolt', magicka: 'L*4', effect: 'Target loses 5*[Spell Level] magicka.' },
  { name: 'Sap Strength', school: 'Destruction', form: 'Bolt', magicka: 'L*10', effect: 'Target gains Damaged Strength (5*[Spell Level]) condition.' },
  { name: 'Sap Endurance', school: 'Destruction', form: 'Bolt', magicka: 'L*10', effect: 'Target gains Damaged Endurance (5*[Spell Level]) condition.' },
  { name: 'Sap Agility', school: 'Destruction', form: 'Bolt', magicka: 'L*10', effect: 'Target gains Damaged Agility (5*[Spell Level]) condition.' },
  { name: 'Sap Intelligence', school: 'Destruction', form: 'Bolt', magicka: 'L*10', effect: 'Target gains Damaged Intelligence (5*[Spell Level]) condition.' },
  { name: 'Sap Willpower', school: 'Destruction', form: 'Bolt', magicka: 'L*10', effect: 'Target gains Damaged Willpower (5*[Spell Level]) condition.' },
  { name: 'Sap Perception', school: 'Destruction', form: 'Bolt', magicka: 'L*10', effect: 'Target gains Damaged Perception (5*[Spell Level]) condition.' },
  { name: 'Sap Personality', school: 'Destruction', form: 'Bolt', magicka: 'L*10', effect: 'Target gains Damaged Personality (5*[Spell Level]) condition.' },
  { name: 'Sunbeam', school: 'Destruction', form: 'Target', magicka: 'L*15', effect: '[Spell Level]d10 Fire Dmg (Pen 5*[Spell Level]) with Sunlight quality.' },
  { name: 'Sunburst', school: 'Destruction', form: 'Wave', magicka: 'L*25', effect: '[Spell Level]d10 Fire Dmg (Pen 5*[Spell Level]) with Sunlight quality.' },
  { name: 'Wall of Fire', school: 'Destruction', form: 'Wall', magicka: 'L*24', effect: '[Spell Level]d10 Fire Damage (Pen 5*[Spell Level])' },
  { name: 'Wall of Frost', school: 'Destruction', form: 'Wall', magicka: 'L*24', effect: '[Spell Level]d10 Frost Damage (Pen 5*[Spell Level])' },
  { name: 'Wall of Lightning', school: 'Destruction', form: 'Wall', magicka: 'L*24', effect: '[Spell Level]d10 Shock Damage (Pen 5*[Spell Level])' },
  { name: 'Weakness to Fire', school: 'Destruction', form: 'Bolt', magicka: 'L*3', effect: 'Target gains Weakness (Fire, 10*[Spell Level]%) for 3 rounds.' },
  { name: 'Weakness to Frost', school: 'Destruction', form: 'Bolt', magicka: 'L*3', effect: 'Target gains Weakness (Frost, 10*[Spell Level]%) for 3 rounds.' },
  { name: 'Weakness to Magicka', school: 'Destruction', form: 'Bolt', magicka: 'L*6', effect: 'Target gains Weakness (Magic, 10*[Spell Level]%) for 3 rounds.' },
  { name: 'Weakness to Shock', school: 'Destruction', form: 'Bolt', magicka: 'L*3', effect: 'Target gains Weakness (Shock, 10*[Spell Level]%) for 3 rounds.' },
  { name: 'Weakness to Poison', school: 'Destruction', form: 'Bolt', magicka: 'L*3', effect: 'Target gains Weakness (Poison, 10*[Spell Level]%) for 3 rounds.' },
  { name: 'Weary', school: 'Destruction', form: 'Bolt', magicka: 'L*5', effect: 'Target gains [Spell Level] levels of fatigue.' },

  // Illusion
  { name: 'Blindness', school: 'Illusion', form: 'Target', magicka: 'L*9', effect: 'Target gains the Blind condition for [Spell Level] rounds.' },
  { name: 'Calming Touch', school: 'Illusion', form: 'Touch', magicka: 'L*12', effect: 'Target makes -10*[Spell Level] Willpower test to attack for 2 minutes.' },
  { name: 'Chameleon', school: 'Illusion', form: 'Self', magicka: 'L*15', effect: 'Target gains the chameleon ([Spell Level]) condition for 3 minutes.' },
  { name: 'Charming Touch', school: 'Illusion', form: 'Touch', magicka: 'L*6', effect: 'Charm tests against target within 2 minutes gain [Spell Level] DoS.' },
  { name: 'Concealment', school: 'Illusion', form: 'Self', magicka: 'L*25', effect: 'Target gains the Invisible condition for [Spell Level] minutes.' },
  { name: 'Frenzying Touch', school: 'Illusion', form: 'Touch', magicka: 'L*12', effect: 'Target makes -10*[Spell Level] Wp test to not attack for 2 minutes.' },
  { name: 'Illuminate Area', school: 'Illusion', form: 'Ball', magicka: 'L*10', effect: 'Illuminates target area for [Spell Level] minutes.' },
  { name: 'Night Eye', school: 'Illusion', form: 'Self', magicka: 'L*3', effect: 'Target gains the Dark Sight trait for [Spell Level] minutes.' },
  { name: 'Paralysis', school: 'Illusion', form: 'Bolt', magicka: 'L*10', effect: 'Target passes -20 Wp test or is paralyzed for [Spell Level] rounds.' },
  { name: 'Strike Fear', school: 'Illusion', form: 'Target', magicka: 'L*12', effect: 'Target must make a Fear (+30 - 10*[Spell Level]) test.' },
  { name: 'Sanctuary', school: 'Illusion', form: 'Self', magicka: 'L*7', effect: 'Attack tests against target suffer -5*[Spell Level] penalty for 1 minute.' },
  { name: 'Silence', school: 'Illusion', form: 'Bolt', magicka: 'L*5', effect: 'Target is silenced for [Spell Level] rounds.' },
  { name: 'Tread Lightly', school: 'Illusion', form: 'Self', magicka: 'L*6', effect: 'Target gains Muffled ([Spell Level]) condition for 3 minutes.' },

  // Mysticism
  { name: 'Dispel', school: 'Mysticism', form: 'Self', magicka: 10, effect: 'Removes any non-constant magic effects affecting the target. (Counts as Level 3 to learn.)' },
  { name: 'Ethereal Form', school: 'Mysticism', form: 'Self', magicka: 'L*10', effect: 'Target gains the Incorporeal trait for [Spell Level] minutes.' },
  { name: 'Magicka Leech', school: 'Mysticism', form: 'Bolt', magicka: 'L*2', effect: 'Target loses [Spell Level]*5 Magicka; Source gains that much.' },
  { name: 'Magicka Sight', school: 'Mysticism', form: 'Self', magicka: 'L*3', effect: 'Target gains Unnatural Senses (Magic, 25*[Spell Level]) for 1 minute.' },
  { name: 'Mark', school: 'Mysticism', form: 'Self', magicka: 10, effect: "Places an invisible, magic mark at target's location. (Counts as Level 3 to learn.)" },
  { name: 'Recall', school: 'Mysticism', form: 'Self', magicka: 25, effect: "Teleports willing target to one of the source's magic marks. (Counts as Level 3 to learn.)" },
  { name: 'Soul Trap', school: 'Mysticism', form: 'Bolt', magicka: 'L*4', effect: 'Target gains soul bound condition, linked to smallest available Soul Gem within 1m for [Spell Level] minutes.' },
  { name: 'Spell Drinker', school: 'Mysticism', form: 'Self', magicka: 'L*8', effect: 'Target gains Spell Absorption trait for [Spell Level] minutes.' },
  { name: 'Spell Mirror', school: 'Mysticism', form: 'Self', magicka: 'L*10', effect: 'Target gains Reflect ([Spell Level]) trait for 1 minute.' },
  { name: 'Spirit Sight', school: 'Mysticism', form: 'Self', magicka: 'L*3', effect: 'Target gains Unnatural Senses (Life, 25*[Spell Level]) for 1 minute.' },
  { name: 'Telekinesis', school: 'Mysticism', form: 'Target', magicka: 'L*9', effect: 'Moves object of [Spell Level] kg or less for up to 4 rounds.' },
  { name: 'Vampiric Drain', school: 'Mysticism', form: 'Bolt', magicka: 'L*7', effect: 'Target takes [Spell Level]d5 damage; Source removes trauma equal to amount dealt.' },

  // Restoration
  { name: 'Cure Disease', school: 'Restoration', form: 'Self', magicka: 15, effect: 'Cures target of any common diseases they are suffering from.' },
  { name: 'Cure Paralysis', school: 'Restoration', form: 'Self', magicka: 10, effect: 'Removes the paralyzed condition from the target.' },
  { name: 'Curing Touch', school: 'Restoration', form: 'Touch', magicka: 15, effect: 'Cures target of any common diseases they are suffering from.' },
  { name: 'Fortify Strength', school: 'Restoration', form: 'Self', magicka: 'L*15', effect: 'Target gains Fortified Strength (5*[Spell Level]) for 1 minute.' },
  { name: 'Fortify Endurance', school: 'Restoration', form: 'Self', magicka: 'L*15', effect: 'Target gains Fortified Endurance (5*[Spell Level]) for 1 minute.' },
  { name: 'Fortify Agility', school: 'Restoration', form: 'Self', magicka: 'L*15', effect: 'Target gains Fortified Agility (5*[Spell Level]) for 1 minute.' },
  { name: 'Fortify Intelligence', school: 'Restoration', form: 'Self', magicka: 'L*15', effect: 'Target gains Fortified Intelligence (5*[Spell Level]) for 1 minute.' },
  { name: 'Fortify Willpower', school: 'Restoration', form: 'Self', magicka: 'L*15', effect: 'Target gains Fortified Willpower (5*[Spell Level]) for 1 minute.' },
  { name: 'Fortify Perception', school: 'Restoration', form: 'Self', magicka: 'L*15', effect: 'Target gains Fortified Perception (5*[Spell Level]) for 1 minute.' },
  { name: 'Fortify Personality', school: 'Restoration', form: 'Self', magicka: 'L*15', effect: 'Target gains Fortified Personality (5*[Spell Level]) for 1 minute.' },
  { name: 'Heal', school: 'Restoration', form: 'Self', magicka: 'L*15', effect: 'Target removes 5*[Spell Level] trauma.' },
  { name: 'Healing Touch', school: 'Restoration', form: 'Touch', magicka: 'L*5', effect: 'Target removes 5*[Spell Level] trauma.' },
  { name: 'Rejuvenate', school: 'Restoration', form: 'Self', magicka: 'L*5', effect: 'Target removes [Spell Level] levels of fatigue.' },
  { name: 'Resistance to Fire', school: 'Restoration', form: 'Self', magicka: 'L*6', effect: 'Target gains Resistance (Fire, 10*[Spell Level]%) for 3 rounds.' },
  { name: 'Resistance to Frost', school: 'Restoration', form: 'Self', magicka: 'L*6', effect: 'Target gains Resistance (Frost, 10*[Spell Level]%) for 3 rounds.' },
  { name: 'Resistance to Magicka', school: 'Restoration', form: 'Self', magicka: 'L*12', effect: 'Target gains Resistance (Magic, 10*[Spell Level]%) for 3 rounds.' },
  { name: 'Resistance to Shock', school: 'Restoration', form: 'Self', magicka: 'L*6', effect: 'Target gains Resistance (Shock, 10*[Spell Level]%) for 3 rounds.' },
  { name: 'Resistance to Poison', school: 'Restoration', form: 'Self', magicka: 'L*6', effect: 'Target gains Resistance (Poison, 10*[Spell Level]%) for 3 rounds.' },
  { name: 'Restore Strength', school: 'Restoration', form: 'Self', magicka: 'L*10', effect: 'Reduces Damaged Strength (X) condition by 5*[Spell Level].' },
  { name: 'Restore Endurance', school: 'Restoration', form: 'Self', magicka: 'L*10', effect: 'Reduces Damaged Endurance (X) condition by 5*[Spell Level].' },
  { name: 'Restore Agility', school: 'Restoration', form: 'Self', magicka: 'L*10', effect: 'Reduces Damaged Agility (X) condition by 5*[Spell Level].' },
  { name: 'Restore Intelligence', school: 'Restoration', form: 'Self', magicka: 'L*10', effect: 'Reduces Damaged Intelligence (X) condition by 5*[Spell Level].' },
  { name: 'Restore Willpower', school: 'Restoration', form: 'Self', magicka: 'L*10', effect: 'Reduces Damaged Willpower (X) condition by 5*[Spell Level].' },
  { name: 'Restore Perception', school: 'Restoration', form: 'Self', magicka: 'L*10', effect: 'Reduces Damaged Perception (X) condition by 5*[Spell Level].' },
  { name: 'Restore Personality', school: 'Restoration', form: 'Self', magicka: 'L*10', effect: 'Reduces Damaged Personality (X) condition by 5*[Spell Level].' },
  { name: 'Turn Undead', school: 'Restoration', form: 'Bolt', magicka: 'L*5', effect: 'Undead target makes -10*[Spell Level] Wp test or flees for 1 round.' },
  { name: 'Ward', school: 'Restoration', form: 'Self', magicka: 'L*45', effect: 'Target gains Warded (2*[Spell Level]) trait for 3 rounds.' },
];

const SPELL_SCHOOL_ORDER = ['Alteration', 'Conjuration', 'Destruction', 'Illusion', 'Mysticism', 'Restoration'];

// Non-weapon items. `enc` null = "N/A" in the source table. `fixedPrice: true` means the item's tiers
// (soul gem size, ingredient grade, spell level) already bake in a quality-like scale, so the Quality
// panel is not applied to it.
const ITEM_QUALITY = [
  { name: 'Terrible',    cost: -0.50 },
  { name: 'Poor',        cost: -0.25 },
  { name: 'Common',      cost:  0 },
  { name: 'Expensive',   cost:  0.50 },
  { name: 'Extravagant', cost:  1.00 },
  { name: 'Exquisite',   cost:  2.00 },
];

const ITEMS = [
  // Clothing & Jewelry (all 0 ENC)
  { name: 'Cap/Hat', category: 'Clothing & Jewelry', enc: 0, cost: 6, extra: 'EL 25' },
  { name: 'Undergarments', category: 'Clothing & Jewelry', enc: 0, cost: 10, extra: 'EL 10' },
  { name: 'Shirt/Smock/Shift', category: 'Clothing & Jewelry', enc: 0, cost: 16, extra: 'EL 50' },
  { name: 'Vest/Tabard', category: 'Clothing & Jewelry', enc: 0, cost: 20, extra: 'EL 50' },
  { name: 'Trousers/Skirt/Kilt', category: 'Clothing & Jewelry', enc: 0, cost: 25, extra: 'EL 50' },
  { name: 'Tunic/Dress', category: 'Clothing & Jewelry', enc: 0, cost: 30, extra: 'EL 75' },
  { name: 'Coat/Cloak', category: 'Clothing & Jewelry', enc: 0, cost: 45, extra: 'EL 75' },
  { name: 'Winter Coat/Cloak', category: 'Clothing & Jewelry', enc: 0, cost: 75, extra: 'EL 75' },
  { name: 'Robes', category: 'Clothing & Jewelry', enc: 0, cost: 50, extra: 'EL 100' },
  { name: 'Sandals', category: 'Clothing & Jewelry', enc: 0, cost: 8, extra: 'EL 10' },
  { name: 'Shoes', category: 'Clothing & Jewelry', enc: 0, cost: 45, extra: 'EL 25' },
  { name: 'Boots', category: 'Clothing & Jewelry', enc: 0, cost: 50, extra: 'EL 25' },
  { name: 'Ring', category: 'Clothing & Jewelry', enc: 0, cost: 200, extra: 'EL 150' },
  { name: 'Necklace/Amulet', category: 'Clothing & Jewelry', enc: 0, cost: 400, extra: 'EL 150' },

  // Tools & Gear
  { name: 'Abacus', category: 'Tools & Gear', enc: 1, cost: 8 },
  { name: 'Bedroll', category: 'Tools & Gear', enc: 1, cost: 2 },
  { name: 'Bit & Bridle', category: 'Tools & Gear', enc: 1, cost: 15 },
  { name: 'Block & Tackle', category: 'Tools & Gear', enc: 1, cost: 15 },
  { name: 'Bottle', category: 'Tools & Gear', enc: 0, cost: 2 },
  { name: 'Candle', category: 'Tools & Gear', enc: 0, cost: 1 },
  { name: 'Chain (2 meters)', category: 'Tools & Gear', enc: 1, cost: 40 },
  { name: 'Chest (small, holds 15 ENC)', category: 'Tools & Gear', enc: 3, cost: 40 },
  { name: 'Chest (large, holds 30 ENC)', category: 'Tools & Gear', enc: 6, cost: 80 },
  { name: 'Cooking Pot', category: 'Tools & Gear', enc: 2, cost: 3 },
  { name: 'Craft Tools', category: 'Tools & Gear', enc: 2, cost: 75 },
  { name: 'Crowbar', category: 'Tools & Gear', enc: 1, cost: 25 },
  { name: "Falconer's Kit", category: 'Tools & Gear', enc: 1, cost: 30 },
  { name: 'First Aid Kit (10 uses)', category: 'Tools & Gear', enc: 0, cost: 25 },
  { name: 'Fish Hooks (20)', category: 'Tools & Gear', enc: 0, cost: 1 },
  { name: 'Fishing Kit', category: 'Tools & Gear', enc: 1, cost: 15 },
  { name: 'Fishing Net', category: 'Tools & Gear', enc: 4, cost: 10 },
  { name: 'Flint and Tinder', category: 'Tools & Gear', enc: 0, cost: 1 },
  { name: 'Game Snare/Trap', category: 'Tools & Gear', enc: 1, cost: 1 },
  { name: 'Grappling Hook', category: 'Tools & Gear', enc: 0, cost: 5 },
  { name: 'Hammer/Saw/Mallet/Chisel', category: 'Tools & Gear', enc: 1, cost: 1 },
  { name: "Healer's Kit (10 uses)", category: 'Tools & Gear', enc: 1, cost: 150 },
  { name: 'Hourglass', category: 'Tools & Gear', enc: 1, cost: 20 },
  { name: 'Knife (tool, not weapon)', category: 'Tools & Gear', enc: 0, cost: 5 },
  { name: 'Ladder (rope, 3 meters)', category: 'Tools & Gear', enc: 4, cost: 2 },
  { name: 'Lantern', category: 'Tools & Gear', enc: 1, cost: 10 },
  { name: 'Lock Picks', category: 'Tools & Gear', enc: 0, cost: 75 },
  { name: 'Milling Stone', category: 'Tools & Gear', enc: 2, cost: 8 },
  { name: 'Mirror (hand, glass)', category: 'Tools & Gear', enc: 1, cost: 12 },
  { name: 'Mug/Beaker/Dish/Plate (wood)', category: 'Tools & Gear', enc: 0, cost: 1 },
  { name: 'Mug/Beaker/Dish/Plate (metal)', category: 'Tools & Gear', enc: 0, cost: 2 },
  { name: 'Nails or Tacks (50)', category: 'Tools & Gear', enc: 0, cost: 1 },
  { name: 'Oil Flask', category: 'Tools & Gear', enc: 1, cost: 1 },
  { name: 'Pack (holds 20 ENC)', category: 'Tools & Gear', enc: 2, cost: 6 },
  { name: 'Papyrus or Paper sheet (5)', category: 'Tools & Gear', enc: 0, cost: 1 },
  { name: 'Pickaxe', category: 'Tools & Gear', enc: 1, cost: 35 },
  { name: 'Pole (3 meters)', category: 'Tools & Gear', enc: 1, cost: 1 },
  { name: 'Quill and Ink', category: 'Tools & Gear', enc: 1, cost: 30 },
  { name: 'Quiver (holds 30 shots)', category: 'Tools & Gear', enc: 0, cost: 2 },
  { name: 'Razor, folding', category: 'Tools & Gear', enc: 0, cost: 3 },
  { name: 'Rope (hemp, 10 meters)', category: 'Tools & Gear', enc: 2, cost: 10 },
  { name: 'Sack (small, holds 30 ENC)', category: 'Tools & Gear', enc: 0, cost: 2 },
  { name: 'Sack (large, holds 60 ENC)', category: 'Tools & Gear', enc: 1, cost: 5 },
  { name: 'Saddle (riding)', category: 'Tools & Gear', enc: 3, cost: 60 },
  { name: 'Saddle (war)', category: 'Tools & Gear', enc: 4, cost: 90 },
  { name: 'Saddlebag (holds 2x20 ENC)', category: 'Tools & Gear', enc: 2, cost: 20 },
  { name: 'Saw (hand)', category: 'Tools & Gear', enc: 1, cost: 1 },
  { name: 'Scythe/Sickle', category: 'Tools & Gear', enc: 2, cost: 30 },
  { name: "Ship's Compass", category: 'Tools & Gear', enc: 1, cost: 70 },
  { name: 'Shoes (horse)', category: 'Tools & Gear', enc: 1, cost: 10 },
  { name: 'Spade/Hoe/Pitchfork', category: 'Tools & Gear', enc: 1, cost: 25 },
  { name: 'Tent (per person capacity)', category: 'Tools & Gear', enc: 1, cost: 6 },
  { name: 'Torch (1 hour) (x3)', category: 'Tools & Gear', enc: 0, cost: 1 },
  { name: 'Torch (6 hours)', category: 'Tools & Gear', enc: 1, cost: 1 },
  { name: 'Waterskin/Canteen (2 liters)', category: 'Tools & Gear', enc: 1, cost: 1 },
  { name: 'Vial (alchemical, 1 potion)', category: 'Tools & Gear', enc: 0, cost: 3 },

  // Arcane Items
  { name: 'Blank, magically prepared scroll', category: 'Blank Scrolls', enc: 0, cost: 3 },

  { name: 'Petty Soul Gem (Empty)', category: 'Soul Gems (Empty)', enc: 0, cost: 50, extra: 'Max Energy 100', fixedPrice: true },
  { name: 'Lesser Soul Gem (Empty)', category: 'Soul Gems (Empty)', enc: 0, cost: 125, extra: 'Max Energy 250', fixedPrice: true },
  { name: 'Common Soul Gem (Empty)', category: 'Soul Gems (Empty)', enc: 0, cost: 250, extra: 'Max Energy 500', fixedPrice: true },
  { name: 'Greater Soul Gem (Empty)', category: 'Soul Gems (Empty)', enc: 0, cost: 500, extra: 'Max Energy 1000', fixedPrice: true },
  { name: 'Grand Soul Gem (Empty)', category: 'Soul Gems (Empty)', enc: 0, cost: 1250, extra: 'Max Energy 1500', fixedPrice: true },
  { name: 'Black Soul Gem (Empty)', category: 'Soul Gems (Empty)', enc: 0, cost: 1750, extra: 'Max Energy 1500', fixedPrice: true },

  { name: 'Spell Tome (Level 1)', category: 'Spell Tomes', enc: 0, cost: 25, fixedPrice: true },
  { name: 'Spell Tome (Level 2)', category: 'Spell Tomes', enc: 0, cost: 50, fixedPrice: true },
  { name: 'Spell Tome (Level 3)', category: 'Spell Tomes', enc: 0, cost: 75, fixedPrice: true },
  { name: 'Spell Tome (Level 4)', category: 'Spell Tomes', enc: 0, cost: 100, fixedPrice: true },
  { name: 'Spell Tome (Level 5)', category: 'Spell Tomes', enc: 0, cost: 150, fixedPrice: true },
  { name: 'Spell Tome (Level 6)', category: 'Spell Tomes', enc: 0, cost: 300, fixedPrice: true },

  // Books
  { name: 'Book', category: 'Books', enc: 0, cost: 16 },
];

const ITEM_CATEGORY_ORDER = [
  'Clothing & Jewelry',
  'Tools & Gear',
  'Blank Scrolls',
  'Soul Gems (Empty)',
  'Spell Tomes',
  'Books',
];
