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
 * Calculate TR value for EXPLICIT TR gains (1VP at end + MC income per remaining gen).
 * NOTE: TR from temperature/oxygen/ocean changes is already counted in calcGlobalParameterValue.
 * The card.effects.tr field should only contain ADDITIONAL TR beyond what global parameter
 * changes provide (e.g., Nitrogen-Rich Asteroid gives +2 TR in addition to its temp step).
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
 * Calculate a penalty for cards with play requirements.
 *
 * Requirements reduce a card's practical value because:
 * 1. You may not be able to play the card when drawn (timing risk)
 * 2. You lose flexibility - the card is dead in hand until conditions are met
 * 3. Stricter requirements = higher chance the card is never playable
 *
 * Penalty scale (in MC):
 * - Global parameter minimums: scaled by how restrictive the threshold is
 *   Ocean: 0-9 scale, each ocean ~2 MC penalty (6 oceans = -12 MC)
 *   Temperature: -30 to +8, each 2°C step ~1.5 MC penalty
 *   Oxygen: 0-14%, each % ~1.5 MC penalty
 * - Global parameter maximums: steeper penalty (window closes fast)
 * - Tag requirements: -3 MC per required tag (need specific strategy)
 * - Production requirements: -3 MC per production requirement
 */
function calcRequirementPenalty(
  card: TerraformingMarsCard,
  settings: GameSettings
): number {
  const req = card.requirements;
  if (!req) return 0;

  let penalty = 0;

  // --- MIN requirements on global parameters ---
  // The higher the minimum, the later you can play it = bigger penalty

  if (req.minOceans !== undefined && req.minOceans > 0) {
    // 9 oceans total. Each ocean required = ~2 MC penalty
    // Scale: 1-2 oceans = mild, 3-4 = moderate, 5+ = severe
    penalty += req.minOceans * 2;
  }

  if (req.minTemperature !== undefined) {
    // Temperature ranges from -30°C to +8°C in 2°C steps (19 steps)
    // Convert to steps from minimum: (-30 is step 0, +8 is step 19)
    const tempStepsFromMin = (req.minTemperature - (-30)) / 2;
    if (tempStepsFromMin > 0) {
      penalty += tempStepsFromMin * 1.2;
    }
  }

  if (req.minOxygen !== undefined && req.minOxygen > 0) {
    // Oxygen ranges from 0% to 14% (14 steps)
    penalty += req.minOxygen * 1.5;
  }

  // --- MAX requirements (ceiling constraints) ---
  // These are especially punishing because the window CLOSES as the game progresses
  // If you draw the card late, it may already be unplayable

  if (req.maxTemperature !== undefined) {
    // The lower the max, the smaller the window to play it
    const stepsFromMax = (8 - req.maxTemperature) / 2;
    if (stepsFromMax > 0) {
      penalty += stepsFromMax * 1.5;
    }
  }

  if (req.maxOxygen !== undefined) {
    const stepsFromMax = 14 - req.maxOxygen;
    if (stepsFromMax > 0) {
      penalty += stepsFromMax * 1.5;
    }
  }

  if (req.maxOceans !== undefined) {
    const stepsFromMax = 9 - req.maxOceans;
    if (stepsFromMax > 0) {
      penalty += stepsFromMax * 2;
    }
  }

  // --- Tag requirements ---
  // Need specific tags = need specific strategy/cards already played
  if (req.tag) {
    penalty += req.tag.count * 3;
  }

  // --- Production requirements ---
  if (req.minProduction) {
    for (const [, amount] of Object.entries(req.minProduction)) {
      if (amount !== undefined && amount > 0) {
        penalty += amount * 3;
      }
    }
  }

  // Scale penalty slightly by how late in the game we are:
  // Early game = requirements are more punishing (more uncertainty)
  // Late game = you know if you can play it or not, less penalty
  const gameProgressFactor = settings.generationsRemaining / settings.totalGenerations;
  // Range: 0.6 (late game) to 1.0 (early game)
  const timingMultiplier = 0.6 + 0.4 * gameProgressFactor;

  return Math.round(penalty * timingMultiplier * 10) / 10;
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
  const requirementPenalty = calcRequirementPenalty(card, settings);

  const totalValue =
    productionValue +
    immediateResourceValue +
    trValue +
    vpValue +
    globalParameterValue +
    cardDiscountValue +
    tagValue -
    requirementPenalty;

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
      requirementPenalty: Math.round(requirementPenalty * 10) / 10,
    },
    breakevenGeneration,
  };
}
