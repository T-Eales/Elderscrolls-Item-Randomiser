const qualityContainer = document.getElementById('quality-options');
const materialContainer = document.getElementById('material-options');
const enchantContainer = document.getElementById('enchant-options');
const itemGroups = document.getElementById('item-groups');
const itemSearch = document.getElementById('item-search');
const output = document.getElementById('output');
const hint = document.getElementById('hint');

const MATERIAL_NAMES = Object.keys(MATERIALS_MELEE);

function buildChip(container, value, label) {
  const chip = document.createElement('label');
  chip.className = 'chip';
  chip.innerHTML = `<input type="checkbox" value="${value}" /> ${label}`;
  container.appendChild(chip);
}

// Renders one <details> per category, each holding a chip-grid of matching entries.
function buildGroupedChips(container, order, list, categoryField) {
  order.forEach((category) => {
    const group = document.createElement('details');
    group.className = 'item-group';
    const summary = document.createElement('summary');
    summary.textContent = category;
    group.appendChild(summary);

    const grid = document.createElement('div');
    grid.className = 'chip-grid';
    list.filter((entry) => entry[categoryField] === category).forEach((entry) => {
      buildChip(grid, entry.name, entry.name);
    });
    group.appendChild(grid);
    container.appendChild(group);
  });
}

function bindGroupSearch(searchInput, groupsContainer) {
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.trim().toLowerCase();
    groupsContainer.querySelectorAll('.chip').forEach((chip) => {
      const label = chip.textContent.trim().toLowerCase();
      chip.style.display = label.includes(term) ? '' : 'none';
    });
  });
}

QUALITY.forEach((q) => buildChip(qualityContainer, q.name, q.name));
MATERIAL_NAMES.forEach((m) => buildChip(materialContainer, m, m));

buildGroupedChips(itemGroups, CATEGORY_ORDER, WEAPONS, 'category');

bindGroupSearch(itemSearch, itemGroups);

function getChecked(container) {
  return [...container.querySelectorAll('input:checked')].map((i) => i.value);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatSigned(n) {
  if (n > 0) return `+${n}`;
  if (n < 0) return `${n}`;
  return '';
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

// Levels 1-4 add 25% each, levels 5-6 add 50% each, all on top of the post-quality cost.
function enchantmentCostMultiplier(level) {
  const steppedLevels = Math.min(level, 4);
  const boostedLevels = Math.max(0, level - 4);
  const percent = steppedLevels * 0.25 + boostedLevels * 0.50;
  return 1 + percent;
}

function randomise() {
  hint.textContent = '';

  const allowedQualityNames = getChecked(qualityContainer);
  const qualityPool = allowedQualityNames.length
    ? QUALITY.filter((q) => allowedQualityNames.includes(q.name))
    : QUALITY;

  const allowedEnchant = getChecked(enchantContainer);
  const enchantPool = allowedEnchant.length ? allowedEnchant : ['Mundane', 'Enchanted'];

  const allowedItemNames = getChecked(itemGroups);
  const itemPool = allowedItemNames.length
    ? WEAPONS.filter((w) => allowedItemNames.includes(w.name))
    : WEAPONS;

  const allowedMaterialNames = getChecked(materialContainer);

  if (itemPool.length === 0) {
    hint.textContent = 'No items match your current filters.';
    return;
  }

  const item = pickRandom(itemPool);
  const quality = pickRandom(qualityPool);
  const enchantment = pickRandom(enchantPool);

  const materialTable = item.kind === 'melee' ? MATERIALS_MELEE : MATERIALS_RANGED;
  const validMaterialNames = Object.keys(materialTable);
  let materialPool = allowedMaterialNames.length
    ? allowedMaterialNames.filter((m) => validMaterialNames.includes(m))
    : validMaterialNames;

  if (materialPool.length === 0) {
    materialPool = validMaterialNames;
    hint.textContent = 'None of your selected materials have data for this weapon type — picked from all materials instead.';
  }

  const materialName = pickRandom(materialPool);
  const material = materialTable[materialName];

  const enchantLevel = enchantment === 'Enchanted' ? 1 + Math.floor(Math.random() * 6) : null;

  renderResult({ item, quality, enchantment, enchantLevel, materialName, material });
}

function renderResult({ item, quality, enchantment, enchantLevel, materialName, material }) {
  const qualitiesSet = new Set(item.qualities);
  if (quality.trait) qualitiesSet.add(quality.trait);
  if (item.kind === 'melee' && material.qualities) {
    material.qualities.forEach((q) => qualitiesSet.add(q));
  }
  const qualitiesText = [...qualitiesSet].join(', ');

  let damageText = 'None';
  if (item.dice) {
    const matDam = item.kind === 'melee' ? material.dam : 0;
    const totalFlat = item.flat + matDam;
    damageText = `${item.dice}${formatSigned(totalFlat)} ${item.type}`.trim();
  }

  let penText = 'None';
  if (item.pen !== null) {
    const matPen = item.kind === 'melee' ? material.pen : 0;
    penText = `${item.pen + matPen}`;
  }

  let rangeRow;
  if (item.kind === 'melee') {
    rangeRow = `<div class="stat-row"><span>Size</span><strong>${item.s}</strong></div>
      <div class="stat-row"><span>Reach</span><strong>${item.r}</strong></div>`;
  } else {
    const rangeMod = material.range || 0;
    const medium = item.range[1] + rangeMod;
    const long = medium * 2;
    rangeRow = `<div class="stat-row"><span>Range (S/M/L)</span><strong>${item.range[0]}/${medium}/${long}</strong></div>`;
  }

  let costText;
  if (item.cost === null) {
    costText = 'Special (SC)';
  } else {
    let cost = item.cost * material.costMulti * (1 + quality.cost);
    if (enchantLevel) cost *= enchantmentCostMultiplier(enchantLevel);
    costText = round2(cost).toString();
  }

  const enchantmentText = enchantLevel ? `Enchanted (Level ${enchantLevel})` : 'Mundane';

  output.innerHTML = `
    <h3 class="result-title">${quality.name} ${materialName} ${item.name}</h3>
    <div class="stat-row"><span>Enchantment</span><strong>${enchantmentText}</strong></div>
    <div class="stat-row"><span>Damage</span><strong>${damageText}</strong></div>
    <div class="stat-row"><span>Pen</span><strong>${penText}</strong></div>
    ${rangeRow}
    <div class="stat-row"><span>WPC</span><strong>${item.wpc}</strong></div>
    <div class="stat-row"><span>Qualities</span><strong>${qualitiesText || 'None'}</strong></div>
    <div class="stat-row"><span>Cost</span><strong>${costText}</strong></div>
  `;
}

async function copyResult() {
  const text = output.innerText.trim();
  if (!text || output.querySelector('.placeholder')) {
    hint.textContent = 'Nothing to copy yet — randomise first.';
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    hint.textContent = 'Copied to clipboard.';
  } catch (err) {
    hint.textContent = 'Could not copy automatically — select and copy manually.';
  }
}

document.getElementById('randomise-btn').addEventListener('click', randomise);
document.getElementById('copy-btn').addEventListener('click', copyResult);

// --- Tabs ---

document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.remove('active'));
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  });
});

