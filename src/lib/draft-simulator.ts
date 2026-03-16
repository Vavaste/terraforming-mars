import { TerraformingMarsCard, GameSettings, CardValuation } from "./types";
import { evaluateCard } from "./valuation";

const DRAFT_COST_PER_CARD = 3; // MC to keep each card
const DRAFT_HAND_SIZE = 10;

export interface DraftResult {
  drawnCards: TerraformingMarsCard[];
  bestHand: DraftHand;
  allCombinations: DraftHand[];
  keepAll: DraftHand;
  keepNone: DraftHand;
}

export interface DraftHand {
  kept: CardValuation[];
  discarded: CardValuation[];
  totalKeepCost: number;
  totalNetValue: number;
  synergies: SynergyBonus[];
  score: number;
}

export interface SynergyBonus {
  description: string;
  bonus: number;
}

/**
 * Draw N random cards from the pool
 */
export function drawCards(
  allCards: TerraformingMarsCard[],
  count: number = DRAFT_HAND_SIZE
): TerraformingMarsCard[] {
  const shuffled = [...allCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Calculate synergy bonus between cards in a hand.
 * Cards that share tags or have complementary effects get bonuses.
 */
function calcSynergies(cards: TerraformingMarsCard[], settings: GameSettings): SynergyBonus[] {
  const synergies: SynergyBonus[] = [];
  if (cards.length <= 1) return synergies;

  // Count tags in the hand
  const tagCounts: Record<string, number> = {};
  for (const card of cards) {
    for (const tag of card.tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }

  // Tag concentration bonus: multiple cards with same tag = synergy
  for (const [tag, count] of Object.entries(tagCounts)) {
    if (count >= 3) {
      synergies.push({
        description: `Concentrazione ${tag} (${count} carte)`,
        bonus: (count - 2) * 3,
      });
    }
  }

  // Production chain: cards that produce resources other cards need
  const producesEnergy = cards.some(
    (c) => c.effects.production?.energy && c.effects.production.energy > 0
  );
  const needsEnergy = cards.some(
    (c) => c.effects.production?.energy && c.effects.production.energy < 0
  );
  if (producesEnergy && needsEnergy) {
    synergies.push({ description: "Catena energetica", bonus: 4 });
  }

  // Plant engine: multiple plant production cards
  const plantProdCards = cards.filter(
    (c) => c.effects.production?.plants && c.effects.production.plants > 0
  );
  if (plantProdCards.length >= 2) {
    synergies.push({
      description: `Motore piante (${plantProdCards.length} carte)`,
      bonus: plantProdCards.length * 2,
    });
  }

  // MC engine
  const mcProdCards = cards.filter(
    (c) => c.effects.production?.megacredits && c.effects.production.megacredits > 0
  );
  if (mcProdCards.length >= 3) {
    synergies.push({
      description: `Motore economico (${mcProdCards.length} carte)`,
      bonus: mcProdCards.length * 1.5,
    });
  }

  // Card discount + many cards synergy
  const discountCards = cards.filter((c) => c.effects.cardDiscount && c.effects.cardDiscount > 0);
  if (discountCards.length > 0 && cards.length >= 6) {
    const totalDiscount = discountCards.reduce((s, c) => s + (c.effects.cardDiscount || 0), 0);
    synergies.push({
      description: `Sconto carte (${totalDiscount} MC/carta su ${cards.length} carte)`,
      bonus: totalDiscount * (cards.length - discountCards.length) * 0.5,
    });
  }

  // Space tag discount synergy
  const spaceCards = cards.filter((c) => c.tags.includes("space"));
  const hasSpaceDiscount = cards.some(
    (c) => c.effects.description?.toLowerCase().includes("space") &&
           c.effects.description?.toLowerCase().includes("less")
  );
  if (hasSpaceDiscount && spaceCards.length >= 3) {
    synergies.push({
      description: `Sinergia spaziale (${spaceCards.length} carte space con sconto)`,
      bonus: spaceCards.length * 2,
    });
  }

  // Microbe engine
  const microbeCards = cards.filter((c) => c.tags.includes("microbe"));
  if (microbeCards.length >= 3) {
    synergies.push({
      description: `Motore microbi (${microbeCards.length} carte)`,
      bonus: microbeCards.length * 2,
    });
  }

  // Animal engine
  const animalCards = cards.filter((c) => c.tags.includes("animal"));
  if (animalCards.length >= 2) {
    synergies.push({
      description: `Sinergia animali (${animalCards.length} carte)`,
      bonus: animalCards.length * 2.5,
    });
  }

  return synergies;
}

/**
 * Evaluate a hand of kept cards vs discarded cards
 */
function evaluateHand(
  kept: TerraformingMarsCard[],
  discarded: TerraformingMarsCard[],
  settings: GameSettings
): DraftHand {
  const keptValuations = kept.map((c) => evaluateCard(c, settings));
  const discardedValuations = discarded.map((c) => evaluateCard(c, settings));
  const keepCost = kept.length * DRAFT_COST_PER_CARD;
  const synergies = calcSynergies(kept, settings);
  const synergyBonus = synergies.reduce((s, b) => s + b.bonus, 0);

  // Net value = sum of card net values - keep cost + synergy bonus
  const totalNetValue =
    keptValuations.reduce((s, v) => s + v.netValue, 0) -
    keepCost +
    synergyBonus;

  return {
    kept: keptValuations,
    discarded: discardedValuations,
    totalKeepCost: keepCost,
    totalNetValue: Math.round(totalNetValue * 10) / 10,
    synergies,
    score: Math.round(totalNetValue * 10) / 10,
  };
}

/**
 * Generate all viable combinations and find the best hand.
 * With 10 cards, 2^10 = 1024 combinations - totally manageable.
 */
export function simulateDraft(
  drawnCards: TerraformingMarsCard[],
  settings: GameSettings
): DraftResult {
  const n = drawnCards.length;
  const allCombinations: DraftHand[] = [];

  // Generate all 2^n subsets
  const totalCombinations = 1 << n;
  for (let mask = 0; mask < totalCombinations; mask++) {
    const kept: TerraformingMarsCard[] = [];
    const discarded: TerraformingMarsCard[] = [];

    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        kept.push(drawnCards[i]);
      } else {
        discarded.push(drawnCards[i]);
      }
    }

    allCombinations.push(evaluateHand(kept, discarded, settings));
  }

  // Sort by score descending
  allCombinations.sort((a, b) => b.score - a.score);

  // Best hand
  const bestHand = allCombinations[0];

  // Keep all
  const keepAll = evaluateHand(drawnCards, [], settings);

  // Keep none
  const keepNone = evaluateHand([], drawnCards, settings);

  return {
    drawnCards,
    bestHand,
    allCombinations: allCombinations.slice(0, 20), // Top 20
    keepAll,
    keepNone,
  };
}
