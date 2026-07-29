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

QUALITY.forEach((q) => buildChip(qualityContainer, q.name, q.name));
MATERIAL_NAMES.forEach((m) => buildChip(materialContainer, m, m));

CATEGORY_ORDER.forEach((category) => {
  const group = document.createElement('details');
  group.className = 'item-group';
  const summary = document.createElement('summary');
  summary.textContent = category;
  group.appendChild(summary);

  const grid = document.createElement('div');
  grid.className = 'chip-grid';
  WEAPONS.filter((w) => w.category === category).forEach((w) => {
    buildChip(grid, w.name, w.name);
  });
  group.appendChild(grid);
  itemGroups.appendChild(group);
});

itemSearch.addEventListener('input', () => {
  const term = itemSearch.value.trim().toLowerCase();
  itemGroups.querySelectorAll('.chip').forEach((chip) => {
    const label = chip.textContent.trim().toLowerCase();
    chip.style.display = label.includes(term) ? '' : 'none';
  });
});

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