// --- Items ---

const itemQualityContainer = document.getElementById('item-quality-options');
const miscItemGroups = document.getElementById('misc-item-groups');
const miscItemSearch = document.getElementById('misc-item-search');
const itemOutput = document.getElementById('item-output');
const itemHint = document.getElementById('item-hint');

ITEM_QUALITY.forEach((q) => buildChip(itemQualityContainer, q.name, q.name));
buildGroupedChips(miscItemGroups, ITEM_CATEGORY_ORDER, ITEMS, 'category');
bindGroupSearch(miscItemSearch, miscItemGroups);

function randomiseItem() {
  itemHint.textContent = '';

  const allowedQualityNames = getChecked(itemQualityContainer);
  const qualityPool = allowedQualityNames.length
    ? ITEM_QUALITY.filter((q) => allowedQualityNames.includes(q.name))
    : ITEM_QUALITY;

  const allowedItemNames = getChecked(miscItemGroups);
  const itemPool = allowedItemNames.length
    ? ITEMS.filter((i) => allowedItemNames.includes(i.name))
    : ITEMS;

  if (itemPool.length === 0) {
    itemHint.textContent = 'No items match your current filters.';
    return;
  }

  const item = pickRandom(itemPool);
  const quality = pickRandom(qualityPool);

  const itemName = item.fixedPrice ? item.name : `${quality.name} ${item.name}`;
  const cost = item.fixedPrice ? item.cost : round2(item.cost * (1 + quality.cost));
  const qualityText = item.fixedPrice ? 'Fixed (inherent to tier)' : quality.name;
  const encText = item.enc === null ? 'N/A' : item.enc;

  itemOutput.innerHTML = `
    <h3 class="result-title">${itemName}</h3>
    <div class="stat-row"><span>Quality</span><strong>${qualityText}</strong></div>
    <div class="stat-row"><span>ENC</span><strong>${encText}</strong></div>
    ${item.extra ? `<div class="stat-row"><span>Detail</span><strong>${item.extra}</strong></div>` : ''}
    <div class="stat-row"><span>Cost</span><strong>${cost}</strong></div>
  `;
}

