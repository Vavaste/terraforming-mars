import { TerraformingMarsCard, GameSettings, CardValuation } from "./types";

/**
 * Resource values in MC equivalents (per unit)
 *
 * Based on standard project costs and community analysis:
 * - Steel: 2 MC (building discount)
 * - Titanium: 3 MC (space discount)
 * - Plants: variable (8 plants = greenery = 1VP + potential TR)
 * - Energy: ~1.625 MC (converts to heat, which 8 = 1 temp step = 1 TR)
 * - Heat: ~1.625 MC (8 heat = 1 temp step = 1 TR)
 * - TR: ~10 MC (1VP at end + MC income each remaining gen)
 * - 1 VP: ~13 MC (baseline from standard project analysis)
 */

const VP_VALUE_MC = 13; // baseline MC cost per VP
const TR_BASE_VP_VALUE = 13; // TR is worth 1VP at end of game

function getResourceValueMC(
  resource: string,
  settings: GameSettings
): number {
  switch (resource) {
    case "megacredits":
      return 1;
    case "steel":
      return settings.steelDiscount;
    case "titanium":
      return settings.titaniumDiscount;
    case "plants":
      // 8 plants = 1 greenery = 1VP + (1 TR if oxygen available)
      if (settings.oxygenAvailable) {
        return (VP_VALUE_MC + TR_BASE_VP_VALUE) / 8; // ~3.25 MC
      }
      return VP_VALUE_MC / 8; // ~1.625 MC
    case "energy":
      // Energy converts to heat, and 8 heat = 1 temp = 1 TR
      if (settings.temperatureAvailable) {
        return TR_BASE_VP_VALUE / 8; // ~1.625 MC
      }
      return 0.5; // minimal value if temp maxed
    case "heat":
      if (settings.temperatureAvailable) {
        return TR_BASE_VP_VALUE / 8; // ~1.625 MC
      }
      return 0.5;
    default:
      return 1;
  }
}

function getProductionValuePerGen(
  resource: string,
  settings: GameSettings
): number {
  const baseValue = getResourceValueMC(resource, settings);
  if (resource === "megacredits") return 1; // MC production is 1:1
  return baseValue;
}

/**
 * Calculate the total MC value of production over remaining generations
 */
function calcProductionValue(
  card: TerraformingMarsCard,
  settings: GameSettings
): number {
  const prod = card.effects.production;
  if (!prod) return 0;

  let totalValue = 0;
  const gens = settings.generationsRemaining;

  for (const [resource, amount] of Object.entries(prod)) {
    if (amount === undefined || amount === 0) continue;
    const valuePerGen = getProductionValuePerGen(resource, settings);
    totalValue += amount * valuePerGen * gens;
  }

  return totalValue;
}

/**
 * Calculate value of immediate resource gains
 */
function calcImmediateResourceValue(
  card: TerraformingMarsCard,
  settings: GameSettings
): number {
  const res = card.effects.resources;
  if (!res) return 0;

  let total = 0;
  for (const [resource, amount] of Object.entries(res)) {
    if (amount === undefined || amount === 0) continue;
    total += amount * getResourceValueMC(resource, settings);
  }

  // Card draws
  if (card.effects.drawCards) {
    // Drawing a card is worth ~3 MC (cost to keep) but average card value is higher
    total += card.effects.drawCards * 3;
  }

  return total;
}

/**
 * Calculate TR value (1VP at end + MC income per remaining gen)
 */
function calcTRValue(
  card: TerraformingMarsCard,
  settings: GameSettings
): number {
  const tr = card.effects.tr || 0;
  if (tr === 0) return 0;

  // TR gives: 1VP at game end (worth 13 MC) + 1 MC per remaining generation
  return tr * (VP_VALUE_MC + settings.generationsRemaining);
}

/**
 * Calculate VP value at end of game
 */
function calcVPValue(card: TerraformingMarsCard): number {
  let vpTotal = 0;

  if (card.effects.vp) {
    vpTotal += card.effects.vp;
  }

  // Variable VP is harder to calculate; use conservative estimates
  if (card.effects.vpPerResource) {
    // Assume ~6 resources accumulated over the game
    const estimatedResources = 6;
    vpTotal += Math.floor(estimatedResources / card.effects.vpPerResource.per);
  }

  if (card.effects.vpPerTag) {
    // Assume ~4 matching tags
    const estimatedTags = 4;
    vpTotal += Math.floor(estimatedTags / card.effects.vpPerTag.per);
  }

  return vpTotal * VP_VALUE_MC;
}

/**
 * Calculate value of global parameter changes (temperature, oxygen, oceans)
 */
