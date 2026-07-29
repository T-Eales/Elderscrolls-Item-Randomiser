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