async function copyItemResult() {
  const text = itemOutput.innerText.trim();
  if (!text || itemOutput.querySelector('.placeholder')) {
    itemHint.textContent = 'Nothing to copy yet — randomise first.';
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    itemHint.textContent = 'Copied to clipboard.';
  } catch (err) {
    itemHint.textContent = 'Could not copy automatically — select and copy manually.';
  }
}

document.getElementById('item-randomise-btn').addEventListener('click', randomiseItem);
document.getElementById('item-copy-btn').addEventListener('click', copyItemResult);

// --- Spell Scrolls ---

const levelContainer = document.getElementById('level-options');
const spellGroups = document.getElementById('spell-groups');
const spellSearch = document.getElementById('spell-search');
const scrollOutput = document.getElementById('scroll-output');
const scrollHint = document.getElementById('scroll-hint');

SPELL_LEVELS.forEach((lvl) => buildChip(levelContainer, lvl.name, lvl.name));
buildGroupedChips(spellGroups, SPELL_SCHOOL_ORDER, SPELLS, 'school');
bindGroupSearch(spellSearch, spellGroups);

// Computes the magicka cost for a spell at a given level: a flat number, a level multiplier
// formula like 'L*20', or null for the handful of 'varies' spells (see their effect text instead).
function computeMagicka(formula, level) {
  if (typeof formula === 'number') return formula;
  if (formula === 'varies') return null;
  const match = /^L\*([\d.]+)$/.exec(formula);
  return match ? Math.round(level * parseFloat(match[1])) : null;
}

// Substitutes "[Spell Level]" placeholders in an effect description with the rolled level,
// evaluating simple "N*[Spell Level]" products and "[Spell Level]dN" dice notation along the way.
function renderEffect(template, level) {
  return template
    .replace(/\[Spell Level\]d(\d+)/g, (_, n) => `${level}d${n}`)
    .replace(/(\d+(?:\.\d+)?)\s*\*\s*\[Spell Level\]/g, (_, n) => `${Math.round(parseFloat(n) * level)}`)
    .replace(/\[Spell Level\]\s*\*\s*(\d+(?:\.\d+)?)/g, (_, n) => `${Math.round(level * parseFloat(n))}`)
    .replace(/\[Spell Level\]/g, `${level}`);
}

function randomiseScroll() {
  scrollHint.textContent = '';

  const allowedLevelNames = getChecked(levelContainer);
  const levelPool = allowedLevelNames.length
    ? SPELL_LEVELS.filter((l) => allowedLevelNames.includes(l.name))
    : SPELL_LEVELS;

  const allowedSpellNames = getChecked(spellGroups);
  const spellPool = allowedSpellNames.length
    ? SPELLS.filter((s) => allowedSpellNames.includes(s.name))
    : SPELLS;

  if (spellPool.length === 0) {
    scrollHint.textContent = 'No spells match your current filters.';
    return;
  }

  const level = pickRandom(levelPool);
  const spell = pickRandom(spellPool);
  const scrollName = level.prefix ? `${level.prefix} ${spell.name}` : spell.name;

  const magicka = computeMagicka(spell.magicka, level.level);
  const magickaText = magicka === null ? 'Varies (see effect)' : magicka;
  const effectText = renderEffect(spell.effect, level.level);

  scrollOutput.innerHTML = `
    <h3 class="result-title">${scrollName}</h3>
    <div class="stat-row"><span>Level</span><strong>${level.name}</strong></div>
    <div class="stat-row"><span>School</span><strong>${spell.school}</strong></div>
    <div class="stat-row"><span>Form</span><strong>${spell.form}</strong></div>
    <div class="stat-row"><span>Magicka Cost</span><strong>${magickaText}</strong></div>
    <div class="stat-row"><span>XP to Learn</span><strong>${level.xp}</strong></div>
    <p class="effect-text">${effectText}</p>
  `;
}

async function copyScrollResult() {
  const text = scrollOutput.innerText.trim();
  if (!text || scrollOutput.querySelector('.placeholder')) {
    scrollHint.textContent = 'Nothing to copy yet — randomise first.';
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    scrollHint.textContent = 'Copied to clipboard.';
  } catch (err) {
    scrollHint.textContent = 'Could not copy automatically — select and copy manually.';
  }
}

document.getElementById('scroll-randomise-btn').addEventListener('click', randomiseScroll);
document.getElementById('scroll-copy-btn').addEventListener('click', copyScrollResult);