function calcGlobalParameterValue(
  card: TerraformingMarsCard,
  settings: GameSettings
): number {
  let value = 0;

  // Temperature steps: each raises TR by 1 (if available)
  if (card.effects.temperatureSteps && settings.temperatureAvailable) {
    value += card.effects.temperatureSteps * (VP_VALUE_MC + settings.generationsRemaining);
  }

  // Oxygen steps: each raises TR by 1 (if available)
  if (card.effects.oxygenSteps && settings.oxygenAvailable) {
    value += card.effects.oxygenSteps * (VP_VALUE_MC + settings.generationsRemaining);
  }

  // Ocean tiles: each raises TR by 1 + placement bonuses (~2 MC average)
  if (card.effects.oceanTiles && settings.oceansAvailable) {
    value += card.effects.oceanTiles * (VP_VALUE_MC + settings.generationsRemaining + 2);
  }

  // Greenery tiles: 1 VP + oxygen step
  if (card.effects.greeneryTiles) {
    value += card.effects.greeneryTiles * VP_VALUE_MC; // VP from greenery
    if (settings.oxygenAvailable) {
      value += card.effects.greeneryTiles * (VP_VALUE_MC + settings.generationsRemaining); // TR from oxygen
    }
  }

  // City tiles: worth ~1-3 VP from adjacency (estimate 2 VP average)
  if (card.effects.cityTiles) {
    value += card.effects.cityTiles * (2 * VP_VALUE_MC);
  }

  return value;
}

/**
 * Calculate card discount value over remaining generations
 */
function calcCardDiscountValue(
  card: TerraformingMarsCard,
  settings: GameSettings
): number {
  if (!card.effects.cardDiscount) return 0;
  // Assume ~2.5 cards played per generation on average
  const cardsPerGen = 2.5;
  return card.effects.cardDiscount * cardsPerGen * settings.generationsRemaining;
}

/**
 * Tag-based value: having tags helps with requirements and synergies
 * Estimate ~1 MC per tag as base synergy value
 */
function calcTagValue(card: TerraformingMarsCard): number {
  return card.tags.length * 1;
}

/**
 * Calculate the generation at which a card breaks even
 */
function calcBreakevenGeneration(
  card: TerraformingMarsCard,
  settings: GameSettings
): number | null {
  const prod = card.effects.production;
  if (!prod) return null;

  // Calculate per-generation production value
  let prodPerGen = 0;
  for (const [resource, amount] of Object.entries(prod)) {
    if (amount === undefined || amount === 0) continue;
    prodPerGen += amount * getProductionValuePerGen(resource, settings);
  }

  if (prodPerGen <= 0) return null;

  // Immediate gains offset the cost
  const immValue = calcImmediateResourceValue(card, settings);
  const trValue = calcTRValue(card, settings);
  const vpValue = calcVPValue(card);
  const globalValue = calcGlobalParameterValue(card, settings);
  const nonProductionValue = immValue + trValue + vpValue + globalValue;

  const netCost = card.cost - nonProductionValue;
  if (netCost <= 0) return 0; // Immediately profitable

  const breakevenGen = Math.ceil(netCost / prodPerGen);
  return breakevenGen;
}

function getRating(netValue: number): string {
  if (netValue >= 20) return "S";
  if (netValue >= 10) return "A";
  if (netValue >= 3) return "B";
  if (netValue >= -3) return "C";
  if (netValue >= -10) return "D";
  return "F";
}

/**
 * Main valuation function: evaluates a card given the current game state
 */
export function evaluateCard(
  card: TerraformingMarsCard,
  settings: GameSettings
): CardValuation {
  const productionValue = calcProductionValue(card, settings);
  const immediateResourceValue = calcImmediateResourceValue(card, settings);
  const trValue = calcTRValue(card, settings);
  const vpValue = calcVPValue(card);
  const globalParameterValue = calcGlobalParameterValue(card, settings);
  const cardDiscountValue = calcCardDiscountValue(card, settings);
  const tagValue = calcTagValue(card);

  const totalValue =
    productionValue +
    immediateResourceValue +
    trValue +
    vpValue +
    globalParameterValue +
    cardDiscountValue +
    tagValue;

  const costMC = card.cost;
  const netValue = totalValue - costMC;
  const breakevenGeneration = calcBreakevenGeneration(card, settings);

  return {
    card,
    totalValue: Math.round(totalValue * 10) / 10,
    costMC,
    netValue: Math.round(netValue * 10) / 10,
    rating: getRating(netValue),
    breakdown: {
      productionValue: Math.round(productionValue * 10) / 10,
      immediateResourceValue: Math.round(immediateResourceValue * 10) / 10,
      trValue: Math.round(trValue * 10) / 10,
      vpValue: Math.round(vpValue * 10) / 10,
      globalParameterValue: Math.round(globalParameterValue * 10) / 10,
      cardDiscountValue: Math.round(cardDiscountValue * 10) / 10,
      tagValue: Math.round(tagValue * 10) / 10,
    },
    breakevenGeneration,
  };
}
