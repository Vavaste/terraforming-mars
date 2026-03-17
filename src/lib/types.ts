export type CardType = "event" | "automated" | "active" | "prelude";
export type Tag = "building" | "space" | "power" | "science" | "plant" | "microbe" | "animal" | "city" | "earth" | "jovian" | "venus" | "wild";
export type ResourceType = "megacredits" | "steel" | "titanium" | "plants" | "energy" | "heat";
export type Expansion = "base" | "corporate_era" | "prelude" | "venus" | "colonies" | "turmoil";

export interface Production {
  megacredits?: number;
  steel?: number;
  titanium?: number;
  plants?: number;
  energy?: number;
  heat?: number;
}

export interface CardEffect {
  production?: Production;
  tr?: number;
  resources?: Partial<Record<ResourceType, number>>;
  drawCards?: number;
  oceanTiles?: number;
  temperatureSteps?: number;
  oxygenSteps?: number;
  greeneryTiles?: number;
  cityTiles?: number;
  removeResources?: Partial<Record<ResourceType, number>>;
  // For active cards - per action/trigger
  actionProduction?: Production;
  actionResources?: Partial<Record<ResourceType, number>>;
  cardDiscount?: number;
  // VP
  vp?: number;
  vpPerResource?: { resource: string; per: number };
  vpPerTag?: { tag: string; per: number };
  vpPer2Resources?: { resource: string };
  description?: string;
}

export interface Requirement {
  minTemperature?: number;
  maxTemperature?: number;
  minOxygen?: number;
  maxOxygen?: number;
  minOceans?: number;
  maxOceans?: number;
  minProduction?: Partial<Record<ResourceType, number>>;
  tag?: { tag: string; count: number };
}

export interface TerraformingMarsCard {
  id: number;
  name: string;
  cost: number;
  type: CardType;
  tags: Tag[];
  expansion: Expansion;
  requirements?: Requirement;
  effects: CardEffect;
  cardNumber: string;
}

export interface GameSettings {
  generationsRemaining: number;
  totalGenerations: number;
  currentTemperature: number; // -30 to +8 in 2°C steps
  currentOxygen: number; // 0 to 14%
  currentOceans: number; // 0 to 9
  steelDiscount: number; // MC value of steel (default 2)
  titaniumDiscount: number; // MC value of titanium (default 3)
}

/** Derived helpers for GameSettings */
export function isTemperatureMaxed(s: GameSettings): boolean {
  return s.currentTemperature >= 8;
}
export function isOxygenMaxed(s: GameSettings): boolean {
  return s.currentOxygen >= 14;
}
export function isOceansMaxed(s: GameSettings): boolean {
  return s.currentOceans >= 9;
}

export interface CardValuation {
  card: TerraformingMarsCard;
  totalValue: number;
  costMC: number;
  netValue: number;
  rating: string;
  breakdown: {
    productionValue: number;
    immediateResourceValue: number;
    trValue: number;
    vpValue: number;
    globalParameterValue: number;
    cardDiscountValue: number;
    tagValue: number;
    requirementPenalty: number;
  };
  breakevenGeneration: number | null;
}

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  generationsRemaining: 7,
  totalGenerations: 12,
  currentTemperature: -30,
  currentOxygen: 0,
  currentOceans: 0,
  steelDiscount: 2,
  titaniumDiscount: 3,
};
